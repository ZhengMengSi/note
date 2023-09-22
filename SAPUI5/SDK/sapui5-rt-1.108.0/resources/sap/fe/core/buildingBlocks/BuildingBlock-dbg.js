/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/deepClone", "sap/base/util/merge", "sap/base/util/ObjectPath", "sap/fe/core/buildingBlocks/BuildingBlockRuntime", "sap/fe/core/CommonUtils", "sap/fe/core/helpers/BindingToolkit", "sap/fe/core/helpers/StableIdHelper", "sap/ui/base/ManagedObject", "sap/ui/core/Component", "sap/ui/core/Fragment", "sap/ui/core/util/XMLPreprocessor", "../converters/ConverterContext"], function (deepClone, merge, ObjectPath, BuildingBlockRuntime, CommonUtils, BindingToolkit, StableIdHelper, ManagedObject, Component, Fragment, XMLPreprocessor, ConverterContext) {
  "use strict";

  var _templateObject, _templateObject2, _templateObject3;

  var _exports = {};
  var generate = StableIdHelper.generate;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var xml = BuildingBlockRuntime.xml;
  var registerBuildingBlock = BuildingBlockRuntime.registerBuildingBlock;
  var escapeXMLAttributeValue = BuildingBlockRuntime.escapeXMLAttributeValue;

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  /**
   * Base class for Building Block
   */
  var BuildingBlockBase = /*#__PURE__*/function () {
    function BuildingBlockBase(oProps, _oControlConfig, _oSettings) {
      var _this = this;

      this.isPublic = false;

      this.getConverterContext = function (oVisualizationObjectPath, contextPath, mSettings, mExtraParams) {
        var oAppComponent = mSettings.appComponent;
        var originalViewData = mSettings.models.viewData && mSettings.models.viewData.getData();
        var viewData = Object.assign({}, originalViewData);
        delete viewData.resourceBundle;
        viewData = deepClone(viewData);
        viewData.controlConfiguration = merge(viewData.controlConfiguration, mExtraParams);
        return ConverterContext.createConverterContextForMacro(oVisualizationObjectPath.startingEntitySet.name, mSettings.models.metaModel, oAppComponent && oAppComponent.getDiagnostics(), merge, oVisualizationObjectPath.contextLocation, viewData);
      };

      Object.keys(oProps).forEach(function (propName) {
        _this[propName] = oProps[propName];
      });
    }
    /**
     * Convert the given local element ID to a globally unique ID by prefixing with the Building Block ID.
     *
     * @param stringParts
     * @returns Either the global ID or undefined if the Building Block doesn't have an ID
     */


    _exports.BuildingBlockBase = BuildingBlockBase;
    var _proto = BuildingBlockBase.prototype;

    _proto.createId = function createId() {
      // If the child instance has an ID property use it otherwise return undefined
      if (this.id) {
        for (var _len = arguments.length, stringParts = new Array(_len), _key = 0; _key < _len; _key++) {
          stringParts[_key] = arguments[_key];
        }

        return generate([this.id].concat(stringParts));
      }

      return undefined;
    } // This block is commented out because I am not using them for now / need to change this but still want to keep them around
    ;

    _proto.getProperties = function getProperties() {
      var allProperties = {};

      for (var oInstanceKey in this) {
        if (this.hasOwnProperty(oInstanceKey)) {
          allProperties[oInstanceKey] = this[oInstanceKey];
        }
      }

      return allProperties;
    };

    BuildingBlockBase.register = function register() {// To be overriden
    };

    BuildingBlockBase.unregister = function unregister() {// To be overriden
    };

    _proto.addConditionally = function addConditionally() {
      var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var partToAdd = arguments.length > 1 ? arguments[1] : undefined;

      if (condition) {
        return partToAdd;
      } else {
        return "";
      }
    };

    _proto.attr = function attr(attributeName, value) {
      if (value !== undefined) {
        return function () {
          return "".concat(attributeName, "=\"").concat(escapeXMLAttributeValue(value), "\"");
        };
      } else {
        return function () {
          return "";
        };
      }
    };

    return BuildingBlockBase;
  }();

  _exports.BuildingBlockBase = BuildingBlockBase;

  var ensureMetadata = function (target) {
    if (!target.hasOwnProperty("metadata")) {
      target.metadata = deepClone(target.metadata || {
        properties: {},
        aggregations: {},
        events: {}
      });
    }

    return target.metadata;
  };
  /**
   * Indicates that the property shall be declared as an xml attribute that can be used from the outside of the building block.
   *
   * If defining a runtime Building Block, please make sure to use the correct typings: Depending on its metadata,
   * a property can either be a {@link sap.ui.model.Context} (<code>type: 'sap.ui.model.Context'</code>),
   * a constant (<code>bindable: false</code>), or a {@link BindingToolkitExpression} (<code>bindable: true</code>).
   *
   * @param attributeDefinition
   * @returns The decorated property
   */


  function xmlAttribute(attributeDefinition) {
    return function (target, propertyKey, propertyDescriptor) {
      var metadata = ensureMetadata(target.constructor);

      if (attributeDefinition.defaultValue === undefined) {
        var _propertyDescriptor$i;

        // If there is no defaultValue we can take the value from the initializer (natural way of defining defaults)
        attributeDefinition.defaultValue = (_propertyDescriptor$i = propertyDescriptor.initializer) === null || _propertyDescriptor$i === void 0 ? void 0 : _propertyDescriptor$i.call(propertyDescriptor);
      }

      delete propertyDescriptor.initializer;

      if (metadata.properties[propertyKey.toString()] === undefined) {
        metadata.properties[propertyKey.toString()] = attributeDefinition;
      }

      return propertyDescriptor;
    }; // Needed to make TS happy with those decorators;
  }

  _exports.xmlAttribute = xmlAttribute;

  function blockAttribute(attributeDefinition) {
    return xmlAttribute(attributeDefinition);
  }

  _exports.blockAttribute = blockAttribute;

  function xmlEvent() {
    return function (target, propertyKey, propertyDescriptor) {
      var metadata = ensureMetadata(target.constructor);
      delete propertyDescriptor.initializer;

      if (metadata.events[propertyKey.toString()] === undefined) {
        metadata.events[propertyKey.toString()] = {
          type: "Function"
        };
      }

      return propertyDescriptor;
    }; // Needed to make TS happy with those decorators;
  }

  _exports.xmlEvent = xmlEvent;

  function blockEvent() {
    return xmlEvent();
  }
  /**
   * Indicates that the property shall be declared as an xml aggregation that can be used from the outside of the building block.
   *
   * @param aggregationDefinition
   * @returns The decorated property
   */


  _exports.blockEvent = blockEvent;

  function xmlAggregation(aggregationDefinition) {
    return function (target, propertyKey, propertyDescriptor) {
      var metadata = ensureMetadata(target.constructor);
      delete propertyDescriptor.initializer;

      if (metadata.aggregations[propertyKey] === undefined) {
        metadata.aggregations[propertyKey] = aggregationDefinition;
      }

      return propertyDescriptor;
    };
  }

  _exports.xmlAggregation = xmlAggregation;

  function blockAggregation(aggregationDefinition) {
    return xmlAggregation(aggregationDefinition);
  }

  _exports.blockAggregation = blockAggregation;
  var RUNTIME_BLOCKS = {};

  function defineBuildingBlock(oBuildingBlockDefinition) {
    return function (classDefinition) {
      ensureMetadata(classDefinition);
      classDefinition.xmlTag = oBuildingBlockDefinition.name;
      classDefinition.namespace = oBuildingBlockDefinition.namespace;
      classDefinition.publicNamespace = oBuildingBlockDefinition.publicNamespace;
      classDefinition.fragment = oBuildingBlockDefinition.fragment;
      classDefinition.isOpen = oBuildingBlockDefinition.isOpen;
      classDefinition.isRuntime = oBuildingBlockDefinition.isRuntime;
      classDefinition.apiVersion = 2;

      if (classDefinition.isRuntime === true) {
        classDefinition.prototype.getTemplate = function () {
          var className = "".concat(oBuildingBlockDefinition.namespace, ".").concat(oBuildingBlockDefinition.name);
          var extraProps = [];

          for (var propertiesKey in classDefinition.metadata.properties) {
            var propertyValue = this[propertiesKey];

            if (propertyValue !== undefined && propertyValue !== null) {
              var _propertyValue, _propertyValue$isA;

              if (((_propertyValue = propertyValue) === null || _propertyValue === void 0 ? void 0 : (_propertyValue$isA = _propertyValue.isA) === null || _propertyValue$isA === void 0 ? void 0 : _propertyValue$isA.call(_propertyValue, "sap.ui.model.Context")) === true) {
                propertyValue = propertyValue.getPath();
              }

              extraProps.push(xml(_templateObject || (_templateObject = _taggedTemplateLiteral(["feBB:", "=\"", "\""])), propertiesKey, propertyValue));
            }
          }

          for (var eventsKey in classDefinition.metadata.events) {
            var eventsValue = this[eventsKey];

            if (eventsValue !== undefined) {
              extraProps.push(xml(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["feBB:", "=\"", "\""])), eventsKey, eventsValue));
            }
          }

          return xml(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["<core:Fragment\n\t\t\t\t\txmlns:core=\"sap.ui.core\"\n\t\t\t\t\txmlns:feBB=\"sap.fe.core.buildingBlocks\"\n\t\t\t\t\tfragmentName=\"", "\"\n\t\t\t\t\tid=\"{this>id}\"\n\t\t\t\t\ttype=\"FE_COMPONENTS\"\n\t\t\t\t\t", "\n\t\t\t\t>\n\t\t\t\t</core:Fragment>"])), className, extraProps);
        };
      }

      classDefinition.register = function () {
        registerBuildingBlock(classDefinition);

        if (classDefinition.isRuntime === true) {
          RUNTIME_BLOCKS["".concat(oBuildingBlockDefinition.namespace, ".").concat(oBuildingBlockDefinition.name)] = classDefinition;
        }
      };

      classDefinition.unregister = function () {
        XMLPreprocessor.plugIn(null, classDefinition.namespace, classDefinition.name);
        XMLPreprocessor.plugIn(null, classDefinition.publicNamespace, classDefinition.name);
      };
    };
  }

  _exports.defineBuildingBlock = defineBuildingBlock;
  Fragment.registerType("FE_COMPONENTS", {
    load: function (mSettings) {
      try {
        return Promise.resolve(RUNTIME_BLOCKS[mSettings.fragmentName]);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    init: function (mSettings) {
      try {
        var _mSettings$customData, _mSettings$customData2, _mSettings$customData3, _mSettings$customData4;

        var _this3 = this;

        var MyClass = mSettings.fragmentContent;

        if (!MyClass) {
          // In some case we might have been called here synchronously (unstash case for instance), which means we didn't go through the load function
          MyClass = RUNTIME_BLOCKS[mSettings.fragmentName];
        }

        var classSettings = {};
        var feCustomData = (mSettings === null || mSettings === void 0 ? void 0 : (_mSettings$customData = mSettings.customData) === null || _mSettings$customData === void 0 ? void 0 : (_mSettings$customData2 = _mSettings$customData[0]) === null || _mSettings$customData2 === void 0 ? void 0 : (_mSettings$customData3 = _mSettings$customData2.mProperties) === null || _mSettings$customData3 === void 0 ? void 0 : (_mSettings$customData4 = _mSettings$customData3.value) === null || _mSettings$customData4 === void 0 ? void 0 : _mSettings$customData4["sap.fe.core.buildingBlocks"]) || {};
        delete mSettings.customData;
        var pageComponent = Component.getOwnerComponentFor(mSettings.containingView);
        var appComponent = CommonUtils.getAppComponent(mSettings.containingView);
        var metaModel = appComponent.getMetaModel();
        var pageModel = pageComponent.getModel("_pageModel");

        for (var propertyName in MyClass.metadata.properties) {
          var propertyMetadata = MyClass.metadata.properties[propertyName];
          var pageModelContext = pageModel.createBindingContext(feCustomData[propertyName]);

          if (pageModelContext === null) {
            // value cannot be resolved, so it is either a runtime binding or a constant
            var vValue = feCustomData[propertyName];

            if (typeof vValue === "string") {
              if (propertyMetadata.bindable !== true) {
                // runtime bindings are not allowed, so convert strings into actual primitive types
                switch (propertyMetadata.type) {
                  case "boolean":
                    vValue = vValue === "true";
                    break;

                  case "number":
                    vValue = Number(vValue);
                    break;
                }
              } else {
                // runtime bindings are allowed, so resolve the values as BindingToolkit expressions
                vValue = resolveBindingString(vValue, propertyMetadata.type);
              }
            }

            classSettings[propertyName] = vValue;
          } else if (pageModelContext.getObject() !== undefined) {
            // get value from page model
            classSettings[propertyName] = pageModelContext.getObject();
          } else {
            // bind to metamodel
            classSettings[propertyName] = metaModel.createBindingContext(feCustomData[propertyName]);
          }
        }

        for (var eventName in MyClass.metadata.events) {
          if (feCustomData[eventName] !== undefined && feCustomData[eventName].startsWith(".")) {
            classSettings[eventName] = ObjectPath.get(feCustomData[eventName].substring(1), mSettings.containingView.getController());
          } else {
            classSettings[eventName] = ""; // For now, might need to resolve more stuff
          }
        }

        return Promise.resolve(ManagedObject.runWithPreprocessors(function () {
          var renderedControl = new MyClass(classSettings).render(mSettings.containingView, appComponent);

          if (!_this3._bAsync) {
            _this3._aContent = renderedControl;
          }

          return renderedControl;
        }, {
          id: function (sId) {
            return mSettings.containingView.createId(sId);
          },
          settings: function (controlSettings) {
            var allAssociations = this.getMetadata().getAssociations();

            for (var _i = 0, _Object$keys = Object.keys(allAssociations); _i < _Object$keys.length; _i++) {
              var associationDetailName = _Object$keys[_i];

              if (controlSettings.hasOwnProperty(associationDetailName)) {
                controlSettings[associationDetailName] = mSettings.containingView.createId(controlSettings[associationDetailName]);
              }
            }

            return controlSettings;
          }
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  });
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCdWlsZGluZ0Jsb2NrQmFzZSIsIm9Qcm9wcyIsIl9vQ29udHJvbENvbmZpZyIsIl9vU2V0dGluZ3MiLCJpc1B1YmxpYyIsImdldENvbnZlcnRlckNvbnRleHQiLCJvVmlzdWFsaXphdGlvbk9iamVjdFBhdGgiLCJjb250ZXh0UGF0aCIsIm1TZXR0aW5ncyIsIm1FeHRyYVBhcmFtcyIsIm9BcHBDb21wb25lbnQiLCJhcHBDb21wb25lbnQiLCJvcmlnaW5hbFZpZXdEYXRhIiwibW9kZWxzIiwidmlld0RhdGEiLCJnZXREYXRhIiwiT2JqZWN0IiwiYXNzaWduIiwicmVzb3VyY2VCdW5kbGUiLCJkZWVwQ2xvbmUiLCJjb250cm9sQ29uZmlndXJhdGlvbiIsIm1lcmdlIiwiQ29udmVydGVyQ29udGV4dCIsImNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyIsInN0YXJ0aW5nRW50aXR5U2V0IiwibmFtZSIsIm1ldGFNb2RlbCIsImdldERpYWdub3N0aWNzIiwiY29udGV4dExvY2F0aW9uIiwia2V5cyIsImZvckVhY2giLCJwcm9wTmFtZSIsImNyZWF0ZUlkIiwiaWQiLCJzdHJpbmdQYXJ0cyIsImdlbmVyYXRlIiwidW5kZWZpbmVkIiwiZ2V0UHJvcGVydGllcyIsImFsbFByb3BlcnRpZXMiLCJvSW5zdGFuY2VLZXkiLCJoYXNPd25Qcm9wZXJ0eSIsInJlZ2lzdGVyIiwidW5yZWdpc3RlciIsImFkZENvbmRpdGlvbmFsbHkiLCJjb25kaXRpb24iLCJwYXJ0VG9BZGQiLCJhdHRyIiwiYXR0cmlidXRlTmFtZSIsInZhbHVlIiwiZXNjYXBlWE1MQXR0cmlidXRlVmFsdWUiLCJlbnN1cmVNZXRhZGF0YSIsInRhcmdldCIsIm1ldGFkYXRhIiwicHJvcGVydGllcyIsImFnZ3JlZ2F0aW9ucyIsImV2ZW50cyIsInhtbEF0dHJpYnV0ZSIsImF0dHJpYnV0ZURlZmluaXRpb24iLCJwcm9wZXJ0eUtleSIsInByb3BlcnR5RGVzY3JpcHRvciIsImNvbnN0cnVjdG9yIiwiZGVmYXVsdFZhbHVlIiwiaW5pdGlhbGl6ZXIiLCJ0b1N0cmluZyIsImJsb2NrQXR0cmlidXRlIiwieG1sRXZlbnQiLCJ0eXBlIiwiYmxvY2tFdmVudCIsInhtbEFnZ3JlZ2F0aW9uIiwiYWdncmVnYXRpb25EZWZpbml0aW9uIiwiYmxvY2tBZ2dyZWdhdGlvbiIsIlJVTlRJTUVfQkxPQ0tTIiwiZGVmaW5lQnVpbGRpbmdCbG9jayIsIm9CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbiIsImNsYXNzRGVmaW5pdGlvbiIsInhtbFRhZyIsIm5hbWVzcGFjZSIsInB1YmxpY05hbWVzcGFjZSIsImZyYWdtZW50IiwiaXNPcGVuIiwiaXNSdW50aW1lIiwiYXBpVmVyc2lvbiIsInByb3RvdHlwZSIsImdldFRlbXBsYXRlIiwiY2xhc3NOYW1lIiwiZXh0cmFQcm9wcyIsInByb3BlcnRpZXNLZXkiLCJwcm9wZXJ0eVZhbHVlIiwiaXNBIiwiZ2V0UGF0aCIsInB1c2giLCJ4bWwiLCJldmVudHNLZXkiLCJldmVudHNWYWx1ZSIsInJlZ2lzdGVyQnVpbGRpbmdCbG9jayIsIlhNTFByZXByb2Nlc3NvciIsInBsdWdJbiIsIkZyYWdtZW50IiwicmVnaXN0ZXJUeXBlIiwibG9hZCIsImZyYWdtZW50TmFtZSIsImluaXQiLCJNeUNsYXNzIiwiZnJhZ21lbnRDb250ZW50IiwiY2xhc3NTZXR0aW5ncyIsImZlQ3VzdG9tRGF0YSIsImN1c3RvbURhdGEiLCJtUHJvcGVydGllcyIsInBhZ2VDb21wb25lbnQiLCJDb21wb25lbnQiLCJnZXRPd25lckNvbXBvbmVudEZvciIsImNvbnRhaW5pbmdWaWV3IiwiQ29tbW9uVXRpbHMiLCJnZXRBcHBDb21wb25lbnQiLCJnZXRNZXRhTW9kZWwiLCJwYWdlTW9kZWwiLCJnZXRNb2RlbCIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5TWV0YWRhdGEiLCJwYWdlTW9kZWxDb250ZXh0IiwiY3JlYXRlQmluZGluZ0NvbnRleHQiLCJ2VmFsdWUiLCJiaW5kYWJsZSIsIk51bWJlciIsInJlc29sdmVCaW5kaW5nU3RyaW5nIiwiZ2V0T2JqZWN0IiwiZXZlbnROYW1lIiwic3RhcnRzV2l0aCIsIk9iamVjdFBhdGgiLCJnZXQiLCJzdWJzdHJpbmciLCJnZXRDb250cm9sbGVyIiwiTWFuYWdlZE9iamVjdCIsInJ1bldpdGhQcmVwcm9jZXNzb3JzIiwicmVuZGVyZWRDb250cm9sIiwicmVuZGVyIiwiX2JBc3luYyIsIl9hQ29udGVudCIsInNJZCIsInNldHRpbmdzIiwiY29udHJvbFNldHRpbmdzIiwiYWxsQXNzb2NpYXRpb25zIiwiZ2V0TWV0YWRhdGEiLCJnZXRBc3NvY2lhdGlvbnMiLCJhc3NvY2lhdGlvbkRldGFpbE5hbWUiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkJ1aWxkaW5nQmxvY2sudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlZXBDbG9uZSBmcm9tIFwic2FwL2Jhc2UvdXRpbC9kZWVwQ2xvbmVcIjtcbmltcG9ydCBtZXJnZSBmcm9tIFwic2FwL2Jhc2UvdXRpbC9tZXJnZVwiO1xuaW1wb3J0IE9iamVjdFBhdGggZnJvbSBcInNhcC9iYXNlL3V0aWwvT2JqZWN0UGF0aFwiO1xuaW1wb3J0IHsgZXNjYXBlWE1MQXR0cmlidXRlVmFsdWUsIHJlZ2lzdGVyQnVpbGRpbmdCbG9jaywgeG1sIH0gZnJvbSBcInNhcC9mZS9jb3JlL2J1aWxkaW5nQmxvY2tzL0J1aWxkaW5nQmxvY2tSdW50aW1lXCI7XG5pbXBvcnQgQ29tbW9uVXRpbHMgZnJvbSBcInNhcC9mZS9jb3JlL0NvbW1vblV0aWxzXCI7XG5pbXBvcnQgeyByZXNvbHZlQmluZGluZ1N0cmluZyB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0JpbmRpbmdUb29sa2l0XCI7XG5pbXBvcnQgeyBnZW5lcmF0ZSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL1N0YWJsZUlkSGVscGVyXCI7XG5pbXBvcnQgVGVtcGxhdGVDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL1RlbXBsYXRlQ29tcG9uZW50XCI7XG5pbXBvcnQgTWFuYWdlZE9iamVjdCBmcm9tIFwic2FwL3VpL2Jhc2UvTWFuYWdlZE9iamVjdFwiO1xuaW1wb3J0IENvbXBvbmVudCBmcm9tIFwic2FwL3VpL2NvcmUvQ29tcG9uZW50XCI7XG5pbXBvcnQgRnJhZ21lbnQgZnJvbSBcInNhcC91aS9jb3JlL0ZyYWdtZW50XCI7XG5pbXBvcnQgWE1MUHJlcHJvY2Vzc29yIGZyb20gXCJzYXAvdWkvY29yZS91dGlsL1hNTFByZXByb2Nlc3NvclwiO1xuaW1wb3J0IHR5cGUgeyBNYW5hZ2VkT2JqZWN0RXggfSBmcm9tIFwidHlwZXMvZXh0ZW5zaW9uX3R5cGVzXCI7XG5pbXBvcnQgQ29udmVydGVyQ29udGV4dCBmcm9tIFwiLi4vY29udmVydGVycy9Db252ZXJ0ZXJDb250ZXh0XCI7XG5cbi8vIFR5cGUgZm9yIHRoZSBhY2Nlc3NvciBkZWNvcmF0b3IgdGhhdCB3ZSBlbmQgdXAgd2l0aCBpbiBiYWJlbC5cbnR5cGUgQWNjZXNzb3JEZXNjcmlwdG9yPFQ+ID0gVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8VD4gJiB7IGluaXRpYWxpemVyPzogKCkgPT4gVCB9O1xuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBCdWlsZGluZyBCbG9ja1xuICovXG5leHBvcnQgY2xhc3MgQnVpbGRpbmdCbG9ja0Jhc2Uge1xuXHRwcm90ZWN0ZWQgaXNQdWJsaWMgPSBmYWxzZTtcblx0cHJvdGVjdGVkIGlkITogc3RyaW5nO1xuXHRjb25zdHJ1Y3RvcihvUHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT4sIF9vQ29udHJvbENvbmZpZz86IGFueSwgX29TZXR0aW5ncz86IGFueSkge1xuXHRcdE9iamVjdC5rZXlzKG9Qcm9wcykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcblx0XHRcdHRoaXNbcHJvcE5hbWUgYXMga2V5b2YgdGhpc10gPSBvUHJvcHNbcHJvcE5hbWVdO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgdGhlIGdpdmVuIGxvY2FsIGVsZW1lbnQgSUQgdG8gYSBnbG9iYWxseSB1bmlxdWUgSUQgYnkgcHJlZml4aW5nIHdpdGggdGhlIEJ1aWxkaW5nIEJsb2NrIElELlxuXHQgKlxuXHQgKiBAcGFyYW0gc3RyaW5nUGFydHNcblx0ICogQHJldHVybnMgRWl0aGVyIHRoZSBnbG9iYWwgSUQgb3IgdW5kZWZpbmVkIGlmIHRoZSBCdWlsZGluZyBCbG9jayBkb2Vzbid0IGhhdmUgYW4gSURcblx0ICovXG5cdHB1YmxpYyBjcmVhdGVJZCguLi5zdHJpbmdQYXJ0czogc3RyaW5nW10pIHtcblx0XHQvLyBJZiB0aGUgY2hpbGQgaW5zdGFuY2UgaGFzIGFuIElEIHByb3BlcnR5IHVzZSBpdCBvdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZFxuXHRcdGlmICh0aGlzLmlkKSB7XG5cdFx0XHRyZXR1cm4gZ2VuZXJhdGUoWyh0aGlzIGFzIGFueSkuaWQsIC4uLnN0cmluZ1BhcnRzXSk7XG5cdFx0fVxuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblx0Ly8gVGhpcyBibG9jayBpcyBjb21tZW50ZWQgb3V0IGJlY2F1c2UgSSBhbSBub3QgdXNpbmcgdGhlbSBmb3Igbm93IC8gbmVlZCB0byBjaGFuZ2UgdGhpcyBidXQgc3RpbGwgd2FudCB0byBrZWVwIHRoZW0gYXJvdW5kXG5cdHByb3RlY3RlZCBnZXRDb252ZXJ0ZXJDb250ZXh0ID0gZnVuY3Rpb24gKG9WaXN1YWxpemF0aW9uT2JqZWN0UGF0aDogYW55LCBjb250ZXh0UGF0aDogYW55LCBtU2V0dGluZ3M6IGFueSwgbUV4dHJhUGFyYW1zPzogYW55KSB7XG5cdFx0Y29uc3Qgb0FwcENvbXBvbmVudCA9IG1TZXR0aW5ncy5hcHBDb21wb25lbnQ7XG5cdFx0Y29uc3Qgb3JpZ2luYWxWaWV3RGF0YSA9IG1TZXR0aW5ncy5tb2RlbHMudmlld0RhdGEgJiYgbVNldHRpbmdzLm1vZGVscy52aWV3RGF0YS5nZXREYXRhKCk7XG5cdFx0bGV0IHZpZXdEYXRhID0gT2JqZWN0LmFzc2lnbih7fSwgb3JpZ2luYWxWaWV3RGF0YSk7XG5cdFx0ZGVsZXRlIHZpZXdEYXRhLnJlc291cmNlQnVuZGxlO1xuXHRcdHZpZXdEYXRhID0gZGVlcENsb25lKHZpZXdEYXRhKTtcblx0XHR2aWV3RGF0YS5jb250cm9sQ29uZmlndXJhdGlvbiA9IG1lcmdlKHZpZXdEYXRhLmNvbnRyb2xDb25maWd1cmF0aW9uLCBtRXh0cmFQYXJhbXMpO1xuXHRcdHJldHVybiBDb252ZXJ0ZXJDb250ZXh0LmNyZWF0ZUNvbnZlcnRlckNvbnRleHRGb3JNYWNybyhcblx0XHRcdG9WaXN1YWxpemF0aW9uT2JqZWN0UGF0aC5zdGFydGluZ0VudGl0eVNldC5uYW1lLFxuXHRcdFx0bVNldHRpbmdzLm1vZGVscy5tZXRhTW9kZWwsXG5cdFx0XHRvQXBwQ29tcG9uZW50ICYmIG9BcHBDb21wb25lbnQuZ2V0RGlhZ25vc3RpY3MoKSxcblx0XHRcdG1lcmdlLFxuXHRcdFx0b1Zpc3VhbGl6YXRpb25PYmplY3RQYXRoLmNvbnRleHRMb2NhdGlvbixcblx0XHRcdHZpZXdEYXRhXG5cdFx0KTtcblx0fTtcblx0cHVibGljIGdldFByb3BlcnRpZXMoKSB7XG5cdFx0Y29uc3QgYWxsUHJvcGVydGllczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuXHRcdGZvciAoY29uc3Qgb0luc3RhbmNlS2V5IGluIHRoaXMpIHtcblx0XHRcdGlmICh0aGlzLmhhc093blByb3BlcnR5KG9JbnN0YW5jZUtleSkpIHtcblx0XHRcdFx0YWxsUHJvcGVydGllc1tvSW5zdGFuY2VLZXldID0gdGhpc1tvSW5zdGFuY2VLZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYWxsUHJvcGVydGllcztcblx0fVxuXHRzdGF0aWMgcmVnaXN0ZXIoKSB7XG5cdFx0Ly8gVG8gYmUgb3ZlcnJpZGVuXG5cdH1cblx0c3RhdGljIHVucmVnaXN0ZXIoKSB7XG5cdFx0Ly8gVG8gYmUgb3ZlcnJpZGVuXG5cdH1cblx0cHVibGljIGFkZENvbmRpdGlvbmFsbHkoY29uZGl0aW9uID0gZmFsc2UsIHBhcnRUb0FkZD86IGFueSkge1xuXHRcdGlmIChjb25kaXRpb24pIHtcblx0XHRcdHJldHVybiBwYXJ0VG9BZGQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblx0fVxuXHRwcm90ZWN0ZWQgYXR0cihhdHRyaWJ1dGVOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiAoKSA9PiBzdHJpbmcge1xuXHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gKCkgPT4gYCR7YXR0cmlidXRlTmFtZX09XCIke2VzY2FwZVhNTEF0dHJpYnV0ZVZhbHVlKHZhbHVlKX1cImA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiAoKSA9PiBcIlwiO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgdHlwZSBCdWlsZGluZ0Jsb2NrUHJvcGVydHlEZWZpbml0aW9uID0ge1xuXHR0eXBlOiBzdHJpbmc7XG5cdGlzUHVibGljPzogYm9vbGVhbjtcblx0ZGVmYXVsdFZhbHVlPzogYW55O1xuXHRjb21wdXRlZD86IGJvb2xlYW47XG5cdHJlcXVpcmVkPzogYm9vbGVhbjtcblx0YmluZGFibGU/OiBib29sZWFuOyAvLyBvbmx5IGNvbnNpZGVyZWQgZm9yIHJ1bnRpbWUgYnVpbGRpbmcgYmxvY2tzXG5cdCRraW5kPzogc3RyaW5nW107XG59O1xuZXhwb3J0IHR5cGUgQnVpbGRpbmdCbG9ja01ldGFkYXRhQ29udGV4dERlZmluaXRpb24gPSB7XG5cdHR5cGU6IHN0cmluZztcblx0aXNQdWJsaWM/OiBib29sZWFuO1xuXHRyZXF1aXJlZD86IGJvb2xlYW47XG5cdGNvbXB1dGVkPzogYm9vbGVhbjtcblx0JFR5cGU/OiBzdHJpbmdbXTtcblx0JGtpbmQ/OiBzdHJpbmdbXTtcbn07XG5leHBvcnQgdHlwZSBCdWlsZGluZ0Jsb2NrRXZlbnQgPSB7fTtcbmV4cG9ydCB0eXBlIEJ1aWxkaW5nQmxvY2tBZ2dyZWdhdGlvbkRlZmluaXRpb24gPSB7XG5cdGlzUHVibGljPzogYm9vbGVhbjtcblx0dHlwZTogc3RyaW5nO1xuXHRzbG90Pzogc3RyaW5nO1xuXHRpc0RlZmF1bHQ/OiBib29sZWFuO1xufTtcbnR5cGUgQ29tbW9uQnVpbGRpbmdCbG9ja0RlZmluaXRpb24gPSB7XG5cdG5hbWVzcGFjZTogc3RyaW5nO1xuXHRuYW1lOiBzdHJpbmc7XG5cdHhtbFRhZz86IHN0cmluZztcblx0ZnJhZ21lbnQ/OiBzdHJpbmc7XG5cdHB1YmxpY05hbWVzcGFjZT86IHN0cmluZztcblxuXHRpc1J1bnRpbWU/OiBib29sZWFuO1xuXHRpc09wZW4/OiBib29sZWFuO1xufTtcbmV4cG9ydCB0eXBlIEJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uVjIgPSBDb21tb25CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbiAmXG5cdHR5cGVvZiBCdWlsZGluZ0Jsb2NrQmFzZSAmIHtcblx0XHRhcGlWZXJzaW9uOiAyO1xuXHRcdG1ldGFkYXRhOiBCdWlsZGluZ0Jsb2NrTWV0YWRhdGE7XG5cdH07XG5cbmV4cG9ydCB0eXBlIEJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uVjEgPSBDb21tb25CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbiAmIHtcblx0bmFtZTogc3RyaW5nO1xuXHRhcGlWZXJzaW9uPzogMTtcblx0Y3JlYXRlPzogRnVuY3Rpb247XG5cdGdldFRlbXBsYXRlPzogRnVuY3Rpb247XG5cdG1ldGFkYXRhOiBCdWlsZGluZ0Jsb2NrTWV0YWRhdGE7XG59O1xuZXhwb3J0IHR5cGUgQnVpbGRpbmdCbG9ja0RlZmluaXRpb24gPSBCdWlsZGluZ0Jsb2NrRGVmaW5pdGlvblYyIHwgQnVpbGRpbmdCbG9ja0RlZmluaXRpb25WMTtcbmV4cG9ydCB0eXBlIEJ1aWxkaW5nQmxvY2tNZXRhZGF0YSA9IHtcblx0ZXZlbnRzOiBSZWNvcmQ8c3RyaW5nLCBCdWlsZGluZ0Jsb2NrRXZlbnQ+O1xuXHRwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBCdWlsZGluZ0Jsb2NrUHJvcGVydHlEZWZpbml0aW9uPjtcblx0YWdncmVnYXRpb25zOiBSZWNvcmQ8c3RyaW5nLCBCdWlsZGluZ0Jsb2NrQWdncmVnYXRpb25EZWZpbml0aW9uPjtcbn07XG5cbmNvbnN0IGVuc3VyZU1ldGFkYXRhID0gZnVuY3Rpb24gKHRhcmdldDogUGFydGlhbDxCdWlsZGluZ0Jsb2NrRGVmaW5pdGlvblYyPik6IEJ1aWxkaW5nQmxvY2tNZXRhZGF0YSB7XG5cdGlmICghdGFyZ2V0Lmhhc093blByb3BlcnR5KFwibWV0YWRhdGFcIikpIHtcblx0XHR0YXJnZXQubWV0YWRhdGEgPSBkZWVwQ2xvbmUoXG5cdFx0XHR0YXJnZXQubWV0YWRhdGEgfHwge1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fSxcblx0XHRcdFx0YWdncmVnYXRpb25zOiB7fSxcblx0XHRcdFx0ZXZlbnRzOiB7fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblx0cmV0dXJuIHRhcmdldC5tZXRhZGF0YSBhcyBCdWlsZGluZ0Jsb2NrTWV0YWRhdGE7XG59O1xuXG4vKipcbiAqIEluZGljYXRlcyB0aGF0IHRoZSBwcm9wZXJ0eSBzaGFsbCBiZSBkZWNsYXJlZCBhcyBhbiB4bWwgYXR0cmlidXRlIHRoYXQgY2FuIGJlIHVzZWQgZnJvbSB0aGUgb3V0c2lkZSBvZiB0aGUgYnVpbGRpbmcgYmxvY2suXG4gKlxuICogSWYgZGVmaW5pbmcgYSBydW50aW1lIEJ1aWxkaW5nIEJsb2NrLCBwbGVhc2UgbWFrZSBzdXJlIHRvIHVzZSB0aGUgY29ycmVjdCB0eXBpbmdzOiBEZXBlbmRpbmcgb24gaXRzIG1ldGFkYXRhLFxuICogYSBwcm9wZXJ0eSBjYW4gZWl0aGVyIGJlIGEge0BsaW5rIHNhcC51aS5tb2RlbC5Db250ZXh0fSAoPGNvZGU+dHlwZTogJ3NhcC51aS5tb2RlbC5Db250ZXh0JzwvY29kZT4pLFxuICogYSBjb25zdGFudCAoPGNvZGU+YmluZGFibGU6IGZhbHNlPC9jb2RlPiksIG9yIGEge0BsaW5rIEJpbmRpbmdUb29sa2l0RXhwcmVzc2lvbn0gKDxjb2RlPmJpbmRhYmxlOiB0cnVlPC9jb2RlPikuXG4gKlxuICogQHBhcmFtIGF0dHJpYnV0ZURlZmluaXRpb25cbiAqIEByZXR1cm5zIFRoZSBkZWNvcmF0ZWQgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHhtbEF0dHJpYnV0ZShhdHRyaWJ1dGVEZWZpbml0aW9uOiBCdWlsZGluZ0Jsb2NrUHJvcGVydHlEZWZpbml0aW9uKTogUHJvcGVydHlEZWNvcmF0b3Ige1xuXHRyZXR1cm4gZnVuY3Rpb24gKHRhcmdldDogQnVpbGRpbmdCbG9ja0Jhc2UsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBTeW1ib2wsIHByb3BlcnR5RGVzY3JpcHRvcjogQWNjZXNzb3JEZXNjcmlwdG9yPGFueT4pIHtcblx0XHRjb25zdCBtZXRhZGF0YSA9IGVuc3VyZU1ldGFkYXRhKHRhcmdldC5jb25zdHJ1Y3Rvcik7XG5cdFx0aWYgKGF0dHJpYnV0ZURlZmluaXRpb24uZGVmYXVsdFZhbHVlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vIElmIHRoZXJlIGlzIG5vIGRlZmF1bHRWYWx1ZSB3ZSBjYW4gdGFrZSB0aGUgdmFsdWUgZnJvbSB0aGUgaW5pdGlhbGl6ZXIgKG5hdHVyYWwgd2F5IG9mIGRlZmluaW5nIGRlZmF1bHRzKVxuXHRcdFx0YXR0cmlidXRlRGVmaW5pdGlvbi5kZWZhdWx0VmFsdWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IuaW5pdGlhbGl6ZXI/LigpO1xuXHRcdH1cblx0XHRkZWxldGUgcHJvcGVydHlEZXNjcmlwdG9yLmluaXRpYWxpemVyO1xuXHRcdGlmIChtZXRhZGF0YS5wcm9wZXJ0aWVzW3Byb3BlcnR5S2V5LnRvU3RyaW5nKCldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdG1ldGFkYXRhLnByb3BlcnRpZXNbcHJvcGVydHlLZXkudG9TdHJpbmcoKV0gPSBhdHRyaWJ1dGVEZWZpbml0aW9uO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9wZXJ0eURlc2NyaXB0b3I7XG5cdH0gYXMgYW55OyAvLyBOZWVkZWQgdG8gbWFrZSBUUyBoYXBweSB3aXRoIHRob3NlIGRlY29yYXRvcnM7XG59XG5leHBvcnQgZnVuY3Rpb24gYmxvY2tBdHRyaWJ1dGUoYXR0cmlidXRlRGVmaW5pdGlvbjogQnVpbGRpbmdCbG9ja1Byb3BlcnR5RGVmaW5pdGlvbik6IFByb3BlcnR5RGVjb3JhdG9yIHtcblx0cmV0dXJuIHhtbEF0dHJpYnV0ZShhdHRyaWJ1dGVEZWZpbml0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHhtbEV2ZW50KCk6IFByb3BlcnR5RGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IEJ1aWxkaW5nQmxvY2tCYXNlLCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgU3ltYm9sLCBwcm9wZXJ0eURlc2NyaXB0b3I6IEFjY2Vzc29yRGVzY3JpcHRvcjxhbnk+KSB7XG5cdFx0Y29uc3QgbWV0YWRhdGEgPSBlbnN1cmVNZXRhZGF0YSh0YXJnZXQuY29uc3RydWN0b3IpO1xuXHRcdGRlbGV0ZSBwcm9wZXJ0eURlc2NyaXB0b3IuaW5pdGlhbGl6ZXI7XG5cdFx0aWYgKG1ldGFkYXRhLmV2ZW50c1twcm9wZXJ0eUtleS50b1N0cmluZygpXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRtZXRhZGF0YS5ldmVudHNbcHJvcGVydHlLZXkudG9TdHJpbmcoKV0gPSB7IHR5cGU6IFwiRnVuY3Rpb25cIiB9O1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9wZXJ0eURlc2NyaXB0b3I7XG5cdH0gYXMgYW55OyAvLyBOZWVkZWQgdG8gbWFrZSBUUyBoYXBweSB3aXRoIHRob3NlIGRlY29yYXRvcnM7XG59XG5leHBvcnQgZnVuY3Rpb24gYmxvY2tFdmVudCgpOiBQcm9wZXJ0eURlY29yYXRvciB7XG5cdHJldHVybiB4bWxFdmVudCgpO1xufVxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgcHJvcGVydHkgc2hhbGwgYmUgZGVjbGFyZWQgYXMgYW4geG1sIGFnZ3JlZ2F0aW9uIHRoYXQgY2FuIGJlIHVzZWQgZnJvbSB0aGUgb3V0c2lkZSBvZiB0aGUgYnVpbGRpbmcgYmxvY2suXG4gKlxuICogQHBhcmFtIGFnZ3JlZ2F0aW9uRGVmaW5pdGlvblxuICogQHJldHVybnMgVGhlIGRlY29yYXRlZCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24geG1sQWdncmVnYXRpb24oYWdncmVnYXRpb25EZWZpbml0aW9uOiBCdWlsZGluZ0Jsb2NrQWdncmVnYXRpb25EZWZpbml0aW9uKTogUHJvcGVydHlEZWNvcmF0b3Ige1xuXHRyZXR1cm4gZnVuY3Rpb24gKHRhcmdldDogQnVpbGRpbmdCbG9ja0Jhc2UsIHByb3BlcnR5S2V5OiBzdHJpbmcsIHByb3BlcnR5RGVzY3JpcHRvcjogVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8YW55Pikge1xuXHRcdGNvbnN0IG1ldGFkYXRhID0gZW5zdXJlTWV0YWRhdGEodGFyZ2V0LmNvbnN0cnVjdG9yKTtcblx0XHRkZWxldGUgKHByb3BlcnR5RGVzY3JpcHRvciBhcyBhbnkpLmluaXRpYWxpemVyO1xuXHRcdGlmIChtZXRhZGF0YS5hZ2dyZWdhdGlvbnNbcHJvcGVydHlLZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdG1ldGFkYXRhLmFnZ3JlZ2F0aW9uc1twcm9wZXJ0eUtleV0gPSBhZ2dyZWdhdGlvbkRlZmluaXRpb247XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb3BlcnR5RGVzY3JpcHRvcjtcblx0fSBhcyBhbnk7XG59XG5leHBvcnQgZnVuY3Rpb24gYmxvY2tBZ2dyZWdhdGlvbihhZ2dyZWdhdGlvbkRlZmluaXRpb246IEJ1aWxkaW5nQmxvY2tBZ2dyZWdhdGlvbkRlZmluaXRpb24pOiBQcm9wZXJ0eURlY29yYXRvciB7XG5cdHJldHVybiB4bWxBZ2dyZWdhdGlvbihhZ2dyZWdhdGlvbkRlZmluaXRpb24pO1xufVxuY29uc3QgUlVOVElNRV9CTE9DS1M6IFJlY29yZDxzdHJpbmcsIEJ1aWxkaW5nQmxvY2tEZWZpbml0aW9uPiA9IHt9O1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUJ1aWxkaW5nQmxvY2sob0J1aWxkaW5nQmxvY2tEZWZpbml0aW9uOiBDb21tb25CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbik6IENsYXNzRGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChjbGFzc0RlZmluaXRpb246IGFueSkge1xuXHRcdGVuc3VyZU1ldGFkYXRhKGNsYXNzRGVmaW5pdGlvbik7XG5cdFx0Y2xhc3NEZWZpbml0aW9uLnhtbFRhZyA9IG9CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lO1xuXHRcdGNsYXNzRGVmaW5pdGlvbi5uYW1lc3BhY2UgPSBvQnVpbGRpbmdCbG9ja0RlZmluaXRpb24ubmFtZXNwYWNlO1xuXHRcdGNsYXNzRGVmaW5pdGlvbi5wdWJsaWNOYW1lc3BhY2UgPSBvQnVpbGRpbmdCbG9ja0RlZmluaXRpb24ucHVibGljTmFtZXNwYWNlO1xuXHRcdGNsYXNzRGVmaW5pdGlvbi5mcmFnbWVudCA9IG9CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5mcmFnbWVudDtcblx0XHRjbGFzc0RlZmluaXRpb24uaXNPcGVuID0gb0J1aWxkaW5nQmxvY2tEZWZpbml0aW9uLmlzT3Blbjtcblx0XHRjbGFzc0RlZmluaXRpb24uaXNSdW50aW1lID0gb0J1aWxkaW5nQmxvY2tEZWZpbml0aW9uLmlzUnVudGltZTtcblx0XHRjbGFzc0RlZmluaXRpb24uYXBpVmVyc2lvbiA9IDI7XG5cdFx0aWYgKGNsYXNzRGVmaW5pdGlvbi5pc1J1bnRpbWUgPT09IHRydWUpIHtcblx0XHRcdGNsYXNzRGVmaW5pdGlvbi5wcm90b3R5cGUuZ2V0VGVtcGxhdGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGNvbnN0IGNsYXNzTmFtZSA9IGAke29CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lc3BhY2V9LiR7b0J1aWxkaW5nQmxvY2tEZWZpbml0aW9uLm5hbWV9YDtcblx0XHRcdFx0Y29uc3QgZXh0cmFQcm9wcyA9IFtdO1xuXHRcdFx0XHRmb3IgKGNvbnN0IHByb3BlcnRpZXNLZXkgaW4gY2xhc3NEZWZpbml0aW9uLm1ldGFkYXRhLnByb3BlcnRpZXMpIHtcblx0XHRcdFx0XHRsZXQgcHJvcGVydHlWYWx1ZSA9IHRoaXNbcHJvcGVydGllc0tleV07XG5cdFx0XHRcdFx0aWYgKHByb3BlcnR5VmFsdWUgIT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0eVZhbHVlICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRpZiAocHJvcGVydHlWYWx1ZT8uaXNBPy4oXCJzYXAudWkubW9kZWwuQ29udGV4dFwiKSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0XHRwcm9wZXJ0eVZhbHVlID0gcHJvcGVydHlWYWx1ZS5nZXRQYXRoKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRleHRyYVByb3BzLnB1c2goeG1sYGZlQkI6JHtwcm9wZXJ0aWVzS2V5fT1cIiR7cHJvcGVydHlWYWx1ZX1cImApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGNvbnN0IGV2ZW50c0tleSBpbiBjbGFzc0RlZmluaXRpb24ubWV0YWRhdGEuZXZlbnRzKSB7XG5cdFx0XHRcdFx0Y29uc3QgZXZlbnRzVmFsdWUgPSB0aGlzW2V2ZW50c0tleV07XG5cdFx0XHRcdFx0aWYgKGV2ZW50c1ZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGV4dHJhUHJvcHMucHVzaCh4bWxgZmVCQjoke2V2ZW50c0tleX09XCIke2V2ZW50c1ZhbHVlfVwiYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB4bWxgPGNvcmU6RnJhZ21lbnRcblx0XHRcdFx0XHR4bWxuczpjb3JlPVwic2FwLnVpLmNvcmVcIlxuXHRcdFx0XHRcdHhtbG5zOmZlQkI9XCJzYXAuZmUuY29yZS5idWlsZGluZ0Jsb2Nrc1wiXG5cdFx0XHRcdFx0ZnJhZ21lbnROYW1lPVwiJHtjbGFzc05hbWV9XCJcblx0XHRcdFx0XHRpZD1cInt0aGlzPmlkfVwiXG5cdFx0XHRcdFx0dHlwZT1cIkZFX0NPTVBPTkVOVFNcIlxuXHRcdFx0XHRcdCR7ZXh0cmFQcm9wc31cblx0XHRcdFx0PlxuXHRcdFx0XHQ8L2NvcmU6RnJhZ21lbnQ+YDtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0Y2xhc3NEZWZpbml0aW9uLnJlZ2lzdGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVnaXN0ZXJCdWlsZGluZ0Jsb2NrKGNsYXNzRGVmaW5pdGlvbik7XG5cdFx0XHRpZiAoY2xhc3NEZWZpbml0aW9uLmlzUnVudGltZSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRSVU5USU1FX0JMT0NLU1tgJHtvQnVpbGRpbmdCbG9ja0RlZmluaXRpb24ubmFtZXNwYWNlfS4ke29CdWlsZGluZ0Jsb2NrRGVmaW5pdGlvbi5uYW1lfWBdID0gY2xhc3NEZWZpbml0aW9uO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y2xhc3NEZWZpbml0aW9uLnVucmVnaXN0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRYTUxQcmVwcm9jZXNzb3IucGx1Z0luKG51bGwsIGNsYXNzRGVmaW5pdGlvbi5uYW1lc3BhY2UsIGNsYXNzRGVmaW5pdGlvbi5uYW1lKTtcblx0XHRcdFhNTFByZXByb2Nlc3Nvci5wbHVnSW4obnVsbCwgY2xhc3NEZWZpbml0aW9uLnB1YmxpY05hbWVzcGFjZSwgY2xhc3NEZWZpbml0aW9uLm5hbWUpO1xuXHRcdH07XG5cdH07XG59XG5cbkZyYWdtZW50LnJlZ2lzdGVyVHlwZShcIkZFX0NPTVBPTkVOVFNcIiwge1xuXHRsb2FkOiBhc3luYyBmdW5jdGlvbiAobVNldHRpbmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG5cdFx0cmV0dXJuIFJVTlRJTUVfQkxPQ0tTW21TZXR0aW5ncy5mcmFnbWVudE5hbWVdO1xuXHR9LFxuXHRpbml0OiBhc3luYyBmdW5jdGlvbiAobVNldHRpbmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG5cdFx0bGV0IE15Q2xhc3MgPSBtU2V0dGluZ3MuZnJhZ21lbnRDb250ZW50O1xuXHRcdGlmICghTXlDbGFzcykge1xuXHRcdFx0Ly8gSW4gc29tZSBjYXNlIHdlIG1pZ2h0IGhhdmUgYmVlbiBjYWxsZWQgaGVyZSBzeW5jaHJvbm91c2x5ICh1bnN0YXNoIGNhc2UgZm9yIGluc3RhbmNlKSwgd2hpY2ggbWVhbnMgd2UgZGlkbid0IGdvIHRocm91Z2ggdGhlIGxvYWQgZnVuY3Rpb25cblx0XHRcdE15Q2xhc3MgPSBSVU5USU1FX0JMT0NLU1ttU2V0dGluZ3MuZnJhZ21lbnROYW1lXTtcblx0XHR9XG5cdFx0Y29uc3QgY2xhc3NTZXR0aW5nczogYW55ID0ge307XG5cdFx0Y29uc3QgZmVDdXN0b21EYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gbVNldHRpbmdzPy5jdXN0b21EYXRhPy5bMF0/Lm1Qcm9wZXJ0aWVzPy52YWx1ZT8uW1wic2FwLmZlLmNvcmUuYnVpbGRpbmdCbG9ja3NcIl0gfHwge307XG5cdFx0ZGVsZXRlIG1TZXR0aW5ncy5jdXN0b21EYXRhO1xuXHRcdGNvbnN0IHBhZ2VDb21wb25lbnQgPSBDb21wb25lbnQuZ2V0T3duZXJDb21wb25lbnRGb3IobVNldHRpbmdzLmNvbnRhaW5pbmdWaWV3KSBhcyBUZW1wbGF0ZUNvbXBvbmVudDtcblx0XHRjb25zdCBhcHBDb21wb25lbnQgPSBDb21tb25VdGlscy5nZXRBcHBDb21wb25lbnQobVNldHRpbmdzLmNvbnRhaW5pbmdWaWV3KTtcblx0XHRjb25zdCBtZXRhTW9kZWwgPSBhcHBDb21wb25lbnQuZ2V0TWV0YU1vZGVsKCk7XG5cdFx0Y29uc3QgcGFnZU1vZGVsID0gcGFnZUNvbXBvbmVudC5nZXRNb2RlbChcIl9wYWdlTW9kZWxcIik7XG5cdFx0Zm9yIChjb25zdCBwcm9wZXJ0eU5hbWUgaW4gTXlDbGFzcy5tZXRhZGF0YS5wcm9wZXJ0aWVzKSB7XG5cdFx0XHRjb25zdCBwcm9wZXJ0eU1ldGFkYXRhID0gTXlDbGFzcy5tZXRhZGF0YS5wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdFx0XHRjb25zdCBwYWdlTW9kZWxDb250ZXh0ID0gcGFnZU1vZGVsLmNyZWF0ZUJpbmRpbmdDb250ZXh0KGZlQ3VzdG9tRGF0YVtwcm9wZXJ0eU5hbWVdKTtcblxuXHRcdFx0aWYgKHBhZ2VNb2RlbENvbnRleHQgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gdmFsdWUgY2Fubm90IGJlIHJlc29sdmVkLCBzbyBpdCBpcyBlaXRoZXIgYSBydW50aW1lIGJpbmRpbmcgb3IgYSBjb25zdGFudFxuXHRcdFx0XHRsZXQgdlZhbHVlID0gZmVDdXN0b21EYXRhW3Byb3BlcnR5TmFtZV07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB2VmFsdWUgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRpZiAocHJvcGVydHlNZXRhZGF0YS5iaW5kYWJsZSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdFx0Ly8gcnVudGltZSBiaW5kaW5ncyBhcmUgbm90IGFsbG93ZWQsIHNvIGNvbnZlcnQgc3RyaW5ncyBpbnRvIGFjdHVhbCBwcmltaXRpdmUgdHlwZXNcblx0XHRcdFx0XHRcdHN3aXRjaCAocHJvcGVydHlNZXRhZGF0YS50eXBlKSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJib29sZWFuXCI6XG5cdFx0XHRcdFx0XHRcdFx0dlZhbHVlID0gdlZhbHVlID09PSBcInRydWVcIjtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSBcIm51bWJlclwiOlxuXHRcdFx0XHRcdFx0XHRcdHZWYWx1ZSA9IE51bWJlcih2VmFsdWUpO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBydW50aW1lIGJpbmRpbmdzIGFyZSBhbGxvd2VkLCBzbyByZXNvbHZlIHRoZSB2YWx1ZXMgYXMgQmluZGluZ1Rvb2xraXQgZXhwcmVzc2lvbnNcblx0XHRcdFx0XHRcdHZWYWx1ZSA9IHJlc29sdmVCaW5kaW5nU3RyaW5nKHZWYWx1ZSwgcHJvcGVydHlNZXRhZGF0YS50eXBlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjbGFzc1NldHRpbmdzW3Byb3BlcnR5TmFtZV0gPSB2VmFsdWU7XG5cdFx0XHR9IGVsc2UgaWYgKHBhZ2VNb2RlbENvbnRleHQuZ2V0T2JqZWN0KCkgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQvLyBnZXQgdmFsdWUgZnJvbSBwYWdlIG1vZGVsXG5cdFx0XHRcdGNsYXNzU2V0dGluZ3NbcHJvcGVydHlOYW1lXSA9IHBhZ2VNb2RlbENvbnRleHQuZ2V0T2JqZWN0KCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBiaW5kIHRvIG1ldGFtb2RlbFxuXHRcdFx0XHRjbGFzc1NldHRpbmdzW3Byb3BlcnR5TmFtZV0gPSBtZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoZmVDdXN0b21EYXRhW3Byb3BlcnR5TmFtZV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGNvbnN0IGV2ZW50TmFtZSBpbiBNeUNsYXNzLm1ldGFkYXRhLmV2ZW50cykge1xuXHRcdFx0aWYgKGZlQ3VzdG9tRGF0YVtldmVudE5hbWVdICE9PSB1bmRlZmluZWQgJiYgKGZlQ3VzdG9tRGF0YVtldmVudE5hbWVdIGFzIHN0cmluZykuc3RhcnRzV2l0aChcIi5cIikpIHtcblx0XHRcdFx0Y2xhc3NTZXR0aW5nc1tldmVudE5hbWVdID0gT2JqZWN0UGF0aC5nZXQoZmVDdXN0b21EYXRhW2V2ZW50TmFtZV0uc3Vic3RyaW5nKDEpLCBtU2V0dGluZ3MuY29udGFpbmluZ1ZpZXcuZ2V0Q29udHJvbGxlcigpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsYXNzU2V0dGluZ3NbZXZlbnROYW1lXSA9IFwiXCI7IC8vIEZvciBub3csIG1pZ2h0IG5lZWQgdG8gcmVzb2x2ZSBtb3JlIHN0dWZmXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAoTWFuYWdlZE9iamVjdCBhcyB1bmtub3duIGFzIE1hbmFnZWRPYmplY3RFeCkucnVuV2l0aFByZXByb2Nlc3NvcnMoXG5cdFx0XHQoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHJlbmRlcmVkQ29udHJvbCA9IG5ldyBNeUNsYXNzKGNsYXNzU2V0dGluZ3MpLnJlbmRlcihtU2V0dGluZ3MuY29udGFpbmluZ1ZpZXcsIGFwcENvbXBvbmVudCk7XG5cdFx0XHRcdGlmICghKHRoaXMgYXMgYW55KS5fYkFzeW5jKSB7XG5cdFx0XHRcdFx0KHRoaXMgYXMgYW55KS5fYUNvbnRlbnQgPSByZW5kZXJlZENvbnRyb2w7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlbmRlcmVkQ29udHJvbDtcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGlkOiBmdW5jdGlvbiAoc0lkOiBzdHJpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm4gbVNldHRpbmdzLmNvbnRhaW5pbmdWaWV3LmNyZWF0ZUlkKHNJZCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldHRpbmdzOiBmdW5jdGlvbiAoY29udHJvbFNldHRpbmdzOiBhbnkpIHtcblx0XHRcdFx0XHRjb25zdCBhbGxBc3NvY2lhdGlvbnMgPSB0aGlzLmdldE1ldGFkYXRhKCkuZ2V0QXNzb2NpYXRpb25zKCk7XG5cdFx0XHRcdFx0Zm9yIChjb25zdCBhc3NvY2lhdGlvbkRldGFpbE5hbWUgb2YgT2JqZWN0LmtleXMoYWxsQXNzb2NpYXRpb25zKSkge1xuXHRcdFx0XHRcdFx0aWYgKGNvbnRyb2xTZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShhc3NvY2lhdGlvbkRldGFpbE5hbWUpKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xTZXR0aW5nc1thc3NvY2lhdGlvbkRldGFpbE5hbWVdID0gbVNldHRpbmdzLmNvbnRhaW5pbmdWaWV3LmNyZWF0ZUlkKFxuXHRcdFx0XHRcdFx0XHRcdGNvbnRyb2xTZXR0aW5nc1thc3NvY2lhdGlvbkRldGFpbE5hbWVdXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBjb250cm9sU2V0dGluZ3M7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG59KTtcbiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0VBaUJBO0FBQ0E7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