/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/base/util/deepClone", "sap/base/util/uid", "sap/fe/core/buildingBlocks/AttributeModel", "sap/fe/core/helpers/BindingToolkit", "sap/fe/macros/ResourceModel", "sap/ui/base/BindingParser", "sap/ui/core/util/XMLPreprocessor", "./TraceInfo"], function (Log, deepClone, uid, AttributeModel, BindingToolkit, ResourceModel, BindingParser, XMLPreprocessor, TraceInfo) {
  "use strict";

  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var iterator = target[_iteratorSymbol](),
          step,
          pact,
          reject;

      function _cycle(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);

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

      if (iterator.return) {
        var _fixup = function (value) {
          try {
            if (!step.done) {
              iterator.return();
            }
          } catch (e) {}

          return value;
        };

        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }

        _fixup();
      }

      return pact;
    } // No support for Symbol.iterator


    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    } // Handle live collections properly


    var values = [];

    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }

    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
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

  var _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";

  var _templateObject, _templateObject2, _templateObject3, _templateObject4;

  var _exports = {};
  var compileExpression = BindingToolkit.compileExpression;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
          var value = _this.v;

          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }

  function _for(test, update, body) {
    var stage;

    for (;;) {
      var shouldContinue = test();

      if (_isSettledPact(shouldContinue)) {
        shouldContinue = shouldContinue.v;
      }

      if (!shouldContinue) {
        return result;
      }

      if (shouldContinue.then) {
        stage = 0;
        break;
      }

      var result = body();

      if (result && result.then) {
        if (_isSettledPact(result)) {
          result = result.s;
        } else {
          stage = 1;
          break;
        }
      }

      if (update) {
        var updateValue = update();

        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          stage = 2;
          break;
        }
      }
    }

    var pact = new _Pact();

    var reject = _settle.bind(null, pact, 2);

    (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
    return pact;

    function _resumeAfterBody(value) {
      result = value;

      do {
        if (update) {
          updateValue = update();

          if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
            updateValue.then(_resumeAfterUpdate).then(void 0, reject);
            return;
          }
        }

        shouldContinue = test();

        if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
          _settle(pact, 1, result);

          return;
        }

        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
          return;
        }

        result = body();

        if (_isSettledPact(result)) {
          result = result.v;
        }
      } while (!result || !result.then);

      result.then(_resumeAfterBody).then(void 0, reject);
    }

    function _resumeAfterTest(shouldContinue) {
      if (shouldContinue) {
        result = body();

        if (result && result.then) {
          result.then(_resumeAfterBody).then(void 0, reject);
        } else {
          _resumeAfterBody(result);
        }
      } else {
        _settle(pact, 1, result);
      }
    }

    function _resumeAfterUpdate() {
      if (shouldContinue = test()) {
        if (shouldContinue.then) {
          shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        } else {
          _resumeAfterTest(shouldContinue);
        }
      } else {
        _settle(pact, 1, result);
      }
    }
  }

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

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var processBuildingBlock = function (buildingBlockDefinition, oNode, oVisitor) {
    var isPublic = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    try {
      var sFragmentName = buildingBlockDefinition.fragment || "".concat(buildingBlockDefinition.namespace, ".").concat(buildingBlockDefinition.name);
      var sName = "this";
      var mContexts = {};
      var oMetadataContexts = {};
      var oSettings = oVisitor.getSettings(); // TODO 0001 Move this elsewhere this is weird :)

      if (oSettings.models["sap.fe.i18n"]) {
        oSettings.models["sap.fe.i18n"].getResourceBundle().then(function (oResourceBundle) {
          ResourceModel.setApplicationI18nBundle(oResourceBundle);
        }).catch(function (error) {
          Log.error(error);
        });
      }

      var oMetadata = prepareMetadata(buildingBlockDefinition.metadata, buildingBlockDefinition.isOpen); //Inject storage for macros

      if (!oSettings[sFragmentName]) {
        oSettings[sFragmentName] = {};
      } // First of all we need to visit the attributes to resolve the properties and the metadata contexts


      return Promise.resolve(processProperties(oMetadata, oNode, isPublic, oVisitor, buildingBlockDefinition.apiVersion)).then(function (propertyValues) {
        return Promise.resolve(processContexts(oMetadata, oSettings, oNode, isPublic, oVisitor, mContexts, oMetadataContexts)).then(function (_ref) {
          var mMissingContext = _ref.mMissingContext,
              extraPropertyValues = _ref.propertyValues;
          propertyValues = Object.assign(propertyValues, extraPropertyValues);
          var initialKeys = Object.keys(propertyValues);

          var _temp18 = _catch(function () {
            // Aggregation and complex type support
            return Promise.resolve(processChildren(oNode, oVisitor, oMetadata, isPublic, propertyValues, buildingBlockDefinition.apiVersion)).then(function (oAggregations) {
              function _temp17() {
                if (oPreviousMacroInfo) {
                  //restore macro info if available
                  oSettings["_macroInfo"] = oPreviousMacroInfo;
                } else {
                  delete oSettings["_macroInfo"];
                }
              }

              var oInstance;
              var oControlConfig = {};

              if (oSettings.models.viewData) {
                // Only used in the Field macro and even then maybe not really useful
                oControlConfig = oSettings.models.viewData.getProperty("/controlConfiguration");
              }

              var processedPropertyValues = propertyValues;

              if (isV1MacroDef(buildingBlockDefinition) && buildingBlockDefinition.create) {
                processedPropertyValues = buildingBlockDefinition.create.call(buildingBlockDefinition, propertyValues, oControlConfig, oSettings, oAggregations, isPublic);
                Object.keys(oMetadata.metadataContexts).forEach(function (sMetadataName) {
                  if (oMetadata.metadataContexts[sMetadataName].computed === true) {
                    mContexts[sMetadataName] = processedPropertyValues[sMetadataName];
                  }
                });
                Object.keys(mMissingContext).forEach(function (sContextName) {
                  if (processedPropertyValues.hasOwnProperty(sContextName)) {
                    mContexts[sContextName] = processedPropertyValues[sContextName];
                  }
                });
              } else if (buildingBlockDefinition.apiVersion === 2) {
                Object.keys(propertyValues).forEach(function (propName) {
                  var oData = propertyValues[propName];

                  if (oData && oData.isA && oData.isA(SAP_UI_MODEL_CONTEXT) && !oData.getModel().isA("sap.ui.model.odata.v4.ODataMetaModel")) {
                    propertyValues[propName] = oData.getObject();
                  }
                });
                var BuildingBlockClass = buildingBlockDefinition;
                propertyValues.isPublic = isPublic;
                oInstance = new BuildingBlockClass(_objectSpread(_objectSpread({}, propertyValues), oAggregations), oControlConfig, oSettings
                /*, oControlConfig, oSettings, oAggregations, isPublic*/
                );
                processedPropertyValues = oInstance.getProperties();
                Object.keys(oMetadata.metadataContexts).forEach(function (sContextName) {
                  if (processedPropertyValues.hasOwnProperty(sContextName)) {
                    var targetObject = processedPropertyValues[sContextName];

                    if (typeof targetObject === "object" && !targetObject.getObject) {
                      var sAttributeValue = storeValue(targetObject);
                      var sContextPath = "".concat(sAttributeValue);
                      oSettings.models.converterContext.setProperty(sContextPath, targetObject);
                      targetObject = oSettings.models.converterContext.createBindingContext(sContextPath);
                      delete myStore[sAttributeValue];
                      mContexts[sContextName] = targetObject;
                    } else if (!mContexts.hasOwnProperty(sContextName) && targetObject !== undefined) {
                      mContexts[sContextName] = targetObject;
                    }
                  }
                });
              }

              var oAttributesModel = new AttributeModel(oNode, processedPropertyValues, buildingBlockDefinition);
              mContexts[sName] = oAttributesModel.createBindingContext("/");
              var oPreviousMacroInfo; // Keep track

              if (TraceInfo.isTraceInfoActive()) {
                var oTraceInfo = TraceInfo.traceMacroCalls(sFragmentName, oMetadata, mContexts, oNode, oVisitor);

                if (oTraceInfo) {
                  oPreviousMacroInfo = oSettings["_macroInfo"];
                  oSettings["_macroInfo"] = oTraceInfo.macroInfo;
                }
              }

              validateMacroSignature(sFragmentName, oMetadata, mContexts, oNode);
              var oContextVisitor = oVisitor.with(mContexts, buildingBlockDefinition.isOpen !== undefined ? !buildingBlockDefinition.isOpen : true);
              var oParent = oNode.parentNode;
              var iChildIndex;
              var oPromise;
              var processCustomData = true;

              var _temp16 = function () {
                if (oParent) {
                  iChildIndex = Array.from(oParent.children).indexOf(oNode);

                  if (isV1MacroDef(buildingBlockDefinition) && buildingBlockDefinition.getTemplate || buildingBlockDefinition.apiVersion === 2 && !buildingBlockDefinition.fragment) {
                    var oTemplate;
                    var addDefaultNamespace = false;

                    if (buildingBlockDefinition.apiVersion === 2) {
                      oTemplate = oInstance.getTemplate();

                      if (buildingBlockDefinition.isRuntime === true) {
                        for (var myStoreKey in myStore) {
                          var oData = myStore[myStoreKey];
                          var sContextPath = "".concat(myStoreKey);
                          oSettings.models.converterContext.setProperty(sContextPath, oData);
                          delete myStore[myStoreKey];
                        }
                      }

                      addDefaultNamespace = true;
                    } else if (buildingBlockDefinition.getTemplate) {
                      oTemplate = buildingBlockDefinition.getTemplate(processedPropertyValues);
                    }

                    var hasError = "";

                    if (oTemplate) {
                      if (!oTemplate.firstElementChild) {
                        oTemplate = parseXMLString(oTemplate, addDefaultNamespace); // For safety purpose we try to detect trailing text in between XML Tags

                        var iter = document.createNodeIterator(oTemplate, NodeFilter.SHOW_TEXT);
                        var textnode = iter.nextNode();

                        while (textnode) {
                          if (textnode.textContent && textnode.textContent.trim().length > 0) {
                            hasError = textnode.textContent;
                          }

                          textnode = iter.nextNode();
                        }
                      }

                      if (oTemplate.localName === "parsererror") {
                        // If there is a parseerror while processing the XML it means the XML itself is malformed, as such we rerun the template process
                        // Setting isTraceMode true will make it so that each xml` expression is checked for validity from XML perspective
                        // If an error is found it's returned instead of the normal fragment
                        Log.error("Error while processing building block ".concat(buildingBlockDefinition.name));

                        try {
                          var _oInstance;

                          isTraceMode = true;
                          oTemplate = (_oInstance = oInstance) !== null && _oInstance !== void 0 && _oInstance.getTemplate ? oInstance.getTemplate() : buildingBlockDefinition.getTemplate(processedPropertyValues);
                          oTemplate = parseXMLString(oTemplate, true);
                        } finally {
                          isTraceMode = false;
                        }
                      } else if (hasError.length > 0) {
                        // If there is trailing text we create a standard error and display it.
                        Log.error("Error while processing building block ".concat(buildingBlockDefinition.name));
                        var oErrorText = createErrorXML(["Error while processing building block ".concat(buildingBlockDefinition.name), "Trailing text was found in the XML: ".concat(hasError)], oTemplate.outerHTML);
                        oTemplate = parseXMLString(oErrorText, true);
                      }

                      oNode.replaceWith(oTemplate);
                      oNode = oParent.children[iChildIndex];
                      processSlots(oAggregations, oMetadata.aggregations, oNode, processCustomData);
                      processCustomData = false;
                      oPromise = oContextVisitor.visitNode(oNode);
                    } else {
                      oNode.remove();
                      oPromise = Promise.resolve();
                    }
                  } else {
                    oPromise = oContextVisitor.insertFragment(sFragmentName, oNode);
                  }

                  return Promise.resolve(oPromise).then(function () {
                    var oMacroElement = oParent.children[iChildIndex];
                    processSlots(oAggregations, oMetadata.aggregations, oMacroElement, processCustomData);

                    if (oMacroElement !== undefined) {
                      var oRemainingSlots = oMacroElement.querySelectorAll("slot");
                      oRemainingSlots.forEach(function (oSlotElement) {
                        oSlotElement.remove();
                      });
                    }
                  });
                }
              }();

              return _temp16 && _temp16.then ? _temp16.then(_temp17) : _temp17(_temp16);
            });
          }, function (e) {
            // In case there is a generic error (usually code error), we retrieve the current context information and create a dedicated error message
            var traceDetails = {
              initialProperties: {},
              resolvedProperties: {},
              missingContexts: mMissingContext
            };

            var _iterator = _createForOfIteratorHelper(initialKeys),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _propertyName = _step.value;
                var _propertyValue = propertyValues[_propertyName];

                if (_propertyValue && _propertyValue.isA && _propertyValue.isA(SAP_UI_MODEL_CONTEXT)) {
                  traceDetails.initialProperties[_propertyName] = {
                    path: _propertyValue.getPath(),
                    value: _propertyValue.getObject()
                  };
                } else {
                  traceDetails.initialProperties[_propertyName] = _propertyValue;
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            for (var propertyName in propertyValues) {
              var propertyValue = propertyValues[propertyName];

              if (!initialKeys.includes(propertyName)) {
                if (propertyValue && propertyValue.isA && propertyValue.isA(SAP_UI_MODEL_CONTEXT)) {
                  traceDetails.resolvedProperties[propertyName] = {
                    path: propertyValue.getPath(),
                    value: propertyValue.getObject()
                  };
                } else {
                  traceDetails.resolvedProperties[propertyName] = propertyValue;
                }
              }
            }

            var errorAny = e;
            Log.error(errorAny, errorAny);
            var oError = createErrorXML(["Error while processing building block ".concat(buildingBlockDefinition.name)], oNode.outerHTML, traceDetails, errorAny.stack);
            var oTemplate = parseXMLString(oError, true);
            oNode.replaceWith(oTemplate);
          });

          if (_temp18 && _temp18.then) return _temp18.then(function () {});
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var processChildren = function (oNode, oVisitor, oMetadata, isPublic, propertyValues, apiVersion) {
    try {
      var oAggregations = {};

      var _temp10 = function () {
        if (oNode.firstElementChild !== null) {
          function _temp11() {
            _oFirstElementChild = oNode.firstElementChild;

            var _temp6 = _for(function () {
              return _oFirstElementChild !== null;
            }, void 0, function () {
              function _temp5() {
                _oFirstElementChild = oNextChild;
              }

              var oNextChild = _oFirstElementChild.nextElementSibling;
              var sChildName = _oFirstElementChild.localName;
              var sAggregationName = sChildName;

              if (sAggregationName[0].toUpperCase() === sAggregationName[0]) {
                // not a sub aggregation, go back to default Aggregation
                sAggregationName = oMetadata.defaultAggregation || "";
              }

              var _temp4 = function () {
                if (Object.keys(oMetadata.aggregations).indexOf(sAggregationName) !== -1 && (!isPublic || oMetadata.aggregations[sAggregationName].isPublic === true)) {
                  var _temp13 = function () {
                    if (apiVersion === 2) {
                      var aggregationDefinition = oMetadata.aggregations[sAggregationName];

                      var _temp14 = function () {
                        if (!aggregationDefinition.slot && _oFirstElementChild !== null && _oFirstElementChild.children.length > 0) {
                          return Promise.resolve(oVisitor.visitNode(_oFirstElementChild)).then(function () {
                            var childDefinition = _oFirstElementChild.firstElementChild;

                            while (childDefinition) {
                              var oNewChild = document.createElementNS(oNode.namespaceURI, childDefinition.getAttribute("key"));
                              var nextChild = childDefinition.nextElementSibling;
                              oNewChild.appendChild(childDefinition);
                              oAggregations[childDefinition.getAttribute("key")] = oNewChild;
                              childDefinition.removeAttribute("key");
                              childDefinition = nextChild;
                            }
                          });
                        } else if (aggregationDefinition.slot) {
                          if (sAggregationName !== sChildName) {
                            if (!oAggregations[sAggregationName]) {
                              var oNewChild = document.createElementNS(oNode.namespaceURI, sAggregationName);
                              oAggregations[sAggregationName] = oNewChild;
                            }

                            oAggregations[sAggregationName].appendChild(_oFirstElementChild);
                          } else {
                            oAggregations[sAggregationName] = _oFirstElementChild;
                          }
                        }
                      }();

                      if (_temp14 && _temp14.then) return _temp14.then(function () {});
                    } else {
                      return Promise.resolve(oVisitor.visitNode(_oFirstElementChild)).then(function () {
                        oAggregations[_oFirstElementChild.localName] = _oFirstElementChild;
                      });
                    }
                  }();

                  if (_temp13 && _temp13.then) return _temp13.then(function () {});
                } else {
                  var _temp15 = function () {
                    if (Object.keys(oMetadata.properties).indexOf(sAggregationName) !== -1) {
                      return Promise.resolve(oVisitor.visitNode(_oFirstElementChild)).then(function () {
                        if (oMetadata.properties[sAggregationName].type === "object") {
                          // Object Type properties
                          propertyValues[sAggregationName] = {};

                          for (var _i2 = 0, _Object$keys = Object.keys(_oFirstElementChild.attributes); _i2 < _Object$keys.length; _i2++) {
                            var attributeIndex = _Object$keys[_i2];
                            propertyValues[sAggregationName][_oFirstElementChild.attributes[attributeIndex].localName] = _oFirstElementChild.attributes[attributeIndex].value;
                          }
                        } else if (oMetadata.properties[sAggregationName].type === "array") {
                          if (_oFirstElementChild !== null && _oFirstElementChild.children.length > 0) {
                            var children = _oFirstElementChild.children;
                            var oOutObjects = [];

                            for (var childIdx = 0; childIdx < children.length; childIdx++) {
                              var childDefinition = children[childIdx]; // non keyed child, just add it to the aggregation

                              var myChild = {};

                              for (var _i3 = 0, _Object$keys2 = Object.keys(childDefinition.attributes); _i3 < _Object$keys2.length; _i3++) {
                                var _attributeIndex = _Object$keys2[_i3];
                                myChild[childDefinition.attributes[_attributeIndex].localName] = childDefinition.attributes[_attributeIndex].value;
                              }

                              oOutObjects.push(myChild);
                            }

                            propertyValues[sAggregationName] = oOutObjects;
                          }
                        }
                      });
                    }
                  }();

                  if (_temp15 && _temp15.then) return _temp15.then(function () {});
                }
              }();

              return _temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4);
            });

            if (_temp6 && _temp6.then) return _temp6.then(function () {});
          }

          var _oFirstElementChild = oNode.firstElementChild;

          if (apiVersion === 2) {
            while (_oFirstElementChild !== null) {
              var sChildName = _oFirstElementChild.localName;
              var sAggregationName = sChildName;

              if (sAggregationName[0].toUpperCase() === sAggregationName[0]) {
                // not a sub aggregation, go back to default Aggregation
                sAggregationName = oMetadata.defaultAggregation || "";
              }

              var aggregationDefinition = oMetadata.aggregations[sAggregationName];

              if (aggregationDefinition !== undefined && !aggregationDefinition.slot) {
                var parsedAggregation = parseAggregation(_oFirstElementChild);
                oAggregations[sAggregationName] = parsedAggregation;

                for (var parsedAggregationKey in parsedAggregation) {
                  oMetadata.aggregations[parsedAggregationKey] = parsedAggregation[parsedAggregationKey];
                }
              }

              _oFirstElementChild = _oFirstElementChild.nextElementSibling;
            }
          }

          var _temp12 = function () {
            if (apiVersion !== 2) {
              // If there are aggregation we need to visit the childNodes to resolve templating instructions
              return Promise.resolve(oVisitor.visitChildNodes(oNode)).then(function () {});
            }
          }();

          return _temp12 && _temp12.then ? _temp12.then(_temp11) : _temp11(_temp12);
        }
      }();

      return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(function () {
        return oAggregations;
      }) : oAggregations);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Parse the incoming XML node and try to resolve the binding contexts defined inside.
   *
   * @param oMetadata The metadata for the building block
   * @param oSettings The settings object
   * @param oNode The XML node to parse
   * @param isPublic Whether the building block is used in a public context or not
   * @param oVisitor The visitor instance
   * @param mContexts The contexts to be used
   * @param oMetadataContexts	The metadata contexts to be used
   */
  var processContexts = function (oMetadata, oSettings, oNode, isPublic, oVisitor, mContexts, oMetadataContexts) {
    try {
      oSettings.currentContextPath = oSettings.bindingContexts.contextPath;
      var mMissingContext = {};
      var propertyValues = {};
      var oDefinitionContexts = oMetadata.metadataContexts;
      var aDefinitionContextsKeys = Object.keys(oDefinitionContexts); // Since the metaPath and other property can be relative to the contextPath we need to evaluate the current contextPath first

      var contextPathIndex = aDefinitionContextsKeys.indexOf("contextPath");

      if (contextPathIndex !== -1) {
        // If it is defined we extract it and reinsert it in the first position of the array
        var contextPathDefinition = aDefinitionContextsKeys.splice(contextPathIndex, 1);
        aDefinitionContextsKeys.splice(0, 0, contextPathDefinition[0]);
      }

      for (var _i = 0, _aDefinitionContextsK = aDefinitionContextsKeys; _i < _aDefinitionContextsK.length; _i++) {
        var sAttributeName = _aDefinitionContextsK[_i];
        var bDoNotResolve = isPublic && oDefinitionContexts[sAttributeName].isPublic === false && oNode.hasAttribute(sAttributeName);

        var oMetadataContext = _getMetadataContext(oSettings, oNode, sAttributeName, oVisitor, bDoNotResolve, oMetadata.isOpen);

        if (oMetadataContext) {
          oMetadataContext.name = sAttributeName;
          addSingleContext(mContexts, oVisitor, oMetadataContext, oMetadataContexts);

          if ((sAttributeName === "entitySet" || sAttributeName === "contextPath") && !oSettings.bindingContexts.hasOwnProperty(sAttributeName)) {
            oSettings.bindingContexts[sAttributeName] = mContexts[sAttributeName];
          }

          if (sAttributeName === "contextPath") {
            oSettings.currentContextPath = mContexts[sAttributeName];
          }

          propertyValues[sAttributeName] = mContexts[sAttributeName];
        } else {
          mMissingContext[sAttributeName] = true;
        }
      }

      return Promise.resolve({
        mMissingContext: mMissingContext,
        propertyValues: propertyValues
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  /**
   * Parse the incoming XML node and try to resolve the properties defined there.
   *
   * @param oMetadata The metadata for the building block
   * @param oNode The XML node to parse
   * @param isPublic Whether the building block is used in a public context or not
   * @param oVisitor The visitor instance
   * @param apiVersion The API version of the building block
   */
  var processProperties = function (oMetadata, oNode, isPublic, oVisitor, apiVersion) {
    try {
      var oDefinitionProperties = oMetadata.properties; // Retrieve properties values

      var aDefinitionPropertiesKeys = Object.keys(oDefinitionProperties);
      var propertyValues = {};

      var _temp22 = _forOf(aDefinitionPropertiesKeys, function (sKeyValue) {
        if (oDefinitionProperties[sKeyValue].type === "object") {
          propertyValues[sKeyValue] = deepClone(oDefinitionProperties[sKeyValue].defaultValue || {}); // To avoid values being reused across macros
        } else {
          propertyValues[sKeyValue] = oDefinitionProperties[sKeyValue].defaultValue;
        }

        var _temp20 = function () {
          if (oNode.hasAttribute(sKeyValue) && isPublic && oDefinitionProperties[sKeyValue].isPublic === false) {
            Log.error("Property ".concat(sKeyValue, " was ignored as it is not intended for public usage"));
          } else {
            var _temp23 = function () {
              if (oNode.hasAttribute(sKeyValue)) {
                return Promise.resolve(oVisitor.visitAttribute(oNode, oNode.attributes.getNamedItem(sKeyValue))).then(function () {
                  var vValue = oNode.getAttribute(sKeyValue);

                  if (vValue !== undefined) {
                    if (apiVersion === 2 && typeof vValue === "string" && !vValue.startsWith("{")) {
                      switch (oDefinitionProperties[sKeyValue].type) {
                        case "boolean":
                          vValue = vValue === "true";
                          break;

                        case "number":
                          vValue = Number(vValue);
                          break;
                      }
                    }

                    propertyValues[sKeyValue] = vValue;
                  }
                });
              }
            }();

            if (_temp23 && _temp23.then) return _temp23.then(function () {});
          }
        }();

        if (_temp20 && _temp20.then) return _temp20.then(function () {});
      });

      return Promise.resolve(_temp22 && _temp22.then ? _temp22.then(function () {
        return propertyValues;
      }) : propertyValues);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var LOGGER_SCOPE = "sap.fe.core.buildingBlocks.BuildingBlockRuntime";
  var DOMParserInstance = new DOMParser();
  var isTraceMode = false;

  /**
   * Typeguard for checking if a building block use API 1.
   *
   * @param buildingBlockDefinition
   * @returns `true` if the building block is using API 1.
   */
  function isV1MacroDef(buildingBlockDefinition) {
    return buildingBlockDefinition.apiVersion === undefined || buildingBlockDefinition.apiVersion === 1;
  }

  function validateMacroMetadataContext(sName, mContexts, oContextSettings, sKey) {
    var oContext = mContexts[sKey];
    var oContextObject = oContext === null || oContext === void 0 ? void 0 : oContext.getObject();

    if (oContextSettings.required === true && (!oContext || oContextObject === null)) {
      throw new Error("".concat(sName, ": Required metadataContext '").concat(sKey, "' is missing"));
    } else if (oContextObject) {
      // If context object has $kind property, $Type should not be checked
      // Therefore remove from context settings
      if (oContextObject.hasOwnProperty("$kind") && oContextSettings.$kind) {
        // Check if the $kind is part of the allowed ones
        if (oContextSettings.$kind.indexOf(oContextObject["$kind"]) === -1) {
          throw new Error("".concat(sName, ": '").concat(sKey, "' must be '$kind' '").concat(oContextSettings["$kind"], "' but is '").concat(oContextObject.$kind, "': ").concat(oContext.getPath()));
        }
      } else if (oContextObject.hasOwnProperty("$Type") && oContextSettings.$Type) {
        // Check only $Type
        if (oContextSettings.$Type.indexOf(oContextObject["$Type"]) === -1) {
          throw new Error("".concat(sName, ": '").concat(sKey, "' must be '$Type' '").concat(oContextSettings["$Type"], "' but is '").concat(oContextObject.$Type, "': ").concat(oContext.getPath()));
        }
      }
    }
  }

  function validateMacroSignature(sName, oMetadata, mContexts, oNode) {
    var aMetadataContextKeys = oMetadata.metadataContexts && Object.keys(oMetadata.metadataContexts) || [],
        aProperties = oMetadata.properties && Object.keys(oMetadata.properties) || [],
        oAttributeNames = {}; // collect all attributes to find unchecked properties

    Object.keys(oNode.attributes).forEach(function (iKey) {
      var sKey = oNode.attributes[iKey].name;
      oAttributeNames[sKey] = true;
    }); //Check metadataContexts

    aMetadataContextKeys.forEach(function (sKey) {
      var oContextSettings = oMetadata.metadataContexts[sKey];
      validateMacroMetadataContext(sName, mContexts, oContextSettings, sKey);
      delete oAttributeNames[sKey];
    }); //Check properties

    aProperties.forEach(function (sKey) {
      var oPropertySettings = oMetadata.properties[sKey];

      if (!oNode.hasAttribute(sKey)) {
        if (oPropertySettings.required && !oPropertySettings.hasOwnProperty("defaultValue")) {
          throw new Error("".concat(sName, ": ") + "Required property '".concat(sKey, "' is missing"));
        }
      } else {
        delete oAttributeNames[sKey];
      }
    }); // Unchecked properties

    Object.keys(oAttributeNames).forEach(function (sKey) {
      // no check for properties which start with underscore "_" or contain a colon ":" (different namespace), e.g. xmlns:trace, trace:macroID, unittest:id
      if (sKey.indexOf(":") < 0 && !sKey.startsWith("xmlns")) {
        Log.warning("Unchecked parameter: ".concat(sName, ": ").concat(sKey), undefined, LOGGER_SCOPE);
      }
    });
  }

  _exports.validateMacroSignature = validateMacroSignature;
  var SAP_UI_CORE_ELEMENT = "sap.ui.core.Element";
  var SAP_UI_MODEL_CONTEXT = "sap.ui.model.Context";
  /**
   * Ensures that the metadata for the building block are properly defined.
   *
   * @param buildingBlockMetadata The metadata received from the input
   * @param isOpen Whether the building block is open or not
   * @returns A set of completed metadata for further processing
   */

  function prepareMetadata(buildingBlockMetadata) {
    var isOpen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (buildingBlockMetadata) {
      var oProperties = {};
      var oAggregations = {
        "dependents": {
          type: SAP_UI_CORE_ELEMENT
        },
        "customData": {
          type: SAP_UI_CORE_ELEMENT
        }
      };
      var oMetadataContexts = {};
      var foundDefaultAggregation;
      Object.keys(buildingBlockMetadata.properties).forEach(function (sPropertyName) {
        if (buildingBlockMetadata.properties[sPropertyName].type !== SAP_UI_MODEL_CONTEXT) {
          oProperties[sPropertyName] = buildingBlockMetadata.properties[sPropertyName];
        } else {
          oMetadataContexts[sPropertyName] = buildingBlockMetadata.properties[sPropertyName];
        }
      }); // Merge events into properties as they are handled identically

      if (buildingBlockMetadata.events !== undefined) {
        Object.keys(buildingBlockMetadata.events).forEach(function (sEventName) {
          oProperties[sEventName] = buildingBlockMetadata.events[sEventName];
        });
      }

      if (buildingBlockMetadata.aggregations !== undefined) {
        Object.keys(buildingBlockMetadata.aggregations).forEach(function (sPropertyName) {
          oAggregations[sPropertyName] = buildingBlockMetadata.aggregations[sPropertyName];

          if (oAggregations[sPropertyName].isDefault) {
            foundDefaultAggregation = sPropertyName;
          }
        });
      }

      return {
        properties: oProperties,
        aggregations: oAggregations,
        defaultAggregation: foundDefaultAggregation,
        metadataContexts: oMetadataContexts,
        isOpen: isOpen
      };
    } else {
      return {
        metadataContexts: {},
        aggregations: {
          "dependents": {
            type: SAP_UI_CORE_ELEMENT
          },
          "customData": {
            type: SAP_UI_CORE_ELEMENT
          }
        },
        properties: {},
        isOpen: isOpen
      };
    }
  }
  /**
   * Checks the absolute or context paths and returns an appropriate MetaContext.
   *
   * @param oSettings Additional settings
   * @param sAttributeValue The attribute value
   * @returns {MetaDataContext} The meta data context object
   */


  function _checkAbsoluteAndContextPaths(oSettings, sAttributeValue) {
    var sMetaPath;

    if (sAttributeValue && sAttributeValue.startsWith("/")) {
      // absolute path - we just use this one
      sMetaPath = sAttributeValue;
    } else {
      var sContextPath = oSettings.currentContextPath.getPath();

      if (!sContextPath.endsWith("/")) {
        sContextPath += "/";
      }

      sMetaPath = sContextPath + sAttributeValue;
    }

    return {
      model: "metaModel",
      path: sMetaPath
    };
  }
  /**
   * This method helps to create the metadata context in case it is not yet available in the store.
   *
   * @param oSettings Additional settings
   * @param sAttributeName The attribute name
   * @param sAttributeValue The attribute value
   * @returns {MetaDataContext} The meta data context object
   */


  function _createInitialMetadataContext(oSettings, sAttributeName, sAttributeValue) {
    var returnContext;

    if (sAttributeValue.startsWith("/uid--")) {
      var oData = myStore[sAttributeValue];
      oSettings.models.converterContext.setProperty(sAttributeValue, oData);
      returnContext = {
        model: "converterContext",
        path: sAttributeValue
      };
    } else if (sAttributeName === "metaPath" && oSettings.currentContextPath || sAttributeName === "contextPath") {
      returnContext = _checkAbsoluteAndContextPaths(oSettings, sAttributeValue);
    } else if (sAttributeValue && sAttributeValue.startsWith("/")) {
      // absolute path - we just use this one
      returnContext = {
        model: "metaModel",
        path: sAttributeValue
      };
    } else {
      returnContext = {
        model: "metaModel",
        path: oSettings.bindingContexts.entitySet ? oSettings.bindingContexts.entitySet.getPath(sAttributeValue) : sAttributeValue
      };
    }

    return returnContext;
  }

  function _getMetadataContext(oSettings, oNode, sAttributeName, oVisitor, bDoNotResolve, isOpen) {
    var oMetadataContext;

    if (!bDoNotResolve && oNode.hasAttribute(sAttributeName)) {
      var sAttributeValue = oNode.getAttribute(sAttributeName);
      oMetadataContext = BindingParser.complexParser(sAttributeValue);

      if (!oMetadataContext) {
        oMetadataContext = _createInitialMetadataContext(oSettings, sAttributeName, sAttributeValue);
      }
    } else if (oSettings.bindingContexts.hasOwnProperty(sAttributeName)) {
      oMetadataContext = {
        model: sAttributeName,
        path: ""
      };
    } else if (isOpen) {
      try {
        if (oVisitor.getContext("".concat(sAttributeName, ">"))) {
          oMetadataContext = {
            model: sAttributeName,
            path: ""
          };
        }
      } catch (e) {
        return undefined;
      }
    }

    return oMetadataContext;
  }

  function parseAggregation(oAggregation) {
    var oOutObjects = {};

    if (oAggregation && oAggregation.children.length > 0) {
      var children = oAggregation.children;

      for (var childIdx = 0; childIdx < children.length; childIdx++) {
        var childDefinition = children[childIdx];
        var childKey = childDefinition.getAttribute("key") || childDefinition.getAttribute("id");

        if (childKey) {
          childKey = "InlineXML_".concat(childKey);
          childDefinition.setAttribute("key", childKey);
          oOutObjects[childKey] = {
            key: childKey,
            position: {
              placement: childDefinition.getAttribute("placement"),
              anchor: childDefinition.getAttribute("anchor")
            },
            type: "Slot"
          };
        }
      }
    }

    return oOutObjects;
  }

  function processSlots(oAggregations, oMetadataAggregations, oNode) {
    var processCustomData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (Object.keys(oAggregations).length > 0) {
      Object.keys(oAggregations).forEach(function (sAggregationName) {
        var oAggregationElement = oAggregations[sAggregationName];

        if (oNode !== null && oNode !== undefined && oAggregationElement) {
          // slots can have :: as keys which is not a valid aggregation name therefore replacing them
          var oNewChild = document.createElementNS(oNode.namespaceURI, sAggregationName.replace(/:/gi, "_"));
          var oElementChild = oAggregationElement.firstElementChild;

          while (oElementChild) {
            var oNextChild = oElementChild.nextElementSibling;
            oNewChild.appendChild(oElementChild);
            oElementChild = oNextChild;
          }

          if (sAggregationName !== "customData" && sAggregationName !== "dependents") {
            var sSlotName = oMetadataAggregations[sAggregationName] !== undefined && oMetadataAggregations[sAggregationName].slot || sAggregationName;
            var oTargetElement = oNode.querySelector("slot[name='".concat(sSlotName, "']"));

            if (oTargetElement !== null) {
              oTargetElement.replaceWith.apply(oTargetElement, _toConsumableArray(oNewChild.children));
            }
          } else if (processCustomData && oNewChild.children.length > 0) {
            oNode.appendChild(oNewChild);
          }
        }
      });
    }
  }

  function addSingleContext(mContexts, oVisitor, oCtx, oMetadataContexts) {
    var sKey = oCtx.name || oCtx.model || undefined;

    if (oMetadataContexts[sKey]) {
      return; // do not add twice
    }

    try {
      var sContextPath = oCtx.path;

      if (oCtx.model != null) {
        sContextPath = "".concat(oCtx.model, ">").concat(sContextPath);
      }

      var mSetting = oVisitor.getSettings();

      if (oCtx.model === "converterContext" && oCtx.path.length > 0) {
        mContexts[sKey] = mSetting.models[oCtx.model].getContext(oCtx.path, mSetting.bindingContexts[oCtx.model]); // add the context to the visitor
      } else if (!mSetting.bindingContexts[oCtx.model] && mSetting.models[oCtx.model]) {
        mContexts[sKey] = mSetting.models[oCtx.model].getContext(oCtx.path); // add the context to the visitor
      } else {
        mContexts[sKey] = oVisitor.getContext(sContextPath); // add the context to the visitor
      }

      oMetadataContexts[sKey] = mContexts[sKey]; // make it available inside metadataContexts JSON object
    } catch (ex) {//console.error(ex);
      // ignore the context as this can only be the case if the model is not ready, i.e. not a preprocessing model but maybe a model for
      // providing afterwards
      // TODO 0002 not yet implemented
      //mContexts["_$error"].oModel.setProperty("/" + sKey, ex);
    }
  }
  /**
   * Register a building block definition to be used inside the xml template processor.
   *
   * @param buildingBlockDefinition The building block definition
   */


  function registerBuildingBlock(buildingBlockDefinition) {
    XMLPreprocessor.plugIn(function (oNode, oVisitor) {
      return processBuildingBlock(buildingBlockDefinition, oNode, oVisitor);
    }, buildingBlockDefinition.namespace, buildingBlockDefinition.xmlTag || buildingBlockDefinition.name);

    if (buildingBlockDefinition.publicNamespace) {
      XMLPreprocessor.plugIn(function (oNode, oVisitor) {
        return processBuildingBlock(buildingBlockDefinition, oNode, oVisitor, true);
      }, buildingBlockDefinition.publicNamespace, buildingBlockDefinition.xmlTag || buildingBlockDefinition.name);
    }
  }

  _exports.registerBuildingBlock = registerBuildingBlock;

  function createErrorXML(errorMessages, xmlFragment, additionalData, stack) {
    var errorLabels = errorMessages.map(function (errorMessage) {
      return xml(_templateObject || (_templateObject = _taggedTemplateLiteral(["<m:Label text=\"", "\"/>"])), escapeXMLAttributeValue(errorMessage));
    });
    var errorStack = "";

    if (stack) {
      var stackFormatted = btoa("<pre>".concat(stack, "</pre>"));
      errorStack = xml(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["<m:FormattedText htmlText=\"", "\" />"])), "{= BBF.base64Decode('".concat(stackFormatted, "') }"));
    }

    var additionalText = "";

    if (additionalData) {
      additionalText = xml(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<m:VBox>\n\t\t\t\t\t\t<m:Label text=\"Trace Info\"/>\n\t\t\t\t\t\t<code:CodeEditor type=\"json\"  value=\"", "\" height=\"300px\" />\n\t\t\t\t\t</m:VBox>"])), "{= BBF.base64Decode('".concat(btoa(JSON.stringify(additionalData, null, 4)), "') }"));
    }

    return xml(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["<m:VBox xmlns:m=\"sap.m\" xmlns:code=\"sap.ui.codeeditor\" core:require=\"{BBF:'sap/fe/core/buildingBlocks/BuildingBlockFormatter'}\">\n\t\t\t\t", "\n\t\t\t\t", "\n\t\t\t\t<grid:CSSGrid gridTemplateRows=\"fr\" gridTemplateColumns=\"repeat(2,1fr)\" gridGap=\"1rem\" xmlns:grid=\"sap.ui.layout.cssgrid\" >\n\t\t\t\t\t<m:VBox>\n\t\t\t\t\t\t<m:Label text=\"How the building block was called\"/>\n\t\t\t\t\t\t<code:CodeEditor type=\"xml\" value=\"", "\" height=\"300px\" />\n\t\t\t\t\t</m:VBox>\n\t\t\t\t\t", "\n\t\t\t\t</grid:CSSGrid>\n\t\t\t</m:VBox>"])), errorLabels, errorStack, "{= BBF.base64Decode('".concat(btoa(xmlFragment.replaceAll("&gt;", ">")), "') }"), additionalText);
  }

  var myStore = {};

  function storeValue(values) {
    var propertyUID = "/uid--".concat(uid());
    myStore[propertyUID] = values;
    return propertyUID;
  }
  /**
   * Parse an XML string and return the associated document.
   *
   * @param xmlString The xml string
   * @param addDefaultNamespaces Whether or not we should add default namespace
   * @returns The XML document.
   */


  function parseXMLString(xmlString) {
    var addDefaultNamespaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (addDefaultNamespaces) {
      xmlString = "<template\n\t\t\t\t\t\txmlns:template=\"http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1\"\n\t\t\t\t\t\txmlns:m=\"sap.m\"\n\t\t\t\t\t\txmlns:macros=\"sap.fe.macros\"\n\t\t\t\t\t\txmlns:core=\"sap.ui.core\"\n\t\t\t\t\t\txmlns:mdc=\"sap.ui.mdc\"\n\t\t\t\t\t\txmlns:customData=\"http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1\">".concat(xmlString, "</template>");
    }

    var xmlDocument = DOMParserInstance.parseFromString(xmlString, "text/xml");
    var output = xmlDocument.firstElementChild;

    while (((_output = output) === null || _output === void 0 ? void 0 : _output.localName) === "template") {
      var _output;

      output = output.firstElementChild;
    }

    return output;
  }
  /**
   * Escape an XML attribute value.
   *
   * @param value The attribute value to escape.
   * @returns The escaped string.
   */


  _exports.parseXMLString = parseXMLString;

  function escapeXMLAttributeValue(value) {
    return value === null || value === void 0 ? void 0 : value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }

  _exports.escapeXMLAttributeValue = escapeXMLAttributeValue;

  function renderInTraceMode(outStr) {
    var xmlResult = parseXMLString(outStr, true);

    if (xmlResult !== undefined && (xmlResult === null || xmlResult === void 0 ? void 0 : xmlResult.localName) === "parsererror") {
      var errorMessage = xmlResult.innerText || xmlResult.innerHTML;
      return createErrorXML([errorMessage.split("\n")[0]], outStr);
    } else {
      return outStr;
    }
  }
  /**
   * Create a string representation of the template literal while handling special object case.
   *
   * @param strings The string parts of the template literal
   * @param values The values part of the template literal
   * @returns The XML string document representing the string that was used.
   */


  var xml = function (strings) {
    var outStr = "";
    var i;

    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    for (i = 0; i < values.length; i++) {
      outStr += strings[i]; // Handle the different case of object, if it's an array we join them, if it's a binding expression (determined by _type) then we compile it.

      var value = values[i];

      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        outStr += value.flat(5).join("\n").trim();
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "function") {
        outStr += value.map(function (valuefn) {
          return valuefn();
        }).join("\n");
      } else if (value !== null && value !== void 0 && value._type) {
        var compiledExpression = compileExpression(value);
        outStr += escapeXMLAttributeValue(compiledExpression);
      } else if (value !== null && value !== void 0 && value.getTemplate) {
        outStr += value.getTemplate();
      } else if (typeof value === "undefined") {
        outStr += "{this>undefinedValue}";
      } else if (typeof value === "function") {
        outStr += value();
      } else if (typeof value === "object" && value !== null) {
        var _value$isA;

        if ((_value$isA = value.isA) !== null && _value$isA !== void 0 && _value$isA.call(value, "sap.ui.model.Context")) {
          outStr += value.getPath();
        } else {
          var propertyUId = storeValue(value);
          outStr += "".concat(propertyUId);
        }
      } else if (value && typeof value === "string" && !value.startsWith("<") && !value.startsWith("&lt;")) {
        outStr += escapeXMLAttributeValue(value);
      } else {
        outStr += value;
      }
    }

    outStr += strings[i];
    outStr = outStr.trim();

    if (isTraceMode) {
      return renderInTraceMode(outStr);
    }

    return outStr;
  };

  _exports.xml = xml;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ0YXJnZXQiLCJib2R5IiwiY2hlY2siLCJpdGVyYXRvciIsInN0ZXAiLCJwYWN0IiwicmVqZWN0IiwiX2N5Y2xlIiwicmVzdWx0IiwibmV4dCIsImRvbmUiLCJ2YWx1ZSIsInRoZW4iLCJ2IiwiYmluZCIsImUiLCJyZXR1cm4iLCJfZml4dXAiLCJUeXBlRXJyb3IiLCJ2YWx1ZXMiLCJpIiwibGVuZ3RoIiwicHVzaCIsImFycmF5IiwiU3ltYm9sIiwic3RhdGUiLCJzIiwibyIsIm9ic2VydmVyIiwicHJvdG90eXBlIiwib25GdWxmaWxsZWQiLCJvblJlamVjdGVkIiwiY2FsbGJhY2siLCJfdGhpcyIsInRoZW5hYmxlIiwidGVzdCIsInVwZGF0ZSIsInN0YWdlIiwic2hvdWxkQ29udGludWUiLCJ1cGRhdGVWYWx1ZSIsIl9yZXN1bWVBZnRlclRlc3QiLCJfcmVzdW1lQWZ0ZXJCb2R5IiwiX3Jlc3VtZUFmdGVyVXBkYXRlIiwicmVjb3ZlciIsInByb2Nlc3NCdWlsZGluZ0Jsb2NrIiwiYnVpbGRpbmdCbG9ja0RlZmluaXRpb24iLCJvTm9kZSIsIm9WaXNpdG9yIiwiaXNQdWJsaWMiLCJzRnJhZ21lbnROYW1lIiwiZnJhZ21lbnQiLCJuYW1lc3BhY2UiLCJuYW1lIiwic05hbWUiLCJtQ29udGV4dHMiLCJvTWV0YWRhdGFDb250ZXh0cyIsIm9TZXR0aW5ncyIsImdldFNldHRpbmdzIiwibW9kZWxzIiwiZ2V0UmVzb3VyY2VCdW5kbGUiLCJvUmVzb3VyY2VCdW5kbGUiLCJSZXNvdXJjZU1vZGVsIiwic2V0QXBwbGljYXRpb25JMThuQnVuZGxlIiwiY2F0Y2giLCJlcnJvciIsIkxvZyIsIm9NZXRhZGF0YSIsInByZXBhcmVNZXRhZGF0YSIsIm1ldGFkYXRhIiwiaXNPcGVuIiwicHJvY2Vzc1Byb3BlcnRpZXMiLCJhcGlWZXJzaW9uIiwicHJvcGVydHlWYWx1ZXMiLCJwcm9jZXNzQ29udGV4dHMiLCJtTWlzc2luZ0NvbnRleHQiLCJleHRyYVByb3BlcnR5VmFsdWVzIiwiT2JqZWN0IiwiYXNzaWduIiwiaW5pdGlhbEtleXMiLCJrZXlzIiwicHJvY2Vzc0NoaWxkcmVuIiwib0FnZ3JlZ2F0aW9ucyIsIm9QcmV2aW91c01hY3JvSW5mbyIsIm9JbnN0YW5jZSIsIm9Db250cm9sQ29uZmlnIiwidmlld0RhdGEiLCJnZXRQcm9wZXJ0eSIsInByb2Nlc3NlZFByb3BlcnR5VmFsdWVzIiwiaXNWMU1hY3JvRGVmIiwiY3JlYXRlIiwiY2FsbCIsIm1ldGFkYXRhQ29udGV4dHMiLCJmb3JFYWNoIiwic01ldGFkYXRhTmFtZSIsImNvbXB1dGVkIiwic0NvbnRleHROYW1lIiwiaGFzT3duUHJvcGVydHkiLCJwcm9wTmFtZSIsIm9EYXRhIiwiaXNBIiwiU0FQX1VJX01PREVMX0NPTlRFWFQiLCJnZXRNb2RlbCIsImdldE9iamVjdCIsIkJ1aWxkaW5nQmxvY2tDbGFzcyIsImdldFByb3BlcnRpZXMiLCJ0YXJnZXRPYmplY3QiLCJzQXR0cmlidXRlVmFsdWUiLCJzdG9yZVZhbHVlIiwic0NvbnRleHRQYXRoIiwiY29udmVydGVyQ29udGV4dCIsInNldFByb3BlcnR5IiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJteVN0b3JlIiwidW5kZWZpbmVkIiwib0F0dHJpYnV0ZXNNb2RlbCIsIkF0dHJpYnV0ZU1vZGVsIiwiVHJhY2VJbmZvIiwiaXNUcmFjZUluZm9BY3RpdmUiLCJvVHJhY2VJbmZvIiwidHJhY2VNYWNyb0NhbGxzIiwibWFjcm9JbmZvIiwidmFsaWRhdGVNYWNyb1NpZ25hdHVyZSIsIm9Db250ZXh0VmlzaXRvciIsIndpdGgiLCJvUGFyZW50IiwicGFyZW50Tm9kZSIsImlDaGlsZEluZGV4Iiwib1Byb21pc2UiLCJwcm9jZXNzQ3VzdG9tRGF0YSIsIkFycmF5IiwiZnJvbSIsImNoaWxkcmVuIiwiaW5kZXhPZiIsImdldFRlbXBsYXRlIiwib1RlbXBsYXRlIiwiYWRkRGVmYXVsdE5hbWVzcGFjZSIsImlzUnVudGltZSIsIm15U3RvcmVLZXkiLCJoYXNFcnJvciIsImZpcnN0RWxlbWVudENoaWxkIiwicGFyc2VYTUxTdHJpbmciLCJpdGVyIiwiZG9jdW1lbnQiLCJjcmVhdGVOb2RlSXRlcmF0b3IiLCJOb2RlRmlsdGVyIiwiU0hPV19URVhUIiwidGV4dG5vZGUiLCJuZXh0Tm9kZSIsInRleHRDb250ZW50IiwidHJpbSIsImxvY2FsTmFtZSIsImlzVHJhY2VNb2RlIiwib0Vycm9yVGV4dCIsImNyZWF0ZUVycm9yWE1MIiwib3V0ZXJIVE1MIiwicmVwbGFjZVdpdGgiLCJwcm9jZXNzU2xvdHMiLCJhZ2dyZWdhdGlvbnMiLCJ2aXNpdE5vZGUiLCJyZW1vdmUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImluc2VydEZyYWdtZW50Iiwib01hY3JvRWxlbWVudCIsIm9SZW1haW5pbmdTbG90cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJvU2xvdEVsZW1lbnQiLCJ0cmFjZURldGFpbHMiLCJpbml0aWFsUHJvcGVydGllcyIsInJlc29sdmVkUHJvcGVydGllcyIsIm1pc3NpbmdDb250ZXh0cyIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5VmFsdWUiLCJwYXRoIiwiZ2V0UGF0aCIsImluY2x1ZGVzIiwiZXJyb3JBbnkiLCJvRXJyb3IiLCJzdGFjayIsIm9GaXJzdEVsZW1lbnRDaGlsZCIsIm9OZXh0Q2hpbGQiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJzQ2hpbGROYW1lIiwic0FnZ3JlZ2F0aW9uTmFtZSIsInRvVXBwZXJDYXNlIiwiZGVmYXVsdEFnZ3JlZ2F0aW9uIiwiYWdncmVnYXRpb25EZWZpbml0aW9uIiwic2xvdCIsImNoaWxkRGVmaW5pdGlvbiIsIm9OZXdDaGlsZCIsImNyZWF0ZUVsZW1lbnROUyIsIm5hbWVzcGFjZVVSSSIsImdldEF0dHJpYnV0ZSIsIm5leHRDaGlsZCIsImFwcGVuZENoaWxkIiwicmVtb3ZlQXR0cmlidXRlIiwicHJvcGVydGllcyIsInR5cGUiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlSW5kZXgiLCJvT3V0T2JqZWN0cyIsImNoaWxkSWR4IiwibXlDaGlsZCIsInBhcnNlZEFnZ3JlZ2F0aW9uIiwicGFyc2VBZ2dyZWdhdGlvbiIsInBhcnNlZEFnZ3JlZ2F0aW9uS2V5IiwidmlzaXRDaGlsZE5vZGVzIiwiY3VycmVudENvbnRleHRQYXRoIiwiYmluZGluZ0NvbnRleHRzIiwiY29udGV4dFBhdGgiLCJvRGVmaW5pdGlvbkNvbnRleHRzIiwiYURlZmluaXRpb25Db250ZXh0c0tleXMiLCJjb250ZXh0UGF0aEluZGV4IiwiY29udGV4dFBhdGhEZWZpbml0aW9uIiwic3BsaWNlIiwic0F0dHJpYnV0ZU5hbWUiLCJiRG9Ob3RSZXNvbHZlIiwiaGFzQXR0cmlidXRlIiwib01ldGFkYXRhQ29udGV4dCIsIl9nZXRNZXRhZGF0YUNvbnRleHQiLCJhZGRTaW5nbGVDb250ZXh0Iiwib0RlZmluaXRpb25Qcm9wZXJ0aWVzIiwiYURlZmluaXRpb25Qcm9wZXJ0aWVzS2V5cyIsInNLZXlWYWx1ZSIsImRlZXBDbG9uZSIsImRlZmF1bHRWYWx1ZSIsInZpc2l0QXR0cmlidXRlIiwiZ2V0TmFtZWRJdGVtIiwidlZhbHVlIiwic3RhcnRzV2l0aCIsIk51bWJlciIsIkxPR0dFUl9TQ09QRSIsIkRPTVBhcnNlckluc3RhbmNlIiwiRE9NUGFyc2VyIiwidmFsaWRhdGVNYWNyb01ldGFkYXRhQ29udGV4dCIsIm9Db250ZXh0U2V0dGluZ3MiLCJzS2V5Iiwib0NvbnRleHQiLCJvQ29udGV4dE9iamVjdCIsInJlcXVpcmVkIiwiRXJyb3IiLCIka2luZCIsIiRUeXBlIiwiYU1ldGFkYXRhQ29udGV4dEtleXMiLCJhUHJvcGVydGllcyIsIm9BdHRyaWJ1dGVOYW1lcyIsImlLZXkiLCJvUHJvcGVydHlTZXR0aW5ncyIsIndhcm5pbmciLCJTQVBfVUlfQ09SRV9FTEVNRU5UIiwiYnVpbGRpbmdCbG9ja01ldGFkYXRhIiwib1Byb3BlcnRpZXMiLCJmb3VuZERlZmF1bHRBZ2dyZWdhdGlvbiIsInNQcm9wZXJ0eU5hbWUiLCJldmVudHMiLCJzRXZlbnROYW1lIiwiaXNEZWZhdWx0IiwiX2NoZWNrQWJzb2x1dGVBbmRDb250ZXh0UGF0aHMiLCJzTWV0YVBhdGgiLCJlbmRzV2l0aCIsIm1vZGVsIiwiX2NyZWF0ZUluaXRpYWxNZXRhZGF0YUNvbnRleHQiLCJyZXR1cm5Db250ZXh0IiwiZW50aXR5U2V0IiwiQmluZGluZ1BhcnNlciIsImNvbXBsZXhQYXJzZXIiLCJnZXRDb250ZXh0Iiwib0FnZ3JlZ2F0aW9uIiwiY2hpbGRLZXkiLCJzZXRBdHRyaWJ1dGUiLCJrZXkiLCJwb3NpdGlvbiIsInBsYWNlbWVudCIsImFuY2hvciIsIm9NZXRhZGF0YUFnZ3JlZ2F0aW9ucyIsIm9BZ2dyZWdhdGlvbkVsZW1lbnQiLCJyZXBsYWNlIiwib0VsZW1lbnRDaGlsZCIsInNTbG90TmFtZSIsIm9UYXJnZXRFbGVtZW50IiwicXVlcnlTZWxlY3RvciIsIm9DdHgiLCJtU2V0dGluZyIsImV4IiwicmVnaXN0ZXJCdWlsZGluZ0Jsb2NrIiwiWE1MUHJlcHJvY2Vzc29yIiwicGx1Z0luIiwieG1sVGFnIiwicHVibGljTmFtZXNwYWNlIiwiZXJyb3JNZXNzYWdlcyIsInhtbEZyYWdtZW50IiwiYWRkaXRpb25hbERhdGEiLCJlcnJvckxhYmVscyIsIm1hcCIsImVycm9yTWVzc2FnZSIsInhtbCIsImVzY2FwZVhNTEF0dHJpYnV0ZVZhbHVlIiwiZXJyb3JTdGFjayIsInN0YWNrRm9ybWF0dGVkIiwiYnRvYSIsImFkZGl0aW9uYWxUZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsInJlcGxhY2VBbGwiLCJwcm9wZXJ0eVVJRCIsInVpZCIsInhtbFN0cmluZyIsImFkZERlZmF1bHROYW1lc3BhY2VzIiwieG1sRG9jdW1lbnQiLCJwYXJzZUZyb21TdHJpbmciLCJvdXRwdXQiLCJyZW5kZXJJblRyYWNlTW9kZSIsIm91dFN0ciIsInhtbFJlc3VsdCIsImlubmVyVGV4dCIsImlubmVySFRNTCIsInNwbGl0Iiwic3RyaW5ncyIsImlzQXJyYXkiLCJmbGF0Iiwiam9pbiIsInZhbHVlZm4iLCJfdHlwZSIsImNvbXBpbGVkRXhwcmVzc2lvbiIsImNvbXBpbGVFeHByZXNzaW9uIiwicHJvcGVydHlVSWQiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkJ1aWxkaW5nQmxvY2tSdW50aW1lLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IGRlZXBDbG9uZSBmcm9tIFwic2FwL2Jhc2UvdXRpbC9kZWVwQ2xvbmVcIjtcbmltcG9ydCB1aWQgZnJvbSBcInNhcC9iYXNlL3V0aWwvdWlkXCI7XG5pbXBvcnQgQXR0cmlidXRlTW9kZWwgZnJvbSBcInNhcC9mZS9jb3JlL2J1aWxkaW5nQmxvY2tzL0F0dHJpYnV0ZU1vZGVsXCI7XG5pbXBvcnQgdHlwZSB7XG5cdEJ1aWxkaW5nQmxvY2tBZ2dyZWdhdGlvbkRlZmluaXRpb24sXG5cdEJ1aWxkaW5nQmxvY2tCYXNlLFxuXHRCdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbixcblx0QnVpbGRpbmdCbG9ja0RlZmluaXRpb25WMSxcblx0QnVpbGRpbmdCbG9ja01ldGFkYXRhLFxuXHRCdWlsZGluZ0Jsb2NrTWV0YWRhdGFDb250ZXh0RGVmaW5pdGlvbixcblx0QnVpbGRpbmdCbG9ja1Byb3BlcnR5RGVmaW5pdGlvblxufSBmcm9tIFwic2FwL2ZlL2NvcmUvYnVpbGRpbmdCbG9ja3MvQnVpbGRpbmdCbG9ja1wiO1xuaW1wb3J0IHsgY29tcGlsZUV4cHJlc3Npb24gfSBmcm9tIFwic2FwL2ZlL2NvcmUvaGVscGVycy9CaW5kaW5nVG9vbGtpdFwiO1xuaW1wb3J0IFJlc291cmNlTW9kZWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvUmVzb3VyY2VNb2RlbFwiO1xuaW1wb3J0IEJpbmRpbmdQYXJzZXIgZnJvbSBcInNhcC91aS9iYXNlL0JpbmRpbmdQYXJzZXJcIjtcbmltcG9ydCBYTUxQcmVwcm9jZXNzb3IgZnJvbSBcInNhcC91aS9jb3JlL3V0aWwvWE1MUHJlcHJvY2Vzc29yXCI7XG5pbXBvcnQgdHlwZSBDb250ZXh0IGZyb20gXCJzYXAvdWkvbW9kZWwvQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgSlNPTk1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvanNvbi9KU09OTW9kZWxcIjtcbmltcG9ydCBUcmFjZUluZm8gZnJvbSBcIi4vVHJhY2VJbmZvXCI7XG5cbmNvbnN0IExPR0dFUl9TQ09QRSA9IFwic2FwLmZlLmNvcmUuYnVpbGRpbmdCbG9ja3MuQnVpbGRpbmdCbG9ja1J1bnRpbWVcIjtcbmNvbnN0IERPTVBhcnNlckluc3RhbmNlID0gbmV3IERPTVBhcnNlcigpO1xubGV0IGlzVHJhY2VNb2RlID0gZmFsc2U7XG5cbnR5cGUgUmVzb2x2ZWRCdWlsZGluZ0Jsb2NrTWV0YWRhdGEgPSB7XG5cdHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIEJ1aWxkaW5nQmxvY2tQcm9wZXJ0eURlZmluaXRpb24+O1xuXHRhZ2dyZWdhdGlvbnM6IFJlY29yZDxzdHJpbmcsIEJ1aWxkaW5nQmxvY2tBZ2dyZWdhdGlvbkRlZmluaXRpb24+O1xuXHRtZXRhZGF0YUNvbnRleHRzOiBSZWNvcmQ8c3RyaW5nLCBCdWlsZGluZ0Jsb2NrTWV0YWRhdGFDb250ZXh0RGVmaW5pdGlvbj47XG5cdGlzT3BlbjogYm9vbGVhbjtcblx0ZGVmYXVsdEFnZ3JlZ2F0aW9uPzogc3RyaW5nO1xufTtcblxuLyoqXG4gKiBEZWZpbml0aW9uIG9mIGEgbWV0YSBkYXRhIGNvbnRleHRcbiAqL1xudHlwZSBNZXRhRGF0YUNvbnRleHQgPSB7XG5cdG5hbWU/OiBzdHJpbmc7XG5cdG1vZGVsOiBzdHJpbmc7XG5cdHBhdGg6IHN0cmluZztcbn07XG5cbnR5cGUgSUNhbGxiYWNrID0ge1xuXHRnZXRTZXR0aW5ncygpOiBhbnk7XG5cdC8qKlxuXHQgKiBWaXNpdHMgdGhlIGdpdmVuIG5vZGUgYW5kIGVpdGhlciBwcm9jZXNzZXMgYSB0ZW1wbGF0ZSBpbnN0cnVjdGlvbiwgY2FsbHNcblx0ICogYSB2aXNpdG9yLCBvciBzaW1wbHkgY2FsbHMgYm90aCB7QGxpbmtcblx0ICogc2FwLnVpLmNvcmUudXRpbC5YTUxQcmVwcm9jZXNzb3IuSUNhbGxiYWNrLnZpc2l0QXR0cmlidXRlcyB2aXNpdEF0dHJpYnV0ZXN9XG5cdCAqIGFuZCB7QGxpbmsgc2FwLnVpLmNvcmUudXRpbC5YTUxQcmVwcm9jZXNzb3IuSUNhbGxiYWNrLnZpc2l0Q2hpbGROb2Rlc1xuXHQgKiB2aXNpdENoaWxkTm9kZXN9LlxuXHQgKlxuXHQgKiBAcGFyYW0ge05vZGV9IG9Ob2RlXG5cdCAqICAgVGhlIFhNTCBET00gbm9kZVxuXHQgKiBAcmV0dXJucyB7c2FwLnVpLmJhc2UuU3luY1Byb21pc2V9XG5cdCAqICAgQSB0aGVuYWJsZSB3aGljaCByZXNvbHZlcyB3aXRoIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gYXMgc29vbiBhcyB2aXNpdGluZ1xuXHQgKiAgIGlzIGRvbmUsIG9yIGlzIHJlamVjdGVkIHdpdGggYSBjb3JyZXNwb25kaW5nIGVycm9yIGlmIHZpc2l0aW5nIGZhaWxzXG5cdCAqL1xuXHR2aXNpdE5vZGUob05vZGU6IE5vZGUpOiBQcm9taXNlPHZvaWQ+O1xuXG5cdC8qKlxuXHQgKiBJbnNlcnRzIHRoZSBmcmFnbWVudCB3aXRoIHRoZSBnaXZlbiBuYW1lIGluIHBsYWNlIG9mIHRoZSBnaXZlbiBlbGVtZW50LiBMb2FkcyB0aGVcblx0ICogZnJhZ21lbnQsIHRha2VzIGNhcmUgb2YgY2FjaGluZyAoZm9yIHRoZSBjdXJyZW50IHByZS1wcm9jZXNzb3IgcnVuKSBhbmQgdmlzaXRzIHRoZVxuXHQgKiBmcmFnbWVudCdzIGNvbnRlbnQgb25jZSBpdCBoYXMgYmVlbiBpbXBvcnRlZCBpbnRvIHRoZSBlbGVtZW50J3Mgb3duZXIgZG9jdW1lbnQgYW5kXG5cdCAqIHB1dCBpbnRvIHBsYWNlLiBMb2FkaW5nIG9mIGZyYWdtZW50cyBpcyBhc3luY2hyb25vdXMgaWYgdGhlIHRlbXBsYXRlIHZpZXcgaXNcblx0ICogYXN5bmNocm9ub3VzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc0ZyYWdtZW50TmFtZVxuXHQgKiAgIHRoZSBmcmFnbWVudCdzIHJlc29sdmVkIG5hbWVcblx0ICogQHBhcmFtIHtFbGVtZW50fSBvRWxlbWVudFxuXHQgKiAgIHRoZSBYTUwgRE9NIGVsZW1lbnQsIGUuZy4gPHNhcC51aS5jb3JlOkZyYWdtZW50PiBvciA8Y29yZTpFeHRlbnNpb25Qb2ludD5cblx0ICogQHBhcmFtIHtzYXAudWkuY29yZS51dGlsLl93aXRofSBvV2l0aENvbnRyb2xcblx0ICogICB0aGUgcGFyZW50J3MgXCJ3aXRoXCIgY29udHJvbFxuXHQgKiBAcmV0dXJucyB7c2FwLnVpLmJhc2UuU3luY1Byb21pc2V9XG5cdCAqIEEgc3luYyBwcm9taXNlIHdoaWNoIHJlc29sdmVzIHdpdGggPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBhcyBzb29uIGFzIHRoZSBmcmFnbWVudFxuXHQgKiAgIGhhcyBiZWVuIGluc2VydGVkLCBvciBpcyByZWplY3RlZCB3aXRoIGEgY29ycmVzcG9uZGluZyBlcnJvciBpZiBsb2FkaW5nIG9yIHZpc2l0aW5nXG5cdCAqICAgZmFpbHMuXG5cdCAqL1xuXHRpbnNlcnRGcmFnbWVudChzRnJhZ21lbnQ6IHN0cmluZywgb0VsZW1lbnQ6IEVsZW1lbnQsIG9XaXRoPzogYW55KTogUHJvbWlzZTx2b2lkPjtcblx0dmlzaXRBdHRyaWJ1dGUob05vZGU6IEVsZW1lbnQsIG9BdHRyaWJ1dGU6IEF0dHIpOiBQcm9taXNlPHZvaWQ+O1xuXHR2aXNpdENoaWxkTm9kZXMob05vZGU6IE5vZGUpOiBQcm9taXNlPHZvaWQ+O1xuXHQvKipcblx0ICogSW50ZXJwcmV0cyB0aGUgZ2l2ZW4gWE1MIERPTSBhdHRyaWJ1dGUgdmFsdWUgYXMgYSBiaW5kaW5nIGFuZCByZXR1cm5zIHRoZVxuXHQgKiByZXN1bHRpbmcgdmFsdWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzVmFsdWVcblx0ICogICBBbiBYTUwgRE9NIGF0dHJpYnV0ZSB2YWx1ZVxuXHQgKiBAcGFyYW0ge0VsZW1lbnR9IFtvRWxlbWVudF1cblx0ICogICBUaGUgWE1MIERPTSBlbGVtZW50IHRoZSBhdHRyaWJ1dGUgdmFsdWUgYmVsb25ncyB0byAobmVlZGVkIG9ubHkgZm9yXG5cdCAqICAgd2FybmluZ3Mgd2hpY2ggYXJlIGxvZ2dlZCB0byB0aGUgY29uc29sZSlcblx0ICogQHJldHVybnMge3NhcC51aS5iYXNlLlN5bmNQcm9taXNlfG51bGx9XG5cdCAqICAgQSB0aGVuYWJsZSB3aGljaCByZXNvbHZlcyB3aXRoIHRoZSByZXN1bHRpbmcgdmFsdWUsIG9yIGlzIHJlamVjdGVkIHdpdGggYVxuXHQgKiAgIGNvcnJlc3BvbmRpbmcgZXJyb3IgKGZvciBleGFtcGxlLCBhbiBlcnJvciB0aHJvd24gYnkgYSBmb3JtYXR0ZXIpIG9yXG5cdCAqICAgPGNvZGU+bnVsbDwvY29kZT4gaW4gY2FzZSB0aGUgYmluZGluZyBpcyBub3QgcmVhZHkgKGJlY2F1c2UgaXQgcmVmZXJzIHRvIGFcblx0ICogICBtb2RlbCB3aGljaCBpcyBub3QgYXZhaWxhYmxlKSAoc2luY2UgMS41Ny4wKVxuXHQgKi9cblx0Z2V0UmVzdWx0KHNWYWx1ZTogc3RyaW5nLCBlbGVtZW50PzogRWxlbWVudCk6IFByb21pc2U8YW55PiB8IG51bGw7XG5cdGdldENvbnRleHQoc1BhdGg6IHN0cmluZyk6IENvbnRleHQgfCB1bmRlZmluZWQ7XG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgY2FsbGJhY2sgaW50ZXJmYWNlIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gbWFwIG9mIHZhcmlhYmxlcyB3aGljaFxuXHQgKiBvdmVycmlkZSBjdXJyZW50bHkga25vd24gdmFyaWFibGVzIG9mIHRoZSBzYW1lIG5hbWUgaW4gPGNvZGU+dGhpczwvY29kZT5cblx0ICogcGFyZW50IGludGVyZmFjZSBvciByZXBsYWNlIHRoZW0gYWx0b2dldGhlci4gRWFjaCB2YXJpYWJsZSBuYW1lIGJlY29tZXMgYVxuXHQgKiBuYW1lZCBtb2RlbCB3aXRoIGEgY29ycmVzcG9uZGluZyBvYmplY3QgYmluZGluZyBhbmQgY2FuIGJlIHVzZWQgaW5zaWRlIHRoZVxuXHQgKiBYTUwgdGVtcGxhdGUgaW4gdGhlIHVzdWFsIHdheSwgdGhhdCBpcywgd2l0aCBhIGJpbmRpbmcgZXhwcmVzc2lvbiBsaWtlXG5cdCAqIDxjb2RlPlwie3Zhcj5zb21lL3JlbGF0aXZlL3BhdGh9XCI8L2NvZGU+IChzZWUgZXhhbXBsZSkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbbVZhcmlhYmxlcz17fV1cblx0ICogICBNYXAgZnJvbSB2YXJpYWJsZSBuYW1lIChzdHJpbmcpIHRvIHZhbHVlICh7QGxpbmsgc2FwLnVpLm1vZGVsLkNvbnRleHR9KVxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IFtiUmVwbGFjZV1cblx0ICogICBXaGV0aGVyIG9ubHkgdGhlIGdpdmVuIHZhcmlhYmxlcyBhcmUga25vd24gaW4gdGhlIG5ldyBjYWxsYmFjayBpbnRlcmZhY2Vcblx0ICogICBpbnN0YW5jZSwgbm8gaW5oZXJpdGVkIG9uZXNcblx0ICogQHJldHVybnMge3NhcC51aS5jb3JlLnV0aWwuWE1MUHJlcHJvY2Vzc29yLklDYWxsYmFja31cblx0ICogICBBIGNhbGxiYWNrIGludGVyZmFjZSBpbnN0YW5jZVxuXHQgKiBAcGFyYW0gbVZhcmlhYmxlc1xuXHQgKiBAcGFyYW0gYlJlcGxhY2Vcblx0ICovXG5cdFwid2l0aFwiKG1WYXJpYWJsZXM/OiBhbnksIGJSZXBsYWNlPzogYm9vbGVhbik6IElDYWxsYmFjaztcbn07XG5cbi8qKlxuICogVHlwZWd1YXJkIGZvciBjaGVja2luZyBpZiBhIGJ1aWxkaW5nIGJsb2NrIHVzZSBBUEkgMS5cbiAqXG4gKiBAcGFyYW0gYnVpbGRpbmdCbG9ja0RlZmluaXRpb25cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgYnVpbGRpbmcgYmxvY2sgaXMgdXNpbmcgQVBJIDEuXG4gKi9cbmZ1bmN0aW9uIGlzVjFNYWNyb0RlZihidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbjogQnVpbGRpbmdCbG9ja0RlZmluaXRpb24pOiBidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbiBpcyBCdWlsZGluZ0Jsb2NrRGVmaW5pdGlvblYxIHtcblx0cmV0dXJuIGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLmFwaVZlcnNpb24gPT09IHVuZGVmaW5lZCB8fCBidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5hcGlWZXJzaW9uID09PSAxO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVNYWNyb01ldGFkYXRhQ29udGV4dChcblx0c05hbWU6IHN0cmluZyxcblx0bUNvbnRleHRzOiBhbnksXG5cdG9Db250ZXh0U2V0dGluZ3M6IEJ1aWxkaW5nQmxvY2tNZXRhZGF0YUNvbnRleHREZWZpbml0aW9uLFxuXHRzS2V5OiBzdHJpbmdcbikge1xuXHRjb25zdCBvQ29udGV4dCA9IG1Db250ZXh0c1tzS2V5XTtcblx0Y29uc3Qgb0NvbnRleHRPYmplY3QgPSBvQ29udGV4dD8uZ2V0T2JqZWN0KCk7XG5cblx0aWYgKG9Db250ZXh0U2V0dGluZ3MucmVxdWlyZWQgPT09IHRydWUgJiYgKCFvQ29udGV4dCB8fCBvQ29udGV4dE9iamVjdCA9PT0gbnVsbCkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYCR7c05hbWV9OiBSZXF1aXJlZCBtZXRhZGF0YUNvbnRleHQgJyR7c0tleX0nIGlzIG1pc3NpbmdgKTtcblx0fSBlbHNlIGlmIChvQ29udGV4dE9iamVjdCkge1xuXHRcdC8vIElmIGNvbnRleHQgb2JqZWN0IGhhcyAka2luZCBwcm9wZXJ0eSwgJFR5cGUgc2hvdWxkIG5vdCBiZSBjaGVja2VkXG5cdFx0Ly8gVGhlcmVmb3JlIHJlbW92ZSBmcm9tIGNvbnRleHQgc2V0dGluZ3Ncblx0XHRpZiAob0NvbnRleHRPYmplY3QuaGFzT3duUHJvcGVydHkoXCIka2luZFwiKSAmJiBvQ29udGV4dFNldHRpbmdzLiRraW5kKSB7XG5cdFx0XHQvLyBDaGVjayBpZiB0aGUgJGtpbmQgaXMgcGFydCBvZiB0aGUgYWxsb3dlZCBvbmVzXG5cdFx0XHRpZiAob0NvbnRleHRTZXR0aW5ncy4ka2luZC5pbmRleE9mKG9Db250ZXh0T2JqZWN0W1wiJGtpbmRcIl0pID09PSAtMSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0YCR7c05hbWV9OiAnJHtzS2V5fScgbXVzdCBiZSAnJGtpbmQnICcke29Db250ZXh0U2V0dGluZ3NbXCIka2luZFwiXX0nIGJ1dCBpcyAnJHtcblx0XHRcdFx0XHRcdG9Db250ZXh0T2JqZWN0LiRraW5kXG5cdFx0XHRcdFx0fSc6ICR7b0NvbnRleHQuZ2V0UGF0aCgpfWBcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKG9Db250ZXh0T2JqZWN0Lmhhc093blByb3BlcnR5KFwiJFR5cGVcIikgJiYgb0NvbnRleHRTZXR0aW5ncy4kVHlwZSkge1xuXHRcdFx0Ly8gQ2hlY2sgb25seSAkVHlwZVxuXHRcdFx0aWYgKG9Db250ZXh0U2V0dGluZ3MuJFR5cGUuaW5kZXhPZihvQ29udGV4dE9iamVjdFtcIiRUeXBlXCJdKSA9PT0gLTEpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdGAke3NOYW1lfTogJyR7c0tleX0nIG11c3QgYmUgJyRUeXBlJyAnJHtvQ29udGV4dFNldHRpbmdzW1wiJFR5cGVcIl19JyBidXQgaXMgJyR7XG5cdFx0XHRcdFx0XHRvQ29udGV4dE9iamVjdC4kVHlwZVxuXHRcdFx0XHRcdH0nOiAke29Db250ZXh0LmdldFBhdGgoKX1gXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVNYWNyb1NpZ25hdHVyZShzTmFtZTogYW55LCBvTWV0YWRhdGE6IGFueSwgbUNvbnRleHRzOiBhbnksIG9Ob2RlOiBhbnkpIHtcblx0Y29uc3QgYU1ldGFkYXRhQ29udGV4dEtleXMgPSAob01ldGFkYXRhLm1ldGFkYXRhQ29udGV4dHMgJiYgT2JqZWN0LmtleXMob01ldGFkYXRhLm1ldGFkYXRhQ29udGV4dHMpKSB8fCBbXSxcblx0XHRhUHJvcGVydGllcyA9IChvTWV0YWRhdGEucHJvcGVydGllcyAmJiBPYmplY3Qua2V5cyhvTWV0YWRhdGEucHJvcGVydGllcykpIHx8IFtdLFxuXHRcdG9BdHRyaWJ1dGVOYW1lczogYW55ID0ge307XG5cblx0Ly8gY29sbGVjdCBhbGwgYXR0cmlidXRlcyB0byBmaW5kIHVuY2hlY2tlZCBwcm9wZXJ0aWVzXG5cdE9iamVjdC5rZXlzKG9Ob2RlLmF0dHJpYnV0ZXMpLmZvckVhY2goZnVuY3Rpb24gKGlLZXk6IHN0cmluZykge1xuXHRcdGNvbnN0IHNLZXkgPSBvTm9kZS5hdHRyaWJ1dGVzW2lLZXldLm5hbWU7XG5cdFx0b0F0dHJpYnV0ZU5hbWVzW3NLZXldID0gdHJ1ZTtcblx0fSk7XG5cblx0Ly9DaGVjayBtZXRhZGF0YUNvbnRleHRzXG5cdGFNZXRhZGF0YUNvbnRleHRLZXlzLmZvckVhY2goZnVuY3Rpb24gKHNLZXk6IGFueSkge1xuXHRcdGNvbnN0IG9Db250ZXh0U2V0dGluZ3MgPSBvTWV0YWRhdGEubWV0YWRhdGFDb250ZXh0c1tzS2V5XTtcblxuXHRcdHZhbGlkYXRlTWFjcm9NZXRhZGF0YUNvbnRleHQoc05hbWUsIG1Db250ZXh0cywgb0NvbnRleHRTZXR0aW5ncywgc0tleSk7XG5cdFx0ZGVsZXRlIG9BdHRyaWJ1dGVOYW1lc1tzS2V5XTtcblx0fSk7XG5cdC8vQ2hlY2sgcHJvcGVydGllc1xuXHRhUHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChzS2V5OiBhbnkpIHtcblx0XHRjb25zdCBvUHJvcGVydHlTZXR0aW5ncyA9IG9NZXRhZGF0YS5wcm9wZXJ0aWVzW3NLZXldO1xuXHRcdGlmICghb05vZGUuaGFzQXR0cmlidXRlKHNLZXkpKSB7XG5cdFx0XHRpZiAob1Byb3BlcnR5U2V0dGluZ3MucmVxdWlyZWQgJiYgIW9Qcm9wZXJ0eVNldHRpbmdzLmhhc093blByb3BlcnR5KFwiZGVmYXVsdFZhbHVlXCIpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgJHtzTmFtZX06IGAgKyBgUmVxdWlyZWQgcHJvcGVydHkgJyR7c0tleX0nIGlzIG1pc3NpbmdgKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVsZXRlIG9BdHRyaWJ1dGVOYW1lc1tzS2V5XTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIFVuY2hlY2tlZCBwcm9wZXJ0aWVzXG5cdE9iamVjdC5rZXlzKG9BdHRyaWJ1dGVOYW1lcykuZm9yRWFjaChmdW5jdGlvbiAoc0tleTogc3RyaW5nKSB7XG5cdFx0Ly8gbm8gY2hlY2sgZm9yIHByb3BlcnRpZXMgd2hpY2ggc3RhcnQgd2l0aCB1bmRlcnNjb3JlIFwiX1wiIG9yIGNvbnRhaW4gYSBjb2xvbiBcIjpcIiAoZGlmZmVyZW50IG5hbWVzcGFjZSksIGUuZy4geG1sbnM6dHJhY2UsIHRyYWNlOm1hY3JvSUQsIHVuaXR0ZXN0OmlkXG5cdFx0aWYgKHNLZXkuaW5kZXhPZihcIjpcIikgPCAwICYmICFzS2V5LnN0YXJ0c1dpdGgoXCJ4bWxuc1wiKSkge1xuXHRcdFx0TG9nLndhcm5pbmcoYFVuY2hlY2tlZCBwYXJhbWV0ZXI6ICR7c05hbWV9OiAke3NLZXl9YCwgdW5kZWZpbmVkLCBMT0dHRVJfU0NPUEUpO1xuXHRcdH1cblx0fSk7XG59XG5cbmNvbnN0IFNBUF9VSV9DT1JFX0VMRU1FTlQgPSBcInNhcC51aS5jb3JlLkVsZW1lbnRcIjtcblxuY29uc3QgU0FQX1VJX01PREVMX0NPTlRFWFQgPSBcInNhcC51aS5tb2RlbC5Db250ZXh0XCI7XG5cbi8qKlxuICogRW5zdXJlcyB0aGF0IHRoZSBtZXRhZGF0YSBmb3IgdGhlIGJ1aWxkaW5nIGJsb2NrIGFyZSBwcm9wZXJseSBkZWZpbmVkLlxuICpcbiAqIEBwYXJhbSBidWlsZGluZ0Jsb2NrTWV0YWRhdGEgVGhlIG1ldGFkYXRhIHJlY2VpdmVkIGZyb20gdGhlIGlucHV0XG4gKiBAcGFyYW0gaXNPcGVuIFdoZXRoZXIgdGhlIGJ1aWxkaW5nIGJsb2NrIGlzIG9wZW4gb3Igbm90XG4gKiBAcmV0dXJucyBBIHNldCBvZiBjb21wbGV0ZWQgbWV0YWRhdGEgZm9yIGZ1cnRoZXIgcHJvY2Vzc2luZ1xuICovXG5mdW5jdGlvbiBwcmVwYXJlTWV0YWRhdGEoYnVpbGRpbmdCbG9ja01ldGFkYXRhPzogQnVpbGRpbmdCbG9ja01ldGFkYXRhLCBpc09wZW4gPSBmYWxzZSk6IFJlc29sdmVkQnVpbGRpbmdCbG9ja01ldGFkYXRhIHtcblx0aWYgKGJ1aWxkaW5nQmxvY2tNZXRhZGF0YSkge1xuXHRcdGNvbnN0IG9Qcm9wZXJ0aWVzOiBhbnkgPSB7fTtcblx0XHRjb25zdCBvQWdncmVnYXRpb25zOiBhbnkgPSB7XG5cdFx0XHRcImRlcGVuZGVudHNcIjoge1xuXHRcdFx0XHR0eXBlOiBTQVBfVUlfQ09SRV9FTEVNRU5UXG5cdFx0XHR9LFxuXHRcdFx0XCJjdXN0b21EYXRhXCI6IHtcblx0XHRcdFx0dHlwZTogU0FQX1VJX0NPUkVfRUxFTUVOVFxuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3Qgb01ldGFkYXRhQ29udGV4dHM6IFJlY29yZDxzdHJpbmcsIEJ1aWxkaW5nQmxvY2tQcm9wZXJ0eURlZmluaXRpb24+ID0ge307XG5cdFx0bGV0IGZvdW5kRGVmYXVsdEFnZ3JlZ2F0aW9uO1xuXHRcdE9iamVjdC5rZXlzKGJ1aWxkaW5nQmxvY2tNZXRhZGF0YS5wcm9wZXJ0aWVzKS5mb3JFYWNoKGZ1bmN0aW9uIChzUHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcblx0XHRcdGlmIChidWlsZGluZ0Jsb2NrTWV0YWRhdGEucHJvcGVydGllc1tzUHJvcGVydHlOYW1lXS50eXBlICE9PSBTQVBfVUlfTU9ERUxfQ09OVEVYVCkge1xuXHRcdFx0XHRvUHJvcGVydGllc1tzUHJvcGVydHlOYW1lXSA9IGJ1aWxkaW5nQmxvY2tNZXRhZGF0YS5wcm9wZXJ0aWVzW3NQcm9wZXJ0eU5hbWVdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b01ldGFkYXRhQ29udGV4dHNbc1Byb3BlcnR5TmFtZV0gPSBidWlsZGluZ0Jsb2NrTWV0YWRhdGEucHJvcGVydGllc1tzUHJvcGVydHlOYW1lXTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQvLyBNZXJnZSBldmVudHMgaW50byBwcm9wZXJ0aWVzIGFzIHRoZXkgYXJlIGhhbmRsZWQgaWRlbnRpY2FsbHlcblx0XHRpZiAoYnVpbGRpbmdCbG9ja01ldGFkYXRhLmV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRPYmplY3Qua2V5cyhidWlsZGluZ0Jsb2NrTWV0YWRhdGEuZXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uIChzRXZlbnROYW1lOiBzdHJpbmcpIHtcblx0XHRcdFx0b1Byb3BlcnRpZXNbc0V2ZW50TmFtZV0gPSBidWlsZGluZ0Jsb2NrTWV0YWRhdGEuZXZlbnRzW3NFdmVudE5hbWVdO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmIChidWlsZGluZ0Jsb2NrTWV0YWRhdGEuYWdncmVnYXRpb25zICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdE9iamVjdC5rZXlzKGJ1aWxkaW5nQmxvY2tNZXRhZGF0YS5hZ2dyZWdhdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKHNQcm9wZXJ0eU5hbWU6IHN0cmluZykge1xuXHRcdFx0XHRvQWdncmVnYXRpb25zW3NQcm9wZXJ0eU5hbWVdID0gYnVpbGRpbmdCbG9ja01ldGFkYXRhLmFnZ3JlZ2F0aW9uc1tzUHJvcGVydHlOYW1lXTtcblx0XHRcdFx0aWYgKG9BZ2dyZWdhdGlvbnNbc1Byb3BlcnR5TmFtZV0uaXNEZWZhdWx0KSB7XG5cdFx0XHRcdFx0Zm91bmREZWZhdWx0QWdncmVnYXRpb24gPSBzUHJvcGVydHlOYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHtcblx0XHRcdHByb3BlcnRpZXM6IG9Qcm9wZXJ0aWVzLFxuXHRcdFx0YWdncmVnYXRpb25zOiBvQWdncmVnYXRpb25zLFxuXHRcdFx0ZGVmYXVsdEFnZ3JlZ2F0aW9uOiBmb3VuZERlZmF1bHRBZ2dyZWdhdGlvbixcblx0XHRcdG1ldGFkYXRhQ29udGV4dHM6IG9NZXRhZGF0YUNvbnRleHRzLFxuXHRcdFx0aXNPcGVuOiBpc09wZW5cblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB7XG5cdFx0XHRtZXRhZGF0YUNvbnRleHRzOiB7fSxcblx0XHRcdGFnZ3JlZ2F0aW9uczoge1xuXHRcdFx0XHRcImRlcGVuZGVudHNcIjoge1xuXHRcdFx0XHRcdHR5cGU6IFNBUF9VSV9DT1JFX0VMRU1FTlRcblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjdXN0b21EYXRhXCI6IHtcblx0XHRcdFx0XHR0eXBlOiBTQVBfVUlfQ09SRV9FTEVNRU5UXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRcdGlzT3BlbjogaXNPcGVuXG5cdFx0fTtcblx0fVxufVxuXG4vKipcbiAqIENoZWNrcyB0aGUgYWJzb2x1dGUgb3IgY29udGV4dCBwYXRocyBhbmQgcmV0dXJucyBhbiBhcHByb3ByaWF0ZSBNZXRhQ29udGV4dC5cbiAqXG4gKiBAcGFyYW0gb1NldHRpbmdzIEFkZGl0aW9uYWwgc2V0dGluZ3NcbiAqIEBwYXJhbSBzQXR0cmlidXRlVmFsdWUgVGhlIGF0dHJpYnV0ZSB2YWx1ZVxuICogQHJldHVybnMge01ldGFEYXRhQ29udGV4dH0gVGhlIG1ldGEgZGF0YSBjb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiBfY2hlY2tBYnNvbHV0ZUFuZENvbnRleHRQYXRocyhvU2V0dGluZ3M6IGFueSwgc0F0dHJpYnV0ZVZhbHVlOiBzdHJpbmcpOiBNZXRhRGF0YUNvbnRleHQge1xuXHRsZXQgc01ldGFQYXRoOiBzdHJpbmc7XG5cdGlmIChzQXR0cmlidXRlVmFsdWUgJiYgc0F0dHJpYnV0ZVZhbHVlLnN0YXJ0c1dpdGgoXCIvXCIpKSB7XG5cdFx0Ly8gYWJzb2x1dGUgcGF0aCAtIHdlIGp1c3QgdXNlIHRoaXMgb25lXG5cdFx0c01ldGFQYXRoID0gc0F0dHJpYnV0ZVZhbHVlO1xuXHR9IGVsc2Uge1xuXHRcdGxldCBzQ29udGV4dFBhdGggPSBvU2V0dGluZ3MuY3VycmVudENvbnRleHRQYXRoLmdldFBhdGgoKTtcblx0XHRpZiAoIXNDb250ZXh0UGF0aC5lbmRzV2l0aChcIi9cIikpIHtcblx0XHRcdHNDb250ZXh0UGF0aCArPSBcIi9cIjtcblx0XHR9XG5cdFx0c01ldGFQYXRoID0gc0NvbnRleHRQYXRoICsgc0F0dHJpYnV0ZVZhbHVlO1xuXHR9XG5cdHJldHVybiB7XG5cdFx0bW9kZWw6IFwibWV0YU1vZGVsXCIsXG5cdFx0cGF0aDogc01ldGFQYXRoXG5cdH07XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaGVscHMgdG8gY3JlYXRlIHRoZSBtZXRhZGF0YSBjb250ZXh0IGluIGNhc2UgaXQgaXMgbm90IHlldCBhdmFpbGFibGUgaW4gdGhlIHN0b3JlLlxuICpcbiAqIEBwYXJhbSBvU2V0dGluZ3MgQWRkaXRpb25hbCBzZXR0aW5nc1xuICogQHBhcmFtIHNBdHRyaWJ1dGVOYW1lIFRoZSBhdHRyaWJ1dGUgbmFtZVxuICogQHBhcmFtIHNBdHRyaWJ1dGVWYWx1ZSBUaGUgYXR0cmlidXRlIHZhbHVlXG4gKiBAcmV0dXJucyB7TWV0YURhdGFDb250ZXh0fSBUaGUgbWV0YSBkYXRhIGNvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIF9jcmVhdGVJbml0aWFsTWV0YWRhdGFDb250ZXh0KG9TZXR0aW5nczogYW55LCBzQXR0cmlidXRlTmFtZTogc3RyaW5nLCBzQXR0cmlidXRlVmFsdWU6IHN0cmluZyk6IE1ldGFEYXRhQ29udGV4dCB7XG5cdGxldCByZXR1cm5Db250ZXh0OiBNZXRhRGF0YUNvbnRleHQ7XG5cdGlmIChzQXR0cmlidXRlVmFsdWUuc3RhcnRzV2l0aChcIi91aWQtLVwiKSkge1xuXHRcdGNvbnN0IG9EYXRhID0gbXlTdG9yZVtzQXR0cmlidXRlVmFsdWVdO1xuXHRcdG9TZXR0aW5ncy5tb2RlbHMuY29udmVydGVyQ29udGV4dC5zZXRQcm9wZXJ0eShzQXR0cmlidXRlVmFsdWUsIG9EYXRhKTtcblx0XHRyZXR1cm5Db250ZXh0ID0ge1xuXHRcdFx0bW9kZWw6IFwiY29udmVydGVyQ29udGV4dFwiLFxuXHRcdFx0cGF0aDogc0F0dHJpYnV0ZVZhbHVlXG5cdFx0fTtcblx0fSBlbHNlIGlmICgoc0F0dHJpYnV0ZU5hbWUgPT09IFwibWV0YVBhdGhcIiAmJiBvU2V0dGluZ3MuY3VycmVudENvbnRleHRQYXRoKSB8fCBzQXR0cmlidXRlTmFtZSA9PT0gXCJjb250ZXh0UGF0aFwiKSB7XG5cdFx0cmV0dXJuQ29udGV4dCA9IF9jaGVja0Fic29sdXRlQW5kQ29udGV4dFBhdGhzKG9TZXR0aW5ncywgc0F0dHJpYnV0ZVZhbHVlKTtcblx0fSBlbHNlIGlmIChzQXR0cmlidXRlVmFsdWUgJiYgc0F0dHJpYnV0ZVZhbHVlLnN0YXJ0c1dpdGgoXCIvXCIpKSB7XG5cdFx0Ly8gYWJzb2x1dGUgcGF0aCAtIHdlIGp1c3QgdXNlIHRoaXMgb25lXG5cdFx0cmV0dXJuQ29udGV4dCA9IHtcblx0XHRcdG1vZGVsOiBcIm1ldGFNb2RlbFwiLFxuXHRcdFx0cGF0aDogc0F0dHJpYnV0ZVZhbHVlXG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm5Db250ZXh0ID0ge1xuXHRcdFx0bW9kZWw6IFwibWV0YU1vZGVsXCIsXG5cdFx0XHRwYXRoOiBvU2V0dGluZ3MuYmluZGluZ0NvbnRleHRzLmVudGl0eVNldCA/IG9TZXR0aW5ncy5iaW5kaW5nQ29udGV4dHMuZW50aXR5U2V0LmdldFBhdGgoc0F0dHJpYnV0ZVZhbHVlKSA6IHNBdHRyaWJ1dGVWYWx1ZVxuXHRcdH07XG5cdH1cblx0cmV0dXJuIHJldHVybkNvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIF9nZXRNZXRhZGF0YUNvbnRleHQoXG5cdG9TZXR0aW5nczogYW55LFxuXHRvTm9kZTogRWxlbWVudCxcblx0c0F0dHJpYnV0ZU5hbWU6IHN0cmluZyxcblx0b1Zpc2l0b3I6IElDYWxsYmFjayxcblx0YkRvTm90UmVzb2x2ZTogYm9vbGVhbixcblx0aXNPcGVuOiBib29sZWFuXG4pIHtcblx0bGV0IG9NZXRhZGF0YUNvbnRleHQ6IE1ldGFEYXRhQ29udGV4dCB8IHVuZGVmaW5lZDtcblx0aWYgKCFiRG9Ob3RSZXNvbHZlICYmIG9Ob2RlLmhhc0F0dHJpYnV0ZShzQXR0cmlidXRlTmFtZSkpIHtcblx0XHRjb25zdCBzQXR0cmlidXRlVmFsdWUgPSBvTm9kZS5nZXRBdHRyaWJ1dGUoc0F0dHJpYnV0ZU5hbWUpIGFzIHN0cmluZztcblx0XHRvTWV0YWRhdGFDb250ZXh0ID0gQmluZGluZ1BhcnNlci5jb21wbGV4UGFyc2VyKHNBdHRyaWJ1dGVWYWx1ZSk7XG5cdFx0aWYgKCFvTWV0YWRhdGFDb250ZXh0KSB7XG5cdFx0XHRvTWV0YWRhdGFDb250ZXh0ID0gX2NyZWF0ZUluaXRpYWxNZXRhZGF0YUNvbnRleHQob1NldHRpbmdzLCBzQXR0cmlidXRlTmFtZSwgc0F0dHJpYnV0ZVZhbHVlKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAob1NldHRpbmdzLmJpbmRpbmdDb250ZXh0cy5oYXNPd25Qcm9wZXJ0eShzQXR0cmlidXRlTmFtZSkpIHtcblx0XHRvTWV0YWRhdGFDb250ZXh0ID0ge1xuXHRcdFx0bW9kZWw6IHNBdHRyaWJ1dGVOYW1lLFxuXHRcdFx0cGF0aDogXCJcIlxuXHRcdH07XG5cdH0gZWxzZSBpZiAoaXNPcGVuKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGlmIChvVmlzaXRvci5nZXRDb250ZXh0KGAke3NBdHRyaWJ1dGVOYW1lfT5gKSkge1xuXHRcdFx0XHRvTWV0YWRhdGFDb250ZXh0ID0ge1xuXHRcdFx0XHRcdG1vZGVsOiBzQXR0cmlidXRlTmFtZSxcblx0XHRcdFx0XHRwYXRoOiBcIlwiXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9NZXRhZGF0YUNvbnRleHQ7XG59XG5cbi8qKlxuICogUGFyc2UgdGhlIGluY29taW5nIFhNTCBub2RlIGFuZCB0cnkgdG8gcmVzb2x2ZSB0aGUgcHJvcGVydGllcyBkZWZpbmVkIHRoZXJlLlxuICpcbiAqIEBwYXJhbSBvTWV0YWRhdGEgVGhlIG1ldGFkYXRhIGZvciB0aGUgYnVpbGRpbmcgYmxvY2tcbiAqIEBwYXJhbSBvTm9kZSBUaGUgWE1MIG5vZGUgdG8gcGFyc2VcbiAqIEBwYXJhbSBpc1B1YmxpYyBXaGV0aGVyIHRoZSBidWlsZGluZyBibG9jayBpcyB1c2VkIGluIGEgcHVibGljIGNvbnRleHQgb3Igbm90XG4gKiBAcGFyYW0gb1Zpc2l0b3IgVGhlIHZpc2l0b3IgaW5zdGFuY2VcbiAqIEBwYXJhbSBhcGlWZXJzaW9uIFRoZSBBUEkgdmVyc2lvbiBvZiB0aGUgYnVpbGRpbmcgYmxvY2tcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc1Byb3BlcnRpZXMoXG5cdG9NZXRhZGF0YTogUmVzb2x2ZWRCdWlsZGluZ0Jsb2NrTWV0YWRhdGEsXG5cdG9Ob2RlOiBFbGVtZW50LFxuXHRpc1B1YmxpYzogYm9vbGVhbixcblx0b1Zpc2l0b3I6IElDYWxsYmFjayxcblx0YXBpVmVyc2lvbj86IG51bWJlclxuKSB7XG5cdGNvbnN0IG9EZWZpbml0aW9uUHJvcGVydGllcyA9IG9NZXRhZGF0YS5wcm9wZXJ0aWVzO1xuXG5cdC8vIFJldHJpZXZlIHByb3BlcnRpZXMgdmFsdWVzXG5cdGNvbnN0IGFEZWZpbml0aW9uUHJvcGVydGllc0tleXMgPSBPYmplY3Qua2V5cyhvRGVmaW5pdGlvblByb3BlcnRpZXMpO1xuXG5cdGNvbnN0IHByb3BlcnR5VmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge307XG5cdGZvciAoY29uc3Qgc0tleVZhbHVlIG9mIGFEZWZpbml0aW9uUHJvcGVydGllc0tleXMpIHtcblx0XHRpZiAob0RlZmluaXRpb25Qcm9wZXJ0aWVzW3NLZXlWYWx1ZV0udHlwZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0cHJvcGVydHlWYWx1ZXNbc0tleVZhbHVlXSA9IGRlZXBDbG9uZShvRGVmaW5pdGlvblByb3BlcnRpZXNbc0tleVZhbHVlXS5kZWZhdWx0VmFsdWUgfHwge30pOyAvLyBUbyBhdm9pZCB2YWx1ZXMgYmVpbmcgcmV1c2VkIGFjcm9zcyBtYWNyb3Ncblx0XHR9IGVsc2Uge1xuXHRcdFx0cHJvcGVydHlWYWx1ZXNbc0tleVZhbHVlXSA9IG9EZWZpbml0aW9uUHJvcGVydGllc1tzS2V5VmFsdWVdLmRlZmF1bHRWYWx1ZTtcblx0XHR9XG5cdFx0aWYgKG9Ob2RlLmhhc0F0dHJpYnV0ZShzS2V5VmFsdWUpICYmIGlzUHVibGljICYmIG9EZWZpbml0aW9uUHJvcGVydGllc1tzS2V5VmFsdWVdLmlzUHVibGljID09PSBmYWxzZSkge1xuXHRcdFx0TG9nLmVycm9yKGBQcm9wZXJ0eSAke3NLZXlWYWx1ZX0gd2FzIGlnbm9yZWQgYXMgaXQgaXMgbm90IGludGVuZGVkIGZvciBwdWJsaWMgdXNhZ2VgKTtcblx0XHR9IGVsc2UgaWYgKG9Ob2RlLmhhc0F0dHJpYnV0ZShzS2V5VmFsdWUpKSB7XG5cdFx0XHRhd2FpdCBvVmlzaXRvci52aXNpdEF0dHJpYnV0ZShvTm9kZSwgb05vZGUuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oc0tleVZhbHVlKSBhcyBBdHRyKTtcblx0XHRcdGxldCB2VmFsdWU6IGFueSA9IG9Ob2RlLmdldEF0dHJpYnV0ZShzS2V5VmFsdWUpO1xuXHRcdFx0aWYgKHZWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGlmIChhcGlWZXJzaW9uID09PSAyICYmIHR5cGVvZiB2VmFsdWUgPT09IFwic3RyaW5nXCIgJiYgIXZWYWx1ZS5zdGFydHNXaXRoKFwie1wiKSkge1xuXHRcdFx0XHRcdHN3aXRjaCAob0RlZmluaXRpb25Qcm9wZXJ0aWVzW3NLZXlWYWx1ZV0udHlwZSkge1xuXHRcdFx0XHRcdFx0Y2FzZSBcImJvb2xlYW5cIjpcblx0XHRcdFx0XHRcdFx0dlZhbHVlID0gdlZhbHVlID09PSBcInRydWVcIjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIFwibnVtYmVyXCI6XG5cdFx0XHRcdFx0XHRcdHZWYWx1ZSA9IE51bWJlcih2VmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHJvcGVydHlWYWx1ZXNbc0tleVZhbHVlXSA9IHZWYWx1ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHByb3BlcnR5VmFsdWVzO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBpbmNvbWluZyBYTUwgbm9kZSBhbmQgdHJ5IHRvIHJlc29sdmUgdGhlIGJpbmRpbmcgY29udGV4dHMgZGVmaW5lZCBpbnNpZGUuXG4gKlxuICogQHBhcmFtIG9NZXRhZGF0YSBUaGUgbWV0YWRhdGEgZm9yIHRoZSBidWlsZGluZyBibG9ja1xuICogQHBhcmFtIG9TZXR0aW5ncyBUaGUgc2V0dGluZ3Mgb2JqZWN0XG4gKiBAcGFyYW0gb05vZGUgVGhlIFhNTCBub2RlIHRvIHBhcnNlXG4gKiBAcGFyYW0gaXNQdWJsaWMgV2hldGhlciB0aGUgYnVpbGRpbmcgYmxvY2sgaXMgdXNlZCBpbiBhIHB1YmxpYyBjb250ZXh0IG9yIG5vdFxuICogQHBhcmFtIG9WaXNpdG9yIFRoZSB2aXNpdG9yIGluc3RhbmNlXG4gKiBAcGFyYW0gbUNvbnRleHRzIFRoZSBjb250ZXh0cyB0byBiZSB1c2VkXG4gKiBAcGFyYW0gb01ldGFkYXRhQ29udGV4dHNcdFRoZSBtZXRhZGF0YSBjb250ZXh0cyB0byBiZSB1c2VkXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NDb250ZXh0cyhcblx0b01ldGFkYXRhOiBSZXNvbHZlZEJ1aWxkaW5nQmxvY2tNZXRhZGF0YSxcblx0b1NldHRpbmdzOiBhbnksXG5cdG9Ob2RlOiBFbGVtZW50LFxuXHRpc1B1YmxpYzogYm9vbGVhbixcblx0b1Zpc2l0b3I6IElDYWxsYmFjayxcblx0bUNvbnRleHRzOiBhbnksXG5cdG9NZXRhZGF0YUNvbnRleHRzOiBhbnlcbikge1xuXHRvU2V0dGluZ3MuY3VycmVudENvbnRleHRQYXRoID0gb1NldHRpbmdzLmJpbmRpbmdDb250ZXh0cy5jb250ZXh0UGF0aDtcblx0Y29uc3QgbU1pc3NpbmdDb250ZXh0OiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9O1xuXHRjb25zdCBwcm9wZXJ0eVZhbHVlczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRjb25zdCBvRGVmaW5pdGlvbkNvbnRleHRzID0gb01ldGFkYXRhLm1ldGFkYXRhQ29udGV4dHM7XG5cdGNvbnN0IGFEZWZpbml0aW9uQ29udGV4dHNLZXlzID0gT2JqZWN0LmtleXMob0RlZmluaXRpb25Db250ZXh0cyk7XG5cdC8vIFNpbmNlIHRoZSBtZXRhUGF0aCBhbmQgb3RoZXIgcHJvcGVydHkgY2FuIGJlIHJlbGF0aXZlIHRvIHRoZSBjb250ZXh0UGF0aCB3ZSBuZWVkIHRvIGV2YWx1YXRlIHRoZSBjdXJyZW50IGNvbnRleHRQYXRoIGZpcnN0XG5cdGNvbnN0IGNvbnRleHRQYXRoSW5kZXggPSBhRGVmaW5pdGlvbkNvbnRleHRzS2V5cy5pbmRleE9mKFwiY29udGV4dFBhdGhcIik7XG5cdGlmIChjb250ZXh0UGF0aEluZGV4ICE9PSAtMSkge1xuXHRcdC8vIElmIGl0IGlzIGRlZmluZWQgd2UgZXh0cmFjdCBpdCBhbmQgcmVpbnNlcnQgaXQgaW4gdGhlIGZpcnN0IHBvc2l0aW9uIG9mIHRoZSBhcnJheVxuXHRcdGNvbnN0IGNvbnRleHRQYXRoRGVmaW5pdGlvbiA9IGFEZWZpbml0aW9uQ29udGV4dHNLZXlzLnNwbGljZShjb250ZXh0UGF0aEluZGV4LCAxKTtcblx0XHRhRGVmaW5pdGlvbkNvbnRleHRzS2V5cy5zcGxpY2UoMCwgMCwgY29udGV4dFBhdGhEZWZpbml0aW9uWzBdKTtcblx0fVxuXHRmb3IgKGNvbnN0IHNBdHRyaWJ1dGVOYW1lIG9mIGFEZWZpbml0aW9uQ29udGV4dHNLZXlzKSB7XG5cdFx0Y29uc3QgYkRvTm90UmVzb2x2ZSA9IGlzUHVibGljICYmIG9EZWZpbml0aW9uQ29udGV4dHNbc0F0dHJpYnV0ZU5hbWVdLmlzUHVibGljID09PSBmYWxzZSAmJiBvTm9kZS5oYXNBdHRyaWJ1dGUoc0F0dHJpYnV0ZU5hbWUpO1xuXHRcdGNvbnN0IG9NZXRhZGF0YUNvbnRleHQgPSBfZ2V0TWV0YWRhdGFDb250ZXh0KG9TZXR0aW5ncywgb05vZGUsIHNBdHRyaWJ1dGVOYW1lLCBvVmlzaXRvciwgYkRvTm90UmVzb2x2ZSwgb01ldGFkYXRhLmlzT3Blbik7XG5cdFx0aWYgKG9NZXRhZGF0YUNvbnRleHQpIHtcblx0XHRcdG9NZXRhZGF0YUNvbnRleHQubmFtZSA9IHNBdHRyaWJ1dGVOYW1lO1xuXHRcdFx0YWRkU2luZ2xlQ29udGV4dChtQ29udGV4dHMsIG9WaXNpdG9yLCBvTWV0YWRhdGFDb250ZXh0LCBvTWV0YWRhdGFDb250ZXh0cyk7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdChzQXR0cmlidXRlTmFtZSA9PT0gXCJlbnRpdHlTZXRcIiB8fCBzQXR0cmlidXRlTmFtZSA9PT0gXCJjb250ZXh0UGF0aFwiKSAmJlxuXHRcdFx0XHQhb1NldHRpbmdzLmJpbmRpbmdDb250ZXh0cy5oYXNPd25Qcm9wZXJ0eShzQXR0cmlidXRlTmFtZSlcblx0XHRcdCkge1xuXHRcdFx0XHRvU2V0dGluZ3MuYmluZGluZ0NvbnRleHRzW3NBdHRyaWJ1dGVOYW1lXSA9IG1Db250ZXh0c1tzQXR0cmlidXRlTmFtZV07XG5cdFx0XHR9XG5cdFx0XHRpZiAoc0F0dHJpYnV0ZU5hbWUgPT09IFwiY29udGV4dFBhdGhcIikge1xuXHRcdFx0XHRvU2V0dGluZ3MuY3VycmVudENvbnRleHRQYXRoID0gbUNvbnRleHRzW3NBdHRyaWJ1dGVOYW1lXTtcblx0XHRcdH1cblx0XHRcdHByb3BlcnR5VmFsdWVzW3NBdHRyaWJ1dGVOYW1lXSA9IG1Db250ZXh0c1tzQXR0cmlidXRlTmFtZV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1NaXNzaW5nQ29udGV4dFtzQXR0cmlidXRlTmFtZV0gPSB0cnVlO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4geyBtTWlzc2luZ0NvbnRleHQsIHByb3BlcnR5VmFsdWVzOiBwcm9wZXJ0eVZhbHVlcyB9O1xufVxuZnVuY3Rpb24gcGFyc2VBZ2dyZWdhdGlvbihvQWdncmVnYXRpb24/OiBFbGVtZW50KSB7XG5cdGNvbnN0IG9PdXRPYmplY3RzOiBhbnkgPSB7fTtcblx0aWYgKG9BZ2dyZWdhdGlvbiAmJiBvQWdncmVnYXRpb24uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuXHRcdGNvbnN0IGNoaWxkcmVuID0gb0FnZ3JlZ2F0aW9uLmNoaWxkcmVuO1xuXHRcdGZvciAobGV0IGNoaWxkSWR4ID0gMDsgY2hpbGRJZHggPCBjaGlsZHJlbi5sZW5ndGg7IGNoaWxkSWR4KyspIHtcblx0XHRcdGNvbnN0IGNoaWxkRGVmaW5pdGlvbiA9IGNoaWxkcmVuW2NoaWxkSWR4XTtcblx0XHRcdGxldCBjaGlsZEtleSA9IGNoaWxkRGVmaW5pdGlvbi5nZXRBdHRyaWJ1dGUoXCJrZXlcIikgfHwgY2hpbGREZWZpbml0aW9uLmdldEF0dHJpYnV0ZShcImlkXCIpO1xuXHRcdFx0aWYgKGNoaWxkS2V5KSB7XG5cdFx0XHRcdGNoaWxkS2V5ID0gYElubGluZVhNTF8ke2NoaWxkS2V5fWA7XG5cdFx0XHRcdGNoaWxkRGVmaW5pdGlvbi5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgY2hpbGRLZXkpO1xuXHRcdFx0XHRvT3V0T2JqZWN0c1tjaGlsZEtleV0gPSB7XG5cdFx0XHRcdFx0a2V5OiBjaGlsZEtleSxcblx0XHRcdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHRcdFx0cGxhY2VtZW50OiBjaGlsZERlZmluaXRpb24uZ2V0QXR0cmlidXRlKFwicGxhY2VtZW50XCIpLFxuXHRcdFx0XHRcdFx0YW5jaG9yOiBjaGlsZERlZmluaXRpb24uZ2V0QXR0cmlidXRlKFwiYW5jaG9yXCIpXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR0eXBlOiBcIlNsb3RcIlxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gb091dE9iamVjdHM7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NDaGlsZHJlbihcblx0b05vZGU6IEVsZW1lbnQsXG5cdG9WaXNpdG9yOiBJQ2FsbGJhY2ssXG5cdG9NZXRhZGF0YTogUmVzb2x2ZWRCdWlsZGluZ0Jsb2NrTWV0YWRhdGEsXG5cdGlzUHVibGljOiBib29sZWFuLFxuXHRwcm9wZXJ0eVZhbHVlczogUmVjb3JkPHN0cmluZywgYW55Pixcblx0YXBpVmVyc2lvbj86IG51bWJlclxuKSB7XG5cdGNvbnN0IG9BZ2dyZWdhdGlvbnM6IGFueSA9IHt9O1xuXHRpZiAob05vZGUuZmlyc3RFbGVtZW50Q2hpbGQgIT09IG51bGwpIHtcblx0XHRsZXQgb0ZpcnN0RWxlbWVudENoaWxkOiBFbGVtZW50IHwgbnVsbCA9IG9Ob2RlLmZpcnN0RWxlbWVudENoaWxkIGFzIEVsZW1lbnQgfCBudWxsO1xuXHRcdGlmIChhcGlWZXJzaW9uID09PSAyKSB7XG5cdFx0XHR3aGlsZSAob0ZpcnN0RWxlbWVudENoaWxkICE9PSBudWxsKSB7XG5cdFx0XHRcdGNvbnN0IHNDaGlsZE5hbWUgPSBvRmlyc3RFbGVtZW50Q2hpbGQubG9jYWxOYW1lO1xuXHRcdFx0XHRsZXQgc0FnZ3JlZ2F0aW9uTmFtZSA9IHNDaGlsZE5hbWU7XG5cdFx0XHRcdGlmIChzQWdncmVnYXRpb25OYW1lWzBdLnRvVXBwZXJDYXNlKCkgPT09IHNBZ2dyZWdhdGlvbk5hbWVbMF0pIHtcblx0XHRcdFx0XHQvLyBub3QgYSBzdWIgYWdncmVnYXRpb24sIGdvIGJhY2sgdG8gZGVmYXVsdCBBZ2dyZWdhdGlvblxuXHRcdFx0XHRcdHNBZ2dyZWdhdGlvbk5hbWUgPSBvTWV0YWRhdGEuZGVmYXVsdEFnZ3JlZ2F0aW9uIHx8IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgYWdncmVnYXRpb25EZWZpbml0aW9uID0gb01ldGFkYXRhLmFnZ3JlZ2F0aW9uc1tzQWdncmVnYXRpb25OYW1lXTtcblx0XHRcdFx0aWYgKGFnZ3JlZ2F0aW9uRGVmaW5pdGlvbiAhPT0gdW5kZWZpbmVkICYmICFhZ2dyZWdhdGlvbkRlZmluaXRpb24uc2xvdCkge1xuXHRcdFx0XHRcdGNvbnN0IHBhcnNlZEFnZ3JlZ2F0aW9uID0gcGFyc2VBZ2dyZWdhdGlvbihvRmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRcdFx0XHRcdG9BZ2dyZWdhdGlvbnNbc0FnZ3JlZ2F0aW9uTmFtZV0gPSBwYXJzZWRBZ2dyZWdhdGlvbjtcblx0XHRcdFx0XHRmb3IgKGNvbnN0IHBhcnNlZEFnZ3JlZ2F0aW9uS2V5IGluIHBhcnNlZEFnZ3JlZ2F0aW9uKSB7XG5cdFx0XHRcdFx0XHRvTWV0YWRhdGEuYWdncmVnYXRpb25zW3BhcnNlZEFnZ3JlZ2F0aW9uS2V5XSA9IHBhcnNlZEFnZ3JlZ2F0aW9uW3BhcnNlZEFnZ3JlZ2F0aW9uS2V5XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0b0ZpcnN0RWxlbWVudENoaWxkID0gb0ZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoYXBpVmVyc2lvbiAhPT0gMikge1xuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIGFnZ3JlZ2F0aW9uIHdlIG5lZWQgdG8gdmlzaXQgdGhlIGNoaWxkTm9kZXMgdG8gcmVzb2x2ZSB0ZW1wbGF0aW5nIGluc3RydWN0aW9uc1xuXHRcdFx0YXdhaXQgb1Zpc2l0b3IudmlzaXRDaGlsZE5vZGVzKG9Ob2RlKTtcblx0XHR9XG5cdFx0b0ZpcnN0RWxlbWVudENoaWxkID0gb05vZGUuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cdFx0d2hpbGUgKG9GaXJzdEVsZW1lbnRDaGlsZCAhPT0gbnVsbCkge1xuXHRcdFx0Y29uc3Qgb05leHRDaGlsZDogRWxlbWVudCB8IG51bGwgPSBvRmlyc3RFbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFx0Y29uc3Qgc0NoaWxkTmFtZSA9IG9GaXJzdEVsZW1lbnRDaGlsZC5sb2NhbE5hbWU7XG5cdFx0XHRsZXQgc0FnZ3JlZ2F0aW9uTmFtZSA9IHNDaGlsZE5hbWU7XG5cdFx0XHRpZiAoc0FnZ3JlZ2F0aW9uTmFtZVswXS50b1VwcGVyQ2FzZSgpID09PSBzQWdncmVnYXRpb25OYW1lWzBdKSB7XG5cdFx0XHRcdC8vIG5vdCBhIHN1YiBhZ2dyZWdhdGlvbiwgZ28gYmFjayB0byBkZWZhdWx0IEFnZ3JlZ2F0aW9uXG5cdFx0XHRcdHNBZ2dyZWdhdGlvbk5hbWUgPSBvTWV0YWRhdGEuZGVmYXVsdEFnZ3JlZ2F0aW9uIHx8IFwiXCI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoXG5cdFx0XHRcdE9iamVjdC5rZXlzKG9NZXRhZGF0YS5hZ2dyZWdhdGlvbnMpLmluZGV4T2Yoc0FnZ3JlZ2F0aW9uTmFtZSkgIT09IC0xICYmXG5cdFx0XHRcdCghaXNQdWJsaWMgfHwgb01ldGFkYXRhLmFnZ3JlZ2F0aW9uc1tzQWdncmVnYXRpb25OYW1lXS5pc1B1YmxpYyA9PT0gdHJ1ZSlcblx0XHRcdCkge1xuXHRcdFx0XHRpZiAoYXBpVmVyc2lvbiA9PT0gMikge1xuXHRcdFx0XHRcdGNvbnN0IGFnZ3JlZ2F0aW9uRGVmaW5pdGlvbiA9IG9NZXRhZGF0YS5hZ2dyZWdhdGlvbnNbc0FnZ3JlZ2F0aW9uTmFtZV07XG5cdFx0XHRcdFx0aWYgKCFhZ2dyZWdhdGlvbkRlZmluaXRpb24uc2xvdCAmJiBvRmlyc3RFbGVtZW50Q2hpbGQgIT09IG51bGwgJiYgb0ZpcnN0RWxlbWVudENoaWxkLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdGF3YWl0IG9WaXNpdG9yLnZpc2l0Tm9kZShvRmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRcdFx0XHRcdFx0bGV0IGNoaWxkRGVmaW5pdGlvbiA9IG9GaXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcblx0XHRcdFx0XHRcdHdoaWxlIChjaGlsZERlZmluaXRpb24pIHtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgb05ld0NoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG9Ob2RlLm5hbWVzcGFjZVVSSSwgY2hpbGREZWZpbml0aW9uLmdldEF0dHJpYnV0ZShcImtleVwiKSEpO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBuZXh0Q2hpbGQgPSBjaGlsZERlZmluaXRpb24ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdFx0XHRvTmV3Q2hpbGQuYXBwZW5kQ2hpbGQoY2hpbGREZWZpbml0aW9uKTtcblx0XHRcdFx0XHRcdFx0b0FnZ3JlZ2F0aW9uc1tjaGlsZERlZmluaXRpb24uZ2V0QXR0cmlidXRlKFwia2V5XCIpIV0gPSBvTmV3Q2hpbGQ7XG5cdFx0XHRcdFx0XHRcdGNoaWxkRGVmaW5pdGlvbi5yZW1vdmVBdHRyaWJ1dGUoXCJrZXlcIik7XG5cdFx0XHRcdFx0XHRcdGNoaWxkRGVmaW5pdGlvbiA9IG5leHRDaGlsZDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFnZ3JlZ2F0aW9uRGVmaW5pdGlvbi5zbG90KSB7XG5cdFx0XHRcdFx0XHRpZiAoc0FnZ3JlZ2F0aW9uTmFtZSAhPT0gc0NoaWxkTmFtZSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIW9BZ2dyZWdhdGlvbnNbc0FnZ3JlZ2F0aW9uTmFtZV0pIHtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBvTmV3Q2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMob05vZGUubmFtZXNwYWNlVVJJLCBzQWdncmVnYXRpb25OYW1lKTtcblx0XHRcdFx0XHRcdFx0XHRvQWdncmVnYXRpb25zW3NBZ2dyZWdhdGlvbk5hbWVdID0gb05ld0NoaWxkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG9BZ2dyZWdhdGlvbnNbc0FnZ3JlZ2F0aW9uTmFtZV0uYXBwZW5kQ2hpbGQob0ZpcnN0RWxlbWVudENoaWxkKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG9BZ2dyZWdhdGlvbnNbc0FnZ3JlZ2F0aW9uTmFtZV0gPSBvRmlyc3RFbGVtZW50Q2hpbGQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGF3YWl0IG9WaXNpdG9yLnZpc2l0Tm9kZShvRmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRcdFx0XHRcdG9BZ2dyZWdhdGlvbnNbb0ZpcnN0RWxlbWVudENoaWxkLmxvY2FsTmFtZV0gPSBvRmlyc3RFbGVtZW50Q2hpbGQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoT2JqZWN0LmtleXMob01ldGFkYXRhLnByb3BlcnRpZXMpLmluZGV4T2Yoc0FnZ3JlZ2F0aW9uTmFtZSkgIT09IC0xKSB7XG5cdFx0XHRcdGF3YWl0IG9WaXNpdG9yLnZpc2l0Tm9kZShvRmlyc3RFbGVtZW50Q2hpbGQpO1xuXHRcdFx0XHRpZiAob01ldGFkYXRhLnByb3BlcnRpZXNbc0FnZ3JlZ2F0aW9uTmFtZV0udHlwZSA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0XHRcdC8vIE9iamVjdCBUeXBlIHByb3BlcnRpZXNcblx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlc1tzQWdncmVnYXRpb25OYW1lXSA9IHt9O1xuXHRcdFx0XHRcdGZvciAoY29uc3QgYXR0cmlidXRlSW5kZXggb2YgT2JqZWN0LmtleXMob0ZpcnN0RWxlbWVudENoaWxkLmF0dHJpYnV0ZXMpKSB7XG5cdFx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlc1tzQWdncmVnYXRpb25OYW1lXVtvRmlyc3RFbGVtZW50Q2hpbGQuYXR0cmlidXRlc1thdHRyaWJ1dGVJbmRleCBhcyBhbnldLmxvY2FsTmFtZV0gPVxuXHRcdFx0XHRcdFx0XHRvRmlyc3RFbGVtZW50Q2hpbGQuYXR0cmlidXRlc1thdHRyaWJ1dGVJbmRleCBhcyBhbnldLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChvTWV0YWRhdGEucHJvcGVydGllc1tzQWdncmVnYXRpb25OYW1lXS50eXBlID09PSBcImFycmF5XCIpIHtcblx0XHRcdFx0XHRpZiAob0ZpcnN0RWxlbWVudENoaWxkICE9PSBudWxsICYmIG9GaXJzdEVsZW1lbnRDaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBjaGlsZHJlbiA9IG9GaXJzdEVsZW1lbnRDaGlsZC5jaGlsZHJlbjtcblx0XHRcdFx0XHRcdGNvbnN0IG9PdXRPYmplY3RzID0gW107XG5cdFx0XHRcdFx0XHRmb3IgKGxldCBjaGlsZElkeCA9IDA7IGNoaWxkSWR4IDwgY2hpbGRyZW4ubGVuZ3RoOyBjaGlsZElkeCsrKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGNoaWxkRGVmaW5pdGlvbiA9IGNoaWxkcmVuW2NoaWxkSWR4XTtcblx0XHRcdFx0XHRcdFx0Ly8gbm9uIGtleWVkIGNoaWxkLCBqdXN0IGFkZCBpdCB0byB0aGUgYWdncmVnYXRpb25cblx0XHRcdFx0XHRcdFx0Y29uc3QgbXlDaGlsZDogYW55ID0ge307XG5cdFx0XHRcdFx0XHRcdGZvciAoY29uc3QgYXR0cmlidXRlSW5kZXggb2YgT2JqZWN0LmtleXMoY2hpbGREZWZpbml0aW9uLmF0dHJpYnV0ZXMpKSB7XG5cdFx0XHRcdFx0XHRcdFx0bXlDaGlsZFtjaGlsZERlZmluaXRpb24uYXR0cmlidXRlc1thdHRyaWJ1dGVJbmRleCBhcyBhbnldLmxvY2FsTmFtZV0gPVxuXHRcdFx0XHRcdFx0XHRcdFx0Y2hpbGREZWZpbml0aW9uLmF0dHJpYnV0ZXNbYXR0cmlidXRlSW5kZXggYXMgYW55XS52YWx1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRvT3V0T2JqZWN0cy5wdXNoKG15Q2hpbGQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cHJvcGVydHlWYWx1ZXNbc0FnZ3JlZ2F0aW9uTmFtZV0gPSBvT3V0T2JqZWN0cztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b0ZpcnN0RWxlbWVudENoaWxkID0gb05leHRDaGlsZDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG9BZ2dyZWdhdGlvbnM7XG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NTbG90cyhcblx0b0FnZ3JlZ2F0aW9uczogUmVjb3JkPHN0cmluZywgYW55Pixcblx0b01ldGFkYXRhQWdncmVnYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBCdWlsZGluZ0Jsb2NrQWdncmVnYXRpb25EZWZpbml0aW9uPixcblx0b05vZGU6IEVsZW1lbnQsXG5cdHByb2Nlc3NDdXN0b21EYXRhOiBib29sZWFuID0gZmFsc2Vcbikge1xuXHRpZiAoT2JqZWN0LmtleXMob0FnZ3JlZ2F0aW9ucykubGVuZ3RoID4gMCkge1xuXHRcdE9iamVjdC5rZXlzKG9BZ2dyZWdhdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKHNBZ2dyZWdhdGlvbk5hbWU6IHN0cmluZykge1xuXHRcdFx0Y29uc3Qgb0FnZ3JlZ2F0aW9uRWxlbWVudCA9IG9BZ2dyZWdhdGlvbnNbc0FnZ3JlZ2F0aW9uTmFtZV07XG5cdFx0XHRpZiAob05vZGUgIT09IG51bGwgJiYgb05vZGUgIT09IHVuZGVmaW5lZCAmJiBvQWdncmVnYXRpb25FbGVtZW50KSB7XG5cdFx0XHRcdC8vIHNsb3RzIGNhbiBoYXZlIDo6IGFzIGtleXMgd2hpY2ggaXMgbm90IGEgdmFsaWQgYWdncmVnYXRpb24gbmFtZSB0aGVyZWZvcmUgcmVwbGFjaW5nIHRoZW1cblx0XHRcdFx0Y29uc3Qgb05ld0NoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG9Ob2RlLm5hbWVzcGFjZVVSSSwgc0FnZ3JlZ2F0aW9uTmFtZS5yZXBsYWNlKC86L2dpLCBcIl9cIikpO1xuXHRcdFx0XHRsZXQgb0VsZW1lbnRDaGlsZCA9IG9BZ2dyZWdhdGlvbkVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cdFx0XHRcdHdoaWxlIChvRWxlbWVudENoaWxkKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb05leHRDaGlsZCA9IG9FbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFx0XHRcdG9OZXdDaGlsZC5hcHBlbmRDaGlsZChvRWxlbWVudENoaWxkKTtcblx0XHRcdFx0XHRvRWxlbWVudENoaWxkID0gb05leHRDaGlsZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc0FnZ3JlZ2F0aW9uTmFtZSAhPT0gXCJjdXN0b21EYXRhXCIgJiYgc0FnZ3JlZ2F0aW9uTmFtZSAhPT0gXCJkZXBlbmRlbnRzXCIpIHtcblx0XHRcdFx0XHRjb25zdCBzU2xvdE5hbWUgPVxuXHRcdFx0XHRcdFx0KG9NZXRhZGF0YUFnZ3JlZ2F0aW9uc1tzQWdncmVnYXRpb25OYW1lXSAhPT0gdW5kZWZpbmVkICYmIG9NZXRhZGF0YUFnZ3JlZ2F0aW9uc1tzQWdncmVnYXRpb25OYW1lXS5zbG90KSB8fFxuXHRcdFx0XHRcdFx0c0FnZ3JlZ2F0aW9uTmFtZTtcblx0XHRcdFx0XHRjb25zdCBvVGFyZ2V0RWxlbWVudCA9IG9Ob2RlLnF1ZXJ5U2VsZWN0b3IoYHNsb3RbbmFtZT0nJHtzU2xvdE5hbWV9J11gKTtcblx0XHRcdFx0XHRpZiAob1RhcmdldEVsZW1lbnQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdG9UYXJnZXRFbGVtZW50LnJlcGxhY2VXaXRoKC4uLihvTmV3Q2hpbGQuY2hpbGRyZW4gYXMgYW55KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHByb2Nlc3NDdXN0b21EYXRhICYmIG9OZXdDaGlsZC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0b05vZGUuYXBwZW5kQ2hpbGQob05ld0NoaWxkKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NCdWlsZGluZ0Jsb2NrKFxuXHRidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbjogQnVpbGRpbmdCbG9ja0RlZmluaXRpb24sXG5cdG9Ob2RlOiBFbGVtZW50LFxuXHRvVmlzaXRvcjogSUNhbGxiYWNrLFxuXHRpc1B1YmxpYyA9IGZhbHNlXG4pIHtcblx0Y29uc3Qgc0ZyYWdtZW50TmFtZSA9IGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLmZyYWdtZW50IHx8IGAke2J1aWxkaW5nQmxvY2tEZWZpbml0aW9uLm5hbWVzcGFjZX0uJHtidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lfWA7XG5cblx0Y29uc3Qgc05hbWUgPSBcInRoaXNcIjtcblxuXHRjb25zdCBtQ29udGV4dHM6IGFueSA9IHt9O1xuXHRjb25zdCBvTWV0YWRhdGFDb250ZXh0czogYW55ID0ge307XG5cdGNvbnN0IG9TZXR0aW5ncyA9IG9WaXNpdG9yLmdldFNldHRpbmdzKCk7XG5cdC8vIFRPRE8gMDAwMSBNb3ZlIHRoaXMgZWxzZXdoZXJlIHRoaXMgaXMgd2VpcmQgOilcblx0aWYgKG9TZXR0aW5ncy5tb2RlbHNbXCJzYXAuZmUuaTE4blwiXSkge1xuXHRcdG9TZXR0aW5ncy5tb2RlbHNbXCJzYXAuZmUuaTE4blwiXVxuXHRcdFx0LmdldFJlc291cmNlQnVuZGxlKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChvUmVzb3VyY2VCdW5kbGU6IGFueSkge1xuXHRcdFx0XHRSZXNvdXJjZU1vZGVsLnNldEFwcGxpY2F0aW9uSTE4bkJ1bmRsZShvUmVzb3VyY2VCdW5kbGUpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaChmdW5jdGlvbiAoZXJyb3I6IGFueSkge1xuXHRcdFx0XHRMb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSk7XG5cdH1cblx0Y29uc3Qgb01ldGFkYXRhID0gcHJlcGFyZU1ldGFkYXRhKGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLm1ldGFkYXRhLCBidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5pc09wZW4pO1xuXG5cdC8vSW5qZWN0IHN0b3JhZ2UgZm9yIG1hY3Jvc1xuXHRpZiAoIW9TZXR0aW5nc1tzRnJhZ21lbnROYW1lXSkge1xuXHRcdG9TZXR0aW5nc1tzRnJhZ21lbnROYW1lXSA9IHt9O1xuXHR9XG5cblx0Ly8gRmlyc3Qgb2YgYWxsIHdlIG5lZWQgdG8gdmlzaXQgdGhlIGF0dHJpYnV0ZXMgdG8gcmVzb2x2ZSB0aGUgcHJvcGVydGllcyBhbmQgdGhlIG1ldGFkYXRhIGNvbnRleHRzXG5cdGxldCBwcm9wZXJ0eVZhbHVlcyA9IGF3YWl0IHByb2Nlc3NQcm9wZXJ0aWVzKG9NZXRhZGF0YSwgb05vZGUsIGlzUHVibGljLCBvVmlzaXRvciwgYnVpbGRpbmdCbG9ja0RlZmluaXRpb24uYXBpVmVyc2lvbik7XG5cblx0Y29uc3QgeyBtTWlzc2luZ0NvbnRleHQsIHByb3BlcnR5VmFsdWVzOiBleHRyYVByb3BlcnR5VmFsdWVzIH0gPSBhd2FpdCBwcm9jZXNzQ29udGV4dHMoXG5cdFx0b01ldGFkYXRhLFxuXHRcdG9TZXR0aW5ncyxcblx0XHRvTm9kZSxcblx0XHRpc1B1YmxpYyxcblx0XHRvVmlzaXRvcixcblx0XHRtQ29udGV4dHMsXG5cdFx0b01ldGFkYXRhQ29udGV4dHNcblx0KTtcblx0cHJvcGVydHlWYWx1ZXMgPSBPYmplY3QuYXNzaWduKHByb3BlcnR5VmFsdWVzLCBleHRyYVByb3BlcnR5VmFsdWVzKTtcblx0Y29uc3QgaW5pdGlhbEtleXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0eVZhbHVlcyk7XG5cdHRyeSB7XG5cdFx0Ly8gQWdncmVnYXRpb24gYW5kIGNvbXBsZXggdHlwZSBzdXBwb3J0XG5cdFx0Y29uc3Qgb0FnZ3JlZ2F0aW9ucyA9IGF3YWl0IHByb2Nlc3NDaGlsZHJlbihcblx0XHRcdG9Ob2RlLFxuXHRcdFx0b1Zpc2l0b3IsXG5cdFx0XHRvTWV0YWRhdGEsXG5cdFx0XHRpc1B1YmxpYyxcblx0XHRcdHByb3BlcnR5VmFsdWVzLFxuXHRcdFx0YnVpbGRpbmdCbG9ja0RlZmluaXRpb24uYXBpVmVyc2lvblxuXHRcdCk7XG5cdFx0bGV0IG9JbnN0YW5jZTogYW55O1xuXHRcdGxldCBvQ29udHJvbENvbmZpZyA9IHt9O1xuXG5cdFx0aWYgKG9TZXR0aW5ncy5tb2RlbHMudmlld0RhdGEpIHtcblx0XHRcdC8vIE9ubHkgdXNlZCBpbiB0aGUgRmllbGQgbWFjcm8gYW5kIGV2ZW4gdGhlbiBtYXliZSBub3QgcmVhbGx5IHVzZWZ1bFxuXHRcdFx0b0NvbnRyb2xDb25maWcgPSBvU2V0dGluZ3MubW9kZWxzLnZpZXdEYXRhLmdldFByb3BlcnR5KFwiL2NvbnRyb2xDb25maWd1cmF0aW9uXCIpO1xuXHRcdH1cblx0XHRsZXQgcHJvY2Vzc2VkUHJvcGVydHlWYWx1ZXMgPSBwcm9wZXJ0eVZhbHVlcztcblx0XHRpZiAoaXNWMU1hY3JvRGVmKGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uKSAmJiBidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5jcmVhdGUpIHtcblx0XHRcdHByb2Nlc3NlZFByb3BlcnR5VmFsdWVzID0gYnVpbGRpbmdCbG9ja0RlZmluaXRpb24uY3JlYXRlLmNhbGwoXG5cdFx0XHRcdGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLFxuXHRcdFx0XHRwcm9wZXJ0eVZhbHVlcyxcblx0XHRcdFx0b0NvbnRyb2xDb25maWcsXG5cdFx0XHRcdG9TZXR0aW5ncyxcblx0XHRcdFx0b0FnZ3JlZ2F0aW9ucyxcblx0XHRcdFx0aXNQdWJsaWNcblx0XHRcdCk7XG5cdFx0XHRPYmplY3Qua2V5cyhvTWV0YWRhdGEubWV0YWRhdGFDb250ZXh0cykuZm9yRWFjaChmdW5jdGlvbiAoc01ldGFkYXRhTmFtZTogc3RyaW5nKSB7XG5cdFx0XHRcdGlmIChvTWV0YWRhdGEubWV0YWRhdGFDb250ZXh0c1tzTWV0YWRhdGFOYW1lXS5jb21wdXRlZCA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG1Db250ZXh0c1tzTWV0YWRhdGFOYW1lXSA9IHByb2Nlc3NlZFByb3BlcnR5VmFsdWVzW3NNZXRhZGF0YU5hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdE9iamVjdC5rZXlzKG1NaXNzaW5nQ29udGV4dCkuZm9yRWFjaChmdW5jdGlvbiAoc0NvbnRleHROYW1lOiBzdHJpbmcpIHtcblx0XHRcdFx0aWYgKHByb2Nlc3NlZFByb3BlcnR5VmFsdWVzLmhhc093blByb3BlcnR5KHNDb250ZXh0TmFtZSkpIHtcblx0XHRcdFx0XHRtQ29udGV4dHNbc0NvbnRleHROYW1lXSA9IHByb2Nlc3NlZFByb3BlcnR5VmFsdWVzW3NDb250ZXh0TmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0gZWxzZSBpZiAoYnVpbGRpbmdCbG9ja0RlZmluaXRpb24uYXBpVmVyc2lvbiA9PT0gMikge1xuXHRcdFx0T2JqZWN0LmtleXMocHJvcGVydHlWYWx1ZXMpLmZvckVhY2goKHByb3BOYW1lKSA9PiB7XG5cdFx0XHRcdGNvbnN0IG9EYXRhID0gcHJvcGVydHlWYWx1ZXNbcHJvcE5hbWVdO1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0b0RhdGEgJiZcblx0XHRcdFx0XHRvRGF0YS5pc0EgJiZcblx0XHRcdFx0XHRvRGF0YS5pc0EoU0FQX1VJX01PREVMX0NPTlRFWFQpICYmXG5cdFx0XHRcdFx0IW9EYXRhLmdldE1vZGVsKCkuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTWV0YU1vZGVsXCIpXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHByb3BlcnR5VmFsdWVzW3Byb3BOYW1lXSA9IG9EYXRhLmdldE9iamVjdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IEJ1aWxkaW5nQmxvY2tDbGFzcyA9IGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uIGFzIHR5cGVvZiBCdWlsZGluZ0Jsb2NrQmFzZTtcblx0XHRcdHByb3BlcnR5VmFsdWVzLmlzUHVibGljID0gaXNQdWJsaWM7XG5cblx0XHRcdG9JbnN0YW5jZSA9IG5ldyBCdWlsZGluZ0Jsb2NrQ2xhc3MoXG5cdFx0XHRcdHsgLi4ucHJvcGVydHlWYWx1ZXMsIC4uLm9BZ2dyZWdhdGlvbnMgfSxcblx0XHRcdFx0b0NvbnRyb2xDb25maWcsXG5cdFx0XHRcdG9TZXR0aW5nc1xuXHRcdFx0XHQvKiwgb0NvbnRyb2xDb25maWcsIG9TZXR0aW5ncywgb0FnZ3JlZ2F0aW9ucywgaXNQdWJsaWMqL1xuXHRcdFx0KTtcblx0XHRcdHByb2Nlc3NlZFByb3BlcnR5VmFsdWVzID0gb0luc3RhbmNlLmdldFByb3BlcnRpZXMoKTtcblx0XHRcdE9iamVjdC5rZXlzKG9NZXRhZGF0YS5tZXRhZGF0YUNvbnRleHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChzQ29udGV4dE5hbWU6IHN0cmluZykge1xuXHRcdFx0XHRpZiAocHJvY2Vzc2VkUHJvcGVydHlWYWx1ZXMuaGFzT3duUHJvcGVydHkoc0NvbnRleHROYW1lKSkge1xuXHRcdFx0XHRcdGxldCB0YXJnZXRPYmplY3QgPSBwcm9jZXNzZWRQcm9wZXJ0eVZhbHVlc1tzQ29udGV4dE5hbWVdO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgdGFyZ2V0T2JqZWN0ID09PSBcIm9iamVjdFwiICYmICF0YXJnZXRPYmplY3QuZ2V0T2JqZWN0KSB7XG5cdFx0XHRcdFx0XHRjb25zdCBzQXR0cmlidXRlVmFsdWUgPSBzdG9yZVZhbHVlKHRhcmdldE9iamVjdCk7XG5cdFx0XHRcdFx0XHRjb25zdCBzQ29udGV4dFBhdGggPSBgJHtzQXR0cmlidXRlVmFsdWV9YDtcblx0XHRcdFx0XHRcdG9TZXR0aW5ncy5tb2RlbHMuY29udmVydGVyQ29udGV4dC5zZXRQcm9wZXJ0eShzQ29udGV4dFBhdGgsIHRhcmdldE9iamVjdCk7XG5cdFx0XHRcdFx0XHR0YXJnZXRPYmplY3QgPSBvU2V0dGluZ3MubW9kZWxzLmNvbnZlcnRlckNvbnRleHQuY3JlYXRlQmluZGluZ0NvbnRleHQoc0NvbnRleHRQYXRoKTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBteVN0b3JlW3NBdHRyaWJ1dGVWYWx1ZV07XG5cdFx0XHRcdFx0XHRtQ29udGV4dHNbc0NvbnRleHROYW1lXSA9IHRhcmdldE9iamVjdDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFtQ29udGV4dHMuaGFzT3duUHJvcGVydHkoc0NvbnRleHROYW1lKSAmJiB0YXJnZXRPYmplY3QgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0bUNvbnRleHRzW3NDb250ZXh0TmFtZV0gPSB0YXJnZXRPYmplY3Q7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0Y29uc3Qgb0F0dHJpYnV0ZXNNb2RlbDogSlNPTk1vZGVsID0gbmV3IEF0dHJpYnV0ZU1vZGVsKG9Ob2RlLCBwcm9jZXNzZWRQcm9wZXJ0eVZhbHVlcywgYnVpbGRpbmdCbG9ja0RlZmluaXRpb24pO1xuXHRcdG1Db250ZXh0c1tzTmFtZV0gPSBvQXR0cmlidXRlc01vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKTtcblx0XHRsZXQgb1ByZXZpb3VzTWFjcm9JbmZvOiBhbnk7XG5cblx0XHQvLyBLZWVwIHRyYWNrXG5cdFx0aWYgKFRyYWNlSW5mby5pc1RyYWNlSW5mb0FjdGl2ZSgpKSB7XG5cdFx0XHRjb25zdCBvVHJhY2VJbmZvID0gVHJhY2VJbmZvLnRyYWNlTWFjcm9DYWxscyhzRnJhZ21lbnROYW1lLCBvTWV0YWRhdGEsIG1Db250ZXh0cywgb05vZGUsIG9WaXNpdG9yKTtcblx0XHRcdGlmIChvVHJhY2VJbmZvKSB7XG5cdFx0XHRcdG9QcmV2aW91c01hY3JvSW5mbyA9IG9TZXR0aW5nc1tcIl9tYWNyb0luZm9cIl07XG5cdFx0XHRcdG9TZXR0aW5nc1tcIl9tYWNyb0luZm9cIl0gPSBvVHJhY2VJbmZvLm1hY3JvSW5mbztcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFsaWRhdGVNYWNyb1NpZ25hdHVyZShzRnJhZ21lbnROYW1lLCBvTWV0YWRhdGEsIG1Db250ZXh0cywgb05vZGUpO1xuXG5cdFx0Y29uc3Qgb0NvbnRleHRWaXNpdG9yID0gb1Zpc2l0b3Iud2l0aChcblx0XHRcdG1Db250ZXh0cyxcblx0XHRcdGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLmlzT3BlbiAhPT0gdW5kZWZpbmVkID8gIWJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLmlzT3BlbiA6IHRydWVcblx0XHQpO1xuXHRcdGNvbnN0IG9QYXJlbnQgPSBvTm9kZS5wYXJlbnROb2RlO1xuXG5cdFx0bGV0IGlDaGlsZEluZGV4OiBudW1iZXI7XG5cdFx0bGV0IG9Qcm9taXNlO1xuXHRcdGxldCBwcm9jZXNzQ3VzdG9tRGF0YSA9IHRydWU7XG5cdFx0aWYgKG9QYXJlbnQpIHtcblx0XHRcdGlDaGlsZEluZGV4ID0gQXJyYXkuZnJvbShvUGFyZW50LmNoaWxkcmVuKS5pbmRleE9mKG9Ob2RlKTtcblx0XHRcdGlmIChcblx0XHRcdFx0KGlzVjFNYWNyb0RlZihidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbikgJiYgYnVpbGRpbmdCbG9ja0RlZmluaXRpb24uZ2V0VGVtcGxhdGUpIHx8XG5cdFx0XHRcdChidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5hcGlWZXJzaW9uID09PSAyICYmICFidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5mcmFnbWVudClcblx0XHRcdCkge1xuXHRcdFx0XHRsZXQgb1RlbXBsYXRlO1xuXHRcdFx0XHRsZXQgYWRkRGVmYXVsdE5hbWVzcGFjZSA9IGZhbHNlO1xuXHRcdFx0XHRpZiAoYnVpbGRpbmdCbG9ja0RlZmluaXRpb24uYXBpVmVyc2lvbiA9PT0gMikge1xuXHRcdFx0XHRcdG9UZW1wbGF0ZSA9IG9JbnN0YW5jZS5nZXRUZW1wbGF0ZSgpO1xuXHRcdFx0XHRcdGlmIChidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5pc1J1bnRpbWUgPT09IHRydWUpIHtcblx0XHRcdFx0XHRcdGZvciAoY29uc3QgbXlTdG9yZUtleSBpbiBteVN0b3JlKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9EYXRhID0gbXlTdG9yZVtteVN0b3JlS2V5XTtcblx0XHRcdFx0XHRcdFx0Y29uc3Qgc0NvbnRleHRQYXRoID0gYCR7bXlTdG9yZUtleX1gO1xuXHRcdFx0XHRcdFx0XHRvU2V0dGluZ3MubW9kZWxzLmNvbnZlcnRlckNvbnRleHQuc2V0UHJvcGVydHkoc0NvbnRleHRQYXRoLCBvRGF0YSk7XG5cdFx0XHRcdFx0XHRcdGRlbGV0ZSBteVN0b3JlW215U3RvcmVLZXldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhZGREZWZhdWx0TmFtZXNwYWNlID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIGlmIChidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5nZXRUZW1wbGF0ZSkge1xuXHRcdFx0XHRcdG9UZW1wbGF0ZSA9IGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLmdldFRlbXBsYXRlKHByb2Nlc3NlZFByb3BlcnR5VmFsdWVzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBoYXNFcnJvciA9IFwiXCI7XG5cdFx0XHRcdGlmIChvVGVtcGxhdGUpIHtcblx0XHRcdFx0XHRpZiAoIW9UZW1wbGF0ZS5maXJzdEVsZW1lbnRDaGlsZCkge1xuXHRcdFx0XHRcdFx0b1RlbXBsYXRlID0gcGFyc2VYTUxTdHJpbmcob1RlbXBsYXRlLCBhZGREZWZhdWx0TmFtZXNwYWNlKTtcblx0XHRcdFx0XHRcdC8vIEZvciBzYWZldHkgcHVycG9zZSB3ZSB0cnkgdG8gZGV0ZWN0IHRyYWlsaW5nIHRleHQgaW4gYmV0d2VlbiBYTUwgVGFnc1xuXHRcdFx0XHRcdFx0Y29uc3QgaXRlciA9IGRvY3VtZW50LmNyZWF0ZU5vZGVJdGVyYXRvcihvVGVtcGxhdGUsIE5vZGVGaWx0ZXIuU0hPV19URVhUKTtcblx0XHRcdFx0XHRcdGxldCB0ZXh0bm9kZSA9IGl0ZXIubmV4dE5vZGUoKTtcblx0XHRcdFx0XHRcdHdoaWxlICh0ZXh0bm9kZSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodGV4dG5vZGUudGV4dENvbnRlbnQgJiYgdGV4dG5vZGUudGV4dENvbnRlbnQudHJpbSgpLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRoYXNFcnJvciA9IHRleHRub2RlLnRleHRDb250ZW50O1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHRleHRub2RlID0gaXRlci5uZXh0Tm9kZSgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChvVGVtcGxhdGUubG9jYWxOYW1lID09PSBcInBhcnNlcmVycm9yXCIpIHtcblx0XHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzIGEgcGFyc2VlcnJvciB3aGlsZSBwcm9jZXNzaW5nIHRoZSBYTUwgaXQgbWVhbnMgdGhlIFhNTCBpdHNlbGYgaXMgbWFsZm9ybWVkLCBhcyBzdWNoIHdlIHJlcnVuIHRoZSB0ZW1wbGF0ZSBwcm9jZXNzXG5cdFx0XHRcdFx0XHQvLyBTZXR0aW5nIGlzVHJhY2VNb2RlIHRydWUgd2lsbCBtYWtlIGl0IHNvIHRoYXQgZWFjaCB4bWxgIGV4cHJlc3Npb24gaXMgY2hlY2tlZCBmb3IgdmFsaWRpdHkgZnJvbSBYTUwgcGVyc3BlY3RpdmVcblx0XHRcdFx0XHRcdC8vIElmIGFuIGVycm9yIGlzIGZvdW5kIGl0J3MgcmV0dXJuZWQgaW5zdGVhZCBvZiB0aGUgbm9ybWFsIGZyYWdtZW50XG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoYEVycm9yIHdoaWxlIHByb2Nlc3NpbmcgYnVpbGRpbmcgYmxvY2sgJHtidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lfWApO1xuXHRcdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdFx0aXNUcmFjZU1vZGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRvVGVtcGxhdGUgPSBvSW5zdGFuY2U/LmdldFRlbXBsYXRlXG5cdFx0XHRcdFx0XHRcdFx0PyBvSW5zdGFuY2UuZ2V0VGVtcGxhdGUoKVxuXHRcdFx0XHRcdFx0XHRcdDogKGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uIGFzIGFueSkuZ2V0VGVtcGxhdGUocHJvY2Vzc2VkUHJvcGVydHlWYWx1ZXMpO1xuXHRcdFx0XHRcdFx0XHRvVGVtcGxhdGUgPSBwYXJzZVhNTFN0cmluZyhvVGVtcGxhdGUsIHRydWUpO1xuXHRcdFx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRcdFx0aXNUcmFjZU1vZGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGhhc0Vycm9yLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzIHRyYWlsaW5nIHRleHQgd2UgY3JlYXRlIGEgc3RhbmRhcmQgZXJyb3IgYW5kIGRpc3BsYXkgaXQuXG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoYEVycm9yIHdoaWxlIHByb2Nlc3NpbmcgYnVpbGRpbmcgYmxvY2sgJHtidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lfWApO1xuXHRcdFx0XHRcdFx0Y29uc3Qgb0Vycm9yVGV4dCA9IGNyZWF0ZUVycm9yWE1MKFxuXHRcdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdFx0YEVycm9yIHdoaWxlIHByb2Nlc3NpbmcgYnVpbGRpbmcgYmxvY2sgJHtidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lfWAsXG5cdFx0XHRcdFx0XHRcdFx0YFRyYWlsaW5nIHRleHQgd2FzIGZvdW5kIGluIHRoZSBYTUw6ICR7aGFzRXJyb3J9YFxuXHRcdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFx0XHRvVGVtcGxhdGUub3V0ZXJIVE1MXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0b1RlbXBsYXRlID0gcGFyc2VYTUxTdHJpbmcob0Vycm9yVGV4dCwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG9Ob2RlLnJlcGxhY2VXaXRoKG9UZW1wbGF0ZSk7XG5cdFx0XHRcdFx0b05vZGUgPSBvUGFyZW50LmNoaWxkcmVuW2lDaGlsZEluZGV4XTtcblx0XHRcdFx0XHRwcm9jZXNzU2xvdHMob0FnZ3JlZ2F0aW9ucywgb01ldGFkYXRhLmFnZ3JlZ2F0aW9ucywgb05vZGUsIHByb2Nlc3NDdXN0b21EYXRhKTtcblx0XHRcdFx0XHRwcm9jZXNzQ3VzdG9tRGF0YSA9IGZhbHNlO1xuXHRcdFx0XHRcdG9Qcm9taXNlID0gb0NvbnRleHRWaXNpdG9yLnZpc2l0Tm9kZShvTm9kZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b05vZGUucmVtb3ZlKCk7XG5cdFx0XHRcdFx0b1Byb21pc2UgPSBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b1Byb21pc2UgPSBvQ29udGV4dFZpc2l0b3IuaW5zZXJ0RnJhZ21lbnQoc0ZyYWdtZW50TmFtZSwgb05vZGUpO1xuXHRcdFx0fVxuXG5cdFx0XHRhd2FpdCBvUHJvbWlzZTtcblx0XHRcdGNvbnN0IG9NYWNyb0VsZW1lbnQgPSBvUGFyZW50LmNoaWxkcmVuW2lDaGlsZEluZGV4XTtcblx0XHRcdHByb2Nlc3NTbG90cyhvQWdncmVnYXRpb25zLCBvTWV0YWRhdGEuYWdncmVnYXRpb25zLCBvTWFjcm9FbGVtZW50LCBwcm9jZXNzQ3VzdG9tRGF0YSk7XG5cdFx0XHRpZiAob01hY3JvRWxlbWVudCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdGNvbnN0IG9SZW1haW5pbmdTbG90cyA9IG9NYWNyb0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNsb3RcIik7XG5cdFx0XHRcdG9SZW1haW5pbmdTbG90cy5mb3JFYWNoKGZ1bmN0aW9uIChvU2xvdEVsZW1lbnQ6IGFueSkge1xuXHRcdFx0XHRcdG9TbG90RWxlbWVudC5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmIChvUHJldmlvdXNNYWNyb0luZm8pIHtcblx0XHRcdC8vcmVzdG9yZSBtYWNybyBpbmZvIGlmIGF2YWlsYWJsZVxuXHRcdFx0b1NldHRpbmdzW1wiX21hY3JvSW5mb1wiXSA9IG9QcmV2aW91c01hY3JvSW5mbztcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVsZXRlIG9TZXR0aW5nc1tcIl9tYWNyb0luZm9cIl07XG5cdFx0fVxuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gSW4gY2FzZSB0aGVyZSBpcyBhIGdlbmVyaWMgZXJyb3IgKHVzdWFsbHkgY29kZSBlcnJvciksIHdlIHJldHJpZXZlIHRoZSBjdXJyZW50IGNvbnRleHQgaW5mb3JtYXRpb24gYW5kIGNyZWF0ZSBhIGRlZGljYXRlZCBlcnJvciBtZXNzYWdlXG5cdFx0Y29uc3QgdHJhY2VEZXRhaWxzID0ge1xuXHRcdFx0aW5pdGlhbFByb3BlcnRpZXM6IHt9IGFzIGFueSxcblx0XHRcdHJlc29sdmVkUHJvcGVydGllczoge30gYXMgYW55LFxuXHRcdFx0bWlzc2luZ0NvbnRleHRzOiBtTWlzc2luZ0NvbnRleHRcblx0XHR9O1xuXHRcdGZvciAoY29uc3QgcHJvcGVydHlOYW1lIG9mIGluaXRpYWxLZXlzKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eVZhbHVlID0gcHJvcGVydHlWYWx1ZXNbcHJvcGVydHlOYW1lXTtcblx0XHRcdGlmIChwcm9wZXJ0eVZhbHVlICYmIHByb3BlcnR5VmFsdWUuaXNBICYmIHByb3BlcnR5VmFsdWUuaXNBKFNBUF9VSV9NT0RFTF9DT05URVhUKSkge1xuXHRcdFx0XHR0cmFjZURldGFpbHMuaW5pdGlhbFByb3BlcnRpZXNbcHJvcGVydHlOYW1lXSA9IHtcblx0XHRcdFx0XHRwYXRoOiBwcm9wZXJ0eVZhbHVlLmdldFBhdGgoKSxcblx0XHRcdFx0XHR2YWx1ZTogcHJvcGVydHlWYWx1ZS5nZXRPYmplY3QoKVxuXHRcdFx0XHR9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dHJhY2VEZXRhaWxzLmluaXRpYWxQcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGNvbnN0IHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0eVZhbHVlcykge1xuXHRcdFx0Y29uc3QgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5VmFsdWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRpZiAoIWluaXRpYWxLZXlzLmluY2x1ZGVzKHByb3BlcnR5TmFtZSkpIHtcblx0XHRcdFx0aWYgKHByb3BlcnR5VmFsdWUgJiYgcHJvcGVydHlWYWx1ZS5pc0EgJiYgcHJvcGVydHlWYWx1ZS5pc0EoU0FQX1VJX01PREVMX0NPTlRFWFQpKSB7XG5cdFx0XHRcdFx0dHJhY2VEZXRhaWxzLnJlc29sdmVkUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0ge1xuXHRcdFx0XHRcdFx0cGF0aDogcHJvcGVydHlWYWx1ZS5nZXRQYXRoKCksXG5cdFx0XHRcdFx0XHR2YWx1ZTogcHJvcGVydHlWYWx1ZS5nZXRPYmplY3QoKVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dHJhY2VEZXRhaWxzLnJlc29sdmVkUHJvcGVydGllc1twcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRjb25zdCBlcnJvckFueSA9IGUgYXMgYW55O1xuXHRcdExvZy5lcnJvcihlcnJvckFueSwgZXJyb3JBbnkpO1xuXHRcdGNvbnN0IG9FcnJvciA9IGNyZWF0ZUVycm9yWE1MKFxuXHRcdFx0W2BFcnJvciB3aGlsZSBwcm9jZXNzaW5nIGJ1aWxkaW5nIGJsb2NrICR7YnVpbGRpbmdCbG9ja0RlZmluaXRpb24ubmFtZX1gXSxcblx0XHRcdG9Ob2RlLm91dGVySFRNTCxcblx0XHRcdHRyYWNlRGV0YWlscyxcblx0XHRcdGVycm9yQW55LnN0YWNrXG5cdFx0KTtcblx0XHRjb25zdCBvVGVtcGxhdGUgPSBwYXJzZVhNTFN0cmluZyhvRXJyb3IsIHRydWUpO1xuXHRcdG9Ob2RlLnJlcGxhY2VXaXRoKG9UZW1wbGF0ZSBhcyBhbnkpO1xuXHR9XG59XG5mdW5jdGlvbiBhZGRTaW5nbGVDb250ZXh0KG1Db250ZXh0czogYW55LCBvVmlzaXRvcjogYW55LCBvQ3R4OiBhbnksIG9NZXRhZGF0YUNvbnRleHRzOiBhbnkpIHtcblx0Y29uc3Qgc0tleSA9IG9DdHgubmFtZSB8fCBvQ3R4Lm1vZGVsIHx8IHVuZGVmaW5lZDtcblxuXHRpZiAob01ldGFkYXRhQ29udGV4dHNbc0tleV0pIHtcblx0XHRyZXR1cm47IC8vIGRvIG5vdCBhZGQgdHdpY2Vcblx0fVxuXHR0cnkge1xuXHRcdGxldCBzQ29udGV4dFBhdGggPSBvQ3R4LnBhdGg7XG5cdFx0aWYgKG9DdHgubW9kZWwgIT0gbnVsbCkge1xuXHRcdFx0c0NvbnRleHRQYXRoID0gYCR7b0N0eC5tb2RlbH0+JHtzQ29udGV4dFBhdGh9YDtcblx0XHR9XG5cdFx0Y29uc3QgbVNldHRpbmcgPSBvVmlzaXRvci5nZXRTZXR0aW5ncygpO1xuXHRcdGlmIChvQ3R4Lm1vZGVsID09PSBcImNvbnZlcnRlckNvbnRleHRcIiAmJiBvQ3R4LnBhdGgubGVuZ3RoID4gMCkge1xuXHRcdFx0bUNvbnRleHRzW3NLZXldID0gbVNldHRpbmcubW9kZWxzW29DdHgubW9kZWxdLmdldENvbnRleHQob0N0eC5wYXRoLCBtU2V0dGluZy5iaW5kaW5nQ29udGV4dHNbb0N0eC5tb2RlbF0pOyAvLyBhZGQgdGhlIGNvbnRleHQgdG8gdGhlIHZpc2l0b3Jcblx0XHR9IGVsc2UgaWYgKCFtU2V0dGluZy5iaW5kaW5nQ29udGV4dHNbb0N0eC5tb2RlbF0gJiYgbVNldHRpbmcubW9kZWxzW29DdHgubW9kZWxdKSB7XG5cdFx0XHRtQ29udGV4dHNbc0tleV0gPSBtU2V0dGluZy5tb2RlbHNbb0N0eC5tb2RlbF0uZ2V0Q29udGV4dChvQ3R4LnBhdGgpOyAvLyBhZGQgdGhlIGNvbnRleHQgdG8gdGhlIHZpc2l0b3Jcblx0XHR9IGVsc2Uge1xuXHRcdFx0bUNvbnRleHRzW3NLZXldID0gb1Zpc2l0b3IuZ2V0Q29udGV4dChzQ29udGV4dFBhdGgpOyAvLyBhZGQgdGhlIGNvbnRleHQgdG8gdGhlIHZpc2l0b3Jcblx0XHR9XG5cblx0XHRvTWV0YWRhdGFDb250ZXh0c1tzS2V5XSA9IG1Db250ZXh0c1tzS2V5XTsgLy8gbWFrZSBpdCBhdmFpbGFibGUgaW5zaWRlIG1ldGFkYXRhQ29udGV4dHMgSlNPTiBvYmplY3Rcblx0fSBjYXRjaCAoZXgpIHtcblx0XHQvL2NvbnNvbGUuZXJyb3IoZXgpO1xuXHRcdC8vIGlnbm9yZSB0aGUgY29udGV4dCBhcyB0aGlzIGNhbiBvbmx5IGJlIHRoZSBjYXNlIGlmIHRoZSBtb2RlbCBpcyBub3QgcmVhZHksIGkuZS4gbm90IGEgcHJlcHJvY2Vzc2luZyBtb2RlbCBidXQgbWF5YmUgYSBtb2RlbCBmb3Jcblx0XHQvLyBwcm92aWRpbmcgYWZ0ZXJ3YXJkc1xuXHRcdC8vIFRPRE8gMDAwMiBub3QgeWV0IGltcGxlbWVudGVkXG5cdFx0Ly9tQ29udGV4dHNbXCJfJGVycm9yXCJdLm9Nb2RlbC5zZXRQcm9wZXJ0eShcIi9cIiArIHNLZXksIGV4KTtcblx0fVxufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGEgYnVpbGRpbmcgYmxvY2sgZGVmaW5pdGlvbiB0byBiZSB1c2VkIGluc2lkZSB0aGUgeG1sIHRlbXBsYXRlIHByb2Nlc3Nvci5cbiAqXG4gKiBAcGFyYW0gYnVpbGRpbmdCbG9ja0RlZmluaXRpb24gVGhlIGJ1aWxkaW5nIGJsb2NrIGRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQnVpbGRpbmdCbG9jayhidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbjogQnVpbGRpbmdCbG9ja0RlZmluaXRpb24pOiB2b2lkIHtcblx0WE1MUHJlcHJvY2Vzc29yLnBsdWdJbihcblx0XHQob05vZGU6IEVsZW1lbnQsIG9WaXNpdG9yOiBJQ2FsbGJhY2spID0+IHByb2Nlc3NCdWlsZGluZ0Jsb2NrKGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLCBvTm9kZSwgb1Zpc2l0b3IpLFxuXHRcdGJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uLm5hbWVzcGFjZSxcblx0XHRidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi54bWxUYWcgfHwgYnVpbGRpbmdCbG9ja0RlZmluaXRpb24ubmFtZVxuXHQpO1xuXHRpZiAoYnVpbGRpbmdCbG9ja0RlZmluaXRpb24ucHVibGljTmFtZXNwYWNlKSB7XG5cdFx0WE1MUHJlcHJvY2Vzc29yLnBsdWdJbihcblx0XHRcdChvTm9kZTogRWxlbWVudCwgb1Zpc2l0b3I6IElDYWxsYmFjaykgPT4gcHJvY2Vzc0J1aWxkaW5nQmxvY2soYnVpbGRpbmdCbG9ja0RlZmluaXRpb24sIG9Ob2RlLCBvVmlzaXRvciwgdHJ1ZSksXG5cdFx0XHRidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5wdWJsaWNOYW1lc3BhY2UsXG5cdFx0XHRidWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi54bWxUYWcgfHwgYnVpbGRpbmdCbG9ja0RlZmluaXRpb24ubmFtZVxuXHRcdCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlRXJyb3JYTUwoZXJyb3JNZXNzYWdlczogc3RyaW5nW10sIHhtbEZyYWdtZW50OiBzdHJpbmcsIGFkZGl0aW9uYWxEYXRhPzogb2JqZWN0LCBzdGFjaz86IHN0cmluZyk6IHN0cmluZyB7XG5cdGNvbnN0IGVycm9yTGFiZWxzID0gZXJyb3JNZXNzYWdlcy5tYXAoKGVycm9yTWVzc2FnZSkgPT4geG1sYDxtOkxhYmVsIHRleHQ9XCIke2VzY2FwZVhNTEF0dHJpYnV0ZVZhbHVlKGVycm9yTWVzc2FnZSl9XCIvPmApO1xuXHRsZXQgZXJyb3JTdGFjayA9IFwiXCI7XG5cdGlmIChzdGFjaykge1xuXHRcdGNvbnN0IHN0YWNrRm9ybWF0dGVkID0gYnRvYShgPHByZT4ke3N0YWNrfTwvcHJlPmApO1xuXHRcdGVycm9yU3RhY2sgPSB4bWxgPG06Rm9ybWF0dGVkVGV4dCBodG1sVGV4dD1cIiR7YHs9IEJCRi5iYXNlNjREZWNvZGUoJyR7c3RhY2tGb3JtYXR0ZWR9JykgfWB9XCIgLz5gO1xuXHR9XG5cdGxldCBhZGRpdGlvbmFsVGV4dCA9IFwiXCI7XG5cdGlmIChhZGRpdGlvbmFsRGF0YSkge1xuXHRcdGFkZGl0aW9uYWxUZXh0ID0geG1sYDxtOlZCb3g+XG5cdFx0XHRcdFx0XHQ8bTpMYWJlbCB0ZXh0PVwiVHJhY2UgSW5mb1wiLz5cblx0XHRcdFx0XHRcdDxjb2RlOkNvZGVFZGl0b3IgdHlwZT1cImpzb25cIiAgdmFsdWU9XCIke2B7PSBCQkYuYmFzZTY0RGVjb2RlKCcke2J0b2EoSlNPTi5zdHJpbmdpZnkoYWRkaXRpb25hbERhdGEsIG51bGwsIDQpKX0nKSB9YH1cIiBoZWlnaHQ9XCIzMDBweFwiIC8+XG5cdFx0XHRcdFx0PC9tOlZCb3g+YDtcblx0fVxuXHRyZXR1cm4geG1sYDxtOlZCb3ggeG1sbnM6bT1cInNhcC5tXCIgeG1sbnM6Y29kZT1cInNhcC51aS5jb2RlZWRpdG9yXCIgY29yZTpyZXF1aXJlPVwie0JCRjonc2FwL2ZlL2NvcmUvYnVpbGRpbmdCbG9ja3MvQnVpbGRpbmdCbG9ja0Zvcm1hdHRlcid9XCI+XG5cdFx0XHRcdCR7ZXJyb3JMYWJlbHN9XG5cdFx0XHRcdCR7ZXJyb3JTdGFja31cblx0XHRcdFx0PGdyaWQ6Q1NTR3JpZCBncmlkVGVtcGxhdGVSb3dzPVwiZnJcIiBncmlkVGVtcGxhdGVDb2x1bW5zPVwicmVwZWF0KDIsMWZyKVwiIGdyaWRHYXA9XCIxcmVtXCIgeG1sbnM6Z3JpZD1cInNhcC51aS5sYXlvdXQuY3NzZ3JpZFwiID5cblx0XHRcdFx0XHQ8bTpWQm94PlxuXHRcdFx0XHRcdFx0PG06TGFiZWwgdGV4dD1cIkhvdyB0aGUgYnVpbGRpbmcgYmxvY2sgd2FzIGNhbGxlZFwiLz5cblx0XHRcdFx0XHRcdDxjb2RlOkNvZGVFZGl0b3IgdHlwZT1cInhtbFwiIHZhbHVlPVwiJHtgez0gQkJGLmJhc2U2NERlY29kZSgnJHtidG9hKHhtbEZyYWdtZW50LnJlcGxhY2VBbGwoXCImZ3Q7XCIsIFwiPlwiKSl9JykgfWB9XCIgaGVpZ2h0PVwiMzAwcHhcIiAvPlxuXHRcdFx0XHRcdDwvbTpWQm94PlxuXHRcdFx0XHRcdCR7YWRkaXRpb25hbFRleHR9XG5cdFx0XHRcdDwvZ3JpZDpDU1NHcmlkPlxuXHRcdFx0PC9tOlZCb3g+YDtcbn1cblxuY29uc3QgbXlTdG9yZTogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuZnVuY3Rpb24gc3RvcmVWYWx1ZSh2YWx1ZXM6IGFueSkge1xuXHRjb25zdCBwcm9wZXJ0eVVJRCA9IGAvdWlkLS0ke3VpZCgpfWA7XG5cdG15U3RvcmVbcHJvcGVydHlVSURdID0gdmFsdWVzO1xuXHRyZXR1cm4gcHJvcGVydHlVSUQ7XG59XG5cbi8qKlxuICogUGFyc2UgYW4gWE1MIHN0cmluZyBhbmQgcmV0dXJuIHRoZSBhc3NvY2lhdGVkIGRvY3VtZW50LlxuICpcbiAqIEBwYXJhbSB4bWxTdHJpbmcgVGhlIHhtbCBzdHJpbmdcbiAqIEBwYXJhbSBhZGREZWZhdWx0TmFtZXNwYWNlcyBXaGV0aGVyIG9yIG5vdCB3ZSBzaG91bGQgYWRkIGRlZmF1bHQgbmFtZXNwYWNlXG4gKiBAcmV0dXJucyBUaGUgWE1MIGRvY3VtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VYTUxTdHJpbmcoeG1sU3RyaW5nOiBzdHJpbmcsIGFkZERlZmF1bHROYW1lc3BhY2VzID0gZmFsc2UpOiBFbGVtZW50IHtcblx0aWYgKGFkZERlZmF1bHROYW1lc3BhY2VzKSB7XG5cdFx0eG1sU3RyaW5nID0gYDx0ZW1wbGF0ZVxuXHRcdFx0XHRcdFx0eG1sbnM6dGVtcGxhdGU9XCJodHRwOi8vc2NoZW1hcy5zYXAuY29tL3NhcHVpNS9leHRlbnNpb24vc2FwLnVpLmNvcmUudGVtcGxhdGUvMVwiXG5cdFx0XHRcdFx0XHR4bWxuczptPVwic2FwLm1cIlxuXHRcdFx0XHRcdFx0eG1sbnM6bWFjcm9zPVwic2FwLmZlLm1hY3Jvc1wiXG5cdFx0XHRcdFx0XHR4bWxuczpjb3JlPVwic2FwLnVpLmNvcmVcIlxuXHRcdFx0XHRcdFx0eG1sbnM6bWRjPVwic2FwLnVpLm1kY1wiXG5cdFx0XHRcdFx0XHR4bWxuczpjdXN0b21EYXRhPVwiaHR0cDovL3NjaGVtYXMuc2FwLmNvbS9zYXB1aTUvZXh0ZW5zaW9uL3NhcC51aS5jb3JlLkN1c3RvbURhdGEvMVwiPiR7eG1sU3RyaW5nfTwvdGVtcGxhdGU+YDtcblx0fVxuXHRjb25zdCB4bWxEb2N1bWVudCA9IERPTVBhcnNlckluc3RhbmNlLnBhcnNlRnJvbVN0cmluZyh4bWxTdHJpbmcsIFwidGV4dC94bWxcIik7XG5cdGxldCBvdXRwdXQgPSB4bWxEb2N1bWVudC5maXJzdEVsZW1lbnRDaGlsZDtcblx0d2hpbGUgKG91dHB1dD8ubG9jYWxOYW1lID09PSBcInRlbXBsYXRlXCIpIHtcblx0XHRvdXRwdXQgPSBvdXRwdXQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cdH1cblx0cmV0dXJuIG91dHB1dCBhcyBFbGVtZW50O1xufVxuXG4vKipcbiAqIEVzY2FwZSBhbiBYTUwgYXR0cmlidXRlIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgYXR0cmlidXRlIHZhbHVlIHRvIGVzY2FwZS5cbiAqIEByZXR1cm5zIFRoZSBlc2NhcGVkIHN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVhNTEF0dHJpYnV0ZVZhbHVlKHZhbHVlPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcblx0cmV0dXJuIHZhbHVlPy5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIikucmVwbGFjZSgvPC9nLCBcIiZsdDtcIikucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIikucmVwbGFjZSgvJy9nLCBcIiZhcG9zO1wiKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVySW5UcmFjZU1vZGUob3V0U3RyOiBzdHJpbmcpIHtcblx0Y29uc3QgeG1sUmVzdWx0ID0gcGFyc2VYTUxTdHJpbmcob3V0U3RyLCB0cnVlKTtcblx0aWYgKHhtbFJlc3VsdCAhPT0gdW5kZWZpbmVkICYmIHhtbFJlc3VsdD8ubG9jYWxOYW1lID09PSBcInBhcnNlcmVycm9yXCIpIHtcblx0XHRjb25zdCBlcnJvck1lc3NhZ2UgPSAoeG1sUmVzdWx0IGFzIGFueSkuaW5uZXJUZXh0IHx8ICh4bWxSZXN1bHQgYXMgYW55KS5pbm5lckhUTUw7XG5cdFx0cmV0dXJuIGNyZWF0ZUVycm9yWE1MKFtlcnJvck1lc3NhZ2Uuc3BsaXQoXCJcXG5cIilbMF1dLCBvdXRTdHIpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBvdXRTdHI7XG5cdH1cbn1cbi8qKlxuICogQ3JlYXRlIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0ZW1wbGF0ZSBsaXRlcmFsIHdoaWxlIGhhbmRsaW5nIHNwZWNpYWwgb2JqZWN0IGNhc2UuXG4gKlxuICogQHBhcmFtIHN0cmluZ3MgVGhlIHN0cmluZyBwYXJ0cyBvZiB0aGUgdGVtcGxhdGUgbGl0ZXJhbFxuICogQHBhcmFtIHZhbHVlcyBUaGUgdmFsdWVzIHBhcnQgb2YgdGhlIHRlbXBsYXRlIGxpdGVyYWxcbiAqIEByZXR1cm5zIFRoZSBYTUwgc3RyaW5nIGRvY3VtZW50IHJlcHJlc2VudGluZyB0aGUgc3RyaW5nIHRoYXQgd2FzIHVzZWQuXG4gKi9cbmV4cG9ydCBjb25zdCB4bWwgPSAoc3RyaW5nczogVGVtcGxhdGVTdHJpbmdzQXJyYXksIC4uLnZhbHVlczogYW55W10pID0+IHtcblx0bGV0IG91dFN0ciA9IFwiXCI7XG5cdGxldCBpO1xuXHRmb3IgKGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0b3V0U3RyICs9IHN0cmluZ3NbaV07XG5cblx0XHQvLyBIYW5kbGUgdGhlIGRpZmZlcmVudCBjYXNlIG9mIG9iamVjdCwgaWYgaXQncyBhbiBhcnJheSB3ZSBqb2luIHRoZW0sIGlmIGl0J3MgYSBiaW5kaW5nIGV4cHJlc3Npb24gKGRldGVybWluZWQgYnkgX3R5cGUpIHRoZW4gd2UgY29tcGlsZSBpdC5cblx0XHRjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcblxuXHRcdGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPiAwICYmIHR5cGVvZiB2YWx1ZVswXSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0b3V0U3RyICs9IHZhbHVlLmZsYXQoNSkuam9pbihcIlxcblwiKS50cmltKCk7XG5cdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPiAwICYmIHR5cGVvZiB2YWx1ZVswXSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRvdXRTdHIgKz0gdmFsdWUubWFwKCh2YWx1ZWZuKSA9PiB2YWx1ZWZuKCkpLmpvaW4oXCJcXG5cIik7XG5cdFx0fSBlbHNlIGlmICh2YWx1ZT8uX3R5cGUpIHtcblx0XHRcdGNvbnN0IGNvbXBpbGVkRXhwcmVzc2lvbiA9IGNvbXBpbGVFeHByZXNzaW9uKHZhbHVlKTtcblx0XHRcdG91dFN0ciArPSBlc2NhcGVYTUxBdHRyaWJ1dGVWYWx1ZShjb21waWxlZEV4cHJlc3Npb24pO1xuXHRcdH0gZWxzZSBpZiAodmFsdWU/LmdldFRlbXBsYXRlKSB7XG5cdFx0XHRvdXRTdHIgKz0gdmFsdWUuZ2V0VGVtcGxhdGUoKTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0b3V0U3RyICs9IFwie3RoaXM+dW5kZWZpbmVkVmFsdWV9XCI7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0b3V0U3RyICs9IHZhbHVlKCk7XG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHtcblx0XHRcdGlmICh2YWx1ZS5pc0E/LihcInNhcC51aS5tb2RlbC5Db250ZXh0XCIpKSB7XG5cdFx0XHRcdG91dFN0ciArPSB2YWx1ZS5nZXRQYXRoKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBwcm9wZXJ0eVVJZCA9IHN0b3JlVmFsdWUodmFsdWUpO1xuXHRcdFx0XHRvdXRTdHIgKz0gYCR7cHJvcGVydHlVSWR9YDtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiAhdmFsdWUuc3RhcnRzV2l0aChcIjxcIikgJiYgIXZhbHVlLnN0YXJ0c1dpdGgoXCImbHQ7XCIpKSB7XG5cdFx0XHRvdXRTdHIgKz0gZXNjYXBlWE1MQXR0cmlidXRlVmFsdWUodmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRvdXRTdHIgKz0gdmFsdWU7XG5cdFx0fVxuXHR9XG5cdG91dFN0ciArPSBzdHJpbmdzW2ldO1xuXHRvdXRTdHIgPSBvdXRTdHIudHJpbSgpO1xuXHRpZiAoaXNUcmFjZU1vZGUpIHtcblx0XHRyZXR1cm4gcmVuZGVySW5UcmFjZU1vZGUob3V0U3RyKTtcblx0fVxuXHRyZXR1cm4gb3V0U3RyO1xufTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7OztFQXdLTyxnQkFBZ0JBLE1BQWhCLEVBQXdCQyxJQUF4QixFQUE4QkMsS0FBOUIsRUFBcUM7SUFDM0MsSUFBSSxPQUFPRixNQUFNLGlCQUFiLEtBQW1DLFVBQXZDLEVBQW1EO01BQ2xELElBQUlHLFFBQVEsR0FBR0gsTUFBTSxpQkFBTixFQUFmO01BQUEs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