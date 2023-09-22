/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/macros/field/FieldRuntime", "sap/ui/core/Core", "sap/ui/core/mvc/ControllerExtension", "../CommonUtils", "../helpers/ClassSupport"], function (Log, FieldRuntime, Core, ControllerExtension, CommonUtils, ClassSupport) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _class, _class2;

  var publicExtension = ClassSupport.publicExtension;
  var privateExtension = ClassSupport.privateExtension;
  var methodOverride = ClassSupport.methodOverride;
  var finalExtension = ClassSupport.finalExtension;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var SideEffectsControllerExtension = (_dec = defineUI5Class("sap.fe.core.controllerextensions.SideEffects"), _dec2 = methodOverride(), _dec3 = publicExtension(), _dec4 = finalExtension(), _dec5 = publicExtension(), _dec6 = finalExtension(), _dec7 = publicExtension(), _dec8 = finalExtension(), _dec9 = publicExtension(), _dec10 = finalExtension(), _dec11 = publicExtension(), _dec12 = finalExtension(), _dec13 = publicExtension(), _dec14 = finalExtension(), _dec15 = publicExtension(), _dec16 = finalExtension(), _dec17 = publicExtension(), _dec18 = finalExtension(), _dec19 = publicExtension(), _dec20 = finalExtension(), _dec21 = privateExtension(), _dec22 = finalExtension(), _dec23 = publicExtension(), _dec24 = finalExtension(), _dec25 = publicExtension(), _dec26 = finalExtension(), _dec(_class = (_class2 = /*#__PURE__*/function (_ControllerExtension) {
    _inheritsLoose(SideEffectsControllerExtension, _ControllerExtension);

    function SideEffectsControllerExtension() {
      return _ControllerExtension.apply(this, arguments) || this;
    }

    var _proto = SideEffectsControllerExtension.prototype;

    _proto.onInit = function onInit() {
      this._oView = this.base.getView();
      this._oAppComponent = CommonUtils.getAppComponent(this._oView);
      this._oSideEffectsService = this._oAppComponent.getSideEffectsService();
      this._mFieldGroupQueue = {};
      this._aSourcePropertiesFailure = new Set();
      this._mFailedSideEffects = {};
    }
    /**
     * Clear recorded validation status for all properties.
     *
     * @function
     * @name clearPropertiesStatus
     */
    ;

    _proto.clearPropertiesStatus = function clearPropertiesStatus() {
      this._aSourcePropertiesFailure.clear();
    }
    /**
     * Gets failed SideEffects.
     *
     * @function
     * @name getRegisteredFailedRequests
     * @returns Registered SideEffects requests that have failed
     */
    ;

    _proto.getRegisteredFailedRequests = function getRegisteredFailedRequests() {
      return this._mFailedSideEffects;
    };

    _proto.deleteFailedRequestsForAContext = function deleteFailedRequestsForAContext(contextPath) {
      delete this._mFailedSideEffects[contextPath];
    }
    /**
     * Manages the workflow for SideEffects with related changes to a field
     * The following scenarios are managed:
     *  - Execute: triggers immediate SideEffects requests if the promise for the field event is fulfilled
     *  - Register: caches deferred SideEffects that will be executed when the FieldGroup is unfocused.
     *
     * @function
     * @name handleFieldChange
     * @param oEvent SAPUI5 event that comes from a field change
     * @param oFieldGroupPreRequisite Promise to be fulfilled before executing deferred SideEffects
     * @returns  Promise on SideEffects request(s)
     */
    ;

    _proto.handleFieldChange = function handleFieldChange(oEvent, oFieldGroupPreRequisite) {
      var _this = this;

      var mEventFieldProperties = this._getFieldProperties(oEvent),
          aImmediateSideEffectsProperties = this._initializeFieldSideEffects(mEventFieldProperties, oFieldGroupPreRequisite);

      var bIsImmediateTriggered = false;
      return this._generateImmediatePromise(mEventFieldProperties).then(function () {
        bIsImmediateTriggered = true;
        return Promise.all(aImmediateSideEffectsProperties.map(function (mSideEffectsProperty) {
          return _this.requestSideEffects(mSideEffectsProperty.sideEffects, mSideEffectsProperty.context);
        }) || []);
      }).catch(function (oError) {
        if (bIsImmediateTriggered) {
          Log.debug("Error while processing Field SideEffects", oError);
        } else {
          /**
           * SideEffects have not been triggered since preRequisite validation fails so we need
           * to keep previously failed request as Failed request (to be retrigger on next change)
           */
          aImmediateSideEffectsProperties.filter(function (mImmediateSideEffects) {
            return mImmediateSideEffects.previouslyFailed === true;
          }).forEach(function (mImmediateSideEffects) {
            _this._addFailedSideEffects(mImmediateSideEffects.sideEffects, mImmediateSideEffects.context);
          });
        }
      });
    }
    /**
     * Manages SideEffects with a related 'focus out' to a field group.
     *
     * @function
     * @name handleFieldGroupChange
     * @param oEvent SAPUI5 Event
     * @returns Promise on SideEffects request(s)
     */
    ;

    _proto.handleFieldGroupChange = function handleFieldGroupChange(oEvent) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var that = this,
          aDeferredSideEffects = [],
          aFieldGroupIds = oEvent.getParameter("fieldGroupIds");

      var getFieldGroupRequestPromise = function (oDeferredSideEffect) {
        var bIsRequestsTriggered = false;
        var oSideEffectProperty = oDeferredSideEffect.sideEffectProperty;
        var oContext = oSideEffectProperty.context;
        var sContextPath = oContext.getPath();

        var sEntityType = that._oSideEffectsService.getEntityTypeFromContext(oContext);

        var mEntityType = that._getEntityTypeFromFQN(sEntityType);

        return Promise.all(oDeferredSideEffect.promises).then(function () {
          bIsRequestsTriggered = true; //Deferred SideEffects are executed only if all sourceProperties have no registered failure.

          if (mEntityType && oSideEffectProperty.sideEffects.SourceProperties.every(function (sourceProperty) {
            if (sourceProperty.type === "PropertyPath") {
              var sId = that._generateStatusIndex(mEntityType, sourceProperty.value, oContext);

              if (sId) {
                return !that._aSourcePropertiesFailure.has(sId);
              }
            }

            return true;
          })) {
            return that.requestSideEffects(oSideEffectProperty.sideEffects, oSideEffectProperty.context);
          }

          return null;
        }).catch(function (oError) {
          if (bIsRequestsTriggered) {
            Log.debug("Error while processing FieldGroup SideEffects on context ".concat(sContextPath), oError);
          }
        }).finally(function () {
          delete that._mFieldGroupQueue[oSideEffectProperty.name][sContextPath];
        });
      };

      aFieldGroupIds.forEach(function (sFieldGroupId) {
        var _that$_mFieldGroupQue;

        /**
         * string "$$ImmediateRequest" is added to the SideEffects name during templating to know
         * if this SideEffects must be immediately executed requested (on field change) or must
         * be deferred (on field group focus out)
         *
         */
        var sSideEffectName = sFieldGroupId.replace("$$ImmediateRequest", "");
        var mContextDeferredSideEffects = (_that$_mFieldGroupQue = that._mFieldGroupQueue) === null || _that$_mFieldGroupQue === void 0 ? void 0 : _that$_mFieldGroupQue[sSideEffectName];

        if (mContextDeferredSideEffects) {
          Object.keys(mContextDeferredSideEffects).forEach(function (sContextPath) {
            var oDeferredSideEffect = mContextDeferredSideEffects[sContextPath];

            if (!oDeferredSideEffect.processStarted) {
              oDeferredSideEffect.processStarted = true;
              aDeferredSideEffects.push(oDeferredSideEffect);
            }
          });
        }
      });
      return Promise.all(aDeferredSideEffects.map(function (oDeferredSideEffect) {
        return getFieldGroupRequestPromise(oDeferredSideEffect);
      }));
    }
    /**
     * Adds a SideEffects control.
     *
     * @function
     * @name addControlSideEffects
     * @param sEntityType Name of the entity where the SideEffects control will be registered
     * @param oSideEffects SideEffects to register. Ensure the sourceControlId matches the associated SAPUI5 control ID.
     */
    ;

    _proto.addControlSideEffects = function addControlSideEffects(sEntityType, oSideEffects) {
      this._oSideEffectsService.addControlSideEffects(sEntityType, oSideEffects);
    }
    /**
     * Removes the queue containing the failed SideEffects.
     *
     * @function
     * @name removeFailedSideEffects
     */
    ;

    _proto.removeFailedSideEffects = function removeFailedSideEffects() {
      this._mFailedSideEffects = {};
    }
    /**
     * Request SideEffects on a specific context.
     *
     * @function
     * @name requestSideEffects
     * @param oSideEffects SideEffects to be executed
     * @param oContext Context where SideEffects need to be executed
     * @param groupId
     * @param fnGetTargets The callback function which will give us the targets and actions if it was coming through some specific handling.
     * @returns SideEffects request on SAPUI5 context
     */
    ;

    _proto.requestSideEffects = function requestSideEffects(oSideEffects, oContext, groupId, fnGetTargets) {
      try {
        var _this3 = this;

        function _temp3() {
          if (sTriggerAction) {
            _this3._oSideEffectsService.executeAction(sTriggerAction, oContext, groupId);
          }

          return aTargets.length ? _this3._oSideEffectsService.requestSideEffects(aTargets, oContext, groupId).catch(function (oError) {
            _this3._addFailedSideEffects(oSideEffects, oContext);

            return Promise.reject(oError);
          }) : Promise.resolve();
        }

        var aTargets, sTriggerAction;

        var _temp4 = function () {
          if (fnGetTargets) {
            return Promise.resolve(fnGetTargets(oSideEffects)).then(function (targetsAndActionData) {
              aTargets = targetsAndActionData["aTargets"];
              sTriggerAction = targetsAndActionData["TriggerAction"];
            });
          } else {
            aTargets = (oSideEffects.TargetEntities || []).concat(oSideEffects.TargetProperties || []);
            sTriggerAction = oSideEffects.TriggerAction;
          }
        }();

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    }
    /**
     * Removes SideEffects created by a control.
     *
     * @function
     * @name removeControlSideEffects
     * @param oControl SAPUI5 Control
     */
    ;

    _proto.removeControlSideEffects = function removeControlSideEffects(oControl) {
      var sControlId = oControl && oControl.isA && oControl.isA("sap.ui.base.ManagedObject") && oControl.getId();

      if (sControlId) {
        this._oSideEffectsService.removeControlSideEffects(sControlId);
      }
    }
    /**
     * Adds SideEffects to the queue of the failed SideEffects
     * The SideEffects will be retriggered on the next change on the same context.
     *
     * @function
     * @name _addFailedSideEffects
     * @param oSideEffects SideEffects that need to be retriggered
     * @param oContext Context where SideEffects have failed
     */
    ;

    _proto._addFailedSideEffects = function _addFailedSideEffects(oSideEffects, oContext) {
      var sContextPath = oContext.getPath();
      this._mFailedSideEffects[sContextPath] = this._mFailedSideEffects[sContextPath] || [];

      var bIsNotAlreadyListed = this._mFailedSideEffects[sContextPath].every(function (mFailedSideEffects) {
        return oSideEffects.fullyQualifiedName !== mFailedSideEffects.fullyQualifiedName;
      });

      if (bIsNotAlreadyListed) {
        this._mFailedSideEffects[sContextPath].push(oSideEffects);
      }
    }
    /**
     * Generates the promise for the field group that is required before requesting SideEffects.
     * If the promise is rejected and only the field requires the SideEffects on this context, the SideEffects are removed from the
     * SideEffects queue.
     *
     * @function
     * @name _generateFieldGroupPromise
     * @param mEventFieldProperties Field properties
     * @returns Promise to be used for the validation of the field
     */
    ;

    _proto._generateFieldGroupPromise = function _generateFieldGroupPromise(mEventFieldProperties) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      var that = this;
      var bPromiseSuccess = true;
      return mEventFieldProperties.promise.then(function () {
        return bPromiseSuccess;
      }).catch(function () {
        bPromiseSuccess = false;
        return bPromiseSuccess;
      }).finally(function () {
        /**
         * Need to store the status of properties related to this field for deferred SideEffects
         * since all SourceProperties for this kind of SideEffects must be valid
         */
        that._saveFieldPropertiesStatus(mEventFieldProperties.field, bPromiseSuccess);
      });
    }
    /**
     * Generates the promise for the field that is required before requesting immediate SideEffects.
     *
     * @function
     * @name _generateImmediatePromise
     * @param mEventFieldProperties Field properties
     * @returns Promise to be used for the validation of the field
     */
    ;

    _proto._generateImmediatePromise = function _generateImmediatePromise(mEventFieldProperties) {
      var oPromise = mEventFieldProperties.promise;
      return oPromise.then(function () {
        /**
         * If the field gets a FieldHelper, we need to wait until all fields changed by this FieldHelper have been set.
         * To achieve this, we ensure that all related bindings have been resolved.
         *
         * This resolution process is not managed by the Field Event Promise, so for fast user actions (like automation) it can lock the model
         * and no request can be executed.
         */
        var oField = mEventFieldProperties.field;
        var sFieldHelperId = oField.getFieldHelp && oField.getFieldHelp();

        if (sFieldHelperId) {
          var oFilterHelp = Core.byId(sFieldHelperId);

          if (oFilterHelp && oFilterHelp.getOutParameters) {
            return Promise.all(oFilterHelp.getOutParameters().map(function (oOutParameter) {
              var oBinding = oOutParameter.getBinding("value");
              return oBinding ? oBinding.requestValue() : Promise.resolve();
            }));
          }
        }

        return Promise.all([]);
      });
    }
    /**
     * Generates a status index.
     *
     * @function
     * @name _generateStatusIndex
     * @param mEntityType The entity type
     * @param sPropertyPath The property path
     * @param oContext SAPUI5 Context
     * @returns Index
     */
    ;

    _proto._generateStatusIndex = function _generateStatusIndex(mEntityType, sPropertyPath, oContext) {
      var sContextPath = oContext === null || oContext === void 0 ? void 0 : oContext.getPath();
      var mProperty = mEntityType.resolvePath(sPropertyPath);

      if (mProperty) {
        if (mProperty && mProperty._type === "Property") {
          return [mProperty.fullyQualifiedName, sContextPath].join("__");
        }
      }

      return undefined;
    }
    /**
     * Gets the appropriate context on which SideEffects can be requested.
     *  The correct one must have the binding parameter $$patchWithoutSideEffects.
     *
     * @param oBindingContext
     * @param sSideEffectEntityType
     * @returns SAPUI5 Context or undefined
     */
    ;

    _proto.getContextForSideEffects = function getContextForSideEffects(oBindingContext, sSideEffectEntityType) {
      var oContextForSideEffects = oBindingContext,
          sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oBindingContext);

      if (sSideEffectEntityType !== sEntityType) {
        oContextForSideEffects = oBindingContext.getBinding().getContext();

        if (oContextForSideEffects) {
          sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oContextForSideEffects);

          if (sSideEffectEntityType !== sEntityType) {
            oContextForSideEffects = oContextForSideEffects.getBinding().getContext();

            if (oContextForSideEffects) {
              sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oContextForSideEffects);

              if (sSideEffectEntityType !== sEntityType) {
                return undefined;
              }
            }
          }
        }
      }

      return oContextForSideEffects || undefined;
    }
    /**
     * Retrieves the EntityType based on its fully-qualified name.
     *
     * @param sFullyQualifiedName The fully-qualified name
     * @returns The entity type
     */
    ;

    _proto._getEntityTypeFromFQN = function _getEntityTypeFromFQN(sFullyQualifiedName) {
      return this._oSideEffectsService.getConvertedMetaModel().entityTypes.find(function (oEntityType) {
        return oEntityType.fullyQualifiedName === sFullyQualifiedName;
      });
    }
    /**
     * Gets the promise of the field validation that is required for the SideEffects process.
     *
     * @function
     * @name _getFieldPromise
     * @param oEvent Field change event
     * @returns Field promise
     */
    ;

    _proto._getFieldPromise = function _getFieldPromise(oEvent) {
      var promise = oEvent.getParameter("promise") || Promise.resolve();
      var validity = FieldRuntime.getFieldStateOnChange(oEvent).state.validity;
      return promise.then(function () {
        return new Promise(function (resolve, reject) {
          if (!validity) {
            reject();
          } else {
            resolve(true);
          }
        });
      });
    }
    /**
     * Gets the properties of the field that are required for the SideEffects process.
     *
     * @function
     * @name _getFieldProperties
     * @param oEvent Field change event
     * @returns Field properties (event change promise, field, SideEffects related to this field)
     */
    ;

    _proto._getFieldProperties = function _getFieldProperties(oEvent) {
      var oField = oEvent.getSource();
      return {
        promise: this._getFieldPromise(oEvent),
        field: oField,
        sideEffectsMap: this._getFieldSideEffectsMap(oField)
      };
    }
    /**
     * Gets the SideEffects map
     * These SideEffects are
     * - listed into FieldGroupIds (coming from an OData Service)
     * - generated by a control or controls and that configure this field as SourceProperties.
     *
     * @function
     * @name _getFieldSideEffectsMap
     * @param oField Field
     * @returns SideEffects map
     */
    ;

    _proto._getFieldSideEffectsMap = function _getFieldSideEffectsMap(oField) {
      var mSideEffectsMap = {};

      var aFieldGroupIds = oField.getFieldGroupIds(),
          sViewEntitySetSetName = this._oView.getViewData().entitySet,
          oViewEntitySet = this._oSideEffectsService.getConvertedMetaModel().entitySets.find(function (oEntitySet) {
        return oEntitySet.name === sViewEntitySetSetName;
      }); // SideEffects coming from an OData Service


      mSideEffectsMap = this.generateSideEffectsMapFromSideEffectId(aFieldGroupIds, oField); //SideEffects coming from control(s)

      if (sViewEntitySetSetName && oViewEntitySet) {
        var sViewEntityType = oViewEntitySet.entityType.fullyQualifiedName,
            mFieldPath = oField.getAggregation("customData").find(function (oCustomData) {
          return oCustomData.getKey() === "sourcePath";
        }),
            oContext = this.getContextForSideEffects(oField.getBindingContext(), sViewEntityType);

        if (mFieldPath && oContext) {
          var sFieldPath = mFieldPath.getValue().replace("/".concat(sViewEntitySetSetName, "/"), ""),
              mControlEntityType = this._oSideEffectsService.getControlEntitySideEffects(sViewEntityType);

          Object.keys(mControlEntityType).forEach(function (sControlName) {
            var oControlSideEffects = mControlEntityType[sControlName];

            if (oControlSideEffects.SourceProperties.includes(sFieldPath)) {
              var sName = "".concat(sControlName, "::").concat(sViewEntityType);
              mSideEffectsMap[sName] = {
                name: sName,
                immediate: true,
                sideEffects: oControlSideEffects,
                context: oContext
              };
            }
          });
        }
      }

      return mSideEffectsMap;
    }
    /**
     * Get side effect Name, sideeffect obj and entity type from a given fieldGroupId.
     *
     * @param sFieldGroupId
     * @returns Data about sideeffect name, entitytype, side effect object and if it is immediate.
     */
    ;

    _proto._getDataToGenerateSideEffectsMapFromSideEffectId = function _getDataToGenerateSideEffectsMapFromSideEffectId(sFieldGroupId) {
      var _this$_oSideEffectsSe;

      var bIsImmediate = sFieldGroupId.indexOf("$$ImmediateRequest") !== -1,
          sName = sFieldGroupId.replace("$$ImmediateRequest", ""),
          aSideEffectParts = sName.split("#"),
          sSideEffectEntityType = aSideEffectParts[0],
          sSideEffectPath = "".concat(sSideEffectEntityType, "@com.sap.vocabularies.Common.v1.SideEffects").concat(aSideEffectParts.length === 2 ? "#".concat(aSideEffectParts[1]) : ""),
          oSideEffect = (_this$_oSideEffectsSe = this._oSideEffectsService.getODataEntitySideEffects(sSideEffectEntityType)) === null || _this$_oSideEffectsSe === void 0 ? void 0 : _this$_oSideEffectsSe[sSideEffectPath];
      return {
        sName: sName,
        bIsImmediate: bIsImmediate,
        oSideEffect: oSideEffect,
        sSideEffectEntityType: sSideEffectEntityType
      };
    }
    /**
     * Generate the side effects map from id which is the entity and qualifier
     * for the given entity.
     *
     * @function
     * @param aFieldGroupIds
     * @param oField
     * @returns Side effect map with data
     */
    ;

    _proto.generateSideEffectsMapFromSideEffectId = function generateSideEffectsMapFromSideEffectId(aFieldGroupIds, oField) {
      var _this4 = this;

      var mSideEffectsMap = {};
      aFieldGroupIds.forEach(function (sFieldGroupId) {
        var _this4$_getDataToGene = _this4._getDataToGenerateSideEffectsMapFromSideEffectId(sFieldGroupId),
            sName = _this4$_getDataToGene.sName,
            bIsImmediate = _this4$_getDataToGene.bIsImmediate,
            oSideEffect = _this4$_getDataToGene.oSideEffect,
            sSideEffectEntityType = _this4$_getDataToGene.sSideEffectEntityType;

        var oContext = oField ? _this4.getContextForSideEffects(oField.getBindingContext(), sSideEffectEntityType) : undefined;

        if (oSideEffect && (!oField || oField && oContext)) {
          mSideEffectsMap[sName] = {
            name: sName,
            immediate: bIsImmediate,
            sideEffects: oSideEffect
          };

          if (oField) {
            mSideEffectsMap[sName].context = oContext;
          }
        }
      });
      return mSideEffectsMap;
    }
    /**
     * Manages the SideEffects with related changes to a field
     * List: gets immediate SideEffects requests
     * Register: caches deferred SideEffects that will be executed when the FieldGroup is unfocused.
     *
     * @function
     * @name _initializeFieldSideEffects
     * @param mEventFieldProperties Field event properties
     * @param oFieldGroupPreRequisite Promise to be fulfilled before executing deferred SideEffects
     * @returns  Array of immediate SideEffects
     */
    ;

    _proto._initializeFieldSideEffects = function _initializeFieldSideEffects(mEventFieldProperties, oFieldGroupPreRequisite) {
      var _this5 = this;

      var mFieldSideEffectsMap = mEventFieldProperties.sideEffectsMap,
          oFieldPromiseForFieldGroup = this._generateFieldGroupPromise(mEventFieldProperties),
          // Promise managing FieldGroup requests if Field promise fails
      mFailedSideEffectsName = {},
          aImmediateSideEffectsProperties = [];

      oFieldGroupPreRequisite = oFieldGroupPreRequisite || Promise.resolve();
      Object.keys(mFieldSideEffectsMap).forEach(function (sSideEffectName) {
        var _oSideEffectProperty$;

        var oSideEffectProperty = mFieldSideEffectsMap[sSideEffectName],
            sSideEffectContextPath = (_oSideEffectProperty$ = oSideEffectProperty.context) === null || _oSideEffectProperty$ === void 0 ? void 0 : _oSideEffectProperty$.getPath();

        if (sSideEffectContextPath) {
          var aFailedSideEffects = _this5._mFailedSideEffects[sSideEffectContextPath];

          if (aFailedSideEffects) {
            delete _this5._mFailedSideEffects[sSideEffectContextPath];
            mFailedSideEffectsName[sSideEffectContextPath] = {};
            aFailedSideEffects.forEach(function (mFailedSideEffects) {
              mFailedSideEffectsName[sSideEffectContextPath][mFailedSideEffects.fullyQualifiedName] = true;
              aImmediateSideEffectsProperties.push({
                name: sSideEffectName,
                previouslyFailed: true,
                sideEffects: mFailedSideEffects,
                context: oSideEffectProperty.context
              });
            });
          }

          if (oSideEffectProperty.immediate) {
            var _mFailedSideEffectsNa;

            // SideEffects will be executed immediately after event promise validation
            if (!((_mFailedSideEffectsNa = mFailedSideEffectsName[sSideEffectContextPath]) !== null && _mFailedSideEffectsNa !== void 0 && _mFailedSideEffectsNa[oSideEffectProperty.sideEffects.fullyQualifiedName])) {
              aImmediateSideEffectsProperties.push({
                name: sSideEffectName,
                sideEffects: oSideEffectProperty.sideEffects,
                context: oSideEffectProperty.context
              });
            }
          } else {
            // Add deferred SideEffects to the related dictionary
            _this5._mFieldGroupQueue[sSideEffectName] = _this5._mFieldGroupQueue[sSideEffectName] || {};
            var mSideEffectContextPath = _this5._mFieldGroupQueue[sSideEffectName][sSideEffectContextPath] || {
              promises: [],
              sideEffectProperty: oSideEffectProperty,
              processStarted: false
            };
            mSideEffectContextPath.promises = mSideEffectContextPath.promises.concat([oFieldPromiseForFieldGroup, oFieldGroupPreRequisite]);
            _this5._mFieldGroupQueue[sSideEffectName][sSideEffectContextPath] = mSideEffectContextPath;
          }
        }
      });
      return aImmediateSideEffectsProperties;
    }
    /**
     * Saves the validation status of properties related to a field control.
     *
     * @param oField Field
     * @param bSuccess Status of the field validation
     */
    ;

    _proto._saveFieldPropertiesStatus = function _saveFieldPropertiesStatus(oField, bSuccess) {
      var _this6 = this;

      var oBindingContext = oField.getBindingContext();

      var sEntityType = this._oSideEffectsService.getEntityTypeFromContext(oBindingContext);

      var mEntityType = this._getEntityTypeFromFQN(sEntityType);

      if (mEntityType) {
        // Retrieves all properties used by the field
        var oFieldBinding = this._getBindingForField(oField);

        var aFieldPaths = oFieldBinding.isA("sap.ui.model.CompositeBinding") ? (oFieldBinding.getBindings() || []).map(function (oBinding) {
          return oBinding.sPath;
        }) : [oFieldBinding.getPath()]; // Stores status for all properties

        aFieldPaths.forEach(function (sFieldPath) {
          var sId = _this6._generateStatusIndex(mEntityType, sFieldPath, oBindingContext);

          if (sId) {
            _this6._aSourcePropertiesFailure[bSuccess ? "delete" : "add"](sId);
          }
        });
      }
    }
    /**
     * Retrieves the property binding to the value of the field.
     *
     * @param oField Field
     * @returns  Binding to the value
     */
    ;

    _proto._getBindingForField = function _getBindingForField(oField) {
      var sBindingName = "value";

      if (oField.isA("sap.m.CheckBox")) {
        sBindingName = "selected";
      } else if (oField.isA("sap.fe.core.controls.FileWrapper")) {
        sBindingName = "uploadUrl";
      }

      return oField.getBinding(sBindingName);
    };

    return SideEffectsControllerExtension;
  }(ControllerExtension), (_applyDecoratedDescriptor(_class2.prototype, "onInit", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "onInit"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearPropertiesStatus", [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "clearPropertiesStatus"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getRegisteredFailedRequests", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "getRegisteredFailedRequests"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteFailedRequestsForAContext", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteFailedRequestsForAContext"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleFieldChange", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "handleFieldChange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "handleFieldGroupChange", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "handleFieldGroupChange"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addControlSideEffects", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "addControlSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeFailedSideEffects", [_dec15, _dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "removeFailedSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "requestSideEffects", [_dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "requestSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "removeControlSideEffects", [_dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "removeControlSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "_addFailedSideEffects", [_dec21, _dec22], Object.getOwnPropertyDescriptor(_class2.prototype, "_addFailedSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getContextForSideEffects", [_dec23, _dec24], Object.getOwnPropertyDescriptor(_class2.prototype, "getContextForSideEffects"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "generateSideEffectsMapFromSideEffectId", [_dec25, _dec26], Object.getOwnPropertyDescriptor(_class2.prototype, "generateSideEffectsMapFromSideEffectId"), _class2.prototype)), _class2)) || _class);
  return SideEffectsControllerExtension;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTaWRlRWZmZWN0c0NvbnRyb2xsZXJFeHRlbnNpb24iLCJkZWZpbmVVSTVDbGFzcyIsIm1ldGhvZE92ZXJyaWRlIiwicHVibGljRXh0ZW5zaW9uIiwiZmluYWxFeHRlbnNpb24iLCJwcml2YXRlRXh0ZW5zaW9uIiwib25Jbml0IiwiX29WaWV3IiwiYmFzZSIsImdldFZpZXciLCJfb0FwcENvbXBvbmVudCIsIkNvbW1vblV0aWxzIiwiZ2V0QXBwQ29tcG9uZW50IiwiX29TaWRlRWZmZWN0c1NlcnZpY2UiLCJnZXRTaWRlRWZmZWN0c1NlcnZpY2UiLCJfbUZpZWxkR3JvdXBRdWV1ZSIsIl9hU291cmNlUHJvcGVydGllc0ZhaWx1cmUiLCJTZXQiLCJfbUZhaWxlZFNpZGVFZmZlY3RzIiwiY2xlYXJQcm9wZXJ0aWVzU3RhdHVzIiwiY2xlYXIiLCJnZXRSZWdpc3RlcmVkRmFpbGVkUmVxdWVzdHMiLCJkZWxldGVGYWlsZWRSZXF1ZXN0c0ZvckFDb250ZXh0IiwiY29udGV4dFBhdGgiLCJoYW5kbGVGaWVsZENoYW5nZSIsIm9FdmVudCIsIm9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlIiwibUV2ZW50RmllbGRQcm9wZXJ0aWVzIiwiX2dldEZpZWxkUHJvcGVydGllcyIsImFJbW1lZGlhdGVTaWRlRWZmZWN0c1Byb3BlcnRpZXMiLCJfaW5pdGlhbGl6ZUZpZWxkU2lkZUVmZmVjdHMiLCJiSXNJbW1lZGlhdGVUcmlnZ2VyZWQiLCJfZ2VuZXJhdGVJbW1lZGlhdGVQcm9taXNlIiwidGhlbiIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJtU2lkZUVmZmVjdHNQcm9wZXJ0eSIsInJlcXVlc3RTaWRlRWZmZWN0cyIsInNpZGVFZmZlY3RzIiwiY29udGV4dCIsImNhdGNoIiwib0Vycm9yIiwiTG9nIiwiZGVidWciLCJmaWx0ZXIiLCJtSW1tZWRpYXRlU2lkZUVmZmVjdHMiLCJwcmV2aW91c2x5RmFpbGVkIiwiZm9yRWFjaCIsIl9hZGRGYWlsZWRTaWRlRWZmZWN0cyIsImhhbmRsZUZpZWxkR3JvdXBDaGFuZ2UiLCJ0aGF0IiwiYURlZmVycmVkU2lkZUVmZmVjdHMiLCJhRmllbGRHcm91cElkcyIsImdldFBhcmFtZXRlciIsImdldEZpZWxkR3JvdXBSZXF1ZXN0UHJvbWlzZSIsIm9EZWZlcnJlZFNpZGVFZmZlY3QiLCJiSXNSZXF1ZXN0c1RyaWdnZXJlZCIsIm9TaWRlRWZmZWN0UHJvcGVydHkiLCJzaWRlRWZmZWN0UHJvcGVydHkiLCJvQ29udGV4dCIsInNDb250ZXh0UGF0aCIsImdldFBhdGgiLCJzRW50aXR5VHlwZSIsImdldEVudGl0eVR5cGVGcm9tQ29udGV4dCIsIm1FbnRpdHlUeXBlIiwiX2dldEVudGl0eVR5cGVGcm9tRlFOIiwicHJvbWlzZXMiLCJTb3VyY2VQcm9wZXJ0aWVzIiwiZXZlcnkiLCJzb3VyY2VQcm9wZXJ0eSIsInR5cGUiLCJzSWQiLCJfZ2VuZXJhdGVTdGF0dXNJbmRleCIsInZhbHVlIiwiaGFzIiwiZmluYWxseSIsIm5hbWUiLCJzRmllbGRHcm91cElkIiwic1NpZGVFZmZlY3ROYW1lIiwicmVwbGFjZSIsIm1Db250ZXh0RGVmZXJyZWRTaWRlRWZmZWN0cyIsIk9iamVjdCIsImtleXMiLCJwcm9jZXNzU3RhcnRlZCIsInB1c2giLCJhZGRDb250cm9sU2lkZUVmZmVjdHMiLCJvU2lkZUVmZmVjdHMiLCJyZW1vdmVGYWlsZWRTaWRlRWZmZWN0cyIsImdyb3VwSWQiLCJmbkdldFRhcmdldHMiLCJzVHJpZ2dlckFjdGlvbiIsImV4ZWN1dGVBY3Rpb24iLCJhVGFyZ2V0cyIsImxlbmd0aCIsInJlamVjdCIsInJlc29sdmUiLCJ0YXJnZXRzQW5kQWN0aW9uRGF0YSIsIlRhcmdldEVudGl0aWVzIiwiY29uY2F0IiwiVGFyZ2V0UHJvcGVydGllcyIsIlRyaWdnZXJBY3Rpb24iLCJyZW1vdmVDb250cm9sU2lkZUVmZmVjdHMiLCJvQ29udHJvbCIsInNDb250cm9sSWQiLCJpc0EiLCJnZXRJZCIsImJJc05vdEFscmVhZHlMaXN0ZWQiLCJtRmFpbGVkU2lkZUVmZmVjdHMiLCJmdWxseVF1YWxpZmllZE5hbWUiLCJfZ2VuZXJhdGVGaWVsZEdyb3VwUHJvbWlzZSIsImJQcm9taXNlU3VjY2VzcyIsInByb21pc2UiLCJfc2F2ZUZpZWxkUHJvcGVydGllc1N0YXR1cyIsImZpZWxkIiwib1Byb21pc2UiLCJvRmllbGQiLCJzRmllbGRIZWxwZXJJZCIsImdldEZpZWxkSGVscCIsIm9GaWx0ZXJIZWxwIiwiQ29yZSIsImJ5SWQiLCJnZXRPdXRQYXJhbWV0ZXJzIiwib091dFBhcmFtZXRlciIsIm9CaW5kaW5nIiwiZ2V0QmluZGluZyIsInJlcXVlc3RWYWx1ZSIsInNQcm9wZXJ0eVBhdGgiLCJtUHJvcGVydHkiLCJyZXNvbHZlUGF0aCIsIl90eXBlIiwiam9pbiIsInVuZGVmaW5lZCIsImdldENvbnRleHRGb3JTaWRlRWZmZWN0cyIsIm9CaW5kaW5nQ29udGV4dCIsInNTaWRlRWZmZWN0RW50aXR5VHlwZSIsIm9Db250ZXh0Rm9yU2lkZUVmZmVjdHMiLCJnZXRDb250ZXh0Iiwic0Z1bGx5UXVhbGlmaWVkTmFtZSIsImdldENvbnZlcnRlZE1ldGFNb2RlbCIsImVudGl0eVR5cGVzIiwiZmluZCIsIm9FbnRpdHlUeXBlIiwiX2dldEZpZWxkUHJvbWlzZSIsInZhbGlkaXR5IiwiRmllbGRSdW50aW1lIiwiZ2V0RmllbGRTdGF0ZU9uQ2hhbmdlIiwic3RhdGUiLCJnZXRTb3VyY2UiLCJzaWRlRWZmZWN0c01hcCIsIl9nZXRGaWVsZFNpZGVFZmZlY3RzTWFwIiwibVNpZGVFZmZlY3RzTWFwIiwiZ2V0RmllbGRHcm91cElkcyIsInNWaWV3RW50aXR5U2V0U2V0TmFtZSIsImdldFZpZXdEYXRhIiwiZW50aXR5U2V0Iiwib1ZpZXdFbnRpdHlTZXQiLCJlbnRpdHlTZXRzIiwib0VudGl0eVNldCIsImdlbmVyYXRlU2lkZUVmZmVjdHNNYXBGcm9tU2lkZUVmZmVjdElkIiwic1ZpZXdFbnRpdHlUeXBlIiwiZW50aXR5VHlwZSIsIm1GaWVsZFBhdGgiLCJnZXRBZ2dyZWdhdGlvbiIsIm9DdXN0b21EYXRhIiwiZ2V0S2V5IiwiZ2V0QmluZGluZ0NvbnRleHQiLCJzRmllbGRQYXRoIiwiZ2V0VmFsdWUiLCJtQ29udHJvbEVudGl0eVR5cGUiLCJnZXRDb250cm9sRW50aXR5U2lkZUVmZmVjdHMiLCJzQ29udHJvbE5hbWUiLCJvQ29udHJvbFNpZGVFZmZlY3RzIiwiaW5jbHVkZXMiLCJzTmFtZSIsImltbWVkaWF0ZSIsIl9nZXREYXRhVG9HZW5lcmF0ZVNpZGVFZmZlY3RzTWFwRnJvbVNpZGVFZmZlY3RJZCIsImJJc0ltbWVkaWF0ZSIsImluZGV4T2YiLCJhU2lkZUVmZmVjdFBhcnRzIiwic3BsaXQiLCJzU2lkZUVmZmVjdFBhdGgiLCJvU2lkZUVmZmVjdCIsImdldE9EYXRhRW50aXR5U2lkZUVmZmVjdHMiLCJtRmllbGRTaWRlRWZmZWN0c01hcCIsIm9GaWVsZFByb21pc2VGb3JGaWVsZEdyb3VwIiwibUZhaWxlZFNpZGVFZmZlY3RzTmFtZSIsInNTaWRlRWZmZWN0Q29udGV4dFBhdGgiLCJhRmFpbGVkU2lkZUVmZmVjdHMiLCJtU2lkZUVmZmVjdENvbnRleHRQYXRoIiwiYlN1Y2Nlc3MiLCJvRmllbGRCaW5kaW5nIiwiX2dldEJpbmRpbmdGb3JGaWVsZCIsImFGaWVsZFBhdGhzIiwiZ2V0QmluZGluZ3MiLCJzUGF0aCIsInNCaW5kaW5nTmFtZSIsIkNvbnRyb2xsZXJFeHRlbnNpb24iXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIlNpZGVFZmZlY3RzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ29udmVydGVkTWV0YWRhdGEsIEVudGl0eVR5cGUsIFByb3BlcnR5UGF0aCB9IGZyb20gXCJAc2FwLXV4L3ZvY2FidWxhcmllcy10eXBlc1wiO1xuaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgdHlwZSBBcHBDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL0FwcENvbXBvbmVudFwiO1xuaW1wb3J0IHR5cGUge1xuXHRDb250cm9sU2lkZUVmZmVjdHNFbnRpdHlEaWN0aW9uYXJ5LFxuXHRDb250cm9sU2lkZUVmZmVjdHNUeXBlLFxuXHRPRGF0YVNpZGVFZmZlY3RzVHlwZSxcblx0U2lkZUVmZmVjdHNUeXBlXG59IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9TaWRlRWZmZWN0c1NlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgRmllbGRSdW50aW1lIGZyb20gXCJzYXAvZmUvbWFjcm9zL2ZpZWxkL0ZpZWxkUnVudGltZVwiO1xuaW1wb3J0IHR5cGUgRXZlbnQgZnJvbSBcInNhcC91aS9iYXNlL0V2ZW50XCI7XG5pbXBvcnQgdHlwZSBDb250cm9sIGZyb20gXCJzYXAvdWkvY29yZS9Db250cm9sXCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IENvbnRyb2xsZXJFeHRlbnNpb24gZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyRXh0ZW5zaW9uXCI7XG5pbXBvcnQgdHlwZSBCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvQmluZGluZ1wiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBDb21tb25VdGlscyBmcm9tIFwiLi4vQ29tbW9uVXRpbHNcIjtcbmltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBmaW5hbEV4dGVuc2lvbiwgbWV0aG9kT3ZlcnJpZGUsIHByaXZhdGVFeHRlbnNpb24sIHB1YmxpY0V4dGVuc2lvbiB9IGZyb20gXCIuLi9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuXG50eXBlIEZpZWxkQ29udHJvbCA9IENvbnRyb2wgJiB7XG5cdGdldEZpZWxkSGVscCgpOiBzdHJpbmc7XG5cdGdldEZpZWxkR3JvdXBJZHMoKTogc3RyaW5nW107XG59O1xuXG50eXBlIEZpZWxkRXZlbnRQcm9wZXJ0eVR5cGUgPSB7XG5cdHByb21pc2U6IFByb21pc2U8YW55Pjtcblx0ZmllbGQ6IEZpZWxkQ29udHJvbDtcblx0c2lkZUVmZmVjdHNNYXA6IEZpZWxkU2lkZUVmZmVjdERpY3Rpb25hcnk7XG59O1xuXG50eXBlIEJhc2VTaWRlRWZmZWN0UHJvcGVydHlUeXBlID0ge1xuXHRuYW1lOiBzdHJpbmc7XG5cdGltbWVkaWF0ZT86IGJvb2xlYW47XG5cdHNpZGVFZmZlY3RzOiBTaWRlRWZmZWN0c1R5cGU7XG5cdHByZXZpb3VzbHlGYWlsZWQ/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IHR5cGUgTWFzc0VkaXRGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGUgPSBCYXNlU2lkZUVmZmVjdFByb3BlcnR5VHlwZTtcblxuZXhwb3J0IHR5cGUgRmllbGRTaWRlRWZmZWN0UHJvcGVydHlUeXBlID0gQmFzZVNpZGVFZmZlY3RQcm9wZXJ0eVR5cGUgJiB7XG5cdGNvbnRleHQ6IENvbnRleHQ7XG59O1xuXG50eXBlIEZpZWxkU2lkZUVmZmVjdERpY3Rpb25hcnkgPSBSZWNvcmQ8c3RyaW5nLCBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGU+O1xuXG50eXBlIE1hc3NFZGl0RmllbGRTaWRlRWZmZWN0RGljdGlvbmFyeSA9IFJlY29yZDxzdHJpbmcsIE1hc3NFZGl0RmllbGRTaWRlRWZmZWN0UHJvcGVydHlUeXBlPjtcblxudHlwZSBGYWlsZWRTaWRlRWZmZWN0RGljdGlvbmFyeSA9IFJlY29yZDxzdHJpbmcsIFNpZGVFZmZlY3RzVHlwZVtdPjtcblxudHlwZSBGaWVsZEdyb3VwU2lkZUVmZmVjdFR5cGUgPSB7XG5cdHByb21pc2VzOiBQcm9taXNlPGFueT5bXTtcblx0c2lkZUVmZmVjdFByb3BlcnR5OiBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGU7XG5cdHByb2Nlc3NTdGFydGVkPzogYm9vbGVhbjtcbn07XG5cbnR5cGUgRmllbGRHcm91cFF1ZXVlTWFwVHlwZSA9IHtcblx0W3NpZGVFZmZlY3ROYW1lOiBzdHJpbmddOiB7XG5cdFx0W2NvbnRleHRQYXRoOiBzdHJpbmddOiBGaWVsZEdyb3VwU2lkZUVmZmVjdFR5cGU7XG5cdH07XG59O1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5jb250cm9sbGVyZXh0ZW5zaW9ucy5TaWRlRWZmZWN0c1wiKVxuY2xhc3MgU2lkZUVmZmVjdHNDb250cm9sbGVyRXh0ZW5zaW9uIGV4dGVuZHMgQ29udHJvbGxlckV4dGVuc2lvbiB7XG5cdHByaXZhdGUgX29WaWV3OiBhbnk7XG5cdHByaXZhdGUgX29BcHBDb21wb25lbnQhOiBBcHBDb21wb25lbnQ7XG5cdHByaXZhdGUgX21GaWVsZEdyb3VwUXVldWUhOiBGaWVsZEdyb3VwUXVldWVNYXBUeXBlO1xuXHRwcml2YXRlIF9hU291cmNlUHJvcGVydGllc0ZhaWx1cmUhOiBTZXQ8c3RyaW5nPjtcblx0cHJpdmF0ZSBfb1NpZGVFZmZlY3RzU2VydmljZSE6IGFueTtcblx0cHJpdmF0ZSBfbUZhaWxlZFNpZGVFZmZlY3RzITogRmFpbGVkU2lkZUVmZmVjdERpY3Rpb25hcnk7XG5cblx0QG1ldGhvZE92ZXJyaWRlKClcblx0cHVibGljIG9uSW5pdCgpIHtcblx0XHR0aGlzLl9vVmlldyA9ICh0aGlzIGFzIGFueSkuYmFzZS5nZXRWaWV3KCk7XG5cdFx0dGhpcy5fb0FwcENvbXBvbmVudCA9IENvbW1vblV0aWxzLmdldEFwcENvbXBvbmVudCh0aGlzLl9vVmlldyk7XG5cdFx0dGhpcy5fb1NpZGVFZmZlY3RzU2VydmljZSA9ICh0aGlzLl9vQXBwQ29tcG9uZW50IGFzIGFueSkuZ2V0U2lkZUVmZmVjdHNTZXJ2aWNlKCk7XG5cdFx0dGhpcy5fbUZpZWxkR3JvdXBRdWV1ZSA9IHt9O1xuXHRcdHRoaXMuX2FTb3VyY2VQcm9wZXJ0aWVzRmFpbHVyZSA9IG5ldyBTZXQoKTtcblx0XHR0aGlzLl9tRmFpbGVkU2lkZUVmZmVjdHMgPSB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDbGVhciByZWNvcmRlZCB2YWxpZGF0aW9uIHN0YXR1cyBmb3IgYWxsIHByb3BlcnRpZXMuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBjbGVhclByb3BlcnRpZXNTdGF0dXNcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRwdWJsaWMgY2xlYXJQcm9wZXJ0aWVzU3RhdHVzKCk6IHZvaWQge1xuXHRcdHRoaXMuX2FTb3VyY2VQcm9wZXJ0aWVzRmFpbHVyZS5jbGVhcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgZmFpbGVkIFNpZGVFZmZlY3RzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgZ2V0UmVnaXN0ZXJlZEZhaWxlZFJlcXVlc3RzXG5cdCAqIEByZXR1cm5zIFJlZ2lzdGVyZWQgU2lkZUVmZmVjdHMgcmVxdWVzdHMgdGhhdCBoYXZlIGZhaWxlZFxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdHB1YmxpYyBnZXRSZWdpc3RlcmVkRmFpbGVkUmVxdWVzdHMoKTogRmFpbGVkU2lkZUVmZmVjdERpY3Rpb25hcnkge1xuXHRcdHJldHVybiB0aGlzLl9tRmFpbGVkU2lkZUVmZmVjdHM7XG5cdH1cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0cHVibGljIGRlbGV0ZUZhaWxlZFJlcXVlc3RzRm9yQUNvbnRleHQoY29udGV4dFBhdGg6IHN0cmluZykge1xuXHRcdGRlbGV0ZSB0aGlzLl9tRmFpbGVkU2lkZUVmZmVjdHNbY29udGV4dFBhdGhdO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hbmFnZXMgdGhlIHdvcmtmbG93IGZvciBTaWRlRWZmZWN0cyB3aXRoIHJlbGF0ZWQgY2hhbmdlcyB0byBhIGZpZWxkXG5cdCAqIFRoZSBmb2xsb3dpbmcgc2NlbmFyaW9zIGFyZSBtYW5hZ2VkOlxuXHQgKiAgLSBFeGVjdXRlOiB0cmlnZ2VycyBpbW1lZGlhdGUgU2lkZUVmZmVjdHMgcmVxdWVzdHMgaWYgdGhlIHByb21pc2UgZm9yIHRoZSBmaWVsZCBldmVudCBpcyBmdWxmaWxsZWRcblx0ICogIC0gUmVnaXN0ZXI6IGNhY2hlcyBkZWZlcnJlZCBTaWRlRWZmZWN0cyB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgRmllbGRHcm91cCBpcyB1bmZvY3VzZWQuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBoYW5kbGVGaWVsZENoYW5nZVxuXHQgKiBAcGFyYW0gb0V2ZW50IFNBUFVJNSBldmVudCB0aGF0IGNvbWVzIGZyb20gYSBmaWVsZCBjaGFuZ2Vcblx0ICogQHBhcmFtIG9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkIGJlZm9yZSBleGVjdXRpbmcgZGVmZXJyZWQgU2lkZUVmZmVjdHNcblx0ICogQHJldHVybnMgIFByb21pc2Ugb24gU2lkZUVmZmVjdHMgcmVxdWVzdChzKVxuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdHB1YmxpYyBoYW5kbGVGaWVsZENoYW5nZShvRXZlbnQ6IEV2ZW50LCBvRmllbGRHcm91cFByZVJlcXVpc2l0ZT86IFByb21pc2U8YW55Pik6IFByb21pc2U8YW55PiB7XG5cdFx0Y29uc3QgbUV2ZW50RmllbGRQcm9wZXJ0aWVzID0gdGhpcy5fZ2V0RmllbGRQcm9wZXJ0aWVzKG9FdmVudCksXG5cdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzOiBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGVbXSA9IHRoaXMuX2luaXRpYWxpemVGaWVsZFNpZGVFZmZlY3RzKFxuXHRcdFx0XHRtRXZlbnRGaWVsZFByb3BlcnRpZXMsXG5cdFx0XHRcdG9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlXG5cdFx0XHQpO1xuXG5cdFx0bGV0IGJJc0ltbWVkaWF0ZVRyaWdnZXJlZCA9IGZhbHNlO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2dlbmVyYXRlSW1tZWRpYXRlUHJvbWlzZShtRXZlbnRGaWVsZFByb3BlcnRpZXMpXG5cdFx0XHQudGhlbigoKSA9PiB7XG5cdFx0XHRcdGJJc0ltbWVkaWF0ZVRyaWdnZXJlZCA9IHRydWU7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzLm1hcCgobVNpZGVFZmZlY3RzUHJvcGVydHkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnJlcXVlc3RTaWRlRWZmZWN0cyhtU2lkZUVmZmVjdHNQcm9wZXJ0eS5zaWRlRWZmZWN0cywgbVNpZGVFZmZlY3RzUHJvcGVydHkuY29udGV4dCk7XG5cdFx0XHRcdFx0fSkgfHwgW11cblx0XHRcdFx0KTtcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goKG9FcnJvcikgPT4ge1xuXHRcdFx0XHRpZiAoYklzSW1tZWRpYXRlVHJpZ2dlcmVkKSB7XG5cdFx0XHRcdFx0TG9nLmRlYnVnKFwiRXJyb3Igd2hpbGUgcHJvY2Vzc2luZyBGaWVsZCBTaWRlRWZmZWN0c1wiLCBvRXJyb3IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8qKlxuXHRcdFx0XHRcdCAqIFNpZGVFZmZlY3RzIGhhdmUgbm90IGJlZW4gdHJpZ2dlcmVkIHNpbmNlIHByZVJlcXVpc2l0ZSB2YWxpZGF0aW9uIGZhaWxzIHNvIHdlIG5lZWRcblx0XHRcdFx0XHQgKiB0byBrZWVwIHByZXZpb3VzbHkgZmFpbGVkIHJlcXVlc3QgYXMgRmFpbGVkIHJlcXVlc3QgKHRvIGJlIHJldHJpZ2dlciBvbiBuZXh0IGNoYW5nZSlcblx0XHRcdFx0XHQgKi9cblxuXHRcdFx0XHRcdGFJbW1lZGlhdGVTaWRlRWZmZWN0c1Byb3BlcnRpZXNcblx0XHRcdFx0XHRcdC5maWx0ZXIoKG1JbW1lZGlhdGVTaWRlRWZmZWN0cykgPT4gbUltbWVkaWF0ZVNpZGVFZmZlY3RzLnByZXZpb3VzbHlGYWlsZWQgPT09IHRydWUpXG5cdFx0XHRcdFx0XHQuZm9yRWFjaCgobUltbWVkaWF0ZVNpZGVFZmZlY3RzKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2FkZEZhaWxlZFNpZGVFZmZlY3RzKG1JbW1lZGlhdGVTaWRlRWZmZWN0cy5zaWRlRWZmZWN0cywgbUltbWVkaWF0ZVNpZGVFZmZlY3RzLmNvbnRleHQpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hbmFnZXMgU2lkZUVmZmVjdHMgd2l0aCBhIHJlbGF0ZWQgJ2ZvY3VzIG91dCcgdG8gYSBmaWVsZCBncm91cC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIGhhbmRsZUZpZWxkR3JvdXBDaGFuZ2Vcblx0ICogQHBhcmFtIG9FdmVudCBTQVBVSTUgRXZlbnRcblx0ICogQHJldHVybnMgUHJvbWlzZSBvbiBTaWRlRWZmZWN0cyByZXF1ZXN0KHMpXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0cHVibGljIGhhbmRsZUZpZWxkR3JvdXBDaGFuZ2Uob0V2ZW50OiBFdmVudCk6IFByb21pc2U8YW55PiB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXMsXG5cdFx0XHRhRGVmZXJyZWRTaWRlRWZmZWN0czogRmllbGRHcm91cFNpZGVFZmZlY3RUeXBlW10gPSBbXSxcblx0XHRcdGFGaWVsZEdyb3VwSWRzOiBzdHJpbmdbXSA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJmaWVsZEdyb3VwSWRzXCIpO1xuXG5cdFx0Y29uc3QgZ2V0RmllbGRHcm91cFJlcXVlc3RQcm9taXNlID0gZnVuY3Rpb24gKG9EZWZlcnJlZFNpZGVFZmZlY3Q6IEZpZWxkR3JvdXBTaWRlRWZmZWN0VHlwZSkge1xuXHRcdFx0bGV0IGJJc1JlcXVlc3RzVHJpZ2dlcmVkID0gZmFsc2U7XG5cdFx0XHRjb25zdCBvU2lkZUVmZmVjdFByb3BlcnR5ID0gb0RlZmVycmVkU2lkZUVmZmVjdC5zaWRlRWZmZWN0UHJvcGVydHk7XG5cdFx0XHRjb25zdCBvQ29udGV4dCA9IG9TaWRlRWZmZWN0UHJvcGVydHkuY29udGV4dDtcblx0XHRcdGNvbnN0IHNDb250ZXh0UGF0aCA9IG9Db250ZXh0LmdldFBhdGgoKTtcblx0XHRcdGNvbnN0IHNFbnRpdHlUeXBlID0gdGhhdC5fb1NpZGVFZmZlY3RzU2VydmljZS5nZXRFbnRpdHlUeXBlRnJvbUNvbnRleHQob0NvbnRleHQpO1xuXHRcdFx0Y29uc3QgbUVudGl0eVR5cGUgPSB0aGF0Ll9nZXRFbnRpdHlUeXBlRnJvbUZRTihzRW50aXR5VHlwZSk7XG5cblx0XHRcdHJldHVybiBQcm9taXNlLmFsbChvRGVmZXJyZWRTaWRlRWZmZWN0LnByb21pc2VzKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0YklzUmVxdWVzdHNUcmlnZ2VyZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0Ly9EZWZlcnJlZCBTaWRlRWZmZWN0cyBhcmUgZXhlY3V0ZWQgb25seSBpZiBhbGwgc291cmNlUHJvcGVydGllcyBoYXZlIG5vIHJlZ2lzdGVyZWQgZmFpbHVyZS5cblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRtRW50aXR5VHlwZSAmJlxuXHRcdFx0XHRcdFx0KG9TaWRlRWZmZWN0UHJvcGVydHkuc2lkZUVmZmVjdHMuU291cmNlUHJvcGVydGllcyBhcyBQcm9wZXJ0eVBhdGhbXSkuZXZlcnkoKHNvdXJjZVByb3BlcnR5KSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmIChzb3VyY2VQcm9wZXJ0eS50eXBlID09PSBcIlByb3BlcnR5UGF0aFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3Qgc0lkID0gdGhhdC5fZ2VuZXJhdGVTdGF0dXNJbmRleChtRW50aXR5VHlwZSwgc291cmNlUHJvcGVydHkudmFsdWUsIG9Db250ZXh0KTtcblx0XHRcdFx0XHRcdFx0XHRpZiAoc0lkKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gIXRoYXQuX2FTb3VyY2VQcm9wZXJ0aWVzRmFpbHVyZS5oYXMoc0lkKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoYXQucmVxdWVzdFNpZGVFZmZlY3RzKG9TaWRlRWZmZWN0UHJvcGVydHkuc2lkZUVmZmVjdHMsIG9TaWRlRWZmZWN0UHJvcGVydHkuY29udGV4dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goKG9FcnJvcikgPT4ge1xuXHRcdFx0XHRcdGlmIChiSXNSZXF1ZXN0c1RyaWdnZXJlZCkge1xuXHRcdFx0XHRcdFx0TG9nLmRlYnVnKGBFcnJvciB3aGlsZSBwcm9jZXNzaW5nIEZpZWxkR3JvdXAgU2lkZUVmZmVjdHMgb24gY29udGV4dCAke3NDb250ZXh0UGF0aH1gLCBvRXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSlcblx0XHRcdFx0LmZpbmFsbHkoKCkgPT4ge1xuXHRcdFx0XHRcdGRlbGV0ZSB0aGF0Ll9tRmllbGRHcm91cFF1ZXVlW29TaWRlRWZmZWN0UHJvcGVydHkubmFtZV1bc0NvbnRleHRQYXRoXTtcblx0XHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdGFGaWVsZEdyb3VwSWRzLmZvckVhY2goKHNGaWVsZEdyb3VwSWQpID0+IHtcblx0XHRcdC8qKlxuXHRcdFx0ICogc3RyaW5nIFwiJCRJbW1lZGlhdGVSZXF1ZXN0XCIgaXMgYWRkZWQgdG8gdGhlIFNpZGVFZmZlY3RzIG5hbWUgZHVyaW5nIHRlbXBsYXRpbmcgdG8ga25vd1xuXHRcdFx0ICogaWYgdGhpcyBTaWRlRWZmZWN0cyBtdXN0IGJlIGltbWVkaWF0ZWx5IGV4ZWN1dGVkIHJlcXVlc3RlZCAob24gZmllbGQgY2hhbmdlKSBvciBtdXN0XG5cdFx0XHQgKiBiZSBkZWZlcnJlZCAob24gZmllbGQgZ3JvdXAgZm9jdXMgb3V0KVxuXHRcdFx0ICpcblx0XHRcdCAqL1xuXHRcdFx0Y29uc3Qgc1NpZGVFZmZlY3ROYW1lOiBzdHJpbmcgPSBzRmllbGRHcm91cElkLnJlcGxhY2UoXCIkJEltbWVkaWF0ZVJlcXVlc3RcIiwgXCJcIik7XG5cdFx0XHRjb25zdCBtQ29udGV4dERlZmVycmVkU2lkZUVmZmVjdHMgPSB0aGF0Ll9tRmllbGRHcm91cFF1ZXVlPy5bc1NpZGVFZmZlY3ROYW1lXTtcblx0XHRcdGlmIChtQ29udGV4dERlZmVycmVkU2lkZUVmZmVjdHMpIHtcblx0XHRcdFx0T2JqZWN0LmtleXMobUNvbnRleHREZWZlcnJlZFNpZGVFZmZlY3RzKS5mb3JFYWNoKChzQ29udGV4dFBhdGgpID0+IHtcblx0XHRcdFx0XHRjb25zdCBvRGVmZXJyZWRTaWRlRWZmZWN0ID0gbUNvbnRleHREZWZlcnJlZFNpZGVFZmZlY3RzW3NDb250ZXh0UGF0aF07XG5cdFx0XHRcdFx0aWYgKCFvRGVmZXJyZWRTaWRlRWZmZWN0LnByb2Nlc3NTdGFydGVkKSB7XG5cdFx0XHRcdFx0XHRvRGVmZXJyZWRTaWRlRWZmZWN0LnByb2Nlc3NTdGFydGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGFEZWZlcnJlZFNpZGVFZmZlY3RzLnB1c2gob0RlZmVycmVkU2lkZUVmZmVjdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdGFEZWZlcnJlZFNpZGVFZmZlY3RzLm1hcCgob0RlZmVycmVkU2lkZUVmZmVjdCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gZ2V0RmllbGRHcm91cFJlcXVlc3RQcm9taXNlKG9EZWZlcnJlZFNpZGVFZmZlY3QpO1xuXHRcdFx0fSlcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgYSBTaWRlRWZmZWN0cyBjb250cm9sLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgYWRkQ29udHJvbFNpZGVFZmZlY3RzXG5cdCAqIEBwYXJhbSBzRW50aXR5VHlwZSBOYW1lIG9mIHRoZSBlbnRpdHkgd2hlcmUgdGhlIFNpZGVFZmZlY3RzIGNvbnRyb2wgd2lsbCBiZSByZWdpc3RlcmVkXG5cdCAqIEBwYXJhbSBvU2lkZUVmZmVjdHMgU2lkZUVmZmVjdHMgdG8gcmVnaXN0ZXIuIEVuc3VyZSB0aGUgc291cmNlQ29udHJvbElkIG1hdGNoZXMgdGhlIGFzc29jaWF0ZWQgU0FQVUk1IGNvbnRyb2wgSUQuXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0cHVibGljIGFkZENvbnRyb2xTaWRlRWZmZWN0cyhzRW50aXR5VHlwZTogc3RyaW5nLCBvU2lkZUVmZmVjdHM6IE9taXQ8Q29udHJvbFNpZGVFZmZlY3RzVHlwZSwgXCJmdWxseVF1YWxpZmllZE5hbWVcIj4pOiB2b2lkIHtcblx0XHR0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmFkZENvbnRyb2xTaWRlRWZmZWN0cyhzRW50aXR5VHlwZSwgb1NpZGVFZmZlY3RzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZW1vdmVzIHRoZSBxdWV1ZSBjb250YWluaW5nIHRoZSBmYWlsZWQgU2lkZUVmZmVjdHMuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSByZW1vdmVGYWlsZWRTaWRlRWZmZWN0c1xuXHQgKi9cblx0QHB1YmxpY0V4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdHB1YmxpYyByZW1vdmVGYWlsZWRTaWRlRWZmZWN0cygpOiB2b2lkIHtcblx0XHR0aGlzLl9tRmFpbGVkU2lkZUVmZmVjdHMgPSB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXF1ZXN0IFNpZGVFZmZlY3RzIG9uIGEgc3BlY2lmaWMgY29udGV4dC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIHJlcXVlc3RTaWRlRWZmZWN0c1xuXHQgKiBAcGFyYW0gb1NpZGVFZmZlY3RzIFNpZGVFZmZlY3RzIHRvIGJlIGV4ZWN1dGVkXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IHdoZXJlIFNpZGVFZmZlY3RzIG5lZWQgdG8gYmUgZXhlY3V0ZWRcblx0ICogQHBhcmFtIGdyb3VwSWRcblx0ICogQHBhcmFtIGZuR2V0VGFyZ2V0cyBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gd2hpY2ggd2lsbCBnaXZlIHVzIHRoZSB0YXJnZXRzIGFuZCBhY3Rpb25zIGlmIGl0IHdhcyBjb21pbmcgdGhyb3VnaCBzb21lIHNwZWNpZmljIGhhbmRsaW5nLlxuXHQgKiBAcmV0dXJucyBTaWRlRWZmZWN0cyByZXF1ZXN0IG9uIFNBUFVJNSBjb250ZXh0XG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0cHVibGljIGFzeW5jIHJlcXVlc3RTaWRlRWZmZWN0cyhcblx0XHRvU2lkZUVmZmVjdHM6IFNpZGVFZmZlY3RzVHlwZSxcblx0XHRvQ29udGV4dDogQ29udGV4dCxcblx0XHRncm91cElkPzogc3RyaW5nLFxuXHRcdGZuR2V0VGFyZ2V0cz86IEZ1bmN0aW9uXG5cdCk6IFByb21pc2U8YW55PiB7XG5cdFx0bGV0IGFUYXJnZXRzOiBhbnlbXSwgc1RyaWdnZXJBY3Rpb247XG5cdFx0aWYgKGZuR2V0VGFyZ2V0cykge1xuXHRcdFx0Y29uc3QgdGFyZ2V0c0FuZEFjdGlvbkRhdGEgPSBhd2FpdCBmbkdldFRhcmdldHMob1NpZGVFZmZlY3RzKTtcblx0XHRcdGFUYXJnZXRzID0gdGFyZ2V0c0FuZEFjdGlvbkRhdGFbXCJhVGFyZ2V0c1wiXTtcblx0XHRcdHNUcmlnZ2VyQWN0aW9uID0gdGFyZ2V0c0FuZEFjdGlvbkRhdGFbXCJUcmlnZ2VyQWN0aW9uXCJdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRhVGFyZ2V0cyA9ICgob1NpZGVFZmZlY3RzLlRhcmdldEVudGl0aWVzIGFzIGFueVtdKSB8fCBbXSkuY29uY2F0KChvU2lkZUVmZmVjdHMuVGFyZ2V0UHJvcGVydGllcyBhcyBhbnlbXSkgfHwgW10pO1xuXHRcdFx0c1RyaWdnZXJBY3Rpb24gPSAob1NpZGVFZmZlY3RzIGFzIE9EYXRhU2lkZUVmZmVjdHNUeXBlKS5UcmlnZ2VyQWN0aW9uO1xuXHRcdH1cblx0XHRpZiAoc1RyaWdnZXJBY3Rpb24pIHtcblx0XHRcdHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2UuZXhlY3V0ZUFjdGlvbihzVHJpZ2dlckFjdGlvbiwgb0NvbnRleHQsIGdyb3VwSWQpO1xuXHRcdH1cblxuXHRcdGlmIChhVGFyZ2V0cy5sZW5ndGgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLnJlcXVlc3RTaWRlRWZmZWN0cyhhVGFyZ2V0cywgb0NvbnRleHQsIGdyb3VwSWQpLmNhdGNoKChvRXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHR0aGlzLl9hZGRGYWlsZWRTaWRlRWZmZWN0cyhvU2lkZUVmZmVjdHMsIG9Db250ZXh0KTtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG9FcnJvcik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgU2lkZUVmZmVjdHMgY3JlYXRlZCBieSBhIGNvbnRyb2wuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSByZW1vdmVDb250cm9sU2lkZUVmZmVjdHNcblx0ICogQHBhcmFtIG9Db250cm9sIFNBUFVJNSBDb250cm9sXG5cdCAqL1xuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0cHVibGljIHJlbW92ZUNvbnRyb2xTaWRlRWZmZWN0cyhvQ29udHJvbDogQ29udHJvbCk6IHZvaWQge1xuXHRcdGNvbnN0IHNDb250cm9sSWQgPSBvQ29udHJvbCAmJiBvQ29udHJvbC5pc0EgJiYgb0NvbnRyb2wuaXNBKFwic2FwLnVpLmJhc2UuTWFuYWdlZE9iamVjdFwiKSAmJiBvQ29udHJvbC5nZXRJZCgpO1xuXG5cdFx0aWYgKHNDb250cm9sSWQpIHtcblx0XHRcdHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2UucmVtb3ZlQ29udHJvbFNpZGVFZmZlY3RzKHNDb250cm9sSWQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIFNpZGVFZmZlY3RzIHRvIHRoZSBxdWV1ZSBvZiB0aGUgZmFpbGVkIFNpZGVFZmZlY3RzXG5cdCAqIFRoZSBTaWRlRWZmZWN0cyB3aWxsIGJlIHJldHJpZ2dlcmVkIG9uIHRoZSBuZXh0IGNoYW5nZSBvbiB0aGUgc2FtZSBjb250ZXh0LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2FkZEZhaWxlZFNpZGVFZmZlY3RzXG5cdCAqIEBwYXJhbSBvU2lkZUVmZmVjdHMgU2lkZUVmZmVjdHMgdGhhdCBuZWVkIHRvIGJlIHJldHJpZ2dlcmVkXG5cdCAqIEBwYXJhbSBvQ29udGV4dCBDb250ZXh0IHdoZXJlIFNpZGVFZmZlY3RzIGhhdmUgZmFpbGVkXG5cdCAqL1xuXHRAcHJpdmF0ZUV4dGVuc2lvbigpXG5cdEBmaW5hbEV4dGVuc2lvbigpXG5cdHByaXZhdGUgX2FkZEZhaWxlZFNpZGVFZmZlY3RzKG9TaWRlRWZmZWN0czogU2lkZUVmZmVjdHNUeXBlLCBvQ29udGV4dDogQ29udGV4dCk6IHZvaWQge1xuXHRcdGNvbnN0IHNDb250ZXh0UGF0aDogc3RyaW5nID0gb0NvbnRleHQuZ2V0UGF0aCgpO1xuXG5cdFx0dGhpcy5fbUZhaWxlZFNpZGVFZmZlY3RzW3NDb250ZXh0UGF0aF0gPSB0aGlzLl9tRmFpbGVkU2lkZUVmZmVjdHNbc0NvbnRleHRQYXRoXSB8fCBbXTtcblx0XHRjb25zdCBiSXNOb3RBbHJlYWR5TGlzdGVkID0gdGhpcy5fbUZhaWxlZFNpZGVFZmZlY3RzW3NDb250ZXh0UGF0aF0uZXZlcnkoXG5cdFx0XHQobUZhaWxlZFNpZGVFZmZlY3RzKSA9PiBvU2lkZUVmZmVjdHMuZnVsbHlRdWFsaWZpZWROYW1lICE9PSBtRmFpbGVkU2lkZUVmZmVjdHMuZnVsbHlRdWFsaWZpZWROYW1lXG5cdFx0KTtcblx0XHRpZiAoYklzTm90QWxyZWFkeUxpc3RlZCkge1xuXHRcdFx0dGhpcy5fbUZhaWxlZFNpZGVFZmZlY3RzW3NDb250ZXh0UGF0aF0ucHVzaChvU2lkZUVmZmVjdHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgdGhlIHByb21pc2UgZm9yIHRoZSBmaWVsZCBncm91cCB0aGF0IGlzIHJlcXVpcmVkIGJlZm9yZSByZXF1ZXN0aW5nIFNpZGVFZmZlY3RzLlxuXHQgKiBJZiB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCBhbmQgb25seSB0aGUgZmllbGQgcmVxdWlyZXMgdGhlIFNpZGVFZmZlY3RzIG9uIHRoaXMgY29udGV4dCwgdGhlIFNpZGVFZmZlY3RzIGFyZSByZW1vdmVkIGZyb20gdGhlXG5cdCAqIFNpZGVFZmZlY3RzIHF1ZXVlLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2dlbmVyYXRlRmllbGRHcm91cFByb21pc2Vcblx0ICogQHBhcmFtIG1FdmVudEZpZWxkUHJvcGVydGllcyBGaWVsZCBwcm9wZXJ0aWVzXG5cdCAqIEByZXR1cm5zIFByb21pc2UgdG8gYmUgdXNlZCBmb3IgdGhlIHZhbGlkYXRpb24gb2YgdGhlIGZpZWxkXG5cdCAqL1xuXHRwcml2YXRlIF9nZW5lcmF0ZUZpZWxkR3JvdXBQcm9taXNlKG1FdmVudEZpZWxkUHJvcGVydGllczogRmllbGRFdmVudFByb3BlcnR5VHlwZSk6IFByb21pc2U8YW55PiB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XG5cblx0XHRsZXQgYlByb21pc2VTdWNjZXNzID0gdHJ1ZTtcblx0XHRyZXR1cm4gbUV2ZW50RmllbGRQcm9wZXJ0aWVzLnByb21pc2Vcblx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIGJQcm9taXNlU3VjY2Vzcztcblx0XHRcdH0pXG5cdFx0XHQuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRiUHJvbWlzZVN1Y2Nlc3MgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIGJQcm9taXNlU3VjY2Vzcztcblx0XHRcdH0pXG5cdFx0XHQuZmluYWxseSgoKSA9PiB7XG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiBOZWVkIHRvIHN0b3JlIHRoZSBzdGF0dXMgb2YgcHJvcGVydGllcyByZWxhdGVkIHRvIHRoaXMgZmllbGQgZm9yIGRlZmVycmVkIFNpZGVFZmZlY3RzXG5cdFx0XHRcdCAqIHNpbmNlIGFsbCBTb3VyY2VQcm9wZXJ0aWVzIGZvciB0aGlzIGtpbmQgb2YgU2lkZUVmZmVjdHMgbXVzdCBiZSB2YWxpZFxuXHRcdFx0XHQgKi9cblx0XHRcdFx0dGhhdC5fc2F2ZUZpZWxkUHJvcGVydGllc1N0YXR1cyhtRXZlbnRGaWVsZFByb3BlcnRpZXMuZmllbGQsIGJQcm9taXNlU3VjY2Vzcyk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZW5lcmF0ZXMgdGhlIHByb21pc2UgZm9yIHRoZSBmaWVsZCB0aGF0IGlzIHJlcXVpcmVkIGJlZm9yZSByZXF1ZXN0aW5nIGltbWVkaWF0ZSBTaWRlRWZmZWN0cy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9nZW5lcmF0ZUltbWVkaWF0ZVByb21pc2Vcblx0ICogQHBhcmFtIG1FdmVudEZpZWxkUHJvcGVydGllcyBGaWVsZCBwcm9wZXJ0aWVzXG5cdCAqIEByZXR1cm5zIFByb21pc2UgdG8gYmUgdXNlZCBmb3IgdGhlIHZhbGlkYXRpb24gb2YgdGhlIGZpZWxkXG5cdCAqL1xuXHRwcml2YXRlIF9nZW5lcmF0ZUltbWVkaWF0ZVByb21pc2UobUV2ZW50RmllbGRQcm9wZXJ0aWVzOiBGaWVsZEV2ZW50UHJvcGVydHlUeXBlKTogUHJvbWlzZTxhbnk+IHtcblx0XHRjb25zdCBvUHJvbWlzZSA9IG1FdmVudEZpZWxkUHJvcGVydGllcy5wcm9taXNlO1xuXHRcdHJldHVybiBvUHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdC8qKlxuXHRcdFx0ICogSWYgdGhlIGZpZWxkIGdldHMgYSBGaWVsZEhlbHBlciwgd2UgbmVlZCB0byB3YWl0IHVudGlsIGFsbCBmaWVsZHMgY2hhbmdlZCBieSB0aGlzIEZpZWxkSGVscGVyIGhhdmUgYmVlbiBzZXQuXG5cdFx0XHQgKiBUbyBhY2hpZXZlIHRoaXMsIHdlIGVuc3VyZSB0aGF0IGFsbCByZWxhdGVkIGJpbmRpbmdzIGhhdmUgYmVlbiByZXNvbHZlZC5cblx0XHRcdCAqXG5cdFx0XHQgKiBUaGlzIHJlc29sdXRpb24gcHJvY2VzcyBpcyBub3QgbWFuYWdlZCBieSB0aGUgRmllbGQgRXZlbnQgUHJvbWlzZSwgc28gZm9yIGZhc3QgdXNlciBhY3Rpb25zIChsaWtlIGF1dG9tYXRpb24pIGl0IGNhbiBsb2NrIHRoZSBtb2RlbFxuXHRcdFx0ICogYW5kIG5vIHJlcXVlc3QgY2FuIGJlIGV4ZWN1dGVkLlxuXHRcdFx0ICovXG5cdFx0XHRjb25zdCBvRmllbGQgPSBtRXZlbnRGaWVsZFByb3BlcnRpZXMuZmllbGQ7XG5cdFx0XHRjb25zdCBzRmllbGRIZWxwZXJJZCA9IG9GaWVsZC5nZXRGaWVsZEhlbHAgJiYgb0ZpZWxkLmdldEZpZWxkSGVscCgpO1xuXHRcdFx0aWYgKHNGaWVsZEhlbHBlcklkKSB7XG5cdFx0XHRcdGNvbnN0IG9GaWx0ZXJIZWxwOiBhbnkgPSBDb3JlLmJ5SWQoc0ZpZWxkSGVscGVySWQpO1xuXHRcdFx0XHRpZiAob0ZpbHRlckhlbHAgJiYgb0ZpbHRlckhlbHAuZ2V0T3V0UGFyYW1ldGVycykge1xuXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLmFsbChcblx0XHRcdFx0XHRcdChvRmlsdGVySGVscC5nZXRPdXRQYXJhbWV0ZXJzKCkgYXMgYW55W10pLm1hcCgob091dFBhcmFtZXRlcikgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBvQmluZGluZyA9IG9PdXRQYXJhbWV0ZXIuZ2V0QmluZGluZyhcInZhbHVlXCIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gb0JpbmRpbmcgPyBvQmluZGluZy5yZXF1ZXN0VmFsdWUoKSA6IFByb21pc2UucmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW10pO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyBhIHN0YXR1cyBpbmRleC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9nZW5lcmF0ZVN0YXR1c0luZGV4XG5cdCAqIEBwYXJhbSBtRW50aXR5VHlwZSBUaGUgZW50aXR5IHR5cGVcblx0ICogQHBhcmFtIHNQcm9wZXJ0eVBhdGggVGhlIHByb3BlcnR5IHBhdGhcblx0ICogQHBhcmFtIG9Db250ZXh0IFNBUFVJNSBDb250ZXh0XG5cdCAqIEByZXR1cm5zIEluZGV4XG5cdCAqL1xuXHRwcml2YXRlIF9nZW5lcmF0ZVN0YXR1c0luZGV4KG1FbnRpdHlUeXBlOiBFbnRpdHlUeXBlLCBzUHJvcGVydHlQYXRoOiBzdHJpbmcsIG9Db250ZXh0PzogQ29udGV4dCB8IG51bGwpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuXHRcdGNvbnN0IHNDb250ZXh0UGF0aCA9IG9Db250ZXh0Py5nZXRQYXRoKCk7XG5cdFx0Y29uc3QgbVByb3BlcnR5ID0gbUVudGl0eVR5cGUucmVzb2x2ZVBhdGgoc1Byb3BlcnR5UGF0aCk7XG5cdFx0aWYgKG1Qcm9wZXJ0eSkge1xuXHRcdFx0aWYgKG1Qcm9wZXJ0eSAmJiBtUHJvcGVydHkuX3R5cGUgPT09IFwiUHJvcGVydHlcIikge1xuXHRcdFx0XHRyZXR1cm4gW21Qcm9wZXJ0eS5mdWxseVF1YWxpZmllZE5hbWUsIHNDb250ZXh0UGF0aF0uam9pbihcIl9fXCIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGFwcHJvcHJpYXRlIGNvbnRleHQgb24gd2hpY2ggU2lkZUVmZmVjdHMgY2FuIGJlIHJlcXVlc3RlZC5cblx0ICogIFRoZSBjb3JyZWN0IG9uZSBtdXN0IGhhdmUgdGhlIGJpbmRpbmcgcGFyYW1ldGVyICQkcGF0Y2hXaXRob3V0U2lkZUVmZmVjdHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBvQmluZGluZ0NvbnRleHRcblx0ICogQHBhcmFtIHNTaWRlRWZmZWN0RW50aXR5VHlwZVxuXHQgKiBAcmV0dXJucyBTQVBVSTUgQ29udGV4dCBvciB1bmRlZmluZWRcblx0ICovXG5cdEBwdWJsaWNFeHRlbnNpb24oKVxuXHRAZmluYWxFeHRlbnNpb24oKVxuXHRwdWJsaWMgZ2V0Q29udGV4dEZvclNpZGVFZmZlY3RzKG9CaW5kaW5nQ29udGV4dDogYW55LCBzU2lkZUVmZmVjdEVudGl0eVR5cGU6IHN0cmluZyk6IENvbnRleHQgfCB1bmRlZmluZWQge1xuXHRcdGxldCBvQ29udGV4dEZvclNpZGVFZmZlY3RzID0gb0JpbmRpbmdDb250ZXh0LFxuXHRcdFx0c0VudGl0eVR5cGUgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQmluZGluZ0NvbnRleHQpO1xuXG5cdFx0aWYgKHNTaWRlRWZmZWN0RW50aXR5VHlwZSAhPT0gc0VudGl0eVR5cGUpIHtcblx0XHRcdG9Db250ZXh0Rm9yU2lkZUVmZmVjdHMgPSBvQmluZGluZ0NvbnRleHQuZ2V0QmluZGluZygpLmdldENvbnRleHQoKTtcblx0XHRcdGlmIChvQ29udGV4dEZvclNpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdHNFbnRpdHlUeXBlID0gdGhpcy5fb1NpZGVFZmZlY3RzU2VydmljZS5nZXRFbnRpdHlUeXBlRnJvbUNvbnRleHQob0NvbnRleHRGb3JTaWRlRWZmZWN0cyk7XG5cdFx0XHRcdGlmIChzU2lkZUVmZmVjdEVudGl0eVR5cGUgIT09IHNFbnRpdHlUeXBlKSB7XG5cdFx0XHRcdFx0b0NvbnRleHRGb3JTaWRlRWZmZWN0cyA9IG9Db250ZXh0Rm9yU2lkZUVmZmVjdHMuZ2V0QmluZGluZygpLmdldENvbnRleHQoKTtcblx0XHRcdFx0XHRpZiAob0NvbnRleHRGb3JTaWRlRWZmZWN0cykge1xuXHRcdFx0XHRcdFx0c0VudGl0eVR5cGUgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQ29udGV4dEZvclNpZGVFZmZlY3RzKTtcblx0XHRcdFx0XHRcdGlmIChzU2lkZUVmZmVjdEVudGl0eVR5cGUgIT09IHNFbnRpdHlUeXBlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9Db250ZXh0Rm9yU2lkZUVmZmVjdHMgfHwgdW5kZWZpbmVkO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgRW50aXR5VHlwZSBiYXNlZCBvbiBpdHMgZnVsbHktcXVhbGlmaWVkIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSBzRnVsbHlRdWFsaWZpZWROYW1lIFRoZSBmdWxseS1xdWFsaWZpZWQgbmFtZVxuXHQgKiBAcmV0dXJucyBUaGUgZW50aXR5IHR5cGVcblx0ICovXG5cdHByaXZhdGUgX2dldEVudGl0eVR5cGVGcm9tRlFOKHNGdWxseVF1YWxpZmllZE5hbWU6IHN0cmluZyk6IEVudGl0eVR5cGUgfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiAodGhpcy5fb1NpZGVFZmZlY3RzU2VydmljZS5nZXRDb252ZXJ0ZWRNZXRhTW9kZWwoKSBhcyBDb252ZXJ0ZWRNZXRhZGF0YSkuZW50aXR5VHlwZXMuZmluZCgob0VudGl0eVR5cGUpID0+IHtcblx0XHRcdHJldHVybiBvRW50aXR5VHlwZS5mdWxseVF1YWxpZmllZE5hbWUgPT09IHNGdWxseVF1YWxpZmllZE5hbWU7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgcHJvbWlzZSBvZiB0aGUgZmllbGQgdmFsaWRhdGlvbiB0aGF0IGlzIHJlcXVpcmVkIGZvciB0aGUgU2lkZUVmZmVjdHMgcHJvY2Vzcy5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9nZXRGaWVsZFByb21pc2Vcblx0ICogQHBhcmFtIG9FdmVudCBGaWVsZCBjaGFuZ2UgZXZlbnRcblx0ICogQHJldHVybnMgRmllbGQgcHJvbWlzZVxuXHQgKi9cblx0cHJpdmF0ZSBfZ2V0RmllbGRQcm9taXNlKG9FdmVudDogRXZlbnQpOiBQcm9taXNlPGFueT4ge1xuXHRcdGNvbnN0IHByb21pc2UgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwicHJvbWlzZVwiKSB8fCBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRjb25zdCB2YWxpZGl0eSA9IEZpZWxkUnVudGltZS5nZXRGaWVsZFN0YXRlT25DaGFuZ2Uob0V2ZW50KS5zdGF0ZS52YWxpZGl0eTtcblx0XHRyZXR1cm4gcHJvbWlzZS50aGVuKCgpID0+IHtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGlmICghdmFsaWRpdHkpIHtcblx0XHRcdFx0XHRyZWplY3QoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBmaWVsZCB0aGF0IGFyZSByZXF1aXJlZCBmb3IgdGhlIFNpZGVFZmZlY3RzIHByb2Nlc3MuXG5cdCAqXG5cdCAqIEBmdW5jdGlvblxuXHQgKiBAbmFtZSBfZ2V0RmllbGRQcm9wZXJ0aWVzXG5cdCAqIEBwYXJhbSBvRXZlbnQgRmllbGQgY2hhbmdlIGV2ZW50XG5cdCAqIEByZXR1cm5zIEZpZWxkIHByb3BlcnRpZXMgKGV2ZW50IGNoYW5nZSBwcm9taXNlLCBmaWVsZCwgU2lkZUVmZmVjdHMgcmVsYXRlZCB0byB0aGlzIGZpZWxkKVxuXHQgKi9cblx0cHJpdmF0ZSBfZ2V0RmllbGRQcm9wZXJ0aWVzKG9FdmVudDogRXZlbnQpOiBGaWVsZEV2ZW50UHJvcGVydHlUeXBlIHtcblx0XHRjb25zdCBvRmllbGQ6IEZpZWxkQ29udHJvbCA9IG9FdmVudC5nZXRTb3VyY2UoKSBhcyBGaWVsZENvbnRyb2w7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0cHJvbWlzZTogdGhpcy5fZ2V0RmllbGRQcm9taXNlKG9FdmVudCksXG5cdFx0XHRmaWVsZDogb0ZpZWxkLFxuXHRcdFx0c2lkZUVmZmVjdHNNYXA6IHRoaXMuX2dldEZpZWxkU2lkZUVmZmVjdHNNYXAob0ZpZWxkKVxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgU2lkZUVmZmVjdHMgbWFwXG5cdCAqIFRoZXNlIFNpZGVFZmZlY3RzIGFyZVxuXHQgKiAtIGxpc3RlZCBpbnRvIEZpZWxkR3JvdXBJZHMgKGNvbWluZyBmcm9tIGFuIE9EYXRhIFNlcnZpY2UpXG5cdCAqIC0gZ2VuZXJhdGVkIGJ5IGEgY29udHJvbCBvciBjb250cm9scyBhbmQgdGhhdCBjb25maWd1cmUgdGhpcyBmaWVsZCBhcyBTb3VyY2VQcm9wZXJ0aWVzLlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQG5hbWUgX2dldEZpZWxkU2lkZUVmZmVjdHNNYXBcblx0ICogQHBhcmFtIG9GaWVsZCBGaWVsZFxuXHQgKiBAcmV0dXJucyBTaWRlRWZmZWN0cyBtYXBcblx0ICovXG5cdHByaXZhdGUgX2dldEZpZWxkU2lkZUVmZmVjdHNNYXAob0ZpZWxkOiBGaWVsZENvbnRyb2wpOiBGaWVsZFNpZGVFZmZlY3REaWN0aW9uYXJ5IHtcblx0XHRsZXQgbVNpZGVFZmZlY3RzTWFwOiBGaWVsZFNpZGVFZmZlY3REaWN0aW9uYXJ5ID0ge307XG5cdFx0Y29uc3QgYUZpZWxkR3JvdXBJZHM6IHN0cmluZ1tdID0gb0ZpZWxkLmdldEZpZWxkR3JvdXBJZHMoKSxcblx0XHRcdHNWaWV3RW50aXR5U2V0U2V0TmFtZSA9IHRoaXMuX29WaWV3LmdldFZpZXdEYXRhKCkuZW50aXR5U2V0LFxuXHRcdFx0b1ZpZXdFbnRpdHlTZXQgPSAodGhpcy5fb1NpZGVFZmZlY3RzU2VydmljZS5nZXRDb252ZXJ0ZWRNZXRhTW9kZWwoKSBhcyBDb252ZXJ0ZWRNZXRhZGF0YSkuZW50aXR5U2V0cy5maW5kKChvRW50aXR5U2V0KSA9PiB7XG5cdFx0XHRcdHJldHVybiBvRW50aXR5U2V0Lm5hbWUgPT09IHNWaWV3RW50aXR5U2V0U2V0TmFtZTtcblx0XHRcdH0pO1xuXG5cdFx0Ly8gU2lkZUVmZmVjdHMgY29taW5nIGZyb20gYW4gT0RhdGEgU2VydmljZVxuXHRcdG1TaWRlRWZmZWN0c01hcCA9IHRoaXMuZ2VuZXJhdGVTaWRlRWZmZWN0c01hcEZyb21TaWRlRWZmZWN0SWQoYUZpZWxkR3JvdXBJZHMsIG9GaWVsZCkgYXMgRmllbGRTaWRlRWZmZWN0RGljdGlvbmFyeTtcblxuXHRcdC8vU2lkZUVmZmVjdHMgY29taW5nIGZyb20gY29udHJvbChzKVxuXHRcdGlmIChzVmlld0VudGl0eVNldFNldE5hbWUgJiYgb1ZpZXdFbnRpdHlTZXQpIHtcblx0XHRcdGNvbnN0IHNWaWV3RW50aXR5VHlwZSA9IG9WaWV3RW50aXR5U2V0LmVudGl0eVR5cGUuZnVsbHlRdWFsaWZpZWROYW1lLFxuXHRcdFx0XHRtRmllbGRQYXRoOiBhbnkgPSAob0ZpZWxkLmdldEFnZ3JlZ2F0aW9uKFwiY3VzdG9tRGF0YVwiKSBhcyBhbnlbXSkuZmluZCgob0N1c3RvbURhdGEpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gb0N1c3RvbURhdGEuZ2V0S2V5KCkgPT09IFwic291cmNlUGF0aFwiO1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0b0NvbnRleHQ6IENvbnRleHQgfCB1bmRlZmluZWQgPSB0aGlzLmdldENvbnRleHRGb3JTaWRlRWZmZWN0cyhvRmllbGQuZ2V0QmluZGluZ0NvbnRleHQoKSwgc1ZpZXdFbnRpdHlUeXBlKTtcblxuXHRcdFx0aWYgKG1GaWVsZFBhdGggJiYgb0NvbnRleHQpIHtcblx0XHRcdFx0Y29uc3Qgc0ZpZWxkUGF0aCA9IG1GaWVsZFBhdGguZ2V0VmFsdWUoKS5yZXBsYWNlKGAvJHtzVmlld0VudGl0eVNldFNldE5hbWV9L2AsIFwiXCIpLFxuXHRcdFx0XHRcdG1Db250cm9sRW50aXR5VHlwZSA9IHRoaXMuX29TaWRlRWZmZWN0c1NlcnZpY2UuZ2V0Q29udHJvbEVudGl0eVNpZGVFZmZlY3RzKFxuXHRcdFx0XHRcdFx0c1ZpZXdFbnRpdHlUeXBlXG5cdFx0XHRcdFx0KSBhcyBDb250cm9sU2lkZUVmZmVjdHNFbnRpdHlEaWN0aW9uYXJ5O1xuXHRcdFx0XHRPYmplY3Qua2V5cyhtQ29udHJvbEVudGl0eVR5cGUpLmZvckVhY2goKHNDb250cm9sTmFtZSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG9Db250cm9sU2lkZUVmZmVjdHM6IFNpZGVFZmZlY3RzVHlwZSA9IG1Db250cm9sRW50aXR5VHlwZVtzQ29udHJvbE5hbWVdO1xuXHRcdFx0XHRcdGlmIChvQ29udHJvbFNpZGVFZmZlY3RzLlNvdXJjZVByb3BlcnRpZXMuaW5jbHVkZXMoc0ZpZWxkUGF0aCkpIHtcblx0XHRcdFx0XHRcdGNvbnN0IHNOYW1lID0gYCR7c0NvbnRyb2xOYW1lfTo6JHtzVmlld0VudGl0eVR5cGV9YDtcblx0XHRcdFx0XHRcdG1TaWRlRWZmZWN0c01hcFtzTmFtZV0gPSB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNOYW1lLFxuXHRcdFx0XHRcdFx0XHRpbW1lZGlhdGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHNpZGVFZmZlY3RzOiBvQ29udHJvbFNpZGVFZmZlY3RzLFxuXHRcdFx0XHRcdFx0XHRjb250ZXh0OiBvQ29udGV4dFxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbVNpZGVFZmZlY3RzTWFwO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBzaWRlIGVmZmVjdCBOYW1lLCBzaWRlZWZmZWN0IG9iaiBhbmQgZW50aXR5IHR5cGUgZnJvbSBhIGdpdmVuIGZpZWxkR3JvdXBJZC5cblx0ICpcblx0ICogQHBhcmFtIHNGaWVsZEdyb3VwSWRcblx0ICogQHJldHVybnMgRGF0YSBhYm91dCBzaWRlZWZmZWN0IG5hbWUsIGVudGl0eXR5cGUsIHNpZGUgZWZmZWN0IG9iamVjdCBhbmQgaWYgaXQgaXMgaW1tZWRpYXRlLlxuXHQgKi9cblx0cHJpdmF0ZSBfZ2V0RGF0YVRvR2VuZXJhdGVTaWRlRWZmZWN0c01hcEZyb21TaWRlRWZmZWN0SWQoc0ZpZWxkR3JvdXBJZDogYW55KSB7XG5cdFx0Y29uc3QgYklzSW1tZWRpYXRlOiBib29sZWFuID0gc0ZpZWxkR3JvdXBJZC5pbmRleE9mKFwiJCRJbW1lZGlhdGVSZXF1ZXN0XCIpICE9PSAtMSxcblx0XHRcdHNOYW1lOiBzdHJpbmcgPSBzRmllbGRHcm91cElkLnJlcGxhY2UoXCIkJEltbWVkaWF0ZVJlcXVlc3RcIiwgXCJcIiksXG5cdFx0XHRhU2lkZUVmZmVjdFBhcnRzOiBzdHJpbmdbXSA9IHNOYW1lLnNwbGl0KFwiI1wiKSxcblx0XHRcdHNTaWRlRWZmZWN0RW50aXR5VHlwZTogc3RyaW5nID0gYVNpZGVFZmZlY3RQYXJ0c1swXSxcblx0XHRcdHNTaWRlRWZmZWN0UGF0aDogc3RyaW5nID0gYCR7c1NpZGVFZmZlY3RFbnRpdHlUeXBlfUBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2lkZUVmZmVjdHMke1xuXHRcdFx0XHRhU2lkZUVmZmVjdFBhcnRzLmxlbmd0aCA9PT0gMiA/IGAjJHthU2lkZUVmZmVjdFBhcnRzWzFdfWAgOiBcIlwiXG5cdFx0XHR9YCxcblx0XHRcdG9TaWRlRWZmZWN0OiBTaWRlRWZmZWN0c1R5cGUgfCB1bmRlZmluZWQgPVxuXHRcdFx0XHR0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldE9EYXRhRW50aXR5U2lkZUVmZmVjdHMoc1NpZGVFZmZlY3RFbnRpdHlUeXBlKT8uW3NTaWRlRWZmZWN0UGF0aF07XG5cdFx0cmV0dXJuIHsgc05hbWUsIGJJc0ltbWVkaWF0ZSwgb1NpZGVFZmZlY3QsIHNTaWRlRWZmZWN0RW50aXR5VHlwZSB9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlIHRoZSBzaWRlIGVmZmVjdHMgbWFwIGZyb20gaWQgd2hpY2ggaXMgdGhlIGVudGl0eSBhbmQgcXVhbGlmaWVyXG5cdCAqIGZvciB0aGUgZ2l2ZW4gZW50aXR5LlxuXHQgKlxuXHQgKiBAZnVuY3Rpb25cblx0ICogQHBhcmFtIGFGaWVsZEdyb3VwSWRzXG5cdCAqIEBwYXJhbSBvRmllbGRcblx0ICogQHJldHVybnMgU2lkZSBlZmZlY3QgbWFwIHdpdGggZGF0YVxuXHQgKi9cblxuXHRAcHVibGljRXh0ZW5zaW9uKClcblx0QGZpbmFsRXh0ZW5zaW9uKClcblx0cHVibGljIGdlbmVyYXRlU2lkZUVmZmVjdHNNYXBGcm9tU2lkZUVmZmVjdElkKFxuXHRcdGFGaWVsZEdyb3VwSWRzOiBzdHJpbmdbXSxcblx0XHRvRmllbGQ/OiBGaWVsZENvbnRyb2xcblx0KTogTWFzc0VkaXRGaWVsZFNpZGVFZmZlY3REaWN0aW9uYXJ5IHwgRmllbGRTaWRlRWZmZWN0RGljdGlvbmFyeSB7XG5cdFx0Y29uc3QgbVNpZGVFZmZlY3RzTWFwOiBNYXNzRWRpdEZpZWxkU2lkZUVmZmVjdERpY3Rpb25hcnkgfCBGaWVsZFNpZGVFZmZlY3REaWN0aW9uYXJ5ID0ge307XG5cdFx0YUZpZWxkR3JvdXBJZHMuZm9yRWFjaCgoc0ZpZWxkR3JvdXBJZDogYW55KSA9PiB7XG5cdFx0XHRjb25zdCB7IHNOYW1lLCBiSXNJbW1lZGlhdGUsIG9TaWRlRWZmZWN0LCBzU2lkZUVmZmVjdEVudGl0eVR5cGUgfSA9XG5cdFx0XHRcdHRoaXMuX2dldERhdGFUb0dlbmVyYXRlU2lkZUVmZmVjdHNNYXBGcm9tU2lkZUVmZmVjdElkKHNGaWVsZEdyb3VwSWQpO1xuXHRcdFx0Y29uc3Qgb0NvbnRleHQ6IENvbnRleHQgfCB1bmRlZmluZWQgPSBvRmllbGRcblx0XHRcdFx0PyB0aGlzLmdldENvbnRleHRGb3JTaWRlRWZmZWN0cyhvRmllbGQuZ2V0QmluZGluZ0NvbnRleHQoKSwgc1NpZGVFZmZlY3RFbnRpdHlUeXBlKVxuXHRcdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRcdGlmIChvU2lkZUVmZmVjdCAmJiAoIW9GaWVsZCB8fCAob0ZpZWxkICYmIG9Db250ZXh0KSkpIHtcblx0XHRcdFx0bVNpZGVFZmZlY3RzTWFwW3NOYW1lXSA9IHtcblx0XHRcdFx0XHRuYW1lOiBzTmFtZSxcblx0XHRcdFx0XHRpbW1lZGlhdGU6IGJJc0ltbWVkaWF0ZSxcblx0XHRcdFx0XHRzaWRlRWZmZWN0czogb1NpZGVFZmZlY3Rcblx0XHRcdFx0fTtcblx0XHRcdFx0aWYgKG9GaWVsZCkge1xuXHRcdFx0XHRcdChtU2lkZUVmZmVjdHNNYXBbc05hbWVdIGFzIEZpZWxkU2lkZUVmZmVjdFByb3BlcnR5VHlwZSkuY29udGV4dCA9IG9Db250ZXh0ITtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBtU2lkZUVmZmVjdHNNYXA7XG5cdH1cblxuXHQvKipcblx0ICogTWFuYWdlcyB0aGUgU2lkZUVmZmVjdHMgd2l0aCByZWxhdGVkIGNoYW5nZXMgdG8gYSBmaWVsZFxuXHQgKiBMaXN0OiBnZXRzIGltbWVkaWF0ZSBTaWRlRWZmZWN0cyByZXF1ZXN0c1xuXHQgKiBSZWdpc3RlcjogY2FjaGVzIGRlZmVycmVkIFNpZGVFZmZlY3RzIHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aGVuIHRoZSBGaWVsZEdyb3VwIGlzIHVuZm9jdXNlZC5cblx0ICpcblx0ICogQGZ1bmN0aW9uXG5cdCAqIEBuYW1lIF9pbml0aWFsaXplRmllbGRTaWRlRWZmZWN0c1xuXHQgKiBAcGFyYW0gbUV2ZW50RmllbGRQcm9wZXJ0aWVzIEZpZWxkIGV2ZW50IHByb3BlcnRpZXNcblx0ICogQHBhcmFtIG9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlIFByb21pc2UgdG8gYmUgZnVsZmlsbGVkIGJlZm9yZSBleGVjdXRpbmcgZGVmZXJyZWQgU2lkZUVmZmVjdHNcblx0ICogQHJldHVybnMgIEFycmF5IG9mIGltbWVkaWF0ZSBTaWRlRWZmZWN0c1xuXHQgKi9cblx0cHJpdmF0ZSBfaW5pdGlhbGl6ZUZpZWxkU2lkZUVmZmVjdHMoXG5cdFx0bUV2ZW50RmllbGRQcm9wZXJ0aWVzOiBGaWVsZEV2ZW50UHJvcGVydHlUeXBlLFxuXHRcdG9GaWVsZEdyb3VwUHJlUmVxdWlzaXRlPzogUHJvbWlzZTxhbnk+XG5cdCk6IEZpZWxkU2lkZUVmZmVjdFByb3BlcnR5VHlwZVtdIHtcblx0XHRjb25zdCBtRmllbGRTaWRlRWZmZWN0c01hcCA9IG1FdmVudEZpZWxkUHJvcGVydGllcy5zaWRlRWZmZWN0c01hcCxcblx0XHRcdG9GaWVsZFByb21pc2VGb3JGaWVsZEdyb3VwID0gdGhpcy5fZ2VuZXJhdGVGaWVsZEdyb3VwUHJvbWlzZShtRXZlbnRGaWVsZFByb3BlcnRpZXMpLCAvLyBQcm9taXNlIG1hbmFnaW5nIEZpZWxkR3JvdXAgcmVxdWVzdHMgaWYgRmllbGQgcHJvbWlzZSBmYWlsc1xuXHRcdFx0bUZhaWxlZFNpZGVFZmZlY3RzTmFtZTogYW55ID0ge30sXG5cdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzOiBGaWVsZFNpZGVFZmZlY3RQcm9wZXJ0eVR5cGVbXSA9IFtdO1xuXG5cdFx0b0ZpZWxkR3JvdXBQcmVSZXF1aXNpdGUgPSBvRmllbGRHcm91cFByZVJlcXVpc2l0ZSB8fCBQcm9taXNlLnJlc29sdmUoKTtcblxuXHRcdE9iamVjdC5rZXlzKG1GaWVsZFNpZGVFZmZlY3RzTWFwKS5mb3JFYWNoKChzU2lkZUVmZmVjdE5hbWUpID0+IHtcblx0XHRcdGNvbnN0IG9TaWRlRWZmZWN0UHJvcGVydHk6IEZpZWxkU2lkZUVmZmVjdFByb3BlcnR5VHlwZSA9IG1GaWVsZFNpZGVFZmZlY3RzTWFwW3NTaWRlRWZmZWN0TmFtZV0sXG5cdFx0XHRcdHNTaWRlRWZmZWN0Q29udGV4dFBhdGggPSBvU2lkZUVmZmVjdFByb3BlcnR5LmNvbnRleHQ/LmdldFBhdGgoKTtcblx0XHRcdGlmIChzU2lkZUVmZmVjdENvbnRleHRQYXRoKSB7XG5cdFx0XHRcdGNvbnN0IGFGYWlsZWRTaWRlRWZmZWN0cyA9IHRoaXMuX21GYWlsZWRTaWRlRWZmZWN0c1tzU2lkZUVmZmVjdENvbnRleHRQYXRoXTtcblxuXHRcdFx0XHRpZiAoYUZhaWxlZFNpZGVFZmZlY3RzKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX21GYWlsZWRTaWRlRWZmZWN0c1tzU2lkZUVmZmVjdENvbnRleHRQYXRoXTtcblx0XHRcdFx0XHRtRmFpbGVkU2lkZUVmZmVjdHNOYW1lW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdID0ge307XG5cdFx0XHRcdFx0YUZhaWxlZFNpZGVFZmZlY3RzLmZvckVhY2goKG1GYWlsZWRTaWRlRWZmZWN0czogYW55KSA9PiB7XG5cdFx0XHRcdFx0XHRtRmFpbGVkU2lkZUVmZmVjdHNOYW1lW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdW21GYWlsZWRTaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWVdID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGFJbW1lZGlhdGVTaWRlRWZmZWN0c1Byb3BlcnRpZXMucHVzaCh7XG5cdFx0XHRcdFx0XHRcdG5hbWU6IHNTaWRlRWZmZWN0TmFtZSxcblx0XHRcdFx0XHRcdFx0cHJldmlvdXNseUZhaWxlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0c2lkZUVmZmVjdHM6IG1GYWlsZWRTaWRlRWZmZWN0cyxcblx0XHRcdFx0XHRcdFx0Y29udGV4dDogb1NpZGVFZmZlY3RQcm9wZXJ0eS5jb250ZXh0XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvU2lkZUVmZmVjdFByb3BlcnR5LmltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdC8vIFNpZGVFZmZlY3RzIHdpbGwgYmUgZXhlY3V0ZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgZXZlbnQgcHJvbWlzZSB2YWxpZGF0aW9uXG5cdFx0XHRcdFx0aWYgKCFtRmFpbGVkU2lkZUVmZmVjdHNOYW1lW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdPy5bb1NpZGVFZmZlY3RQcm9wZXJ0eS5zaWRlRWZmZWN0cy5mdWxseVF1YWxpZmllZE5hbWVdKSB7XG5cdFx0XHRcdFx0XHRhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzLnB1c2goe1xuXHRcdFx0XHRcdFx0XHRuYW1lOiBzU2lkZUVmZmVjdE5hbWUsXG5cdFx0XHRcdFx0XHRcdHNpZGVFZmZlY3RzOiBvU2lkZUVmZmVjdFByb3BlcnR5LnNpZGVFZmZlY3RzLFxuXHRcdFx0XHRcdFx0XHRjb250ZXh0OiBvU2lkZUVmZmVjdFByb3BlcnR5LmNvbnRleHRcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBBZGQgZGVmZXJyZWQgU2lkZUVmZmVjdHMgdG8gdGhlIHJlbGF0ZWQgZGljdGlvbmFyeVxuXHRcdFx0XHRcdHRoaXMuX21GaWVsZEdyb3VwUXVldWVbc1NpZGVFZmZlY3ROYW1lXSA9IHRoaXMuX21GaWVsZEdyb3VwUXVldWVbc1NpZGVFZmZlY3ROYW1lXSB8fCB7fTtcblx0XHRcdFx0XHRjb25zdCBtU2lkZUVmZmVjdENvbnRleHRQYXRoID0gdGhpcy5fbUZpZWxkR3JvdXBRdWV1ZVtzU2lkZUVmZmVjdE5hbWVdW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdIHx8IHtcblx0XHRcdFx0XHRcdHByb21pc2VzOiBbXSxcblx0XHRcdFx0XHRcdHNpZGVFZmZlY3RQcm9wZXJ0eTogb1NpZGVFZmZlY3RQcm9wZXJ0eSxcblx0XHRcdFx0XHRcdHByb2Nlc3NTdGFydGVkOiBmYWxzZVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0bVNpZGVFZmZlY3RDb250ZXh0UGF0aC5wcm9taXNlcyA9IG1TaWRlRWZmZWN0Q29udGV4dFBhdGgucHJvbWlzZXMuY29uY2F0KFtcblx0XHRcdFx0XHRcdG9GaWVsZFByb21pc2VGb3JGaWVsZEdyb3VwLFxuXHRcdFx0XHRcdFx0b0ZpZWxkR3JvdXBQcmVSZXF1aXNpdGUgYXMgUHJvbWlzZTxhbnk+XG5cdFx0XHRcdFx0XSk7XG5cdFx0XHRcdFx0dGhpcy5fbUZpZWxkR3JvdXBRdWV1ZVtzU2lkZUVmZmVjdE5hbWVdW3NTaWRlRWZmZWN0Q29udGV4dFBhdGhdID0gbVNpZGVFZmZlY3RDb250ZXh0UGF0aDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBhSW1tZWRpYXRlU2lkZUVmZmVjdHNQcm9wZXJ0aWVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNhdmVzIHRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiBwcm9wZXJ0aWVzIHJlbGF0ZWQgdG8gYSBmaWVsZCBjb250cm9sLlxuXHQgKlxuXHQgKiBAcGFyYW0gb0ZpZWxkIEZpZWxkXG5cdCAqIEBwYXJhbSBiU3VjY2VzcyBTdGF0dXMgb2YgdGhlIGZpZWxkIHZhbGlkYXRpb25cblx0ICovXG5cdHByaXZhdGUgX3NhdmVGaWVsZFByb3BlcnRpZXNTdGF0dXMob0ZpZWxkOiBGaWVsZENvbnRyb2wsIGJTdWNjZXNzOiBib29sZWFuKTogdm9pZCB7XG5cdFx0Y29uc3Qgb0JpbmRpbmdDb250ZXh0ID0gb0ZpZWxkLmdldEJpbmRpbmdDb250ZXh0KCk7XG5cdFx0Y29uc3Qgc0VudGl0eVR5cGUgPSB0aGlzLl9vU2lkZUVmZmVjdHNTZXJ2aWNlLmdldEVudGl0eVR5cGVGcm9tQ29udGV4dChvQmluZGluZ0NvbnRleHQpO1xuXHRcdGNvbnN0IG1FbnRpdHlUeXBlID0gdGhpcy5fZ2V0RW50aXR5VHlwZUZyb21GUU4oc0VudGl0eVR5cGUpO1xuXHRcdGlmIChtRW50aXR5VHlwZSkge1xuXHRcdFx0Ly8gUmV0cmlldmVzIGFsbCBwcm9wZXJ0aWVzIHVzZWQgYnkgdGhlIGZpZWxkXG5cdFx0XHRjb25zdCBvRmllbGRCaW5kaW5nOiBhbnkgPSB0aGlzLl9nZXRCaW5kaW5nRm9yRmllbGQob0ZpZWxkKTtcblx0XHRcdGNvbnN0IGFGaWVsZFBhdGhzID0gb0ZpZWxkQmluZGluZy5pc0EoXCJzYXAudWkubW9kZWwuQ29tcG9zaXRlQmluZGluZ1wiKVxuXHRcdFx0XHQ/IChvRmllbGRCaW5kaW5nLmdldEJpbmRpbmdzKCkgfHwgW10pLm1hcCgob0JpbmRpbmc6IGFueSkgPT4gb0JpbmRpbmcuc1BhdGgpXG5cdFx0XHRcdDogW29GaWVsZEJpbmRpbmcuZ2V0UGF0aCgpXTtcblxuXHRcdFx0Ly8gU3RvcmVzIHN0YXR1cyBmb3IgYWxsIHByb3BlcnRpZXNcblx0XHRcdGFGaWVsZFBhdGhzLmZvckVhY2goKHNGaWVsZFBhdGg6IHN0cmluZykgPT4ge1xuXHRcdFx0XHRjb25zdCBzSWQgPSB0aGlzLl9nZW5lcmF0ZVN0YXR1c0luZGV4KG1FbnRpdHlUeXBlLCBzRmllbGRQYXRoLCBvQmluZGluZ0NvbnRleHQpO1xuXHRcdFx0XHRpZiAoc0lkKSB7XG5cdFx0XHRcdFx0dGhpcy5fYVNvdXJjZVByb3BlcnRpZXNGYWlsdXJlW2JTdWNjZXNzID8gXCJkZWxldGVcIiA6IFwiYWRkXCJdKHNJZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHByb3BlcnR5IGJpbmRpbmcgdG8gdGhlIHZhbHVlIG9mIHRoZSBmaWVsZC5cblx0ICpcblx0ICogQHBhcmFtIG9GaWVsZCBGaWVsZFxuXHQgKiBAcmV0dXJucyAgQmluZGluZyB0byB0aGUgdmFsdWVcblx0ICovXG5cdHByaXZhdGUgX2dldEJpbmRpbmdGb3JGaWVsZChvRmllbGQ6IEZpZWxkQ29udHJvbCk6IEJpbmRpbmcge1xuXHRcdGxldCBzQmluZGluZ05hbWUgPSBcInZhbHVlXCI7XG5cdFx0aWYgKG9GaWVsZC5pc0EoXCJzYXAubS5DaGVja0JveFwiKSkge1xuXHRcdFx0c0JpbmRpbmdOYW1lID0gXCJzZWxlY3RlZFwiO1xuXHRcdH0gZWxzZSBpZiAob0ZpZWxkLmlzQShcInNhcC5mZS5jb3JlLmNvbnRyb2xzLkZpbGVXcmFwcGVyXCIpKSB7XG5cdFx0XHRzQmluZGluZ05hbWUgPSBcInVwbG9hZFVybFwiO1xuXHRcdH1cblx0XHRyZXR1cm4gb0ZpZWxkLmdldEJpbmRpbmcoc0JpbmRpbmdOYW1lKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWRlRWZmZWN0c0NvbnRyb2xsZXJFeHRlbnNpb247XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQThETUEsOEIsV0FETEMsY0FBYyxDQUFDLDhDQUFELEMsVUFTYkMsY0FBYyxFLFVBZ0JkQyxlQUFlLEUsVUFDZkMsY0FBYyxFLFVBWWRELGVBQWUsRSxVQUNmQyxjQUFjLEUsVUFLZEQsZUFBZSxFLFVBQ2ZDLGNBQWMsRSxVQWlCZEQsZUFBZSxFLFdBQ2ZDLGNBQWMsRSxXQTZDZEQsZUFBZSxFLFdBQ2ZDLGNBQWMsRSxXQWlGZEQsZUFBZSxFLFdBQ2ZDLGNBQWMsRSxXQVdkRCxlQUFlLEUsV0FDZkMsY0FBYyxFLFdBZ0JkRCxlQUFlLEUsV0FDZkMsY0FBYyxFLFdBb0NkRCxlQUFlLEUsV0FDZkMsY0FBYyxFLFdBa0JkQyxnQkFBZ0IsRSxXQUNoQkQsY0FBYyxFLFdBNkdkRCxlQUFlLEUsV0FDZkMsY0FBYyxFLFdBNkpkRCxlQUFlLEUsV0FDZkMsY0FBYyxFOzs7Ozs7Ozs7V0F0aEJSRSxNLEdBRFAsa0JBQ2dCO01BQ2YsS0FBS0MsTUFBTCxHQUFlLElBQUQsQ0FBY0MsSUFBZCxDQUFtQkMsT0FBbkIsRUFBZDtNQUNBLEtBQUtDLGNBQUwsR0FBc0JDLFdBQVcsQ0FBQ0MsZUFBWixDQUE0QixLQUFLTCxNQUFqQyxDQUF0QjtNQUNBLEtBQUtNLG9CQUFMLEdBQTZCLEtBQUtILGNBQU4sQ0FBNkJJLHFCQUE3QixFQUE1QjtNQUNBLEtBQUtDLGlCQUFMLEdBQXlCLEVBQXpCO01BQ0EsS0FBS0MseUJBQUwsR0FBaUMsSUFBSUMsR0FBSixFQUFqQztNQUNBLEtBQUtDLG1CQUFMLEdBQTJCLEVBQTNCO0lBQ0E7SUFFRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztXQUdRQyxxQixHQUZQLGlDQUVxQztNQUNwQyxLQUFLSCx5QkFBTCxDQUErQkksS0FBL0I7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