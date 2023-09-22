/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/deepClone", "sap/base/util/isPlainObject", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/KeepAliveHelper", "sap/fe/core/helpers/ToES6Promise", "sap/fe/macros/field/FieldHelper", "sap/fe/macros/field/FieldRuntime", "sap/fe/navigation/SelectionVariant", "sap/ui/core/Core", "sap/ui/core/Fragment", "sap/ui/core/util/XMLPreprocessor", "sap/ui/core/XMLTemplateProcessor", "sap/ui/mdc/link/Factory", "sap/ui/mdc/link/LinkItem", "sap/ui/mdc/link/SemanticObjectMapping", "sap/ui/mdc/link/SemanticObjectMappingItem", "sap/ui/mdc/link/SemanticObjectUnavailableAction", "sap/ui/mdc/LinkDelegate", "sap/ui/model/json/JSONModel"], function (Log, deepClone, isPlainObject, CommonUtils, KeepAliveHelper, toES6Promise, FieldHelper, FieldRuntime, SelectionVariant, Core, Fragment, XMLPreprocessor, XMLTemplateProcessor, Factory, LinkItem, SemanticObjectMapping, SemanticObjectMappingItem, SemanticObjectUnavailableAction, LinkDelegate, JSONModel) {
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

  var SimpleLinkDelegate = Object.assign({}, LinkDelegate);
  var CONSTANTS = {
    iLinksShownInPopup: 3,
    sapmLink: "sap.m.Link",
    sapuimdcLink: "sap.ui.mdc.Link",
    sapmObjectIdentifier: "sap.m.ObjectIdentifier",
    sapmObjectStatus: "sap.m.ObjectStatus"
  };

  SimpleLinkDelegate.getConstants = function () {
    return CONSTANTS;
  };
  /**
   * This will return an array of the SemanticObjects as strings given by the payload.
   *
   * @private
   * @param oPayload The payload defined by the application
   * @param oMetaModel The ODataMetaModel received from the Link
   * @returns The context pointing to the current EntityType.
   */


  SimpleLinkDelegate._getEntityType = function (oPayload, oMetaModel) {
    if (oMetaModel) {
      return oMetaModel.createBindingContext(oPayload.entityType);
    } else {
      return undefined;
    }
  };
  /**
   * This will return an array of the SemanticObjects as strings given by the payload.
   *
   * @private
   * @param oPayload The payload defined by the application
   * @param oMetaModel The ODataMetaModel received from the Link
   * @returns A model containing the payload information
   */


  SimpleLinkDelegate._getSemanticsModel = function (oPayload, oMetaModel) {
    if (oMetaModel) {
      return new JSONModel(oPayload);
    } else {
      return undefined;
    }
  };
  /**
   * This will return an array of the SemanticObjects as strings given by the payload.
   *
   * @private
   * @param oPayload The payload defined by the application
   * @param oMetaModel The ODataMetaModel received from the Link
   * @returns An array containing SemanticObjects based of the payload
   */


  SimpleLinkDelegate._getDataField = function (oPayload, oMetaModel) {
    return oMetaModel.createBindingContext(oPayload.dataField);
  };
  /**
   * This will return an array of the SemanticObjects as strings given by the payload.
   *
   * @private
   * @param oPayload The payload defined by the application
   * @param oMetaModel The ODataMetaModel received from the Link
   * @returns Ancontaining SemanticObjects based of the payload
   */


  SimpleLinkDelegate._getContact = function (oPayload, oMetaModel) {
    return oMetaModel.createBindingContext(oPayload.contact);
  };

  SimpleLinkDelegate.fnTemplateFragment = function () {
    var _this = this;

    var sFragmentName, titleLinkHref;
    var oFragmentModel = {};
    var oPayloadToUse; // payload has been modified by fetching Semantic Objects names with path

    if (this.resolvedpayload) {
      oPayloadToUse = this.resolvedpayload;
    } else {
      oPayloadToUse = this.payload;
    }

    if (oPayloadToUse && !oPayloadToUse.LinkId) {
      oPayloadToUse.LinkId = this.oControl && this.oControl.isA(CONSTANTS.sapuimdcLink) ? this.oControl.getId() : undefined;
    }

    if (oPayloadToUse.LinkId) {
      titleLinkHref = this.oControl.getModel("$sapuimdcLink").getProperty("/titleLinkHref");
      oPayloadToUse.titlelink = titleLinkHref;
    }

    var oSemanticsModel = this._getSemanticsModel(oPayloadToUse, this.oMetaModel);

    if (oPayloadToUse.entityType && this._getEntityType(oPayloadToUse, this.oMetaModel)) {
      sFragmentName = "sap.fe.macros.field.QuickViewLinkForEntity";
      oFragmentModel.bindingContexts = {
        "entityType": this._getEntityType(oPayloadToUse, this.oMetaModel),
        "semantic": oSemanticsModel.createBindingContext("/")
      };
      oFragmentModel.models = {
        "entityType": this.oMetaModel,
        "semantic": oSemanticsModel
      };
    } else if (oPayloadToUse.dataField && this._getDataField(oPayloadToUse, this.oMetaModel)) {
      sFragmentName = "sap.fe.macros.field.QuickViewLinkForDataField";
      oFragmentModel.bindingContexts = {
        "dataField": this._getDataField(oPayloadToUse, this.oMetaModel),
        "semantic": oSemanticsModel.createBindingContext("/")
      };
      oFragmentModel.models = {
        "dataField": this.oMetaModel,
        "semantic": oSemanticsModel
      };
    } else if (oPayloadToUse.contact && this._getContact(oPayloadToUse, this.oMetaModel)) {
      sFragmentName = "sap.fe.macros.field.QuickViewLinkForContact";
      oFragmentModel.bindingContexts = {
        "contact": this._getContact(oPayloadToUse, this.oMetaModel)
      };
      oFragmentModel.models = {
        "contact": this.oMetaModel
      };
    }

    oFragmentModel.models.entitySet = this.oMetaModel;
    oFragmentModel.models.metaModel = this.oMetaModel;

    if (this.oControl && this.oControl.getModel("viewData")) {
      oFragmentModel.models.viewData = this.oControl.getModel("viewData");
      oFragmentModel.bindingContexts.viewData = this.oControl.getModel("viewData").createBindingContext("/");
    }

    var oFragment = XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment");
    return Promise.resolve(XMLPreprocessor.process(oFragment, {
      name: sFragmentName
    }, oFragmentModel)).then(function (_internalFragment) {
      return Fragment.load({
        definition: _internalFragment,
        controller: _this
      });
    }).then(function (oPopoverContent) {
      if (oPopoverContent) {
        if (oFragmentModel.models && oFragmentModel.models.semantic) {
          oPopoverContent.setModel(oFragmentModel.models.semantic, "semantic");
          oPopoverContent.setBindingContext(oFragmentModel.bindingContexts.semantic, "semantic");
        }

        if (oFragmentModel.bindingContexts && oFragmentModel.bindingContexts.entityType) {
          oPopoverContent.setModel(oFragmentModel.models.entityType, "entityType");
          oPopoverContent.setBindingContext(oFragmentModel.bindingContexts.entityType, "entityType");
        }
      }

      _this.resolvedpayload = undefined;
      return oPopoverContent;
    });
  };

  SimpleLinkDelegate.fetchAdditionalContent = function (oPayLoad, oMdcLinkControl) {
    var _oPayLoad$navigationP;

    this.oControl = oMdcLinkControl;
    var aNavigateRegexpMatch = oPayLoad === null || oPayLoad === void 0 ? void 0 : (_oPayLoad$navigationP = oPayLoad.navigationPath) === null || _oPayLoad$navigationP === void 0 ? void 0 : _oPayLoad$navigationP.match(/{(.*?)}/);
    var oBindingContext = aNavigateRegexpMatch && aNavigateRegexpMatch.length > 1 && aNavigateRegexpMatch[1] ? oMdcLinkControl.getModel().bindContext(aNavigateRegexpMatch[1], oMdcLinkControl.getBindingContext(), {
      $$ownRequest: true
    }) : null;
    this.payload = oPayLoad;

    if (oMdcLinkControl && oMdcLinkControl.isA(CONSTANTS.sapuimdcLink)) {
      this.oMetaModel = oMdcLinkControl.getModel().getMetaModel();
      return this.fnTemplateFragment().then(function (oPopoverContent) {
        if (oBindingContext) {
          oPopoverContent.setBindingContext(oBindingContext.getBoundContext());
        }

        return [oPopoverContent];
      });
    }

    return Promise.resolve([]);
  };

  SimpleLinkDelegate._fetchLinkCustomData = function (_oLink) {
    if (_oLink.getParent() && _oLink.isA(CONSTANTS.sapuimdcLink) && (_oLink.getParent().isA(CONSTANTS.sapmLink) || _oLink.getParent().isA(CONSTANTS.sapmObjectIdentifier) || _oLink.getParent().isA(CONSTANTS.sapmObjectStatus))) {
      return _oLink.getCustomData();
    } else {
      return undefined;
    }
  };
  /**
   * Fetches the relevant {@link sap.ui.mdc.link.LinkItem} for the Link and returns them.
   *
   * @public
   * @param oPayload The Payload of the Link given by the application
   * @param oBindingContext The ContextObject of the Link
   * @param oInfoLog The InfoLog of the Link
   * @returns Once resolved an array of {@link sap.ui.mdc.link.LinkItem} is returned
   */


  SimpleLinkDelegate.fetchLinkItems = function (oPayload, oBindingContext, oInfoLog) {
    if (oBindingContext && SimpleLinkDelegate._getSemanticObjects(oPayload)) {
      var oContextObject = oBindingContext.getObject();

      if (oInfoLog) {
        oInfoLog.initialize(SimpleLinkDelegate._getSemanticObjects(oPayload));
      }

      var _oLinkCustomData = this._link && this._fetchLinkCustomData(this._link);

      this.aLinkCustomData = _oLinkCustomData && this._fetchLinkCustomData(this._link).map(function (linkItem) {
        return linkItem.mProperties.value;
      });

      var oSemanticAttributesResolved = SimpleLinkDelegate._calculateSemanticAttributes(oContextObject, oPayload, oInfoLog, this._link);

      var oSemanticAttributes = oSemanticAttributesResolved.results;
      var oPayloadResolved = oSemanticAttributesResolved.payload;
      return SimpleLinkDelegate._retrieveNavigationTargets("", oSemanticAttributes, oPayloadResolved, oInfoLog, this._link).then(function (aLinks) {
        return aLinks.length === 0 ? null : aLinks;
      });
    } else {
      return Promise.resolve(null);
    }
  };

  SimpleLinkDelegate.fetchLinkType = function (oPayload, oLink) {
    var _this2 = this;

    var _oCurrentLink = oLink;

    var _oPayload = Object.assign({}, oPayload);

    var oDefaultInitialType = {
      initialType: {
        type: 2,
        directLink: undefined
      },
      runtimeType: undefined
    };
    return new Promise(function (resolve, reject) {
      var _oPayload$contact;

      if (_oPayload !== null && _oPayload !== void 0 && _oPayload.semanticObjects) {
        _this2._link = oLink;
        return Promise.resolve(_oCurrentLink.retrieveLinkItems()).then(function (aLinkItems) {
          var oLinkItem;
          var nLinkType;

          if ((aLinkItems === null || aLinkItems === void 0 ? void 0 : aLinkItems.length) === 1) {
            oLinkItem = new LinkItem({
              text: aLinkItems[0].getText(),
              href: aLinkItems[0].getHref()
            });
            nLinkType = _oPayload.hasQuickViewFacets === "false" ? 1 : 2;
          } else if (_oPayload.hasQuickViewFacets === "false" && (aLinkItems === null || aLinkItems === void 0 ? void 0 : aLinkItems.length) === 0) {
            nLinkType = 0;
          } else {
            nLinkType = 2;
          }

          resolve({
            initialType: {
              type: nLinkType,
              directLink: oLinkItem ? oLinkItem : undefined
            },
            runtimeType: undefined
          });
        });
      } else if ((_oPayload === null || _oPayload === void 0 ? void 0 : (_oPayload$contact = _oPayload.contact) === null || _oPayload$contact === void 0 ? void 0 : _oPayload$contact.length) > 0) {
        resolve(oDefaultInitialType);
      } else if (_oPayload !== null && _oPayload !== void 0 && _oPayload.entityType && _oPayload !== null && _oPayload !== void 0 && _oPayload.navigationPath) {
        resolve(oDefaultInitialType);
      }

      reject(new Error("no payload or semanticObjects found"));
    }).catch(function (oError) {
      Log.error("Error in SimpleLinkDelegate.fetchLinkType", oError);
    });
  };

  SimpleLinkDelegate._RemoveTitleLinkFromTargets = function (_aLinkItems, _bTitleHasLink, _aTitleLink) {
    var _sTitleLinkHref, _oMDCLink;

    var bResult = false;

    if (_bTitleHasLink && _aTitleLink && _aTitleLink[0]) {
      var _sLinkIsPrimaryAction, _sLinkIntentWithoutParameters;

      var _sTitleIntent = _aTitleLink[0].intent.split("?")[0];

      if (_aLinkItems && _aLinkItems[0]) {
        _sLinkIntentWithoutParameters = "#".concat(_aLinkItems[0].getProperty("key"));
        _sLinkIsPrimaryAction = _sTitleIntent === _sLinkIntentWithoutParameters;

        if (_sLinkIsPrimaryAction) {
          _sTitleLinkHref = _aLinkItems[0].getProperty("href");
          this.payload.titlelinkhref = _sTitleLinkHref;

          if (_aLinkItems[0].isA("sap.ui.mdc.link.LinkItem")) {
            _oMDCLink = _aLinkItems[0].getParent();

            _oMDCLink.getModel("$sapuimdcLink").setProperty("/titleLinkHref", _sTitleLinkHref);

            bResult = true;
          }
        }
      }
    }

    return {
      links: _aLinkItems,
      titlelinkremoved: bResult
    };
  };

  SimpleLinkDelegate._IsSemanticObjectDynamic = function (aNewLinkCustomData, oThis) {
    if (aNewLinkCustomData && oThis.aLinkCustomData) {
      return oThis.aLinkCustomData.filter(function (link) {
        return aNewLinkCustomData.filter(function (otherLink) {
          return otherLink !== link;
        }).length > 0;
      }).length > 0;
    } else {
      return false;
    }
  };

  SimpleLinkDelegate._getLineContext = function (oView, mLineContext) {
    if (!mLineContext) {
      if (oView.getAggregation("content")[0] && oView.getAggregation("content")[0].getBindingContext()) {
        return oView.getAggregation("content")[0].getBindingContext();
      }
    }

    return mLineContext;
  };

  SimpleLinkDelegate._setFilterContextUrlForSelectionVariant = function (oView, oSelectionVariant, oNavigationService) {
    if (oView.getViewData().entitySet && oSelectionVariant) {
      var sContextUrl = oNavigationService.constructContextUrl(oView.getViewData().entitySet, oView.getModel());
      oSelectionVariant.setFilterContextUrl(sContextUrl);
    }

    return oSelectionVariant;
  };

  SimpleLinkDelegate._setObjectMappings = function (sSemanticObject, oParams, aSemanticObjectMappings, oSelectionVariant) {
    var hasChanged = false; // if semanticObjectMappings has items with dynamic semanticObjects we need to resolve them using oParams

    aSemanticObjectMappings.forEach(function (mapping) {
      var mappingSemanticObject = mapping.semanticObject;
      var dynamicSemObjectRegex = mappingSemanticObject.match(/{(.*?)}/);

      if (dynamicSemObjectRegex !== null && dynamicSemObjectRegex !== void 0 && dynamicSemObjectRegex.length && dynamicSemObjectRegex.length > 1 && dynamicSemObjectRegex[1] && oParams[dynamicSemObjectRegex[1]]) {
        mappingSemanticObject = oParams[dynamicSemObjectRegex[1]];
      }

      if (sSemanticObject === mappingSemanticObject) {
        var oMappings = mapping.items;

        for (var i = 0; i < oMappings.length; i++) {
          var sLocalProperty = oMappings[i].key;
          var sSemanticObjectProperty = oMappings[i].value;

          if (oParams[sLocalProperty]) {
            oSelectionVariant.removeParameter(sSemanticObjectProperty);
            oSelectionVariant.removeSelectOption(sSemanticObjectProperty);
            oSelectionVariant.renameParameter(sLocalProperty, sSemanticObjectProperty);
            oSelectionVariant.renameSelectOption(sLocalProperty, sSemanticObjectProperty);
            oParams[sSemanticObjectProperty] = oParams[sLocalProperty];
            hasChanged = true;
          }
        }
      }
    });
    return {
      params: oParams,
      hasChanged: hasChanged
    };
  };

  SimpleLinkDelegate._getLinkItemWithNewParameter = function (_that, _bTitleHasLink, _aTitleLink, _oLinkItem, _oShellServices, _oPayload, _oParams, _sAppStateKey, _oSelectionVariant, _oNavigationService) {
    var checkTitleLink = {
      titlelinkremoved: false
    };

    var _promise = _oShellServices.expandCompactHash(_oLinkItem.getHref()).then(function (sHash) {
      try {
        function _temp3() {
          var oNewShellHash = {
            target: {
              semanticObject: oShellHash.semanticObject,
              action: oShellHash.action
            },
            params: oNewParams,
            appStateKey: _sAppStateKey
          };
          delete oNewShellHash.params["sap-xapp-state"];

          _oLinkItem.setHref("#".concat(_oShellServices.constructShellHash(oNewShellHash)));

          _oPayload.aSemanticLinks.push(_oLinkItem.getHref());

          checkTitleLink = SimpleLinkDelegate._RemoveTitleLinkFromTargets.bind(_that)([_oLinkItem], _bTitleHasLink, _aTitleLink);

          if (checkTitleLink.titlelinkremoved) {
            // The link is removed from the target list because the title link has same target.
            return _oLinkItem;
          } else {
            return _oLinkItem;
          }
        }

        var oShellHash = _oShellServices.parseShellHash(sHash);

        var params = Object.assign({}, _oParams);

        var _SimpleLinkDelegate$_ = SimpleLinkDelegate._setObjectMappings(oShellHash.semanticObject, params, _oPayload.semanticObjectMappings, _oSelectionVariant),
            oNewParams = _SimpleLinkDelegate$_.params,
            hasChanged = _SimpleLinkDelegate$_.hasChanged;

        var _temp4 = function () {
          if (hasChanged) {
            return Promise.resolve(toES6Promise(_oNavigationService.getAppStateKeyAndUrlParameters(_oSelectionVariant.toJSONString()))).then(function (aValues) {
              _sAppStateKey = aValues[1];
            });
          }
        }();

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    });

    return {
      linkitempromise: _promise,
      titlelinkremoved: checkTitleLink.titlelinkremoved
    };
  };
  /**
   * Enables the modification of LinkItems before the popover opens. This enables additional parameters
   * to be added to the link.
   *
   * @param oPayload The payload of the Link given by the application
   * @param oBindingContext The binding context of the Link
   * @param aLinkItems The LinkItems of the Link that can be modified
   * @returns Once resolved an array of {@link sap.ui.mdc.link.LinkItem} is returned
   */


  SimpleLinkDelegate.modifyLinkItems = function (oPayload, oBindingContext, aLinkItems) {
    try {
      var _this4 = this;

      return Promise.resolve(FieldHelper.checkPrimaryActions(oPayload, true)).then(function (_FieldHelper$checkPri) {
        var primaryActionIsActive = _FieldHelper$checkPri;
        var aTitleLink = primaryActionIsActive.titleLink;
        var bTitleHasLink = primaryActionIsActive.hasTitleLink;

        if (aLinkItems.length !== 0) {
          _this4.payload = oPayload;
          var oLink = aLinkItems[0].getParent();
          var oView = CommonUtils.getTargetView(oLink);
          var oAppComponent = CommonUtils.getAppComponent(oView);
          var oShellServices = oAppComponent.getShellServices();

          if (!oShellServices.hasUShell()) {
            Log.error("QuickViewLinkDelegate: Cannot retrieve the shell services");
            return Promise.reject();
          }

          var oMetaModel = oView.getModel().getMetaModel();
          var mLineContext = oLink.getBindingContext();
          var oTargetInfo = {
            semanticObject: oPayload.mainSemanticObject,
            action: ""
          };
          return _catch(function () {
            function _temp6() {
              var oNavigationService = oAppComponent.getNavigationService();
              var oController = oView.getController();
              var oSelectionVariant;
              var mLineContextData;
              mLineContext = SimpleLinkDelegate._getLineContext(oView, mLineContext);
              var sMetaPath = oMetaModel.getMetaPath(mLineContext.getPath());
              mLineContextData = oController._intentBasedNavigation.removeSensitiveData(mLineContext.getObject(), sMetaPath);
              mLineContextData = oController._intentBasedNavigation.prepareContextForExternalNavigation(mLineContextData, mLineContext);
              oSelectionVariant = oNavigationService.mixAttributesAndSelectionVariant(mLineContextData.semanticAttributes, new SelectionVariant());
              oTargetInfo.propertiesWithoutConflict = mLineContextData.propertiesWithoutConflict; //TO modify the selection variant from the Extension API

              oView.getController().intentBasedNavigation.adaptNavigationContext(oSelectionVariant, oTargetInfo);

              SimpleLinkDelegate._removeTechnicalParameters(oSelectionVariant);

              oSelectionVariant = SimpleLinkDelegate._setFilterContextUrlForSelectionVariant(oView, oSelectionVariant, oNavigationService);
              return Promise.resolve(toES6Promise(oNavigationService.getAppStateKeyAndUrlParameters(oSelectionVariant.toJSONString()))).then(function (aValues) {
                var oParams = aValues[0];
                var appStateKey = aValues[1];
                var LinksWithNewParametersPromises = [];

                var _LinkPromiseResult;

                oPayload.aSemanticLinks = [];

                for (var index in aLinkItems) {
                  _LinkPromiseResult = SimpleLinkDelegate._getLinkItemWithNewParameter(_this4, bTitleHasLink, aTitleLink, aLinkItems[index], oShellServices, oPayload, oParams, appStateKey, oSelectionVariant, oNavigationService);

                  if (!_LinkPromiseResult.titlelinkremoved) {
                    // The link target is not the title link target
                    LinksWithNewParametersPromises.push(_LinkPromiseResult.linkitempromise);
                  }
                }

                return Promise.resolve(Promise.all(LinksWithNewParametersPromises));
              });
            }

            var aNewLinkCustomData = oLink && _this4._fetchLinkCustomData(oLink).map(function (linkItem) {
              return linkItem.mProperties.value;
            }); // check if all link items in this.aLinkCustomData are also present in aNewLinkCustomData


            var _temp5 = function () {
              if (SimpleLinkDelegate._IsSemanticObjectDynamic(aNewLinkCustomData, _this4)) {
                // if the customData changed there are different LinkItems to display
                var oSemanticAttributesResolved = SimpleLinkDelegate._calculateSemanticAttributes(oBindingContext.getObject(), oPayload, undefined, _this4._link);

                var oSemanticAttributes = oSemanticAttributesResolved.results;
                var oPayloadResolved = oSemanticAttributesResolved.payload;
                return Promise.resolve(SimpleLinkDelegate._retrieveNavigationTargets("", oSemanticAttributes, oPayloadResolved, undefined, _this4._link)).then(function (_SimpleLinkDelegate$_2) {
                  aLinkItems = _SimpleLinkDelegate$_2;
                });
              }
            }();

            return _temp5 && _temp5.then ? _temp5.then(_temp6) : _temp6(_temp5);
          }, function (oError) {
            Log.error("Error while getting the navigation service", oError);
            return undefined;
          });
        } else {
          return aLinkItems;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  SimpleLinkDelegate.beforeNavigationCallback = function (oPayload, oEvent) {
    var oSource = oEvent.getSource(),
        sHref = oEvent.getParameter("href"),
        oURLParsing = Factory.getService("URLParsing"),
        oHash = sHref && oURLParsing.parseShellHash(sHref);
    KeepAliveHelper.storeControlRefreshStrategyForHash(oSource, oHash);
    return Promise.resolve(true);
  };

  SimpleLinkDelegate._removeTechnicalParameters = function (oSelectionVariant) {
    oSelectionVariant.removeSelectOption("@odata.context");
    oSelectionVariant.removeSelectOption("@odata.metadataEtag");
    oSelectionVariant.removeSelectOption("SAP__Messages");
  };

  SimpleLinkDelegate._getSemanticObjectCustomDataValue = function (aLinkCustomData, oSemanticObjectsResolved) {
    var sPropertyName, sCustomDataValue;

    for (var iCustomDataCount = 0; iCustomDataCount < aLinkCustomData.length; iCustomDataCount++) {
      sPropertyName = aLinkCustomData[iCustomDataCount].getKey();
      sCustomDataValue = aLinkCustomData[iCustomDataCount].getValue();
      oSemanticObjectsResolved[sPropertyName] = {
        value: sCustomDataValue
      };
    }
  };

  SimpleLinkDelegate._createNewPayloadWithDynamicSemanticObjectsResolved = function (oPayload, oSemanticObjectsResolved, newPayload) {
    var sSemanticObjectName, _sTmpPropertyName;

    for (var i = 0; i < oPayload.semanticObjects.length; i++) {
      sSemanticObjectName = oPayload.semanticObjects[i];

      if (sSemanticObjectName && sSemanticObjectName.indexOf("{") === 0 && sSemanticObjectName.indexOf("}") === sSemanticObjectName.length - 1) {
        _sTmpPropertyName = sSemanticObjectName.substr(1, sSemanticObjectName.indexOf("}") - 1);
        sSemanticObjectName = oSemanticObjectsResolved[_sTmpPropertyName].value;

        if (oPayload.mainSemanticObject && oPayload.mainSemanticObject.split(_sTmpPropertyName).length === 2 && oPayload.mainSemanticObject.split(_sTmpPropertyName)[0] === "{" && oPayload.mainSemanticObject.split(_sTmpPropertyName)[1] === "}") {
          if (sSemanticObjectName) {
            newPayload.mainSemanticObject = sSemanticObjectName;
          } else {
            // no value from Custom Data, so removing mainSemanticObject
            newPayload.mainSemanticObject = undefined;
          }
        }

        if (sSemanticObjectName && typeof sSemanticObjectName === "string") {
          newPayload.semanticObjectsResolved.push(sSemanticObjectName ? sSemanticObjectName : undefined);
          newPayload.semanticObjects.push(sSemanticObjectName ? sSemanticObjectName : undefined);
        } else if (Array.isArray(sSemanticObjectName)) {
          for (var j = 0; j < sSemanticObjectName.length; j++) {
            newPayload.semanticObjectsResolved.push(sSemanticObjectName[j] ? sSemanticObjectName[j] : undefined);
            newPayload.semanticObjects.push(sSemanticObjectName[j] ? sSemanticObjectName[j] : undefined);
          }
        }
      } else {
        newPayload.semanticObjects.push(sSemanticObjectName);
      }
    }
  };

  SimpleLinkDelegate._setPayloadWithDynamicSemanticObjectsResolved = function (oPayload, newPayload) {
    var oPayloadWithDynamicSemanticObjectsResolved;

    if (newPayload.semanticObjectsResolved.length > 0) {
      oPayloadWithDynamicSemanticObjectsResolved = {};
      oPayloadWithDynamicSemanticObjectsResolved.entityType = oPayload.entityType;
      oPayloadWithDynamicSemanticObjectsResolved.dataField = oPayload.dataField;
      oPayloadWithDynamicSemanticObjectsResolved.contact = oPayload.contact;
      oPayloadWithDynamicSemanticObjectsResolved.mainSemanticObject = oPayload.mainSemanticObject;
      oPayloadWithDynamicSemanticObjectsResolved.navigationPath = oPayload.navigationPath;
      oPayloadWithDynamicSemanticObjectsResolved.propertyPathLabel = oPayload.propertyPathLabel;
      oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings = deepClone(oPayload.semanticObjectMappings);
      oPayloadWithDynamicSemanticObjectsResolved.semanticObjects = newPayload.semanticObjects;

      var _SemanticObjectUnavailableActions = deepClone(oPayload.semanticObjectUnavailableActions);

      var _Index;

      _SemanticObjectUnavailableActions.forEach(function (_oSemanticObjectUnavailableAction) {
        // Dynamic SemanticObject has an unavailable action
        if (_oSemanticObjectUnavailableAction !== null && _oSemanticObjectUnavailableAction !== void 0 && _oSemanticObjectUnavailableAction.semanticObject && _oSemanticObjectUnavailableAction.semanticObject.indexOf("{") === 0) {
          _Index = oPayload.semanticObjects.findIndex(function (semanticObject) {
            return semanticObject === _oSemanticObjectUnavailableAction.semanticObject;
          });

          if (_Index !== undefined) {
            // Get the SemanticObject name resolved to a value
            _oSemanticObjectUnavailableAction.semanticObject = oPayloadWithDynamicSemanticObjectsResolved.semanticObjects[_Index];
          }
        }
      });

      oPayloadWithDynamicSemanticObjectsResolved.semanticObjectUnavailableActions = _SemanticObjectUnavailableActions;

      if (newPayload.mainSemanticObject) {
        oPayloadWithDynamicSemanticObjectsResolved.mainSemanticObject = newPayload.mainSemanticObject;
      } else {
        oPayloadWithDynamicSemanticObjectsResolved.mainSemanticObject = undefined;
      }

      for (var iNewSemanticObjectsCount = 0; iNewSemanticObjectsCount < newPayload.semanticObjects.length; iNewSemanticObjectsCount++) {
        if (oPayloadWithDynamicSemanticObjectsResolved.mainSemanticObject === newPayload.semanticObjectsResolved[iNewSemanticObjectsCount]) {
          oPayloadWithDynamicSemanticObjectsResolved.mainSemanticObject = newPayload.semanticObjects[iNewSemanticObjectsCount];
        }

        if (!!oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings && oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings.length > 0) {
          // skip this in case there are no semanticObjectMappings because custom semantic objects might not have any mappings
          if (oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings[iNewSemanticObjectsCount]) {
            oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings[iNewSemanticObjectsCount] = {
              semanticObject: newPayload.semanticObjects[iNewSemanticObjectsCount],
              items: oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings[iNewSemanticObjectsCount].items
            };
          }
        }

        if (oPayloadWithDynamicSemanticObjectsResolved.semanticObjects[iNewSemanticObjectsCount]) {
          oPayloadWithDynamicSemanticObjectsResolved.semanticObjects[iNewSemanticObjectsCount] = newPayload.semanticObjects[iNewSemanticObjectsCount];
        } else {
          // no Custom Data value for a Semantic Object name with path
          oPayloadWithDynamicSemanticObjectsResolved.semanticObjects.splice(iNewSemanticObjectsCount, 1);
        }
      } // remove undefined Semantic Object Mapping


      for (var iMappingsCount = 0; iMappingsCount < oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings.length; iMappingsCount++) {
        if (oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings[iMappingsCount] && oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings[iMappingsCount].semanticObject === undefined) {
          oPayloadWithDynamicSemanticObjectsResolved.semanticObjectMappings.splice(iMappingsCount, 1);
        }
      }
    }

    return oPayloadWithDynamicSemanticObjectsResolved;
  };

  SimpleLinkDelegate._getPayloadWithDynamicSemanticObjectsResolved = function (oPayload, aLinkCustomData) {
    var oPayloadWithDynamicSemanticObjectsResolved;
    var oSemanticObjectsResolved = {};
    var newPayload = {
      semanticObjects: [],
      semanticObjectsResolved: []
    };

    if (oPayload.semanticObjects) {
      // sap.m.Link has custom data with Semantic Objects names resolved
      if (aLinkCustomData && aLinkCustomData.length > 0) {
        SimpleLinkDelegate._getSemanticObjectCustomDataValue(aLinkCustomData, oSemanticObjectsResolved);

        SimpleLinkDelegate._createNewPayloadWithDynamicSemanticObjectsResolved(oPayload, oSemanticObjectsResolved, newPayload);

        oPayloadWithDynamicSemanticObjectsResolved = SimpleLinkDelegate._setPayloadWithDynamicSemanticObjectsResolved(oPayload, newPayload);
        return oPayloadWithDynamicSemanticObjectsResolved;
      }
    } else {
      return undefined;
    }
  };

  SimpleLinkDelegate._updatePayloadWithSemanticAttributes = function (aSemanticObjects, oInfoLog, oContextObject, oResults, mSemanticObjectMappings) {
    aSemanticObjects.forEach(function (sSemanticObject) {
      if (oInfoLog) {
        oInfoLog.addContextObject(sSemanticObject, oContextObject);
      }

      oResults[sSemanticObject] = {};

      for (var sAttributeName in oContextObject) {
        var oAttribute = null,
            oTransformationAdditional = null;

        if (oInfoLog) {
          oAttribute = oInfoLog.getSemanticObjectAttribute(sSemanticObject, sAttributeName);

          if (!oAttribute) {
            oAttribute = oInfoLog.createAttributeStructure();
            oInfoLog.addSemanticObjectAttribute(sSemanticObject, sAttributeName, oAttribute);
          }
        } // Ignore undefined and null values


        if (oContextObject[sAttributeName] === undefined || oContextObject[sAttributeName] === null) {
          if (oAttribute) {
            oAttribute.transformations.push({
              value: undefined,
              description: "\u2139 Undefined and null values have been removed in SimpleLinkDelegate."
            });
          }

          continue;
        } // Ignore plain objects (BCP 1770496639)


        if (isPlainObject(oContextObject[sAttributeName])) {
          if (mSemanticObjectMappings && mSemanticObjectMappings[sSemanticObject]) {
            var aKeys = Object.keys(mSemanticObjectMappings[sSemanticObject]);
            var sNewAttributeNameMapped = void 0,
                sNewAttributeName = void 0,
                sValue = void 0,
                sKey = void 0;

            for (var index = 0; index < aKeys.length; index++) {
              sKey = aKeys[index];

              if (sKey.indexOf(sAttributeName) === 0) {
                sNewAttributeNameMapped = mSemanticObjectMappings[sSemanticObject][sKey];
                sNewAttributeName = sKey.split("/")[sKey.split("/").length - 1];
                sValue = oContextObject[sAttributeName][sNewAttributeName];

                if (sNewAttributeNameMapped && sNewAttributeName && sValue) {
                  oResults[sSemanticObject][sNewAttributeNameMapped] = sValue;
                }
              }
            }
          }

          if (oAttribute) {
            oAttribute.transformations.push({
              value: undefined,
              description: "\u2139 Plain objects has been removed in SimpleLinkDelegate."
            });
          }

          continue;
        } // Map the attribute name only if 'semanticObjectMapping' is defined.
        // Note: under defined 'semanticObjectMapping' we also mean an empty annotation or an annotation with empty record


        var sAttributeNameMapped = mSemanticObjectMappings && mSemanticObjectMappings[sSemanticObject] && mSemanticObjectMappings[sSemanticObject][sAttributeName] ? mSemanticObjectMappings[sSemanticObject][sAttributeName] : sAttributeName;

        if (oAttribute && sAttributeName !== sAttributeNameMapped) {
          oTransformationAdditional = {
            value: undefined,
            description: "\u2139 The attribute ".concat(sAttributeName, " has been renamed to ").concat(sAttributeNameMapped, " in SimpleLinkDelegate."),
            reason: "\uD83D\uDD34 A com.sap.vocabularies.Common.v1.SemanticObjectMapping annotation is defined for semantic object ".concat(sSemanticObject, " with source attribute ").concat(sAttributeName, " and target attribute ").concat(sAttributeNameMapped, ". You can modify the annotation if the mapping result is not what you expected.")
          };
        } // If more then one local property maps to the same target property (clash situation)
        // we take the value of the last property and write an error log


        if (oResults[sSemanticObject][sAttributeNameMapped]) {
          Log.error("SimpleLinkDelegate: The attribute ".concat(sAttributeName, " can not be renamed to the attribute ").concat(sAttributeNameMapped, " due to a clash situation. This can lead to wrong navigation later on."));
        } // Copy the value replacing the attribute name by semantic object name


        oResults[sSemanticObject][sAttributeNameMapped] = oContextObject[sAttributeName];

        if (oAttribute) {
          if (oTransformationAdditional) {
            oAttribute.transformations.push(oTransformationAdditional);
            var aAttributeNew = oInfoLog.createAttributeStructure();
            aAttributeNew.transformations.push({
              value: oContextObject[sAttributeName],
              description: "\u2139 The attribute ".concat(sAttributeNameMapped, " with the value ").concat(oContextObject[sAttributeName], " has been added due to a mapping rule regarding the attribute ").concat(sAttributeName, " in SimpleLinkDelegate.")
            });
            oInfoLog.addSemanticObjectAttribute(sSemanticObject, sAttributeNameMapped, aAttributeNew);
          }
        }
      }
    });
  };
  /**
   * Checks which attributes of the ContextObject belong to which SemanticObject and maps them into a two dimensional array.
   *
   * @private
   * @param oContextObject The BindingContext of the SourceControl of the Link / of the Link itself if not set
   * @param oPayload The payload given by the application
   * @param oInfoLog The corresponding InfoLog of the Link
   * @param oLink The corresponding Link
   * @returns A two dimensional array which maps a given SemanticObject name together with a given attribute name to the value of that given attribute
   */


  SimpleLinkDelegate._calculateSemanticAttributes = function (oContextObject, oPayload, oInfoLog, oLink) {
    var aLinkCustomData = oLink && this._fetchLinkCustomData(oLink);

    var oPayloadWithDynamicSemanticObjectsResolved = SimpleLinkDelegate._getPayloadWithDynamicSemanticObjectsResolved(oPayload, aLinkCustomData);

    var oPayloadResolved = oPayloadWithDynamicSemanticObjectsResolved ? oPayloadWithDynamicSemanticObjectsResolved : oPayload;
    this.resolvedpayload = oPayloadWithDynamicSemanticObjectsResolved;

    var aSemanticObjects = SimpleLinkDelegate._getSemanticObjects(oPayloadResolved);

    var mSemanticObjectMappings = SimpleLinkDelegate._convertSemanticObjectMapping(SimpleLinkDelegate._getSemanticObjectMappings(oPayloadResolved));

    if (!aSemanticObjects.length) {
      aSemanticObjects.push("");
    }

    var oResults = {};

    SimpleLinkDelegate._updatePayloadWithSemanticAttributes(aSemanticObjects, oInfoLog, oContextObject, oResults, mSemanticObjectMappings);

    return {
      payload: oPayloadResolved,
      results: oResults
    };
  };
  /**
   * Retrieves the actual targets for the navigation of the link. This uses the UShell loaded by the {@link sap.ui.mdc.link.Factory} to retrieve
   * the navigation targets from the FLP service.
   *
   * @private
   * @param sAppStateKey Key of the appstate (not used yet)
   * @param oSemanticAttributes The calculated by _calculateSemanticAttributes
   * @param oPayload The payload given by the application
   * @param oInfoLog The corresponding InfoLog of the Link
   * @param oLink The corresponding Link
   * @returns Resolving into availableAtions and ownNavigation containing an array of {@link sap.ui.mdc.link.LinkItem}
   */


  SimpleLinkDelegate._retrieveNavigationTargets = function (sAppStateKey, oSemanticAttributes, oPayload, oInfoLog, oLink) {
    var _this5 = this;

    if (!oPayload.semanticObjects) {
      return Promise.resolve([]);
    }

    var aSemanticObjects = oPayload.semanticObjects;
    var oNavigationTargets = {
      ownNavigation: undefined,
      availableActions: []
    };
    var iSuperiorActionLinksFound = 0;
    return Core.loadLibrary("sap.ui.fl", {
      async: true
    }).then(function () {
      return new Promise(function (resolve) {
        sap.ui.require(["sap/ui/fl/Utils"], function (Utils) {
          try {
            var oAppComponent = Utils.getAppComponentForControl(oLink === undefined ? _this5.oControl : oLink);
            var oShellServices = oAppComponent ? oAppComponent.getShellServices() : null;

            if (!oShellServices) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
            }

            if (!oShellServices.hasUShell()) {
              Log.error("SimpleLinkDelegate: Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained"); // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore

              resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
            }

            var aParams = aSemanticObjects.map(function (sSemanticObject) {
              return [{
                semanticObject: sSemanticObject,
                params: oSemanticAttributes ? oSemanticAttributes[sSemanticObject] : undefined,
                appStateKey: sAppStateKey,
                sortResultsBy: "text"
              }];
            });

            var _temp8 = _catch(function () {
              return Promise.resolve(oShellServices.getLinks(aParams)).then(function (aLinks) {
                var bHasLinks = false;

                for (var i = 0; i < aLinks.length; i++) {
                  for (var j = 0; j < aLinks[i].length; j++) {
                    if (aLinks[i][j].length > 0) {
                      bHasLinks = true;
                      break;
                    }

                    if (bHasLinks) {
                      break;
                    }
                  }
                }

                if (!aLinks || !aLinks.length || !bHasLinks) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
                }

                var aSemanticObjectUnavailableActions = SimpleLinkDelegate._getSemanticObjectUnavailableActions(oPayload);

                var oUnavailableActions = SimpleLinkDelegate._convertSemanticObjectUnavailableAction(aSemanticObjectUnavailableActions);

                var sCurrentHash = FieldRuntime._fnFixHashQueryString(CommonUtils.getHash());

                if (sCurrentHash) {
                  // BCP 1770315035: we have to set the end-point '?' of action in order to avoid matching of "#SalesOrder-manage" in "#SalesOrder-manageFulfillment"
                  sCurrentHash += "?";
                }

                var fnIsUnavailableAction = function (sSemanticObject, sAction) {
                  return !!oUnavailableActions && !!oUnavailableActions[sSemanticObject] && oUnavailableActions[sSemanticObject].indexOf(sAction) > -1;
                };

                var fnAddLink = function (_oLink) {
                  var oShellHash = oShellServices.parseShellHash(_oLink.intent);

                  if (fnIsUnavailableAction(oShellHash.semanticObject, oShellHash.action)) {
                    return;
                  }

                  var sHref = "#".concat(oShellServices.constructShellHash({
                    target: {
                      shellHash: _oLink.intent
                    }
                  }));

                  if (_oLink.intent && _oLink.intent.indexOf(sCurrentHash) === 0) {
                    // Prevent current app from being listed
                    // NOTE: If the navigation target exists in
                    // multiple contexts (~XXXX in hash) they will all be skipped
                    oNavigationTargets.ownNavigation = new LinkItem({
                      href: sHref,
                      text: _oLink.text
                    });
                    return;
                  }

                  var oLinkItem = new LinkItem({
                    // As the retrieveNavigationTargets method can be called several time we can not create the LinkItem instance with the same id
                    key: oShellHash.semanticObject && oShellHash.action ? "".concat(oShellHash.semanticObject, "-").concat(oShellHash.action) : undefined,
                    text: _oLink.text,
                    description: undefined,
                    href: sHref,
                    // target: not supported yet
                    icon: undefined,
                    //_oLink.icon,
                    initiallyVisible: _oLink.tags && _oLink.tags.indexOf("superiorAction") > -1
                  });

                  if (oLinkItem.getProperty("initiallyVisible")) {
                    iSuperiorActionLinksFound++;
                  }

                  oNavigationTargets.availableActions.push(oLinkItem);

                  if (oInfoLog) {
                    oInfoLog.addSemanticObjectIntent(oShellHash.semanticObject, {
                      intent: oLinkItem.getHref(),
                      text: oLinkItem.getText()
                    });
                  }
                };

                for (var n = 0; n < aSemanticObjects.length; n++) {
                  aLinks[n][0].forEach(fnAddLink);
                }

                if (iSuperiorActionLinksFound === 0) {
                  for (var iLinkItemIndex = 0; iLinkItemIndex < oNavigationTargets.availableActions.length; iLinkItemIndex++) {
                    if (iLinkItemIndex < _this5.getConstants().iLinksShownInPopup) {
                      oNavigationTargets.availableActions[iLinkItemIndex].setProperty("initiallyVisible", true);
                    } else {
                      break;
                    }
                  }
                } // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore


                resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
              });
            }, function () {
              Log.error("SimpleLinkDelegate: '_retrieveNavigationTargets' failed executing getLinks method"); // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore

              resolve(oNavigationTargets.availableActions, oNavigationTargets.ownNavigation);
            });

            return Promise.resolve(_temp8 && _temp8.then ? _temp8.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        });
      });
    });
  };

  SimpleLinkDelegate._getSemanticObjects = function (oPayload) {
    return oPayload.semanticObjects ? oPayload.semanticObjects : [];
  };

  SimpleLinkDelegate._getSemanticObjectUnavailableActions = function (oPayload) {
    var aSemanticObjectUnavailableActions = [];

    if (oPayload.semanticObjectUnavailableActions) {
      oPayload.semanticObjectUnavailableActions.forEach(function (oSemanticObjectUnavailableAction) {
        aSemanticObjectUnavailableActions.push(new SemanticObjectUnavailableAction({
          semanticObject: oSemanticObjectUnavailableAction.semanticObject,
          actions: oSemanticObjectUnavailableAction.actions
        }));
      });
    }

    return aSemanticObjectUnavailableActions;
  };
  /**
   * This will return an array of {@link sap.ui.mdc.link.SemanticObjectMapping} depending on the given payload.
   *
   * @private
   * @param oPayload The payload defined by the application
   * @returns An array of semantic object mappings.
   */


  SimpleLinkDelegate._getSemanticObjectMappings = function (oPayload) {
    var aSemanticObjectMappings = [];
    var aSemanticObjectMappingItems = [];

    if (oPayload.semanticObjectMappings) {
      oPayload.semanticObjectMappings.forEach(function (oSemanticObjectMapping) {
        aSemanticObjectMappingItems = [];

        if (oSemanticObjectMapping.items) {
          oSemanticObjectMapping.items.forEach(function (oSemanticObjectMappingItem) {
            aSemanticObjectMappingItems.push(new SemanticObjectMappingItem({
              key: oSemanticObjectMappingItem.key,
              value: oSemanticObjectMappingItem.value
            }));
          });
        }

        aSemanticObjectMappings.push(new SemanticObjectMapping({
          semanticObject: oSemanticObjectMapping.semanticObject,
          items: aSemanticObjectMappingItems
        }));
      });
    }

    return aSemanticObjectMappings;
  };
  /**
   * Converts a given array of SemanticObjectMapping into a Map containing SemanticObjects as Keys and a Map of it's corresponding SemanticObjectMappings as values.
   *
   * @private
   * @param aSemanticObjectMappings An array of SemanticObjectMappings.
   * @returns The converterd SemanticObjectMappings
   */


  SimpleLinkDelegate._convertSemanticObjectMapping = function (aSemanticObjectMappings) {
    if (!aSemanticObjectMappings.length) {
      return undefined;
    }

    var mSemanticObjectMappings = {};
    aSemanticObjectMappings.forEach(function (oSemanticObjectMapping) {
      if (!oSemanticObjectMapping.getSemanticObject()) {
        throw Error("SimpleLinkDelegate: 'semanticObject' property with value '".concat(oSemanticObjectMapping.getSemanticObject(), "' is not valid"));
      }

      mSemanticObjectMappings[oSemanticObjectMapping.getSemanticObject()] = oSemanticObjectMapping.getItems().reduce(function (oMap, oItem) {
        oMap[oItem.getKey()] = oItem.getValue();
        return oMap;
      }, {});
    });
    return mSemanticObjectMappings;
  };
  /**
   * Converts a given array of SemanticObjectUnavailableActions into a map containing SemanticObjects as keys and a map of its corresponding SemanticObjectUnavailableActions as values.
   *
   * @private
   * @param aSemanticObjectUnavailableActions The SemanticObjectUnavailableActions converted
   * @returns The map containing the converted SemanticObjectUnavailableActions
   */


  SimpleLinkDelegate._convertSemanticObjectUnavailableAction = function (aSemanticObjectUnavailableActions) {
    var _SemanticObjectName;

    var _SemanticObjectHasAlreadyUnavailableActions;

    var _UnavailableActions = [];

    if (!aSemanticObjectUnavailableActions.length) {
      return undefined;
    }

    var mSemanticObjectUnavailableActions = {};
    aSemanticObjectUnavailableActions.forEach(function (oSemanticObjectUnavailableActions) {
      _SemanticObjectName = oSemanticObjectUnavailableActions.getSemanticObject();

      if (!_SemanticObjectName) {
        throw Error("SimpleLinkDelegate: 'semanticObject' property with value '".concat(_SemanticObjectName, "' is not valid"));
      }

      _UnavailableActions = oSemanticObjectUnavailableActions.getActions();

      if (mSemanticObjectUnavailableActions[_SemanticObjectName] === undefined) {
        mSemanticObjectUnavailableActions[_SemanticObjectName] = _UnavailableActions;
      } else {
        _SemanticObjectHasAlreadyUnavailableActions = mSemanticObjectUnavailableActions[_SemanticObjectName];

        _UnavailableActions.forEach(function (UnavailableAction) {
          _SemanticObjectHasAlreadyUnavailableActions.push(UnavailableAction);
        });

        mSemanticObjectUnavailableActions[_SemanticObjectName] = _SemanticObjectHasAlreadyUnavailableActions;
      }
    });
    return mSemanticObjectUnavailableActions;
  };

  return SimpleLinkDelegate;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiU2ltcGxlTGlua0RlbGVnYXRlIiwiT2JqZWN0IiwiYXNzaWduIiwiTGlua0RlbGVnYXRlIiwiQ09OU1RBTlRTIiwiaUxpbmtzU2hvd25JblBvcHVwIiwic2FwbUxpbmsiLCJzYXB1aW1kY0xpbmsiLCJzYXBtT2JqZWN0SWRlbnRpZmllciIsInNhcG1PYmplY3RTdGF0dXMiLCJnZXRDb25zdGFudHMiLCJfZ2V0RW50aXR5VHlwZSIsIm9QYXlsb2FkIiwib01ldGFNb2RlbCIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwiZW50aXR5VHlwZSIsInVuZGVmaW5lZCIsIl9nZXRTZW1hbnRpY3NNb2RlbCIsIkpTT05Nb2RlbCIsIl9nZXREYXRhRmllbGQiLCJkYXRhRmllbGQiLCJfZ2V0Q29udGFjdCIsImNvbnRhY3QiLCJmblRlbXBsYXRlRnJhZ21lbnQiLCJzRnJhZ21lbnROYW1lIiwidGl0bGVMaW5rSHJlZiIsIm9GcmFnbWVudE1vZGVsIiwib1BheWxvYWRUb1VzZSIsInJlc29sdmVkcGF5bG9hZCIsInBheWxvYWQiLCJMaW5rSWQiLCJvQ29udHJvbCIsImlzQSIsImdldElkIiwiZ2V0TW9kZWwiLCJnZXRQcm9wZXJ0eSIsInRpdGxlbGluayIsIm9TZW1hbnRpY3NNb2RlbCIsImJpbmRpbmdDb250ZXh0cyIsIm1vZGVscyIsImVudGl0eVNldCIsIm1ldGFNb2RlbCIsInZpZXdEYXRhIiwib0ZyYWdtZW50IiwiWE1MVGVtcGxhdGVQcm9jZXNzb3IiLCJsb2FkVGVtcGxhdGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsIlhNTFByZXByb2Nlc3NvciIsInByb2Nlc3MiLCJuYW1lIiwiX2ludGVybmFsRnJhZ21lbnQiLCJGcmFnbWVudCIsImxvYWQiLCJkZWZpbml0aW9uIiwiY29udHJvbGxlciIsIm9Qb3BvdmVyQ29udGVudCIsInNlbWFudGljIiwic2V0TW9kZWwiLCJzZXRCaW5kaW5nQ29udGV4dCIsImZldGNoQWRkaXRpb25hbENvbnRlbnQiLCJvUGF5TG9hZCIsIm9NZGNMaW5rQ29udHJvbCIsImFOYXZpZ2F0ZVJlZ2V4cE1hdGNoIiwibmF2aWdhdGlvblBhdGgiLCJtYXRjaCIsIm9CaW5kaW5nQ29udGV4dCIsImxlbmd0aCIsImJpbmRDb250ZXh0IiwiZ2V0QmluZGluZ0NvbnRleHQiLCIkJG93blJlcXVlc3QiLCJnZXRNZXRhTW9kZWwiLCJnZXRCb3VuZENvbnRleHQiLCJfZmV0Y2hMaW5rQ3VzdG9tRGF0YSIsIl9vTGluayIsImdldFBhcmVudCIsImdldEN1c3RvbURhdGEiLCJmZXRjaExpbmtJdGVtcyIsIm9JbmZvTG9nIiwiX2dldFNlbWFudGljT2JqZWN0cyIsIm9Db250ZXh0T2JqZWN0IiwiZ2V0T2JqZWN0IiwiaW5pdGlhbGl6ZSIsIl9vTGlua0N1c3RvbURhdGEiLCJfbGluayIsImFMaW5rQ3VzdG9tRGF0YSIsIm1hcCIsImxpbmtJdGVtIiwibVByb3BlcnRpZXMiLCJ2YWx1ZSIsIm9TZW1hbnRpY0F0dHJpYnV0ZXNSZXNvbHZlZCIsIl9jYWxjdWxhdGVTZW1hbnRpY0F0dHJpYnV0ZXMiLCJvU2VtYW50aWNBdHRyaWJ1dGVzIiwicmVzdWx0cyIsIm9QYXlsb2FkUmVzb2x2ZWQiLCJfcmV0cmlldmVOYXZpZ2F0aW9uVGFyZ2V0cyIsImFMaW5rcyIsImZldGNoTGlua1R5cGUiLCJvTGluayIsIl9vQ3VycmVudExpbmsiLCJfb1BheWxvYWQiLCJvRGVmYXVsdEluaXRpYWxUeXBlIiwiaW5pdGlhbFR5cGUiLCJ0eXBlIiwiZGlyZWN0TGluayIsInJ1bnRpbWVUeXBlIiwicmVqZWN0Iiwic2VtYW50aWNPYmplY3RzIiwicmV0cmlldmVMaW5rSXRlbXMiLCJhTGlua0l0ZW1zIiwib0xpbmtJdGVtIiwibkxpbmtUeXBlIiwiTGlua0l0ZW0iLCJ0ZXh0IiwiZ2V0VGV4dCIsImhyZWYiLCJnZXRIcmVmIiwiaGFzUXVpY2tWaWV3RmFjZXRzIiwiRXJyb3IiLCJjYXRjaCIsIm9FcnJvciIsIkxvZyIsImVycm9yIiwiX1JlbW92ZVRpdGxlTGlua0Zyb21UYXJnZXRzIiwiX2FMaW5rSXRlbXMiLCJfYlRpdGxlSGFzTGluayIsIl9hVGl0bGVMaW5rIiwiX3NUaXRsZUxpbmtIcmVmIiwiX29NRENMaW5rIiwiYlJlc3VsdCIsIl9zTGlua0lzUHJpbWFyeUFjdGlvbiIsIl9zTGlua0ludGVudFdpdGhvdXRQYXJhbWV0ZXJzIiwiX3NUaXRsZUludGVudCIsImludGVudCIsInNwbGl0IiwidGl0bGVsaW5raHJlZiIsInNldFByb3BlcnR5IiwibGlua3MiLCJ0aXRsZWxpbmtyZW1vdmVkIiwiX0lzU2VtYW50aWNPYmplY3REeW5hbWljIiwiYU5ld0xpbmtDdXN0b21EYXRhIiwib1RoaXMiLCJmaWx0ZXIiLCJsaW5rIiwib3RoZXJMaW5rIiwiX2dldExpbmVDb250ZXh0Iiwib1ZpZXciLCJtTGluZUNvbnRleHQiLCJnZXRBZ2dyZWdhdGlvbiIsIl9zZXRGaWx0ZXJDb250ZXh0VXJsRm9yU2VsZWN0aW9uVmFyaWFudCIsIm9TZWxlY3Rpb25WYXJpYW50Iiwib05hdmlnYXRpb25TZXJ2aWNlIiwiZ2V0Vmlld0RhdGEiLCJzQ29udGV4dFVybCIsImNvbnN0cnVjdENvbnRleHRVcmwiLCJzZXRGaWx0ZXJDb250ZXh0VXJsIiwiX3NldE9iamVjdE1hcHBpbmdzIiwic1NlbWFudGljT2JqZWN0Iiwib1BhcmFtcyIsImFTZW1hbnRpY09iamVjdE1hcHBpbmdzIiwiaGFzQ2hhbmdlZCIsImZvckVhY2giLCJtYXBwaW5nIiwibWFwcGluZ1NlbWFudGljT2JqZWN0Iiwic2VtYW50aWNPYmplY3QiLCJkeW5hbWljU2VtT2JqZWN0UmVnZXgiLCJvTWFwcGluZ3MiLCJpdGVtcyIsImkiLCJzTG9jYWxQcm9wZXJ0eSIsImtleSIsInNTZW1hbnRpY09iamVjdFByb3BlcnR5IiwicmVtb3ZlUGFyYW1ldGVyIiwicmVtb3ZlU2VsZWN0T3B0aW9uIiwicmVuYW1lUGFyYW1ldGVyIiwicmVuYW1lU2VsZWN0T3B0aW9uIiwicGFyYW1zIiwiX2dldExpbmtJdGVtV2l0aE5ld1BhcmFtZXRlciIsIl90aGF0IiwiX29MaW5rSXRlbSIsIl9vU2hlbGxTZXJ2aWNlcyIsIl9vUGFyYW1zIiwiX3NBcHBTdGF0ZUtleSIsIl9vU2VsZWN0aW9uVmFyaWFudCIsIl9vTmF2aWdhdGlvblNlcnZpY2UiLCJjaGVja1RpdGxlTGluayIsIl9wcm9taXNlIiwiZXhwYW5kQ29tcGFjdEhhc2giLCJzSGFzaCIsIm9OZXdTaGVsbEhhc2giLCJ0YXJnZXQiLCJvU2hlbGxIYXNoIiwiYWN0aW9uIiwib05ld1BhcmFtcyIsImFwcFN0YXRlS2V5Iiwic2V0SHJlZiIsImNvbnN0cnVjdFNoZWxsSGFzaCIsImFTZW1hbnRpY0xpbmtzIiwicHVzaCIsImJpbmQiLCJwYXJzZVNoZWxsSGFzaCIsInNlbWFudGljT2JqZWN0TWFwcGluZ3MiLCJ0b0VTNlByb21pc2UiLCJnZXRBcHBTdGF0ZUtleUFuZFVybFBhcmFtZXRlcnMiLCJ0b0pTT05TdHJpbmciLCJhVmFsdWVzIiwibGlua2l0ZW1wcm9taXNlIiwibW9kaWZ5TGlua0l0ZW1zIiwiRmllbGRIZWxwZXIiLCJjaGVja1ByaW1hcnlBY3Rpb25zIiwicHJpbWFyeUFjdGlvbklzQWN0aXZlIiwiYVRpdGxlTGluayIsInRpdGxlTGluayIsImJUaXRsZUhhc0xpbmsiLCJoYXNUaXRsZUxpbmsiLCJDb21tb25VdGlscyIsImdldFRhcmdldFZpZXciLCJvQXBwQ29tcG9uZW50IiwiZ2V0QXBwQ29tcG9uZW50Iiwib1NoZWxsU2VydmljZXMiLCJnZXRTaGVsbFNlcnZpY2VzIiwiaGFzVVNoZWxsIiwib1RhcmdldEluZm8iLCJtYWluU2VtYW50aWNPYmplY3QiLCJnZXROYXZpZ2F0aW9uU2VydmljZSIsIm9Db250cm9sbGVyIiwiZ2V0Q29udHJvbGxlciIsIm1MaW5lQ29udGV4dERhdGEiLCJzTWV0YVBhdGgiLCJnZXRNZXRhUGF0aCIsImdldFBhdGgiLCJfaW50ZW50QmFzZWROYXZpZ2F0aW9uIiwicmVtb3ZlU2Vuc2l0aXZlRGF0YSIsInByZXBhcmVDb250ZXh0Rm9yRXh0ZXJuYWxOYXZpZ2F0aW9uIiwibWl4QXR0cmlidXRlc0FuZFNlbGVjdGlvblZhcmlhbnQiLCJzZW1hbnRpY0F0dHJpYnV0ZXMiLCJTZWxlY3Rpb25WYXJpYW50IiwicHJvcGVydGllc1dpdGhvdXRDb25mbGljdCIsImludGVudEJhc2VkTmF2aWdhdGlvbiIsImFkYXB0TmF2aWdhdGlvbkNvbnRleHQiLCJfcmVtb3ZlVGVjaG5pY2FsUGFyYW1ldGVycyIsIkxpbmtzV2l0aE5ld1BhcmFtZXRlcnNQcm9taXNlcyIsIl9MaW5rUHJvbWlzZVJlc3VsdCIsImluZGV4IiwiYWxsIiwiYmVmb3JlTmF2aWdhdGlvbkNhbGxiYWNrIiwib0V2ZW50Iiwib1NvdXJjZSIsImdldFNvdXJjZSIsInNIcmVmIiwiZ2V0UGFyYW1ldGVyIiwib1VSTFBhcnNpbmciLCJGYWN0b3J5IiwiZ2V0U2VydmljZSIsIm9IYXNoIiwiS2VlcEFsaXZlSGVscGVyIiwic3RvcmVDb250cm9sUmVmcmVzaFN0cmF0ZWd5Rm9ySGFzaCIsIl9nZXRTZW1hbnRpY09iamVjdEN1c3RvbURhdGFWYWx1ZSIsIm9TZW1hbnRpY09iamVjdHNSZXNvbHZlZCIsInNQcm9wZXJ0eU5hbWUiLCJzQ3VzdG9tRGF0YVZhbHVlIiwiaUN1c3RvbURhdGFDb3VudCIsImdldEtleSIsImdldFZhbHVlIiwiX2NyZWF0ZU5ld1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkIiwibmV3UGF5bG9hZCIsInNTZW1hbnRpY09iamVjdE5hbWUiLCJfc1RtcFByb3BlcnR5TmFtZSIsImluZGV4T2YiLCJzdWJzdHIiLCJzZW1hbnRpY09iamVjdHNSZXNvbHZlZCIsIkFycmF5IiwiaXNBcnJheSIsImoiLCJfc2V0UGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQiLCJvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQiLCJwcm9wZXJ0eVBhdGhMYWJlbCIsImRlZXBDbG9uZSIsIl9TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucyIsInNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zIiwiX0luZGV4IiwiX29TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9uIiwiZmluZEluZGV4IiwiaU5ld1NlbWFudGljT2JqZWN0c0NvdW50Iiwic3BsaWNlIiwiaU1hcHBpbmdzQ291bnQiLCJfZ2V0UGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQiLCJfdXBkYXRlUGF5bG9hZFdpdGhTZW1hbnRpY0F0dHJpYnV0ZXMiLCJhU2VtYW50aWNPYmplY3RzIiwib1Jlc3VsdHMiLCJtU2VtYW50aWNPYmplY3RNYXBwaW5ncyIsImFkZENvbnRleHRPYmplY3QiLCJzQXR0cmlidXRlTmFtZSIsIm9BdHRyaWJ1dGUiLCJvVHJhbnNmb3JtYXRpb25BZGRpdGlvbmFsIiwiZ2V0U2VtYW50aWNPYmplY3RBdHRyaWJ1dGUiLCJjcmVhdGVBdHRyaWJ1dGVTdHJ1Y3R1cmUiLCJhZGRTZW1hbnRpY09iamVjdEF0dHJpYnV0ZSIsInRyYW5zZm9ybWF0aW9ucyIsImRlc2NyaXB0aW9uIiwiaXNQbGFpbk9iamVjdCIsImFLZXlzIiwia2V5cyIsInNOZXdBdHRyaWJ1dGVOYW1lTWFwcGVkIiwic05ld0F0dHJpYnV0ZU5hbWUiLCJzVmFsdWUiLCJzS2V5Iiwic0F0dHJpYnV0ZU5hbWVNYXBwZWQiLCJyZWFzb24iLCJhQXR0cmlidXRlTmV3IiwiX2NvbnZlcnRTZW1hbnRpY09iamVjdE1hcHBpbmciLCJfZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5ncyIsInNBcHBTdGF0ZUtleSIsIm9OYXZpZ2F0aW9uVGFyZ2V0cyIsIm93bk5hdmlnYXRpb24iLCJhdmFpbGFibGVBY3Rpb25zIiwiaVN1cGVyaW9yQWN0aW9uTGlua3NGb3VuZCIsIkNvcmUiLCJsb2FkTGlicmFyeSIsImFzeW5jIiwic2FwIiwidWkiLCJyZXF1aXJlIiwiVXRpbHMiLCJnZXRBcHBDb21wb25lbnRGb3JDb250cm9sIiwiYVBhcmFtcyIsInNvcnRSZXN1bHRzQnkiLCJnZXRMaW5rcyIsImJIYXNMaW5rcyIsImFTZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucyIsIl9nZXRTZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucyIsIm9VbmF2YWlsYWJsZUFjdGlvbnMiLCJfY29udmVydFNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb24iLCJzQ3VycmVudEhhc2giLCJGaWVsZFJ1bnRpbWUiLCJfZm5GaXhIYXNoUXVlcnlTdHJpbmciLCJnZXRIYXNoIiwiZm5Jc1VuYXZhaWxhYmxlQWN0aW9uIiwic0FjdGlvbiIsImZuQWRkTGluayIsInNoZWxsSGFzaCIsImljb24iLCJpbml0aWFsbHlWaXNpYmxlIiwidGFncyIsImFkZFNlbWFudGljT2JqZWN0SW50ZW50IiwibiIsImlMaW5rSXRlbUluZGV4Iiwib1NlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb24iLCJTZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9uIiwiYWN0aW9ucyIsImFTZW1hbnRpY09iamVjdE1hcHBpbmdJdGVtcyIsIm9TZW1hbnRpY09iamVjdE1hcHBpbmciLCJvU2VtYW50aWNPYmplY3RNYXBwaW5nSXRlbSIsIlNlbWFudGljT2JqZWN0TWFwcGluZ0l0ZW0iLCJTZW1hbnRpY09iamVjdE1hcHBpbmciLCJnZXRTZW1hbnRpY09iamVjdCIsImdldEl0ZW1zIiwicmVkdWNlIiwib01hcCIsIm9JdGVtIiwiX1NlbWFudGljT2JqZWN0TmFtZSIsIl9TZW1hbnRpY09iamVjdEhhc0FscmVhZHlVbmF2YWlsYWJsZUFjdGlvbnMiLCJfVW5hdmFpbGFibGVBY3Rpb25zIiwibVNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zIiwib1NlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zIiwiZ2V0QWN0aW9ucyIsIlVuYXZhaWxhYmxlQWN0aW9uIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJRdWlja1ZpZXdMaW5rRGVsZWdhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZyBmcm9tIFwic2FwL2Jhc2UvTG9nXCI7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gXCJzYXAvYmFzZS91dGlsL2RlZXBDbG9uZVwiO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSBcInNhcC9iYXNlL3V0aWwvaXNQbGFpbk9iamVjdFwiO1xuaW1wb3J0IENvbW1vblV0aWxzIGZyb20gXCJzYXAvZmUvY29yZS9Db21tb25VdGlsc1wiO1xuaW1wb3J0IEtlZXBBbGl2ZUhlbHBlciBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9LZWVwQWxpdmVIZWxwZXJcIjtcbmltcG9ydCB0b0VTNlByb21pc2UgZnJvbSBcInNhcC9mZS9jb3JlL2hlbHBlcnMvVG9FUzZQcm9taXNlXCI7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gXCJzYXAvZmUvY29yZS9zZXJ2aWNlcy9OYXZpZ2F0aW9uU2VydmljZUZhY3RvcnlcIjtcbmltcG9ydCBGaWVsZEhlbHBlciBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWVsZC9GaWVsZEhlbHBlclwiO1xuaW1wb3J0IEZpZWxkUnVudGltZSBmcm9tIFwic2FwL2ZlL21hY3Jvcy9maWVsZC9GaWVsZFJ1bnRpbWVcIjtcbmltcG9ydCBTZWxlY3Rpb25WYXJpYW50IGZyb20gXCJzYXAvZmUvbmF2aWdhdGlvbi9TZWxlY3Rpb25WYXJpYW50XCI7XG5pbXBvcnQgQ29yZSBmcm9tIFwic2FwL3VpL2NvcmUvQ29yZVwiO1xuaW1wb3J0IEZyYWdtZW50IGZyb20gXCJzYXAvdWkvY29yZS9GcmFnbWVudFwiO1xuaW1wb3J0IFhNTFByZXByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvdXRpbC9YTUxQcmVwcm9jZXNzb3JcIjtcbmltcG9ydCBYTUxUZW1wbGF0ZVByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvWE1MVGVtcGxhdGVQcm9jZXNzb3JcIjtcbmltcG9ydCBGYWN0b3J5IGZyb20gXCJzYXAvdWkvbWRjL2xpbmsvRmFjdG9yeVwiO1xuaW1wb3J0IExpbmtJdGVtIGZyb20gXCJzYXAvdWkvbWRjL2xpbmsvTGlua0l0ZW1cIjtcbmltcG9ydCBTZW1hbnRpY09iamVjdE1hcHBpbmcgZnJvbSBcInNhcC91aS9tZGMvbGluay9TZW1hbnRpY09iamVjdE1hcHBpbmdcIjtcbmltcG9ydCBTZW1hbnRpY09iamVjdE1hcHBpbmdJdGVtIGZyb20gXCJzYXAvdWkvbWRjL2xpbmsvU2VtYW50aWNPYmplY3RNYXBwaW5nSXRlbVwiO1xuaW1wb3J0IFNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb24gZnJvbSBcInNhcC91aS9tZGMvbGluay9TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9uXCI7XG5pbXBvcnQgTGlua0RlbGVnYXRlIGZyb20gXCJzYXAvdWkvbWRjL0xpbmtEZWxlZ2F0ZVwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IHR5cGUgT0RhdGFNZXRhTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9PRGF0YU1ldGFNb2RlbFwiO1xudHlwZSBSZWdpc3RlcmVkU2VtYW50aWNPYmplY3RNYXBwaW5ncyA9IHsgc2VtYW50aWNPYmplY3Q6IHN0cmluZzsgaXRlbXM6IHsga2V5OiBzdHJpbmc7IHZhbHVlOiBzdHJpbmcgfVtdIH1bXTtcblxuY29uc3QgU2ltcGxlTGlua0RlbGVnYXRlID0gT2JqZWN0LmFzc2lnbih7fSwgTGlua0RlbGVnYXRlKSBhcyBhbnk7XG5jb25zdCBDT05TVEFOVFMgPSB7XG5cdGlMaW5rc1Nob3duSW5Qb3B1cDogMyxcblx0c2FwbUxpbms6IFwic2FwLm0uTGlua1wiLFxuXHRzYXB1aW1kY0xpbms6IFwic2FwLnVpLm1kYy5MaW5rXCIsXG5cdHNhcG1PYmplY3RJZGVudGlmaWVyOiBcInNhcC5tLk9iamVjdElkZW50aWZpZXJcIixcblx0c2FwbU9iamVjdFN0YXR1czogXCJzYXAubS5PYmplY3RTdGF0dXNcIlxufTtcblNpbXBsZUxpbmtEZWxlZ2F0ZS5nZXRDb25zdGFudHMgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBDT05TVEFOVFM7XG59O1xuLyoqXG4gKiBUaGlzIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBTZW1hbnRpY09iamVjdHMgYXMgc3RyaW5ncyBnaXZlbiBieSB0aGUgcGF5bG9hZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIG9QYXlsb2FkIFRoZSBwYXlsb2FkIGRlZmluZWQgYnkgdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0gb01ldGFNb2RlbCBUaGUgT0RhdGFNZXRhTW9kZWwgcmVjZWl2ZWQgZnJvbSB0aGUgTGlua1xuICogQHJldHVybnMgVGhlIGNvbnRleHQgcG9pbnRpbmcgdG8gdGhlIGN1cnJlbnQgRW50aXR5VHlwZS5cbiAqL1xuU2ltcGxlTGlua0RlbGVnYXRlLl9nZXRFbnRpdHlUeXBlID0gZnVuY3Rpb24gKG9QYXlsb2FkOiBhbnksIG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsKSB7XG5cdGlmIChvTWV0YU1vZGVsKSB7XG5cdFx0cmV0dXJuIG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQob1BheWxvYWQuZW50aXR5VHlwZSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fVxufTtcbi8qKlxuICogVGhpcyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgU2VtYW50aWNPYmplY3RzIGFzIHN0cmluZ3MgZ2l2ZW4gYnkgdGhlIHBheWxvYWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSBvUGF5bG9hZCBUaGUgcGF5bG9hZCBkZWZpbmVkIGJ5IHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIG9NZXRhTW9kZWwgVGhlIE9EYXRhTWV0YU1vZGVsIHJlY2VpdmVkIGZyb20gdGhlIExpbmtcbiAqIEByZXR1cm5zIEEgbW9kZWwgY29udGFpbmluZyB0aGUgcGF5bG9hZCBpbmZvcm1hdGlvblxuICovXG5TaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljc01vZGVsID0gZnVuY3Rpb24gKG9QYXlsb2FkOiBvYmplY3QsIG9NZXRhTW9kZWw6IG9iamVjdCkge1xuXHRpZiAob01ldGFNb2RlbCkge1xuXHRcdHJldHVybiBuZXcgSlNPTk1vZGVsKG9QYXlsb2FkKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59O1xuLyoqXG4gKiBUaGlzIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBTZW1hbnRpY09iamVjdHMgYXMgc3RyaW5ncyBnaXZlbiBieSB0aGUgcGF5bG9hZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIG9QYXlsb2FkIFRoZSBwYXlsb2FkIGRlZmluZWQgYnkgdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0gb01ldGFNb2RlbCBUaGUgT0RhdGFNZXRhTW9kZWwgcmVjZWl2ZWQgZnJvbSB0aGUgTGlua1xuICogQHJldHVybnMgQW4gYXJyYXkgY29udGFpbmluZyBTZW1hbnRpY09iamVjdHMgYmFzZWQgb2YgdGhlIHBheWxvYWRcbiAqL1xuU2ltcGxlTGlua0RlbGVnYXRlLl9nZXREYXRhRmllbGQgPSBmdW5jdGlvbiAob1BheWxvYWQ6IGFueSwgb01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwpIHtcblx0cmV0dXJuIG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQob1BheWxvYWQuZGF0YUZpZWxkKTtcbn07XG4vKipcbiAqIFRoaXMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIFNlbWFudGljT2JqZWN0cyBhcyBzdHJpbmdzIGdpdmVuIGJ5IHRoZSBwYXlsb2FkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0gb1BheWxvYWQgVGhlIHBheWxvYWQgZGVmaW5lZCBieSB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSBvTWV0YU1vZGVsIFRoZSBPRGF0YU1ldGFNb2RlbCByZWNlaXZlZCBmcm9tIHRoZSBMaW5rXG4gKiBAcmV0dXJucyBBbmNvbnRhaW5pbmcgU2VtYW50aWNPYmplY3RzIGJhc2VkIG9mIHRoZSBwYXlsb2FkXG4gKi9cblNpbXBsZUxpbmtEZWxlZ2F0ZS5fZ2V0Q29udGFjdCA9IGZ1bmN0aW9uIChvUGF5bG9hZDogYW55LCBvTWV0YU1vZGVsOiBPRGF0YU1ldGFNb2RlbCkge1xuXHRyZXR1cm4gb01ldGFNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChvUGF5bG9hZC5jb250YWN0KTtcbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuZm5UZW1wbGF0ZUZyYWdtZW50ID0gZnVuY3Rpb24gKCkge1xuXHRsZXQgc0ZyYWdtZW50TmFtZTogc3RyaW5nLCB0aXRsZUxpbmtIcmVmO1xuXHRjb25zdCBvRnJhZ21lbnRNb2RlbDogYW55ID0ge307XG5cdGxldCBvUGF5bG9hZFRvVXNlO1xuXG5cdC8vIHBheWxvYWQgaGFzIGJlZW4gbW9kaWZpZWQgYnkgZmV0Y2hpbmcgU2VtYW50aWMgT2JqZWN0cyBuYW1lcyB3aXRoIHBhdGhcblx0aWYgKHRoaXMucmVzb2x2ZWRwYXlsb2FkKSB7XG5cdFx0b1BheWxvYWRUb1VzZSA9IHRoaXMucmVzb2x2ZWRwYXlsb2FkO1xuXHR9IGVsc2Uge1xuXHRcdG9QYXlsb2FkVG9Vc2UgPSB0aGlzLnBheWxvYWQ7XG5cdH1cblxuXHRpZiAob1BheWxvYWRUb1VzZSAmJiAhb1BheWxvYWRUb1VzZS5MaW5rSWQpIHtcblx0XHRvUGF5bG9hZFRvVXNlLkxpbmtJZCA9IHRoaXMub0NvbnRyb2wgJiYgdGhpcy5vQ29udHJvbC5pc0EoQ09OU1RBTlRTLnNhcHVpbWRjTGluaykgPyB0aGlzLm9Db250cm9sLmdldElkKCkgOiB1bmRlZmluZWQ7XG5cdH1cblxuXHRpZiAob1BheWxvYWRUb1VzZS5MaW5rSWQpIHtcblx0XHR0aXRsZUxpbmtIcmVmID0gdGhpcy5vQ29udHJvbC5nZXRNb2RlbChcIiRzYXB1aW1kY0xpbmtcIikuZ2V0UHJvcGVydHkoXCIvdGl0bGVMaW5rSHJlZlwiKTtcblx0XHRvUGF5bG9hZFRvVXNlLnRpdGxlbGluayA9IHRpdGxlTGlua0hyZWY7XG5cdH1cblxuXHRjb25zdCBvU2VtYW50aWNzTW9kZWwgPSB0aGlzLl9nZXRTZW1hbnRpY3NNb2RlbChvUGF5bG9hZFRvVXNlLCB0aGlzLm9NZXRhTW9kZWwpO1xuXG5cdGlmIChvUGF5bG9hZFRvVXNlLmVudGl0eVR5cGUgJiYgdGhpcy5fZ2V0RW50aXR5VHlwZShvUGF5bG9hZFRvVXNlLCB0aGlzLm9NZXRhTW9kZWwpKSB7XG5cdFx0c0ZyYWdtZW50TmFtZSA9IFwic2FwLmZlLm1hY3Jvcy5maWVsZC5RdWlja1ZpZXdMaW5rRm9yRW50aXR5XCI7XG5cdFx0b0ZyYWdtZW50TW9kZWwuYmluZGluZ0NvbnRleHRzID0ge1xuXHRcdFx0XCJlbnRpdHlUeXBlXCI6IHRoaXMuX2dldEVudGl0eVR5cGUob1BheWxvYWRUb1VzZSwgdGhpcy5vTWV0YU1vZGVsKSxcblx0XHRcdFwic2VtYW50aWNcIjogb1NlbWFudGljc01vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKVxuXHRcdH07XG5cdFx0b0ZyYWdtZW50TW9kZWwubW9kZWxzID0ge1xuXHRcdFx0XCJlbnRpdHlUeXBlXCI6IHRoaXMub01ldGFNb2RlbCxcblx0XHRcdFwic2VtYW50aWNcIjogb1NlbWFudGljc01vZGVsXG5cdFx0fTtcblx0fSBlbHNlIGlmIChvUGF5bG9hZFRvVXNlLmRhdGFGaWVsZCAmJiB0aGlzLl9nZXREYXRhRmllbGQob1BheWxvYWRUb1VzZSwgdGhpcy5vTWV0YU1vZGVsKSkge1xuXHRcdHNGcmFnbWVudE5hbWUgPSBcInNhcC5mZS5tYWNyb3MuZmllbGQuUXVpY2tWaWV3TGlua0ZvckRhdGFGaWVsZFwiO1xuXHRcdG9GcmFnbWVudE1vZGVsLmJpbmRpbmdDb250ZXh0cyA9IHtcblx0XHRcdFwiZGF0YUZpZWxkXCI6IHRoaXMuX2dldERhdGFGaWVsZChvUGF5bG9hZFRvVXNlLCB0aGlzLm9NZXRhTW9kZWwpLFxuXHRcdFx0XCJzZW1hbnRpY1wiOiBvU2VtYW50aWNzTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpXG5cdFx0fTtcblx0XHRvRnJhZ21lbnRNb2RlbC5tb2RlbHMgPSB7XG5cdFx0XHRcImRhdGFGaWVsZFwiOiB0aGlzLm9NZXRhTW9kZWwsXG5cdFx0XHRcInNlbWFudGljXCI6IG9TZW1hbnRpY3NNb2RlbFxuXHRcdH07XG5cdH0gZWxzZSBpZiAob1BheWxvYWRUb1VzZS5jb250YWN0ICYmIHRoaXMuX2dldENvbnRhY3Qob1BheWxvYWRUb1VzZSwgdGhpcy5vTWV0YU1vZGVsKSkge1xuXHRcdHNGcmFnbWVudE5hbWUgPSBcInNhcC5mZS5tYWNyb3MuZmllbGQuUXVpY2tWaWV3TGlua0ZvckNvbnRhY3RcIjtcblx0XHRvRnJhZ21lbnRNb2RlbC5iaW5kaW5nQ29udGV4dHMgPSB7XG5cdFx0XHRcImNvbnRhY3RcIjogdGhpcy5fZ2V0Q29udGFjdChvUGF5bG9hZFRvVXNlLCB0aGlzLm9NZXRhTW9kZWwpXG5cdFx0fTtcblx0XHRvRnJhZ21lbnRNb2RlbC5tb2RlbHMgPSB7XG5cdFx0XHRcImNvbnRhY3RcIjogdGhpcy5vTWV0YU1vZGVsXG5cdFx0fTtcblx0fVxuXHRvRnJhZ21lbnRNb2RlbC5tb2RlbHMuZW50aXR5U2V0ID0gdGhpcy5vTWV0YU1vZGVsO1xuXHRvRnJhZ21lbnRNb2RlbC5tb2RlbHMubWV0YU1vZGVsID0gdGhpcy5vTWV0YU1vZGVsO1xuXHRpZiAodGhpcy5vQ29udHJvbCAmJiB0aGlzLm9Db250cm9sLmdldE1vZGVsKFwidmlld0RhdGFcIikpIHtcblx0XHRvRnJhZ21lbnRNb2RlbC5tb2RlbHMudmlld0RhdGEgPSB0aGlzLm9Db250cm9sLmdldE1vZGVsKFwidmlld0RhdGFcIik7XG5cdFx0b0ZyYWdtZW50TW9kZWwuYmluZGluZ0NvbnRleHRzLnZpZXdEYXRhID0gdGhpcy5vQ29udHJvbC5nZXRNb2RlbChcInZpZXdEYXRhXCIpLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKTtcblx0fVxuXG5cdGNvbnN0IG9GcmFnbWVudCA9IFhNTFRlbXBsYXRlUHJvY2Vzc29yLmxvYWRUZW1wbGF0ZShzRnJhZ21lbnROYW1lISwgXCJmcmFnbWVudFwiKTtcblxuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFhNTFByZXByb2Nlc3Nvci5wcm9jZXNzKG9GcmFnbWVudCwgeyBuYW1lOiBzRnJhZ21lbnROYW1lISB9LCBvRnJhZ21lbnRNb2RlbCkpXG5cdFx0LnRoZW4oKF9pbnRlcm5hbEZyYWdtZW50OiBhbnkpID0+IHtcblx0XHRcdHJldHVybiBGcmFnbWVudC5sb2FkKHtcblx0XHRcdFx0ZGVmaW5pdGlvbjogX2ludGVybmFsRnJhZ21lbnQsXG5cdFx0XHRcdGNvbnRyb2xsZXI6IHRoaXNcblx0XHRcdH0pO1xuXHRcdH0pXG5cdFx0LnRoZW4oKG9Qb3BvdmVyQ29udGVudDogYW55KSA9PiB7XG5cdFx0XHRpZiAob1BvcG92ZXJDb250ZW50KSB7XG5cdFx0XHRcdGlmIChvRnJhZ21lbnRNb2RlbC5tb2RlbHMgJiYgb0ZyYWdtZW50TW9kZWwubW9kZWxzLnNlbWFudGljKSB7XG5cdFx0XHRcdFx0b1BvcG92ZXJDb250ZW50LnNldE1vZGVsKG9GcmFnbWVudE1vZGVsLm1vZGVscy5zZW1hbnRpYywgXCJzZW1hbnRpY1wiKTtcblx0XHRcdFx0XHRvUG9wb3ZlckNvbnRlbnQuc2V0QmluZGluZ0NvbnRleHQob0ZyYWdtZW50TW9kZWwuYmluZGluZ0NvbnRleHRzLnNlbWFudGljLCBcInNlbWFudGljXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG9GcmFnbWVudE1vZGVsLmJpbmRpbmdDb250ZXh0cyAmJiBvRnJhZ21lbnRNb2RlbC5iaW5kaW5nQ29udGV4dHMuZW50aXR5VHlwZSkge1xuXHRcdFx0XHRcdG9Qb3BvdmVyQ29udGVudC5zZXRNb2RlbChvRnJhZ21lbnRNb2RlbC5tb2RlbHMuZW50aXR5VHlwZSwgXCJlbnRpdHlUeXBlXCIpO1xuXHRcdFx0XHRcdG9Qb3BvdmVyQ29udGVudC5zZXRCaW5kaW5nQ29udGV4dChvRnJhZ21lbnRNb2RlbC5iaW5kaW5nQ29udGV4dHMuZW50aXR5VHlwZSwgXCJlbnRpdHlUeXBlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnJlc29sdmVkcGF5bG9hZCA9IHVuZGVmaW5lZDtcblx0XHRcdHJldHVybiBvUG9wb3ZlckNvbnRlbnQ7XG5cdFx0fSk7XG59O1xuU2ltcGxlTGlua0RlbGVnYXRlLmZldGNoQWRkaXRpb25hbENvbnRlbnQgPSBmdW5jdGlvbiAob1BheUxvYWQ6IGFueSwgb01kY0xpbmtDb250cm9sOiBhbnkpIHtcblx0dGhpcy5vQ29udHJvbCA9IG9NZGNMaW5rQ29udHJvbDtcblx0Y29uc3QgYU5hdmlnYXRlUmVnZXhwTWF0Y2ggPSBvUGF5TG9hZD8ubmF2aWdhdGlvblBhdGg/Lm1hdGNoKC97KC4qPyl9Lyk7XG5cdGNvbnN0IG9CaW5kaW5nQ29udGV4dCA9XG5cdFx0YU5hdmlnYXRlUmVnZXhwTWF0Y2ggJiYgYU5hdmlnYXRlUmVnZXhwTWF0Y2gubGVuZ3RoID4gMSAmJiBhTmF2aWdhdGVSZWdleHBNYXRjaFsxXVxuXHRcdFx0PyBvTWRjTGlua0NvbnRyb2wuZ2V0TW9kZWwoKS5iaW5kQ29udGV4dChhTmF2aWdhdGVSZWdleHBNYXRjaFsxXSwgb01kY0xpbmtDb250cm9sLmdldEJpbmRpbmdDb250ZXh0KCksIHsgJCRvd25SZXF1ZXN0OiB0cnVlIH0pXG5cdFx0XHQ6IG51bGw7XG5cdHRoaXMucGF5bG9hZCA9IG9QYXlMb2FkO1xuXHRpZiAob01kY0xpbmtDb250cm9sICYmIG9NZGNMaW5rQ29udHJvbC5pc0EoQ09OU1RBTlRTLnNhcHVpbWRjTGluaykpIHtcblx0XHR0aGlzLm9NZXRhTW9kZWwgPSBvTWRjTGlua0NvbnRyb2wuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0XHRyZXR1cm4gdGhpcy5mblRlbXBsYXRlRnJhZ21lbnQoKS50aGVuKGZ1bmN0aW9uIChvUG9wb3ZlckNvbnRlbnQ6IGFueSkge1xuXHRcdFx0aWYgKG9CaW5kaW5nQ29udGV4dCkge1xuXHRcdFx0XHRvUG9wb3ZlckNvbnRlbnQuc2V0QmluZGluZ0NvbnRleHQob0JpbmRpbmdDb250ZXh0LmdldEJvdW5kQ29udGV4dCgpKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBbb1BvcG92ZXJDb250ZW50XTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuX2ZldGNoTGlua0N1c3RvbURhdGEgPSBmdW5jdGlvbiAoX29MaW5rOiBhbnkpIHtcblx0aWYgKFxuXHRcdF9vTGluay5nZXRQYXJlbnQoKSAmJlxuXHRcdF9vTGluay5pc0EoQ09OU1RBTlRTLnNhcHVpbWRjTGluaykgJiZcblx0XHQoX29MaW5rLmdldFBhcmVudCgpLmlzQShDT05TVEFOVFMuc2FwbUxpbmspIHx8XG5cdFx0XHRfb0xpbmsuZ2V0UGFyZW50KCkuaXNBKENPTlNUQU5UUy5zYXBtT2JqZWN0SWRlbnRpZmllcikgfHxcblx0XHRcdF9vTGluay5nZXRQYXJlbnQoKS5pc0EoQ09OU1RBTlRTLnNhcG1PYmplY3RTdGF0dXMpKVxuXHQpIHtcblx0XHRyZXR1cm4gX29MaW5rLmdldEN1c3RvbURhdGEoKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG59O1xuLyoqXG4gKiBGZXRjaGVzIHRoZSByZWxldmFudCB7QGxpbmsgc2FwLnVpLm1kYy5saW5rLkxpbmtJdGVtfSBmb3IgdGhlIExpbmsgYW5kIHJldHVybnMgdGhlbS5cbiAqXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gb1BheWxvYWQgVGhlIFBheWxvYWQgb2YgdGhlIExpbmsgZ2l2ZW4gYnkgdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0gb0JpbmRpbmdDb250ZXh0IFRoZSBDb250ZXh0T2JqZWN0IG9mIHRoZSBMaW5rXG4gKiBAcGFyYW0gb0luZm9Mb2cgVGhlIEluZm9Mb2cgb2YgdGhlIExpbmtcbiAqIEByZXR1cm5zIE9uY2UgcmVzb2x2ZWQgYW4gYXJyYXkgb2Yge0BsaW5rIHNhcC51aS5tZGMubGluay5MaW5rSXRlbX0gaXMgcmV0dXJuZWRcbiAqL1xuU2ltcGxlTGlua0RlbGVnYXRlLmZldGNoTGlua0l0ZW1zID0gZnVuY3Rpb24gKG9QYXlsb2FkOiBhbnksIG9CaW5kaW5nQ29udGV4dDogQ29udGV4dCwgb0luZm9Mb2c6IGFueSkge1xuXHRpZiAob0JpbmRpbmdDb250ZXh0ICYmIFNpbXBsZUxpbmtEZWxlZ2F0ZS5fZ2V0U2VtYW50aWNPYmplY3RzKG9QYXlsb2FkKSkge1xuXHRcdGNvbnN0IG9Db250ZXh0T2JqZWN0ID0gb0JpbmRpbmdDb250ZXh0LmdldE9iamVjdCgpO1xuXHRcdGlmIChvSW5mb0xvZykge1xuXHRcdFx0b0luZm9Mb2cuaW5pdGlhbGl6ZShTaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljT2JqZWN0cyhvUGF5bG9hZCkpO1xuXHRcdH1cblx0XHRjb25zdCBfb0xpbmtDdXN0b21EYXRhID0gdGhpcy5fbGluayAmJiB0aGlzLl9mZXRjaExpbmtDdXN0b21EYXRhKHRoaXMuX2xpbmspO1xuXHRcdHRoaXMuYUxpbmtDdXN0b21EYXRhID1cblx0XHRcdF9vTGlua0N1c3RvbURhdGEgJiZcblx0XHRcdHRoaXMuX2ZldGNoTGlua0N1c3RvbURhdGEodGhpcy5fbGluaykubWFwKGZ1bmN0aW9uIChsaW5rSXRlbTogYW55KSB7XG5cdFx0XHRcdHJldHVybiBsaW5rSXRlbS5tUHJvcGVydGllcy52YWx1ZTtcblx0XHRcdH0pO1xuXG5cdFx0Y29uc3Qgb1NlbWFudGljQXR0cmlidXRlc1Jlc29sdmVkID0gU2ltcGxlTGlua0RlbGVnYXRlLl9jYWxjdWxhdGVTZW1hbnRpY0F0dHJpYnV0ZXMob0NvbnRleHRPYmplY3QsIG9QYXlsb2FkLCBvSW5mb0xvZywgdGhpcy5fbGluayk7XG5cdFx0Y29uc3Qgb1NlbWFudGljQXR0cmlidXRlcyA9IG9TZW1hbnRpY0F0dHJpYnV0ZXNSZXNvbHZlZC5yZXN1bHRzO1xuXHRcdGNvbnN0IG9QYXlsb2FkUmVzb2x2ZWQgPSBvU2VtYW50aWNBdHRyaWJ1dGVzUmVzb2x2ZWQucGF5bG9hZDtcblxuXHRcdHJldHVybiBTaW1wbGVMaW5rRGVsZWdhdGUuX3JldHJpZXZlTmF2aWdhdGlvblRhcmdldHMoXCJcIiwgb1NlbWFudGljQXR0cmlidXRlcywgb1BheWxvYWRSZXNvbHZlZCwgb0luZm9Mb2csIHRoaXMuX2xpbmspLnRoZW4oXG5cdFx0XHRmdW5jdGlvbiAoYUxpbmtzOiBhbnkgLypvT3duTmF2aWdhdGlvbkxpbms6IGFueSovKSB7XG5cdFx0XHRcdHJldHVybiBhTGlua3MubGVuZ3RoID09PSAwID8gbnVsbCA6IGFMaW5rcztcblx0XHRcdH1cblx0XHQpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG5cdH1cbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuZmV0Y2hMaW5rVHlwZSA9IGZ1bmN0aW9uIChvUGF5bG9hZDogYW55LCBvTGluazogYW55KSB7XG5cdGNvbnN0IF9vQ3VycmVudExpbmsgPSBvTGluaztcblx0Y29uc3QgX29QYXlsb2FkID0gT2JqZWN0LmFzc2lnbih7fSwgb1BheWxvYWQpO1xuXHRjb25zdCBvRGVmYXVsdEluaXRpYWxUeXBlID0ge1xuXHRcdGluaXRpYWxUeXBlOiB7XG5cdFx0XHR0eXBlOiAyLFxuXHRcdFx0ZGlyZWN0TGluazogdW5kZWZpbmVkXG5cdFx0fSxcblx0XHRydW50aW1lVHlwZTogdW5kZWZpbmVkXG5cdH07XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogKHZhbHVlOiBhbnkpID0+IHZvaWQsIHJlamVjdDogKHZhbHVlOiBhbnkpID0+IHZvaWQpID0+IHtcblx0XHRpZiAoX29QYXlsb2FkPy5zZW1hbnRpY09iamVjdHMpIHtcblx0XHRcdHRoaXMuX2xpbmsgPSBvTGluaztcblxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShfb0N1cnJlbnRMaW5rLnJldHJpZXZlTGlua0l0ZW1zKCkpLnRoZW4oZnVuY3Rpb24gKGFMaW5rSXRlbXM6IGFueSkge1xuXHRcdFx0XHRsZXQgb0xpbmtJdGVtO1xuXHRcdFx0XHRsZXQgbkxpbmtUeXBlO1xuXHRcdFx0XHRpZiAoYUxpbmtJdGVtcz8ubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0b0xpbmtJdGVtID0gbmV3IExpbmtJdGVtKHtcblx0XHRcdFx0XHRcdHRleHQ6IGFMaW5rSXRlbXNbMF0uZ2V0VGV4dCgpLFxuXHRcdFx0XHRcdFx0aHJlZjogYUxpbmtJdGVtc1swXS5nZXRIcmVmKClcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRuTGlua1R5cGUgPSBfb1BheWxvYWQuaGFzUXVpY2tWaWV3RmFjZXRzID09PSBcImZhbHNlXCIgPyAxIDogMjtcblx0XHRcdFx0fSBlbHNlIGlmIChfb1BheWxvYWQuaGFzUXVpY2tWaWV3RmFjZXRzID09PSBcImZhbHNlXCIgJiYgYUxpbmtJdGVtcz8ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0bkxpbmtUeXBlID0gMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuTGlua1R5cGUgPSAyO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJlc29sdmUoe1xuXHRcdFx0XHRcdGluaXRpYWxUeXBlOiB7XG5cdFx0XHRcdFx0XHR0eXBlOiBuTGlua1R5cGUsXG5cdFx0XHRcdFx0XHRkaXJlY3RMaW5rOiBvTGlua0l0ZW0gPyBvTGlua0l0ZW0gOiB1bmRlZmluZWRcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHJ1bnRpbWVUeXBlOiB1bmRlZmluZWRcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2UgaWYgKF9vUGF5bG9hZD8uY29udGFjdD8ubGVuZ3RoID4gMCkge1xuXHRcdFx0cmVzb2x2ZShvRGVmYXVsdEluaXRpYWxUeXBlKTtcblx0XHR9IGVsc2UgaWYgKF9vUGF5bG9hZD8uZW50aXR5VHlwZSAmJiBfb1BheWxvYWQ/Lm5hdmlnYXRpb25QYXRoKSB7XG5cdFx0XHRyZXNvbHZlKG9EZWZhdWx0SW5pdGlhbFR5cGUpO1xuXHRcdH1cblx0XHRyZWplY3QobmV3IEVycm9yKFwibm8gcGF5bG9hZCBvciBzZW1hbnRpY09iamVjdHMgZm91bmRcIikpO1xuXHR9KS5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRMb2cuZXJyb3IoXCJFcnJvciBpbiBTaW1wbGVMaW5rRGVsZWdhdGUuZmV0Y2hMaW5rVHlwZVwiLCBvRXJyb3IpO1xuXHR9KTtcbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuX1JlbW92ZVRpdGxlTGlua0Zyb21UYXJnZXRzID0gZnVuY3Rpb24gKF9hTGlua0l0ZW1zOiBhbnksIF9iVGl0bGVIYXNMaW5rOiBib29sZWFuLCBfYVRpdGxlTGluazogYW55KSB7XG5cdGxldCBfc1RpdGxlTGlua0hyZWYsIF9vTURDTGluaztcblx0bGV0IGJSZXN1bHQ6IGJvb2xlYW4gPSBmYWxzZTtcblx0aWYgKF9iVGl0bGVIYXNMaW5rICYmIF9hVGl0bGVMaW5rICYmIF9hVGl0bGVMaW5rWzBdKSB7XG5cdFx0bGV0IF9zTGlua0lzUHJpbWFyeUFjdGlvbiwgX3NMaW5rSW50ZW50V2l0aG91dFBhcmFtZXRlcnM7XG5cdFx0Y29uc3QgX3NUaXRsZUludGVudCA9IF9hVGl0bGVMaW5rWzBdLmludGVudC5zcGxpdChcIj9cIilbMF07XG5cdFx0aWYgKF9hTGlua0l0ZW1zICYmIF9hTGlua0l0ZW1zWzBdKSB7XG5cdFx0XHRfc0xpbmtJbnRlbnRXaXRob3V0UGFyYW1ldGVycyA9IGAjJHtfYUxpbmtJdGVtc1swXS5nZXRQcm9wZXJ0eShcImtleVwiKX1gO1xuXHRcdFx0X3NMaW5rSXNQcmltYXJ5QWN0aW9uID0gX3NUaXRsZUludGVudCA9PT0gX3NMaW5rSW50ZW50V2l0aG91dFBhcmFtZXRlcnM7XG5cdFx0XHRpZiAoX3NMaW5rSXNQcmltYXJ5QWN0aW9uKSB7XG5cdFx0XHRcdF9zVGl0bGVMaW5rSHJlZiA9IF9hTGlua0l0ZW1zWzBdLmdldFByb3BlcnR5KFwiaHJlZlwiKTtcblx0XHRcdFx0dGhpcy5wYXlsb2FkLnRpdGxlbGlua2hyZWYgPSBfc1RpdGxlTGlua0hyZWY7XG5cdFx0XHRcdGlmIChfYUxpbmtJdGVtc1swXS5pc0EoXCJzYXAudWkubWRjLmxpbmsuTGlua0l0ZW1cIikpIHtcblx0XHRcdFx0XHRfb01EQ0xpbmsgPSBfYUxpbmtJdGVtc1swXS5nZXRQYXJlbnQoKTtcblx0XHRcdFx0XHRfb01EQ0xpbmsuZ2V0TW9kZWwoXCIkc2FwdWltZGNMaW5rXCIpLnNldFByb3BlcnR5KFwiL3RpdGxlTGlua0hyZWZcIiwgX3NUaXRsZUxpbmtIcmVmKTtcblx0XHRcdFx0XHRiUmVzdWx0ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4ge1xuXHRcdGxpbmtzOiBfYUxpbmtJdGVtcyxcblx0XHR0aXRsZWxpbmtyZW1vdmVkOiBiUmVzdWx0XG5cdH07XG59O1xuU2ltcGxlTGlua0RlbGVnYXRlLl9Jc1NlbWFudGljT2JqZWN0RHluYW1pYyA9IGZ1bmN0aW9uIChhTmV3TGlua0N1c3RvbURhdGE6IGFueSwgb1RoaXM6IGFueSkge1xuXHRpZiAoYU5ld0xpbmtDdXN0b21EYXRhICYmIG9UaGlzLmFMaW5rQ3VzdG9tRGF0YSkge1xuXHRcdHJldHVybiAoXG5cdFx0XHRvVGhpcy5hTGlua0N1c3RvbURhdGEuZmlsdGVyKGZ1bmN0aW9uIChsaW5rOiBhbnkpIHtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRhTmV3TGlua0N1c3RvbURhdGEuZmlsdGVyKGZ1bmN0aW9uIChvdGhlckxpbms6IGFueSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG90aGVyTGluayAhPT0gbGluaztcblx0XHRcdFx0XHR9KS5sZW5ndGggPiAwXG5cdFx0XHRcdCk7XG5cdFx0XHR9KS5sZW5ndGggPiAwXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuX2dldExpbmVDb250ZXh0ID0gZnVuY3Rpb24gKG9WaWV3OiBhbnksIG1MaW5lQ29udGV4dDogYW55KSB7XG5cdGlmICghbUxpbmVDb250ZXh0KSB7XG5cdFx0aWYgKG9WaWV3LmdldEFnZ3JlZ2F0aW9uKFwiY29udGVudFwiKVswXSAmJiBvVmlldy5nZXRBZ2dyZWdhdGlvbihcImNvbnRlbnRcIilbMF0uZ2V0QmluZGluZ0NvbnRleHQoKSkge1xuXHRcdFx0cmV0dXJuIG9WaWV3LmdldEFnZ3JlZ2F0aW9uKFwiY29udGVudFwiKVswXS5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbUxpbmVDb250ZXh0O1xufTtcblNpbXBsZUxpbmtEZWxlZ2F0ZS5fc2V0RmlsdGVyQ29udGV4dFVybEZvclNlbGVjdGlvblZhcmlhbnQgPSBmdW5jdGlvbiAob1ZpZXc6IGFueSwgb1NlbGVjdGlvblZhcmlhbnQ6IGFueSwgb05hdmlnYXRpb25TZXJ2aWNlOiBhbnkpIHtcblx0aWYgKG9WaWV3LmdldFZpZXdEYXRhKCkuZW50aXR5U2V0ICYmIG9TZWxlY3Rpb25WYXJpYW50KSB7XG5cdFx0Y29uc3Qgc0NvbnRleHRVcmwgPSBvTmF2aWdhdGlvblNlcnZpY2UuY29uc3RydWN0Q29udGV4dFVybChvVmlldy5nZXRWaWV3RGF0YSgpLmVudGl0eVNldCwgb1ZpZXcuZ2V0TW9kZWwoKSk7XG5cdFx0b1NlbGVjdGlvblZhcmlhbnQuc2V0RmlsdGVyQ29udGV4dFVybChzQ29udGV4dFVybCk7XG5cdH1cblx0cmV0dXJuIG9TZWxlY3Rpb25WYXJpYW50O1xufTtcblxuU2ltcGxlTGlua0RlbGVnYXRlLl9zZXRPYmplY3RNYXBwaW5ncyA9IGZ1bmN0aW9uIChcblx0c1NlbWFudGljT2JqZWN0OiBzdHJpbmcsXG5cdG9QYXJhbXM6IGFueSxcblx0YVNlbWFudGljT2JqZWN0TWFwcGluZ3M6IFJlZ2lzdGVyZWRTZW1hbnRpY09iamVjdE1hcHBpbmdzLFxuXHRvU2VsZWN0aW9uVmFyaWFudDogU2VsZWN0aW9uVmFyaWFudFxuKSB7XG5cdGxldCBoYXNDaGFuZ2VkID0gZmFsc2U7XG5cdC8vIGlmIHNlbWFudGljT2JqZWN0TWFwcGluZ3MgaGFzIGl0ZW1zIHdpdGggZHluYW1pYyBzZW1hbnRpY09iamVjdHMgd2UgbmVlZCB0byByZXNvbHZlIHRoZW0gdXNpbmcgb1BhcmFtc1xuXHRhU2VtYW50aWNPYmplY3RNYXBwaW5ncy5mb3JFYWNoKGZ1bmN0aW9uIChtYXBwaW5nKSB7XG5cdFx0bGV0IG1hcHBpbmdTZW1hbnRpY09iamVjdCA9IG1hcHBpbmcuc2VtYW50aWNPYmplY3Q7XG5cdFx0Y29uc3QgZHluYW1pY1NlbU9iamVjdFJlZ2V4ID0gbWFwcGluZ1NlbWFudGljT2JqZWN0Lm1hdGNoKC97KC4qPyl9Lyk7XG5cdFx0aWYgKFxuXHRcdFx0ZHluYW1pY1NlbU9iamVjdFJlZ2V4Py5sZW5ndGggJiZcblx0XHRcdGR5bmFtaWNTZW1PYmplY3RSZWdleC5sZW5ndGggPiAxICYmXG5cdFx0XHRkeW5hbWljU2VtT2JqZWN0UmVnZXhbMV0gJiZcblx0XHRcdG9QYXJhbXNbZHluYW1pY1NlbU9iamVjdFJlZ2V4WzFdXVxuXHRcdCkge1xuXHRcdFx0bWFwcGluZ1NlbWFudGljT2JqZWN0ID0gb1BhcmFtc1tkeW5hbWljU2VtT2JqZWN0UmVnZXhbMV1dO1xuXHRcdH1cblx0XHRpZiAoc1NlbWFudGljT2JqZWN0ID09PSBtYXBwaW5nU2VtYW50aWNPYmplY3QpIHtcblx0XHRcdGNvbnN0IG9NYXBwaW5ncyA9IG1hcHBpbmcuaXRlbXM7XG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG9NYXBwaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRjb25zdCBzTG9jYWxQcm9wZXJ0eSA9IG9NYXBwaW5nc1tpXS5rZXk7XG5cdFx0XHRcdGNvbnN0IHNTZW1hbnRpY09iamVjdFByb3BlcnR5ID0gb01hcHBpbmdzW2ldLnZhbHVlO1xuXHRcdFx0XHRpZiAob1BhcmFtc1tzTG9jYWxQcm9wZXJ0eV0pIHtcblx0XHRcdFx0XHRvU2VsZWN0aW9uVmFyaWFudC5yZW1vdmVQYXJhbWV0ZXIoc1NlbWFudGljT2JqZWN0UHJvcGVydHkpO1xuXHRcdFx0XHRcdG9TZWxlY3Rpb25WYXJpYW50LnJlbW92ZVNlbGVjdE9wdGlvbihzU2VtYW50aWNPYmplY3RQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0b1NlbGVjdGlvblZhcmlhbnQucmVuYW1lUGFyYW1ldGVyKHNMb2NhbFByb3BlcnR5LCBzU2VtYW50aWNPYmplY3RQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0b1NlbGVjdGlvblZhcmlhbnQucmVuYW1lU2VsZWN0T3B0aW9uKHNMb2NhbFByb3BlcnR5LCBzU2VtYW50aWNPYmplY3RQcm9wZXJ0eSk7XG5cdFx0XHRcdFx0b1BhcmFtc1tzU2VtYW50aWNPYmplY3RQcm9wZXJ0eV0gPSBvUGFyYW1zW3NMb2NhbFByb3BlcnR5XTtcblx0XHRcdFx0XHRoYXNDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cdHJldHVybiB7IHBhcmFtczogb1BhcmFtcywgaGFzQ2hhbmdlZCB9O1xufTtcblxuU2ltcGxlTGlua0RlbGVnYXRlLl9nZXRMaW5rSXRlbVdpdGhOZXdQYXJhbWV0ZXIgPSBmdW5jdGlvbiAoXG5cdF90aGF0OiBhbnksXG5cdF9iVGl0bGVIYXNMaW5rOiBib29sZWFuLFxuXHRfYVRpdGxlTGluazogc3RyaW5nW10sXG5cdF9vTGlua0l0ZW06IGFueSxcblx0X29TaGVsbFNlcnZpY2VzOiBhbnksXG5cdF9vUGF5bG9hZDogYW55LFxuXHRfb1BhcmFtczogYW55LFxuXHRfc0FwcFN0YXRlS2V5OiBzdHJpbmcsXG5cdF9vU2VsZWN0aW9uVmFyaWFudDogU2VsZWN0aW9uVmFyaWFudCxcblx0X29OYXZpZ2F0aW9uU2VydmljZTogTmF2aWdhdGlvblNlcnZpY2Vcbikge1xuXHRsZXQgY2hlY2tUaXRsZUxpbmsgPSB7IHRpdGxlbGlua3JlbW92ZWQ6IGZhbHNlIH07XG5cdGNvbnN0IF9wcm9taXNlID0gX29TaGVsbFNlcnZpY2VzLmV4cGFuZENvbXBhY3RIYXNoKF9vTGlua0l0ZW0uZ2V0SHJlZigpKS50aGVuKGFzeW5jIGZ1bmN0aW9uIChzSGFzaDogYW55KSB7XG5cdFx0Y29uc3Qgb1NoZWxsSGFzaCA9IF9vU2hlbGxTZXJ2aWNlcy5wYXJzZVNoZWxsSGFzaChzSGFzaCk7XG5cdFx0Y29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgX29QYXJhbXMpO1xuXHRcdGNvbnN0IHsgcGFyYW1zOiBvTmV3UGFyYW1zLCBoYXNDaGFuZ2VkIH0gPSBTaW1wbGVMaW5rRGVsZWdhdGUuX3NldE9iamVjdE1hcHBpbmdzKFxuXHRcdFx0b1NoZWxsSGFzaC5zZW1hbnRpY09iamVjdCxcblx0XHRcdHBhcmFtcyxcblx0XHRcdF9vUGF5bG9hZC5zZW1hbnRpY09iamVjdE1hcHBpbmdzLFxuXHRcdFx0X29TZWxlY3Rpb25WYXJpYW50XG5cdFx0KTtcblx0XHRpZiAoaGFzQ2hhbmdlZCkge1xuXHRcdFx0Y29uc3QgYVZhbHVlcyA9IGF3YWl0IHRvRVM2UHJvbWlzZShfb05hdmlnYXRpb25TZXJ2aWNlLmdldEFwcFN0YXRlS2V5QW5kVXJsUGFyYW1ldGVycyhfb1NlbGVjdGlvblZhcmlhbnQudG9KU09OU3RyaW5nKCkpKTtcblx0XHRcdF9zQXBwU3RhdGVLZXkgPSBhVmFsdWVzWzFdO1xuXHRcdH1cblx0XHRjb25zdCBvTmV3U2hlbGxIYXNoID0ge1xuXHRcdFx0dGFyZ2V0OiB7XG5cdFx0XHRcdHNlbWFudGljT2JqZWN0OiBvU2hlbGxIYXNoLnNlbWFudGljT2JqZWN0LFxuXHRcdFx0XHRhY3Rpb246IG9TaGVsbEhhc2guYWN0aW9uXG5cdFx0XHR9LFxuXHRcdFx0cGFyYW1zOiBvTmV3UGFyYW1zLFxuXHRcdFx0YXBwU3RhdGVLZXk6IF9zQXBwU3RhdGVLZXlcblx0XHR9O1xuXG5cdFx0ZGVsZXRlIG9OZXdTaGVsbEhhc2gucGFyYW1zW1wic2FwLXhhcHAtc3RhdGVcIl07XG5cdFx0X29MaW5rSXRlbS5zZXRIcmVmKGAjJHtfb1NoZWxsU2VydmljZXMuY29uc3RydWN0U2hlbGxIYXNoKG9OZXdTaGVsbEhhc2gpfWApO1xuXHRcdF9vUGF5bG9hZC5hU2VtYW50aWNMaW5rcy5wdXNoKF9vTGlua0l0ZW0uZ2V0SHJlZigpKTtcblxuXHRcdGNoZWNrVGl0bGVMaW5rID0gU2ltcGxlTGlua0RlbGVnYXRlLl9SZW1vdmVUaXRsZUxpbmtGcm9tVGFyZ2V0cy5iaW5kKF90aGF0KShbX29MaW5rSXRlbV0sIF9iVGl0bGVIYXNMaW5rLCBfYVRpdGxlTGluayk7XG5cdFx0aWYgKGNoZWNrVGl0bGVMaW5rLnRpdGxlbGlua3JlbW92ZWQpIHtcblx0XHRcdC8vIFRoZSBsaW5rIGlzIHJlbW92ZWQgZnJvbSB0aGUgdGFyZ2V0IGxpc3QgYmVjYXVzZSB0aGUgdGl0bGUgbGluayBoYXMgc2FtZSB0YXJnZXQuXG5cdFx0XHRyZXR1cm4gX29MaW5rSXRlbTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIF9vTGlua0l0ZW07XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRsaW5raXRlbXByb21pc2U6IF9wcm9taXNlLFxuXHRcdHRpdGxlbGlua3JlbW92ZWQ6IGNoZWNrVGl0bGVMaW5rLnRpdGxlbGlua3JlbW92ZWRcblx0fTtcbn07XG4vKipcbiAqIEVuYWJsZXMgdGhlIG1vZGlmaWNhdGlvbiBvZiBMaW5rSXRlbXMgYmVmb3JlIHRoZSBwb3BvdmVyIG9wZW5zLiBUaGlzIGVuYWJsZXMgYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gKiB0byBiZSBhZGRlZCB0byB0aGUgbGluay5cbiAqXG4gKiBAcGFyYW0gb1BheWxvYWQgVGhlIHBheWxvYWQgb2YgdGhlIExpbmsgZ2l2ZW4gYnkgdGhlIGFwcGxpY2F0aW9uXG4gKiBAcGFyYW0gb0JpbmRpbmdDb250ZXh0IFRoZSBiaW5kaW5nIGNvbnRleHQgb2YgdGhlIExpbmtcbiAqIEBwYXJhbSBhTGlua0l0ZW1zIFRoZSBMaW5rSXRlbXMgb2YgdGhlIExpbmsgdGhhdCBjYW4gYmUgbW9kaWZpZWRcbiAqIEByZXR1cm5zIE9uY2UgcmVzb2x2ZWQgYW4gYXJyYXkgb2Yge0BsaW5rIHNhcC51aS5tZGMubGluay5MaW5rSXRlbX0gaXMgcmV0dXJuZWRcbiAqL1xuU2ltcGxlTGlua0RlbGVnYXRlLm1vZGlmeUxpbmtJdGVtcyA9IGFzeW5jIGZ1bmN0aW9uIChvUGF5bG9hZDogYW55LCBvQmluZGluZ0NvbnRleHQ6IENvbnRleHQsIGFMaW5rSXRlbXM6IGFueSkge1xuXHRjb25zdCBwcmltYXJ5QWN0aW9uSXNBY3RpdmUgPSAoYXdhaXQgRmllbGRIZWxwZXIuY2hlY2tQcmltYXJ5QWN0aW9ucyhvUGF5bG9hZCwgdHJ1ZSkpIGFzIGFueTtcblx0Y29uc3QgYVRpdGxlTGluayA9IHByaW1hcnlBY3Rpb25Jc0FjdGl2ZS50aXRsZUxpbms7XG5cdGNvbnN0IGJUaXRsZUhhc0xpbms6IGJvb2xlYW4gPSBwcmltYXJ5QWN0aW9uSXNBY3RpdmUuaGFzVGl0bGVMaW5rO1xuXHRpZiAoYUxpbmtJdGVtcy5sZW5ndGggIT09IDApIHtcblx0XHR0aGlzLnBheWxvYWQgPSBvUGF5bG9hZDtcblx0XHRjb25zdCBvTGluayA9IGFMaW5rSXRlbXNbMF0uZ2V0UGFyZW50KCk7XG5cdFx0Y29uc3Qgb1ZpZXcgPSBDb21tb25VdGlscy5nZXRUYXJnZXRWaWV3KG9MaW5rKTtcblx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gQ29tbW9uVXRpbHMuZ2V0QXBwQ29tcG9uZW50KG9WaWV3KTtcblx0XHRjb25zdCBvU2hlbGxTZXJ2aWNlcyA9IG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpO1xuXHRcdGlmICghb1NoZWxsU2VydmljZXMuaGFzVVNoZWxsKCkpIHtcblx0XHRcdExvZy5lcnJvcihcIlF1aWNrVmlld0xpbmtEZWxlZ2F0ZTogQ2Fubm90IHJldHJpZXZlIHRoZSBzaGVsbCBzZXJ2aWNlc1wiKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgpO1xuXHRcdH1cblx0XHRjb25zdCBvTWV0YU1vZGVsID0gb1ZpZXcuZ2V0TW9kZWwoKS5nZXRNZXRhTW9kZWwoKTtcblx0XHRsZXQgbUxpbmVDb250ZXh0ID0gb0xpbmsuZ2V0QmluZGluZ0NvbnRleHQoKTtcblx0XHRjb25zdCBvVGFyZ2V0SW5mbzogYW55ID0ge1xuXHRcdFx0c2VtYW50aWNPYmplY3Q6IG9QYXlsb2FkLm1haW5TZW1hbnRpY09iamVjdCxcblx0XHRcdGFjdGlvbjogXCJcIlxuXHRcdH07XG5cblx0XHR0cnkge1xuXHRcdFx0Y29uc3QgYU5ld0xpbmtDdXN0b21EYXRhID1cblx0XHRcdFx0b0xpbmsgJiZcblx0XHRcdFx0dGhpcy5fZmV0Y2hMaW5rQ3VzdG9tRGF0YShvTGluaykubWFwKGZ1bmN0aW9uIChsaW5rSXRlbTogYW55KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGxpbmtJdGVtLm1Qcm9wZXJ0aWVzLnZhbHVlO1xuXHRcdFx0XHR9KTtcblx0XHRcdC8vIGNoZWNrIGlmIGFsbCBsaW5rIGl0ZW1zIGluIHRoaXMuYUxpbmtDdXN0b21EYXRhIGFyZSBhbHNvIHByZXNlbnQgaW4gYU5ld0xpbmtDdXN0b21EYXRhXG5cdFx0XHRpZiAoU2ltcGxlTGlua0RlbGVnYXRlLl9Jc1NlbWFudGljT2JqZWN0RHluYW1pYyhhTmV3TGlua0N1c3RvbURhdGEsIHRoaXMpKSB7XG5cdFx0XHRcdC8vIGlmIHRoZSBjdXN0b21EYXRhIGNoYW5nZWQgdGhlcmUgYXJlIGRpZmZlcmVudCBMaW5rSXRlbXMgdG8gZGlzcGxheVxuXHRcdFx0XHRjb25zdCBvU2VtYW50aWNBdHRyaWJ1dGVzUmVzb2x2ZWQgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX2NhbGN1bGF0ZVNlbWFudGljQXR0cmlidXRlcyhcblx0XHRcdFx0XHRvQmluZGluZ0NvbnRleHQuZ2V0T2JqZWN0KCksXG5cdFx0XHRcdFx0b1BheWxvYWQsXG5cdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdHRoaXMuX2xpbmtcblx0XHRcdFx0KTtcblx0XHRcdFx0Y29uc3Qgb1NlbWFudGljQXR0cmlidXRlcyA9IG9TZW1hbnRpY0F0dHJpYnV0ZXNSZXNvbHZlZC5yZXN1bHRzO1xuXHRcdFx0XHRjb25zdCBvUGF5bG9hZFJlc29sdmVkID0gb1NlbWFudGljQXR0cmlidXRlc1Jlc29sdmVkLnBheWxvYWQ7XG5cdFx0XHRcdGFMaW5rSXRlbXMgPSBhd2FpdCBTaW1wbGVMaW5rRGVsZWdhdGUuX3JldHJpZXZlTmF2aWdhdGlvblRhcmdldHMoXG5cdFx0XHRcdFx0XCJcIixcblx0XHRcdFx0XHRvU2VtYW50aWNBdHRyaWJ1dGVzLFxuXHRcdFx0XHRcdG9QYXlsb2FkUmVzb2x2ZWQsXG5cdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdHRoaXMuX2xpbmtcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGNvbnN0IG9OYXZpZ2F0aW9uU2VydmljZSA9IG9BcHBDb21wb25lbnQuZ2V0TmF2aWdhdGlvblNlcnZpY2UoKTtcblx0XHRcdGNvbnN0IG9Db250cm9sbGVyID0gb1ZpZXcuZ2V0Q29udHJvbGxlcigpO1xuXHRcdFx0bGV0IG9TZWxlY3Rpb25WYXJpYW50O1xuXHRcdFx0bGV0IG1MaW5lQ29udGV4dERhdGE7XG5cdFx0XHRtTGluZUNvbnRleHQgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX2dldExpbmVDb250ZXh0KG9WaWV3LCBtTGluZUNvbnRleHQpO1xuXHRcdFx0Y29uc3Qgc01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChtTGluZUNvbnRleHQuZ2V0UGF0aCgpKTtcblx0XHRcdG1MaW5lQ29udGV4dERhdGEgPSBvQ29udHJvbGxlci5faW50ZW50QmFzZWROYXZpZ2F0aW9uLnJlbW92ZVNlbnNpdGl2ZURhdGEobUxpbmVDb250ZXh0LmdldE9iamVjdCgpLCBzTWV0YVBhdGgpO1xuXHRcdFx0bUxpbmVDb250ZXh0RGF0YSA9IG9Db250cm9sbGVyLl9pbnRlbnRCYXNlZE5hdmlnYXRpb24ucHJlcGFyZUNvbnRleHRGb3JFeHRlcm5hbE5hdmlnYXRpb24obUxpbmVDb250ZXh0RGF0YSwgbUxpbmVDb250ZXh0KTtcblx0XHRcdG9TZWxlY3Rpb25WYXJpYW50ID0gb05hdmlnYXRpb25TZXJ2aWNlLm1peEF0dHJpYnV0ZXNBbmRTZWxlY3Rpb25WYXJpYW50KFxuXHRcdFx0XHRtTGluZUNvbnRleHREYXRhLnNlbWFudGljQXR0cmlidXRlcyxcblx0XHRcdFx0bmV3IFNlbGVjdGlvblZhcmlhbnQoKVxuXHRcdFx0KTtcblx0XHRcdG9UYXJnZXRJbmZvLnByb3BlcnRpZXNXaXRob3V0Q29uZmxpY3QgPSBtTGluZUNvbnRleHREYXRhLnByb3BlcnRpZXNXaXRob3V0Q29uZmxpY3Q7XG5cdFx0XHQvL1RPIG1vZGlmeSB0aGUgc2VsZWN0aW9uIHZhcmlhbnQgZnJvbSB0aGUgRXh0ZW5zaW9uIEFQSVxuXHRcdFx0b1ZpZXcuZ2V0Q29udHJvbGxlcigpLmludGVudEJhc2VkTmF2aWdhdGlvbi5hZGFwdE5hdmlnYXRpb25Db250ZXh0KG9TZWxlY3Rpb25WYXJpYW50LCBvVGFyZ2V0SW5mbyk7XG5cdFx0XHRTaW1wbGVMaW5rRGVsZWdhdGUuX3JlbW92ZVRlY2huaWNhbFBhcmFtZXRlcnMob1NlbGVjdGlvblZhcmlhbnQpO1xuXHRcdFx0b1NlbGVjdGlvblZhcmlhbnQgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX3NldEZpbHRlckNvbnRleHRVcmxGb3JTZWxlY3Rpb25WYXJpYW50KG9WaWV3LCBvU2VsZWN0aW9uVmFyaWFudCwgb05hdmlnYXRpb25TZXJ2aWNlKTtcblx0XHRcdGNvbnN0IGFWYWx1ZXMgPSBhd2FpdCB0b0VTNlByb21pc2Uob05hdmlnYXRpb25TZXJ2aWNlLmdldEFwcFN0YXRlS2V5QW5kVXJsUGFyYW1ldGVycyhvU2VsZWN0aW9uVmFyaWFudC50b0pTT05TdHJpbmcoKSkpO1xuXHRcdFx0Y29uc3Qgb1BhcmFtcyA9IGFWYWx1ZXNbMF07XG5cdFx0XHRjb25zdCBhcHBTdGF0ZUtleSA9IGFWYWx1ZXNbMV07XG5cdFx0XHRjb25zdCBMaW5rc1dpdGhOZXdQYXJhbWV0ZXJzUHJvbWlzZXM6IGFueVtdID0gW107XG5cdFx0XHRsZXQgX0xpbmtQcm9taXNlUmVzdWx0O1xuXHRcdFx0b1BheWxvYWQuYVNlbWFudGljTGlua3MgPSBbXTtcblx0XHRcdGZvciAoY29uc3QgaW5kZXggaW4gYUxpbmtJdGVtcykge1xuXHRcdFx0XHRfTGlua1Byb21pc2VSZXN1bHQgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX2dldExpbmtJdGVtV2l0aE5ld1BhcmFtZXRlcihcblx0XHRcdFx0XHR0aGlzLFxuXHRcdFx0XHRcdGJUaXRsZUhhc0xpbmssXG5cdFx0XHRcdFx0YVRpdGxlTGluayxcblx0XHRcdFx0XHRhTGlua0l0ZW1zW2luZGV4XSxcblx0XHRcdFx0XHRvU2hlbGxTZXJ2aWNlcyxcblx0XHRcdFx0XHRvUGF5bG9hZCxcblx0XHRcdFx0XHRvUGFyYW1zLFxuXHRcdFx0XHRcdGFwcFN0YXRlS2V5LFxuXHRcdFx0XHRcdG9TZWxlY3Rpb25WYXJpYW50LFxuXHRcdFx0XHRcdG9OYXZpZ2F0aW9uU2VydmljZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRpZiAoIV9MaW5rUHJvbWlzZVJlc3VsdC50aXRsZWxpbmtyZW1vdmVkKSB7XG5cdFx0XHRcdFx0Ly8gVGhlIGxpbmsgdGFyZ2V0IGlzIG5vdCB0aGUgdGl0bGUgbGluayB0YXJnZXRcblx0XHRcdFx0XHRMaW5rc1dpdGhOZXdQYXJhbWV0ZXJzUHJvbWlzZXMucHVzaChfTGlua1Byb21pc2VSZXN1bHQubGlua2l0ZW1wcm9taXNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGF3YWl0IFByb21pc2UuYWxsKExpbmtzV2l0aE5ld1BhcmFtZXRlcnNQcm9taXNlcyk7XG5cdFx0fSBjYXRjaCAob0Vycm9yOiBhbnkpIHtcblx0XHRcdExvZy5lcnJvcihcIkVycm9yIHdoaWxlIGdldHRpbmcgdGhlIG5hdmlnYXRpb24gc2VydmljZVwiLCBvRXJyb3IpO1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIGFMaW5rSXRlbXM7XG5cdH1cbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuYmVmb3JlTmF2aWdhdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKG9QYXlsb2FkOiBhbnksIG9FdmVudDogYW55KSB7XG5cdGNvbnN0IG9Tb3VyY2UgPSBvRXZlbnQuZ2V0U291cmNlKCksXG5cdFx0c0hyZWYgPSBvRXZlbnQuZ2V0UGFyYW1ldGVyKFwiaHJlZlwiKSxcblx0XHRvVVJMUGFyc2luZyA9IEZhY3RvcnkuZ2V0U2VydmljZShcIlVSTFBhcnNpbmdcIiksXG5cdFx0b0hhc2ggPSBzSHJlZiAmJiBvVVJMUGFyc2luZy5wYXJzZVNoZWxsSGFzaChzSHJlZik7XG5cblx0S2VlcEFsaXZlSGVscGVyLnN0b3JlQ29udHJvbFJlZnJlc2hTdHJhdGVneUZvckhhc2gob1NvdXJjZSwgb0hhc2gpO1xuXG5cdHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG59O1xuU2ltcGxlTGlua0RlbGVnYXRlLl9yZW1vdmVUZWNobmljYWxQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKG9TZWxlY3Rpb25WYXJpYW50OiBhbnkpIHtcblx0b1NlbGVjdGlvblZhcmlhbnQucmVtb3ZlU2VsZWN0T3B0aW9uKFwiQG9kYXRhLmNvbnRleHRcIik7XG5cdG9TZWxlY3Rpb25WYXJpYW50LnJlbW92ZVNlbGVjdE9wdGlvbihcIkBvZGF0YS5tZXRhZGF0YUV0YWdcIik7XG5cdG9TZWxlY3Rpb25WYXJpYW50LnJlbW92ZVNlbGVjdE9wdGlvbihcIlNBUF9fTWVzc2FnZXNcIik7XG59O1xuXG5TaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljT2JqZWN0Q3VzdG9tRGF0YVZhbHVlID0gZnVuY3Rpb24gKGFMaW5rQ3VzdG9tRGF0YTogYW55LCBvU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQ6IGFueSk6IHZvaWQge1xuXHRsZXQgc1Byb3BlcnR5TmFtZTogc3RyaW5nLCBzQ3VzdG9tRGF0YVZhbHVlOiBzdHJpbmc7XG5cdGZvciAobGV0IGlDdXN0b21EYXRhQ291bnQgPSAwOyBpQ3VzdG9tRGF0YUNvdW50IDwgYUxpbmtDdXN0b21EYXRhLmxlbmd0aDsgaUN1c3RvbURhdGFDb3VudCsrKSB7XG5cdFx0c1Byb3BlcnR5TmFtZSA9IGFMaW5rQ3VzdG9tRGF0YVtpQ3VzdG9tRGF0YUNvdW50XS5nZXRLZXkoKTtcblx0XHRzQ3VzdG9tRGF0YVZhbHVlID0gYUxpbmtDdXN0b21EYXRhW2lDdXN0b21EYXRhQ291bnRdLmdldFZhbHVlKCk7XG5cdFx0b1NlbWFudGljT2JqZWN0c1Jlc29sdmVkW3NQcm9wZXJ0eU5hbWVdID0geyB2YWx1ZTogc0N1c3RvbURhdGFWYWx1ZSB9O1xuXHR9XG59O1xuXG5TaW1wbGVMaW5rRGVsZWdhdGUuX2NyZWF0ZU5ld1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkID0gZnVuY3Rpb24gKFxuXHRvUGF5bG9hZDogYW55LFxuXHRvU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQ6IGFueSxcblx0bmV3UGF5bG9hZDogYW55XG4pOiB2b2lkIHtcblx0bGV0IHNTZW1hbnRpY09iamVjdE5hbWU6IHN0cmluZywgX3NUbXBQcm9wZXJ0eU5hbWU6IHN0cmluZztcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvUGF5bG9hZC5zZW1hbnRpY09iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRzU2VtYW50aWNPYmplY3ROYW1lID0gb1BheWxvYWQuc2VtYW50aWNPYmplY3RzW2ldO1xuXHRcdGlmIChcblx0XHRcdHNTZW1hbnRpY09iamVjdE5hbWUgJiZcblx0XHRcdHNTZW1hbnRpY09iamVjdE5hbWUuaW5kZXhPZihcIntcIikgPT09IDAgJiZcblx0XHRcdHNTZW1hbnRpY09iamVjdE5hbWUuaW5kZXhPZihcIn1cIikgPT09IHNTZW1hbnRpY09iamVjdE5hbWUubGVuZ3RoIC0gMVxuXHRcdCkge1xuXHRcdFx0X3NUbXBQcm9wZXJ0eU5hbWUgPSBzU2VtYW50aWNPYmplY3ROYW1lLnN1YnN0cigxLCBzU2VtYW50aWNPYmplY3ROYW1lLmluZGV4T2YoXCJ9XCIpIC0gMSk7XG5cdFx0XHRzU2VtYW50aWNPYmplY3ROYW1lID0gb1NlbWFudGljT2JqZWN0c1Jlc29sdmVkW19zVG1wUHJvcGVydHlOYW1lXS52YWx1ZTtcblx0XHRcdGlmIChcblx0XHRcdFx0b1BheWxvYWQubWFpblNlbWFudGljT2JqZWN0ICYmXG5cdFx0XHRcdG9QYXlsb2FkLm1haW5TZW1hbnRpY09iamVjdC5zcGxpdChfc1RtcFByb3BlcnR5TmFtZSkubGVuZ3RoID09PSAyICYmXG5cdFx0XHRcdG9QYXlsb2FkLm1haW5TZW1hbnRpY09iamVjdC5zcGxpdChfc1RtcFByb3BlcnR5TmFtZSlbMF0gPT09IFwie1wiICYmXG5cdFx0XHRcdG9QYXlsb2FkLm1haW5TZW1hbnRpY09iamVjdC5zcGxpdChfc1RtcFByb3BlcnR5TmFtZSlbMV0gPT09IFwifVwiXG5cdFx0XHQpIHtcblx0XHRcdFx0aWYgKHNTZW1hbnRpY09iamVjdE5hbWUpIHtcblx0XHRcdFx0XHRuZXdQYXlsb2FkLm1haW5TZW1hbnRpY09iamVjdCA9IHNTZW1hbnRpY09iamVjdE5hbWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gbm8gdmFsdWUgZnJvbSBDdXN0b20gRGF0YSwgc28gcmVtb3ZpbmcgbWFpblNlbWFudGljT2JqZWN0XG5cdFx0XHRcdFx0bmV3UGF5bG9hZC5tYWluU2VtYW50aWNPYmplY3QgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChzU2VtYW50aWNPYmplY3ROYW1lICYmIHR5cGVvZiBzU2VtYW50aWNPYmplY3ROYW1lID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdG5ld1BheWxvYWQuc2VtYW50aWNPYmplY3RzUmVzb2x2ZWQucHVzaChzU2VtYW50aWNPYmplY3ROYW1lID8gc1NlbWFudGljT2JqZWN0TmFtZSA6IHVuZGVmaW5lZCk7XG5cdFx0XHRcdG5ld1BheWxvYWQuc2VtYW50aWNPYmplY3RzLnB1c2goc1NlbWFudGljT2JqZWN0TmFtZSA/IHNTZW1hbnRpY09iamVjdE5hbWUgOiB1bmRlZmluZWQpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNTZW1hbnRpY09iamVjdE5hbWUpKSB7XG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgc1NlbWFudGljT2JqZWN0TmFtZS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdG5ld1BheWxvYWQuc2VtYW50aWNPYmplY3RzUmVzb2x2ZWQucHVzaChzU2VtYW50aWNPYmplY3ROYW1lW2pdID8gc1NlbWFudGljT2JqZWN0TmFtZVtqXSA6IHVuZGVmaW5lZCk7XG5cdFx0XHRcdFx0bmV3UGF5bG9hZC5zZW1hbnRpY09iamVjdHMucHVzaChzU2VtYW50aWNPYmplY3ROYW1lW2pdID8gc1NlbWFudGljT2JqZWN0TmFtZVtqXSA6IHVuZGVmaW5lZCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bmV3UGF5bG9hZC5zZW1hbnRpY09iamVjdHMucHVzaChzU2VtYW50aWNPYmplY3ROYW1lKTtcblx0XHR9XG5cdH1cbn07XG5cblNpbXBsZUxpbmtEZWxlZ2F0ZS5fc2V0UGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQgPSBmdW5jdGlvbiAob1BheWxvYWQ6IGFueSwgbmV3UGF5bG9hZDogYW55KTogdm9pZCB7XG5cdGxldCBvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQ6IGFueTtcblx0aWYgKG5ld1BheWxvYWQuc2VtYW50aWNPYmplY3RzUmVzb2x2ZWQubGVuZ3RoID4gMCkge1xuXHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZCA9IHt9O1xuXHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5lbnRpdHlUeXBlID0gb1BheWxvYWQuZW50aXR5VHlwZTtcblx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQuZGF0YUZpZWxkID0gb1BheWxvYWQuZGF0YUZpZWxkO1xuXHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5jb250YWN0ID0gb1BheWxvYWQuY29udGFjdDtcblx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQubWFpblNlbWFudGljT2JqZWN0ID0gb1BheWxvYWQubWFpblNlbWFudGljT2JqZWN0O1xuXHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5uYXZpZ2F0aW9uUGF0aCA9IG9QYXlsb2FkLm5hdmlnYXRpb25QYXRoO1xuXHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5wcm9wZXJ0eVBhdGhMYWJlbCA9IG9QYXlsb2FkLnByb3BlcnR5UGF0aExhYmVsO1xuXHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5zZW1hbnRpY09iamVjdE1hcHBpbmdzID0gZGVlcENsb25lKG9QYXlsb2FkLnNlbWFudGljT2JqZWN0TWFwcGluZ3MpO1xuXHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5zZW1hbnRpY09iamVjdHMgPSBuZXdQYXlsb2FkLnNlbWFudGljT2JqZWN0cztcblxuXHRcdGNvbnN0IF9TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucyA9IGRlZXBDbG9uZShvUGF5bG9hZC5zZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucyk7XG5cblx0XHRsZXQgX0luZGV4OiBhbnk7XG5cdFx0X1NlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zLmZvckVhY2goZnVuY3Rpb24gKF9vU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbjogYW55KSB7XG5cdFx0XHQvLyBEeW5hbWljIFNlbWFudGljT2JqZWN0IGhhcyBhbiB1bmF2YWlsYWJsZSBhY3Rpb25cblx0XHRcdGlmIChfb1NlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb24/LnNlbWFudGljT2JqZWN0ICYmIF9vU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbi5zZW1hbnRpY09iamVjdC5pbmRleE9mKFwie1wiKSA9PT0gMCkge1xuXHRcdFx0XHRfSW5kZXggPSBvUGF5bG9hZC5zZW1hbnRpY09iamVjdHMuZmluZEluZGV4KGZ1bmN0aW9uIChzZW1hbnRpY09iamVjdDogc3RyaW5nKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHNlbWFudGljT2JqZWN0ID09PSBfb1NlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb24uc2VtYW50aWNPYmplY3Q7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRpZiAoX0luZGV4ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHQvLyBHZXQgdGhlIFNlbWFudGljT2JqZWN0IG5hbWUgcmVzb2x2ZWQgdG8gYSB2YWx1ZVxuXHRcdFx0XHRcdF9vU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbi5zZW1hbnRpY09iamVjdCA9IG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5zZW1hbnRpY09iamVjdHNbX0luZGV4XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0b1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkLnNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zID0gX1NlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zO1xuXG5cdFx0aWYgKG5ld1BheWxvYWQubWFpblNlbWFudGljT2JqZWN0KSB7XG5cdFx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQubWFpblNlbWFudGljT2JqZWN0ID0gbmV3UGF5bG9hZC5tYWluU2VtYW50aWNPYmplY3Q7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5tYWluU2VtYW50aWNPYmplY3QgPSB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0Zm9yIChsZXQgaU5ld1NlbWFudGljT2JqZWN0c0NvdW50ID0gMDsgaU5ld1NlbWFudGljT2JqZWN0c0NvdW50IDwgbmV3UGF5bG9hZC5zZW1hbnRpY09iamVjdHMubGVuZ3RoOyBpTmV3U2VtYW50aWNPYmplY3RzQ291bnQrKykge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQubWFpblNlbWFudGljT2JqZWN0ID09PVxuXHRcdFx0XHRuZXdQYXlsb2FkLnNlbWFudGljT2JqZWN0c1Jlc29sdmVkW2lOZXdTZW1hbnRpY09iamVjdHNDb3VudF1cblx0XHRcdCkge1xuXHRcdFx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQubWFpblNlbWFudGljT2JqZWN0ID0gbmV3UGF5bG9hZC5zZW1hbnRpY09iamVjdHNbaU5ld1NlbWFudGljT2JqZWN0c0NvdW50XTtcblx0XHRcdH1cblx0XHRcdGlmIChcblx0XHRcdFx0ISFvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQuc2VtYW50aWNPYmplY3RNYXBwaW5ncyAmJlxuXHRcdFx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQuc2VtYW50aWNPYmplY3RNYXBwaW5ncy5sZW5ndGggPiAwXG5cdFx0XHQpIHtcblx0XHRcdFx0Ly8gc2tpcCB0aGlzIGluIGNhc2UgdGhlcmUgYXJlIG5vIHNlbWFudGljT2JqZWN0TWFwcGluZ3MgYmVjYXVzZSBjdXN0b20gc2VtYW50aWMgb2JqZWN0cyBtaWdodCBub3QgaGF2ZSBhbnkgbWFwcGluZ3Ncblx0XHRcdFx0aWYgKG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5zZW1hbnRpY09iamVjdE1hcHBpbmdzW2lOZXdTZW1hbnRpY09iamVjdHNDb3VudF0pIHtcblx0XHRcdFx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQuc2VtYW50aWNPYmplY3RNYXBwaW5nc1tpTmV3U2VtYW50aWNPYmplY3RzQ291bnRdID0ge1xuXHRcdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IG5ld1BheWxvYWQuc2VtYW50aWNPYmplY3RzW2lOZXdTZW1hbnRpY09iamVjdHNDb3VudF0sXG5cdFx0XHRcdFx0XHRpdGVtczogb1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkLnNlbWFudGljT2JqZWN0TWFwcGluZ3NbaU5ld1NlbWFudGljT2JqZWN0c0NvdW50XS5pdGVtc1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5zZW1hbnRpY09iamVjdHNbaU5ld1NlbWFudGljT2JqZWN0c0NvdW50XSkge1xuXHRcdFx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQuc2VtYW50aWNPYmplY3RzW2lOZXdTZW1hbnRpY09iamVjdHNDb3VudF0gPVxuXHRcdFx0XHRcdG5ld1BheWxvYWQuc2VtYW50aWNPYmplY3RzW2lOZXdTZW1hbnRpY09iamVjdHNDb3VudF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBubyBDdXN0b20gRGF0YSB2YWx1ZSBmb3IgYSBTZW1hbnRpYyBPYmplY3QgbmFtZSB3aXRoIHBhdGhcblx0XHRcdFx0b1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkLnNlbWFudGljT2JqZWN0cy5zcGxpY2UoaU5ld1NlbWFudGljT2JqZWN0c0NvdW50LCAxKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyByZW1vdmUgdW5kZWZpbmVkIFNlbWFudGljIE9iamVjdCBNYXBwaW5nXG5cdFx0Zm9yIChcblx0XHRcdGxldCBpTWFwcGluZ3NDb3VudCA9IDA7XG5cdFx0XHRpTWFwcGluZ3NDb3VudCA8IG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5zZW1hbnRpY09iamVjdE1hcHBpbmdzLmxlbmd0aDtcblx0XHRcdGlNYXBwaW5nc0NvdW50Kytcblx0XHQpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0b1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkLnNlbWFudGljT2JqZWN0TWFwcGluZ3NbaU1hcHBpbmdzQ291bnRdICYmXG5cdFx0XHRcdG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZC5zZW1hbnRpY09iamVjdE1hcHBpbmdzW2lNYXBwaW5nc0NvdW50XS5zZW1hbnRpY09iamVjdCA9PT0gdW5kZWZpbmVkXG5cdFx0XHQpIHtcblx0XHRcdFx0b1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkLnNlbWFudGljT2JqZWN0TWFwcGluZ3Muc3BsaWNlKGlNYXBwaW5nc0NvdW50LCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIG9QYXlsb2FkV2l0aER5bmFtaWNTZW1hbnRpY09iamVjdHNSZXNvbHZlZDtcbn07XG5cblNpbXBsZUxpbmtEZWxlZ2F0ZS5fZ2V0UGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQgPSBmdW5jdGlvbiAob1BheWxvYWQ6IGFueSwgYUxpbmtDdXN0b21EYXRhOiBhbnkpOiBhbnkge1xuXHRsZXQgb1BheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkOiBhbnk7XG5cdGNvbnN0IG9TZW1hbnRpY09iamVjdHNSZXNvbHZlZDogYW55ID0ge307XG5cdGNvbnN0IG5ld1BheWxvYWQ6IGFueSA9IHsgc2VtYW50aWNPYmplY3RzOiBbXSwgc2VtYW50aWNPYmplY3RzUmVzb2x2ZWQ6IFtdIH07XG5cdGlmIChvUGF5bG9hZC5zZW1hbnRpY09iamVjdHMpIHtcblx0XHQvLyBzYXAubS5MaW5rIGhhcyBjdXN0b20gZGF0YSB3aXRoIFNlbWFudGljIE9iamVjdHMgbmFtZXMgcmVzb2x2ZWRcblx0XHRpZiAoYUxpbmtDdXN0b21EYXRhICYmIGFMaW5rQ3VzdG9tRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRTaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljT2JqZWN0Q3VzdG9tRGF0YVZhbHVlKGFMaW5rQ3VzdG9tRGF0YSwgb1NlbWFudGljT2JqZWN0c1Jlc29sdmVkKTtcblx0XHRcdFNpbXBsZUxpbmtEZWxlZ2F0ZS5fY3JlYXRlTmV3UGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQob1BheWxvYWQsIG9TZW1hbnRpY09iamVjdHNSZXNvbHZlZCwgbmV3UGF5bG9hZCk7XG5cdFx0XHRvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX3NldFBheWxvYWRXaXRoRHluYW1pY1NlbWFudGljT2JqZWN0c1Jlc29sdmVkKFxuXHRcdFx0XHRvUGF5bG9hZCxcblx0XHRcdFx0bmV3UGF5bG9hZFxuXHRcdFx0KTtcblx0XHRcdHJldHVybiBvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQ7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cbn07XG5cblNpbXBsZUxpbmtEZWxlZ2F0ZS5fdXBkYXRlUGF5bG9hZFdpdGhTZW1hbnRpY0F0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoXG5cdGFTZW1hbnRpY09iamVjdHM6IGFueSxcblx0b0luZm9Mb2c6IGFueSxcblx0b0NvbnRleHRPYmplY3Q6IGFueSxcblx0b1Jlc3VsdHM6IGFueSxcblx0bVNlbWFudGljT2JqZWN0TWFwcGluZ3M6IGFueVxuKTogdm9pZCB7XG5cdGFTZW1hbnRpY09iamVjdHMuZm9yRWFjaChmdW5jdGlvbiAoc1NlbWFudGljT2JqZWN0OiBhbnkpIHtcblx0XHRpZiAob0luZm9Mb2cpIHtcblx0XHRcdG9JbmZvTG9nLmFkZENvbnRleHRPYmplY3Qoc1NlbWFudGljT2JqZWN0LCBvQ29udGV4dE9iamVjdCk7XG5cdFx0fVxuXHRcdG9SZXN1bHRzW3NTZW1hbnRpY09iamVjdF0gPSB7fTtcblx0XHRmb3IgKGNvbnN0IHNBdHRyaWJ1dGVOYW1lIGluIG9Db250ZXh0T2JqZWN0KSB7XG5cdFx0XHRsZXQgb0F0dHJpYnV0ZSA9IG51bGwsXG5cdFx0XHRcdG9UcmFuc2Zvcm1hdGlvbkFkZGl0aW9uYWwgPSBudWxsO1xuXHRcdFx0aWYgKG9JbmZvTG9nKSB7XG5cdFx0XHRcdG9BdHRyaWJ1dGUgPSBvSW5mb0xvZy5nZXRTZW1hbnRpY09iamVjdEF0dHJpYnV0ZShzU2VtYW50aWNPYmplY3QsIHNBdHRyaWJ1dGVOYW1lKTtcblx0XHRcdFx0aWYgKCFvQXR0cmlidXRlKSB7XG5cdFx0XHRcdFx0b0F0dHJpYnV0ZSA9IG9JbmZvTG9nLmNyZWF0ZUF0dHJpYnV0ZVN0cnVjdHVyZSgpO1xuXHRcdFx0XHRcdG9JbmZvTG9nLmFkZFNlbWFudGljT2JqZWN0QXR0cmlidXRlKHNTZW1hbnRpY09iamVjdCwgc0F0dHJpYnV0ZU5hbWUsIG9BdHRyaWJ1dGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBJZ25vcmUgdW5kZWZpbmVkIGFuZCBudWxsIHZhbHVlc1xuXHRcdFx0aWYgKG9Db250ZXh0T2JqZWN0W3NBdHRyaWJ1dGVOYW1lXSA9PT0gdW5kZWZpbmVkIHx8IG9Db250ZXh0T2JqZWN0W3NBdHRyaWJ1dGVOYW1lXSA9PT0gbnVsbCkge1xuXHRcdFx0XHRpZiAob0F0dHJpYnV0ZSkge1xuXHRcdFx0XHRcdG9BdHRyaWJ1dGUudHJhbnNmb3JtYXRpb25zLnB1c2goe1xuXHRcdFx0XHRcdFx0dmFsdWU6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBcIlxcdTIxMzkgVW5kZWZpbmVkIGFuZCBudWxsIHZhbHVlcyBoYXZlIGJlZW4gcmVtb3ZlZCBpbiBTaW1wbGVMaW5rRGVsZWdhdGUuXCJcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdC8vIElnbm9yZSBwbGFpbiBvYmplY3RzIChCQ1AgMTc3MDQ5NjYzOSlcblx0XHRcdGlmIChpc1BsYWluT2JqZWN0KG9Db250ZXh0T2JqZWN0W3NBdHRyaWJ1dGVOYW1lXSkpIHtcblx0XHRcdFx0aWYgKG1TZW1hbnRpY09iamVjdE1hcHBpbmdzICYmIG1TZW1hbnRpY09iamVjdE1hcHBpbmdzW3NTZW1hbnRpY09iamVjdF0pIHtcblx0XHRcdFx0XHRjb25zdCBhS2V5cyA9IE9iamVjdC5rZXlzKG1TZW1hbnRpY09iamVjdE1hcHBpbmdzW3NTZW1hbnRpY09iamVjdF0pO1xuXHRcdFx0XHRcdGxldCBzTmV3QXR0cmlidXRlTmFtZU1hcHBlZCwgc05ld0F0dHJpYnV0ZU5hbWUsIHNWYWx1ZSwgc0tleTtcblx0XHRcdFx0XHRmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYUtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG5cdFx0XHRcdFx0XHRzS2V5ID0gYUtleXNbaW5kZXhdO1xuXHRcdFx0XHRcdFx0aWYgKHNLZXkuaW5kZXhPZihzQXR0cmlidXRlTmFtZSkgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0c05ld0F0dHJpYnV0ZU5hbWVNYXBwZWQgPSBtU2VtYW50aWNPYmplY3RNYXBwaW5nc1tzU2VtYW50aWNPYmplY3RdW3NLZXldO1xuXHRcdFx0XHRcdFx0XHRzTmV3QXR0cmlidXRlTmFtZSA9IHNLZXkuc3BsaXQoXCIvXCIpW3NLZXkuc3BsaXQoXCIvXCIpLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRcdFx0XHRzVmFsdWUgPSBvQ29udGV4dE9iamVjdFtzQXR0cmlidXRlTmFtZV1bc05ld0F0dHJpYnV0ZU5hbWVdO1xuXHRcdFx0XHRcdFx0XHRpZiAoc05ld0F0dHJpYnV0ZU5hbWVNYXBwZWQgJiYgc05ld0F0dHJpYnV0ZU5hbWUgJiYgc1ZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0b1Jlc3VsdHNbc1NlbWFudGljT2JqZWN0XVtzTmV3QXR0cmlidXRlTmFtZU1hcHBlZF0gPSBzVmFsdWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9BdHRyaWJ1dGUpIHtcblx0XHRcdFx0XHRvQXR0cmlidXRlLnRyYW5zZm9ybWF0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHRcdHZhbHVlOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogXCJcXHUyMTM5IFBsYWluIG9iamVjdHMgaGFzIGJlZW4gcmVtb3ZlZCBpbiBTaW1wbGVMaW5rRGVsZWdhdGUuXCJcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFwIHRoZSBhdHRyaWJ1dGUgbmFtZSBvbmx5IGlmICdzZW1hbnRpY09iamVjdE1hcHBpbmcnIGlzIGRlZmluZWQuXG5cdFx0XHQvLyBOb3RlOiB1bmRlciBkZWZpbmVkICdzZW1hbnRpY09iamVjdE1hcHBpbmcnIHdlIGFsc28gbWVhbiBhbiBlbXB0eSBhbm5vdGF0aW9uIG9yIGFuIGFubm90YXRpb24gd2l0aCBlbXB0eSByZWNvcmRcblx0XHRcdGNvbnN0IHNBdHRyaWJ1dGVOYW1lTWFwcGVkID1cblx0XHRcdFx0bVNlbWFudGljT2JqZWN0TWFwcGluZ3MgJiZcblx0XHRcdFx0bVNlbWFudGljT2JqZWN0TWFwcGluZ3Nbc1NlbWFudGljT2JqZWN0XSAmJlxuXHRcdFx0XHRtU2VtYW50aWNPYmplY3RNYXBwaW5nc1tzU2VtYW50aWNPYmplY3RdW3NBdHRyaWJ1dGVOYW1lXVxuXHRcdFx0XHRcdD8gbVNlbWFudGljT2JqZWN0TWFwcGluZ3Nbc1NlbWFudGljT2JqZWN0XVtzQXR0cmlidXRlTmFtZV1cblx0XHRcdFx0XHQ6IHNBdHRyaWJ1dGVOYW1lO1xuXG5cdFx0XHRpZiAob0F0dHJpYnV0ZSAmJiBzQXR0cmlidXRlTmFtZSAhPT0gc0F0dHJpYnV0ZU5hbWVNYXBwZWQpIHtcblx0XHRcdFx0b1RyYW5zZm9ybWF0aW9uQWRkaXRpb25hbCA9IHtcblx0XHRcdFx0XHR2YWx1ZTogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdGRlc2NyaXB0aW9uOiBgXFx1MjEzOSBUaGUgYXR0cmlidXRlICR7c0F0dHJpYnV0ZU5hbWV9IGhhcyBiZWVuIHJlbmFtZWQgdG8gJHtzQXR0cmlidXRlTmFtZU1hcHBlZH0gaW4gU2ltcGxlTGlua0RlbGVnYXRlLmAsXG5cdFx0XHRcdFx0cmVhc29uOiBgXFx1ZDgzZFxcdWRkMzQgQSBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuU2VtYW50aWNPYmplY3RNYXBwaW5nIGFubm90YXRpb24gaXMgZGVmaW5lZCBmb3Igc2VtYW50aWMgb2JqZWN0ICR7c1NlbWFudGljT2JqZWN0fSB3aXRoIHNvdXJjZSBhdHRyaWJ1dGUgJHtzQXR0cmlidXRlTmFtZX0gYW5kIHRhcmdldCBhdHRyaWJ1dGUgJHtzQXR0cmlidXRlTmFtZU1hcHBlZH0uIFlvdSBjYW4gbW9kaWZ5IHRoZSBhbm5vdGF0aW9uIGlmIHRoZSBtYXBwaW5nIHJlc3VsdCBpcyBub3Qgd2hhdCB5b3UgZXhwZWN0ZWQuYFxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBtb3JlIHRoZW4gb25lIGxvY2FsIHByb3BlcnR5IG1hcHMgdG8gdGhlIHNhbWUgdGFyZ2V0IHByb3BlcnR5IChjbGFzaCBzaXR1YXRpb24pXG5cdFx0XHQvLyB3ZSB0YWtlIHRoZSB2YWx1ZSBvZiB0aGUgbGFzdCBwcm9wZXJ0eSBhbmQgd3JpdGUgYW4gZXJyb3IgbG9nXG5cdFx0XHRpZiAob1Jlc3VsdHNbc1NlbWFudGljT2JqZWN0XVtzQXR0cmlidXRlTmFtZU1hcHBlZF0pIHtcblx0XHRcdFx0TG9nLmVycm9yKFxuXHRcdFx0XHRcdGBTaW1wbGVMaW5rRGVsZWdhdGU6IFRoZSBhdHRyaWJ1dGUgJHtzQXR0cmlidXRlTmFtZX0gY2FuIG5vdCBiZSByZW5hbWVkIHRvIHRoZSBhdHRyaWJ1dGUgJHtzQXR0cmlidXRlTmFtZU1hcHBlZH0gZHVlIHRvIGEgY2xhc2ggc2l0dWF0aW9uLiBUaGlzIGNhbiBsZWFkIHRvIHdyb25nIG5hdmlnYXRpb24gbGF0ZXIgb24uYFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb3B5IHRoZSB2YWx1ZSByZXBsYWNpbmcgdGhlIGF0dHJpYnV0ZSBuYW1lIGJ5IHNlbWFudGljIG9iamVjdCBuYW1lXG5cdFx0XHRvUmVzdWx0c1tzU2VtYW50aWNPYmplY3RdW3NBdHRyaWJ1dGVOYW1lTWFwcGVkXSA9IG9Db250ZXh0T2JqZWN0W3NBdHRyaWJ1dGVOYW1lXTtcblxuXHRcdFx0aWYgKG9BdHRyaWJ1dGUpIHtcblx0XHRcdFx0aWYgKG9UcmFuc2Zvcm1hdGlvbkFkZGl0aW9uYWwpIHtcblx0XHRcdFx0XHRvQXR0cmlidXRlLnRyYW5zZm9ybWF0aW9ucy5wdXNoKG9UcmFuc2Zvcm1hdGlvbkFkZGl0aW9uYWwpO1xuXHRcdFx0XHRcdGNvbnN0IGFBdHRyaWJ1dGVOZXcgPSBvSW5mb0xvZy5jcmVhdGVBdHRyaWJ1dGVTdHJ1Y3R1cmUoKTtcblx0XHRcdFx0XHRhQXR0cmlidXRlTmV3LnRyYW5zZm9ybWF0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHRcdHZhbHVlOiBvQ29udGV4dE9iamVjdFtzQXR0cmlidXRlTmFtZV0sXG5cdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogYFxcdTIxMzkgVGhlIGF0dHJpYnV0ZSAke3NBdHRyaWJ1dGVOYW1lTWFwcGVkfSB3aXRoIHRoZSB2YWx1ZSAke29Db250ZXh0T2JqZWN0W3NBdHRyaWJ1dGVOYW1lXX0gaGFzIGJlZW4gYWRkZWQgZHVlIHRvIGEgbWFwcGluZyBydWxlIHJlZ2FyZGluZyB0aGUgYXR0cmlidXRlICR7c0F0dHJpYnV0ZU5hbWV9IGluIFNpbXBsZUxpbmtEZWxlZ2F0ZS5gXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0b0luZm9Mb2cuYWRkU2VtYW50aWNPYmplY3RBdHRyaWJ1dGUoc1NlbWFudGljT2JqZWN0LCBzQXR0cmlidXRlTmFtZU1hcHBlZCwgYUF0dHJpYnV0ZU5ldyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufTtcblxuLyoqXG4gKiBDaGVja3Mgd2hpY2ggYXR0cmlidXRlcyBvZiB0aGUgQ29udGV4dE9iamVjdCBiZWxvbmcgdG8gd2hpY2ggU2VtYW50aWNPYmplY3QgYW5kIG1hcHMgdGhlbSBpbnRvIGEgdHdvIGRpbWVuc2lvbmFsIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0gb0NvbnRleHRPYmplY3QgVGhlIEJpbmRpbmdDb250ZXh0IG9mIHRoZSBTb3VyY2VDb250cm9sIG9mIHRoZSBMaW5rIC8gb2YgdGhlIExpbmsgaXRzZWxmIGlmIG5vdCBzZXRcbiAqIEBwYXJhbSBvUGF5bG9hZCBUaGUgcGF5bG9hZCBnaXZlbiBieSB0aGUgYXBwbGljYXRpb25cbiAqIEBwYXJhbSBvSW5mb0xvZyBUaGUgY29ycmVzcG9uZGluZyBJbmZvTG9nIG9mIHRoZSBMaW5rXG4gKiBAcGFyYW0gb0xpbmsgVGhlIGNvcnJlc3BvbmRpbmcgTGlua1xuICogQHJldHVybnMgQSB0d28gZGltZW5zaW9uYWwgYXJyYXkgd2hpY2ggbWFwcyBhIGdpdmVuIFNlbWFudGljT2JqZWN0IG5hbWUgdG9nZXRoZXIgd2l0aCBhIGdpdmVuIGF0dHJpYnV0ZSBuYW1lIHRvIHRoZSB2YWx1ZSBvZiB0aGF0IGdpdmVuIGF0dHJpYnV0ZVxuICovXG5TaW1wbGVMaW5rRGVsZWdhdGUuX2NhbGN1bGF0ZVNlbWFudGljQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChvQ29udGV4dE9iamVjdDogYW55LCBvUGF5bG9hZDogYW55LCBvSW5mb0xvZzogYW55LCBvTGluazogYW55KSB7XG5cdGNvbnN0IGFMaW5rQ3VzdG9tRGF0YSA9IG9MaW5rICYmIHRoaXMuX2ZldGNoTGlua0N1c3RvbURhdGEob0xpbmspO1xuXHRjb25zdCBvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQ6IGFueSA9IFNpbXBsZUxpbmtEZWxlZ2F0ZS5fZ2V0UGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQoXG5cdFx0b1BheWxvYWQsXG5cdFx0YUxpbmtDdXN0b21EYXRhXG5cdCk7XG5cdGNvbnN0IG9QYXlsb2FkUmVzb2x2ZWQgPSBvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQgPyBvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQgOiBvUGF5bG9hZDtcblx0dGhpcy5yZXNvbHZlZHBheWxvYWQgPSBvUGF5bG9hZFdpdGhEeW5hbWljU2VtYW50aWNPYmplY3RzUmVzb2x2ZWQ7XG5cdGNvbnN0IGFTZW1hbnRpY09iamVjdHMgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljT2JqZWN0cyhvUGF5bG9hZFJlc29sdmVkKTtcblx0Y29uc3QgbVNlbWFudGljT2JqZWN0TWFwcGluZ3MgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX2NvbnZlcnRTZW1hbnRpY09iamVjdE1hcHBpbmcoXG5cdFx0U2ltcGxlTGlua0RlbGVnYXRlLl9nZXRTZW1hbnRpY09iamVjdE1hcHBpbmdzKG9QYXlsb2FkUmVzb2x2ZWQpXG5cdCk7XG5cdGlmICghYVNlbWFudGljT2JqZWN0cy5sZW5ndGgpIHtcblx0XHRhU2VtYW50aWNPYmplY3RzLnB1c2goXCJcIik7XG5cdH1cblx0Y29uc3Qgb1Jlc3VsdHM6IGFueSA9IHt9O1xuXHRTaW1wbGVMaW5rRGVsZWdhdGUuX3VwZGF0ZVBheWxvYWRXaXRoU2VtYW50aWNBdHRyaWJ1dGVzKGFTZW1hbnRpY09iamVjdHMsIG9JbmZvTG9nLCBvQ29udGV4dE9iamVjdCwgb1Jlc3VsdHMsIG1TZW1hbnRpY09iamVjdE1hcHBpbmdzKTtcblx0cmV0dXJuIHsgcGF5bG9hZDogb1BheWxvYWRSZXNvbHZlZCwgcmVzdWx0czogb1Jlc3VsdHMgfTtcbn07XG4vKipcbiAqIFJldHJpZXZlcyB0aGUgYWN0dWFsIHRhcmdldHMgZm9yIHRoZSBuYXZpZ2F0aW9uIG9mIHRoZSBsaW5rLiBUaGlzIHVzZXMgdGhlIFVTaGVsbCBsb2FkZWQgYnkgdGhlIHtAbGluayBzYXAudWkubWRjLmxpbmsuRmFjdG9yeX0gdG8gcmV0cmlldmVcbiAqIHRoZSBuYXZpZ2F0aW9uIHRhcmdldHMgZnJvbSB0aGUgRkxQIHNlcnZpY2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSBzQXBwU3RhdGVLZXkgS2V5IG9mIHRoZSBhcHBzdGF0ZSAobm90IHVzZWQgeWV0KVxuICogQHBhcmFtIG9TZW1hbnRpY0F0dHJpYnV0ZXMgVGhlIGNhbGN1bGF0ZWQgYnkgX2NhbGN1bGF0ZVNlbWFudGljQXR0cmlidXRlc1xuICogQHBhcmFtIG9QYXlsb2FkIFRoZSBwYXlsb2FkIGdpdmVuIGJ5IHRoZSBhcHBsaWNhdGlvblxuICogQHBhcmFtIG9JbmZvTG9nIFRoZSBjb3JyZXNwb25kaW5nIEluZm9Mb2cgb2YgdGhlIExpbmtcbiAqIEBwYXJhbSBvTGluayBUaGUgY29ycmVzcG9uZGluZyBMaW5rXG4gKiBAcmV0dXJucyBSZXNvbHZpbmcgaW50byBhdmFpbGFibGVBdGlvbnMgYW5kIG93bk5hdmlnYXRpb24gY29udGFpbmluZyBhbiBhcnJheSBvZiB7QGxpbmsgc2FwLnVpLm1kYy5saW5rLkxpbmtJdGVtfVxuICovXG5TaW1wbGVMaW5rRGVsZWdhdGUuX3JldHJpZXZlTmF2aWdhdGlvblRhcmdldHMgPSBmdW5jdGlvbiAoXG5cdHNBcHBTdGF0ZUtleTogc3RyaW5nLFxuXHRvU2VtYW50aWNBdHRyaWJ1dGVzOiBhbnksXG5cdG9QYXlsb2FkOiBhbnksXG5cdG9JbmZvTG9nOiBhbnksXG5cdG9MaW5rOiBhbnlcbikge1xuXHRpZiAoIW9QYXlsb2FkLnNlbWFudGljT2JqZWN0cykge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuXHR9XG5cdGNvbnN0IGFTZW1hbnRpY09iamVjdHMgPSBvUGF5bG9hZC5zZW1hbnRpY09iamVjdHM7XG5cdGNvbnN0IG9OYXZpZ2F0aW9uVGFyZ2V0czogYW55ID0ge1xuXHRcdG93bk5hdmlnYXRpb246IHVuZGVmaW5lZCxcblx0XHRhdmFpbGFibGVBY3Rpb25zOiBbXVxuXHR9O1xuXHRsZXQgaVN1cGVyaW9yQWN0aW9uTGlua3NGb3VuZCA9IDA7XG5cdHJldHVybiBDb3JlLmxvYWRMaWJyYXJ5KFwic2FwLnVpLmZsXCIsIHtcblx0XHRhc3luYzogdHJ1ZVxuXHR9KS50aGVuKCgpID0+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblx0XHRcdHNhcC51aS5yZXF1aXJlKFtcInNhcC91aS9mbC9VdGlsc1wiXSwgYXN5bmMgKFV0aWxzOiBhbnkpID0+IHtcblx0XHRcdFx0Y29uc3Qgb0FwcENvbXBvbmVudCA9IFV0aWxzLmdldEFwcENvbXBvbmVudEZvckNvbnRyb2wob0xpbmsgPT09IHVuZGVmaW5lZCA/IHRoaXMub0NvbnRyb2wgOiBvTGluayk7XG5cdFx0XHRcdGNvbnN0IG9TaGVsbFNlcnZpY2VzID0gb0FwcENvbXBvbmVudCA/IG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpIDogbnVsbDtcblx0XHRcdFx0aWYgKCFvU2hlbGxTZXJ2aWNlcykge1xuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0cmVzb2x2ZShvTmF2aWdhdGlvblRhcmdldHMuYXZhaWxhYmxlQWN0aW9ucywgb05hdmlnYXRpb25UYXJnZXRzLm93bk5hdmlnYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghb1NoZWxsU2VydmljZXMuaGFzVVNoZWxsKCkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJTaW1wbGVMaW5rRGVsZWdhdGU6IFNlcnZpY2UgJ0Nyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uJyBvciAnVVJMUGFyc2luZycgY291bGQgbm90IGJlIG9idGFpbmVkXCIpO1xuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0cmVzb2x2ZShvTmF2aWdhdGlvblRhcmdldHMuYXZhaWxhYmxlQWN0aW9ucywgb05hdmlnYXRpb25UYXJnZXRzLm93bk5hdmlnYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IGFQYXJhbXMgPSBhU2VtYW50aWNPYmplY3RzLm1hcChmdW5jdGlvbiAoc1NlbWFudGljT2JqZWN0OiBhbnkpIHtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzZW1hbnRpY09iamVjdDogc1NlbWFudGljT2JqZWN0LFxuXHRcdFx0XHRcdFx0XHRwYXJhbXM6IG9TZW1hbnRpY0F0dHJpYnV0ZXMgPyBvU2VtYW50aWNBdHRyaWJ1dGVzW3NTZW1hbnRpY09iamVjdF0gOiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRcdGFwcFN0YXRlS2V5OiBzQXBwU3RhdGVLZXksXG5cdFx0XHRcdFx0XHRcdHNvcnRSZXN1bHRzQnk6IFwidGV4dFwiXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Y29uc3QgYUxpbmtzID0gYXdhaXQgb1NoZWxsU2VydmljZXMuZ2V0TGlua3MoYVBhcmFtcyk7XG5cdFx0XHRcdFx0bGV0IGJIYXNMaW5rcyA9IGZhbHNlO1xuXHRcdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYUxpbmtzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGFMaW5rc1tpXS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0XHRpZiAoYUxpbmtzW2ldW2pdLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRiSGFzTGlua3MgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChiSGFzTGlua3MpIHtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICghYUxpbmtzIHx8ICFhTGlua3MubGVuZ3RoIHx8ICFiSGFzTGlua3MpIHtcblx0XHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRcdHJlc29sdmUob05hdmlnYXRpb25UYXJnZXRzLmF2YWlsYWJsZUFjdGlvbnMsIG9OYXZpZ2F0aW9uVGFyZ2V0cy5vd25OYXZpZ2F0aW9uKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCBhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMgPSBTaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zKG9QYXlsb2FkKTtcblx0XHRcdFx0XHRjb25zdCBvVW5hdmFpbGFibGVBY3Rpb25zID1cblx0XHRcdFx0XHRcdFNpbXBsZUxpbmtEZWxlZ2F0ZS5fY29udmVydFNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb24oYVNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zKTtcblx0XHRcdFx0XHRsZXQgc0N1cnJlbnRIYXNoID0gRmllbGRSdW50aW1lLl9mbkZpeEhhc2hRdWVyeVN0cmluZyhDb21tb25VdGlscy5nZXRIYXNoKCkpO1xuXG5cdFx0XHRcdFx0aWYgKHNDdXJyZW50SGFzaCkge1xuXHRcdFx0XHRcdFx0Ly8gQkNQIDE3NzAzMTUwMzU6IHdlIGhhdmUgdG8gc2V0IHRoZSBlbmQtcG9pbnQgJz8nIG9mIGFjdGlvbiBpbiBvcmRlciB0byBhdm9pZCBtYXRjaGluZyBvZiBcIiNTYWxlc09yZGVyLW1hbmFnZVwiIGluIFwiI1NhbGVzT3JkZXItbWFuYWdlRnVsZmlsbG1lbnRcIlxuXHRcdFx0XHRcdFx0c0N1cnJlbnRIYXNoICs9IFwiP1wiO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IGZuSXNVbmF2YWlsYWJsZUFjdGlvbiA9IGZ1bmN0aW9uIChzU2VtYW50aWNPYmplY3Q6IGFueSwgc0FjdGlvbjogYW55KSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHQhIW9VbmF2YWlsYWJsZUFjdGlvbnMgJiZcblx0XHRcdFx0XHRcdFx0ISFvVW5hdmFpbGFibGVBY3Rpb25zW3NTZW1hbnRpY09iamVjdF0gJiZcblx0XHRcdFx0XHRcdFx0b1VuYXZhaWxhYmxlQWN0aW9uc1tzU2VtYW50aWNPYmplY3RdLmluZGV4T2Yoc0FjdGlvbikgPiAtMVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnN0IGZuQWRkTGluayA9IGZ1bmN0aW9uIChfb0xpbms6IGFueSkge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb1NoZWxsSGFzaCA9IG9TaGVsbFNlcnZpY2VzLnBhcnNlU2hlbGxIYXNoKF9vTGluay5pbnRlbnQpO1xuXHRcdFx0XHRcdFx0aWYgKGZuSXNVbmF2YWlsYWJsZUFjdGlvbihvU2hlbGxIYXNoLnNlbWFudGljT2JqZWN0LCBvU2hlbGxIYXNoLmFjdGlvbikpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc3Qgc0hyZWYgPSBgIyR7b1NoZWxsU2VydmljZXMuY29uc3RydWN0U2hlbGxIYXNoKHsgdGFyZ2V0OiB7IHNoZWxsSGFzaDogX29MaW5rLmludGVudCB9IH0pfWA7XG5cblx0XHRcdFx0XHRcdGlmIChfb0xpbmsuaW50ZW50ICYmIF9vTGluay5pbnRlbnQuaW5kZXhPZihzQ3VycmVudEhhc2gpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdC8vIFByZXZlbnQgY3VycmVudCBhcHAgZnJvbSBiZWluZyBsaXN0ZWRcblx0XHRcdFx0XHRcdFx0Ly8gTk9URTogSWYgdGhlIG5hdmlnYXRpb24gdGFyZ2V0IGV4aXN0cyBpblxuXHRcdFx0XHRcdFx0XHQvLyBtdWx0aXBsZSBjb250ZXh0cyAoflhYWFggaW4gaGFzaCkgdGhleSB3aWxsIGFsbCBiZSBza2lwcGVkXG5cdFx0XHRcdFx0XHRcdG9OYXZpZ2F0aW9uVGFyZ2V0cy5vd25OYXZpZ2F0aW9uID0gbmV3IExpbmtJdGVtKHtcblx0XHRcdFx0XHRcdFx0XHRocmVmOiBzSHJlZixcblx0XHRcdFx0XHRcdFx0XHR0ZXh0OiBfb0xpbmsudGV4dFxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y29uc3Qgb0xpbmtJdGVtID0gbmV3IExpbmtJdGVtKHtcblx0XHRcdFx0XHRcdFx0Ly8gQXMgdGhlIHJldHJpZXZlTmF2aWdhdGlvblRhcmdldHMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgc2V2ZXJhbCB0aW1lIHdlIGNhbiBub3QgY3JlYXRlIHRoZSBMaW5rSXRlbSBpbnN0YW5jZSB3aXRoIHRoZSBzYW1lIGlkXG5cdFx0XHRcdFx0XHRcdGtleTpcblx0XHRcdFx0XHRcdFx0XHRvU2hlbGxIYXNoLnNlbWFudGljT2JqZWN0ICYmIG9TaGVsbEhhc2guYWN0aW9uXG5cdFx0XHRcdFx0XHRcdFx0XHQ/IGAke29TaGVsbEhhc2guc2VtYW50aWNPYmplY3R9LSR7b1NoZWxsSGFzaC5hY3Rpb259YFxuXHRcdFx0XHRcdFx0XHRcdFx0OiB1bmRlZmluZWQsXG5cdFx0XHRcdFx0XHRcdHRleHQ6IF9vTGluay50ZXh0LFxuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbjogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0XHRocmVmOiBzSHJlZixcblx0XHRcdFx0XHRcdFx0Ly8gdGFyZ2V0OiBub3Qgc3VwcG9ydGVkIHlldFxuXHRcdFx0XHRcdFx0XHRpY29uOiB1bmRlZmluZWQsIC8vX29MaW5rLmljb24sXG5cdFx0XHRcdFx0XHRcdGluaXRpYWxseVZpc2libGU6IF9vTGluay50YWdzICYmIF9vTGluay50YWdzLmluZGV4T2YoXCJzdXBlcmlvckFjdGlvblwiKSA+IC0xXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGlmIChvTGlua0l0ZW0uZ2V0UHJvcGVydHkoXCJpbml0aWFsbHlWaXNpYmxlXCIpKSB7XG5cdFx0XHRcdFx0XHRcdGlTdXBlcmlvckFjdGlvbkxpbmtzRm91bmQrKztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG9OYXZpZ2F0aW9uVGFyZ2V0cy5hdmFpbGFibGVBY3Rpb25zLnB1c2gob0xpbmtJdGVtKTtcblxuXHRcdFx0XHRcdFx0aWYgKG9JbmZvTG9nKSB7XG5cdFx0XHRcdFx0XHRcdG9JbmZvTG9nLmFkZFNlbWFudGljT2JqZWN0SW50ZW50KG9TaGVsbEhhc2guc2VtYW50aWNPYmplY3QsIHtcblx0XHRcdFx0XHRcdFx0XHRpbnRlbnQ6IG9MaW5rSXRlbS5nZXRIcmVmKCksXG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogb0xpbmtJdGVtLmdldFRleHQoKVxuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGZvciAobGV0IG4gPSAwOyBuIDwgYVNlbWFudGljT2JqZWN0cy5sZW5ndGg7IG4rKykge1xuXHRcdFx0XHRcdFx0YUxpbmtzW25dWzBdLmZvckVhY2goZm5BZGRMaW5rKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGlTdXBlcmlvckFjdGlvbkxpbmtzRm91bmQgPT09IDApIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGlMaW5rSXRlbUluZGV4ID0gMDsgaUxpbmtJdGVtSW5kZXggPCBvTmF2aWdhdGlvblRhcmdldHMuYXZhaWxhYmxlQWN0aW9ucy5sZW5ndGg7IGlMaW5rSXRlbUluZGV4KyspIHtcblx0XHRcdFx0XHRcdFx0aWYgKGlMaW5rSXRlbUluZGV4IDwgdGhpcy5nZXRDb25zdGFudHMoKS5pTGlua3NTaG93bkluUG9wdXApIHtcblx0XHRcdFx0XHRcdFx0XHRvTmF2aWdhdGlvblRhcmdldHMuYXZhaWxhYmxlQWN0aW9uc1tpTGlua0l0ZW1JbmRleF0uc2V0UHJvcGVydHkoXCJpbml0aWFsbHlWaXNpYmxlXCIsIHRydWUpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcblx0XHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdFx0cmVzb2x2ZShvTmF2aWdhdGlvblRhcmdldHMuYXZhaWxhYmxlQWN0aW9ucywgb05hdmlnYXRpb25UYXJnZXRzLm93bk5hdmlnYXRpb24pO1xuXHRcdFx0XHR9IGNhdGNoIChvRXJyb3IpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJTaW1wbGVMaW5rRGVsZWdhdGU6ICdfcmV0cmlldmVOYXZpZ2F0aW9uVGFyZ2V0cycgZmFpbGVkIGV4ZWN1dGluZyBnZXRMaW5rcyBtZXRob2RcIik7XG5cdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudFxuXHRcdFx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdFx0XHRyZXNvbHZlKG9OYXZpZ2F0aW9uVGFyZ2V0cy5hdmFpbGFibGVBY3Rpb25zLCBvTmF2aWdhdGlvblRhcmdldHMub3duTmF2aWdhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljT2JqZWN0cyA9IGZ1bmN0aW9uIChvUGF5bG9hZDogYW55KSB7XG5cdHJldHVybiBvUGF5bG9hZC5zZW1hbnRpY09iamVjdHMgPyBvUGF5bG9hZC5zZW1hbnRpY09iamVjdHMgOiBbXTtcbn07XG5TaW1wbGVMaW5rRGVsZWdhdGUuX2dldFNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zID0gZnVuY3Rpb24gKG9QYXlsb2FkOiBhbnkpIHtcblx0Y29uc3QgYVNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zOiBhbnlbXSA9IFtdO1xuXHRpZiAob1BheWxvYWQuc2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMpIHtcblx0XHRvUGF5bG9hZC5zZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChvU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbjogYW55KSB7XG5cdFx0XHRhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMucHVzaChcblx0XHRcdFx0bmV3IFNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb24oe1xuXHRcdFx0XHRcdHNlbWFudGljT2JqZWN0OiBvU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbi5zZW1hbnRpY09iamVjdCxcblx0XHRcdFx0XHRhY3Rpb25zOiBvU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbi5hY3Rpb25zXG5cdFx0XHRcdH0pXG5cdFx0XHQpO1xuXHRcdH0pO1xuXHR9XG5cdHJldHVybiBhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnM7XG59O1xuXG4vKipcbiAqIFRoaXMgd2lsbCByZXR1cm4gYW4gYXJyYXkgb2Yge0BsaW5rIHNhcC51aS5tZGMubGluay5TZW1hbnRpY09iamVjdE1hcHBpbmd9IGRlcGVuZGluZyBvbiB0aGUgZ2l2ZW4gcGF5bG9hZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIG9QYXlsb2FkIFRoZSBwYXlsb2FkIGRlZmluZWQgYnkgdGhlIGFwcGxpY2F0aW9uXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBzZW1hbnRpYyBvYmplY3QgbWFwcGluZ3MuXG4gKi9cblNpbXBsZUxpbmtEZWxlZ2F0ZS5fZ2V0U2VtYW50aWNPYmplY3RNYXBwaW5ncyA9IGZ1bmN0aW9uIChvUGF5bG9hZDogYW55KSB7XG5cdGNvbnN0IGFTZW1hbnRpY09iamVjdE1hcHBpbmdzOiBhbnlbXSA9IFtdO1xuXHRsZXQgYVNlbWFudGljT2JqZWN0TWFwcGluZ0l0ZW1zOiBhbnlbXSA9IFtdO1xuXHRpZiAob1BheWxvYWQuc2VtYW50aWNPYmplY3RNYXBwaW5ncykge1xuXHRcdG9QYXlsb2FkLnNlbWFudGljT2JqZWN0TWFwcGluZ3MuZm9yRWFjaChmdW5jdGlvbiAob1NlbWFudGljT2JqZWN0TWFwcGluZzogYW55KSB7XG5cdFx0XHRhU2VtYW50aWNPYmplY3RNYXBwaW5nSXRlbXMgPSBbXTtcblx0XHRcdGlmIChvU2VtYW50aWNPYmplY3RNYXBwaW5nLml0ZW1zKSB7XG5cdFx0XHRcdG9TZW1hbnRpY09iamVjdE1hcHBpbmcuaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAob1NlbWFudGljT2JqZWN0TWFwcGluZ0l0ZW06IGFueSkge1xuXHRcdFx0XHRcdGFTZW1hbnRpY09iamVjdE1hcHBpbmdJdGVtcy5wdXNoKFxuXHRcdFx0XHRcdFx0bmV3IFNlbWFudGljT2JqZWN0TWFwcGluZ0l0ZW0oe1xuXHRcdFx0XHRcdFx0XHRrZXk6IG9TZW1hbnRpY09iamVjdE1hcHBpbmdJdGVtLmtleSxcblx0XHRcdFx0XHRcdFx0dmFsdWU6IG9TZW1hbnRpY09iamVjdE1hcHBpbmdJdGVtLnZhbHVlXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0YVNlbWFudGljT2JqZWN0TWFwcGluZ3MucHVzaChcblx0XHRcdFx0bmV3IFNlbWFudGljT2JqZWN0TWFwcGluZyh7XG5cdFx0XHRcdFx0c2VtYW50aWNPYmplY3Q6IG9TZW1hbnRpY09iamVjdE1hcHBpbmcuc2VtYW50aWNPYmplY3QsXG5cdFx0XHRcdFx0aXRlbXM6IGFTZW1hbnRpY09iamVjdE1hcHBpbmdJdGVtc1xuXHRcdFx0XHR9KVxuXHRcdFx0KTtcblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gYVNlbWFudGljT2JqZWN0TWFwcGluZ3M7XG59O1xuLyoqXG4gKiBDb252ZXJ0cyBhIGdpdmVuIGFycmF5IG9mIFNlbWFudGljT2JqZWN0TWFwcGluZyBpbnRvIGEgTWFwIGNvbnRhaW5pbmcgU2VtYW50aWNPYmplY3RzIGFzIEtleXMgYW5kIGEgTWFwIG9mIGl0J3MgY29ycmVzcG9uZGluZyBTZW1hbnRpY09iamVjdE1hcHBpbmdzIGFzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIGFTZW1hbnRpY09iamVjdE1hcHBpbmdzIEFuIGFycmF5IG9mIFNlbWFudGljT2JqZWN0TWFwcGluZ3MuXG4gKiBAcmV0dXJucyBUaGUgY29udmVydGVyZCBTZW1hbnRpY09iamVjdE1hcHBpbmdzXG4gKi9cblNpbXBsZUxpbmtEZWxlZ2F0ZS5fY29udmVydFNlbWFudGljT2JqZWN0TWFwcGluZyA9IGZ1bmN0aW9uIChhU2VtYW50aWNPYmplY3RNYXBwaW5nczogYW55W10pIHtcblx0aWYgKCFhU2VtYW50aWNPYmplY3RNYXBwaW5ncy5sZW5ndGgpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdGNvbnN0IG1TZW1hbnRpY09iamVjdE1hcHBpbmdzOiBhbnkgPSB7fTtcblx0YVNlbWFudGljT2JqZWN0TWFwcGluZ3MuZm9yRWFjaChmdW5jdGlvbiAob1NlbWFudGljT2JqZWN0TWFwcGluZzogYW55KSB7XG5cdFx0aWYgKCFvU2VtYW50aWNPYmplY3RNYXBwaW5nLmdldFNlbWFudGljT2JqZWN0KCkpIHtcblx0XHRcdHRocm93IEVycm9yKFxuXHRcdFx0XHRgU2ltcGxlTGlua0RlbGVnYXRlOiAnc2VtYW50aWNPYmplY3QnIHByb3BlcnR5IHdpdGggdmFsdWUgJyR7b1NlbWFudGljT2JqZWN0TWFwcGluZy5nZXRTZW1hbnRpY09iamVjdCgpfScgaXMgbm90IHZhbGlkYFxuXHRcdFx0KTtcblx0XHR9XG5cdFx0bVNlbWFudGljT2JqZWN0TWFwcGluZ3Nbb1NlbWFudGljT2JqZWN0TWFwcGluZy5nZXRTZW1hbnRpY09iamVjdCgpXSA9IG9TZW1hbnRpY09iamVjdE1hcHBpbmdcblx0XHRcdC5nZXRJdGVtcygpXG5cdFx0XHQucmVkdWNlKGZ1bmN0aW9uIChvTWFwOiBhbnksIG9JdGVtOiBhbnkpIHtcblx0XHRcdFx0b01hcFtvSXRlbS5nZXRLZXkoKV0gPSBvSXRlbS5nZXRWYWx1ZSgpO1xuXHRcdFx0XHRyZXR1cm4gb01hcDtcblx0XHRcdH0sIHt9KTtcblx0fSk7XG5cdHJldHVybiBtU2VtYW50aWNPYmplY3RNYXBwaW5ncztcbn07XG4vKipcbiAqIENvbnZlcnRzIGEgZ2l2ZW4gYXJyYXkgb2YgU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMgaW50byBhIG1hcCBjb250YWluaW5nIFNlbWFudGljT2JqZWN0cyBhcyBrZXlzIGFuZCBhIG1hcCBvZiBpdHMgY29ycmVzcG9uZGluZyBTZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucyBhcyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSBhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMgVGhlIFNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zIGNvbnZlcnRlZFxuICogQHJldHVybnMgVGhlIG1hcCBjb250YWluaW5nIHRoZSBjb252ZXJ0ZWQgU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnNcbiAqL1xuU2ltcGxlTGlua0RlbGVnYXRlLl9jb252ZXJ0U2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbiA9IGZ1bmN0aW9uIChhU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnM6IGFueVtdKSB7XG5cdGxldCBfU2VtYW50aWNPYmplY3ROYW1lOiBhbnk7XG5cdGxldCBfU2VtYW50aWNPYmplY3RIYXNBbHJlYWR5VW5hdmFpbGFibGVBY3Rpb25zOiBhbnk7XG5cdGxldCBfVW5hdmFpbGFibGVBY3Rpb25zOiBhbnlbXSA9IFtdO1xuXHRpZiAoIWFTZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucy5sZW5ndGgpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cdGNvbnN0IG1TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9uczogYW55ID0ge307XG5cdGFTZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChvU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnM6IGFueSkge1xuXHRcdF9TZW1hbnRpY09iamVjdE5hbWUgPSBvU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMuZ2V0U2VtYW50aWNPYmplY3QoKTtcblx0XHRpZiAoIV9TZW1hbnRpY09iamVjdE5hbWUpIHtcblx0XHRcdHRocm93IEVycm9yKGBTaW1wbGVMaW5rRGVsZWdhdGU6ICdzZW1hbnRpY09iamVjdCcgcHJvcGVydHkgd2l0aCB2YWx1ZSAnJHtfU2VtYW50aWNPYmplY3ROYW1lfScgaXMgbm90IHZhbGlkYCk7XG5cdFx0fVxuXHRcdF9VbmF2YWlsYWJsZUFjdGlvbnMgPSBvU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnMuZ2V0QWN0aW9ucygpO1xuXHRcdGlmIChtU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnNbX1NlbWFudGljT2JqZWN0TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0bVNlbWFudGljT2JqZWN0VW5hdmFpbGFibGVBY3Rpb25zW19TZW1hbnRpY09iamVjdE5hbWVdID0gX1VuYXZhaWxhYmxlQWN0aW9ucztcblx0XHR9IGVsc2Uge1xuXHRcdFx0X1NlbWFudGljT2JqZWN0SGFzQWxyZWFkeVVuYXZhaWxhYmxlQWN0aW9ucyA9IG1TZW1hbnRpY09iamVjdFVuYXZhaWxhYmxlQWN0aW9uc1tfU2VtYW50aWNPYmplY3ROYW1lXTtcblx0XHRcdF9VbmF2YWlsYWJsZUFjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoVW5hdmFpbGFibGVBY3Rpb246IHN0cmluZykge1xuXHRcdFx0XHRfU2VtYW50aWNPYmplY3RIYXNBbHJlYWR5VW5hdmFpbGFibGVBY3Rpb25zLnB1c2goVW5hdmFpbGFibGVBY3Rpb24pO1xuXHRcdFx0fSk7XG5cdFx0XHRtU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnNbX1NlbWFudGljT2JqZWN0TmFtZV0gPSBfU2VtYW50aWNPYmplY3RIYXNBbHJlYWR5VW5hdmFpbGFibGVBY3Rpb25zO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBtU2VtYW50aWNPYmplY3RVbmF2YWlsYWJsZUFjdGlvbnM7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaW1wbGVMaW5rRGVsZWdhdGU7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7RUFrakJPLGdCQUFnQkEsSUFBaEIsRUFBc0JDLE9BQXRCLEVBQStCO0lBQ3JDLElBQUk7TUFDSCxJQUFJQyxNQUFNLEdBQUdGLElBQUksRUFBakI7SUFDQSxDQUZELENBRUUsT0FBTUcsQ0FBTixFQUFTO01BQ1YsT0FBT0YsT0FBTyxDQUFDRSxDQUFELENBQWQ7SUFDQTs7SUFDRCxJQUFJRCxNQUFNLElBQUlBLE1BQU0sQ0FBQ0UsSUFBckIsRUFBMkI7TUFDMUIsT0FBT0YsTUFBTSxDQUFDRSxJQUFQLENBQVksS0FBSyxDQUFqQixFQUFvQkgsT0FBcEIsQ0FBUDtJQUNBOztJQUNELE9BQU9DLE1BQVA7RUFDQTs7RUFuaUJELElBQU1HLGtCQUFrQixHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCQyxZQUFsQixDQUEzQjtFQUNBLElBQU1DLFNBQVMsR0FBRztJQUNqQkMsa0JBQWtCLEVBQUUsQ0FESDtJQUVqQkMsUUFBUSxFQUFFLFlBRk87SUFHakJDLFlBQVksRUFBRSxpQkFIRztJQUlqQkMsb0JBQW9CLEVBQUUsd0JBSkw7SUFLakJDLGdC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