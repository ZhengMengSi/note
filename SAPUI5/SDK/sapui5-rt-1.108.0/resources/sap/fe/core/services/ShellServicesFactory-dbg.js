/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory"], function (Service, ServiceFactory) {
  "use strict";

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * Mock implementation of the ShellService for OpenFE
   *
   * @implements {IShellServices}
   * @private
   */
  var ShellServiceMock = /*#__PURE__*/function (_Service) {
    _inheritsLoose(ShellServiceMock, _Service);

    function ShellServiceMock() {
      return _Service.apply(this, arguments) || this;
    }

    var _proto = ShellServiceMock.prototype;

    _proto.init = function init() {
      this.initPromise = Promise.resolve(this);
      this.instanceType = "mock";
    };

    _proto.getLinks = function
      /*oArgs: object*/
    getLinks() {
      return Promise.resolve([]);
    };

    _proto.getLinksWithCache = function
      /*oArgs: object*/
    getLinksWithCache() {
      return Promise.resolve([]);
    };

    _proto.toExternal = function
      /*oNavArgumentsArr: Array<object>, oComponent: object*/
    toExternal() {
      /* Do Nothing */
    };

    _proto.getStartupAppState = function
      /*oArgs: object*/
    getStartupAppState() {
      return Promise.resolve(null);
    };

    _proto.backToPreviousApp = function backToPreviousApp() {
      /* Do Nothing */
    };

    _proto.hrefForExternal = function
      /*oArgs?: object, oComponent?: object, bAsync?: boolean*/
    hrefForExternal() {
      return "";
    };

    _proto.hrefForExternalAsync = function
      /*oArgs?: object, oComponent?: object*/
    hrefForExternalAsync() {
      return Promise.resolve({});
    };

    _proto.getAppState = function
      /*oComponent: object, sAppStateKey: string*/
    getAppState() {
      return Promise.resolve({});
    };

    _proto.createEmptyAppState = function
      /*oComponent: object*/
    createEmptyAppState() {
      return Promise.resolve({});
    };

    _proto.createEmptyAppStateAsync = function
      /*oComponent: object*/
    createEmptyAppStateAsync() {
      return Promise.resolve({});
    };

    _proto.isNavigationSupported = function
      /*oNavArgumentsArr: Array<object>, oComponent: object*/
    isNavigationSupported() {
      return Promise.resolve({});
    };

    _proto.isInitialNavigation = function isInitialNavigation() {
      return false;
    };

    _proto.isInitialNavigationAsync = function isInitialNavigationAsync() {
      return Promise.resolve({});
    };

    _proto.expandCompactHash = function
      /*sHashFragment: string*/
    expandCompactHash() {
      return Promise.resolve({});
    };

    _proto.parseShellHash = function
      /*sHash: string*/
    parseShellHash() {
      return {};
    };

    _proto.splitHash = function
      /*sHash: string*/
    splitHash() {
      return Promise.resolve({});
    };

    _proto.constructShellHash = function
      /*oNewShellHash: object*/
    constructShellHash() {
      return "";
    };

    _proto.setDirtyFlag = function
      /*bDirty: boolean*/
    setDirtyFlag() {
      /* Do Nothing */
    };

    _proto.registerDirtyStateProvider = function
      /*fnDirtyStateProvider: Function*/
    registerDirtyStateProvider() {
      /* Do Nothing */
    };

    _proto.deregisterDirtyStateProvider = function
      /*fnDirtyStateProvider: Function*/
    deregisterDirtyStateProvider() {
      /* Do Nothing */
    };

    _proto.createRenderer = function createRenderer() {
      return {};
    };

    _proto.getUser = function getUser() {
      return {};
    };

    _proto.hasUShell = function hasUShell() {
      return false;
    };

    _proto.registerNavigationFilter = function
      /*fnNavFilter: Function*/
    registerNavigationFilter() {
      /* Do Nothing */
    };

    _proto.unregisterNavigationFilter = function
      /*fnNavFilter: Function*/
    unregisterNavigationFilter() {
      /* Do Nothing */
    };

    _proto.setBackNavigation = function
      /*fnCallBack?: Function*/
    setBackNavigation() {
      /* Do Nothing */
    };

    _proto.setHierarchy = function
      /*aHierarchyLevels: Array<object>*/
    setHierarchy() {
      /* Do Nothing */
    };

    _proto.setTitle = function
      /*sTitle: string*/
    setTitle() {
      /* Do Nothing */
    };

    _proto.getContentDensity = function getContentDensity() {
      // in case there is no shell we probably need to look at the classes being defined on the body
      if (document.body.classList.contains("sapUiSizeCozy")) {
        return "cozy";
      } else if (document.body.classList.contains("sapUiSizeCompact")) {
        return "compact";
      } else {
        return "";
      }
    };

    _proto.getPrimaryIntent = function
      /*sSemanticObject: string, mParameters?: object*/
    getPrimaryIntent() {
      return Promise.resolve();
    };

    return ShellServiceMock;
  }(Service);
  /**
   * @typedef ShellServicesSettings
   * @private
   */


  /**
   * Wrap a JQuery Promise within a native {Promise}.
   *
   * @template {object} T
   * @param jqueryPromise The original jquery promise
   * @returns A native promise wrapping the same object
   * @private
   */
  function wrapJQueryPromise(jqueryPromise) {
    return new Promise(function (resolve, reject) {
      // eslint-disable-next-line promise/catch-or-return
      jqueryPromise.done(resolve).fail(reject);
    });
  }
  /**
   * Base implementation of the ShellServices
   *
   * @implements {IShellServices}
   * @private
   */


  var ShellServices = /*#__PURE__*/function (_Service2) {
    _inheritsLoose(ShellServices, _Service2);

    function ShellServices() {
      return _Service2.apply(this, arguments) || this;
    }

    var _proto2 = ShellServices.prototype;

    // !: means that we know it will be assigned before usage
    _proto2.init = function init() {
      var _this = this;

      var oContext = this.getContext();
      var oComponent = oContext.scopeObject;
      this.oShellContainer = oContext.settings.shellContainer;
      this.instanceType = "real";
      this.linksCache = {};

      this.fnFindSemanticObjectsInCache = function (oArgs) {
        var _oArgs = oArgs;
        var aCachedSemanticObjects = [];
        var aNonCachedSemanticObjects = [];

        for (var i = 0; i < _oArgs.length; i++) {
          if (!!_oArgs[i][0] && !!_oArgs[i][0].semanticObject) {
            if (this.linksCache[_oArgs[i][0].semanticObject]) {
              aCachedSemanticObjects.push(this.linksCache[_oArgs[i][0].semanticObject].links);
              Object.defineProperty(oArgs[i][0], "links", {
                value: this.linksCache[_oArgs[i][0].semanticObject].links
              });
            } else {
              aNonCachedSemanticObjects.push(_oArgs[i]);
            }
          }
        }

        return {
          oldArgs: oArgs,
          newArgs: aNonCachedSemanticObjects,
          cachedLinks: aCachedSemanticObjects
        };
      };

      this.initPromise = new Promise(function (resolve, reject) {
        _this.resolveFn = resolve;
        _this.rejectFn = reject;
      });
      var oCrossAppNavServicePromise = this.oShellContainer.getServiceAsync("CrossApplicationNavigation");
      var oUrlParsingServicePromise = this.oShellContainer.getServiceAsync("URLParsing");
      var oShellNavigationServicePromise = this.oShellContainer.getServiceAsync("ShellNavigation");
      var oShellUIServicePromise = oComponent.getService("ShellUIService");
      Promise.all([oCrossAppNavServicePromise, oUrlParsingServicePromise, oShellNavigationServicePromise, oShellUIServicePromise]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 4),
            oCrossAppNavService = _ref2[0],
            oUrlParsingService = _ref2[1],
            oShellNavigation = _ref2[2],
            oShellUIService = _ref2[3];

        _this.crossAppNavService = oCrossAppNavService;
        _this.urlParsingService = oUrlParsingService;
        _this.shellNavigation = oShellNavigation;
        _this.shellUIService = oShellUIService;

        _this.resolveFn();
      }).catch(this.rejectFn);
    }
    /**
     * Retrieves the target links configured for a given semantic object & action
     * Will retrieve the CrossApplicationNavigation
     * service reference call the getLinks method. In case service is not available or any exception
     * method throws exception error in console.
     *
     * @private
     * @ui5-restricted
     * @param oArgs Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>getLinks arguments
     * @returns Promise which will be resolved to target links array
     */
    ;

    _proto2.getLinks = function getLinks(oArgs) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        // eslint-disable-next-line promise/catch-or-return
        _this2.crossAppNavService.getLinks(oArgs).fail(function (oError) {
          reject(new Error("".concat(oError, " sap.fe.core.services.NavigationServiceFactory.getLinks")));
        }).then(resolve);
      });
    }
    /**
     * Retrieves the target links configured for a given semantic object & action in cache
     * Will retrieve the CrossApplicationNavigation
     * service reference call the getLinks method. In case service is not available or any exception
     * method throws exception error in console.
     *
     * @private
     * @ui5-restricted
     * @param oArgs Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>getLinks arguments
     * @returns Promise which will be resolved to target links array
     */
    ;

    _proto2.getLinksWithCache = function getLinksWithCache(oArgs) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        // eslint-disable-next-line promise/catch-or-return
        if (oArgs.length === 0) {
          resolve([]);
        } else {
          var oCacheResults = _this3.fnFindSemanticObjectsInCache(oArgs);

          if (oCacheResults.newArgs.length === 0) {
            resolve(oCacheResults.cachedLinks);
          } else {
            // eslint-disable-next-line promise/catch-or-return
            _this3.crossAppNavService.getLinks(oCacheResults.newArgs).fail(function (oError) {
              reject(new Error("".concat(oError, " sap.fe.core.services.NavigationServiceFactory.getLinksWithCache")));
            }).then(function (aLinks) {
              if (aLinks.length !== 0) {
                var oSemanticObjectsLinks = {};

                for (var i = 0; i < aLinks.length; i++) {
                  if (aLinks[i].length > 0 && oCacheResults.newArgs[i][0].links === undefined) {
                    oSemanticObjectsLinks[oCacheResults.newArgs[i][0].semanticObject] = {
                      links: aLinks[i]
                    };
                    _this3.linksCache = Object.assign(_this3.linksCache, oSemanticObjectsLinks);
                  }
                }
              }

              if (oCacheResults.cachedLinks.length === 0) {
                resolve(aLinks);
              } else {
                var aMergedLinks = [];
                var j = 0;

                for (var k = 0; k < oCacheResults.oldArgs.length; k++) {
                  if (j < aLinks.length) {
                    if (aLinks[j].length > 0 && oCacheResults.oldArgs[k][0].semanticObject === oCacheResults.newArgs[j][0].semanticObject) {
                      aMergedLinks.push(aLinks[j]);
                      j++;
                    } else {
                      aMergedLinks.push(oCacheResults.oldArgs[k][0].links);
                    }
                  } else {
                    aMergedLinks.push(oCacheResults.oldArgs[k][0].links);
                  }
                }

                resolve(aMergedLinks);
              }
            });
          }
        }
      });
    }
    /**
     * Will retrieve the ShellContainer.
     *
     * @private
     * @ui5-restricted
     * sap.ushell.container
     * @returns Object with predefined shellContainer methods
     */
    ;

    _proto2.getShellContainer = function getShellContainer() {
      return this.oShellContainer;
    }
    /**
     * Will call toExternal method of CrossApplicationNavigation service with Navigation Arguments and oComponent.
     *
     * @private
     * @ui5-restricted
     * @param oNavArgumentsArr And
     * @param oComponent Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>toExternal arguments
     */
    ;

    _proto2.toExternal = function toExternal(oNavArgumentsArr, oComponent) {
      this.crossAppNavService.toExternal(oNavArgumentsArr, oComponent);
    }
    /**
     * Retrieves the target startupAppState
     * Will check the existance of the ShellContainer and retrieve the CrossApplicationNavigation
     * service reference call the getStartupAppState method. In case service is not available or any exception
     * method throws exception error in console.
     *
     * @private
     * @ui5-restricted
     * @param oArgs Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>getStartupAppState arguments
     * @returns Promise which will be resolved to Object
     */
    ;

    _proto2.getStartupAppState = function getStartupAppState(oArgs) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        // JQuery Promise behaves differently
        // eslint-disable-next-line promise/catch-or-return
        _this4.crossAppNavService.getStartupAppState(oArgs).fail(function (oError) {
          reject(new Error("".concat(oError, " sap.fe.core.services.NavigationServiceFactory.getStartupAppState")));
        }).then(resolve);
      });
    }
    /**
     * Will call backToPreviousApp method of CrossApplicationNavigation service.
     *
     * @returns Something that indicate we've navigated
     * @private
     * @ui5-restricted
     */
    ;

    _proto2.backToPreviousApp = function backToPreviousApp() {
      return this.crossAppNavService.backToPreviousApp();
    }
    /**
     * Will call hrefForExternal method of CrossApplicationNavigation service.
     *
     * @private
     * @ui5-restricted
     * @param oArgs Check the definition of
     * @param oComponent The appComponent
     * @param bAsync Whether this call should be async or not
     * sap.ushell.services.CrossApplicationNavigation=>hrefForExternal arguments
     * @returns Promise which will be resolved to string
     */
    ;

    _proto2.hrefForExternal = function hrefForExternal(oArgs, oComponent, bAsync) {
      return this.crossAppNavService.hrefForExternal(oArgs, oComponent, !!bAsync);
    }
    /**
     * Will call hrefForExternal method of CrossApplicationNavigation service.
     *
     * @private
     * @ui5-restricted
     * @param oArgs Check the definition of
     * @param oComponent The appComponent
     * sap.ushell.services.CrossApplicationNavigation=>hrefForExternalAsync arguments
     * @returns Promise which will be resolved to string
     */
    ;

    _proto2.hrefForExternalAsync = function hrefForExternalAsync(oArgs, oComponent) {
      return this.crossAppNavService.hrefForExternalAsync(oArgs, oComponent);
    }
    /**
     * Will call getAppState method of CrossApplicationNavigation service with oComponent and oAppStateKey.
     *
     * @private
     * @ui5-restricted
     * @param oComponent
     * @param sAppStateKey Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>getAppState arguments
     * @returns Promise which will be resolved to object
     */
    ;

    _proto2.getAppState = function getAppState(oComponent, sAppStateKey) {
      return wrapJQueryPromise(this.crossAppNavService.getAppState(oComponent, sAppStateKey));
    }
    /**
     * Will call createEmptyAppState method of CrossApplicationNavigation service with oComponent.
     *
     * @private
     * @ui5-restricted
     * @param oComponent Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>createEmptyAppState arguments
     * @returns Promise which will be resolved to object
     */
    ;

    _proto2.createEmptyAppState = function createEmptyAppState(oComponent) {
      return this.crossAppNavService.createEmptyAppState(oComponent);
    }
    /**
     * Will call createEmptyAppStateAsync method of CrossApplicationNavigation service with oComponent.
     *
     * @private
     * @ui5-restricted
     * @param oComponent Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>createEmptyAppStateAsync arguments
     * @returns Promise which will be resolved to object
     */
    ;

    _proto2.createEmptyAppStateAsync = function createEmptyAppStateAsync(oComponent) {
      return this.crossAppNavService.createEmptyAppStateAsync(oComponent);
    }
    /**
     * Will call isNavigationSupported method of CrossApplicationNavigation service with Navigation Arguments and oComponent.
     *
     * @private
     * @ui5-restricted
     * @param oNavArgumentsArr
     * @param oComponent Check the definition of
     * sap.ushell.services.CrossApplicationNavigation=>isNavigationSupported arguments
     * @returns Promise which will be resolved to object
     */
    ;

    _proto2.isNavigationSupported = function isNavigationSupported(oNavArgumentsArr, oComponent) {
      return wrapJQueryPromise(this.crossAppNavService.isNavigationSupported(oNavArgumentsArr, oComponent));
    }
    /**
     * Will call isInitialNavigation method of CrossApplicationNavigation service.
     *
     * @private
     * @ui5-restricted
     * @returns Promise which will be resolved to boolean
     */
    ;

    _proto2.isInitialNavigation = function isInitialNavigation() {
      return this.crossAppNavService.isInitialNavigation();
    }
    /**
     * Will call isInitialNavigationAsync method of CrossApplicationNavigation service.
     *
     * @private
     * @ui5-restricted
     * @returns Promise which will be resolved to boolean
     */
    ;

    _proto2.isInitialNavigationAsync = function isInitialNavigationAsync() {
      return this.crossAppNavService.isInitialNavigationAsync();
    }
    /**
     * Will call expandCompactHash method of CrossApplicationNavigation service.
     *
     * @param sHashFragment An (internal format) shell hash
     * @returns A promise the success handler of the resolve promise get an expanded shell hash as first argument
     * @private
     * @ui5-restricted
     */
    ;

    _proto2.expandCompactHash = function expandCompactHash(sHashFragment) {
      return this.crossAppNavService.expandCompactHash(sHashFragment);
    }
    /**
     * Will call parseShellHash method of URLParsing service with given sHash.
     *
     * @private
     * @ui5-restricted
     * @param sHash Check the definition of
     * sap.ushell.services.URLParsing=>parseShellHash arguments
     * @returns The parsed url
     */
    ;

    _proto2.parseShellHash = function parseShellHash(sHash) {
      return this.urlParsingService.parseShellHash(sHash);
    }
    /**
     * Will call splitHash method of URLParsing service with given sHash.
     *
     * @private
     * @ui5-restricted
     * @param sHash Check the definition of
     * sap.ushell.services.URLParsing=>splitHash arguments
     * @returns Promise which will be resolved to object
     */
    ;

    _proto2.splitHash = function splitHash(sHash) {
      return this.urlParsingService.splitHash(sHash);
    }
    /**
     * Will call constructShellHash method of URLParsing service with given sHash.
     *
     * @private
     * @ui5-restricted
     * @param oNewShellHash Check the definition of
     * sap.ushell.services.URLParsing=>constructShellHash arguments
     * @returns Shell Hash string
     */
    ;

    _proto2.constructShellHash = function constructShellHash(oNewShellHash) {
      return this.urlParsingService.constructShellHash(oNewShellHash);
    }
    /**
     * Will call setDirtyFlag method with given dirty state.
     *
     * @private
     * @ui5-restricted
     * @param bDirty Check the definition of sap.ushell.Container.setDirtyFlag arguments
     */
    ;

    _proto2.setDirtyFlag = function setDirtyFlag(bDirty) {
      this.oShellContainer.setDirtyFlag(bDirty);
    }
    /**
     * Will call registerDirtyStateProvider method with given dirty state provider callback method.
     *
     * @private
     * @ui5-restricted
     * @param fnDirtyStateProvider Check the definition of sap.ushell.Container.registerDirtyStateProvider arguments
     */
    ;

    _proto2.registerDirtyStateProvider = function registerDirtyStateProvider(fnDirtyStateProvider) {
      this.oShellContainer.registerDirtyStateProvider(fnDirtyStateProvider);
    }
    /**
     * Will call deregisterDirtyStateProvider method with given dirty state provider callback method.
     *
     * @private
     * @ui5-restricted
     * @param fnDirtyStateProvider Check the definition of sap.ushell.Container.deregisterDirtyStateProvider arguments
     */
    ;

    _proto2.deregisterDirtyStateProvider = function deregisterDirtyStateProvider(fnDirtyStateProvider) {
      this.oShellContainer.deregisterDirtyStateProvider(fnDirtyStateProvider);
    }
    /**
     * Will call createRenderer method of ushell container.
     *
     * @private
     * @ui5-restricted
     * @returns Returns renderer object
     */
    ;

    _proto2.createRenderer = function createRenderer() {
      return this.oShellContainer.createRenderer();
    }
    /**
     * Will call getUser method of ushell container.
     *
     * @private
     * @ui5-restricted
     * @returns Returns User object
     */
    ;

    _proto2.getUser = function getUser() {
      return this.oShellContainer.getUser();
    }
    /**
     * Will check if ushell container is available or not.
     *
     * @private
     * @ui5-restricted
     * @returns Returns true
     */
    ;

    _proto2.hasUShell = function hasUShell() {
      return true;
    }
    /**
     * Will call registerNavigationFilter method of shellNavigation.
     *
     * @param fnNavFilter The filter function to register
     * @private
     * @ui5-restricted
     */
    ;

    _proto2.registerNavigationFilter = function registerNavigationFilter(fnNavFilter) {
      this.shellNavigation.registerNavigationFilter(fnNavFilter);
    }
    /**
     * Will call unregisterNavigationFilter method of shellNavigation.
     *
     * @param fnNavFilter The filter function to unregister
     * @private
     * @ui5-restricted
     */
    ;

    _proto2.unregisterNavigationFilter = function unregisterNavigationFilter(fnNavFilter) {
      this.shellNavigation.unregisterNavigationFilter(fnNavFilter);
    }
    /**
     * Will call setBackNavigation method of ShellUIService
     * that displays the back button in the shell header.
     *
     * @param [fnCallBack] A callback function called when the button is clicked in the UI.
     * @private
     * @ui5-restricted
     */
    ;

    _proto2.setBackNavigation = function setBackNavigation(fnCallBack) {
      this.shellUIService.setBackNavigation(fnCallBack);
    }
    /**
     * Will call setHierarchy method of ShellUIService
     * that displays the given hierarchy in the shell header.
     *
     * @param [aHierarchyLevels] An array representing hierarchies of the currently displayed app.
     * @private
     * @ui5-restricted
     */
    ;

    _proto2.setHierarchy = function setHierarchy(aHierarchyLevels) {
      this.shellUIService.setHierarchy(aHierarchyLevels);
    }
    /**
     * Will call setTitle method of ShellUIService
     * that displays the given title in the shell header.
     *
     * @param [sTitle] The new title. The default title is set if this argument is not given.
     * @private
     * @ui5-restricted
     */
    ;

    _proto2.setTitle = function setTitle(sTitle) {
      this.shellUIService.setTitle(sTitle);
    }
    /**
     * Retrieves the currently defined content density.
     *
     * @returns The content density value
     */
    ;

    _proto2.getContentDensity = function getContentDensity() {
      return this.oShellContainer.getUser().getContentDensity();
    }
    /**
     * For a given semantic object, this method considers all actions associated with the semantic object and
     * returns the one tagged as a "primaryAction". If no inbound tagged as "primaryAction" exists, then it returns
     * the intent of the first inbound (after sorting has been applied) matching the action "displayFactSheet".
     *
     * @private
     * @ui5-restricted
     * @param sSemanticObject Semantic object.
     * @param mParameters See #CrossApplicationNavigation#getLinks for description.
     * @returns Promise which will be resolved with an object containing the intent if it exists.
     */
    ;

    _proto2.getPrimaryIntent = function getPrimaryIntent(sSemanticObject, mParameters) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        // eslint-disable-next-line promise/catch-or-return
        _this5.crossAppNavService.getPrimaryIntent(sSemanticObject, mParameters).fail(function (oError) {
          reject(new Error("".concat(oError, " sap.fe.core.services.NavigationServiceFactory.getPrimaryIntent")));
        }).then(resolve);
      });
    };

    return ShellServices;
  }(Service);
  /**
   * Service Factory for the ShellServices
   *
   * @private
   */


  var ShellServicesFactory = /*#__PURE__*/function (_ServiceFactory) {
    _inheritsLoose(ShellServicesFactory, _ServiceFactory);

    function ShellServicesFactory() {
      return _ServiceFactory.apply(this, arguments) || this;
    }

    var _proto3 = ShellServicesFactory.prototype;

    /**
     * Creates either a standard or a mock Shell service depending on the configuration.
     *
     * @param oServiceContext The shellservice context
     * @returns A promise for a shell service implementation
     * @see ServiceFactory#createInstance
     */
    _proto3.createInstance = function createInstance(oServiceContext) {
      oServiceContext.settings.shellContainer = sap.ushell && sap.ushell.Container;
      var oShellService = oServiceContext.settings.shellContainer ? new ShellServices(oServiceContext) : new ShellServiceMock(oServiceContext);
      return oShellService.initPromise.then(function () {
        // Enrich the appComponent with this method
        oServiceContext.scopeObject.getShellServices = function () {
          return oShellService;
        };

        return oShellService;
      });
    };

    return ShellServicesFactory;
  }(ServiceFactory);

  return ShellServicesFactory;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTaGVsbFNlcnZpY2VNb2NrIiwiaW5pdCIsImluaXRQcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJpbnN0YW5jZVR5cGUiLCJnZXRMaW5rcyIsImdldExpbmtzV2l0aENhY2hlIiwidG9FeHRlcm5hbCIsImdldFN0YXJ0dXBBcHBTdGF0ZSIsImJhY2tUb1ByZXZpb3VzQXBwIiwiaHJlZkZvckV4dGVybmFsIiwiaHJlZkZvckV4dGVybmFsQXN5bmMiLCJnZXRBcHBTdGF0ZSIsImNyZWF0ZUVtcHR5QXBwU3RhdGUiLCJjcmVhdGVFbXB0eUFwcFN0YXRlQXN5bmMiLCJpc05hdmlnYXRpb25TdXBwb3J0ZWQiLCJpc0luaXRpYWxOYXZpZ2F0aW9uIiwiaXNJbml0aWFsTmF2aWdhdGlvbkFzeW5jIiwiZXhwYW5kQ29tcGFjdEhhc2giLCJwYXJzZVNoZWxsSGFzaCIsInNwbGl0SGFzaCIsImNvbnN0cnVjdFNoZWxsSGFzaCIsInNldERpcnR5RmxhZyIsInJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIiwiZGVyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlciIsImNyZWF0ZVJlbmRlcmVyIiwiZ2V0VXNlciIsImhhc1VTaGVsbCIsInJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlciIsInVucmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyIiwic2V0QmFja05hdmlnYXRpb24iLCJzZXRIaWVyYXJjaHkiLCJzZXRUaXRsZSIsImdldENvbnRlbnREZW5zaXR5IiwiZG9jdW1lbnQiLCJib2R5IiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJnZXRQcmltYXJ5SW50ZW50IiwiU2VydmljZSIsIndyYXBKUXVlcnlQcm9taXNlIiwianF1ZXJ5UHJvbWlzZSIsInJlamVjdCIsImRvbmUiLCJmYWlsIiwiU2hlbGxTZXJ2aWNlcyIsIm9Db250ZXh0IiwiZ2V0Q29udGV4dCIsIm9Db21wb25lbnQiLCJzY29wZU9iamVjdCIsIm9TaGVsbENvbnRhaW5lciIsInNldHRpbmdzIiwic2hlbGxDb250YWluZXIiLCJsaW5rc0NhY2hlIiwiZm5GaW5kU2VtYW50aWNPYmplY3RzSW5DYWNoZSIsIm9BcmdzIiwiX29BcmdzIiwiYUNhY2hlZFNlbWFudGljT2JqZWN0cyIsImFOb25DYWNoZWRTZW1hbnRpY09iamVjdHMiLCJpIiwibGVuZ3RoIiwic2VtYW50aWNPYmplY3QiLCJwdXNoIiwibGlua3MiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInZhbHVlIiwib2xkQXJncyIsIm5ld0FyZ3MiLCJjYWNoZWRMaW5rcyIsInJlc29sdmVGbiIsInJlamVjdEZuIiwib0Nyb3NzQXBwTmF2U2VydmljZVByb21pc2UiLCJnZXRTZXJ2aWNlQXN5bmMiLCJvVXJsUGFyc2luZ1NlcnZpY2VQcm9taXNlIiwib1NoZWxsTmF2aWdhdGlvblNlcnZpY2VQcm9taXNlIiwib1NoZWxsVUlTZXJ2aWNlUHJvbWlzZSIsImdldFNlcnZpY2UiLCJhbGwiLCJ0aGVuIiwib0Nyb3NzQXBwTmF2U2VydmljZSIsIm9VcmxQYXJzaW5nU2VydmljZSIsIm9TaGVsbE5hdmlnYXRpb24iLCJvU2hlbGxVSVNlcnZpY2UiLCJjcm9zc0FwcE5hdlNlcnZpY2UiLCJ1cmxQYXJzaW5nU2VydmljZSIsInNoZWxsTmF2aWdhdGlvbiIsInNoZWxsVUlTZXJ2aWNlIiwiY2F0Y2giLCJvRXJyb3IiLCJFcnJvciIsIm9DYWNoZVJlc3VsdHMiLCJhTGlua3MiLCJvU2VtYW50aWNPYmplY3RzTGlua3MiLCJ1bmRlZmluZWQiLCJhc3NpZ24iLCJhTWVyZ2VkTGlua3MiLCJqIiwiayIsImdldFNoZWxsQ29udGFpbmVyIiwib05hdkFyZ3VtZW50c0FyciIsImJBc3luYyIsInNBcHBTdGF0ZUtleSIsInNIYXNoRnJhZ21lbnQiLCJzSGFzaCIsIm9OZXdTaGVsbEhhc2giLCJiRGlydHkiLCJmbkRpcnR5U3RhdGVQcm92aWRlciIsImZuTmF2RmlsdGVyIiwiZm5DYWxsQmFjayIsImFIaWVyYXJjaHlMZXZlbHMiLCJzVGl0bGUiLCJzU2VtYW50aWNPYmplY3QiLCJtUGFyYW1ldGVycyIsIlNoZWxsU2VydmljZXNGYWN0b3J5IiwiY3JlYXRlSW5zdGFuY2UiLCJvU2VydmljZUNvbnRleHQiLCJzYXAiLCJ1c2hlbGwiLCJDb250YWluZXIiLCJvU2hlbGxTZXJ2aWNlIiwiZ2V0U2hlbGxTZXJ2aWNlcyIsIlNlcnZpY2VGYWN0b3J5Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJTaGVsbFNlcnZpY2VzRmFjdG9yeS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSBDb21wb25lbnQgZnJvbSBcInNhcC91aS9jb3JlL0NvbXBvbmVudFwiO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSBcInNhcC91aS9jb3JlL3NlcnZpY2UvU2VydmljZVwiO1xuaW1wb3J0IFNlcnZpY2VGYWN0b3J5IGZyb20gXCJzYXAvdWkvY29yZS9zZXJ2aWNlL1NlcnZpY2VGYWN0b3J5XCI7XG5pbXBvcnQgdHlwZSBDb250YWluZXIgZnJvbSBcInNhcC91c2hlbGwvc2VydmljZXMvQ29udGFpbmVyXCI7XG5pbXBvcnQgdHlwZSBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBmcm9tIFwic2FwL3VzaGVsbC9zZXJ2aWNlcy9Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvblwiO1xuaW1wb3J0IHR5cGUgU2hlbGxOYXZpZ2F0aW9uIGZyb20gXCJzYXAvdXNoZWxsL3NlcnZpY2VzL1NoZWxsTmF2aWdhdGlvblwiO1xuaW1wb3J0IHR5cGUgVVJMUGFyc2luZyBmcm9tIFwic2FwL3VzaGVsbC9zZXJ2aWNlcy9VUkxQYXJzaW5nXCI7XG5pbXBvcnQgdHlwZSB7IFNlcnZpY2VDb250ZXh0IH0gZnJvbSBcInR5cGVzL2V4dGVuc2lvbl90eXBlc1wiO1xuXG4vKipcbiAqIEBpbnRlcmZhY2UgSVNoZWxsU2VydmljZXNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNoZWxsU2VydmljZXMge1xuXHRpbml0UHJvbWlzZTogUHJvbWlzZTxJU2hlbGxTZXJ2aWNlcz47XG5cdGluc3RhbmNlVHlwZTogc3RyaW5nO1xuXHRjcm9zc0FwcE5hdlNlcnZpY2U/OiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbjtcblx0Z2V0TGlua3Mob0FyZ3M6IG9iamVjdCk6IFByb21pc2U8YW55PjtcblxuXHRnZXRMaW5rc1dpdGhDYWNoZShvQXJnczogb2JqZWN0KTogUHJvbWlzZTxhbnlbXT47XG5cblx0dG9FeHRlcm5hbChvTmF2QXJndW1lbnRzQXJyOiBBcnJheTxvYmplY3Q+LCBvQ29tcG9uZW50OiBvYmplY3QpOiB2b2lkO1xuXG5cdGdldFN0YXJ0dXBBcHBTdGF0ZShvQXJnczogb2JqZWN0KTogUHJvbWlzZTxhbnk+O1xuXG5cdGJhY2tUb1ByZXZpb3VzQXBwKCk6IHZvaWQ7XG5cblx0aHJlZkZvckV4dGVybmFsKG9BcmdzPzogb2JqZWN0LCBvQ29tcG9uZW50Pzogb2JqZWN0LCBiQXN5bmM/OiBib29sZWFuKTogc3RyaW5nIHwgUHJvbWlzZTxzdHJpbmc+O1xuXG5cdGhyZWZGb3JFeHRlcm5hbEFzeW5jKG9BcmdzPzogb2JqZWN0LCBvQ29tcG9uZW50Pzogb2JqZWN0KTogUHJvbWlzZTxhbnk+O1xuXG5cdGdldEFwcFN0YXRlKG9Db21wb25lbnQ6IENvbXBvbmVudCwgc0FwcFN0YXRlS2V5OiBzdHJpbmcpOiBQcm9taXNlPGFueT47XG5cblx0Y3JlYXRlRW1wdHlBcHBTdGF0ZShvQ29tcG9uZW50OiBDb21wb25lbnQpOiBvYmplY3Q7XG5cblx0Y3JlYXRlRW1wdHlBcHBTdGF0ZShvQ29tcG9uZW50OiBDb21wb25lbnQpOiBQcm9taXNlPGFueT47XG5cblx0aXNOYXZpZ2F0aW9uU3VwcG9ydGVkKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ/OiBvYmplY3QpOiBQcm9taXNlPGFueT47XG5cblx0aXNJbml0aWFsTmF2aWdhdGlvbigpOiBib29sZWFuO1xuXG5cdGlzSW5pdGlhbE5hdmlnYXRpb25Bc3luYygpOiBQcm9taXNlPGFueT47XG5cblx0ZXhwYW5kQ29tcGFjdEhhc2goc0hhc2hGcmFnbWVudDogc3RyaW5nKTogYW55O1xuXG5cdHBhcnNlU2hlbGxIYXNoKHNIYXNoOiBzdHJpbmcpOiBhbnk7XG5cblx0c3BsaXRIYXNoKHNIYXNoOiBzdHJpbmcpOiBvYmplY3Q7XG5cblx0Y29uc3RydWN0U2hlbGxIYXNoKG9OZXdTaGVsbEhhc2g6IG9iamVjdCk6IHN0cmluZztcblxuXHRzZXREaXJ0eUZsYWcoYkRpcnR5OiBib29sZWFuKTogdm9pZDtcblxuXHRyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcjogRnVuY3Rpb24pOiB2b2lkO1xuXG5cdGRlcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIoZm5EaXJ0eVN0YXRlUHJvdmlkZXI6IEZ1bmN0aW9uKTogdm9pZDtcblxuXHRjcmVhdGVSZW5kZXJlcigpOiBvYmplY3Q7XG5cblx0Z2V0VXNlcigpOiBhbnk7XG5cblx0aGFzVVNoZWxsKCk6IGJvb2xlYW47XG5cblx0cmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKGZuTmF2RmlsdGVyOiBGdW5jdGlvbik6IHZvaWQ7XG5cblx0dW5yZWdpc3Rlck5hdmlnYXRpb25GaWx0ZXIoZm5OYXZGaWx0ZXI6IEZ1bmN0aW9uKTogdm9pZDtcblxuXHRzZXRCYWNrTmF2aWdhdGlvbihmbkNhbGxCYWNrPzogRnVuY3Rpb24pOiB2b2lkO1xuXG5cdHNldEhpZXJhcmNoeShhSGllcmFyY2h5TGV2ZWxzOiBBcnJheTxvYmplY3Q+KTogdm9pZDtcblxuXHRzZXRUaXRsZShzVGl0bGU6IHN0cmluZyk6IHZvaWQ7XG5cblx0Z2V0Q29udGVudERlbnNpdHkoKTogc3RyaW5nO1xuXG5cdGdldFByaW1hcnlJbnRlbnQoc1NlbWFudGljT2JqZWN0OiBzdHJpbmcsIG1QYXJhbWV0ZXJzPzogb2JqZWN0KTogUHJvbWlzZTxhbnk+O1xufVxuXG4vKipcbiAqIE1vY2sgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNoZWxsU2VydmljZSBmb3IgT3BlbkZFXG4gKlxuICogQGltcGxlbWVudHMge0lTaGVsbFNlcnZpY2VzfVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgU2hlbGxTZXJ2aWNlTW9jayBleHRlbmRzIFNlcnZpY2U8U2hlbGxTZXJ2aWNlc1NldHRpbmdzPiBpbXBsZW1lbnRzIElTaGVsbFNlcnZpY2VzIHtcblx0aW5pdFByb21pc2UhOiBQcm9taXNlPGFueT47XG5cdGluc3RhbmNlVHlwZSE6IHN0cmluZztcblxuXHRpbml0KCkge1xuXHRcdHRoaXMuaW5pdFByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodGhpcyk7XG5cdFx0dGhpcy5pbnN0YW5jZVR5cGUgPSBcIm1vY2tcIjtcblx0fVxuXG5cdGdldExpbmtzKC8qb0FyZ3M6IG9iamVjdCovKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cdH1cblxuXHRnZXRMaW5rc1dpdGhDYWNoZSgvKm9BcmdzOiBvYmplY3QqLykge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuXHR9XG5cblx0dG9FeHRlcm5hbCgvKm9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCovKSB7XG5cdFx0LyogRG8gTm90aGluZyAqL1xuXHR9XG5cblx0Z2V0U3RhcnR1cEFwcFN0YXRlKC8qb0FyZ3M6IG9iamVjdCovKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKTtcblx0fVxuXG5cdGJhY2tUb1ByZXZpb3VzQXBwKCkge1xuXHRcdC8qIERvIE5vdGhpbmcgKi9cblx0fVxuXG5cdGhyZWZGb3JFeHRlcm5hbCgvKm9BcmdzPzogb2JqZWN0LCBvQ29tcG9uZW50Pzogb2JqZWN0LCBiQXN5bmM/OiBib29sZWFuKi8pIHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdGhyZWZGb3JFeHRlcm5hbEFzeW5jKC8qb0FyZ3M/OiBvYmplY3QsIG9Db21wb25lbnQ/OiBvYmplY3QqLykge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuXHR9XG5cblx0Z2V0QXBwU3RhdGUoLypvQ29tcG9uZW50OiBvYmplY3QsIHNBcHBTdGF0ZUtleTogc3RyaW5nKi8pIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGNyZWF0ZUVtcHR5QXBwU3RhdGUoLypvQ29tcG9uZW50OiBvYmplY3QqLykge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuXHR9XG5cblx0Y3JlYXRlRW1wdHlBcHBTdGF0ZUFzeW5jKC8qb0NvbXBvbmVudDogb2JqZWN0Ki8pIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGlzTmF2aWdhdGlvblN1cHBvcnRlZCgvKm9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCovKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG5cdH1cblxuXHRpc0luaXRpYWxOYXZpZ2F0aW9uKCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlzSW5pdGlhbE5hdmlnYXRpb25Bc3luYygpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdGV4cGFuZENvbXBhY3RIYXNoKC8qc0hhc2hGcmFnbWVudDogc3RyaW5nKi8pIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcblx0fVxuXG5cdHBhcnNlU2hlbGxIYXNoKC8qc0hhc2g6IHN0cmluZyovKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0c3BsaXRIYXNoKC8qc0hhc2g6IHN0cmluZyovKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG5cdH1cblxuXHRjb25zdHJ1Y3RTaGVsbEhhc2goLypvTmV3U2hlbGxIYXNoOiBvYmplY3QqLykge1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0c2V0RGlydHlGbGFnKC8qYkRpcnR5OiBib29sZWFuKi8pIHtcblx0XHQvKiBEbyBOb3RoaW5nICovXG5cdH1cblxuXHRyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcigvKmZuRGlydHlTdGF0ZVByb3ZpZGVyOiBGdW5jdGlvbiovKSB7XG5cdFx0LyogRG8gTm90aGluZyAqL1xuXHR9XG5cblx0ZGVyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcigvKmZuRGlydHlTdGF0ZVByb3ZpZGVyOiBGdW5jdGlvbiovKSB7XG5cdFx0LyogRG8gTm90aGluZyAqL1xuXHR9XG5cblx0Y3JlYXRlUmVuZGVyZXIoKSB7XG5cdFx0cmV0dXJuIHt9O1xuXHR9XG5cblx0Z2V0VXNlcigpIHtcblx0XHRyZXR1cm4ge307XG5cdH1cblxuXHRoYXNVU2hlbGwoKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKC8qZm5OYXZGaWx0ZXI6IEZ1bmN0aW9uKi8pOiB2b2lkIHtcblx0XHQvKiBEbyBOb3RoaW5nICovXG5cdH1cblxuXHR1bnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcigvKmZuTmF2RmlsdGVyOiBGdW5jdGlvbiovKTogdm9pZCB7XG5cdFx0LyogRG8gTm90aGluZyAqL1xuXHR9XG5cblx0c2V0QmFja05hdmlnYXRpb24oLypmbkNhbGxCYWNrPzogRnVuY3Rpb24qLyk6IHZvaWQge1xuXHRcdC8qIERvIE5vdGhpbmcgKi9cblx0fVxuXG5cdHNldEhpZXJhcmNoeSgvKmFIaWVyYXJjaHlMZXZlbHM6IEFycmF5PG9iamVjdD4qLyk6IHZvaWQge1xuXHRcdC8qIERvIE5vdGhpbmcgKi9cblx0fVxuXG5cdHNldFRpdGxlKC8qc1RpdGxlOiBzdHJpbmcqLyk6IHZvaWQge1xuXHRcdC8qIERvIE5vdGhpbmcgKi9cblx0fVxuXG5cdGdldENvbnRlbnREZW5zaXR5KCk6IHN0cmluZyB7XG5cdFx0Ly8gaW4gY2FzZSB0aGVyZSBpcyBubyBzaGVsbCB3ZSBwcm9iYWJseSBuZWVkIHRvIGxvb2sgYXQgdGhlIGNsYXNzZXMgYmVpbmcgZGVmaW5lZCBvbiB0aGUgYm9keVxuXHRcdGlmIChkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5jb250YWlucyhcInNhcFVpU2l6ZUNvenlcIikpIHtcblx0XHRcdHJldHVybiBcImNvenlcIjtcblx0XHR9IGVsc2UgaWYgKGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2FwVWlTaXplQ29tcGFjdFwiKSkge1xuXHRcdFx0cmV0dXJuIFwiY29tcGFjdFwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cblxuXHRnZXRQcmltYXJ5SW50ZW50KC8qc1NlbWFudGljT2JqZWN0OiBzdHJpbmcsIG1QYXJhbWV0ZXJzPzogb2JqZWN0Ki8pOiBQcm9taXNlPGFueT4ge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIFNoZWxsU2VydmljZXNTZXR0aW5nc1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IHR5cGUgU2hlbGxTZXJ2aWNlc1NldHRpbmdzID0ge1xuXHRzaGVsbENvbnRhaW5lcj86IENvbnRhaW5lcjtcbn07XG5cbi8qKlxuICogV3JhcCBhIEpRdWVyeSBQcm9taXNlIHdpdGhpbiBhIG5hdGl2ZSB7UHJvbWlzZX0uXG4gKlxuICogQHRlbXBsYXRlIHtvYmplY3R9IFRcbiAqIEBwYXJhbSBqcXVlcnlQcm9taXNlIFRoZSBvcmlnaW5hbCBqcXVlcnkgcHJvbWlzZVxuICogQHJldHVybnMgQSBuYXRpdmUgcHJvbWlzZSB3cmFwcGluZyB0aGUgc2FtZSBvYmplY3RcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIHdyYXBKUXVlcnlQcm9taXNlPFQ+KGpxdWVyeVByb21pc2U6IGpRdWVyeS5Qcm9taXNlKTogUHJvbWlzZTxUPiB7XG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0anF1ZXJ5UHJvbWlzZS5kb25lKHJlc29sdmUgYXMgYW55KS5mYWlsKHJlamVjdCk7XG5cdH0pO1xufVxuXG4vKipcbiAqIEJhc2UgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNoZWxsU2VydmljZXNcbiAqXG4gKiBAaW1wbGVtZW50cyB7SVNoZWxsU2VydmljZXN9XG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBTaGVsbFNlcnZpY2VzIGV4dGVuZHMgU2VydmljZTxSZXF1aXJlZDxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+PiBpbXBsZW1lbnRzIElTaGVsbFNlcnZpY2VzIHtcblx0cmVzb2x2ZUZuOiBhbnk7XG5cdHJlamVjdEZuOiBhbnk7XG5cdGluaXRQcm9taXNlITogUHJvbWlzZTxhbnk+O1xuXHQvLyAhOiBtZWFucyB0aGF0IHdlIGtub3cgaXQgd2lsbCBiZSBhc3NpZ25lZCBiZWZvcmUgdXNhZ2Vcblx0Y3Jvc3NBcHBOYXZTZXJ2aWNlITogQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb247XG5cdHVybFBhcnNpbmdTZXJ2aWNlITogVVJMUGFyc2luZztcblx0c2hlbGxOYXZpZ2F0aW9uITogU2hlbGxOYXZpZ2F0aW9uO1xuXHRvU2hlbGxDb250YWluZXIhOiBDb250YWluZXI7XG5cdHNoZWxsVUlTZXJ2aWNlITogYW55O1xuXHRpbnN0YW5jZVR5cGUhOiBzdHJpbmc7XG5cdGxpbmtzQ2FjaGUhOiBhbnk7XG5cdGZuRmluZFNlbWFudGljT2JqZWN0c0luQ2FjaGU6IGFueTtcblxuXHRpbml0KCkge1xuXHRcdGNvbnN0IG9Db250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KCk7XG5cdFx0Y29uc3Qgb0NvbXBvbmVudCA9IG9Db250ZXh0LnNjb3BlT2JqZWN0IGFzIGFueTtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lciA9IG9Db250ZXh0LnNldHRpbmdzLnNoZWxsQ29udGFpbmVyO1xuXHRcdHRoaXMuaW5zdGFuY2VUeXBlID0gXCJyZWFsXCI7XG5cdFx0dGhpcy5saW5rc0NhY2hlID0ge307XG5cdFx0dGhpcy5mbkZpbmRTZW1hbnRpY09iamVjdHNJbkNhY2hlID0gZnVuY3Rpb24gKG9BcmdzOiBhbnkpOiBvYmplY3Qge1xuXHRcdFx0Y29uc3QgX29BcmdzOiBhbnkgPSBvQXJncztcblx0XHRcdGNvbnN0IGFDYWNoZWRTZW1hbnRpY09iamVjdHMgPSBbXTtcblx0XHRcdGNvbnN0IGFOb25DYWNoZWRTZW1hbnRpY09iamVjdHMgPSBbXTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgX29BcmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmICghIV9vQXJnc1tpXVswXSAmJiAhIV9vQXJnc1tpXVswXS5zZW1hbnRpY09iamVjdCkge1xuXHRcdFx0XHRcdGlmICh0aGlzLmxpbmtzQ2FjaGVbX29BcmdzW2ldWzBdLnNlbWFudGljT2JqZWN0XSkge1xuXHRcdFx0XHRcdFx0YUNhY2hlZFNlbWFudGljT2JqZWN0cy5wdXNoKHRoaXMubGlua3NDYWNoZVtfb0FyZ3NbaV1bMF0uc2VtYW50aWNPYmplY3RdLmxpbmtzKTtcblx0XHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvQXJnc1tpXVswXSwgXCJsaW5rc1wiLCB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlOiB0aGlzLmxpbmtzQ2FjaGVbX29BcmdzW2ldWzBdLnNlbWFudGljT2JqZWN0XS5saW5rc1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGFOb25DYWNoZWRTZW1hbnRpY09iamVjdHMucHVzaChfb0FyZ3NbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHsgb2xkQXJnczogb0FyZ3MsIG5ld0FyZ3M6IGFOb25DYWNoZWRTZW1hbnRpY09iamVjdHMsIGNhY2hlZExpbmtzOiBhQ2FjaGVkU2VtYW50aWNPYmplY3RzIH07XG5cdFx0fTtcblx0XHR0aGlzLmluaXRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5yZXNvbHZlRm4gPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5yZWplY3RGbiA9IHJlamVjdDtcblx0XHR9KTtcblx0XHRjb25zdCBvQ3Jvc3NBcHBOYXZTZXJ2aWNlUHJvbWlzZSA9IHRoaXMub1NoZWxsQ29udGFpbmVyLmdldFNlcnZpY2VBc3luYyhcIkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uXCIpO1xuXHRcdGNvbnN0IG9VcmxQYXJzaW5nU2VydmljZVByb21pc2UgPSB0aGlzLm9TaGVsbENvbnRhaW5lci5nZXRTZXJ2aWNlQXN5bmMoXCJVUkxQYXJzaW5nXCIpO1xuXHRcdGNvbnN0IG9TaGVsbE5hdmlnYXRpb25TZXJ2aWNlUHJvbWlzZSA9IHRoaXMub1NoZWxsQ29udGFpbmVyLmdldFNlcnZpY2VBc3luYyhcIlNoZWxsTmF2aWdhdGlvblwiKTtcblx0XHRjb25zdCBvU2hlbGxVSVNlcnZpY2VQcm9taXNlID0gb0NvbXBvbmVudC5nZXRTZXJ2aWNlKFwiU2hlbGxVSVNlcnZpY2VcIik7XG5cdFx0UHJvbWlzZS5hbGwoW29Dcm9zc0FwcE5hdlNlcnZpY2VQcm9taXNlLCBvVXJsUGFyc2luZ1NlcnZpY2VQcm9taXNlLCBvU2hlbGxOYXZpZ2F0aW9uU2VydmljZVByb21pc2UsIG9TaGVsbFVJU2VydmljZVByb21pc2VdKVxuXHRcdFx0LnRoZW4oKFtvQ3Jvc3NBcHBOYXZTZXJ2aWNlLCBvVXJsUGFyc2luZ1NlcnZpY2UsIG9TaGVsbE5hdmlnYXRpb24sIG9TaGVsbFVJU2VydmljZV0pID0+IHtcblx0XHRcdFx0dGhpcy5jcm9zc0FwcE5hdlNlcnZpY2UgPSBvQ3Jvc3NBcHBOYXZTZXJ2aWNlO1xuXHRcdFx0XHR0aGlzLnVybFBhcnNpbmdTZXJ2aWNlID0gb1VybFBhcnNpbmdTZXJ2aWNlO1xuXHRcdFx0XHR0aGlzLnNoZWxsTmF2aWdhdGlvbiA9IG9TaGVsbE5hdmlnYXRpb247XG5cdFx0XHRcdHRoaXMuc2hlbGxVSVNlcnZpY2UgPSBvU2hlbGxVSVNlcnZpY2U7XG5cdFx0XHRcdHRoaXMucmVzb2x2ZUZuKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKHRoaXMucmVqZWN0Rm4pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgdGFyZ2V0IGxpbmtzIGNvbmZpZ3VyZWQgZm9yIGEgZ2l2ZW4gc2VtYW50aWMgb2JqZWN0ICYgYWN0aW9uXG5cdCAqIFdpbGwgcmV0cmlldmUgdGhlIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uXG5cdCAqIHNlcnZpY2UgcmVmZXJlbmNlIGNhbGwgdGhlIGdldExpbmtzIG1ldGhvZC4gSW4gY2FzZSBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUgb3IgYW55IGV4Y2VwdGlvblxuXHQgKiBtZXRob2QgdGhyb3dzIGV4Y2VwdGlvbiBlcnJvciBpbiBjb25zb2xlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIG9BcmdzIENoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmdldExpbmtzIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gdGFyZ2V0IGxpbmtzIGFycmF5XG5cdCAqL1xuXHRnZXRMaW5rcyhvQXJnczogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL2NhdGNoLW9yLXJldHVyblxuXHRcdFx0dGhpcy5jcm9zc0FwcE5hdlNlcnZpY2Vcblx0XHRcdFx0LmdldExpbmtzKG9BcmdzKVxuXHRcdFx0XHQuZmFpbCgob0Vycm9yOiBhbnkpID0+IHtcblx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKGAke29FcnJvcn0gc2FwLmZlLmNvcmUuc2VydmljZXMuTmF2aWdhdGlvblNlcnZpY2VGYWN0b3J5LmdldExpbmtzYCkpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQudGhlbihyZXNvbHZlKTtcblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHRhcmdldCBsaW5rcyBjb25maWd1cmVkIGZvciBhIGdpdmVuIHNlbWFudGljIG9iamVjdCAmIGFjdGlvbiBpbiBjYWNoZVxuXHQgKiBXaWxsIHJldHJpZXZlIHRoZSBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvblxuXHQgKiBzZXJ2aWNlIHJlZmVyZW5jZSBjYWxsIHRoZSBnZXRMaW5rcyBtZXRob2QuIEluIGNhc2Ugc2VydmljZSBpcyBub3QgYXZhaWxhYmxlIG9yIGFueSBleGNlcHRpb25cblx0ICogbWV0aG9kIHRocm93cyBleGNlcHRpb24gZXJyb3IgaW4gY29uc29sZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBvQXJncyBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5nZXRMaW5rcyBhcmd1bWVudHNcblx0ICogQHJldHVybnMgUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIHRhcmdldCBsaW5rcyBhcnJheVxuXHQgKi9cblx0Z2V0TGlua3NXaXRoQ2FjaGUob0FyZ3M6IG9iamVjdCk6IFByb21pc2U8YW55W10+IHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0XHRpZiAoKG9BcmdzIGFzIE9iamVjdFtdKS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmVzb2x2ZShbXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBvQ2FjaGVSZXN1bHRzID0gdGhpcy5mbkZpbmRTZW1hbnRpY09iamVjdHNJbkNhY2hlKG9BcmdzKTtcblxuXHRcdFx0XHRpZiAob0NhY2hlUmVzdWx0cy5uZXdBcmdzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdHJlc29sdmUob0NhY2hlUmVzdWx0cy5jYWNoZWRMaW5rcyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByb21pc2UvY2F0Y2gtb3ItcmV0dXJuXG5cdFx0XHRcdFx0dGhpcy5jcm9zc0FwcE5hdlNlcnZpY2Vcblx0XHRcdFx0XHRcdC5nZXRMaW5rcyhvQ2FjaGVSZXN1bHRzLm5ld0FyZ3MpXG5cdFx0XHRcdFx0XHQuZmFpbCgob0Vycm9yOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihgJHtvRXJyb3J9IHNhcC5mZS5jb3JlLnNlcnZpY2VzLk5hdmlnYXRpb25TZXJ2aWNlRmFjdG9yeS5nZXRMaW5rc1dpdGhDYWNoZWApKTtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQudGhlbigoYUxpbmtzOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdFx0aWYgKGFMaW5rcy5sZW5ndGggIT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBvU2VtYW50aWNPYmplY3RzTGlua3M6IGFueSA9IHt9O1xuXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhTGlua3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChhTGlua3NbaV0ubGVuZ3RoID4gMCAmJiBvQ2FjaGVSZXN1bHRzLm5ld0FyZ3NbaV1bMF0ubGlua3MgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvU2VtYW50aWNPYmplY3RzTGlua3Nbb0NhY2hlUmVzdWx0cy5uZXdBcmdzW2ldWzBdLnNlbWFudGljT2JqZWN0XSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsaW5rczogYUxpbmtzW2ldXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMubGlua3NDYWNoZSA9IE9iamVjdC5hc3NpZ24odGhpcy5saW5rc0NhY2hlLCBvU2VtYW50aWNPYmplY3RzTGlua3MpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdGlmIChvQ2FjaGVSZXN1bHRzLmNhY2hlZExpbmtzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoYUxpbmtzKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBhTWVyZ2VkTGlua3MgPSBbXTtcblx0XHRcdFx0XHRcdFx0XHRsZXQgaiA9IDA7XG5cblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IG9DYWNoZVJlc3VsdHMub2xkQXJncy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGogPCBhTGlua3MubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhTGlua3Nbal0ubGVuZ3RoID4gMCAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9DYWNoZVJlc3VsdHMub2xkQXJnc1trXVswXS5zZW1hbnRpY09iamVjdCA9PT0gb0NhY2hlUmVzdWx0cy5uZXdBcmdzW2pdWzBdLnNlbWFudGljT2JqZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFNZXJnZWRMaW5rcy5wdXNoKGFMaW5rc1tqXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aisrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFNZXJnZWRMaW5rcy5wdXNoKG9DYWNoZVJlc3VsdHMub2xkQXJnc1trXVswXS5saW5rcyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFNZXJnZWRMaW5rcy5wdXNoKG9DYWNoZVJlc3VsdHMub2xkQXJnc1trXVswXS5saW5rcyk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoYU1lcmdlZExpbmtzKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIHJldHJpZXZlIHRoZSBTaGVsbENvbnRhaW5lci5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIHNhcC51c2hlbGwuY29udGFpbmVyXG5cdCAqIEByZXR1cm5zIE9iamVjdCB3aXRoIHByZWRlZmluZWQgc2hlbGxDb250YWluZXIgbWV0aG9kc1xuXHQgKi9cblx0Z2V0U2hlbGxDb250YWluZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMub1NoZWxsQ29udGFpbmVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCB0b0V4dGVybmFsIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlIHdpdGggTmF2aWdhdGlvbiBBcmd1bWVudHMgYW5kIG9Db21wb25lbnQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gb05hdkFyZ3VtZW50c0FyciBBbmRcblx0ICogQHBhcmFtIG9Db21wb25lbnQgQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+dG9FeHRlcm5hbCBhcmd1bWVudHNcblx0ICovXG5cdHRvRXh0ZXJuYWwob05hdkFyZ3VtZW50c0FycjogQXJyYXk8b2JqZWN0Piwgb0NvbXBvbmVudDogb2JqZWN0KTogdm9pZCB7XG5cdFx0dGhpcy5jcm9zc0FwcE5hdlNlcnZpY2UudG9FeHRlcm5hbChvTmF2QXJndW1lbnRzQXJyLCBvQ29tcG9uZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHRhcmdldCBzdGFydHVwQXBwU3RhdGVcblx0ICogV2lsbCBjaGVjayB0aGUgZXhpc3RhbmNlIG9mIHRoZSBTaGVsbENvbnRhaW5lciBhbmQgcmV0cmlldmUgdGhlIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uXG5cdCAqIHNlcnZpY2UgcmVmZXJlbmNlIGNhbGwgdGhlIGdldFN0YXJ0dXBBcHBTdGF0ZSBtZXRob2QuIEluIGNhc2Ugc2VydmljZSBpcyBub3QgYXZhaWxhYmxlIG9yIGFueSBleGNlcHRpb25cblx0ICogbWV0aG9kIHRocm93cyBleGNlcHRpb24gZXJyb3IgaW4gY29uc29sZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBvQXJncyBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5nZXRTdGFydHVwQXBwU3RhdGUgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBPYmplY3Rcblx0ICovXG5cdGdldFN0YXJ0dXBBcHBTdGF0ZShvQXJnczogQ29tcG9uZW50KSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdC8vIEpRdWVyeSBQcm9taXNlIGJlaGF2ZXMgZGlmZmVyZW50bHlcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcm9taXNlL2NhdGNoLW9yLXJldHVyblxuXHRcdFx0KHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlIGFzIGFueSlcblx0XHRcdFx0LmdldFN0YXJ0dXBBcHBTdGF0ZShvQXJncylcblx0XHRcdFx0LmZhaWwoKG9FcnJvcjogYW55KSA9PiB7XG5cdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihgJHtvRXJyb3J9IHNhcC5mZS5jb3JlLnNlcnZpY2VzLk5hdmlnYXRpb25TZXJ2aWNlRmFjdG9yeS5nZXRTdGFydHVwQXBwU3RhdGVgKSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC50aGVuKHJlc29sdmUpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBiYWNrVG9QcmV2aW91c0FwcCBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZS5cblx0ICpcblx0ICogQHJldHVybnMgU29tZXRoaW5nIHRoYXQgaW5kaWNhdGUgd2UndmUgbmF2aWdhdGVkXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0YmFja1RvUHJldmlvdXNBcHAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLmJhY2tUb1ByZXZpb3VzQXBwKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGhyZWZGb3JFeHRlcm5hbCBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBvQXJncyBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBAcGFyYW0gb0NvbXBvbmVudCBUaGUgYXBwQ29tcG9uZW50XG5cdCAqIEBwYXJhbSBiQXN5bmMgV2hldGhlciB0aGlzIGNhbGwgc2hvdWxkIGJlIGFzeW5jIG9yIG5vdFxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5ocmVmRm9yRXh0ZXJuYWwgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBzdHJpbmdcblx0ICovXG5cdGhyZWZGb3JFeHRlcm5hbChvQXJnczogb2JqZWN0LCBvQ29tcG9uZW50Pzogb2JqZWN0LCBiQXN5bmM/OiBib29sZWFuKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLmhyZWZGb3JFeHRlcm5hbChvQXJncywgb0NvbXBvbmVudCBhcyBvYmplY3QsICEhYkFzeW5jKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgaHJlZkZvckV4dGVybmFsIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIG9BcmdzIENoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIEBwYXJhbSBvQ29tcG9uZW50IFRoZSBhcHBDb21wb25lbnRcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5Dcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbj0+aHJlZkZvckV4dGVybmFsQXN5bmMgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBzdHJpbmdcblx0ICovXG5cdGhyZWZGb3JFeHRlcm5hbEFzeW5jKG9BcmdzOiBvYmplY3QsIG9Db21wb25lbnQ/OiBvYmplY3QpIHtcblx0XHRyZXR1cm4gdGhpcy5jcm9zc0FwcE5hdlNlcnZpY2UuaHJlZkZvckV4dGVybmFsQXN5bmMob0FyZ3MsIG9Db21wb25lbnQgYXMgb2JqZWN0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgZ2V0QXBwU3RhdGUgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2Ugd2l0aCBvQ29tcG9uZW50IGFuZCBvQXBwU3RhdGVLZXkuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gb0NvbXBvbmVudFxuXHQgKiBAcGFyYW0gc0FwcFN0YXRlS2V5IENoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmdldEFwcFN0YXRlIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyBQcm9taXNlIHdoaWNoIHdpbGwgYmUgcmVzb2x2ZWQgdG8gb2JqZWN0XG5cdCAqL1xuXHRnZXRBcHBTdGF0ZShvQ29tcG9uZW50OiBDb21wb25lbnQsIHNBcHBTdGF0ZUtleTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHdyYXBKUXVlcnlQcm9taXNlKCh0aGlzLmNyb3NzQXBwTmF2U2VydmljZSBhcyBhbnkpLmdldEFwcFN0YXRlKG9Db21wb25lbnQsIHNBcHBTdGF0ZUtleSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBjcmVhdGVFbXB0eUFwcFN0YXRlIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlIHdpdGggb0NvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBvQ29tcG9uZW50IENoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmNyZWF0ZUVtcHR5QXBwU3RhdGUgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBvYmplY3Rcblx0ICovXG5cdGNyZWF0ZUVtcHR5QXBwU3RhdGUob0NvbXBvbmVudDogQ29tcG9uZW50KSB7XG5cdFx0cmV0dXJuICh0aGlzLmNyb3NzQXBwTmF2U2VydmljZSBhcyBhbnkpLmNyZWF0ZUVtcHR5QXBwU3RhdGUob0NvbXBvbmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGNyZWF0ZUVtcHR5QXBwU3RhdGVBc3luYyBtZXRob2Qgb2YgQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb24gc2VydmljZSB3aXRoIG9Db21wb25lbnQuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gb0NvbXBvbmVudCBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLkNyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uPT5jcmVhdGVFbXB0eUFwcFN0YXRlQXN5bmMgYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB0byBvYmplY3Rcblx0ICovXG5cdGNyZWF0ZUVtcHR5QXBwU3RhdGVBc3luYyhvQ29tcG9uZW50OiBDb21wb25lbnQpIHtcblx0XHRyZXR1cm4gKHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlIGFzIGFueSkuY3JlYXRlRW1wdHlBcHBTdGF0ZUFzeW5jKG9Db21wb25lbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBpc05hdmlnYXRpb25TdXBwb3J0ZWQgbWV0aG9kIG9mIENyb3NzQXBwbGljYXRpb25OYXZpZ2F0aW9uIHNlcnZpY2Ugd2l0aCBOYXZpZ2F0aW9uIEFyZ3VtZW50cyBhbmQgb0NvbXBvbmVudC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBvTmF2QXJndW1lbnRzQXJyXG5cdCAqIEBwYXJhbSBvQ29tcG9uZW50IENoZWNrIHRoZSBkZWZpbml0aW9uIG9mXG5cdCAqIHNhcC51c2hlbGwuc2VydmljZXMuQ3Jvc3NBcHBsaWNhdGlvbk5hdmlnYXRpb249PmlzTmF2aWdhdGlvblN1cHBvcnRlZCBhcmd1bWVudHNcblx0ICogQHJldHVybnMgUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIG9iamVjdFxuXHQgKi9cblx0aXNOYXZpZ2F0aW9uU3VwcG9ydGVkKG9OYXZBcmd1bWVudHNBcnI6IEFycmF5PG9iamVjdD4sIG9Db21wb25lbnQ6IG9iamVjdCkge1xuXHRcdHJldHVybiB3cmFwSlF1ZXJ5UHJvbWlzZSh0aGlzLmNyb3NzQXBwTmF2U2VydmljZS5pc05hdmlnYXRpb25TdXBwb3J0ZWQob05hdkFyZ3VtZW50c0Fyciwgb0NvbXBvbmVudCkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBpc0luaXRpYWxOYXZpZ2F0aW9uIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHJldHVybnMgUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIGJvb2xlYW5cblx0ICovXG5cdGlzSW5pdGlhbE5hdmlnYXRpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlLmlzSW5pdGlhbE5hdmlnYXRpb24oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgaXNJbml0aWFsTmF2aWdhdGlvbkFzeW5jIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHJldHVybnMgUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIGJvb2xlYW5cblx0ICovXG5cdGlzSW5pdGlhbE5hdmlnYXRpb25Bc3luYygpIHtcblx0XHRyZXR1cm4gdGhpcy5jcm9zc0FwcE5hdlNlcnZpY2UuaXNJbml0aWFsTmF2aWdhdGlvbkFzeW5jKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGV4cGFuZENvbXBhY3RIYXNoIG1ldGhvZCBvZiBDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBAcGFyYW0gc0hhc2hGcmFnbWVudCBBbiAoaW50ZXJuYWwgZm9ybWF0KSBzaGVsbCBoYXNoXG5cdCAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGUgc3VjY2VzcyBoYW5kbGVyIG9mIHRoZSByZXNvbHZlIHByb21pc2UgZ2V0IGFuIGV4cGFuZGVkIHNoZWxsIGhhc2ggYXMgZmlyc3QgYXJndW1lbnRcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRleHBhbmRDb21wYWN0SGFzaChzSGFzaEZyYWdtZW50OiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gdGhpcy5jcm9zc0FwcE5hdlNlcnZpY2UuZXhwYW5kQ29tcGFjdEhhc2goc0hhc2hGcmFnbWVudCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHBhcnNlU2hlbGxIYXNoIG1ldGhvZCBvZiBVUkxQYXJzaW5nIHNlcnZpY2Ugd2l0aCBnaXZlbiBzSGFzaC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBzSGFzaCBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLlVSTFBhcnNpbmc9PnBhcnNlU2hlbGxIYXNoIGFyZ3VtZW50c1xuXHQgKiBAcmV0dXJucyBUaGUgcGFyc2VkIHVybFxuXHQgKi9cblx0cGFyc2VTaGVsbEhhc2goc0hhc2g6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLnVybFBhcnNpbmdTZXJ2aWNlLnBhcnNlU2hlbGxIYXNoKHNIYXNoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgc3BsaXRIYXNoIG1ldGhvZCBvZiBVUkxQYXJzaW5nIHNlcnZpY2Ugd2l0aCBnaXZlbiBzSGFzaC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBzSGFzaCBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZlxuXHQgKiBzYXAudXNoZWxsLnNlcnZpY2VzLlVSTFBhcnNpbmc9PnNwbGl0SGFzaCBhcmd1bWVudHNcblx0ICogQHJldHVybnMgUHJvbWlzZSB3aGljaCB3aWxsIGJlIHJlc29sdmVkIHRvIG9iamVjdFxuXHQgKi9cblx0c3BsaXRIYXNoKHNIYXNoOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gdGhpcy51cmxQYXJzaW5nU2VydmljZS5zcGxpdEhhc2goc0hhc2gpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBjb25zdHJ1Y3RTaGVsbEhhc2ggbWV0aG9kIG9mIFVSTFBhcnNpbmcgc2VydmljZSB3aXRoIGdpdmVuIHNIYXNoLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIG9OZXdTaGVsbEhhc2ggQ2hlY2sgdGhlIGRlZmluaXRpb24gb2Zcblx0ICogc2FwLnVzaGVsbC5zZXJ2aWNlcy5VUkxQYXJzaW5nPT5jb25zdHJ1Y3RTaGVsbEhhc2ggYXJndW1lbnRzXG5cdCAqIEByZXR1cm5zIFNoZWxsIEhhc2ggc3RyaW5nXG5cdCAqL1xuXHRjb25zdHJ1Y3RTaGVsbEhhc2gob05ld1NoZWxsSGFzaDogb2JqZWN0KSB7XG5cdFx0cmV0dXJuIHRoaXMudXJsUGFyc2luZ1NlcnZpY2UuY29uc3RydWN0U2hlbGxIYXNoKG9OZXdTaGVsbEhhc2gpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBzZXREaXJ0eUZsYWcgbWV0aG9kIHdpdGggZ2l2ZW4gZGlydHkgc3RhdGUuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcGFyYW0gYkRpcnR5IENoZWNrIHRoZSBkZWZpbml0aW9uIG9mIHNhcC51c2hlbGwuQ29udGFpbmVyLnNldERpcnR5RmxhZyBhcmd1bWVudHNcblx0ICovXG5cdHNldERpcnR5RmxhZyhiRGlydHk6IGJvb2xlYW4pIHtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lci5zZXREaXJ0eUZsYWcoYkRpcnR5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgcmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIgbWV0aG9kIHdpdGggZ2l2ZW4gZGlydHkgc3RhdGUgcHJvdmlkZXIgY2FsbGJhY2sgbWV0aG9kLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAdWk1LXJlc3RyaWN0ZWRcblx0ICogQHBhcmFtIGZuRGlydHlTdGF0ZVByb3ZpZGVyIENoZWNrIHRoZSBkZWZpbml0aW9uIG9mIHNhcC51c2hlbGwuQ29udGFpbmVyLnJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIGFyZ3VtZW50c1xuXHQgKi9cblx0cmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIoZm5EaXJ0eVN0YXRlUHJvdmlkZXI6IEZ1bmN0aW9uKSB7XG5cdFx0dGhpcy5vU2hlbGxDb250YWluZXIucmVnaXN0ZXJEaXJ0eVN0YXRlUHJvdmlkZXIoZm5EaXJ0eVN0YXRlUHJvdmlkZXIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBkZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIG1ldGhvZCB3aXRoIGdpdmVuIGRpcnR5IHN0YXRlIHByb3ZpZGVyIGNhbGxiYWNrIG1ldGhvZC5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBmbkRpcnR5U3RhdGVQcm92aWRlciBDaGVjayB0aGUgZGVmaW5pdGlvbiBvZiBzYXAudXNoZWxsLkNvbnRhaW5lci5kZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyIGFyZ3VtZW50c1xuXHQgKi9cblx0ZGVyZWdpc3RlckRpcnR5U3RhdGVQcm92aWRlcihmbkRpcnR5U3RhdGVQcm92aWRlcjogRnVuY3Rpb24pIHtcblx0XHR0aGlzLm9TaGVsbENvbnRhaW5lci5kZXJlZ2lzdGVyRGlydHlTdGF0ZVByb3ZpZGVyKGZuRGlydHlTdGF0ZVByb3ZpZGVyKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgY3JlYXRlUmVuZGVyZXIgbWV0aG9kIG9mIHVzaGVsbCBjb250YWluZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcmV0dXJucyBSZXR1cm5zIHJlbmRlcmVyIG9iamVjdFxuXHQgKi9cblx0Y3JlYXRlUmVuZGVyZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMub1NoZWxsQ29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIGdldFVzZXIgbWV0aG9kIG9mIHVzaGVsbCBjb250YWluZXIuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcmV0dXJucyBSZXR1cm5zIFVzZXIgb2JqZWN0XG5cdCAqL1xuXHRnZXRVc2VyKCkge1xuXHRcdHJldHVybiAodGhpcy5vU2hlbGxDb250YWluZXIgYXMgYW55KS5nZXRVc2VyKCk7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjaGVjayBpZiB1c2hlbGwgY29udGFpbmVyIGlzIGF2YWlsYWJsZSBvciBub3QuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKiBAcmV0dXJucyBSZXR1cm5zIHRydWVcblx0ICovXG5cdGhhc1VTaGVsbCgpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgcmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyIG1ldGhvZCBvZiBzaGVsbE5hdmlnYXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSBmbk5hdkZpbHRlciBUaGUgZmlsdGVyIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0cmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyKGZuTmF2RmlsdGVyOiBGdW5jdGlvbikge1xuXHRcdCh0aGlzLnNoZWxsTmF2aWdhdGlvbiBhcyBhbnkpLnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcik7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHVucmVnaXN0ZXJOYXZpZ2F0aW9uRmlsdGVyIG1ldGhvZCBvZiBzaGVsbE5hdmlnYXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSBmbk5hdkZpbHRlciBUaGUgZmlsdGVyIGZ1bmN0aW9uIHRvIHVucmVnaXN0ZXJcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHR1bnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcjogRnVuY3Rpb24pIHtcblx0XHQodGhpcy5zaGVsbE5hdmlnYXRpb24gYXMgYW55KS51bnJlZ2lzdGVyTmF2aWdhdGlvbkZpbHRlcihmbk5hdkZpbHRlcik7XG5cdH1cblxuXHQvKipcblx0ICogV2lsbCBjYWxsIHNldEJhY2tOYXZpZ2F0aW9uIG1ldGhvZCBvZiBTaGVsbFVJU2VydmljZVxuXHQgKiB0aGF0IGRpc3BsYXlzIHRoZSBiYWNrIGJ1dHRvbiBpbiB0aGUgc2hlbGwgaGVhZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gW2ZuQ2FsbEJhY2tdIEEgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkIGluIHRoZSBVSS5cblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqL1xuXHRzZXRCYWNrTmF2aWdhdGlvbihmbkNhbGxCYWNrPzogRnVuY3Rpb24pOiB2b2lkIHtcblx0XHR0aGlzLnNoZWxsVUlTZXJ2aWNlLnNldEJhY2tOYXZpZ2F0aW9uKGZuQ2FsbEJhY2spO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgY2FsbCBzZXRIaWVyYXJjaHkgbWV0aG9kIG9mIFNoZWxsVUlTZXJ2aWNlXG5cdCAqIHRoYXQgZGlzcGxheXMgdGhlIGdpdmVuIGhpZXJhcmNoeSBpbiB0aGUgc2hlbGwgaGVhZGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gW2FIaWVyYXJjaHlMZXZlbHNdIEFuIGFycmF5IHJlcHJlc2VudGluZyBoaWVyYXJjaGllcyBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBhcHAuXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0c2V0SGllcmFyY2h5KGFIaWVyYXJjaHlMZXZlbHM6IEFycmF5PG9iamVjdD4pOiB2b2lkIHtcblx0XHR0aGlzLnNoZWxsVUlTZXJ2aWNlLnNldEhpZXJhcmNoeShhSGllcmFyY2h5TGV2ZWxzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBXaWxsIGNhbGwgc2V0VGl0bGUgbWV0aG9kIG9mIFNoZWxsVUlTZXJ2aWNlXG5cdCAqIHRoYXQgZGlzcGxheXMgdGhlIGdpdmVuIHRpdGxlIGluIHRoZSBzaGVsbCBoZWFkZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBbc1RpdGxlXSBUaGUgbmV3IHRpdGxlLiBUaGUgZGVmYXVsdCB0aXRsZSBpcyBzZXQgaWYgdGhpcyBhcmd1bWVudCBpcyBub3QgZ2l2ZW4uXG5cdCAqIEBwcml2YXRlXG5cdCAqIEB1aTUtcmVzdHJpY3RlZFxuXHQgKi9cblx0c2V0VGl0bGUoc1RpdGxlOiBzdHJpbmcpOiB2b2lkIHtcblx0XHR0aGlzLnNoZWxsVUlTZXJ2aWNlLnNldFRpdGxlKHNUaXRsZSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBjdXJyZW50bHkgZGVmaW5lZCBjb250ZW50IGRlbnNpdHkuXG5cdCAqXG5cdCAqIEByZXR1cm5zIFRoZSBjb250ZW50IGRlbnNpdHkgdmFsdWVcblx0ICovXG5cdGdldENvbnRlbnREZW5zaXR5KCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuICh0aGlzLm9TaGVsbENvbnRhaW5lciBhcyBhbnkpLmdldFVzZXIoKS5nZXRDb250ZW50RGVuc2l0eSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvciBhIGdpdmVuIHNlbWFudGljIG9iamVjdCwgdGhpcyBtZXRob2QgY29uc2lkZXJzIGFsbCBhY3Rpb25zIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2VtYW50aWMgb2JqZWN0IGFuZFxuXHQgKiByZXR1cm5zIHRoZSBvbmUgdGFnZ2VkIGFzIGEgXCJwcmltYXJ5QWN0aW9uXCIuIElmIG5vIGluYm91bmQgdGFnZ2VkIGFzIFwicHJpbWFyeUFjdGlvblwiIGV4aXN0cywgdGhlbiBpdCByZXR1cm5zXG5cdCAqIHRoZSBpbnRlbnQgb2YgdGhlIGZpcnN0IGluYm91bmQgKGFmdGVyIHNvcnRpbmcgaGFzIGJlZW4gYXBwbGllZCkgbWF0Y2hpbmcgdGhlIGFjdGlvbiBcImRpc3BsYXlGYWN0U2hlZXRcIi5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICogQHVpNS1yZXN0cmljdGVkXG5cdCAqIEBwYXJhbSBzU2VtYW50aWNPYmplY3QgU2VtYW50aWMgb2JqZWN0LlxuXHQgKiBAcGFyYW0gbVBhcmFtZXRlcnMgU2VlICNDcm9zc0FwcGxpY2F0aW9uTmF2aWdhdGlvbiNnZXRMaW5rcyBmb3IgZGVzY3JpcHRpb24uXG5cdCAqIEByZXR1cm5zIFByb21pc2Ugd2hpY2ggd2lsbCBiZSByZXNvbHZlZCB3aXRoIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBpbnRlbnQgaWYgaXQgZXhpc3RzLlxuXHQgKi9cblx0Z2V0UHJpbWFyeUludGVudChzU2VtYW50aWNPYmplY3Q6IHN0cmluZywgbVBhcmFtZXRlcnM/OiBvYmplY3QpOiBQcm9taXNlPGFueT4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJvbWlzZS9jYXRjaC1vci1yZXR1cm5cblx0XHRcdHRoaXMuY3Jvc3NBcHBOYXZTZXJ2aWNlXG5cdFx0XHRcdC5nZXRQcmltYXJ5SW50ZW50KHNTZW1hbnRpY09iamVjdCwgbVBhcmFtZXRlcnMpXG5cdFx0XHRcdC5mYWlsKChvRXJyb3I6IGFueSkgPT4ge1xuXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoYCR7b0Vycm9yfSBzYXAuZmUuY29yZS5zZXJ2aWNlcy5OYXZpZ2F0aW9uU2VydmljZUZhY3RvcnkuZ2V0UHJpbWFyeUludGVudGApKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRoZW4ocmVzb2x2ZSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuLyoqXG4gKiBTZXJ2aWNlIEZhY3RvcnkgZm9yIHRoZSBTaGVsbFNlcnZpY2VzXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgU2hlbGxTZXJ2aWNlc0ZhY3RvcnkgZXh0ZW5kcyBTZXJ2aWNlRmFjdG9yeTxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+IHtcblx0LyoqXG5cdCAqIENyZWF0ZXMgZWl0aGVyIGEgc3RhbmRhcmQgb3IgYSBtb2NrIFNoZWxsIHNlcnZpY2UgZGVwZW5kaW5nIG9uIHRoZSBjb25maWd1cmF0aW9uLlxuXHQgKlxuXHQgKiBAcGFyYW0gb1NlcnZpY2VDb250ZXh0IFRoZSBzaGVsbHNlcnZpY2UgY29udGV4dFxuXHQgKiBAcmV0dXJucyBBIHByb21pc2UgZm9yIGEgc2hlbGwgc2VydmljZSBpbXBsZW1lbnRhdGlvblxuXHQgKiBAc2VlIFNlcnZpY2VGYWN0b3J5I2NyZWF0ZUluc3RhbmNlXG5cdCAqL1xuXHRjcmVhdGVJbnN0YW5jZShvU2VydmljZUNvbnRleHQ6IFNlcnZpY2VDb250ZXh0PFNoZWxsU2VydmljZXNTZXR0aW5ncz4pOiBQcm9taXNlPElTaGVsbFNlcnZpY2VzPiB7XG5cdFx0b1NlcnZpY2VDb250ZXh0LnNldHRpbmdzLnNoZWxsQ29udGFpbmVyID0gc2FwLnVzaGVsbCAmJiAoc2FwLnVzaGVsbC5Db250YWluZXIgYXMgQ29udGFpbmVyKTtcblx0XHRjb25zdCBvU2hlbGxTZXJ2aWNlID0gb1NlcnZpY2VDb250ZXh0LnNldHRpbmdzLnNoZWxsQ29udGFpbmVyXG5cdFx0XHQ/IG5ldyBTaGVsbFNlcnZpY2VzKG9TZXJ2aWNlQ29udGV4dCBhcyBTZXJ2aWNlQ29udGV4dDxSZXF1aXJlZDxTaGVsbFNlcnZpY2VzU2V0dGluZ3M+Pilcblx0XHRcdDogbmV3IFNoZWxsU2VydmljZU1vY2sob1NlcnZpY2VDb250ZXh0KTtcblx0XHRyZXR1cm4gb1NoZWxsU2VydmljZS5pbml0UHJvbWlzZS50aGVuKCgpID0+IHtcblx0XHRcdC8vIEVucmljaCB0aGUgYXBwQ29tcG9uZW50IHdpdGggdGhpcyBtZXRob2Rcblx0XHRcdChvU2VydmljZUNvbnRleHQuc2NvcGVPYmplY3QgYXMgYW55KS5nZXRTaGVsbFNlcnZpY2VzID0gKCkgPT4gb1NoZWxsU2VydmljZTtcblx0XHRcdHJldHVybiBvU2hlbGxTZXJ2aWNlO1xuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoZWxsU2VydmljZXNGYWN0b3J5O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQThFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDTUEsZ0I7Ozs7Ozs7OztXQUlMQyxJLEdBQUEsZ0JBQU87TUFDTixLQUFLQyxXQUFMLEdBQW1CQyxPQUFPLENBQUNDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBbkI7TUFDQSxLQUFLQyxZQUFMLEdBQW9CLE1BQXBCO0lBQ0EsQzs7V0FFREMsUSxHQUFBO01BQVM7SUFBVCxXQUE0QjtNQUMzQixPQUFPSCxPQUFPLENBQUNDLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FBUDtJQUNBLEM7O1dBRURHLGlCLEdBQUE7TUFBa0I7SUFBbEIsb0JBQXFDO01BQ3BDLE9BQU9KLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQixFQUFoQixDQUFQO0lBQ0EsQzs7V0FFREksVSxHQUFBO01BQVc7SUFBWCxhQUFvRTtNQUNuRTtJQUNBLEM7O1dBRURDLGtCLEdBQUE7TUFBbUI7SUFBbkIscUJBQXNDO01BQ3JDLE9BQU9OLE9BQU8sQ0FBQ0MsT0FBUixDQUFnQixJQUFoQixDQUFQO0lBQ0EsQzs7V0FFRE0saUIsR0FBQSw2QkFBb0I7TUFDbkI7SUFDQSxDOztXQUVEQyxlLEdBQUE7TUFBZ0I7SUFBaEIsa0JBQTJFO01BQzFFLE9BQU8sRUFBUDtJQUNBLEM7O1dBRURDLG9CLEdBQUE7TUFBcUI7SUFBckIsdUJBQThEO01BQzdELE9BQU9ULE9BQU8sQ0FBQ0MsT0FBUixDQUFnQixFQUFoQixDQUFQO0lBQ0EsQzs7V0FFRFMsVyxHQUFBO01BQVk7SUFBWixjQUEwRDtNQUN6RCxPQUFPVixPQUFPLENBQUNDLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FBUDtJQUNBLEM7O1dBRURVLG1CLEdBQUE7TUFBb0I7SUFBcEIsc0JBQTRDO01BQzNDLE9BQU9YLE9BQU8sQ0FBQ0Ms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