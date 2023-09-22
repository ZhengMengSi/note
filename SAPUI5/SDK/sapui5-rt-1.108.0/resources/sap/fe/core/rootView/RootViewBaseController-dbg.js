/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/core/BaseController", "sap/fe/core/CommonUtils", "sap/fe/core/controllerextensions/Placeholder", "sap/fe/core/helpers/ClassSupport", "sap/fe/macros/table/TableSizeHelper", "sap/ui/base/BindingParser", "sap/ui/core/routing/HashChanger", "sap/ui/model/json/JSONModel", "sap/ui/model/odata/v4/AnnotationHelper"], function (Log, BaseController, CommonUtils, Placeholder, ClassSupport, TableSizeHelper, BindingParser, HashChanger, JSONModel, AnnotationHelper) {
  "use strict";

  var _dec, _dec2, _class, _class2, _descriptor;

  var usingExtension = ClassSupport.usingExtension;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var RootViewBaseController = (_dec = defineUI5Class("sap.fe.core.rootView.RootViewBaseController"), _dec2 = usingExtension(Placeholder), _dec(_class = (_class2 = /*#__PURE__*/function (_BaseController) {
    _inheritsLoose(RootViewBaseController, _BaseController);

    function RootViewBaseController() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _BaseController.call.apply(_BaseController, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "oPlaceholder", _descriptor, _assertThisInitialized(_this));

      _this.bIsComputingTitleHierachy = false;
      return _this;
    }

    var _proto = RootViewBaseController.prototype;

    _proto.onInit = function onInit() {
      TableSizeHelper.init();
      this._aHelperModels = [];
    };

    _proto.getPlaceholder = function getPlaceholder() {
      return this.oPlaceholder;
    };

    _proto.attachRouteMatchers = function attachRouteMatchers() {
      this.oPlaceholder.attachRouteMatchers();
      this.getAppComponent().getRoutingService().attachAfterRouteMatched(this._onAfterRouteMatched, this);
    };

    _proto.onExit = function onExit() {
      this.getAppComponent().getRoutingService().detachAfterRouteMatched(this._onAfterRouteMatched, this);
      this.oRouter = undefined;
      TableSizeHelper.exit(); // Destroy all JSON models created dynamically for the views

      this._aHelperModels.forEach(function (oModel) {
        oModel.destroy();
      });
    }
    /**
     * Convenience method for getting the resource bundle.
     *
     * @public
     * @returns The resourceModel of the component
     */
    ;

    _proto.getResourceBundle = function getResourceBundle() {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    };

    _proto.getRouter = function getRouter() {
      if (!this.oRouter) {
        this.oRouter = this.getAppComponent().getRouter();
      }

      return this.oRouter;
    };

    _proto._createHelperModel = function _createHelperModel() {
      // We keep a reference on the models created dynamically, as they don't get destroyed
      // automatically when the view is destroyed.
      // This is done during onExit
      var oModel = new JSONModel();

      this._aHelperModels.push(oModel);

      return oModel;
    }
    /**
     * Function waiting for the Right most view to be ready.
     *
     * @memberof sap.fe.core.rootView.BaseController
     * @param oEvent Reference an Event parameter coming from routeMatched event
     * @returns A promise indicating when the right most view is ready
     */
    ;

    _proto.waitForRightMostViewReady = function waitForRightMostViewReady(oEvent) {
      return new Promise(function (resolve) {
        var aContainers = oEvent.getParameter("views"),
            // There can also be reuse components in the view, remove them before processing.
        aFEContainers = [];
        aContainers.forEach(function (oContainer) {
          var oView = oContainer;

          if (oContainer && oContainer.getComponentInstance) {
            var oComponentInstance = oContainer.getComponentInstance();
            oView = oComponentInstance.getRootControl();
          }

          if (oView && oView.getController() && oView.getController().pageReady) {
            aFEContainers.push(oView);
          }
        });
        var oRightMostFEView = aFEContainers[aFEContainers.length - 1];

        if (oRightMostFEView && oRightMostFEView.getController().pageReady.isPageReady()) {
          resolve(oRightMostFEView);
        } else if (oRightMostFEView) {
          oRightMostFEView.getController().pageReady.attachEventOnce("pageReady", function () {
            resolve(oRightMostFEView);
          });
        }
      });
    }
    /**
     * Callback when the navigation is done.
     *  - update the shell title.
     *  - update table scroll.
     *  - call onPageReady on the rightMostView.
     *
     * @param oEvent
     * @name sap.fe.core.rootView.BaseController#_onAfterRouteMatched
     * @memberof sap.fe.core.rootView.BaseController
     */
    ;

    _proto._onAfterRouteMatched = function _onAfterRouteMatched(oEvent) {
      var _this2 = this;

      if (!this._oRouteMatchedPromise) {
        this._oRouteMatchedPromise = this.waitForRightMostViewReady(oEvent).then(function (oView) {
          // The autoFocus is initially disabled on the navContainer or the FCL, so that the focus stays on the Shell menu
          // even if the app takes a long time to launch
          // The first time the view is displayed, we need to enable the autofocus so that it's managed properly during navigation
          var oRootControl = _this2.getView().getContent()[0];

          if (oRootControl && oRootControl.getAutoFocus && !oRootControl.getAutoFocus()) {
            oRootControl.setProperty("autoFocus", true, true); // Do not mark the container as invalid, otherwise it's re-rendered
          }

          var oAppComponent = _this2.getAppComponent();

          _this2._scrollTablesToLastNavigatedItems();

          if (oAppComponent.getEnvironmentCapabilities().getCapabilities().UShell) {
            _this2._computeTitleHierarchy(oView);
          }

          var bForceFocus = oAppComponent.getRouterProxy().isFocusForced();
          oAppComponent.getRouterProxy().setFocusForced(false); // reset

          if (oView.getController() && oView.getController().onPageReady && oView.getParent().onPageReady) {
            oView.getParent().onPageReady({
              forceFocus: bForceFocus
            });
          }

          if (_this2.onContainerReady) {
            _this2.onContainerReady();
          }
        }).catch(function (oError) {
          Log.error("An error occurs while computing the title hierarchy and calling focus method", oError);
        }).finally(function () {
          _this2._oRouteMatchedPromise = null;
        });
      }
    }
    /**
     * This function returns the TitleHierarchy cache ( or initializes it if undefined).
     *
     * @name sap.fe.core.rootView.BaseController#_getTitleHierarchyCache
     * @memberof sap.fe.core.rootView.BaseController
     * @returns  The TitleHierarchy cache
     */
    ;

    _proto._getTitleHierarchyCache = function _getTitleHierarchyCache() {
      if (!this.oTitleHierarchyCache) {
        this.oTitleHierarchyCache = {};
      }

      return this.oTitleHierarchyCache;
    }
    /**
     * This function returns a titleInfo object.
     *
     * @memberof sap.fe.core.rootView.BaseController
     * @param title
     * @param subtitle
     * @param sIntent The intent path to be redirected to
     * @returns The title information
     */
    ;

    _proto._computeTitleInfo = function _computeTitleInfo(title, subtitle, sIntent) {
      var aParts = sIntent.split("/");

      if (aParts[aParts.length - 1].indexOf("?") === -1) {
        sIntent += "?restoreHistory=true";
      } else {
        sIntent += "&restoreHistory=true";
      }

      return {
        title: title,
        subtitle: subtitle,
        intent: sIntent,
        icon: ""
      };
    };

    _proto._formatTitle = function _formatTitle(displayMode, titleValue, titleDescription) {
      var formattedTitle = "";

      switch (displayMode) {
        case "Value":
          formattedTitle = "".concat(titleValue);
          break;

        case "ValueDescription":
          formattedTitle = "".concat(titleValue, " (").concat(titleDescription, ")");
          break;

        case "DescriptionValue":
          formattedTitle = "".concat(titleDescription, " (").concat(titleValue, ")");
          break;

        case "Description":
          formattedTitle = "".concat(titleDescription);
          break;

        default:
      }

      return formattedTitle;
    }
    /**
     * Fetches the value of the HeaderInfo title for a given path.
     *
     * @param sPath The path to the entity
     * @returns A promise containing the formatted title, or an empty string if no HeaderInfo title annotation is available
     */
    ;

    _proto._fetchTitleValue = function _fetchTitleValue(sPath) {
      try {
        var _exit2 = false;

        var _this4 = this;

        var oAppComponent = _this4.getAppComponent(),
            oModel = _this4.getView().getModel(),
            oMetaModel = oAppComponent.getMetaModel(),
            sMetaPath = oMetaModel.getMetaPath(sPath),
            oBindingViewContext = oModel.createBindingContext(sPath),
            sValueExpression = AnnotationHelper.format(oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value")), {
          context: oMetaModel.createBindingContext("/")
        });

        if (!sValueExpression) {
          return Promise.resolve("");
        }

        var sTextExpression = AnnotationHelper.format(oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value/$Path@com.sap.vocabularies.Common.v1.Text")), {
          context: oMetaModel.createBindingContext("/")
        }),
            oPropertyContext = oMetaModel.getObject("".concat(sMetaPath, "/@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value/$Path@")),
            aPromises = [],
            oValueExpression = BindingParser.complexParser(sValueExpression),
            oPromiseForDisplayMode = new Promise(function (resolve) {
          var displayMode = CommonUtils.computeDisplayMode(oPropertyContext);
          resolve(displayMode);
        });
        aPromises.push(oPromiseForDisplayMode);
        var sValuePath = oValueExpression.parts ? oValueExpression.parts[0].path : oValueExpression.path,
            fnValueFormatter = oValueExpression.formatter,
            oValueBinding = oModel.bindProperty(sValuePath, oBindingViewContext);
        oValueBinding.initialize();
        var oPromiseForTitleValue = new Promise(function (resolve) {
          var fnChange = function (oEvent) {
            var sTargetValue = fnValueFormatter ? fnValueFormatter(oEvent.getSource().getValue()) : oEvent.getSource().getValue();
            oValueBinding.detachChange(fnChange);
            resolve(sTargetValue);
          };

          oValueBinding.attachChange(fnChange);
        });
        aPromises.push(oPromiseForTitleValue);

        if (sTextExpression) {
          var oTextExpression = BindingParser.complexParser(sTextExpression);
          var sTextPath = oTextExpression.parts ? oTextExpression.parts[0].path : oTextExpression.path;
          sTextPath = sValuePath.lastIndexOf("/") > -1 ? "".concat(sValuePath.slice(0, sValuePath.lastIndexOf("/")), "/").concat(sTextPath) : sTextPath;
          var fnTextFormatter = oTextExpression.formatter,
              oTextBinding = oModel.bindProperty(sTextPath, oBindingViewContext);
          oTextBinding.initialize();
          var oPromiseForTitleText = new Promise(function (resolve) {
            var fnChange = function (oEvent) {
              var sTargetText = fnTextFormatter ? fnTextFormatter(oEvent.getSource().getValue()) : oEvent.getSource().getValue();
              oTextBinding.detachChange(fnChange);
              resolve(sTargetText);
            };

            oTextBinding.attachChange(fnChange);
          });
          aPromises.push(oPromiseForTitleText);
        }

        var _temp2 = _catch(function () {
          return Promise.resolve(Promise.all(aPromises)).then(function (titleInfo) {
            var formattedTitle = "";

            if (typeof titleInfo !== "string") {
              formattedTitle = _this4._formatTitle(titleInfo[0], titleInfo[1], titleInfo[2]);
            }

            _exit2 = true;
            return formattedTitle;
          });
        }, function (error) {
          Log.error("Error while fetching the title from the header info :" + error);
        });

        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function (_result) {
          return _exit2 ? _result : "";
        }) : _exit2 ? _temp2 : "");
      } catch (e) {
        return Promise.reject(e);
      }
    };

    _proto._getAppSpecificHash = function _getAppSpecificHash() {
      // HashChanged isShellNavigationHashChanger
      return HashChanger.getInstance().hrefForAppSpecificHash ? HashChanger.getInstance().hrefForAppSpecificHash("") : "";
    };

    _proto._getHash = function _getHash() {
      return HashChanger.getInstance().getHash();
    }
    /**
     * This function returns titleInformation from a path.
     * It updates the cache to store Title Information if necessary
     *
     * @name sap.fe.core.rootView.BaseController#getTitleInfoFromPath
     * @memberof sap.fe.core.rootView.BaseController
     * @param {*} sPath path of the context to retrieve title information from MetaModel
     * @returns {Promise}  oTitleinformation returned as promise
     */
    ;

    _proto.getTitleInfoFromPath = function getTitleInfoFromPath(sPath) {
      var _this5 = this;

      var oTitleHierarchyCache = this._getTitleHierarchyCache();

      if (oTitleHierarchyCache[sPath]) {
        // The title info is already stored in the cache
        return Promise.resolve(oTitleHierarchyCache[sPath]);
      }

      var oMetaModel = this.getAppComponent().getMetaModel();
      var sEntityPath = oMetaModel.getMetaPath(sPath);
      var sTypeName = oMetaModel.getObject("".concat(sEntityPath, "/@com.sap.vocabularies.UI.v1.HeaderInfo/TypeName"));

      var sAppSpecificHash = this._getAppSpecificHash();

      var sIntent = sAppSpecificHash + sPath.slice(1);
      return this._fetchTitleValue(sPath).then(function (sTitle) {
        var oTitleInfo = _this5._computeTitleInfo(sTypeName, sTitle, sIntent);

        oTitleHierarchyCache[sPath] = oTitleInfo;
        return oTitleInfo;
      });
    }
    /**
     * Ensure that the ushell service receives all elements
     * (title, subtitle, intent, icon) as strings.
     *
     * Annotation HeaderInfo allows for binding of title and description
     * (which are used here as title and subtitle) to any element in the entity
     * (being possibly types like boolean, timestamp, double, etc.)
     *
     * Creates a new hierarchy and converts non-string types to string.
     *
     * @param aHierarchy Shell title hierarchy
     * @returns Copy of shell title hierarchy containing all elements as strings
     */
    ;

    _proto._ensureHierarchyElementsAreStrings = function _ensureHierarchyElementsAreStrings(aHierarchy) {
      var aHierarchyShell = [];

      for (var level in aHierarchy) {
        var oHierarchy = aHierarchy[level];
        var oShellHierarchy = {};

        for (var key in oHierarchy) {
          oShellHierarchy[key] = typeof oHierarchy[key] !== "string" ? String(oHierarchy[key]) : oHierarchy[key];
        }

        aHierarchyShell.push(oShellHierarchy);
      }

      return aHierarchyShell;
    };

    _proto._getTargetTypeFromHash = function _getTargetTypeFromHash(sHash) {
      var oAppComponent = this.getAppComponent();
      var sTargetType = "";
      var aRoutes = oAppComponent.getManifestEntry("/sap.ui5/routing/routes");

      var _iterator = _createForOfIteratorHelper(aRoutes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var route = _step.value;
          var oRoute = oAppComponent.getRouter().getRoute(route.name);

          if (oRoute.match(sHash)) {
            var sTarget = Array.isArray(route.target) ? route.target[0] : route.target;
            sTargetType = oAppComponent.getRouter().getTarget(sTarget)._oOptions.name;
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return sTargetType;
    }
    /**
     * This function is updating the shell title after each navigation.
     *
     * @memberof sap.fe.core.rootView.BaseController
     * @param oView The current view
     * @returns A Promise that is resolved when the menu is filled properly
     */
    ;

    _proto._computeTitleHierarchy = function _computeTitleHierarchy(oView) {
      var _this6 = this;

      var oAppComponent = this.getAppComponent(),
          oContext = oView.getBindingContext(),
          oCurrentPage = oView.getParent(),
          aTitleInformationPromises = [],
          sAppSpecificHash = this._getAppSpecificHash(),
          sAppTitle = oAppComponent.getMetadata().getManifestEntry("sap.app").title || "",
          sAppSubTitle = oAppComponent.getMetadata().getManifestEntry("sap.app").appSubTitle || "";

      var oPageTitleInformation, sNewPath;

      if (oCurrentPage && oCurrentPage._getPageTitleInformation) {
        if (oContext) {
          // If the first page of the application is a LR, use the title and subtitle from the manifest
          if (this._getTargetTypeFromHash("") === "sap.fe.templates.ListReport") {
            aTitleInformationPromises.push(Promise.resolve(this._computeTitleInfo(sAppTitle, sAppSubTitle, sAppSpecificHash)));
          } // Then manage other pages


          sNewPath = oContext.getPath();
          var aPathParts = sNewPath.split("/");
          var sPath = "";
          aPathParts.shift(); // Remove the first segment (empty string) as it has been managed above

          aPathParts.pop(); // Remove the last segment as it corresponds to the current page and shouldn't appear in the menu

          aPathParts.forEach(function (sPathPart) {
            sPath += "/".concat(sPathPart);
            var oMetaModel = oAppComponent.getMetaModel(),
                sParameterPath = oMetaModel.getMetaPath(sPath),
                bIsParameterized = oMetaModel.getObject("".concat(sParameterPath, "/@com.sap.vocabularies.Common.v1.ResultContext"));

            if (!bIsParameterized) {
              aTitleInformationPromises.push(_this6.getTitleInfoFromPath(sPath));
            }
          });
        } // Current page


        oPageTitleInformation = oCurrentPage._getPageTitleInformation();
        oPageTitleInformation = this._computeTitleInfo(oPageTitleInformation.title, oPageTitleInformation.subtitle, sAppSpecificHash + this._getHash());

        if (oContext) {
          this._getTitleHierarchyCache()[sNewPath] = oPageTitleInformation;
        } else {
          this._getTitleHierarchyCache()[sAppSpecificHash] = oPageTitleInformation;
        }
      } else {
        aTitleInformationPromises.push(Promise.reject("Title information missing in HeaderInfo"));
      }

      return Promise.all(aTitleInformationPromises).then(function (aTitleInfoHierarchy) {
        // workaround for shell which is expecting all elements being of type string
        var aTitleInfoHierarchyShell = _this6._ensureHierarchyElementsAreStrings(aTitleInfoHierarchy),
            sTitle = oPageTitleInformation.title;

        aTitleInfoHierarchyShell.reverse();
        oAppComponent.getShellServices().setHierarchy(aTitleInfoHierarchyShell);
        oAppComponent.getShellServices().setTitle(sTitle);
      }).catch(function (sErrorMessage) {
        Log.error(sErrorMessage);
      }).finally(function () {
        _this6.bIsComputingTitleHierachy = false;
      }).catch(function (sErrorMessage) {
        Log.error(sErrorMessage);
      });
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;

    _proto.calculateLayout = function calculateLayout(iNextFCLLevel, sHash, sProposedLayout) {
      var keepCurrentLayout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      return null;
    }
    /**
     * Callback after a view has been bound to a context.
     *
     * @param oContext The context that has been bound to a view
     */
    ;

    _proto.onContextBoundToView = function onContextBoundToView(oContext) {
      if (oContext) {
        var sDeepestPath = this.getView().getModel("internal").getProperty("/deepestPath"),
            sViewContextPath = oContext.getPath();

        if (!sDeepestPath || sDeepestPath.indexOf(sViewContextPath) !== 0) {
          // There was no previous value for the deepest reached path, or the path
          // for the view isn't a subpath of the previous deepest path --> update
          this.getView().getModel("internal").setProperty("/deepestPath", sViewContextPath, undefined, true);
        }
      }
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;

    _proto.displayMessagePage = function displayMessagePage(sErrorMessage, mParameters) {
      // To be overridden
      return Promise.resolve(true);
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;

    _proto.updateUIStateForView = function updateUIStateForView(oView, FCLLevel) {// To be overriden
    } // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ;

    _proto.getInstancedViews = function getInstancedViews() {
      return []; // To be overriden
    };

    _proto._scrollTablesToLastNavigatedItems = function _scrollTablesToLastNavigatedItems() {// To be overriden
    };

    _proto.getAppContentContainer = function getAppContentContainer(view) {
      var oAppComponent = this.getAppComponent();
      var appContentId = oAppComponent.getManifestEntry("/sap.ui5/routing/config/controlId") || "appContent";
      return view.byId(appContentId);
    };

    return RootViewBaseController;
  }(BaseController), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "oPlaceholder", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return RootViewBaseController;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJib2R5IiwicmVjb3ZlciIsInJlc3VsdCIsImUiLCJ0aGVuIiwiUm9vdFZpZXdCYXNlQ29udHJvbGxlciIsImRlZmluZVVJNUNsYXNzIiwidXNpbmdFeHRlbnNpb24iLCJQbGFjZWhvbGRlciIsImJJc0NvbXB1dGluZ1RpdGxlSGllcmFjaHkiLCJvbkluaXQiLCJUYWJsZVNpemVIZWxwZXIiLCJpbml0IiwiX2FIZWxwZXJNb2RlbHMiLCJnZXRQbGFjZWhvbGRlciIsIm9QbGFjZWhvbGRlciIsImF0dGFjaFJvdXRlTWF0Y2hlcnMiLCJnZXRBcHBDb21wb25lbnQiLCJnZXRSb3V0aW5nU2VydmljZSIsImF0dGFjaEFmdGVyUm91dGVNYXRjaGVkIiwiX29uQWZ0ZXJSb3V0ZU1hdGNoZWQiLCJvbkV4aXQiLCJkZXRhY2hBZnRlclJvdXRlTWF0Y2hlZCIsIm9Sb3V0ZXIiLCJ1bmRlZmluZWQiLCJleGl0IiwiZm9yRWFjaCIsIm9Nb2RlbCIsImRlc3Ryb3kiLCJnZXRSZXNvdXJjZUJ1bmRsZSIsImdldE93bmVyQ29tcG9uZW50IiwiZ2V0TW9kZWwiLCJnZXRSb3V0ZXIiLCJfY3JlYXRlSGVscGVyTW9kZWwiLCJKU09OTW9kZWwiLCJwdXNoIiwid2FpdEZvclJpZ2h0TW9zdFZpZXdSZWFkeSIsIm9FdmVudCIsIlByb21pc2UiLCJyZXNvbHZlIiwiYUNvbnRhaW5lcnMiLCJnZXRQYXJhbWV0ZXIiLCJhRkVDb250YWluZXJzIiwib0NvbnRhaW5lciIsIm9WaWV3IiwiZ2V0Q29tcG9uZW50SW5zdGFuY2UiLCJvQ29tcG9uZW50SW5zdGFuY2UiLCJnZXRSb290Q29udHJvbCIsImdldENvbnRyb2xsZXIiLCJwYWdlUmVhZHkiLCJvUmlnaHRNb3N0RkVWaWV3IiwibGVuZ3RoIiwiaXNQYWdlUmVhZHkiLCJhdHRhY2hFdmVudE9uY2UiLCJfb1JvdXRlTWF0Y2hlZFByb21pc2UiLCJvUm9vdENvbnRyb2wiLCJnZXRWaWV3IiwiZ2V0Q29udGVudCIsImdldEF1dG9Gb2N1cyIsInNldFByb3BlcnR5Iiwib0FwcENvbXBvbmVudCIsIl9zY3JvbGxUYWJsZXNUb0xhc3ROYXZpZ2F0ZWRJdGVtcyIsImdldEVudmlyb25tZW50Q2FwYWJpbGl0aWVzIiwiZ2V0Q2FwYWJpbGl0aWVzIiwiVVNoZWxsIiwiX2NvbXB1dGVUaXRsZUhpZXJhcmNoeSIsImJGb3JjZUZvY3VzIiwiZ2V0Um91dGVyUHJveHkiLCJpc0ZvY3VzRm9yY2VkIiwic2V0Rm9jdXNGb3JjZWQiLCJvblBhZ2VSZWFkeSIsImdldFBhcmVudCIsImZvcmNlRm9jdXMiLCJvbkNvbnRhaW5lclJlYWR5IiwiY2F0Y2giLCJvRXJyb3IiLCJMb2ciLCJlcnJvciIsImZpbmFsbHkiLCJfZ2V0VGl0bGVIaWVyYXJjaHlDYWNoZSIsIm9UaXRsZUhpZXJhcmNoeUNhY2hlIiwiX2NvbXB1dGVUaXRsZUluZm8iLCJ0aXRsZSIsInN1YnRpdGxlIiwic0ludGVudCIsImFQYXJ0cyIsInNwbGl0IiwiaW5kZXhPZiIsImludGVudCIsImljb24iLCJfZm9ybWF0VGl0bGUiLCJkaXNwbGF5TW9kZSIsInRpdGxlVmFsdWUiLCJ0aXRsZURlc2NyaXB0aW9uIiwiZm9ybWF0dGVkVGl0bGUiLCJfZmV0Y2hUaXRsZVZhbHVlIiwic1BhdGgiLCJvTWV0YU1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwic01ldGFQYXRoIiwiZ2V0TWV0YVBhdGgiLCJvQmluZGluZ1ZpZXdDb250ZXh0IiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJzVmFsdWVFeHByZXNzaW9uIiwiQW5ub3RhdGlvbkhlbHBlciIsImZvcm1hdCIsImdldE9iamVjdCIsImNvbnRleHQiLCJzVGV4dEV4cHJlc3Npb24iLCJvUHJvcGVydHlDb250ZXh0IiwiYVByb21pc2VzIiwib1ZhbHVlRXhwcmVzc2lvbiIsIkJpbmRpbmdQYXJzZXIiLCJjb21wbGV4UGFyc2VyIiwib1Byb21pc2VGb3JEaXNwbGF5TW9kZSIsIkNvbW1vblV0aWxzIiwiY29tcHV0ZURpc3BsYXlNb2RlIiwic1ZhbHVlUGF0aCIsInBhcnRzIiwicGF0aCIsImZuVmFsdWVGb3JtYXR0ZXIiLCJmb3JtYXR0ZXIiLCJvVmFsdWVCaW5kaW5nIiwiYmluZFByb3BlcnR5IiwiaW5pdGlhbGl6ZSIsIm9Qcm9taXNlRm9yVGl0bGVWYWx1ZSIsImZuQ2hhbmdlIiwic1RhcmdldFZhbHVlIiwiZ2V0U291cmNlIiwiZ2V0VmFsdWUiLCJkZXRhY2hDaGFuZ2UiLCJhdHRhY2hDaGFuZ2UiLCJvVGV4dEV4cHJlc3Npb24iLCJzVGV4dFBhdGgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIiwiZm5UZXh0Rm9ybWF0dGVyIiwib1RleHRCaW5kaW5nIiwib1Byb21pc2VGb3JUaXRsZVRleHQiLCJzVGFyZ2V0VGV4dCIsImFsbCIsInRpdGxlSW5mbyIsIl9nZXRBcHBTcGVjaWZpY0hhc2giLCJIYXNoQ2hhbmdlciIsImdldEluc3RhbmNlIiwiaHJlZkZvckFwcFNwZWNpZmljSGFzaCIsIl9nZXRIYXNoIiwiZ2V0SGFzaCIsImdldFRpdGxlSW5mb0Zyb21QYXRoIiwic0VudGl0eVBhdGgiLCJzVHlwZU5hbWUiLCJzQXBwU3BlY2lmaWNIYXNoIiwic1RpdGxlIiwib1RpdGxlSW5mbyIsIl9lbnN1cmVIaWVyYXJjaHlFbGVtZW50c0FyZVN0cmluZ3MiLCJhSGllcmFyY2h5IiwiYUhpZXJhcmNoeVNoZWxsIiwibGV2ZWwiLCJvSGllcmFyY2h5Iiwib1NoZWxsSGllcmFyY2h5Iiwia2V5IiwiU3RyaW5nIiwiX2dldFRhcmdldFR5cGVGcm9tSGFzaCIsInNIYXNoIiwic1RhcmdldFR5cGUiLCJhUm91dGVzIiwiZ2V0TWFuaWZlc3RFbnRyeSIsInJvdXRlIiwib1JvdXRlIiwiZ2V0Um91dGUiLCJuYW1lIiwibWF0Y2giLCJzVGFyZ2V0IiwiQXJyYXkiLCJpc0FycmF5IiwidGFyZ2V0IiwiZ2V0VGFyZ2V0IiwiX29PcHRpb25zIiwib0NvbnRleHQiLCJnZXRCaW5kaW5nQ29udGV4dCIsIm9DdXJyZW50UGFnZSIsImFUaXRsZUluZm9ybWF0aW9uUHJvbWlzZXMiLCJzQXBwVGl0bGUiLCJnZXRNZXRhZGF0YSIsInNBcHBTdWJUaXRsZSIsImFwcFN1YlRpdGxlIiwib1BhZ2VUaXRsZUluZm9ybWF0aW9uIiwic05ld1BhdGgiLCJfZ2V0UGFnZVRpdGxlSW5mb3JtYXRpb24iLCJnZXRQYXRoIiwiYVBhdGhQYXJ0cyIsInNoaWZ0IiwicG9wIiwic1BhdGhQYXJ0Iiwic1BhcmFtZXRlclBhdGgiLCJiSXNQYXJhbWV0ZXJpemVkIiwicmVqZWN0IiwiYVRpdGxlSW5mb0hpZXJhcmNoeSIsImFUaXRsZUluZm9IaWVyYXJjaHlTaGVsbCIsInJldmVyc2UiLCJnZXRTaGVsbFNlcnZpY2VzIiwic2V0SGllcmFyY2h5Iiwic2V0VGl0bGUiLCJzRXJyb3JNZXNzYWdlIiwiY2FsY3VsYXRlTGF5b3V0IiwiaU5leHRGQ0xMZXZlbCIsInNQcm9wb3NlZExheW91dCIsImtlZXBDdXJyZW50TGF5b3V0Iiwib25Db250ZXh0Qm91bmRUb1ZpZXciLCJzRGVlcGVzdFBhdGgiLCJnZXRQcm9wZXJ0eSIsInNWaWV3Q29udGV4dFBhdGgiLCJkaXNwbGF5TWVzc2FnZVBhZ2UiLCJtUGFyYW1ldGVycyIsInVwZGF0ZVVJU3RhdGVGb3JWaWV3IiwiRkNMTGV2ZWwiLCJnZXRJbnN0YW5jZWRWaWV3cyIsImdldEFwcENvbnRlbnRDb250YWluZXIiLCJ2aWV3IiwiYXBwQ29udGVudElkIiwiYnlJZCIsIkJhc2VDb250cm9sbGVyIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJSb290Vmlld0Jhc2VDb250cm9sbGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IHR5cGUgRmxleGlibGVDb2x1bW5MYXlvdXQgZnJvbSBcInNhcC9mL0ZsZXhpYmxlQ29sdW1uTGF5b3V0XCI7XG5pbXBvcnQgQmFzZUNvbnRyb2xsZXIgZnJvbSBcInNhcC9mZS9jb3JlL0Jhc2VDb250cm9sbGVyXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgUGxhY2Vob2xkZXIgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL1BsYWNlaG9sZGVyXCI7XG5pbXBvcnQgeyBkZWZpbmVVSTVDbGFzcywgdXNpbmdFeHRlbnNpb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9DbGFzc1N1cHBvcnRcIjtcbmltcG9ydCBUYWJsZVNpemVIZWxwZXIgZnJvbSBcInNhcC9mZS9tYWNyb3MvdGFibGUvVGFibGVTaXplSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBOYXZDb250YWluZXIgZnJvbSBcInNhcC9tL05hdkNvbnRhaW5lclwiO1xuaW1wb3J0IEJpbmRpbmdQYXJzZXIgZnJvbSBcInNhcC91aS9iYXNlL0JpbmRpbmdQYXJzZXJcIjtcbmltcG9ydCB0eXBlIFZpZXcgZnJvbSBcInNhcC91aS9jb3JlL212Yy9WaWV3XCI7XG5pbXBvcnQgWE1MVmlldyBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL1hNTFZpZXdcIjtcbmltcG9ydCBIYXNoQ2hhbmdlciBmcm9tIFwic2FwL3VpL2NvcmUvcm91dGluZy9IYXNoQ2hhbmdlclwiO1xuaW1wb3J0IHR5cGUgUm91dGVyIGZyb20gXCJzYXAvdWkvY29yZS9yb3V0aW5nL1JvdXRlclwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IEFubm90YXRpb25IZWxwZXIgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Bbm5vdGF0aW9uSGVscGVyXCI7XG5pbXBvcnQgdHlwZSBSZXNvdXJjZU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvcmVzb3VyY2UvUmVzb3VyY2VNb2RlbFwiO1xuXG5AZGVmaW5lVUk1Q2xhc3MoXCJzYXAuZmUuY29yZS5yb290Vmlldy5Sb290Vmlld0Jhc2VDb250cm9sbGVyXCIpXG5jbGFzcyBSb290Vmlld0Jhc2VDb250cm9sbGVyIGV4dGVuZHMgQmFzZUNvbnRyb2xsZXIge1xuXHRAdXNpbmdFeHRlbnNpb24oUGxhY2Vob2xkZXIpXG5cdG9QbGFjZWhvbGRlciE6IFBsYWNlaG9sZGVyO1xuXHRwcml2YXRlIF9hSGVscGVyTW9kZWxzITogYW55W107XG5cdHByaXZhdGUgb1JvdXRlcj86IFJvdXRlcjtcblx0cHJpdmF0ZSBfb1JvdXRlTWF0Y2hlZFByb21pc2U6IGFueTtcblx0cHJpdmF0ZSBvVGl0bGVIaWVyYXJjaHlDYWNoZTogYW55O1xuXHRwcml2YXRlIGJJc0NvbXB1dGluZ1RpdGxlSGllcmFjaHkgPSBmYWxzZTtcblxuXHRvbkluaXQoKSB7XG5cdFx0VGFibGVTaXplSGVscGVyLmluaXQoKTtcblxuXHRcdHRoaXMuX2FIZWxwZXJNb2RlbHMgPSBbXTtcblx0fVxuXG5cdGdldFBsYWNlaG9sZGVyKCkge1xuXHRcdHJldHVybiB0aGlzLm9QbGFjZWhvbGRlcjtcblx0fVxuXHRhdHRhY2hSb3V0ZU1hdGNoZXJzKCkge1xuXHRcdHRoaXMub1BsYWNlaG9sZGVyLmF0dGFjaFJvdXRlTWF0Y2hlcnMoKTtcblx0XHR0aGlzLmdldEFwcENvbXBvbmVudCgpLmdldFJvdXRpbmdTZXJ2aWNlKCkuYXR0YWNoQWZ0ZXJSb3V0ZU1hdGNoZWQodGhpcy5fb25BZnRlclJvdXRlTWF0Y2hlZCwgdGhpcyk7XG5cdH1cblx0b25FeGl0KCkge1xuXHRcdHRoaXMuZ2V0QXBwQ29tcG9uZW50KCkuZ2V0Um91dGluZ1NlcnZpY2UoKS5kZXRhY2hBZnRlclJvdXRlTWF0Y2hlZCh0aGlzLl9vbkFmdGVyUm91dGVNYXRjaGVkLCB0aGlzKTtcblx0XHR0aGlzLm9Sb3V0ZXIgPSB1bmRlZmluZWQ7XG5cblx0XHRUYWJsZVNpemVIZWxwZXIuZXhpdCgpO1xuXG5cdFx0Ly8gRGVzdHJveSBhbGwgSlNPTiBtb2RlbHMgY3JlYXRlZCBkeW5hbWljYWxseSBmb3IgdGhlIHZpZXdzXG5cdFx0dGhpcy5fYUhlbHBlck1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChvTW9kZWw6IGFueSkge1xuXHRcdFx0b01vZGVsLmRlc3Ryb3koKTtcblx0XHR9KTtcblx0fVxuXHQvKipcblx0ICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciBnZXR0aW5nIHRoZSByZXNvdXJjZSBidW5kbGUuXG5cdCAqXG5cdCAqIEBwdWJsaWNcblx0ICogQHJldHVybnMgVGhlIHJlc291cmNlTW9kZWwgb2YgdGhlIGNvbXBvbmVudFxuXHQgKi9cblx0Z2V0UmVzb3VyY2VCdW5kbGUoKSB7XG5cdFx0cmV0dXJuICh0aGlzLmdldE93bmVyQ29tcG9uZW50KCkuZ2V0TW9kZWwoXCJpMThuXCIpIGFzIFJlc291cmNlTW9kZWwpLmdldFJlc291cmNlQnVuZGxlKCk7XG5cdH1cblx0Z2V0Um91dGVyKCkge1xuXHRcdGlmICghdGhpcy5vUm91dGVyKSB7XG5cdFx0XHR0aGlzLm9Sb3V0ZXIgPSB0aGlzLmdldEFwcENvbXBvbmVudCgpLmdldFJvdXRlcigpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLm9Sb3V0ZXI7XG5cdH1cblxuXHRfY3JlYXRlSGVscGVyTW9kZWwoKSB7XG5cdFx0Ly8gV2Uga2VlcCBhIHJlZmVyZW5jZSBvbiB0aGUgbW9kZWxzIGNyZWF0ZWQgZHluYW1pY2FsbHksIGFzIHRoZXkgZG9uJ3QgZ2V0IGRlc3Ryb3llZFxuXHRcdC8vIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgdmlldyBpcyBkZXN0cm95ZWQuXG5cdFx0Ly8gVGhpcyBpcyBkb25lIGR1cmluZyBvbkV4aXRcblx0XHRjb25zdCBvTW9kZWwgPSBuZXcgSlNPTk1vZGVsKCk7XG5cdFx0dGhpcy5fYUhlbHBlck1vZGVscy5wdXNoKG9Nb2RlbCk7XG5cblx0XHRyZXR1cm4gb01vZGVsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZ1bmN0aW9uIHdhaXRpbmcgZm9yIHRoZSBSaWdodCBtb3N0IHZpZXcgdG8gYmUgcmVhZHkuXG5cdCAqXG5cdCAqIEBtZW1iZXJvZiBzYXAuZmUuY29yZS5yb290Vmlldy5CYXNlQ29udHJvbGxlclxuXHQgKiBAcGFyYW0gb0V2ZW50IFJlZmVyZW5jZSBhbiBFdmVudCBwYXJhbWV0ZXIgY29taW5nIGZyb20gcm91dGVNYXRjaGVkIGV2ZW50XG5cdCAqIEByZXR1cm5zIEEgcHJvbWlzZSBpbmRpY2F0aW5nIHdoZW4gdGhlIHJpZ2h0IG1vc3QgdmlldyBpcyByZWFkeVxuXHQgKi9cblx0d2FpdEZvclJpZ2h0TW9zdFZpZXdSZWFkeShvRXZlbnQ6IGFueSkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcblx0XHRcdGNvbnN0IGFDb250YWluZXJzID0gb0V2ZW50LmdldFBhcmFtZXRlcihcInZpZXdzXCIpLFxuXHRcdFx0XHQvLyBUaGVyZSBjYW4gYWxzbyBiZSByZXVzZSBjb21wb25lbnRzIGluIHRoZSB2aWV3LCByZW1vdmUgdGhlbSBiZWZvcmUgcHJvY2Vzc2luZy5cblx0XHRcdFx0YUZFQ29udGFpbmVyczogYW55W10gPSBbXTtcblx0XHRcdGFDb250YWluZXJzLmZvckVhY2goZnVuY3Rpb24gKG9Db250YWluZXI6IGFueSkge1xuXHRcdFx0XHRsZXQgb1ZpZXcgPSBvQ29udGFpbmVyO1xuXHRcdFx0XHRpZiAob0NvbnRhaW5lciAmJiBvQ29udGFpbmVyLmdldENvbXBvbmVudEluc3RhbmNlKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb0NvbXBvbmVudEluc3RhbmNlID0gb0NvbnRhaW5lci5nZXRDb21wb25lbnRJbnN0YW5jZSgpO1xuXHRcdFx0XHRcdG9WaWV3ID0gb0NvbXBvbmVudEluc3RhbmNlLmdldFJvb3RDb250cm9sKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9WaWV3ICYmIG9WaWV3LmdldENvbnRyb2xsZXIoKSAmJiBvVmlldy5nZXRDb250cm9sbGVyKCkucGFnZVJlYWR5KSB7XG5cdFx0XHRcdFx0YUZFQ29udGFpbmVycy5wdXNoKG9WaWV3KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBvUmlnaHRNb3N0RkVWaWV3ID0gYUZFQ29udGFpbmVyc1thRkVDb250YWluZXJzLmxlbmd0aCAtIDFdO1xuXHRcdFx0aWYgKG9SaWdodE1vc3RGRVZpZXcgJiYgb1JpZ2h0TW9zdEZFVmlldy5nZXRDb250cm9sbGVyKCkucGFnZVJlYWR5LmlzUGFnZVJlYWR5KCkpIHtcblx0XHRcdFx0cmVzb2x2ZShvUmlnaHRNb3N0RkVWaWV3KTtcblx0XHRcdH0gZWxzZSBpZiAob1JpZ2h0TW9zdEZFVmlldykge1xuXHRcdFx0XHRvUmlnaHRNb3N0RkVWaWV3LmdldENvbnRyb2xsZXIoKS5wYWdlUmVhZHkuYXR0YWNoRXZlbnRPbmNlKFwicGFnZVJlYWR5XCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXNvbHZlKG9SaWdodE1vc3RGRVZpZXcpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsYmFjayB3aGVuIHRoZSBuYXZpZ2F0aW9uIGlzIGRvbmUuXG5cdCAqICAtIHVwZGF0ZSB0aGUgc2hlbGwgdGl0bGUuXG5cdCAqICAtIHVwZGF0ZSB0YWJsZSBzY3JvbGwuXG5cdCAqICAtIGNhbGwgb25QYWdlUmVhZHkgb24gdGhlIHJpZ2h0TW9zdFZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSBvRXZlbnRcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUucm9vdFZpZXcuQmFzZUNvbnRyb2xsZXIjX29uQWZ0ZXJSb3V0ZU1hdGNoZWRcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLnJvb3RWaWV3LkJhc2VDb250cm9sbGVyXG5cdCAqL1xuXHRfb25BZnRlclJvdXRlTWF0Y2hlZChvRXZlbnQ6IGFueSkge1xuXHRcdGlmICghdGhpcy5fb1JvdXRlTWF0Y2hlZFByb21pc2UpIHtcblx0XHRcdHRoaXMuX29Sb3V0ZU1hdGNoZWRQcm9taXNlID0gdGhpcy53YWl0Rm9yUmlnaHRNb3N0Vmlld1JlYWR5KG9FdmVudClcblx0XHRcdFx0LnRoZW4oKG9WaWV3OiBhbnkpID0+IHtcblx0XHRcdFx0XHQvLyBUaGUgYXV0b0ZvY3VzIGlzIGluaXRpYWxseSBkaXNhYmxlZCBvbiB0aGUgbmF2Q29udGFpbmVyIG9yIHRoZSBGQ0wsIHNvIHRoYXQgdGhlIGZvY3VzIHN0YXlzIG9uIHRoZSBTaGVsbCBtZW51XG5cdFx0XHRcdFx0Ly8gZXZlbiBpZiB0aGUgYXBwIHRha2VzIGEgbG9uZyB0aW1lIHRvIGxhdW5jaFxuXHRcdFx0XHRcdC8vIFRoZSBmaXJzdCB0aW1lIHRoZSB2aWV3IGlzIGRpc3BsYXllZCwgd2UgbmVlZCB0byBlbmFibGUgdGhlIGF1dG9mb2N1cyBzbyB0aGF0IGl0J3MgbWFuYWdlZCBwcm9wZXJseSBkdXJpbmcgbmF2aWdhdGlvblxuXHRcdFx0XHRcdGNvbnN0IG9Sb290Q29udHJvbCA9IHRoaXMuZ2V0VmlldygpLmdldENvbnRlbnQoKVswXSBhcyBhbnk7XG5cdFx0XHRcdFx0aWYgKG9Sb290Q29udHJvbCAmJiBvUm9vdENvbnRyb2wuZ2V0QXV0b0ZvY3VzICYmICFvUm9vdENvbnRyb2wuZ2V0QXV0b0ZvY3VzKCkpIHtcblx0XHRcdFx0XHRcdG9Sb290Q29udHJvbC5zZXRQcm9wZXJ0eShcImF1dG9Gb2N1c1wiLCB0cnVlLCB0cnVlKTsgLy8gRG8gbm90IG1hcmsgdGhlIGNvbnRhaW5lciBhcyBpbnZhbGlkLCBvdGhlcndpc2UgaXQncyByZS1yZW5kZXJlZFxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSB0aGlzLmdldEFwcENvbXBvbmVudCgpO1xuXHRcdFx0XHRcdHRoaXMuX3Njcm9sbFRhYmxlc1RvTGFzdE5hdmlnYXRlZEl0ZW1zKCk7XG5cdFx0XHRcdFx0aWYgKG9BcHBDb21wb25lbnQuZ2V0RW52aXJvbm1lbnRDYXBhYmlsaXRpZXMoKS5nZXRDYXBhYmlsaXRpZXMoKS5VU2hlbGwpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2NvbXB1dGVUaXRsZUhpZXJhcmNoeShvVmlldyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnN0IGJGb3JjZUZvY3VzID0gb0FwcENvbXBvbmVudC5nZXRSb3V0ZXJQcm94eSgpLmlzRm9jdXNGb3JjZWQoKTtcblx0XHRcdFx0XHRvQXBwQ29tcG9uZW50LmdldFJvdXRlclByb3h5KCkuc2V0Rm9jdXNGb3JjZWQoZmFsc2UpOyAvLyByZXNldFxuXHRcdFx0XHRcdGlmIChvVmlldy5nZXRDb250cm9sbGVyKCkgJiYgb1ZpZXcuZ2V0Q29udHJvbGxlcigpLm9uUGFnZVJlYWR5ICYmIG9WaWV3LmdldFBhcmVudCgpLm9uUGFnZVJlYWR5KSB7XG5cdFx0XHRcdFx0XHRvVmlldy5nZXRQYXJlbnQoKS5vblBhZ2VSZWFkeSh7IGZvcmNlRm9jdXM6IGJGb3JjZUZvY3VzIH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGhpcy5vbkNvbnRhaW5lclJlYWR5KSB7XG5cdFx0XHRcdFx0XHR0aGlzLm9uQ29udGFpbmVyUmVhZHkoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5jYXRjaChmdW5jdGlvbiAob0Vycm9yOiBhbnkpIHtcblx0XHRcdFx0XHRMb2cuZXJyb3IoXCJBbiBlcnJvciBvY2N1cnMgd2hpbGUgY29tcHV0aW5nIHRoZSB0aXRsZSBoaWVyYXJjaHkgYW5kIGNhbGxpbmcgZm9jdXMgbWV0aG9kXCIsIG9FcnJvcik7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0XHR0aGlzLl9vUm91dGVNYXRjaGVkUHJvbWlzZSA9IG51bGw7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIFRpdGxlSGllcmFyY2h5IGNhY2hlICggb3IgaW5pdGlhbGl6ZXMgaXQgaWYgdW5kZWZpbmVkKS5cblx0ICpcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUucm9vdFZpZXcuQmFzZUNvbnRyb2xsZXIjX2dldFRpdGxlSGllcmFyY2h5Q2FjaGVcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLnJvb3RWaWV3LkJhc2VDb250cm9sbGVyXG5cdCAqIEByZXR1cm5zICBUaGUgVGl0bGVIaWVyYXJjaHkgY2FjaGVcblx0ICovXG5cdF9nZXRUaXRsZUhpZXJhcmNoeUNhY2hlKCkge1xuXHRcdGlmICghdGhpcy5vVGl0bGVIaWVyYXJjaHlDYWNoZSkge1xuXHRcdFx0dGhpcy5vVGl0bGVIaWVyYXJjaHlDYWNoZSA9IHt9O1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5vVGl0bGVIaWVyYXJjaHlDYWNoZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYSB0aXRsZUluZm8gb2JqZWN0LlxuXHQgKlxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUucm9vdFZpZXcuQmFzZUNvbnRyb2xsZXJcblx0ICogQHBhcmFtIHRpdGxlXG5cdCAqIEBwYXJhbSBzdWJ0aXRsZVxuXHQgKiBAcGFyYW0gc0ludGVudCBUaGUgaW50ZW50IHBhdGggdG8gYmUgcmVkaXJlY3RlZCB0b1xuXHQgKiBAcmV0dXJucyBUaGUgdGl0bGUgaW5mb3JtYXRpb25cblx0ICovXG5cdF9jb21wdXRlVGl0bGVJbmZvKHRpdGxlOiBhbnksIHN1YnRpdGxlOiBhbnksIHNJbnRlbnQ6IGFueSkge1xuXHRcdGNvbnN0IGFQYXJ0cyA9IHNJbnRlbnQuc3BsaXQoXCIvXCIpO1xuXHRcdGlmIChhUGFydHNbYVBhcnRzLmxlbmd0aCAtIDFdLmluZGV4T2YoXCI/XCIpID09PSAtMSkge1xuXHRcdFx0c0ludGVudCArPSBcIj9yZXN0b3JlSGlzdG9yeT10cnVlXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNJbnRlbnQgKz0gXCImcmVzdG9yZUhpc3Rvcnk9dHJ1ZVwiO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0dGl0bGU6IHRpdGxlLFxuXHRcdFx0c3VidGl0bGU6IHN1YnRpdGxlLFxuXHRcdFx0aW50ZW50OiBzSW50ZW50LFxuXHRcdFx0aWNvbjogXCJcIlxuXHRcdH07XG5cdH1cblx0X2Zvcm1hdFRpdGxlKGRpc3BsYXlNb2RlOiBzdHJpbmcsIHRpdGxlVmFsdWU6IHN0cmluZywgdGl0bGVEZXNjcmlwdGlvbjogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRsZXQgZm9ybWF0dGVkVGl0bGUgPSBcIlwiO1xuXHRcdHN3aXRjaCAoZGlzcGxheU1vZGUpIHtcblx0XHRcdGNhc2UgXCJWYWx1ZVwiOlxuXHRcdFx0XHRmb3JtYXR0ZWRUaXRsZSA9IGAke3RpdGxlVmFsdWV9YDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiVmFsdWVEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRmb3JtYXR0ZWRUaXRsZSA9IGAke3RpdGxlVmFsdWV9ICgke3RpdGxlRGVzY3JpcHRpb259KWA7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBcIkRlc2NyaXB0aW9uVmFsdWVcIjpcblx0XHRcdFx0Zm9ybWF0dGVkVGl0bGUgPSBgJHt0aXRsZURlc2NyaXB0aW9ufSAoJHt0aXRsZVZhbHVlfSlgO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJEZXNjcmlwdGlvblwiOlxuXHRcdFx0XHRmb3JtYXR0ZWRUaXRsZSA9IGAke3RpdGxlRGVzY3JpcHRpb259YDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdH1cblx0XHRyZXR1cm4gZm9ybWF0dGVkVGl0bGU7XG5cdH1cblxuXHQvKipcblx0ICogRmV0Y2hlcyB0aGUgdmFsdWUgb2YgdGhlIEhlYWRlckluZm8gdGl0bGUgZm9yIGEgZ2l2ZW4gcGF0aC5cblx0ICpcblx0ICogQHBhcmFtIHNQYXRoIFRoZSBwYXRoIHRvIHRoZSBlbnRpdHlcblx0ICogQHJldHVybnMgQSBwcm9taXNlIGNvbnRhaW5pbmcgdGhlIGZvcm1hdHRlZCB0aXRsZSwgb3IgYW4gZW1wdHkgc3RyaW5nIGlmIG5vIEhlYWRlckluZm8gdGl0bGUgYW5ub3RhdGlvbiBpcyBhdmFpbGFibGVcblx0ICovXG5cdGFzeW5jIF9mZXRjaFRpdGxlVmFsdWUoc1BhdGg6IHN0cmluZykge1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSB0aGlzLmdldEFwcENvbXBvbmVudCgpLFxuXHRcdFx0b01vZGVsID0gdGhpcy5nZXRWaWV3KCkuZ2V0TW9kZWwoKSxcblx0XHRcdG9NZXRhTW9kZWwgPSBvQXBwQ29tcG9uZW50LmdldE1ldGFNb2RlbCgpLFxuXHRcdFx0c01ldGFQYXRoID0gb01ldGFNb2RlbC5nZXRNZXRhUGF0aChzUGF0aCksXG5cdFx0XHRvQmluZGluZ1ZpZXdDb250ZXh0ID0gb01vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KHNQYXRoKSxcblx0XHRcdHNWYWx1ZUV4cHJlc3Npb24gPSBBbm5vdGF0aW9uSGVscGVyLmZvcm1hdChcblx0XHRcdFx0b01ldGFNb2RlbC5nZXRPYmplY3QoYCR7c01ldGFQYXRofS9AY29tLnNhcC52b2NhYnVsYXJpZXMuVUkudjEuSGVhZGVySW5mby9UaXRsZS9WYWx1ZWApLFxuXHRcdFx0XHR7IGNvbnRleHQ6IG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpIGFzIENvbnRleHQgfVxuXHRcdFx0KTtcblx0XHRpZiAoIXNWYWx1ZUV4cHJlc3Npb24pIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoXCJcIik7XG5cdFx0fVxuXHRcdGNvbnN0IHNUZXh0RXhwcmVzc2lvbiA9IEFubm90YXRpb25IZWxwZXIuZm9ybWF0KFxuXHRcdFx0XHRvTWV0YU1vZGVsLmdldE9iamVjdChcblx0XHRcdFx0XHRgJHtzTWV0YVBhdGh9L0Bjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IZWFkZXJJbmZvL1RpdGxlL1ZhbHVlLyRQYXRoQGNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5UZXh0YFxuXHRcdFx0XHQpLFxuXHRcdFx0XHR7IGNvbnRleHQ6IG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoXCIvXCIpIGFzIENvbnRleHQgfVxuXHRcdFx0KSxcblx0XHRcdG9Qcm9wZXJ0eUNvbnRleHQgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzTWV0YVBhdGh9L0Bjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IZWFkZXJJbmZvL1RpdGxlL1ZhbHVlLyRQYXRoQGApLFxuXHRcdFx0YVByb21pc2VzOiBQcm9taXNlPHZvaWQ+W10gPSBbXSxcblx0XHRcdG9WYWx1ZUV4cHJlc3Npb24gPSBCaW5kaW5nUGFyc2VyLmNvbXBsZXhQYXJzZXIoc1ZhbHVlRXhwcmVzc2lvbiksXG5cdFx0XHRvUHJvbWlzZUZvckRpc3BsYXlNb2RlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG5cdFx0XHRcdGNvbnN0IGRpc3BsYXlNb2RlID0gQ29tbW9uVXRpbHMuY29tcHV0ZURpc3BsYXlNb2RlKG9Qcm9wZXJ0eUNvbnRleHQpO1xuXHRcdFx0XHRyZXNvbHZlKGRpc3BsYXlNb2RlKTtcblx0XHRcdH0pO1xuXHRcdGFQcm9taXNlcy5wdXNoKG9Qcm9taXNlRm9yRGlzcGxheU1vZGUpO1xuXHRcdGNvbnN0IHNWYWx1ZVBhdGggPSBvVmFsdWVFeHByZXNzaW9uLnBhcnRzID8gb1ZhbHVlRXhwcmVzc2lvbi5wYXJ0c1swXS5wYXRoIDogb1ZhbHVlRXhwcmVzc2lvbi5wYXRoLFxuXHRcdFx0Zm5WYWx1ZUZvcm1hdHRlciA9IG9WYWx1ZUV4cHJlc3Npb24uZm9ybWF0dGVyLFxuXHRcdFx0b1ZhbHVlQmluZGluZyA9IG9Nb2RlbC5iaW5kUHJvcGVydHkoc1ZhbHVlUGF0aCwgb0JpbmRpbmdWaWV3Q29udGV4dCk7XG5cdFx0b1ZhbHVlQmluZGluZy5pbml0aWFsaXplKCk7XG5cdFx0Y29uc3Qgb1Byb21pc2VGb3JUaXRsZVZhbHVlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6ICh2YWx1ZTogYW55KSA9PiB2b2lkKSB7XG5cdFx0XHRjb25zdCBmbkNoYW5nZSA9IGZ1bmN0aW9uIChvRXZlbnQ6IGFueSkge1xuXHRcdFx0XHRjb25zdCBzVGFyZ2V0VmFsdWUgPSBmblZhbHVlRm9ybWF0dGVyID8gZm5WYWx1ZUZvcm1hdHRlcihvRXZlbnQuZ2V0U291cmNlKCkuZ2V0VmFsdWUoKSkgOiBvRXZlbnQuZ2V0U291cmNlKCkuZ2V0VmFsdWUoKTtcblxuXHRcdFx0XHRvVmFsdWVCaW5kaW5nLmRldGFjaENoYW5nZShmbkNoYW5nZSk7XG5cdFx0XHRcdHJlc29sdmUoc1RhcmdldFZhbHVlKTtcblx0XHRcdH07XG5cdFx0XHRvVmFsdWVCaW5kaW5nLmF0dGFjaENoYW5nZShmbkNoYW5nZSk7XG5cdFx0fSk7XG5cdFx0YVByb21pc2VzLnB1c2gob1Byb21pc2VGb3JUaXRsZVZhbHVlKTtcblxuXHRcdGlmIChzVGV4dEV4cHJlc3Npb24pIHtcblx0XHRcdGNvbnN0IG9UZXh0RXhwcmVzc2lvbiA9IEJpbmRpbmdQYXJzZXIuY29tcGxleFBhcnNlcihzVGV4dEV4cHJlc3Npb24pO1xuXHRcdFx0bGV0IHNUZXh0UGF0aCA9IG9UZXh0RXhwcmVzc2lvbi5wYXJ0cyA/IG9UZXh0RXhwcmVzc2lvbi5wYXJ0c1swXS5wYXRoIDogb1RleHRFeHByZXNzaW9uLnBhdGg7XG5cdFx0XHRzVGV4dFBhdGggPSBzVmFsdWVQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSA+IC0xID8gYCR7c1ZhbHVlUGF0aC5zbGljZSgwLCBzVmFsdWVQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSl9LyR7c1RleHRQYXRofWAgOiBzVGV4dFBhdGg7XG5cblx0XHRcdGNvbnN0IGZuVGV4dEZvcm1hdHRlciA9IG9UZXh0RXhwcmVzc2lvbi5mb3JtYXR0ZXIsXG5cdFx0XHRcdG9UZXh0QmluZGluZyA9IG9Nb2RlbC5iaW5kUHJvcGVydHkoc1RleHRQYXRoLCBvQmluZGluZ1ZpZXdDb250ZXh0KTtcblx0XHRcdG9UZXh0QmluZGluZy5pbml0aWFsaXplKCk7XG5cdFx0XHRjb25zdCBvUHJvbWlzZUZvclRpdGxlVGV4dCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiAoZGVzY3JpcHRpb246IGFueSkgPT4gdm9pZCkge1xuXHRcdFx0XHRjb25zdCBmbkNoYW5nZSA9IGZ1bmN0aW9uIChvRXZlbnQ6IGFueSkge1xuXHRcdFx0XHRcdGNvbnN0IHNUYXJnZXRUZXh0ID0gZm5UZXh0Rm9ybWF0dGVyID8gZm5UZXh0Rm9ybWF0dGVyKG9FdmVudC5nZXRTb3VyY2UoKS5nZXRWYWx1ZSgpKSA6IG9FdmVudC5nZXRTb3VyY2UoKS5nZXRWYWx1ZSgpO1xuXG5cdFx0XHRcdFx0b1RleHRCaW5kaW5nLmRldGFjaENoYW5nZShmbkNoYW5nZSk7XG5cdFx0XHRcdFx0cmVzb2x2ZShzVGFyZ2V0VGV4dCk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0b1RleHRCaW5kaW5nLmF0dGFjaENoYW5nZShmbkNoYW5nZSk7XG5cdFx0XHR9KTtcblx0XHRcdGFQcm9taXNlcy5wdXNoKG9Qcm9taXNlRm9yVGl0bGVUZXh0KTtcblx0XHR9XG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IHRpdGxlSW5mbzogYW55W10gPSBhd2FpdCBQcm9taXNlLmFsbChhUHJvbWlzZXMpO1xuXHRcdFx0bGV0IGZvcm1hdHRlZFRpdGxlID0gXCJcIjtcblx0XHRcdGlmICh0eXBlb2YgdGl0bGVJbmZvICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdGZvcm1hdHRlZFRpdGxlID0gdGhpcy5fZm9ybWF0VGl0bGUodGl0bGVJbmZvWzBdLCB0aXRsZUluZm9bMV0sIHRpdGxlSW5mb1syXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZm9ybWF0dGVkVGl0bGU7XG5cdFx0fSBjYXRjaCAoZXJyb3I6IGFueSkge1xuXHRcdFx0TG9nLmVycm9yKFwiRXJyb3Igd2hpbGUgZmV0Y2hpbmcgdGhlIHRpdGxlIGZyb20gdGhlIGhlYWRlciBpbmZvIDpcIiArIGVycm9yKTtcblx0XHR9XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRfZ2V0QXBwU3BlY2lmaWNIYXNoKCkge1xuXHRcdC8vIEhhc2hDaGFuZ2VkIGlzU2hlbGxOYXZpZ2F0aW9uSGFzaENoYW5nZXJcblx0XHRyZXR1cm4gKEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkgYXMgYW55KS5ocmVmRm9yQXBwU3BlY2lmaWNIYXNoXG5cdFx0XHQ/IChIYXNoQ2hhbmdlci5nZXRJbnN0YW5jZSgpIGFzIGFueSkuaHJlZkZvckFwcFNwZWNpZmljSGFzaChcIlwiKVxuXHRcdFx0OiBcIlwiO1xuXHR9XG5cblx0X2dldEhhc2goKSB7XG5cdFx0cmV0dXJuIEhhc2hDaGFuZ2VyLmdldEluc3RhbmNlKCkuZ2V0SGFzaCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgZnVuY3Rpb24gcmV0dXJucyB0aXRsZUluZm9ybWF0aW9uIGZyb20gYSBwYXRoLlxuXHQgKiBJdCB1cGRhdGVzIHRoZSBjYWNoZSB0byBzdG9yZSBUaXRsZSBJbmZvcm1hdGlvbiBpZiBuZWNlc3Nhcnlcblx0ICpcblx0ICogQG5hbWUgc2FwLmZlLmNvcmUucm9vdFZpZXcuQmFzZUNvbnRyb2xsZXIjZ2V0VGl0bGVJbmZvRnJvbVBhdGhcblx0ICogQG1lbWJlcm9mIHNhcC5mZS5jb3JlLnJvb3RWaWV3LkJhc2VDb250cm9sbGVyXG5cdCAqIEBwYXJhbSB7Kn0gc1BhdGggcGF0aCBvZiB0aGUgY29udGV4dCB0byByZXRyaWV2ZSB0aXRsZSBpbmZvcm1hdGlvbiBmcm9tIE1ldGFNb2RlbFxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gIG9UaXRsZWluZm9ybWF0aW9uIHJldHVybmVkIGFzIHByb21pc2Vcblx0ICovXG5cblx0Z2V0VGl0bGVJbmZvRnJvbVBhdGgoc1BhdGg6IGFueSkge1xuXHRcdGNvbnN0IG9UaXRsZUhpZXJhcmNoeUNhY2hlID0gdGhpcy5fZ2V0VGl0bGVIaWVyYXJjaHlDYWNoZSgpO1xuXG5cdFx0aWYgKG9UaXRsZUhpZXJhcmNoeUNhY2hlW3NQYXRoXSkge1xuXHRcdFx0Ly8gVGhlIHRpdGxlIGluZm8gaXMgYWxyZWFkeSBzdG9yZWQgaW4gdGhlIGNhY2hlXG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG9UaXRsZUhpZXJhcmNoeUNhY2hlW3NQYXRoXSk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IHRoaXMuZ2V0QXBwQ29tcG9uZW50KCkuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0Y29uc3Qgc0VudGl0eVBhdGggPSBvTWV0YU1vZGVsLmdldE1ldGFQYXRoKHNQYXRoKTtcblx0XHRjb25zdCBzVHlwZU5hbWUgPSBvTWV0YU1vZGVsLmdldE9iamVjdChgJHtzRW50aXR5UGF0aH0vQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkhlYWRlckluZm8vVHlwZU5hbWVgKTtcblx0XHRjb25zdCBzQXBwU3BlY2lmaWNIYXNoID0gdGhpcy5fZ2V0QXBwU3BlY2lmaWNIYXNoKCk7XG5cdFx0Y29uc3Qgc0ludGVudCA9IHNBcHBTcGVjaWZpY0hhc2ggKyBzUGF0aC5zbGljZSgxKTtcblx0XHRyZXR1cm4gdGhpcy5fZmV0Y2hUaXRsZVZhbHVlKHNQYXRoKS50aGVuKChzVGl0bGU6IGFueSkgPT4ge1xuXHRcdFx0Y29uc3Qgb1RpdGxlSW5mbyA9IHRoaXMuX2NvbXB1dGVUaXRsZUluZm8oc1R5cGVOYW1lLCBzVGl0bGUsIHNJbnRlbnQpO1xuXHRcdFx0b1RpdGxlSGllcmFyY2h5Q2FjaGVbc1BhdGhdID0gb1RpdGxlSW5mbztcblx0XHRcdHJldHVybiBvVGl0bGVJbmZvO1xuXHRcdH0pO1xuXHR9XG5cdC8qKlxuXHQgKiBFbnN1cmUgdGhhdCB0aGUgdXNoZWxsIHNlcnZpY2UgcmVjZWl2ZXMgYWxsIGVsZW1lbnRzXG5cdCAqICh0aXRsZSwgc3VidGl0bGUsIGludGVudCwgaWNvbikgYXMgc3RyaW5ncy5cblx0ICpcblx0ICogQW5ub3RhdGlvbiBIZWFkZXJJbmZvIGFsbG93cyBmb3IgYmluZGluZyBvZiB0aXRsZSBhbmQgZGVzY3JpcHRpb25cblx0ICogKHdoaWNoIGFyZSB1c2VkIGhlcmUgYXMgdGl0bGUgYW5kIHN1YnRpdGxlKSB0byBhbnkgZWxlbWVudCBpbiB0aGUgZW50aXR5XG5cdCAqIChiZWluZyBwb3NzaWJseSB0eXBlcyBsaWtlIGJvb2xlYW4sIHRpbWVzdGFtcCwgZG91YmxlLCBldGMuKVxuXHQgKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGhpZXJhcmNoeSBhbmQgY29udmVydHMgbm9uLXN0cmluZyB0eXBlcyB0byBzdHJpbmcuXG5cdCAqXG5cdCAqIEBwYXJhbSBhSGllcmFyY2h5IFNoZWxsIHRpdGxlIGhpZXJhcmNoeVxuXHQgKiBAcmV0dXJucyBDb3B5IG9mIHNoZWxsIHRpdGxlIGhpZXJhcmNoeSBjb250YWluaW5nIGFsbCBlbGVtZW50cyBhcyBzdHJpbmdzXG5cdCAqL1xuXHRfZW5zdXJlSGllcmFyY2h5RWxlbWVudHNBcmVTdHJpbmdzKGFIaWVyYXJjaHk6IGFueSkge1xuXHRcdGNvbnN0IGFIaWVyYXJjaHlTaGVsbCA9IFtdO1xuXHRcdGZvciAoY29uc3QgbGV2ZWwgaW4gYUhpZXJhcmNoeSkge1xuXHRcdFx0Y29uc3Qgb0hpZXJhcmNoeSA9IGFIaWVyYXJjaHlbbGV2ZWxdO1xuXHRcdFx0Y29uc3Qgb1NoZWxsSGllcmFyY2h5OiBhbnkgPSB7fTtcblx0XHRcdGZvciAoY29uc3Qga2V5IGluIG9IaWVyYXJjaHkpIHtcblx0XHRcdFx0b1NoZWxsSGllcmFyY2h5W2tleV0gPSB0eXBlb2Ygb0hpZXJhcmNoeVtrZXldICE9PSBcInN0cmluZ1wiID8gU3RyaW5nKG9IaWVyYXJjaHlba2V5XSkgOiBvSGllcmFyY2h5W2tleV07XG5cdFx0XHR9XG5cdFx0XHRhSGllcmFyY2h5U2hlbGwucHVzaChvU2hlbGxIaWVyYXJjaHkpO1xuXHRcdH1cblx0XHRyZXR1cm4gYUhpZXJhcmNoeVNoZWxsO1xuXHR9XG5cblx0X2dldFRhcmdldFR5cGVGcm9tSGFzaChzSGFzaDogYW55KSB7XG5cdFx0Y29uc3Qgb0FwcENvbXBvbmVudCA9IHRoaXMuZ2V0QXBwQ29tcG9uZW50KCk7XG5cdFx0bGV0IHNUYXJnZXRUeXBlID0gXCJcIjtcblxuXHRcdGNvbnN0IGFSb3V0ZXMgPSBvQXBwQ29tcG9uZW50LmdldE1hbmlmZXN0RW50cnkoXCIvc2FwLnVpNS9yb3V0aW5nL3JvdXRlc1wiKTtcblx0XHRmb3IgKGNvbnN0IHJvdXRlIG9mIGFSb3V0ZXMpIHtcblx0XHRcdGNvbnN0IG9Sb3V0ZSA9IG9BcHBDb21wb25lbnQuZ2V0Um91dGVyKCkuZ2V0Um91dGUocm91dGUubmFtZSk7XG5cdFx0XHRpZiAob1JvdXRlLm1hdGNoKHNIYXNoKSkge1xuXHRcdFx0XHRjb25zdCBzVGFyZ2V0ID0gQXJyYXkuaXNBcnJheShyb3V0ZS50YXJnZXQpID8gcm91dGUudGFyZ2V0WzBdIDogcm91dGUudGFyZ2V0O1xuXHRcdFx0XHRzVGFyZ2V0VHlwZSA9IChvQXBwQ29tcG9uZW50LmdldFJvdXRlcigpLmdldFRhcmdldChzVGFyZ2V0KSBhcyBhbnkpLl9vT3B0aW9ucy5uYW1lO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gc1RhcmdldFR5cGU7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBmdW5jdGlvbiBpcyB1cGRhdGluZyB0aGUgc2hlbGwgdGl0bGUgYWZ0ZXIgZWFjaCBuYXZpZ2F0aW9uLlxuXHQgKlxuXHQgKiBAbWVtYmVyb2Ygc2FwLmZlLmNvcmUucm9vdFZpZXcuQmFzZUNvbnRyb2xsZXJcblx0ICogQHBhcmFtIG9WaWV3IFRoZSBjdXJyZW50IHZpZXdcblx0ICogQHJldHVybnMgQSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgbWVudSBpcyBmaWxsZWQgcHJvcGVybHlcblx0ICovXG5cdF9jb21wdXRlVGl0bGVIaWVyYXJjaHkob1ZpZXc6IGFueSkge1xuXHRcdGNvbnN0IG9BcHBDb21wb25lbnQgPSB0aGlzLmdldEFwcENvbXBvbmVudCgpLFxuXHRcdFx0b0NvbnRleHQgPSBvVmlldy5nZXRCaW5kaW5nQ29udGV4dCgpLFxuXHRcdFx0b0N1cnJlbnRQYWdlID0gb1ZpZXcuZ2V0UGFyZW50KCksXG5cdFx0XHRhVGl0bGVJbmZvcm1hdGlvblByb21pc2VzID0gW10sXG5cdFx0XHRzQXBwU3BlY2lmaWNIYXNoID0gdGhpcy5fZ2V0QXBwU3BlY2lmaWNIYXNoKCksXG5cdFx0XHRzQXBwVGl0bGUgPSBvQXBwQ29tcG9uZW50LmdldE1ldGFkYXRhKCkuZ2V0TWFuaWZlc3RFbnRyeShcInNhcC5hcHBcIikudGl0bGUgfHwgXCJcIixcblx0XHRcdHNBcHBTdWJUaXRsZSA9IG9BcHBDb21wb25lbnQuZ2V0TWV0YWRhdGEoKS5nZXRNYW5pZmVzdEVudHJ5KFwic2FwLmFwcFwiKS5hcHBTdWJUaXRsZSB8fCBcIlwiO1xuXHRcdGxldCBvUGFnZVRpdGxlSW5mb3JtYXRpb246IGFueSwgc05ld1BhdGg7XG5cblx0XHRpZiAob0N1cnJlbnRQYWdlICYmIG9DdXJyZW50UGFnZS5fZ2V0UGFnZVRpdGxlSW5mb3JtYXRpb24pIHtcblx0XHRcdGlmIChvQ29udGV4dCkge1xuXHRcdFx0XHQvLyBJZiB0aGUgZmlyc3QgcGFnZSBvZiB0aGUgYXBwbGljYXRpb24gaXMgYSBMUiwgdXNlIHRoZSB0aXRsZSBhbmQgc3VidGl0bGUgZnJvbSB0aGUgbWFuaWZlc3Rcblx0XHRcdFx0aWYgKHRoaXMuX2dldFRhcmdldFR5cGVGcm9tSGFzaChcIlwiKSA9PT0gXCJzYXAuZmUudGVtcGxhdGVzLkxpc3RSZXBvcnRcIikge1xuXHRcdFx0XHRcdGFUaXRsZUluZm9ybWF0aW9uUHJvbWlzZXMucHVzaChQcm9taXNlLnJlc29sdmUodGhpcy5fY29tcHV0ZVRpdGxlSW5mbyhzQXBwVGl0bGUsIHNBcHBTdWJUaXRsZSwgc0FwcFNwZWNpZmljSGFzaCkpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRoZW4gbWFuYWdlIG90aGVyIHBhZ2VzXG5cdFx0XHRcdHNOZXdQYXRoID0gb0NvbnRleHQuZ2V0UGF0aCgpO1xuXHRcdFx0XHRjb25zdCBhUGF0aFBhcnRzID0gc05ld1BhdGguc3BsaXQoXCIvXCIpO1xuXHRcdFx0XHRsZXQgc1BhdGggPSBcIlwiO1xuXG5cdFx0XHRcdGFQYXRoUGFydHMuc2hpZnQoKTsgLy8gUmVtb3ZlIHRoZSBmaXJzdCBzZWdtZW50IChlbXB0eSBzdHJpbmcpIGFzIGl0IGhhcyBiZWVuIG1hbmFnZWQgYWJvdmVcblx0XHRcdFx0YVBhdGhQYXJ0cy5wb3AoKTsgLy8gUmVtb3ZlIHRoZSBsYXN0IHNlZ21lbnQgYXMgaXQgY29ycmVzcG9uZHMgdG8gdGhlIGN1cnJlbnQgcGFnZSBhbmQgc2hvdWxkbid0IGFwcGVhciBpbiB0aGUgbWVudVxuXG5cdFx0XHRcdGFQYXRoUGFydHMuZm9yRWFjaCgoc1BhdGhQYXJ0OiBhbnkpID0+IHtcblx0XHRcdFx0XHRzUGF0aCArPSBgLyR7c1BhdGhQYXJ0fWA7XG5cdFx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG9BcHBDb21wb25lbnQuZ2V0TWV0YU1vZGVsKCksXG5cdFx0XHRcdFx0XHRzUGFyYW1ldGVyUGF0aCA9IG9NZXRhTW9kZWwuZ2V0TWV0YVBhdGgoc1BhdGgpLFxuXHRcdFx0XHRcdFx0YklzUGFyYW1ldGVyaXplZCA9IG9NZXRhTW9kZWwuZ2V0T2JqZWN0KGAke3NQYXJhbWV0ZXJQYXRofS9AY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLlJlc3VsdENvbnRleHRgKTtcblx0XHRcdFx0XHRpZiAoIWJJc1BhcmFtZXRlcml6ZWQpIHtcblx0XHRcdFx0XHRcdGFUaXRsZUluZm9ybWF0aW9uUHJvbWlzZXMucHVzaCh0aGlzLmdldFRpdGxlSW5mb0Zyb21QYXRoKHNQYXRoKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ3VycmVudCBwYWdlXG5cdFx0XHRvUGFnZVRpdGxlSW5mb3JtYXRpb24gPSBvQ3VycmVudFBhZ2UuX2dldFBhZ2VUaXRsZUluZm9ybWF0aW9uKCk7XG5cdFx0XHRvUGFnZVRpdGxlSW5mb3JtYXRpb24gPSB0aGlzLl9jb21wdXRlVGl0bGVJbmZvKFxuXHRcdFx0XHRvUGFnZVRpdGxlSW5mb3JtYXRpb24udGl0bGUsXG5cdFx0XHRcdG9QYWdlVGl0bGVJbmZvcm1hdGlvbi5zdWJ0aXRsZSxcblx0XHRcdFx0c0FwcFNwZWNpZmljSGFzaCArIHRoaXMuX2dldEhhc2goKVxuXHRcdFx0KTtcblxuXHRcdFx0aWYgKG9Db250ZXh0KSB7XG5cdFx0XHRcdHRoaXMuX2dldFRpdGxlSGllcmFyY2h5Q2FjaGUoKVtzTmV3UGF0aF0gPSBvUGFnZVRpdGxlSW5mb3JtYXRpb247XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9nZXRUaXRsZUhpZXJhcmNoeUNhY2hlKClbc0FwcFNwZWNpZmljSGFzaF0gPSBvUGFnZVRpdGxlSW5mb3JtYXRpb247XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFUaXRsZUluZm9ybWF0aW9uUHJvbWlzZXMucHVzaChQcm9taXNlLnJlamVjdChcIlRpdGxlIGluZm9ybWF0aW9uIG1pc3NpbmcgaW4gSGVhZGVySW5mb1wiKSk7XG5cdFx0fVxuXHRcdHJldHVybiBQcm9taXNlLmFsbChhVGl0bGVJbmZvcm1hdGlvblByb21pc2VzKVxuXHRcdFx0LnRoZW4oKGFUaXRsZUluZm9IaWVyYXJjaHk6IGFueVtdKSA9PiB7XG5cdFx0XHRcdC8vIHdvcmthcm91bmQgZm9yIHNoZWxsIHdoaWNoIGlzIGV4cGVjdGluZyBhbGwgZWxlbWVudHMgYmVpbmcgb2YgdHlwZSBzdHJpbmdcblx0XHRcdFx0Y29uc3QgYVRpdGxlSW5mb0hpZXJhcmNoeVNoZWxsID0gdGhpcy5fZW5zdXJlSGllcmFyY2h5RWxlbWVudHNBcmVTdHJpbmdzKGFUaXRsZUluZm9IaWVyYXJjaHkpLFxuXHRcdFx0XHRcdHNUaXRsZSA9IG9QYWdlVGl0bGVJbmZvcm1hdGlvbi50aXRsZTtcblx0XHRcdFx0YVRpdGxlSW5mb0hpZXJhcmNoeVNoZWxsLnJldmVyc2UoKTtcblx0XHRcdFx0b0FwcENvbXBvbmVudC5nZXRTaGVsbFNlcnZpY2VzKCkuc2V0SGllcmFyY2h5KGFUaXRsZUluZm9IaWVyYXJjaHlTaGVsbCk7XG5cdFx0XHRcdG9BcHBDb21wb25lbnQuZ2V0U2hlbGxTZXJ2aWNlcygpLnNldFRpdGxlKHNUaXRsZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChzRXJyb3JNZXNzYWdlOiBhbnkpIHtcblx0XHRcdFx0TG9nLmVycm9yKHNFcnJvck1lc3NhZ2UpO1xuXHRcdFx0fSlcblx0XHRcdC5maW5hbGx5KCgpID0+IHtcblx0XHRcdFx0dGhpcy5iSXNDb21wdXRpbmdUaXRsZUhpZXJhY2h5ID0gZmFsc2U7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChzRXJyb3JNZXNzYWdlOiBhbnkpIHtcblx0XHRcdFx0TG9nLmVycm9yKHNFcnJvck1lc3NhZ2UpO1xuXHRcdFx0fSk7XG5cdH1cblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdGNhbGN1bGF0ZUxheW91dChpTmV4dEZDTExldmVsOiBudW1iZXIsIHNIYXNoOiBzdHJpbmcsIHNQcm9wb3NlZExheW91dDogc3RyaW5nIHwgdW5kZWZpbmVkLCBrZWVwQ3VycmVudExheW91dCA9IGZhbHNlKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGJhY2sgYWZ0ZXIgYSB2aWV3IGhhcyBiZWVuIGJvdW5kIHRvIGEgY29udGV4dC5cblx0ICpcblx0ICogQHBhcmFtIG9Db250ZXh0IFRoZSBjb250ZXh0IHRoYXQgaGFzIGJlZW4gYm91bmQgdG8gYSB2aWV3XG5cdCAqL1xuXHRvbkNvbnRleHRCb3VuZFRvVmlldyhvQ29udGV4dDogYW55KSB7XG5cdFx0aWYgKG9Db250ZXh0KSB7XG5cdFx0XHRjb25zdCBzRGVlcGVzdFBhdGggPSB0aGlzLmdldFZpZXcoKS5nZXRNb2RlbChcImludGVybmFsXCIpLmdldFByb3BlcnR5KFwiL2RlZXBlc3RQYXRoXCIpLFxuXHRcdFx0XHRzVmlld0NvbnRleHRQYXRoID0gb0NvbnRleHQuZ2V0UGF0aCgpO1xuXG5cdFx0XHRpZiAoIXNEZWVwZXN0UGF0aCB8fCBzRGVlcGVzdFBhdGguaW5kZXhPZihzVmlld0NvbnRleHRQYXRoKSAhPT0gMCkge1xuXHRcdFx0XHQvLyBUaGVyZSB3YXMgbm8gcHJldmlvdXMgdmFsdWUgZm9yIHRoZSBkZWVwZXN0IHJlYWNoZWQgcGF0aCwgb3IgdGhlIHBhdGhcblx0XHRcdFx0Ly8gZm9yIHRoZSB2aWV3IGlzbid0IGEgc3VicGF0aCBvZiB0aGUgcHJldmlvdXMgZGVlcGVzdCBwYXRoIC0tPiB1cGRhdGVcblx0XHRcdFx0KHRoaXMuZ2V0VmlldygpLmdldE1vZGVsKFwiaW50ZXJuYWxcIikgYXMgSlNPTk1vZGVsKS5zZXRQcm9wZXJ0eShcIi9kZWVwZXN0UGF0aFwiLCBzVmlld0NvbnRleHRQYXRoLCB1bmRlZmluZWQsIHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcblx0ZGlzcGxheU1lc3NhZ2VQYWdlKHNFcnJvck1lc3NhZ2U6IGFueSwgbVBhcmFtZXRlcnM6IGFueSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdC8vIFRvIGJlIG92ZXJyaWRkZW5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuXHR9XG5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuXHR1cGRhdGVVSVN0YXRlRm9yVmlldyhvVmlldzogYW55LCBGQ0xMZXZlbDogYW55KSB7XG5cdFx0Ly8gVG8gYmUgb3ZlcnJpZGVuXG5cdH1cblxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5cdGdldEluc3RhbmNlZFZpZXdzKCk6IFhNTFZpZXdbXSB7XG5cdFx0cmV0dXJuIFtdO1xuXHRcdC8vIFRvIGJlIG92ZXJyaWRlblxuXHR9XG5cdF9zY3JvbGxUYWJsZXNUb0xhc3ROYXZpZ2F0ZWRJdGVtcygpOiB2b2lkIHtcblx0XHQvLyBUbyBiZSBvdmVycmlkZW5cblx0fVxuXG5cdGdldEFwcENvbnRlbnRDb250YWluZXIodmlldzogVmlldyk6IE5hdkNvbnRhaW5lciB8IEZsZXhpYmxlQ29sdW1uTGF5b3V0IHtcblx0XHRjb25zdCBvQXBwQ29tcG9uZW50ID0gdGhpcy5nZXRBcHBDb21wb25lbnQoKTtcblx0XHRjb25zdCBhcHBDb250ZW50SWQgPSBvQXBwQ29tcG9uZW50LmdldE1hbmlmZXN0RW50cnkoXCIvc2FwLnVpNS9yb3V0aW5nL2NvbmZpZy9jb250cm9sSWRcIikgfHwgXCJhcHBDb250ZW50XCI7XG5cdFx0cmV0dXJuIHZpZXcuYnlJZChhcHBDb250ZW50SWQpIGFzIE5hdkNvbnRhaW5lciB8IEZsZXhpYmxlQ29sdW1uTGF5b3V0O1xuXHR9XG59XG5pbnRlcmZhY2UgUm9vdFZpZXdCYXNlQ29udHJvbGxlciB7XG5cdG9uQ29udGFpbmVyUmVhZHk/KCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJvb3RWaWV3QmFzZUNvbnRyb2xsZXI7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7Ozs7OztFQWtqQk8sZ0JBQWdCQSxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7SUFDckMsSUFBSTtNQUNILElBQUlDLE1BQU0sR0FBR0YsSUFBSSxFQUFqQjtJQUNBLENBRkQsQ0FFRSxPQUFNRyxDQUFOLEVBQVM7TUFDVixPQUFPRixPQUFPLENBQUNFLENBQUQsQ0FBZDtJQUNBOztJQUNELElBQUlELE1BQU0sSUFBSUEsTUFBTSxDQUFDRSxJQUFyQixFQUEyQjtNQUMxQixPQUFPRixNQUFNLENBQUNFLElBQVAsQ0FBWSxLQUFLLENBQWpCLEVBQW9CSCxPQUFwQixDQUFQO0lBQ0E7O0lBQ0QsT0FBT0MsTUFBUDtFQUNBOzs7Ozs7Ozs7Ozs7OztNQXppQktHLHNCLFdBRExDLGNBQWMsQ0FBQyw2Q0FBRCxDLFVBRWJDLGNBQWMsQ0FBQ0MsV0FBRCxDOzs7Ozs7Ozs7Ozs7OztZQU1QQyx5QixHQUE0QixLOzs7Ozs7V0FF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