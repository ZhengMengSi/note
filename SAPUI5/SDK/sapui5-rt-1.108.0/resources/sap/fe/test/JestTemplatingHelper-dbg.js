/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["@sap/cds-compiler", "fs", "path", "prettier", "sap/base/Log", "sap/base/util/merge", "sap/fe/core/buildingBlocks/BuildingBlockRuntime", "sap/fe/core/converters/ConverterContext", "sap/fe/core/services/SideEffectsServiceFactory", "sap/fe/core/TemplateModel", "sap/ui/base/BindingParser", "sap/ui/core/Component", "sap/ui/core/InvisibleText", "sap/ui/core/util/serializer/Serializer", "sap/ui/core/util/XMLPreprocessor", "sap/ui/fl/apply/_internal/flexState/FlexState", "sap/ui/fl/apply/_internal/preprocessors/XmlPreprocessor", "sap/ui/fl/initial/_internal/Storage", "sap/ui/fl/Utils", "sap/ui/model/json/JSONModel", "sap/ui/model/odata/v4/lib/_MetadataRequestor", "sap/ui/model/odata/v4/ODataMetaModel", "xpath"], function (compiler, fs, path, prettier, Log, merge, BuildingBlockRuntime, ConverterContext, SideEffectsFactory, TemplateModel, BindingParser, Component, InvisibleText, Serializer, XMLPreprocessor, FlexState, XmlPreprocessor, AppStorage, Utils, JSONModel, _MetadataRequestor, ODataMetaModel, xpath) {
  "use strict";

  var _exports = {};
  var registerBuildingBlock = BuildingBlockRuntime.registerBuildingBlock;
  var format = prettier.format;

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function () {}; return { s: F, n: function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function (e) { throw e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function () { it = it.call(o); }, n: function () { var step = it.next(); normalCompletion = step.done; return step; }, e: function (e) { didErr = true; err = e; }, f: function () { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Process the requested XML fragment with the provided data.
   *
   * @param name Fully qualified name of the fragment to be tested.
   * @param testData Test data consisting
   * @returns Templated fragment as string
   */
  var processFragment = function (name, testData) {
    try {
      var inputXml = "<root><core:Fragment fragmentName=\"".concat(name, "\" type=\"XML\" xmlns:core=\"sap.ui.core\" /></root>");
      var parser = new window.DOMParser();
      var inputDoc = parser.parseFromString(inputXml, "text/xml"); // build model and bindings for given test data

      var settings = {
        models: {},
        bindingContexts: {}
      };

      for (var _model2 in testData) {
        var jsonModel = new JSONModel();
        jsonModel.setData(testData[_model2]);
        settings.models[_model2] = jsonModel;
        settings.bindingContexts[_model2] = settings.models[_model2].createBindingContext("/");
      } // execute the pre-processor


      return Promise.resolve(XMLPreprocessor.process(inputDoc.firstElementChild, {
        name: name
      }, settings)).then(function (resultDoc) {
        // exclude nested fragments from test snapshots
        var fragments = resultDoc.getElementsByTagName("core:Fragment");

        if ((fragments === null || fragments === void 0 ? void 0 : fragments.length) > 0) {
          var _iterator = _createForOfIteratorHelper(fragments),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var fragment = _step.value;
              fragment.innerHTML = "";
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } // Keep the fragment result as child of root node when fragment generates multiple root controls


        var xmlResult = resultDoc.children.length > 1 ? resultDoc.outerHTML : resultDoc.innerHTML;
        return formatXml(xmlResult, {
          filter: function (node) {
            return node.type !== "Comment";
          }
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.processFragment = processFragment;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  var formatXml = require("xml-formatter");

  Log.setLevel(1, "sap.ui.core.util.XMLPreprocessor");
  jest.setTimeout(40000);
  var nameSpaceMap = {
    "macros": "sap.fe.macros",
    "macro": "sap.fe.macros",
    "macroField": "sap.fe.macros.field",
    "macrodata": "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
    "log": "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1",
    "unittest": "http://schemas.sap.com/sapui5/preprocessorextension/sap.fe.unittesting/1",
    "control": "sap.fe.core.controls",
    "core": "sap.ui.core",
    "m": "sap.m",
    "f": "sap.ui.layout.form",
    "internalMacro": "sap.fe.macros.internal",
    "mdc": "sap.ui.mdc",
    "mdcat": "sap.ui.mdc.actiontoolbar",
    "mdcField": "sap.ui.mdc.field",
    "mdcTable": "sap.ui.mdc.table",
    "u": "sap.ui.unified",
    "macroMicroChart": "sap.fe.macros.microchart",
    "microChart": "sap.suite.ui.microchart",
    "macroTable": "sap.fe.macros.table"
  };
  var select = xpath.useNamespaces(nameSpaceMap);

  var registerMacro = function (macroMetadata) {
    registerBuildingBlock(macroMetadata);
  };

  _exports.registerMacro = registerMacro;

  var unregisterMacro = function (macroMetadata) {
    XMLPreprocessor.plugIn(null, macroMetadata.namespace, macroMetadata.name);

    if (macroMetadata.publicNamespace) {
      XMLPreprocessor.plugIn(null, macroMetadata.publicNamespace, macroMetadata.name);
    }
  };

  _exports.unregisterMacro = unregisterMacro;

  var runXPathQuery = function (selector, xmldom) {
    return select(selector, xmldom);
  };

  expect.extend({
    toHaveControl: function (xmldom, selector) {
      var nodes = runXPathQuery("/root".concat(selector), xmldom);
      return {
        message: function () {
          var outputXml = serializeXML(xmldom);
          return "did not find controls matching ".concat(selector, " in generated xml:\n ").concat(outputXml);
        },
        pass: nodes && nodes.length >= 1
      };
    },
    toNotHaveControl: function (xmldom, selector) {
      var nodes = runXPathQuery("/root".concat(selector), xmldom);
      return {
        message: function () {
          var outputXml = serializeXML(xmldom);
          return "There is a control matching ".concat(selector, " in generated xml:\n ").concat(outputXml);
        },
        pass: nodes && nodes.length === 0
      };
    }
  });
  _exports.runXPathQuery = runXPathQuery;

  var formatBuildingBlockXML = function (xmlString) {
    if (Array.isArray(xmlString)) {
      xmlString = xmlString.join("");
    }

    var xmlFormatted = formatXML(xmlString);
    xmlFormatted = xmlFormatted.replace(/uid--id-[0-9]{13}-[0-9]{1,2}/g, "uid--id");
    return xmlFormatted;
  };

  _exports.formatBuildingBlockXML = formatBuildingBlockXML;

  var getControlAttribute = function (controlSelector, attributeName, xmlDom) {
    var selector = "string(/root".concat(controlSelector, "/@").concat(attributeName, ")");
    return runXPathQuery(selector, xmlDom);
  };

  _exports.getControlAttribute = getControlAttribute;

  var serializeXML = function (xmlDom) {
    var serializer = new window.XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDom);
    return formatXML(xmlString);
  };

  _exports.serializeXML = serializeXML;

  var formatXML = function (xmlString) {
    return format(xmlString, {
      parser: "xml",
      xmlWhitespaceSensitivity: "ignore"
    }
    /* options by the Prettier XML plugin */
    );
  };
  /**
   * Compile a CDS file into an EDMX file.
   *
   * @param cdsUrl The path to the file containing the CDS definition. This file must declare the namespace
   * sap.fe.test and a service JestService
   * @param options Options for creating the EDMX output
   * @param edmxFileName Allows you to override the name of the compiled EDMX metadata file
   * @returns The path of the generated EDMX
   */


  _exports.formatXML = formatXML;

  var compileCDS = function (cdsUrl) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var edmxFileName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : path.basename(cdsUrl).replace(".cds", ".xml");
    var cdsString = fs.readFileSync(cdsUrl, "utf-8");
    var edmxContent = cds2edmx(cdsString, "sap.fe.test.JestService", options);
    var dir = path.resolve(cdsUrl, "..", "gen");
    var edmxFilePath = path.resolve(dir, edmxFileName);
    fs.mkdirSync(dir, {
      recursive: true
    });
    fs.writeFileSync(edmxFilePath, edmxContent);
    return edmxFilePath;
  };
  /**
   * Compile CDS to EDMX.
   *
   * @param cds The CDS model. It must define at least one service.
   * @param service The fully-qualified name of the service to be compiled. Defaults to "sap.fe.test.JestService".
   * @param options Options for creating the EDMX output
   * @returns The compiled service model as EDMX.
   */


  _exports.compileCDS = compileCDS;

  function cds2edmx(cds) {
    var service = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "sap.fe.test.JestService";
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var sources = {
      "source.cds": cds
    }; // allow to include stuff from @sap/cds/common

    if (cds.includes("'@sap/cds/common'")) {
      sources["common.cds"] = fs.readFileSync(require.resolve("@sap/cds/common.cds"), "utf-8");
    }

    var csn = compiler.compileSources(sources, {});

    var edmxOptions = _objectSpread(_objectSpread({
      odataForeignKeys: true,
      odataFormat: "structured",
      odataContainment: false
    }, options), {}, {
      service: service
    });

    var edmx = compiler.to.edmx(csn, edmxOptions);

    if (!edmx) {
      throw new Error("Compilation failed. Hint: Make sure that the CDS model defines service ".concat(service, "."));
    }

    return edmx;
  }

  _exports.cds2edmx = cds2edmx;

  var getFakeSideEffectsService = function (oMetaModel) {
    try {
      var oServiceContext = {
        scopeObject: {},
        scopeType: "",
        settings: {}
      };
      return Promise.resolve(new SideEffectsFactory().createInstance(oServiceContext).then(function (oServiceInstance) {
        var oJestSideEffectsService = oServiceInstance.getInterface();

        oJestSideEffectsService.getContext = function () {
          return {
            scopeObject: {
              getModel: function () {
                return {
                  getMetaModel: function () {
                    return oMetaModel;
                  }
                };
              }
            }
          };
        };

        return oJestSideEffectsService;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.getFakeSideEffectsService = getFakeSideEffectsService;

  var getFakeDiagnostics = function () {
    var issues = [];
    return {
      addIssue: function (issueCategory, issueSeverity, details) {
        issues.push({
          issueCategory: issueCategory,
          issueSeverity: issueSeverity,
          details: details
        });
      },
      getIssues: function () {
        return issues;
      },
      checkIfIssueExists: function (issueCategory, issueSeverity, details) {
        return issues.find(function (issue) {
          return issue.issueCategory === issueCategory && issue.issueSeverity === issueSeverity && issue.details === details;
        });
      }
    };
  };

  _exports.getFakeDiagnostics = getFakeDiagnostics;

  var getConverterContextForTest = function (convertedTypes, manifestSettings) {
    var entitySet = convertedTypes.entitySets.find(function (es) {
      return es.name === manifestSettings.entitySet;
    });
    var dataModelPath = getDataModelObjectPathForProperty(entitySet, convertedTypes, entitySet);
    return new ConverterContext(convertedTypes, manifestSettings, getFakeDiagnostics(), merge, dataModelPath);
  };

  _exports.getConverterContextForTest = getConverterContextForTest;
  var metaModelCache = {};

  var getMetaModel = function (sMetadataUrl) {
    try {
      function _temp3() {
        return metaModelCache[sMetadataUrl];
      }

      var oRequestor = _MetadataRequestor.create({}, "4.0", {});

      var _temp4 = function () {
        if (!metaModelCache[sMetadataUrl]) {
          var oMetaModel = new ODataMetaModel(oRequestor, sMetadataUrl, undefined, null);
          return Promise.resolve(oMetaModel.fetchEntityContainer()).then(function () {
            metaModelCache[sMetadataUrl] = oMetaModel;
          });
        }
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.getMetaModel = getMetaModel;

  var getDataModelObjectPathForProperty = function (entitySet, convertedTypes, property) {
    var targetPath = {
      startingEntitySet: entitySet,
      navigationProperties: [],
      targetObject: property,
      targetEntitySet: entitySet,
      targetEntityType: entitySet.entityType,
      convertedTypes: convertedTypes
    };
    targetPath.contextLocation = targetPath;
    return targetPath;
  };

  _exports.getDataModelObjectPathForProperty = getDataModelObjectPathForProperty;

  var evaluateBinding = function (bindingString) {
    var bindingElement = BindingParser.complexParser(bindingString);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return bindingElement.formatter.apply(undefined, args);
  };

  _exports.evaluateBinding = evaluateBinding;

  /**
   * Evaluate a binding against a model.
   *
   * @param bindingString The binding string.
   * @param modelContent Content of the default model to use for evaluation.
   * @param namedModelsContent Contents of additional, named models to use.
   * @returns The evaluated binding.
   */
  function evaluateBindingWithModel(bindingString, modelContent, namedModelsContent) {
    var bindingElement = BindingParser.complexParser(bindingString);
    var text = new InvisibleText();
    text.bindProperty("text", bindingElement);
    var defaultModel = new JSONModel(modelContent);
    text.setModel(defaultModel);
    text.setBindingContext(defaultModel.createBindingContext("/"));

    if (namedModelsContent) {
      for (var _i = 0, _Object$entries = Object.entries(namedModelsContent); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            _name = _Object$entries$_i[0],
            content = _Object$entries$_i[1];

        var _model = new JSONModel(content);

        text.setModel(_model, _name);
        text.setBindingContext(_model.createBindingContext("/"), _name);
      }
    }

    return text.getText();
  }

  _exports.evaluateBindingWithModel = evaluateBindingWithModel;
  var TESTVIEWID = "testViewId";

  var applyFlexChanges = function (aVariantDependentControlChanges, oMetaModel, resultXML, createChangesObject) {
    try {
      var changes = createChangesObject(TESTVIEWID, aVariantDependentControlChanges);
      var appId = "someComponent";
      var oManifest = {
        "sap.app": {
          id: appId,
          type: "application",
          crossNavigation: {
            outbounds: []
          }
        }
      };
      var oAppComponent = {
        getDiagnostics: jest.fn().mockReturnValue(getFakeDiagnostics()),
        getModel: jest.fn().mockReturnValue({
          getMetaModel: jest.fn().mockReturnValue(oMetaModel)
        }),
        getComponentData: jest.fn().mockReturnValue({}),
        getManifestObject: jest.fn().mockReturnValue({
          getEntry: function (name) {
            return oManifest[name];
          }
        })
      }; //fake changes

      jest.spyOn(AppStorage, "loadFlexData").mockReturnValue(Promise.resolve(changes));
      jest.spyOn(Component, "get").mockReturnValue(oAppComponent);
      jest.spyOn(Utils, "getAppComponentForControl").mockReturnValue(oAppComponent);
      return Promise.resolve(FlexState.initialize({
        componentId: appId
      })).then(function () {
        return Promise.resolve(XmlPreprocessor.process(resultXML, {
          name: "Test Fragment",
          componentId: appId,
          id: TESTVIEWID
        })).then(function (_XmlPreprocessor$proc) {
          resultXML = _XmlPreprocessor$proc;
          return resultXML;
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.applyFlexChanges = applyFlexChanges;

  var getChangesFromXML = function (xml) {
    return _toConsumableArray(xml.querySelectorAll("*")).flatMap(function (e) {
      return _toConsumableArray(e.attributes).map(function (a) {
        return a.name;
      });
    }).filter(function (attr) {
      return attr.includes("sap.ui.fl.appliedChanges");
    });
  };

  _exports.getChangesFromXML = getChangesFromXML;

  var getTemplatingResult = function (xmlInput, sMetadataUrl, mBindingContexts, mModels, aVariantDependentControlChanges, createChangesObject) {
    try {
      var templatedXml = "<root>".concat(xmlInput, "</root>");
      var parser = new window.DOMParser();
      var xmlDoc = parser.parseFromString(templatedXml, "text/xml"); // To ensure our macro can use #setBindingContext we ensure there is a pre existing JSONModel for converterContext
      // if not already passed to teh templating

      return Promise.resolve(getMetaModel(sMetadataUrl)).then(function (oMetaModel) {
        if (!mModels.hasOwnProperty("converterContext")) {
          mModels = Object.assign(mModels, {
            "converterContext": new TemplateModel({}, oMetaModel)
          });
        }

        Object.keys(mModels).forEach(function (sModelName) {
          if (mModels[sModelName] && mModels[sModelName].isTemplateModel) {
            mModels[sModelName] = new TemplateModel(mModels[sModelName].data, oMetaModel);
          }
        });
        var oPreprocessorSettings = {
          models: Object.assign({
            metaModel: oMetaModel
          }, mModels),
          bindingContexts: {}
        }; //Inject models and bindingContexts

        Object.keys(mBindingContexts).forEach(function (sKey) {
          /* Assert to make sure the annotations are in the test metadata -> avoid misleading tests */
          expect(typeof oMetaModel.getObject(mBindingContexts[sKey])).toBeDefined();
          var oModel = mModels[sKey] || oMetaModel;
          oPreprocessorSettings.bindingContexts[sKey] = oModel.createBindingContext(mBindingContexts[sKey]); //Value is sPath

          oPreprocessorSettings.models[sKey] = oModel;
        }); //This context for macro testing

        if (oPreprocessorSettings.models["this"]) {
          oPreprocessorSettings.bindingContexts["this"] = oPreprocessorSettings.models["this"].createBindingContext("/");
        }

        return Promise.resolve(XMLPreprocessor.process(xmlDoc.firstElementChild, {
          name: "Test Fragment"
        }, oPreprocessorSettings)).then(function (resultXML) {
          var _temp5 = function () {
            if (aVariantDependentControlChanges && createChangesObject) {
              // prefix Ids
              _toConsumableArray(resultXML.querySelectorAll("[id]")).forEach(function (node) {
                node.id = "".concat(TESTVIEWID, "--").concat(node.id);
              }); // apply flex changes


              return Promise.resolve(applyFlexChanges(aVariantDependentControlChanges, oMetaModel, resultXML, createChangesObject)).then(function (_applyFlexChanges) {
                resultXML = _applyFlexChanges;
                //Assert that all changes have been applied
                var changesApplied = getChangesFromXML(resultXML);
                expect(changesApplied.length).toBe(aVariantDependentControlChanges.length);
              });
            }
          }();

          return _temp5 && _temp5.then ? _temp5.then(function () {
            return resultXML;
          }) : resultXML;
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.getTemplatingResult = getTemplatingResult;

  var getTemplatedXML = function (xmlInput, sMetadataUrl, mBindingContexts, mModels, aVariantDependentControlChanges, createChangesObject) {
    try {
      return Promise.resolve(getTemplatingResult(xmlInput, sMetadataUrl, mBindingContexts, mModels, aVariantDependentControlChanges, createChangesObject)).then(serializeXML);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _exports.getTemplatedXML = getTemplatedXML;

  function serializeControl(controlToSerialize) {
    var tabCount = 0;

    function getTab() {
      var toAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var tab = "";

      for (var i = 0; i < tabCount + toAdd; i++) {
        tab += "\t";
      }

      return tab;
    }

    var serializeDelegate = {
      start: function (control, sAggregationName) {
        var controlDetail = "";

        if (sAggregationName) {
          if (control.getParent()) {
            var indexInParent = control.getParent().getAggregation(sAggregationName).indexOf(control);

            if (indexInParent > 0) {
              controlDetail += ",\n".concat(getTab());
            }
          }
        }

        controlDetail += "".concat(control.getMetadata().getName(), "(");
        return controlDetail;
      },
      end: function () {
        return "})";
      },
      middle: function (control) {
        var data = "{id: ".concat(control.getId());

        for (var oControlKey in control.mProperties) {
          if (control.mProperties.hasOwnProperty(oControlKey)) {
            data += ",\n".concat(getTab(), " ").concat(oControlKey, ": ").concat(control.mProperties[oControlKey]);
          } else if (control.mBindingInfos.hasOwnProperty(oControlKey)) {
            var bindingDetail = control.mBindingInfos[oControlKey];
            data += ",\n".concat(getTab(), " ").concat(oControlKey, ": formatter(").concat(bindingDetail.parts.map(function (bindingInfo) {
              return "\n".concat(getTab(1)).concat(bindingInfo.model ? bindingInfo.model : "", ">").concat(bindingInfo.path);
            }), ")");
          }
        }

        for (var _oControlKey in control.mAssociations) {
          if (control.mAssociations.hasOwnProperty(_oControlKey)) {
            data += ",\n".concat(getTab(), " ").concat(_oControlKey, ": ").concat(control.mAssociations[_oControlKey][0]);
          }
        }

        data += "";
        return data;
      },
      startAggregation: function (control, sName) {
        var out = ",\n".concat(getTab()).concat(sName);
        tabCount++;

        if (control.mBindingInfos[sName]) {
          out += "={ path:'".concat(control.mBindingInfos[sName].path, "', template:\n").concat(getTab());
        } else {
          out += "=[\n".concat(getTab());
        }

        return out;
      },
      endAggregation: function (control, sName) {
        tabCount--;

        if (control.mBindingInfos[sName]) {
          return "\n".concat(getTab(), "}");
        } else {
          return "\n".concat(getTab(), "]");
        }
      }
    };

    if (Array.isArray(controlToSerialize)) {
      return controlToSerialize.map(function (controlToRender) {
        return new Serializer(controlToRender, serializeDelegate).serialize();
      });
    } else {
      return new Serializer(controlToSerialize, serializeDelegate).serialize();
    }
  }

  _exports.serializeControl = serializeControl;

  function createAwaiter() {
    var fnResolve;
    var myPromise = new Promise(function (resolve) {
      fnResolve = resolve;
    });
    return {
      promise: myPromise,
      resolve: fnResolve
    };
  }

  _exports.createAwaiter = createAwaiter;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJwcm9jZXNzRnJhZ21lbnQiLCJuYW1lIiwidGVzdERhdGEiLCJpbnB1dFhtbCIsInBhcnNlciIsIndpbmRvdyIsIkRPTVBhcnNlciIsImlucHV0RG9jIiwicGFyc2VGcm9tU3RyaW5nIiwic2V0dGluZ3MiLCJtb2RlbHMiLCJiaW5kaW5nQ29udGV4dHMiLCJtb2RlbCIsImpzb25Nb2RlbCIsIkpTT05Nb2RlbCIsInNldERhdGEiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsIlhNTFByZXByb2Nlc3NvciIsInByb2Nlc3MiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInJlc3VsdERvYyIsImZyYWdtZW50cyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwibGVuZ3RoIiwiZnJhZ21lbnQiLCJpbm5lckhUTUwiLCJ4bWxSZXN1bHQiLCJjaGlsZHJlbiIsIm91dGVySFRNTCIsImZvcm1hdFhtbCIsImZpbHRlciIsIm5vZGUiLCJ0eXBlIiwicmVxdWlyZSIsIkxvZyIsInNldExldmVsIiwiamVzdCIsInNldFRpbWVvdXQiLCJuYW1lU3BhY2VNYXAiLCJzZWxlY3QiLCJ4cGF0aCIsInVzZU5hbWVzcGFjZXMiLCJyZWdpc3Rlck1hY3JvIiwibWFjcm9NZXRhZGF0YSIsInJlZ2lzdGVyQnVpbGRpbmdCbG9jayIsInVucmVnaXN0ZXJNYWNybyIsInBsdWdJbiIsIm5hbWVzcGFjZSIsInB1YmxpY05hbWVzcGFjZSIsInJ1blhQYXRoUXVlcnkiLCJzZWxlY3RvciIsInhtbGRvbSIsImV4cGVjdCIsImV4dGVuZCIsInRvSGF2ZUNvbnRyb2wiLCJub2RlcyIsIm1lc3NhZ2UiLCJvdXRwdXRYbWwiLCJzZXJpYWxpemVYTUwiLCJwYXNzIiwidG9Ob3RIYXZlQ29udHJvbCIsImZvcm1hdEJ1aWxkaW5nQmxvY2tYTUwiLCJ4bWxTdHJpbmciLCJBcnJheSIsImlzQXJyYXkiLCJqb2luIiwieG1sRm9ybWF0dGVkIiwiZm9ybWF0WE1MIiwicmVwbGFjZSIsImdldENvbnRyb2xBdHRyaWJ1dGUiLCJjb250cm9sU2VsZWN0b3IiLCJhdHRyaWJ1dGVOYW1lIiwieG1sRG9tIiwic2VyaWFsaXplciIsIlhNTFNlcmlhbGl6ZXIiLCJzZXJpYWxpemVUb1N0cmluZyIsImZvcm1hdCIsInhtbFdoaXRlc3BhY2VTZW5zaXRpdml0eSIsImNvbXBpbGVDRFMiLCJjZHNVcmwiLCJvcHRpb25zIiwiZWRteEZpbGVOYW1lIiwicGF0aCIsImJhc2VuYW1lIiwiY2RzU3RyaW5nIiwiZnMiLCJyZWFkRmlsZVN5bmMiLCJlZG14Q29udGVudCIsImNkczJlZG14IiwiZGlyIiwicmVzb2x2ZSIsImVkbXhGaWxlUGF0aCIsIm1rZGlyU3luYyIsInJlY3Vyc2l2ZSIsIndyaXRlRmlsZVN5bmMiLCJjZHMiLCJzZXJ2aWNlIiwic291cmNlcyIsImluY2x1ZGVzIiwiY3NuIiwiY29tcGlsZXIiLCJjb21waWxlU291cmNlcyIsImVkbXhPcHRpb25zIiwib2RhdGFGb3JlaWduS2V5cyIsIm9kYXRhRm9ybWF0Iiwib2RhdGFDb250YWlubWVudCIsImVkbXgiLCJ0byIsIkVycm9yIiwiZ2V0RmFrZVNpZGVFZmZlY3RzU2VydmljZSIsIm9NZXRhTW9kZWwiLCJvU2VydmljZUNvbnRleHQiLCJzY29wZU9iamVjdCIsInNjb3BlVHlwZSIsIlNpZGVFZmZlY3RzRmFjdG9yeSIsImNyZWF0ZUluc3RhbmNlIiwidGhlbiIsIm9TZXJ2aWNlSW5zdGFuY2UiLCJvSmVzdFNpZGVFZmZlY3RzU2VydmljZSIsImdldEludGVyZmFjZSIsImdldENvbnRleHQiLCJnZXRNb2RlbCIsImdldE1ldGFNb2RlbCIsImdldEZha2VEaWFnbm9zdGljcyIsImlzc3VlcyIsImFkZElzc3VlIiwiaXNzdWVDYXRlZ29yeSIsImlzc3VlU2V2ZXJpdHkiLCJkZXRhaWxzIiwicHVzaCIsImdldElzc3VlcyIsImNoZWNrSWZJc3N1ZUV4aXN0cyIsImZpbmQiLCJpc3N1ZSIsImdldENvbnZlcnRlckNvbnRleHRGb3JUZXN0IiwiY29udmVydGVkVHlwZXMiLCJtYW5pZmVzdFNldHRpbmdzIiwiZW50aXR5U2V0IiwiZW50aXR5U2V0cyIsImVzIiwiZGF0YU1vZGVsUGF0aCIsImdldERhdGFNb2RlbE9iamVjdFBhdGhGb3JQcm9wZXJ0eSIsIkNvbnZlcnRlckNvbnRleHQiLCJtZXJnZSIsIm1ldGFNb2RlbENhY2hlIiwic01ldGFkYXRhVXJsIiwib1JlcXVlc3RvciIsIl9NZXRhZGF0YVJlcXVlc3RvciIsImNyZWF0ZSIsIk9EYXRhTWV0YU1vZGVsIiwidW5kZWZpbmVkIiwiZmV0Y2hFbnRpdHlDb250YWluZXIiLCJwcm9wZXJ0eSIsInRhcmdldFBhdGgiLCJzdGFydGluZ0VudGl0eVNldCIsIm5hdmlnYXRpb25Qcm9wZXJ0aWVzIiwidGFyZ2V0T2JqZWN0IiwidGFyZ2V0RW50aXR5U2V0IiwidGFyZ2V0RW50aXR5VHlwZSIsImVudGl0eVR5cGUiLCJjb250ZXh0TG9jYXRpb24iLCJldmFsdWF0ZUJpbmRpbmciLCJiaW5kaW5nU3RyaW5nIiwiYmluZGluZ0VsZW1lbnQiLCJCaW5kaW5nUGFyc2VyIiwiY29tcGxleFBhcnNlciIsImFyZ3MiLCJmb3JtYXR0ZXIiLCJhcHBseSIsImV2YWx1YXRlQmluZGluZ1dpdGhNb2RlbCIsIm1vZGVsQ29udGVudCIsIm5hbWVkTW9kZWxzQ29udGVudCIsInRleHQiLCJJbnZpc2libGVUZXh0IiwiYmluZFByb3BlcnR5IiwiZGVmYXVsdE1vZGVsIiwic2V0TW9kZWwiLCJzZXRCaW5kaW5nQ29udGV4dCIsIk9iamVjdCIsImVudHJpZXMiLCJjb250ZW50IiwiZ2V0VGV4dCIsIlRFU1RWSUVXSUQiLCJhcHBseUZsZXhDaGFuZ2VzIiwiYVZhcmlhbnREZXBlbmRlbnRDb250cm9sQ2hhbmdlcyIsInJlc3VsdFhNTCIsImNyZWF0ZUNoYW5nZXNPYmplY3QiLCJjaGFuZ2VzIiwiYXBwSWQiLCJvTWFuaWZlc3QiLCJpZCIsImNyb3NzTmF2aWdhdGlvbiIsIm91dGJvdW5kcyIsIm9BcHBDb21wb25lbnQiLCJnZXREaWFnbm9zdGljcyIsImZuIiwibW9ja1JldHVyblZhbHVlIiwiZ2V0Q29tcG9uZW50RGF0YSIsImdldE1hbmlmZXN0T2JqZWN0IiwiZ2V0RW50cnkiLCJzcHlPbiIsIkFwcFN0b3JhZ2UiLCJQcm9taXNlIiwiQ29tcG9uZW50IiwiVXRpbHMiLCJGbGV4U3RhdGUiLCJpbml0aWFsaXplIiwiY29tcG9uZW50SWQiLCJYbWxQcmVwcm9jZXNzb3IiLCJnZXRDaGFuZ2VzRnJvbVhNTCIsInhtbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmbGF0TWFwIiwiZSIsImF0dHJpYnV0ZXMiLCJtYXAiLCJhIiwiYXR0ciIsImdldFRlbXBsYXRpbmdSZXN1bHQiLCJ4bWxJbnB1dCIsIm1CaW5kaW5nQ29udGV4dHMiLCJtTW9kZWxzIiwidGVtcGxhdGVkWG1sIiwieG1sRG9jIiwiaGFzT3duUHJvcGVydHkiLCJhc3NpZ24iLCJUZW1wbGF0ZU1vZGVsIiwia2V5cyIsImZvckVhY2giLCJzTW9kZWxOYW1lIiwiaXNUZW1wbGF0ZU1vZGVsIiwiZGF0YSIsIm9QcmVwcm9jZXNzb3JTZXR0aW5ncyIsIm1ldGFNb2RlbCIsInNLZXkiLCJnZXRPYmplY3QiLCJ0b0JlRGVmaW5lZCIsIm9Nb2RlbCIsImNoYW5nZXNBcHBsaWVkIiwidG9CZSIsImdldFRlbXBsYXRlZFhNTCIsInNlcmlhbGl6ZUNvbnRyb2wiLCJjb250cm9sVG9TZXJpYWxpemUiLCJ0YWJDb3VudCIsImdldFRhYiIsInRvQWRkIiwidGFiIiwiaSIsInNlcmlhbGl6ZURlbGVnYXRlIiwic3RhcnQiLCJjb250cm9sIiwic0FnZ3JlZ2F0aW9uTmFtZSIsImNvbnRyb2xEZXRhaWwiLCJnZXRQYXJlbnQiLCJpbmRleEluUGFyZW50IiwiZ2V0QWdncmVnYXRpb24iLCJpbmRleE9mIiwiZ2V0TWV0YWRhdGEiLCJnZXROYW1lIiwiZW5kIiwibWlkZGxlIiwiZ2V0SWQiLCJvQ29udHJvbEtleSIsIm1Qcm9wZXJ0aWVzIiwibUJpbmRpbmdJbmZvcyIsImJpbmRpbmdEZXRhaWwiLCJwYXJ0cyIsImJpbmRpbmdJbmZvIiwibUFzc29jaWF0aW9ucyIsInN0YXJ0QWdncmVnYXRpb24iLCJzTmFtZSIsIm91dCIsImVuZEFnZ3JlZ2F0aW9uIiwiY29udHJvbFRvUmVuZGVyIiwiU2VyaWFsaXplciIsInNlcmlhbGl6ZSIsImNyZWF0ZUF3YWl0ZXIiLCJmblJlc29sdmUiLCJteVByb21pc2UiLCJwcm9taXNlIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJKZXN0VGVtcGxhdGluZ0hlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFueUFubm90YXRpb24sIENvbnZlcnRlZE1ldGFkYXRhLCBFbnRpdHlTZXQsIFByb3BlcnR5IH0gZnJvbSBcIkBzYXAtdXgvdm9jYWJ1bGFyaWVzLXR5cGVzXCI7XG5pbXBvcnQgY29tcGlsZXIgZnJvbSBcIkBzYXAvY2RzLWNvbXBpbGVyXCI7XG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB0eXBlIHsgUmVxdWlyZWRPcHRpb25zIH0gZnJvbSBcInByZXR0aWVyXCI7XG5pbXBvcnQgeyBmb3JtYXQgfSBmcm9tIFwicHJldHRpZXJcIjtcbmltcG9ydCBMb2cgZnJvbSBcInNhcC9iYXNlL0xvZ1wiO1xuaW1wb3J0IG1lcmdlIGZyb20gXCJzYXAvYmFzZS91dGlsL21lcmdlXCI7XG5pbXBvcnQgQXBwQ29tcG9uZW50IGZyb20gXCJzYXAvZmUvY29yZS9BcHBDb21wb25lbnRcIjtcbmltcG9ydCB7IHJlZ2lzdGVyQnVpbGRpbmdCbG9jayB9IGZyb20gXCJzYXAvZmUvY29yZS9idWlsZGluZ0Jsb2Nrcy9CdWlsZGluZ0Jsb2NrUnVudGltZVwiO1xuaW1wb3J0IENvbnZlcnRlckNvbnRleHQgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvQ29udmVydGVyQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBJc3N1ZUNhdGVnb3J5LCBJc3N1ZVNldmVyaXR5IH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvaGVscGVycy9Jc3N1ZU1hbmFnZXJcIjtcbmltcG9ydCB0eXBlIHsgTGlzdFJlcG9ydE1hbmlmZXN0U2V0dGluZ3MsIE9iamVjdFBhZ2VNYW5pZmVzdFNldHRpbmdzIH0gZnJvbSBcInNhcC9mZS9jb3JlL2NvbnZlcnRlcnMvTWFuaWZlc3RTZXR0aW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBJRGlhZ25vc3RpY3MgfSBmcm9tIFwic2FwL2ZlL2NvcmUvY29udmVydGVycy9UZW1wbGF0ZUNvbnZlcnRlclwiO1xuaW1wb3J0IFNpZGVFZmZlY3RzRmFjdG9yeSBmcm9tIFwic2FwL2ZlL2NvcmUvc2VydmljZXMvU2lkZUVmZmVjdHNTZXJ2aWNlRmFjdG9yeVwiO1xuaW1wb3J0IFRlbXBsYXRlTW9kZWwgZnJvbSBcInNhcC9mZS9jb3JlL1RlbXBsYXRlTW9kZWxcIjtcbmltcG9ydCB0eXBlIHsgRGF0YU1vZGVsT2JqZWN0UGF0aCB9IGZyb20gXCJzYXAvZmUvY29yZS90ZW1wbGF0aW5nL0RhdGFNb2RlbFBhdGhIZWxwZXJcIjtcbmltcG9ydCBCaW5kaW5nUGFyc2VyIGZyb20gXCJzYXAvdWkvYmFzZS9CaW5kaW5nUGFyc2VyXCI7XG5pbXBvcnQgTWFuYWdlZE9iamVjdCBmcm9tIFwic2FwL3VpL2Jhc2UvTWFuYWdlZE9iamVjdFwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwic2FwL3VpL2NvcmUvQ29tcG9uZW50XCI7XG5pbXBvcnQgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IEludmlzaWJsZVRleHQgZnJvbSBcInNhcC91aS9jb3JlL0ludmlzaWJsZVRleHRcIjtcbmltcG9ydCBTZXJpYWxpemVyIGZyb20gXCJzYXAvdWkvY29yZS91dGlsL3NlcmlhbGl6ZXIvU2VyaWFsaXplclwiO1xuaW1wb3J0IFhNTFByZXByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2NvcmUvdXRpbC9YTUxQcmVwcm9jZXNzb3JcIjtcbmltcG9ydCBGbGV4U3RhdGUgZnJvbSBcInNhcC91aS9mbC9hcHBseS9faW50ZXJuYWwvZmxleFN0YXRlL0ZsZXhTdGF0ZVwiO1xuaW1wb3J0IFhtbFByZXByb2Nlc3NvciBmcm9tIFwic2FwL3VpL2ZsL2FwcGx5L19pbnRlcm5hbC9wcmVwcm9jZXNzb3JzL1htbFByZXByb2Nlc3NvclwiO1xuaW1wb3J0IEFwcFN0b3JhZ2UgZnJvbSBcInNhcC91aS9mbC9pbml0aWFsL19pbnRlcm5hbC9TdG9yYWdlXCI7XG5pbXBvcnQgVXRpbHMgZnJvbSBcInNhcC91aS9mbC9VdGlsc1wiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IE1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL01ldGFNb2RlbFwiO1xuaW1wb3J0IF9NZXRhZGF0YVJlcXVlc3RvciBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L2xpYi9fTWV0YWRhdGFSZXF1ZXN0b3JcIjtcbmltcG9ydCBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG5pbXBvcnQgeHBhdGggZnJvbSBcInhwYXRoXCI7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xuY29uc3QgZm9ybWF0WG1sID0gcmVxdWlyZShcInhtbC1mb3JtYXR0ZXJcIik7XG5cbkxvZy5zZXRMZXZlbCgxIGFzIGFueSwgXCJzYXAudWkuY29yZS51dGlsLlhNTFByZXByb2Nlc3NvclwiKTtcbmplc3Quc2V0VGltZW91dCg0MDAwMCk7XG5cbmNvbnN0IG5hbWVTcGFjZU1hcCA9IHtcblx0XCJtYWNyb3NcIjogXCJzYXAuZmUubWFjcm9zXCIsXG5cdFwibWFjcm9cIjogXCJzYXAuZmUubWFjcm9zXCIsXG5cdFwibWFjcm9GaWVsZFwiOiBcInNhcC5mZS5tYWNyb3MuZmllbGRcIixcblx0XCJtYWNyb2RhdGFcIjogXCJodHRwOi8vc2NoZW1hcy5zYXAuY29tL3NhcHVpNS9leHRlbnNpb24vc2FwLnVpLmNvcmUuQ3VzdG9tRGF0YS8xXCIsXG5cdFwibG9nXCI6IFwiaHR0cDovL3NjaGVtYXMuc2FwLmNvbS9zYXB1aTUvZXh0ZW5zaW9uL3NhcC51aS5jb3JlLkN1c3RvbURhdGEvMVwiLFxuXHRcInVuaXR0ZXN0XCI6IFwiaHR0cDovL3NjaGVtYXMuc2FwLmNvbS9zYXB1aTUvcHJlcHJvY2Vzc29yZXh0ZW5zaW9uL3NhcC5mZS51bml0dGVzdGluZy8xXCIsXG5cdFwiY29udHJvbFwiOiBcInNhcC5mZS5jb3JlLmNvbnRyb2xzXCIsXG5cdFwiY29yZVwiOiBcInNhcC51aS5jb3JlXCIsXG5cdFwibVwiOiBcInNhcC5tXCIsXG5cdFwiZlwiOiBcInNhcC51aS5sYXlvdXQuZm9ybVwiLFxuXHRcImludGVybmFsTWFjcm9cIjogXCJzYXAuZmUubWFjcm9zLmludGVybmFsXCIsXG5cdFwibWRjXCI6IFwic2FwLnVpLm1kY1wiLFxuXHRcIm1kY2F0XCI6IFwic2FwLnVpLm1kYy5hY3Rpb250b29sYmFyXCIsXG5cdFwibWRjRmllbGRcIjogXCJzYXAudWkubWRjLmZpZWxkXCIsXG5cdFwibWRjVGFibGVcIjogXCJzYXAudWkubWRjLnRhYmxlXCIsXG5cdFwidVwiOiBcInNhcC51aS51bmlmaWVkXCIsXG5cdFwibWFjcm9NaWNyb0NoYXJ0XCI6IFwic2FwLmZlLm1hY3Jvcy5taWNyb2NoYXJ0XCIsXG5cdFwibWljcm9DaGFydFwiOiBcInNhcC5zdWl0ZS51aS5taWNyb2NoYXJ0XCIsXG5cdFwibWFjcm9UYWJsZVwiOiBcInNhcC5mZS5tYWNyb3MudGFibGVcIlxufTtcbmNvbnN0IHNlbGVjdCA9IHhwYXRoLnVzZU5hbWVzcGFjZXMobmFtZVNwYWNlTWFwKTtcblxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyTWFjcm8gPSBmdW5jdGlvbiAobWFjcm9NZXRhZGF0YTogYW55KSB7XG5cdHJlZ2lzdGVyQnVpbGRpbmdCbG9jayhtYWNyb01ldGFkYXRhKTtcbn07XG5leHBvcnQgY29uc3QgdW5yZWdpc3Rlck1hY3JvID0gZnVuY3Rpb24gKG1hY3JvTWV0YWRhdGE6IGFueSkge1xuXHRYTUxQcmVwcm9jZXNzb3IucGx1Z0luKG51bGwsIG1hY3JvTWV0YWRhdGEubmFtZXNwYWNlLCBtYWNyb01ldGFkYXRhLm5hbWUpO1xuXHRpZiAobWFjcm9NZXRhZGF0YS5wdWJsaWNOYW1lc3BhY2UpIHtcblx0XHRYTUxQcmVwcm9jZXNzb3IucGx1Z0luKG51bGwsIG1hY3JvTWV0YWRhdGEucHVibGljTmFtZXNwYWNlLCBtYWNyb01ldGFkYXRhLm5hbWUpO1xuXHR9XG59O1xuZXhwb3J0IGNvbnN0IHJ1blhQYXRoUXVlcnkgPSBmdW5jdGlvbiAoc2VsZWN0b3I6IHN0cmluZywgeG1sZG9tOiBOb2RlIHwgdW5kZWZpbmVkKSB7XG5cdHJldHVybiBzZWxlY3Qoc2VsZWN0b3IsIHhtbGRvbSk7XG59O1xuXG5leHBlY3QuZXh0ZW5kKHtcblx0dG9IYXZlQ29udHJvbCh4bWxkb20sIHNlbGVjdG9yKSB7XG5cdFx0Y29uc3Qgbm9kZXMgPSBydW5YUGF0aFF1ZXJ5KGAvcm9vdCR7c2VsZWN0b3J9YCwgeG1sZG9tKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bWVzc2FnZTogKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBvdXRwdXRYbWwgPSBzZXJpYWxpemVYTUwoeG1sZG9tKTtcblx0XHRcdFx0cmV0dXJuIGBkaWQgbm90IGZpbmQgY29udHJvbHMgbWF0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gZ2VuZXJhdGVkIHhtbDpcXG4gJHtvdXRwdXRYbWx9YDtcblx0XHRcdH0sXG5cdFx0XHRwYXNzOiBub2RlcyAmJiBub2Rlcy5sZW5ndGggPj0gMVxuXHRcdH07XG5cdH0sXG5cdHRvTm90SGF2ZUNvbnRyb2woeG1sZG9tLCBzZWxlY3Rvcikge1xuXHRcdGNvbnN0IG5vZGVzID0gcnVuWFBhdGhRdWVyeShgL3Jvb3Qke3NlbGVjdG9yfWAsIHhtbGRvbSk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1lc3NhZ2U6ICgpID0+IHtcblx0XHRcdFx0Y29uc3Qgb3V0cHV0WG1sID0gc2VyaWFsaXplWE1MKHhtbGRvbSk7XG5cdFx0XHRcdHJldHVybiBgVGhlcmUgaXMgYSBjb250cm9sIG1hdGNoaW5nICR7c2VsZWN0b3J9IGluIGdlbmVyYXRlZCB4bWw6XFxuICR7b3V0cHV0WG1sfWA7XG5cdFx0XHR9LFxuXHRcdFx0cGFzczogbm9kZXMgJiYgbm9kZXMubGVuZ3RoID09PSAwXG5cdFx0fTtcblx0fVxufSk7XG5cbmV4cG9ydCBjb25zdCBmb3JtYXRCdWlsZGluZ0Jsb2NrWE1MID0gZnVuY3Rpb24gKHhtbFN0cmluZzogc3RyaW5nIHwgc3RyaW5nW10pIHtcblx0aWYgKEFycmF5LmlzQXJyYXkoeG1sU3RyaW5nKSkge1xuXHRcdHhtbFN0cmluZyA9IHhtbFN0cmluZy5qb2luKFwiXCIpO1xuXHR9XG5cdGxldCB4bWxGb3JtYXR0ZWQgPSBmb3JtYXRYTUwoeG1sU3RyaW5nKTtcblx0eG1sRm9ybWF0dGVkID0geG1sRm9ybWF0dGVkLnJlcGxhY2UoL3VpZC0taWQtWzAtOV17MTN9LVswLTldezEsMn0vZywgXCJ1aWQtLWlkXCIpO1xuXHRyZXR1cm4geG1sRm9ybWF0dGVkO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldENvbnRyb2xBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoY29udHJvbFNlbGVjdG9yOiBzdHJpbmcsIGF0dHJpYnV0ZU5hbWU6IHN0cmluZywgeG1sRG9tOiBOb2RlKSB7XG5cdGNvbnN0IHNlbGVjdG9yID0gYHN0cmluZygvcm9vdCR7Y29udHJvbFNlbGVjdG9yfS9AJHthdHRyaWJ1dGVOYW1lfSlgO1xuXHRyZXR1cm4gcnVuWFBhdGhRdWVyeShzZWxlY3RvciwgeG1sRG9tKTtcbn07XG5cbmV4cG9ydCBjb25zdCBzZXJpYWxpemVYTUwgPSBmdW5jdGlvbiAoeG1sRG9tOiBOb2RlKSB7XG5cdGNvbnN0IHNlcmlhbGl6ZXIgPSBuZXcgd2luZG93LlhNTFNlcmlhbGl6ZXIoKTtcblx0Y29uc3QgeG1sU3RyaW5nID0gc2VyaWFsaXplci5zZXJpYWxpemVUb1N0cmluZyh4bWxEb20pO1xuXHRyZXR1cm4gZm9ybWF0WE1MKHhtbFN0cmluZyk7XG59O1xuXG5leHBvcnQgY29uc3QgZm9ybWF0WE1MID0gZnVuY3Rpb24gKHhtbFN0cmluZzogc3RyaW5nKSB7XG5cdHJldHVybiBmb3JtYXQoXG5cdFx0eG1sU3RyaW5nLFxuXHRcdHsgcGFyc2VyOiBcInhtbFwiLCB4bWxXaGl0ZXNwYWNlU2Vuc2l0aXZpdHk6IFwiaWdub3JlXCIgfSBhcyBQYXJ0aWFsPFJlcXVpcmVkT3B0aW9ucz4gLyogb3B0aW9ucyBieSB0aGUgUHJldHRpZXIgWE1MIHBsdWdpbiAqL1xuXHQpO1xufTtcblxuLyoqXG4gKiBDb21waWxlIGEgQ0RTIGZpbGUgaW50byBhbiBFRE1YIGZpbGUuXG4gKlxuICogQHBhcmFtIGNkc1VybCBUaGUgcGF0aCB0byB0aGUgZmlsZSBjb250YWluaW5nIHRoZSBDRFMgZGVmaW5pdGlvbi4gVGhpcyBmaWxlIG11c3QgZGVjbGFyZSB0aGUgbmFtZXNwYWNlXG4gKiBzYXAuZmUudGVzdCBhbmQgYSBzZXJ2aWNlIEplc3RTZXJ2aWNlXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBjcmVhdGluZyB0aGUgRURNWCBvdXRwdXRcbiAqIEBwYXJhbSBlZG14RmlsZU5hbWUgQWxsb3dzIHlvdSB0byBvdmVycmlkZSB0aGUgbmFtZSBvZiB0aGUgY29tcGlsZWQgRURNWCBtZXRhZGF0YSBmaWxlXG4gKiBAcmV0dXJucyBUaGUgcGF0aCBvZiB0aGUgZ2VuZXJhdGVkIEVETVhcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXBpbGVDRFMgPSBmdW5jdGlvbiAoXG5cdGNkc1VybDogc3RyaW5nLFxuXHRvcHRpb25zOiBjb21waWxlci5PRGF0YU9wdGlvbnMgPSB7fSxcblx0ZWRteEZpbGVOYW1lID0gcGF0aC5iYXNlbmFtZShjZHNVcmwpLnJlcGxhY2UoXCIuY2RzXCIsIFwiLnhtbFwiKVxuKSB7XG5cdGNvbnN0IGNkc1N0cmluZyA9IGZzLnJlYWRGaWxlU3luYyhjZHNVcmwsIFwidXRmLThcIik7XG5cdGNvbnN0IGVkbXhDb250ZW50ID0gY2RzMmVkbXgoY2RzU3RyaW5nLCBcInNhcC5mZS50ZXN0Lkplc3RTZXJ2aWNlXCIsIG9wdGlvbnMpO1xuXHRjb25zdCBkaXIgPSBwYXRoLnJlc29sdmUoY2RzVXJsLCBcIi4uXCIsIFwiZ2VuXCIpO1xuXG5cdGNvbnN0IGVkbXhGaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShkaXIsIGVkbXhGaWxlTmFtZSk7XG5cblx0ZnMubWtkaXJTeW5jKGRpciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG5cblx0ZnMud3JpdGVGaWxlU3luYyhlZG14RmlsZVBhdGgsIGVkbXhDb250ZW50KTtcblx0cmV0dXJuIGVkbXhGaWxlUGF0aDtcbn07XG5cbi8qKlxuICogQ29tcGlsZSBDRFMgdG8gRURNWC5cbiAqXG4gKiBAcGFyYW0gY2RzIFRoZSBDRFMgbW9kZWwuIEl0IG11c3QgZGVmaW5lIGF0IGxlYXN0IG9uZSBzZXJ2aWNlLlxuICogQHBhcmFtIHNlcnZpY2UgVGhlIGZ1bGx5LXF1YWxpZmllZCBuYW1lIG9mIHRoZSBzZXJ2aWNlIHRvIGJlIGNvbXBpbGVkLiBEZWZhdWx0cyB0byBcInNhcC5mZS50ZXN0Lkplc3RTZXJ2aWNlXCIuXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBjcmVhdGluZyB0aGUgRURNWCBvdXRwdXRcbiAqIEByZXR1cm5zIFRoZSBjb21waWxlZCBzZXJ2aWNlIG1vZGVsIGFzIEVETVguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjZHMyZWRteChjZHM6IHN0cmluZywgc2VydmljZSA9IFwic2FwLmZlLnRlc3QuSmVzdFNlcnZpY2VcIiwgb3B0aW9uczogY29tcGlsZXIuT0RhdGFPcHRpb25zID0ge30pIHtcblx0Y29uc3Qgc291cmNlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHsgXCJzb3VyY2UuY2RzXCI6IGNkcyB9O1xuXG5cdC8vIGFsbG93IHRvIGluY2x1ZGUgc3R1ZmYgZnJvbSBAc2FwL2Nkcy9jb21tb25cblx0aWYgKGNkcy5pbmNsdWRlcyhcIidAc2FwL2Nkcy9jb21tb24nXCIpKSB7XG5cdFx0c291cmNlc1tcImNvbW1vbi5jZHNcIl0gPSBmcy5yZWFkRmlsZVN5bmMocmVxdWlyZS5yZXNvbHZlKFwiQHNhcC9jZHMvY29tbW9uLmNkc1wiKSwgXCJ1dGYtOFwiKTtcblx0fVxuXG5cdGNvbnN0IGNzbiA9IGNvbXBpbGVyLmNvbXBpbGVTb3VyY2VzKHNvdXJjZXMsIHt9KTtcblxuXHRjb25zdCBlZG14T3B0aW9uczogY29tcGlsZXIuT0RhdGFPcHRpb25zID0ge1xuXHRcdG9kYXRhRm9yZWlnbktleXM6IHRydWUsXG5cdFx0b2RhdGFGb3JtYXQ6IFwic3RydWN0dXJlZFwiLFxuXHRcdG9kYXRhQ29udGFpbm1lbnQ6IGZhbHNlLFxuXHRcdC4uLm9wdGlvbnMsXG5cdFx0c2VydmljZTogc2VydmljZVxuXHR9O1xuXG5cdGNvbnN0IGVkbXggPSBjb21waWxlci50by5lZG14KGNzbiwgZWRteE9wdGlvbnMpO1xuXHRpZiAoIWVkbXgpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYENvbXBpbGF0aW9uIGZhaWxlZC4gSGludDogTWFrZSBzdXJlIHRoYXQgdGhlIENEUyBtb2RlbCBkZWZpbmVzIHNlcnZpY2UgJHtzZXJ2aWNlfS5gKTtcblx0fVxuXHRyZXR1cm4gZWRteDtcbn1cblxuZXhwb3J0IGNvbnN0IGdldEZha2VTaWRlRWZmZWN0c1NlcnZpY2UgPSBhc3luYyBmdW5jdGlvbiAob01ldGFNb2RlbDogT0RhdGFNZXRhTW9kZWwpOiBQcm9taXNlPGFueT4ge1xuXHRjb25zdCBvU2VydmljZUNvbnRleHQgPSB7IHNjb3BlT2JqZWN0OiB7fSwgc2NvcGVUeXBlOiBcIlwiLCBzZXR0aW5nczoge30gfTtcblx0cmV0dXJuIG5ldyBTaWRlRWZmZWN0c0ZhY3RvcnkoKS5jcmVhdGVJbnN0YW5jZShvU2VydmljZUNvbnRleHQpLnRoZW4oZnVuY3Rpb24gKG9TZXJ2aWNlSW5zdGFuY2U6IGFueSkge1xuXHRcdGNvbnN0IG9KZXN0U2lkZUVmZmVjdHNTZXJ2aWNlID0gb1NlcnZpY2VJbnN0YW5jZS5nZXRJbnRlcmZhY2UoKTtcblx0XHRvSmVzdFNpZGVFZmZlY3RzU2VydmljZS5nZXRDb250ZXh0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0c2NvcGVPYmplY3Q6IHtcblx0XHRcdFx0XHRnZXRNb2RlbDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0Z2V0TWV0YU1vZGVsOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9NZXRhTW9kZWw7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0cmV0dXJuIG9KZXN0U2lkZUVmZmVjdHNTZXJ2aWNlO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRGYWtlRGlhZ25vc3RpY3MgPSBmdW5jdGlvbiAoKTogSURpYWdub3N0aWNzIHtcblx0Y29uc3QgaXNzdWVzOiBhbnlbXSA9IFtdO1xuXHRyZXR1cm4ge1xuXHRcdGFkZElzc3VlKGlzc3VlQ2F0ZWdvcnk6IElzc3VlQ2F0ZWdvcnksIGlzc3VlU2V2ZXJpdHk6IElzc3VlU2V2ZXJpdHksIGRldGFpbHM6IHN0cmluZyk6IHZvaWQge1xuXHRcdFx0aXNzdWVzLnB1c2goe1xuXHRcdFx0XHRpc3N1ZUNhdGVnb3J5LFxuXHRcdFx0XHRpc3N1ZVNldmVyaXR5LFxuXHRcdFx0XHRkZXRhaWxzXG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGdldElzc3VlcygpOiBhbnlbXSB7XG5cdFx0XHRyZXR1cm4gaXNzdWVzO1xuXHRcdH0sXG5cdFx0Y2hlY2tJZklzc3VlRXhpc3RzKGlzc3VlQ2F0ZWdvcnk6IElzc3VlQ2F0ZWdvcnksIGlzc3VlU2V2ZXJpdHk6IElzc3VlU2V2ZXJpdHksIGRldGFpbHM6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdFx0cmV0dXJuIGlzc3Vlcy5maW5kKChpc3N1ZSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gaXNzdWUuaXNzdWVDYXRlZ29yeSA9PT0gaXNzdWVDYXRlZ29yeSAmJiBpc3N1ZS5pc3N1ZVNldmVyaXR5ID09PSBpc3N1ZVNldmVyaXR5ICYmIGlzc3VlLmRldGFpbHMgPT09IGRldGFpbHM7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0Q29udmVydGVyQ29udGV4dEZvclRlc3QgPSBmdW5jdGlvbiAoXG5cdGNvbnZlcnRlZFR5cGVzOiBDb252ZXJ0ZWRNZXRhZGF0YSxcblx0bWFuaWZlc3RTZXR0aW5nczogTGlzdFJlcG9ydE1hbmlmZXN0U2V0dGluZ3MgfCBPYmplY3RQYWdlTWFuaWZlc3RTZXR0aW5nc1xuKSB7XG5cdGNvbnN0IGVudGl0eVNldCA9IGNvbnZlcnRlZFR5cGVzLmVudGl0eVNldHMuZmluZCgoZXMpID0+IGVzLm5hbWUgPT09IG1hbmlmZXN0U2V0dGluZ3MuZW50aXR5U2V0KTtcblx0Y29uc3QgZGF0YU1vZGVsUGF0aCA9IGdldERhdGFNb2RlbE9iamVjdFBhdGhGb3JQcm9wZXJ0eShlbnRpdHlTZXQgYXMgRW50aXR5U2V0LCBjb252ZXJ0ZWRUeXBlcywgZW50aXR5U2V0KTtcblx0cmV0dXJuIG5ldyBDb252ZXJ0ZXJDb250ZXh0KGNvbnZlcnRlZFR5cGVzLCBtYW5pZmVzdFNldHRpbmdzLCBnZXRGYWtlRGlhZ25vc3RpY3MoKSwgbWVyZ2UsIGRhdGFNb2RlbFBhdGgpO1xufTtcbmNvbnN0IG1ldGFNb2RlbENhY2hlOiBhbnkgPSB7fTtcbmV4cG9ydCBjb25zdCBnZXRNZXRhTW9kZWwgPSBhc3luYyBmdW5jdGlvbiAoc01ldGFkYXRhVXJsOiBzdHJpbmcpIHtcblx0Y29uc3Qgb1JlcXVlc3RvciA9IF9NZXRhZGF0YVJlcXVlc3Rvci5jcmVhdGUoe30sIFwiNC4wXCIsIHt9KTtcblx0aWYgKCFtZXRhTW9kZWxDYWNoZVtzTWV0YWRhdGFVcmxdKSB7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbCA9IG5ldyAoT0RhdGFNZXRhTW9kZWwgYXMgYW55KShvUmVxdWVzdG9yLCBzTWV0YWRhdGFVcmwsIHVuZGVmaW5lZCwgbnVsbCk7XG5cdFx0YXdhaXQgb01ldGFNb2RlbC5mZXRjaEVudGl0eUNvbnRhaW5lcigpO1xuXHRcdG1ldGFNb2RlbENhY2hlW3NNZXRhZGF0YVVybF0gPSBvTWV0YU1vZGVsO1xuXHR9XG5cblx0cmV0dXJuIG1ldGFNb2RlbENhY2hlW3NNZXRhZGF0YVVybF07XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RGF0YU1vZGVsT2JqZWN0UGF0aEZvclByb3BlcnR5ID0gZnVuY3Rpb24gKFxuXHRlbnRpdHlTZXQ6IEVudGl0eVNldCxcblx0Y29udmVydGVkVHlwZXM6IENvbnZlcnRlZE1ldGFkYXRhLFxuXHRwcm9wZXJ0eT86IFByb3BlcnR5IHwgRW50aXR5U2V0IHwgQW55QW5ub3RhdGlvblxuKTogRGF0YU1vZGVsT2JqZWN0UGF0aCB7XG5cdGNvbnN0IHRhcmdldFBhdGg6IERhdGFNb2RlbE9iamVjdFBhdGggPSB7XG5cdFx0c3RhcnRpbmdFbnRpdHlTZXQ6IGVudGl0eVNldCxcblx0XHRuYXZpZ2F0aW9uUHJvcGVydGllczogW10sXG5cdFx0dGFyZ2V0T2JqZWN0OiBwcm9wZXJ0eSxcblx0XHR0YXJnZXRFbnRpdHlTZXQ6IGVudGl0eVNldCxcblx0XHR0YXJnZXRFbnRpdHlUeXBlOiBlbnRpdHlTZXQuZW50aXR5VHlwZSxcblx0XHRjb252ZXJ0ZWRUeXBlczogY29udmVydGVkVHlwZXNcblx0fTtcblx0dGFyZ2V0UGF0aC5jb250ZXh0TG9jYXRpb24gPSB0YXJnZXRQYXRoO1xuXHRyZXR1cm4gdGFyZ2V0UGF0aDtcbn07XG5cbmV4cG9ydCBjb25zdCBldmFsdWF0ZUJpbmRpbmcgPSBmdW5jdGlvbiAoYmluZGluZ1N0cmluZzogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuXHRjb25zdCBiaW5kaW5nRWxlbWVudCA9IEJpbmRpbmdQYXJzZXIuY29tcGxleFBhcnNlcihiaW5kaW5nU3RyaW5nKTtcblx0cmV0dXJuIGJpbmRpbmdFbGVtZW50LmZvcm1hdHRlci5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xufTtcblxudHlwZSBNb2RlbENvbnRlbnQgPSB7XG5cdFtuYW1lOiBzdHJpbmddOiBhbnk7XG59O1xuXG4vKipcbiAqIEV2YWx1YXRlIGEgYmluZGluZyBhZ2FpbnN0IGEgbW9kZWwuXG4gKlxuICogQHBhcmFtIGJpbmRpbmdTdHJpbmcgVGhlIGJpbmRpbmcgc3RyaW5nLlxuICogQHBhcmFtIG1vZGVsQ29udGVudCBDb250ZW50IG9mIHRoZSBkZWZhdWx0IG1vZGVsIHRvIHVzZSBmb3IgZXZhbHVhdGlvbi5cbiAqIEBwYXJhbSBuYW1lZE1vZGVsc0NvbnRlbnQgQ29udGVudHMgb2YgYWRkaXRpb25hbCwgbmFtZWQgbW9kZWxzIHRvIHVzZS5cbiAqIEByZXR1cm5zIFRoZSBldmFsdWF0ZWQgYmluZGluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV2YWx1YXRlQmluZGluZ1dpdGhNb2RlbChcblx0YmluZGluZ1N0cmluZzogc3RyaW5nIHwgdW5kZWZpbmVkLFxuXHRtb2RlbENvbnRlbnQ6IE1vZGVsQ29udGVudCxcblx0bmFtZWRNb2RlbHNDb250ZW50PzogeyBbbW9kZWxOYW1lOiBzdHJpbmddOiBNb2RlbENvbnRlbnQgfVxuKTogc3RyaW5nIHtcblx0Y29uc3QgYmluZGluZ0VsZW1lbnQgPSBCaW5kaW5nUGFyc2VyLmNvbXBsZXhQYXJzZXIoYmluZGluZ1N0cmluZyk7XG5cdGNvbnN0IHRleHQgPSBuZXcgSW52aXNpYmxlVGV4dCgpO1xuXHR0ZXh0LmJpbmRQcm9wZXJ0eShcInRleHRcIiwgYmluZGluZ0VsZW1lbnQpO1xuXG5cdGNvbnN0IGRlZmF1bHRNb2RlbCA9IG5ldyBKU09OTW9kZWwobW9kZWxDb250ZW50KTtcblx0dGV4dC5zZXRNb2RlbChkZWZhdWx0TW9kZWwpO1xuXHR0ZXh0LnNldEJpbmRpbmdDb250ZXh0KGRlZmF1bHRNb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIikgYXMgQ29udGV4dCk7XG5cblx0aWYgKG5hbWVkTW9kZWxzQ29udGVudCkge1xuXHRcdGZvciAoY29uc3QgW25hbWUsIGNvbnRlbnRdIG9mIE9iamVjdC5lbnRyaWVzKG5hbWVkTW9kZWxzQ29udGVudCkpIHtcblx0XHRcdGNvbnN0IG1vZGVsID0gbmV3IEpTT05Nb2RlbChjb250ZW50KTtcblx0XHRcdHRleHQuc2V0TW9kZWwobW9kZWwsIG5hbWUpO1xuXHRcdFx0dGV4dC5zZXRCaW5kaW5nQ29udGV4dChtb2RlbC5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIikgYXMgQ29udGV4dCwgbmFtZSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRleHQuZ2V0VGV4dCgpO1xufVxuXG5jb25zdCBURVNUVklFV0lEID0gXCJ0ZXN0Vmlld0lkXCI7XG5cbmV4cG9ydCBjb25zdCBhcHBseUZsZXhDaGFuZ2VzID0gYXN5bmMgZnVuY3Rpb24gKFxuXHRhVmFyaWFudERlcGVuZGVudENvbnRyb2xDaGFuZ2VzOiBhbnlbXSxcblx0b01ldGFNb2RlbDogTWV0YU1vZGVsLFxuXHRyZXN1bHRYTUw6IGFueSxcblx0Y3JlYXRlQ2hhbmdlc09iamVjdDogRnVuY3Rpb25cbikge1xuXHRjb25zdCBjaGFuZ2VzID0gY3JlYXRlQ2hhbmdlc09iamVjdChURVNUVklFV0lELCBhVmFyaWFudERlcGVuZGVudENvbnRyb2xDaGFuZ2VzKTtcblx0Y29uc3QgYXBwSWQgPSBcInNvbWVDb21wb25lbnRcIjtcblx0Y29uc3Qgb01hbmlmZXN0ID0ge1xuXHRcdFwic2FwLmFwcFwiOiB7XG5cdFx0XHRpZDogYXBwSWQsXG5cdFx0XHR0eXBlOiBcImFwcGxpY2F0aW9uXCIsXG5cdFx0XHRjcm9zc05hdmlnYXRpb246IHtcblx0XHRcdFx0b3V0Ym91bmRzOiBbXVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0Y29uc3Qgb0FwcENvbXBvbmVudDogQXBwQ29tcG9uZW50ID0ge1xuXHRcdGdldERpYWdub3N0aWNzOiBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKGdldEZha2VEaWFnbm9zdGljcygpKSxcblx0XHRnZXRNb2RlbDogamVzdC5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7XG5cdFx0XHRnZXRNZXRhTW9kZWw6IGplc3QuZm4oKS5tb2NrUmV0dXJuVmFsdWUob01ldGFNb2RlbClcblx0XHR9KSxcblx0XHRnZXRDb21wb25lbnREYXRhOiBqZXN0LmZuKCkubW9ja1JldHVyblZhbHVlKHt9KSxcblx0XHRnZXRNYW5pZmVzdE9iamVjdDogamVzdC5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7XG5cdFx0XHRnZXRFbnRyeTogZnVuY3Rpb24gKG5hbWU6IHN0cmluZykge1xuXHRcdFx0XHRyZXR1cm4gKG9NYW5pZmVzdCBhcyBhbnkpW25hbWVdO1xuXHRcdFx0fVxuXHRcdH0pXG5cdH0gYXMgdW5rbm93biBhcyBBcHBDb21wb25lbnQ7XG5cdC8vZmFrZSBjaGFuZ2VzXG5cdGplc3Quc3B5T24oQXBwU3RvcmFnZSwgXCJsb2FkRmxleERhdGFcIikubW9ja1JldHVyblZhbHVlKFByb21pc2UucmVzb2x2ZShjaGFuZ2VzKSk7XG5cdGplc3Quc3B5T24oQ29tcG9uZW50LCBcImdldFwiKS5tb2NrUmV0dXJuVmFsdWUob0FwcENvbXBvbmVudCk7XG5cdGplc3Quc3B5T24oVXRpbHMsIFwiZ2V0QXBwQ29tcG9uZW50Rm9yQ29udHJvbFwiKS5tb2NrUmV0dXJuVmFsdWUob0FwcENvbXBvbmVudCk7XG5cdGF3YWl0IEZsZXhTdGF0ZS5pbml0aWFsaXplKHtcblx0XHRjb21wb25lbnRJZDogYXBwSWRcblx0fSk7XG5cdHJlc3VsdFhNTCA9IGF3YWl0IFhtbFByZXByb2Nlc3Nvci5wcm9jZXNzKHJlc3VsdFhNTCwgeyBuYW1lOiBcIlRlc3QgRnJhZ21lbnRcIiwgY29tcG9uZW50SWQ6IGFwcElkLCBpZDogVEVTVFZJRVdJRCB9KTtcblx0cmV0dXJuIHJlc3VsdFhNTDtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRDaGFuZ2VzRnJvbVhNTCA9ICh4bWw6IGFueSkgPT5cblx0Wy4uLnhtbC5xdWVyeVNlbGVjdG9yQWxsKFwiKlwiKV1cblx0XHQuZmxhdE1hcCgoZSkgPT4gWy4uLmUuYXR0cmlidXRlc10ubWFwKChhKSA9PiBhLm5hbWUpKVxuXHRcdC5maWx0ZXIoKGF0dHIpID0+IGF0dHIuaW5jbHVkZXMoXCJzYXAudWkuZmwuYXBwbGllZENoYW5nZXNcIikpO1xuXG5leHBvcnQgY29uc3QgZ2V0VGVtcGxhdGluZ1Jlc3VsdCA9IGFzeW5jIGZ1bmN0aW9uIChcblx0eG1sSW5wdXQ6IHN0cmluZyxcblx0c01ldGFkYXRhVXJsOiBzdHJpbmcsXG5cdG1CaW5kaW5nQ29udGV4dHM6IHsgW3g6IHN0cmluZ106IGFueTsgZW50aXR5U2V0Pzogc3RyaW5nIH0sXG5cdG1Nb2RlbHM6IHsgW3g6IHN0cmluZ106IGFueSB9LFxuXHRhVmFyaWFudERlcGVuZGVudENvbnRyb2xDaGFuZ2VzPzogYW55W10sXG5cdGNyZWF0ZUNoYW5nZXNPYmplY3Q/OiBGdW5jdGlvblxuKSB7XG5cdGNvbnN0IHRlbXBsYXRlZFhtbCA9IGA8cm9vdD4ke3htbElucHV0fTwvcm9vdD5gO1xuXHRjb25zdCBwYXJzZXIgPSBuZXcgd2luZG93LkRPTVBhcnNlcigpO1xuXHRjb25zdCB4bWxEb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRlbXBsYXRlZFhtbCwgXCJ0ZXh0L3htbFwiKTtcblx0Ly8gVG8gZW5zdXJlIG91ciBtYWNybyBjYW4gdXNlICNzZXRCaW5kaW5nQ29udGV4dCB3ZSBlbnN1cmUgdGhlcmUgaXMgYSBwcmUgZXhpc3RpbmcgSlNPTk1vZGVsIGZvciBjb252ZXJ0ZXJDb250ZXh0XG5cdC8vIGlmIG5vdCBhbHJlYWR5IHBhc3NlZCB0byB0ZWggdGVtcGxhdGluZ1xuXG5cdGNvbnN0IG9NZXRhTW9kZWwgPSBhd2FpdCBnZXRNZXRhTW9kZWwoc01ldGFkYXRhVXJsKTtcblx0aWYgKCFtTW9kZWxzLmhhc093blByb3BlcnR5KFwiY29udmVydGVyQ29udGV4dFwiKSkge1xuXHRcdG1Nb2RlbHMgPSBPYmplY3QuYXNzaWduKG1Nb2RlbHMsIHsgXCJjb252ZXJ0ZXJDb250ZXh0XCI6IG5ldyBUZW1wbGF0ZU1vZGVsKHt9LCBvTWV0YU1vZGVsKSB9KTtcblx0fVxuXG5cdE9iamVjdC5rZXlzKG1Nb2RlbHMpLmZvckVhY2goZnVuY3Rpb24gKHNNb2RlbE5hbWUpIHtcblx0XHRpZiAobU1vZGVsc1tzTW9kZWxOYW1lXSAmJiBtTW9kZWxzW3NNb2RlbE5hbWVdLmlzVGVtcGxhdGVNb2RlbCkge1xuXHRcdFx0bU1vZGVsc1tzTW9kZWxOYW1lXSA9IG5ldyBUZW1wbGF0ZU1vZGVsKG1Nb2RlbHNbc01vZGVsTmFtZV0uZGF0YSwgb01ldGFNb2RlbCk7XG5cdFx0fVxuXHR9KTtcblxuXHRjb25zdCBvUHJlcHJvY2Vzc29yU2V0dGluZ3M6IGFueSA9IHtcblx0XHRtb2RlbHM6IE9iamVjdC5hc3NpZ24oXG5cdFx0XHR7XG5cdFx0XHRcdG1ldGFNb2RlbDogb01ldGFNb2RlbFxuXHRcdFx0fSxcblx0XHRcdG1Nb2RlbHNcblx0XHQpLFxuXHRcdGJpbmRpbmdDb250ZXh0czoge31cblx0fTtcblxuXHQvL0luamVjdCBtb2RlbHMgYW5kIGJpbmRpbmdDb250ZXh0c1xuXHRPYmplY3Qua2V5cyhtQmluZGluZ0NvbnRleHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChzS2V5KSB7XG5cdFx0LyogQXNzZXJ0IHRvIG1ha2Ugc3VyZSB0aGUgYW5ub3RhdGlvbnMgYXJlIGluIHRoZSB0ZXN0IG1ldGFkYXRhIC0+IGF2b2lkIG1pc2xlYWRpbmcgdGVzdHMgKi9cblx0XHRleHBlY3QodHlwZW9mIG9NZXRhTW9kZWwuZ2V0T2JqZWN0KG1CaW5kaW5nQ29udGV4dHNbc0tleV0pKS50b0JlRGVmaW5lZCgpO1xuXHRcdGNvbnN0IG9Nb2RlbCA9IG1Nb2RlbHNbc0tleV0gfHwgb01ldGFNb2RlbDtcblx0XHRvUHJlcHJvY2Vzc29yU2V0dGluZ3MuYmluZGluZ0NvbnRleHRzW3NLZXldID0gb01vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KG1CaW5kaW5nQ29udGV4dHNbc0tleV0pOyAvL1ZhbHVlIGlzIHNQYXRoXG5cdFx0b1ByZXByb2Nlc3NvclNldHRpbmdzLm1vZGVsc1tzS2V5XSA9IG9Nb2RlbDtcblx0fSk7XG5cblx0Ly9UaGlzIGNvbnRleHQgZm9yIG1hY3JvIHRlc3Rpbmdcblx0aWYgKG9QcmVwcm9jZXNzb3JTZXR0aW5ncy5tb2RlbHNbXCJ0aGlzXCJdKSB7XG5cdFx0b1ByZXByb2Nlc3NvclNldHRpbmdzLmJpbmRpbmdDb250ZXh0c1tcInRoaXNcIl0gPSBvUHJlcHJvY2Vzc29yU2V0dGluZ3MubW9kZWxzW1widGhpc1wiXS5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIik7XG5cdH1cblxuXHRsZXQgcmVzdWx0WE1MID0gYXdhaXQgWE1MUHJlcHJvY2Vzc29yLnByb2Nlc3MoeG1sRG9jLmZpcnN0RWxlbWVudENoaWxkISwgeyBuYW1lOiBcIlRlc3QgRnJhZ21lbnRcIiB9LCBvUHJlcHJvY2Vzc29yU2V0dGluZ3MpO1xuXG5cdGlmIChhVmFyaWFudERlcGVuZGVudENvbnRyb2xDaGFuZ2VzICYmIGNyZWF0ZUNoYW5nZXNPYmplY3QpIHtcblx0XHQvLyBwcmVmaXggSWRzXG5cdFx0Wy4uLnJlc3VsdFhNTC5xdWVyeVNlbGVjdG9yQWxsKFwiW2lkXVwiKV0uZm9yRWFjaCgobm9kZSkgPT4ge1xuXHRcdFx0bm9kZS5pZCA9IGAke1RFU1RWSUVXSUR9LS0ke25vZGUuaWR9YDtcblx0XHR9KTtcblx0XHQvLyBhcHBseSBmbGV4IGNoYW5nZXNcblx0XHRyZXN1bHRYTUwgPSBhd2FpdCBhcHBseUZsZXhDaGFuZ2VzKGFWYXJpYW50RGVwZW5kZW50Q29udHJvbENoYW5nZXMsIG9NZXRhTW9kZWwsIHJlc3VsdFhNTCwgY3JlYXRlQ2hhbmdlc09iamVjdCk7XG5cdFx0Ly9Bc3NlcnQgdGhhdCBhbGwgY2hhbmdlcyBoYXZlIGJlZW4gYXBwbGllZFxuXHRcdGNvbnN0IGNoYW5nZXNBcHBsaWVkID0gZ2V0Q2hhbmdlc0Zyb21YTUwocmVzdWx0WE1MKTtcblx0XHRleHBlY3QoY2hhbmdlc0FwcGxpZWQubGVuZ3RoKS50b0JlKGFWYXJpYW50RGVwZW5kZW50Q29udHJvbENoYW5nZXMubGVuZ3RoKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0WE1MO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldFRlbXBsYXRlZFhNTCA9IGFzeW5jIGZ1bmN0aW9uIChcblx0eG1sSW5wdXQ6IHN0cmluZyxcblx0c01ldGFkYXRhVXJsOiBzdHJpbmcsXG5cdG1CaW5kaW5nQ29udGV4dHM6IHsgW3g6IHN0cmluZ106IGFueTsgZW50aXR5U2V0Pzogc3RyaW5nIH0sXG5cdG1Nb2RlbHM6IHsgW3g6IHN0cmluZ106IGFueSB9LFxuXHRhVmFyaWFudERlcGVuZGVudENvbnRyb2xDaGFuZ2VzPzogYW55W10sXG5cdGNyZWF0ZUNoYW5nZXNPYmplY3Q/OiBGdW5jdGlvblxuKSB7XG5cdGNvbnN0IHRlbXBsYXRlZFhNTCA9IGF3YWl0IGdldFRlbXBsYXRpbmdSZXN1bHQoXG5cdFx0eG1sSW5wdXQsXG5cdFx0c01ldGFkYXRhVXJsLFxuXHRcdG1CaW5kaW5nQ29udGV4dHMsXG5cdFx0bU1vZGVscyxcblx0XHRhVmFyaWFudERlcGVuZGVudENvbnRyb2xDaGFuZ2VzLFxuXHRcdGNyZWF0ZUNoYW5nZXNPYmplY3Rcblx0KTtcblx0cmV0dXJuIHNlcmlhbGl6ZVhNTCh0ZW1wbGF0ZWRYTUwpO1xufTtcblxuLyoqXG4gKiBQcm9jZXNzIHRoZSByZXF1ZXN0ZWQgWE1MIGZyYWdtZW50IHdpdGggdGhlIHByb3ZpZGVkIGRhdGEuXG4gKlxuICogQHBhcmFtIG5hbWUgRnVsbHkgcXVhbGlmaWVkIG5hbWUgb2YgdGhlIGZyYWdtZW50IHRvIGJlIHRlc3RlZC5cbiAqIEBwYXJhbSB0ZXN0RGF0YSBUZXN0IGRhdGEgY29uc2lzdGluZ1xuICogQHJldHVybnMgVGVtcGxhdGVkIGZyYWdtZW50IGFzIHN0cmluZ1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0ZyYWdtZW50KG5hbWU6IHN0cmluZywgdGVzdERhdGE6IHsgW21vZGVsOiBzdHJpbmddOiBvYmplY3QgfSk6IFByb21pc2U8c3RyaW5nPiB7XG5cdGNvbnN0IGlucHV0WG1sID0gYDxyb290Pjxjb3JlOkZyYWdtZW50IGZyYWdtZW50TmFtZT1cIiR7bmFtZX1cIiB0eXBlPVwiWE1MXCIgeG1sbnM6Y29yZT1cInNhcC51aS5jb3JlXCIgLz48L3Jvb3Q+YDtcblx0Y29uc3QgcGFyc2VyID0gbmV3IHdpbmRvdy5ET01QYXJzZXIoKTtcblx0Y29uc3QgaW5wdXREb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGlucHV0WG1sLCBcInRleHQveG1sXCIpO1xuXG5cdC8vIGJ1aWxkIG1vZGVsIGFuZCBiaW5kaW5ncyBmb3IgZ2l2ZW4gdGVzdCBkYXRhXG5cdGNvbnN0IHNldHRpbmdzID0ge1xuXHRcdG1vZGVsczoge30gYXMgeyBbbmFtZTogc3RyaW5nXTogSlNPTk1vZGVsIH0sXG5cdFx0YmluZGluZ0NvbnRleHRzOiB7fSBhcyB7IFtuYW1lOiBzdHJpbmddOiBvYmplY3QgfVxuXHR9O1xuXHRmb3IgKGNvbnN0IG1vZGVsIGluIHRlc3REYXRhKSB7XG5cdFx0Y29uc3QganNvbk1vZGVsID0gbmV3IEpTT05Nb2RlbCgpO1xuXHRcdGpzb25Nb2RlbC5zZXREYXRhKHRlc3REYXRhW21vZGVsXSk7XG5cdFx0c2V0dGluZ3MubW9kZWxzW21vZGVsXSA9IGpzb25Nb2RlbDtcblx0XHRzZXR0aW5ncy5iaW5kaW5nQ29udGV4dHNbbW9kZWxdID0gc2V0dGluZ3MubW9kZWxzW21vZGVsXS5jcmVhdGVCaW5kaW5nQ29udGV4dChcIi9cIikgYXMgQ29udGV4dDtcblx0fVxuXG5cdC8vIGV4ZWN1dGUgdGhlIHByZS1wcm9jZXNzb3Jcblx0Y29uc3QgcmVzdWx0RG9jID0gYXdhaXQgWE1MUHJlcHJvY2Vzc29yLnByb2Nlc3MoaW5wdXREb2MuZmlyc3RFbGVtZW50Q2hpbGQsIHsgbmFtZSB9LCBzZXR0aW5ncyk7XG5cblx0Ly8gZXhjbHVkZSBuZXN0ZWQgZnJhZ21lbnRzIGZyb20gdGVzdCBzbmFwc2hvdHNcblx0Y29uc3QgZnJhZ21lbnRzID0gcmVzdWx0RG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiY29yZTpGcmFnbWVudFwiKTtcblx0aWYgKGZyYWdtZW50cz8ubGVuZ3RoID4gMCkge1xuXHRcdGZvciAoY29uc3QgZnJhZ21lbnQgb2YgZnJhZ21lbnRzKSB7XG5cdFx0XHRmcmFnbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdH1cblx0fVxuXG5cdC8vIEtlZXAgdGhlIGZyYWdtZW50IHJlc3VsdCBhcyBjaGlsZCBvZiByb290IG5vZGUgd2hlbiBmcmFnbWVudCBnZW5lcmF0ZXMgbXVsdGlwbGUgcm9vdCBjb250cm9sc1xuXHRjb25zdCB4bWxSZXN1bHQgPSByZXN1bHREb2MuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IHJlc3VsdERvYy5vdXRlckhUTUwgOiByZXN1bHREb2MuaW5uZXJIVE1MO1xuXG5cdHJldHVybiBmb3JtYXRYbWwoeG1sUmVzdWx0LCB7XG5cdFx0ZmlsdGVyOiAobm9kZTogYW55KSA9PiBub2RlLnR5cGUgIT09IFwiQ29tbWVudFwiXG5cdH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplQ29udHJvbChjb250cm9sVG9TZXJpYWxpemU6IENvbnRyb2wgfCBDb250cm9sW10pIHtcblx0bGV0IHRhYkNvdW50ID0gMDtcblx0ZnVuY3Rpb24gZ2V0VGFiKHRvQWRkOiBudW1iZXIgPSAwKSB7XG5cdFx0bGV0IHRhYiA9IFwiXCI7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0YWJDb3VudCArIHRvQWRkOyBpKyspIHtcblx0XHRcdHRhYiArPSBcIlxcdFwiO1xuXHRcdH1cblx0XHRyZXR1cm4gdGFiO1xuXHR9XG5cdGNvbnN0IHNlcmlhbGl6ZURlbGVnYXRlID0ge1xuXHRcdHN0YXJ0OiBmdW5jdGlvbiAoY29udHJvbDogYW55LCBzQWdncmVnYXRpb25OYW1lOiBzdHJpbmcpIHtcblx0XHRcdGxldCBjb250cm9sRGV0YWlsID0gXCJcIjtcblx0XHRcdGlmIChzQWdncmVnYXRpb25OYW1lKSB7XG5cdFx0XHRcdGlmIChjb250cm9sLmdldFBhcmVudCgpKSB7XG5cdFx0XHRcdFx0Y29uc3QgaW5kZXhJblBhcmVudCA9IChjb250cm9sLmdldFBhcmVudCgpLmdldEFnZ3JlZ2F0aW9uKHNBZ2dyZWdhdGlvbk5hbWUpIGFzIE1hbmFnZWRPYmplY3RbXSkuaW5kZXhPZihjb250cm9sKTtcblx0XHRcdFx0XHRpZiAoaW5kZXhJblBhcmVudCA+IDApIHtcblx0XHRcdFx0XHRcdGNvbnRyb2xEZXRhaWwgKz0gYCxcXG4ke2dldFRhYigpfWA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjb250cm9sRGV0YWlsICs9IGAke2NvbnRyb2wuZ2V0TWV0YWRhdGEoKS5nZXROYW1lKCl9KGA7XG5cdFx0XHRyZXR1cm4gY29udHJvbERldGFpbDtcblx0XHR9LFxuXHRcdGVuZDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIFwifSlcIjtcblx0XHR9LFxuXHRcdG1pZGRsZTogZnVuY3Rpb24gKGNvbnRyb2w6IGFueSkge1xuXHRcdFx0bGV0IGRhdGEgPSBge2lkOiAke2NvbnRyb2wuZ2V0SWQoKX1gO1xuXHRcdFx0Zm9yIChjb25zdCBvQ29udHJvbEtleSBpbiBjb250cm9sLm1Qcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdGlmIChjb250cm9sLm1Qcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KG9Db250cm9sS2V5KSkge1xuXHRcdFx0XHRcdGRhdGEgKz0gYCxcXG4ke2dldFRhYigpfSAke29Db250cm9sS2V5fTogJHtjb250cm9sLm1Qcm9wZXJ0aWVzW29Db250cm9sS2V5XX1gO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGNvbnRyb2wubUJpbmRpbmdJbmZvcy5oYXNPd25Qcm9wZXJ0eShvQ29udHJvbEtleSkpIHtcblx0XHRcdFx0XHRjb25zdCBiaW5kaW5nRGV0YWlsID0gY29udHJvbC5tQmluZGluZ0luZm9zW29Db250cm9sS2V5XTtcblx0XHRcdFx0XHRkYXRhICs9IGAsXFxuJHtnZXRUYWIoKX0gJHtvQ29udHJvbEtleX06IGZvcm1hdHRlcigke2JpbmRpbmdEZXRhaWwucGFydHMubWFwKFxuXHRcdFx0XHRcdFx0KGJpbmRpbmdJbmZvOiBhbnkpID0+IGBcXG4ke2dldFRhYigxKX0ke2JpbmRpbmdJbmZvLm1vZGVsID8gYmluZGluZ0luZm8ubW9kZWwgOiBcIlwifT4ke2JpbmRpbmdJbmZvLnBhdGh9YFxuXHRcdFx0XHRcdCl9KWA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZvciAoY29uc3Qgb0NvbnRyb2xLZXkgaW4gY29udHJvbC5tQXNzb2NpYXRpb25zKSB7XG5cdFx0XHRcdGlmIChjb250cm9sLm1Bc3NvY2lhdGlvbnMuaGFzT3duUHJvcGVydHkob0NvbnRyb2xLZXkpKSB7XG5cdFx0XHRcdFx0ZGF0YSArPSBgLFxcbiR7Z2V0VGFiKCl9ICR7b0NvbnRyb2xLZXl9OiAke2NvbnRyb2wubUFzc29jaWF0aW9uc1tvQ29udHJvbEtleV1bMF19YDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZGF0YSArPSBgYDtcblx0XHRcdHJldHVybiBkYXRhO1xuXHRcdH0sXG5cdFx0c3RhcnRBZ2dyZWdhdGlvbjogZnVuY3Rpb24gKGNvbnRyb2w6IGFueSwgc05hbWU6IHN0cmluZykge1xuXHRcdFx0bGV0IG91dCA9IGAsXFxuJHtnZXRUYWIoKX0ke3NOYW1lfWA7XG5cdFx0XHR0YWJDb3VudCsrO1xuXG5cdFx0XHRpZiAoY29udHJvbC5tQmluZGluZ0luZm9zW3NOYW1lXSkge1xuXHRcdFx0XHRvdXQgKz0gYD17IHBhdGg6JyR7Y29udHJvbC5tQmluZGluZ0luZm9zW3NOYW1lXS5wYXRofScsIHRlbXBsYXRlOlxcbiR7Z2V0VGFiKCl9YDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dCArPSBgPVtcXG4ke2dldFRhYigpfWA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb3V0O1xuXHRcdH0sXG5cdFx0ZW5kQWdncmVnYXRpb246IGZ1bmN0aW9uIChjb250cm9sOiBhbnksIHNOYW1lOiBzdHJpbmcpIHtcblx0XHRcdHRhYkNvdW50LS07XG5cdFx0XHRpZiAoY29udHJvbC5tQmluZGluZ0luZm9zW3NOYW1lXSkge1xuXHRcdFx0XHRyZXR1cm4gYFxcbiR7Z2V0VGFiKCl9fWA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gYFxcbiR7Z2V0VGFiKCl9XWA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRpZiAoQXJyYXkuaXNBcnJheShjb250cm9sVG9TZXJpYWxpemUpKSB7XG5cdFx0cmV0dXJuIGNvbnRyb2xUb1NlcmlhbGl6ZS5tYXAoKGNvbnRyb2xUb1JlbmRlcjogQ29udHJvbCkgPT4ge1xuXHRcdFx0cmV0dXJuIG5ldyBTZXJpYWxpemVyKGNvbnRyb2xUb1JlbmRlciwgc2VyaWFsaXplRGVsZWdhdGUpLnNlcmlhbGl6ZSgpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBuZXcgU2VyaWFsaXplcihjb250cm9sVG9TZXJpYWxpemUsIHNlcmlhbGl6ZURlbGVnYXRlKS5zZXJpYWxpemUoKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXdhaXRlcigpIHtcblx0bGV0IGZuUmVzb2x2ZSE6IEZ1bmN0aW9uO1xuXHRjb25zdCBteVByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuXHRcdGZuUmVzb2x2ZSA9IHJlc29sdmU7XG5cdH0pO1xuXHRyZXR1cm4geyBwcm9taXNlOiBteVByb21pc2UsIHJlc29sdmU6IGZuUmVzb2x2ZSB9O1xufVxuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFvYkE7QUFDQTtB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