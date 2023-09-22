/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/util/merge", "sap/base/util/ObjectPath", "sap/base/util/uid", "sap/ui/base/Metadata", "sap/ui/core/mvc/ControllerMetadata"], function (merge, ObjectPath, uid, Metadata, ControllerMetadata) {
  "use strict";

  var _exports = {};

  var ensureMetadata = function (target) {
    target.metadata = merge({
      controllerExtensions: {},
      properties: {},
      macroContexts: {},
      aggregations: {},
      associations: {},
      methods: {},
      events: {},
      interfaces: []
    }, target.metadata || {});
    return target.metadata;
  };
  /* #region CONTROLLER EXTENSIONS */

  /**
   * Defines that the following method is an override for the method name with the same name in the specific controller extension or base implementation.
   *
   * @param extensionName The name of the extension that will be overriden
   * @returns The decorated method
   */


  function methodOverride(extensionName) {
    return function (target, propertyKey) {
      if (!target.override) {
        target.override = {};
      }

      var currentTarget = target.override;

      if (extensionName) {
        if (!currentTarget.extension) {
          currentTarget.extension = {};
        }

        if (!currentTarget.extension[extensionName]) {
          currentTarget.extension[extensionName] = {};
        }

        currentTarget = currentTarget.extension[extensionName];
      }

      currentTarget[propertyKey.toString()] = target[propertyKey.toString()];
    };
  }
  /**
   * Defines that the method can be extended by other controller extension based on the defined overrideExecutionType.
   *
   * @param overrideExecutionType The OverrideExecution defining when the override should run (Before / After / Instead)
   * @returns The decorated method
   */


  _exports.methodOverride = methodOverride;

  function extensible(overrideExecutionType) {
    return function (target, propertyKey) {
      var metadata = ensureMetadata(target);

      if (!metadata.methods[propertyKey.toString()]) {
        metadata.methods[propertyKey.toString()] = {};
      }

      metadata.methods[propertyKey.toString()].overrideExecution = overrideExecutionType;
    };
  }
  /**
   * Defines that the method will be publicly available for controller extension usage.
   *
   * @returns The decorated method
   */


  _exports.extensible = extensible;

  function publicExtension() {
    return function (target, propertyKey, descriptor) {
      var metadata = ensureMetadata(target);
      descriptor.enumerable = true;

      if (!metadata.methods[propertyKey.toString()]) {
        metadata.methods[propertyKey.toString()] = {};
      }

      metadata.methods[propertyKey.toString()].public = true;
    };
  }
  /**
   * Defines that the method will be only available for internal usage of the controller extension.
   *
   * @returns The decorated method
   */


  _exports.publicExtension = publicExtension;

  function privateExtension() {
    return function (target, propertyKey, descriptor) {
      var metadata = ensureMetadata(target);
      descriptor.enumerable = true;

      if (!metadata.methods[propertyKey.toString()]) {
        metadata.methods[propertyKey.toString()] = {};
      }

      metadata.methods[propertyKey.toString()].public = false;
    };
  }
  /**
   * Defines that the method cannot be further extended by other controller extension.
   *
   * @returns The decorated method
   */


  _exports.privateExtension = privateExtension;

  function finalExtension() {
    return function (target, propertyKey, descriptor) {
      var metadata = ensureMetadata(target);
      descriptor.enumerable = true;

      if (!metadata.methods[propertyKey.toString()]) {
        metadata.methods[propertyKey.toString()] = {};
      }

      metadata.methods[propertyKey.toString()].final = true;
    };
  }
  /**
   * Defines that we are going to use instantiate a controller extension under the following variable name.
   *
   * @param extensionClass The controller extension that will be instantiated
   * @returns The decorated property
   */


  _exports.finalExtension = finalExtension;

  function usingExtension(extensionClass) {
    return function (target, propertyKey, propertyDescriptor) {
      var metadata = ensureMetadata(target);
      delete propertyDescriptor.initializer;
      metadata.controllerExtensions[propertyKey.toString()] = extensionClass;
      return propertyDescriptor;
    }; // This is technically an accessor decorator, but somehow the compiler doesn't like it if i declare it as such.
  }
  /* #endregion */

  /* #region CONTROL */

  /**
   * Indicates that the property shall be declared as an event on the control metadata.
   *
   * @returns The decorated property
   */


  _exports.usingExtension = usingExtension;

  function event() {
    return function (target, eventKey) {
      var metadata = ensureMetadata(target);

      if (!metadata.events[eventKey.toString()]) {
        metadata.events[eventKey.toString()] = {};
      }
    };
  }
  /**
   * Defines the following property in the control metatada.
   *
   * @param ui5PropertyMetadata The property definition
   * @returns The decorated property.
   */


  _exports.event = event;

  function property(ui5PropertyMetadata) {
    return function (target, propertyKey, propertyDescriptor) {
      var metadata = ensureMetadata(target);

      if (!metadata.properties[propertyKey]) {
        metadata.properties[propertyKey] = ui5PropertyMetadata;
      }

      delete propertyDescriptor.writable;
      delete propertyDescriptor.initializer;
      return propertyDescriptor;
    }; // This is technically an accessor decorator, but somehow the compiler doesn't like it if i declare it as such.;
  }
  /**
   * Defines and configure the following aggregation in the control metatada.
   *
   * @param ui5AggregationMetadata The aggregation definition
   * @returns The decorated property.
   */


  _exports.property = property;

  function aggregation(ui5AggregationMetadata) {
    return function (target, propertyKey, propertyDescriptor) {
      var metadata = ensureMetadata(target);

      if (ui5AggregationMetadata.multiple === undefined) {
        // UI5 defaults this to true but this is just weird...
        ui5AggregationMetadata.multiple = false;
      }

      if (!metadata.aggregations[propertyKey]) {
        metadata.aggregations[propertyKey] = ui5AggregationMetadata;
      }

      if (ui5AggregationMetadata.isDefault) {
        metadata.defaultAggregation = propertyKey;
      }

      delete propertyDescriptor.writable;
      delete propertyDescriptor.initializer;
      return propertyDescriptor;
    }; // This is technically an accessor decorator, but somehow the compiler doesn't like it if i declare it as such.;
  }
  /**
   * Defines and configure the following association in the control metatada.
   *
   * @param ui5AssociationMetadata The definition of the association.
   * @returns The decorated property
   */


  _exports.aggregation = aggregation;

  function association(ui5AssociationMetadata) {
    return function (target, propertyKey, propertyDescriptor) {
      var metadata = ensureMetadata(target);

      if (!metadata.associations[propertyKey]) {
        metadata.associations[propertyKey] = ui5AssociationMetadata;
      }

      delete propertyDescriptor.writable;
      delete propertyDescriptor.initializer;
      return propertyDescriptor;
    }; // This is technically an accessor decorator, but somehow the compiler doesn't like it if i declare it as such.;
  }
  /**
   * Defines in the metadata that this control implements a specific interface.
   *
   * @param interfaceName The name of the implemented interface
   * @returns The decorated method
   */


  _exports.association = association;

  function implementInterface(interfaceName) {
    return function (target) {
      var metadata = ensureMetadata(target);
      metadata.interfaces.push(interfaceName);
    };
  }
  /**
   * Indicates that the following method should also be exposed statically so we can call it from XML.
   *
   * @returns The decorated method
   */


  _exports.implementInterface = implementInterface;

  function xmlEventHandler() {
    return function (target, propertykey) {
      var currentConstructor = target.constructor;

      currentConstructor[propertykey.toString()] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (args && args.length) {
          var currentTarget = currentConstructor.getAPI(args[0]);
          currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget[propertykey.toString()].apply(currentTarget, args);
        }
      };
    };
  }
  /**
   * Indicates that the following class should define a UI5 control of the specified name.
   *
   * @param sTarget The fully qualified name of the macro API
   * @param metadataDefinition Inline metadata definition
   * @class
   */


  _exports.xmlEventHandler = xmlEventHandler;

  function defineUI5Class(sTarget, metadataDefinition) {
    return function (constructor) {
      if (!constructor.prototype.metadata) {
        constructor.prototype.metadata = {};
      }

      if (metadataDefinition) {
        for (var key in metadataDefinition) {
          constructor.prototype.metadata[key] = metadataDefinition[key];
        }
      }

      return registerUI5Metadata(constructor, sTarget, constructor.prototype);
    };
  }

  _exports.defineUI5Class = defineUI5Class;

  function createReference() {
    return {
      current: undefined,
      setCurrent: function (oControlInstance) {
        this.current = oControlInstance;
      }
    };
  }
  /**
   * Defines that the following object will hold a reference to a control through jsx templating.
   *
   * @returns The decorated property.
   */


  _exports.createReference = createReference;

  function defineReference() {
    return function (target, propertyKey, propertyDescriptor) {
      delete propertyDescriptor.writable;
      delete propertyDescriptor.initializer;
      propertyDescriptor.initializer = createReference;
      return propertyDescriptor;
    }; // This is technically an accessor decorator, but somehow the compiler doesn't like it if i declare it as such.;
  }
  /**
   * Internal heavy lifting that will take care of creating the class property for ui5 to use.
   *
   * @param clazz The class prototype
   * @param name The name of the class to create
   * @param inObj The metadata object
   * @returns The metadata class
   */


  _exports.defineReference = defineReference;

  function registerUI5Metadata(clazz, name, inObj) {
    var _clazz$getMetadata, _inObj$metadata, _clazz$metadata, _obj$metadata;

    if (clazz.getMetadata && clazz.getMetadata().isA("sap.ui.core.mvc.ControllerExtension")) {
      Object.getOwnPropertyNames(inObj).forEach(function (objName) {
        var descriptor = Object.getOwnPropertyDescriptor(inObj, objName);

        if (descriptor && !descriptor.enumerable) {
          descriptor.enumerable = true; //		Log.error(`Property ${objName} from ${name} should be decorated as public`);
        }
      });
    }

    var obj = {};
    obj.metadata = inObj.metadata || {};
    obj.override = inObj.override;
    obj.constructor = clazz;
    obj.metadata.baseType = Object.getPrototypeOf(clazz.prototype).getMetadata().getName();

    if ((clazz === null || clazz === void 0 ? void 0 : (_clazz$getMetadata = clazz.getMetadata()) === null || _clazz$getMetadata === void 0 ? void 0 : _clazz$getMetadata.getStereotype()) === "control") {
      var rendererDefinition = inObj.renderer || clazz.renderer || clazz.render;
      obj.renderer = {
        apiVersion: 2
      };

      if (typeof rendererDefinition === "function") {
        obj.renderer.render = rendererDefinition;
      } else if (rendererDefinition != undefined) {
        obj.renderer = rendererDefinition;
      }
    }

    obj.metadata.interfaces = ((_inObj$metadata = inObj.metadata) === null || _inObj$metadata === void 0 ? void 0 : _inObj$metadata.interfaces) || ((_clazz$metadata = clazz.metadata) === null || _clazz$metadata === void 0 ? void 0 : _clazz$metadata.interfaces);
    Object.keys(clazz.prototype).forEach(function (key) {
      if (key !== "metadata") {
        try {
          obj[key] = clazz.prototype[key];
        } catch (e) {//console.log(e);
        }
      }
    });

    if ((_obj$metadata = obj.metadata) !== null && _obj$metadata !== void 0 && _obj$metadata.controllerExtensions && Object.keys(obj.metadata.controllerExtensions).length > 0) {
      for (var cExtName in obj.metadata.controllerExtensions) {
        obj[cExtName] = obj.metadata.controllerExtensions[cExtName];
      }
    }

    var output = clazz.extend(name, obj);
    var fnInit = output.prototype.init;

    output.prototype.init = function () {
      var _this = this;

      if (fnInit) {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        fnInit.apply(this, args);
      }

      this.metadata = obj.metadata;

      if (obj.metadata.properties) {
        var aPropertyKeys = Object.keys(obj.metadata.properties);
        aPropertyKeys.forEach(function (propertyKey) {
          Object.defineProperty(_this, propertyKey, {
            configurable: true,
            set: function (v) {
              return _this.setProperty(propertyKey, v);
            },
            get: function () {
              return _this.getProperty(propertyKey);
            }
          });
        });
        var aAggregationKeys = Object.keys(obj.metadata.aggregations);
        aAggregationKeys.forEach(function (aggregationKey) {
          Object.defineProperty(_this, aggregationKey, {
            configurable: true,
            set: function (v) {
              return _this.setAggregation(aggregationKey, v);
            },
            get: function () {
              var aggregationContent = _this.getAggregation(aggregationKey);

              if (obj.metadata.aggregations[aggregationKey].multiple) {
                return aggregationContent || [];
              } else {
                return aggregationContent;
              }
            }
          });
        });
        var aAssociationKeys = Object.keys(obj.metadata.associations);
        aAssociationKeys.forEach(function (associationKey) {
          Object.defineProperty(_this, associationKey, {
            configurable: true,
            set: function (v) {
              return _this.setAssociation(associationKey, v);
            },
            get: function () {
              var aggregationContent = _this.getAssociation(associationKey);

              if (obj.metadata.associations[associationKey].multiple) {
                return aggregationContent || [];
              } else {
                return aggregationContent;
              }
            }
          });
        });
      }
    };

    clazz.override = function (oExtension) {
      var pol = {};

      pol.constructor = function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return clazz.apply(this, args);
      };

      var oClass = Metadata.createClass(clazz, "anonymousExtension~".concat(uid()), pol, ControllerMetadata);
      oClass.getMetadata()._staticOverride = oExtension;
      oClass.getMetadata()._override = clazz.getMetadata()._override;
      return oClass;
    };

    ObjectPath.set(name, output);
    return output;
  }

  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJlbnN1cmVNZXRhZGF0YSIsInRhcmdldCIsIm1ldGFkYXRhIiwibWVyZ2UiLCJjb250cm9sbGVyRXh0ZW5zaW9ucyIsInByb3BlcnRpZXMiLCJtYWNyb0NvbnRleHRzIiwiYWdncmVnYXRpb25zIiwiYXNzb2NpYXRpb25zIiwibWV0aG9kcyIsImV2ZW50cyIsImludGVyZmFjZXMiLCJtZXRob2RPdmVycmlkZSIsImV4dGVuc2lvbk5hbWUiLCJwcm9wZXJ0eUtleSIsIm92ZXJyaWRlIiwiY3VycmVudFRhcmdldCIsImV4dGVuc2lvbiIsInRvU3RyaW5nIiwiZXh0ZW5zaWJsZSIsIm92ZXJyaWRlRXhlY3V0aW9uVHlwZSIsIm92ZXJyaWRlRXhlY3V0aW9uIiwicHVibGljRXh0ZW5zaW9uIiwiZGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdWJsaWMiLCJwcml2YXRlRXh0ZW5zaW9uIiwiZmluYWxFeHRlbnNpb24iLCJmaW5hbCIsInVzaW5nRXh0ZW5zaW9uIiwiZXh0ZW5zaW9uQ2xhc3MiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJpbml0aWFsaXplciIsImV2ZW50IiwiZXZlbnRLZXkiLCJwcm9wZXJ0eSIsInVpNVByb3BlcnR5TWV0YWRhdGEiLCJ3cml0YWJsZSIsImFnZ3JlZ2F0aW9uIiwidWk1QWdncmVnYXRpb25NZXRhZGF0YSIsIm11bHRpcGxlIiwidW5kZWZpbmVkIiwiaXNEZWZhdWx0IiwiZGVmYXVsdEFnZ3JlZ2F0aW9uIiwiYXNzb2NpYXRpb24iLCJ1aTVBc3NvY2lhdGlvbk1ldGFkYXRhIiwiaW1wbGVtZW50SW50ZXJmYWNlIiwiaW50ZXJmYWNlTmFtZSIsInB1c2giLCJ4bWxFdmVudEhhbmRsZXIiLCJwcm9wZXJ0eWtleSIsImN1cnJlbnRDb25zdHJ1Y3RvciIsImNvbnN0cnVjdG9yIiwiYXJncyIsImxlbmd0aCIsImdldEFQSSIsImRlZmluZVVJNUNsYXNzIiwic1RhcmdldCIsIm1ldGFkYXRhRGVmaW5pdGlvbiIsInByb3RvdHlwZSIsImtleSIsInJlZ2lzdGVyVUk1TWV0YWRhdGEiLCJjcmVhdGVSZWZlcmVuY2UiLCJjdXJyZW50Iiwic2V0Q3VycmVudCIsIm9Db250cm9sSW5zdGFuY2UiLCJkZWZpbmVSZWZlcmVuY2UiLCJjbGF6eiIsIm5hbWUiLCJpbk9iaiIsImdldE1ldGFkYXRhIiwiaXNBIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImZvckVhY2giLCJvYmpOYW1lIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwib2JqIiwiYmFzZVR5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE5hbWUiLCJnZXRTdGVyZW90eXBlIiwicmVuZGVyZXJEZWZpbml0aW9uIiwicmVuZGVyZXIiLCJyZW5kZXIiLCJhcGlWZXJzaW9uIiwia2V5cyIsImUiLCJjRXh0TmFtZSIsIm91dHB1dCIsImV4dGVuZCIsImZuSW5pdCIsImluaXQiLCJhcHBseSIsImFQcm9wZXJ0eUtleXMiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsInNldCIsInYiLCJzZXRQcm9wZXJ0eSIsImdldCIsImdldFByb3BlcnR5IiwiYUFnZ3JlZ2F0aW9uS2V5cyIsImFnZ3JlZ2F0aW9uS2V5Iiwic2V0QWdncmVnYXRpb24iLCJhZ2dyZWdhdGlvbkNvbnRlbnQiLCJnZXRBZ2dyZWdhdGlvbiIsImFBc3NvY2lhdGlvbktleXMiLCJhc3NvY2lhdGlvbktleSIsInNldEFzc29jaWF0aW9uIiwiZ2V0QXNzb2NpYXRpb24iLCJvRXh0ZW5zaW9uIiwicG9sIiwib0NsYXNzIiwiTWV0YWRhdGEiLCJjcmVhdGVDbGFzcyIsInVpZCIsIkNvbnRyb2xsZXJNZXRhZGF0YSIsIl9zdGF0aWNPdmVycmlkZSIsIl9vdmVycmlkZSIsIk9iamVjdFBhdGgiXSwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIkNsYXNzU3VwcG9ydC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWVyZ2UgZnJvbSBcInNhcC9iYXNlL3V0aWwvbWVyZ2VcIjtcbmltcG9ydCBPYmplY3RQYXRoIGZyb20gXCJzYXAvYmFzZS91dGlsL09iamVjdFBhdGhcIjtcbmltcG9ydCB1aWQgZnJvbSBcInNhcC9iYXNlL3V0aWwvdWlkXCI7XG5pbXBvcnQgdHlwZSBVSTVFdmVudCBmcm9tIFwic2FwL3VpL2Jhc2UvRXZlbnRcIjtcbmltcG9ydCBNZXRhZGF0YSBmcm9tIFwic2FwL3VpL2Jhc2UvTWV0YWRhdGFcIjtcbmltcG9ydCB0eXBlIENvbnRyb2xsZXJFeHRlbnNpb24gZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyRXh0ZW5zaW9uXCI7XG5pbXBvcnQgQ29udHJvbGxlck1ldGFkYXRhIGZyb20gXCJzYXAvdWkvY29yZS9tdmMvQ29udHJvbGxlck1ldGFkYXRhXCI7XG5pbXBvcnQgdHlwZSBPdmVycmlkZUV4ZWN1dGlvbiBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL092ZXJyaWRlRXhlY3V0aW9uXCI7XG5cbnR5cGUgT3ZlcnJpZGVEZWZpbml0aW9uID0gUmVjb3JkPHN0cmluZywgRnVuY3Rpb24+O1xudHlwZSBVSTVDb250cm9sbGVyTWV0aG9kRGVmaW5pdGlvbiA9IHtcblx0b3ZlcnJpZGVFeGVjdXRpb24/OiBPdmVycmlkZUV4ZWN1dGlvbjtcblx0cHVibGljPzogYm9vbGVhbjtcblx0ZmluYWw/OiBib29sZWFuO1xufTtcbnR5cGUgVUk1UHJvcGVydHlNZXRhZGF0YSA9IHtcblx0dHlwZTogc3RyaW5nO1xuXHRyZXF1aXJlZD86IGJvb2xlYW47XG5cdGdyb3VwPzogc3RyaW5nO1xuXHRkZWZhdWx0VmFsdWU/OiBhbnk7XG5cdGV4cGVjdGVkQW5ub3RhdGlvbnM/OiBzdHJpbmdbXTtcblx0ZXhwZWN0ZWRUeXBlcz86IHN0cmluZ1tdO1xufTtcbnR5cGUgVUk1QWdncmVnYXRpb25NZXRhZGF0YSA9IHtcblx0dHlwZTogc3RyaW5nO1xuXHRtdWx0aXBsZT86IGJvb2xlYW47XG5cdGlzRGVmYXVsdD86IGJvb2xlYW47XG5cdHNpbmd1bGFyTmFtZT86IHN0cmluZztcblx0dmlzaWJpbGl0eT86IHN0cmluZztcbn07XG50eXBlIFVJNUFzc29jaWF0aW9uTWV0YWRhdGEgPSB7XG5cdHR5cGU6IHN0cmluZztcblx0bXVsdGlwbGU/OiBib29sZWFuO1xuXHRzaW5ndWxhck5hbWU/OiBzdHJpbmc7XG59O1xudHlwZSBVSTVDb250cm9sTWV0YWRhdGFEZWZpbml0aW9uID0ge1xuXHRkZWZhdWx0QWdncmVnYXRpb24/OiBzdHJpbmc7XG5cdGNvbnRyb2xsZXJFeHRlbnNpb25zOiBSZWNvcmQ8c3RyaW5nLCB0eXBlb2YgQ29udHJvbGxlckV4dGVuc2lvbiB8IEZ1bmN0aW9uPjtcblx0cHJvcGVydGllczogUmVjb3JkPHN0cmluZywgVUk1UHJvcGVydHlNZXRhZGF0YT47XG5cdG1hY3JvQ29udGV4dHM6IFJlY29yZDxzdHJpbmcsIFVJNVByb3BlcnR5TWV0YWRhdGE+O1xuXHRhZ2dyZWdhdGlvbnM6IFJlY29yZDxzdHJpbmcsIFVJNUFnZ3JlZ2F0aW9uTWV0YWRhdGE+O1xuXHRhc3NvY2lhdGlvbnM6IFJlY29yZDxzdHJpbmcsIFVJNUFzc29jaWF0aW9uTWV0YWRhdGE+O1xuXHRtZXRob2RzOiBSZWNvcmQ8c3RyaW5nLCBVSTVDb250cm9sbGVyTWV0aG9kRGVmaW5pdGlvbj47XG5cdGV2ZW50czogUmVjb3JkPHN0cmluZywge30+O1xuXHRpbnRlcmZhY2VzOiBzdHJpbmdbXTtcbn07XG50eXBlIFVJNUNvbnRyb2xsZXIgPSB7XG5cdG92ZXJyaWRlPzogeyBleHRlbnNpb24/OiBSZWNvcmQ8c3RyaW5nLCBPdmVycmlkZURlZmluaXRpb24+IH0gJiB7XG5cdFx0W2s6IHN0cmluZ106IEZ1bmN0aW9uO1xuXHR9O1xuXHRtZXRhZGF0YT86IFVJNUNvbnRyb2xNZXRhZGF0YURlZmluaXRpb247XG59O1xuXG50eXBlIFVJNUNvbnRyb2wgPSB7XG5cdG1ldGFkYXRhPzogVUk1Q29udHJvbE1ldGFkYXRhRGVmaW5pdGlvbjtcbn07XG5cbnR5cGUgVUk1QVBJQ29udHJvbCA9IFVJNUNvbnRyb2wgJiB7XG5cdGdldEFQSShldmVudDogVUk1RXZlbnQpOiBVSTVBUElDb250cm9sO1xuXHRbazogc3RyaW5nXTogRnVuY3Rpb247XG59O1xuXG50eXBlIENvbnRyb2xQcm9wZXJ0eU5hbWVzPFQ+ID0ge1xuXHRbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIEZ1bmN0aW9uID8gbmV2ZXIgOiBLO1xufVtrZXlvZiBUXTtcbmV4cG9ydCB0eXBlIFByb3BlcnRpZXNPZjxUPiA9IFBhcnRpYWw8UGljazxULCBDb250cm9sUHJvcGVydHlOYW1lczxUPj4+O1xuZXhwb3J0IHR5cGUgU3RyaWN0UHJvcGVydGllc09mPFQ+ID0gUGljazxULCBDb250cm9sUHJvcGVydHlOYW1lczxUPj47XG5leHBvcnQgdHlwZSBFbmhhbmNlV2l0aFVJNTxUPiA9IFQgJiB7XG5cdC8vIEFkZCBhbGwgdGhlIGdldFhYWCBtZXRob2QsIG1pZ2h0IGFkZCB0b28gbXVjaCBhcyBpJ20gbm90IGZpbHRlcmluZyBvbiBhY3R1YWwgcHJvcGVydGllcyBhY3R1YWxseS4uLlxuXHRbUCBpbiBrZXlvZiBUIGFzIGBnZXQke0NhcGl0YWxpemU8c3RyaW5nICYgUD59YF06ICgpID0+IFRbUF07XG59O1xuY29uc3QgZW5zdXJlTWV0YWRhdGEgPSBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sbGVyKSB7XG5cdHRhcmdldC5tZXRhZGF0YSA9IG1lcmdlKFxuXHRcdHtcblx0XHRcdGNvbnRyb2xsZXJFeHRlbnNpb25zOiB7fSxcblx0XHRcdHByb3BlcnRpZXM6IHt9LFxuXHRcdFx0bWFjcm9Db250ZXh0czoge30sXG5cdFx0XHRhZ2dyZWdhdGlvbnM6IHt9LFxuXHRcdFx0YXNzb2NpYXRpb25zOiB7fSxcblx0XHRcdG1ldGhvZHM6IHt9LFxuXHRcdFx0ZXZlbnRzOiB7fSxcblx0XHRcdGludGVyZmFjZXM6IFtdXG5cdFx0fSxcblx0XHR0YXJnZXQubWV0YWRhdGEgfHwge31cblx0KSBhcyBVSTVDb250cm9sTWV0YWRhdGFEZWZpbml0aW9uO1xuXHRyZXR1cm4gdGFyZ2V0Lm1ldGFkYXRhO1xufTtcblxuLyogI3JlZ2lvbiBDT05UUk9MTEVSIEVYVEVOU0lPTlMgKi9cblxuLyoqXG4gKiBEZWZpbmVzIHRoYXQgdGhlIGZvbGxvd2luZyBtZXRob2QgaXMgYW4gb3ZlcnJpZGUgZm9yIHRoZSBtZXRob2QgbmFtZSB3aXRoIHRoZSBzYW1lIG5hbWUgaW4gdGhlIHNwZWNpZmljIGNvbnRyb2xsZXIgZXh0ZW5zaW9uIG9yIGJhc2UgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHBhcmFtIGV4dGVuc2lvbk5hbWUgVGhlIG5hbWUgb2YgdGhlIGV4dGVuc2lvbiB0aGF0IHdpbGwgYmUgb3ZlcnJpZGVuXG4gKiBAcmV0dXJucyBUaGUgZGVjb3JhdGVkIG1ldGhvZFxuICovXG5leHBvcnQgZnVuY3Rpb24gbWV0aG9kT3ZlcnJpZGUoZXh0ZW5zaW9uTmFtZT86IHN0cmluZyk6IE1ldGhvZERlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sbGVyLCBwcm9wZXJ0eUtleSkge1xuXHRcdGlmICghdGFyZ2V0Lm92ZXJyaWRlKSB7XG5cdFx0XHR0YXJnZXQub3ZlcnJpZGUgPSB7fTtcblx0XHR9XG5cdFx0bGV0IGN1cnJlbnRUYXJnZXQgPSB0YXJnZXQub3ZlcnJpZGU7XG5cdFx0aWYgKGV4dGVuc2lvbk5hbWUpIHtcblx0XHRcdGlmICghY3VycmVudFRhcmdldC5leHRlbnNpb24pIHtcblx0XHRcdFx0Y3VycmVudFRhcmdldC5leHRlbnNpb24gPSB7fTtcblx0XHRcdH1cblx0XHRcdGlmICghY3VycmVudFRhcmdldC5leHRlbnNpb25bZXh0ZW5zaW9uTmFtZV0pIHtcblx0XHRcdFx0Y3VycmVudFRhcmdldC5leHRlbnNpb25bZXh0ZW5zaW9uTmFtZV0gPSB7fTtcblx0XHRcdH1cblx0XHRcdGN1cnJlbnRUYXJnZXQgPSBjdXJyZW50VGFyZ2V0LmV4dGVuc2lvbltleHRlbnNpb25OYW1lXTtcblx0XHR9XG5cdFx0Y3VycmVudFRhcmdldFtwcm9wZXJ0eUtleS50b1N0cmluZygpXSA9ICh0YXJnZXQgYXMgYW55KVtwcm9wZXJ0eUtleS50b1N0cmluZygpXTtcblx0fTtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIHRoYXQgdGhlIG1ldGhvZCBjYW4gYmUgZXh0ZW5kZWQgYnkgb3RoZXIgY29udHJvbGxlciBleHRlbnNpb24gYmFzZWQgb24gdGhlIGRlZmluZWQgb3ZlcnJpZGVFeGVjdXRpb25UeXBlLlxuICpcbiAqIEBwYXJhbSBvdmVycmlkZUV4ZWN1dGlvblR5cGUgVGhlIE92ZXJyaWRlRXhlY3V0aW9uIGRlZmluaW5nIHdoZW4gdGhlIG92ZXJyaWRlIHNob3VsZCBydW4gKEJlZm9yZSAvIEFmdGVyIC8gSW5zdGVhZClcbiAqIEByZXR1cm5zIFRoZSBkZWNvcmF0ZWQgbWV0aG9kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbnNpYmxlKG92ZXJyaWRlRXhlY3V0aW9uVHlwZT86IE92ZXJyaWRlRXhlY3V0aW9uKTogTWV0aG9kRGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IFVJNUNvbnRyb2xsZXIsIHByb3BlcnR5S2V5KSB7XG5cdFx0Y29uc3QgbWV0YWRhdGEgPSBlbnN1cmVNZXRhZGF0YSh0YXJnZXQpO1xuXHRcdGlmICghbWV0YWRhdGEubWV0aG9kc1twcm9wZXJ0eUtleS50b1N0cmluZygpXSkge1xuXHRcdFx0bWV0YWRhdGEubWV0aG9kc1twcm9wZXJ0eUtleS50b1N0cmluZygpXSA9IHt9O1xuXHRcdH1cblx0XHRtZXRhZGF0YS5tZXRob2RzW3Byb3BlcnR5S2V5LnRvU3RyaW5nKCldLm92ZXJyaWRlRXhlY3V0aW9uID0gb3ZlcnJpZGVFeGVjdXRpb25UeXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIERlZmluZXMgdGhhdCB0aGUgbWV0aG9kIHdpbGwgYmUgcHVibGljbHkgYXZhaWxhYmxlIGZvciBjb250cm9sbGVyIGV4dGVuc2lvbiB1c2FnZS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZGVjb3JhdGVkIG1ldGhvZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHVibGljRXh0ZW5zaW9uKCk6IE1ldGhvZERlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sbGVyLCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcik6IHZvaWQge1xuXHRcdGNvbnN0IG1ldGFkYXRhID0gZW5zdXJlTWV0YWRhdGEodGFyZ2V0KTtcblx0XHRkZXNjcmlwdG9yLmVudW1lcmFibGUgPSB0cnVlO1xuXHRcdGlmICghbWV0YWRhdGEubWV0aG9kc1twcm9wZXJ0eUtleS50b1N0cmluZygpXSkge1xuXHRcdFx0bWV0YWRhdGEubWV0aG9kc1twcm9wZXJ0eUtleS50b1N0cmluZygpXSA9IHt9O1xuXHRcdH1cblx0XHRtZXRhZGF0YS5tZXRob2RzW3Byb3BlcnR5S2V5LnRvU3RyaW5nKCldLnB1YmxpYyA9IHRydWU7XG5cdH07XG59XG4vKipcbiAqIERlZmluZXMgdGhhdCB0aGUgbWV0aG9kIHdpbGwgYmUgb25seSBhdmFpbGFibGUgZm9yIGludGVybmFsIHVzYWdlIG9mIHRoZSBjb250cm9sbGVyIGV4dGVuc2lvbi5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZGVjb3JhdGVkIG1ldGhvZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJpdmF0ZUV4dGVuc2lvbigpOiBNZXRob2REZWNvcmF0b3Ige1xuXHRyZXR1cm4gZnVuY3Rpb24gKHRhcmdldDogVUk1Q29udHJvbGxlciwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpIHtcblx0XHRjb25zdCBtZXRhZGF0YSA9IGVuc3VyZU1ldGFkYXRhKHRhcmdldCk7XG5cdFx0ZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gdHJ1ZTtcblx0XHRpZiAoIW1ldGFkYXRhLm1ldGhvZHNbcHJvcGVydHlLZXkudG9TdHJpbmcoKV0pIHtcblx0XHRcdG1ldGFkYXRhLm1ldGhvZHNbcHJvcGVydHlLZXkudG9TdHJpbmcoKV0gPSB7fTtcblx0XHR9XG5cdFx0bWV0YWRhdGEubWV0aG9kc1twcm9wZXJ0eUtleS50b1N0cmluZygpXS5wdWJsaWMgPSBmYWxzZTtcblx0fTtcbn1cbi8qKlxuICogRGVmaW5lcyB0aGF0IHRoZSBtZXRob2QgY2Fubm90IGJlIGZ1cnRoZXIgZXh0ZW5kZWQgYnkgb3RoZXIgY29udHJvbGxlciBleHRlbnNpb24uXG4gKlxuICogQHJldHVybnMgVGhlIGRlY29yYXRlZCBtZXRob2RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmFsRXh0ZW5zaW9uKCk6IE1ldGhvZERlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sbGVyLCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikge1xuXHRcdGNvbnN0IG1ldGFkYXRhID0gZW5zdXJlTWV0YWRhdGEodGFyZ2V0KTtcblx0XHRkZXNjcmlwdG9yLmVudW1lcmFibGUgPSB0cnVlO1xuXHRcdGlmICghbWV0YWRhdGEubWV0aG9kc1twcm9wZXJ0eUtleS50b1N0cmluZygpXSkge1xuXHRcdFx0bWV0YWRhdGEubWV0aG9kc1twcm9wZXJ0eUtleS50b1N0cmluZygpXSA9IHt9O1xuXHRcdH1cblx0XHRtZXRhZGF0YS5tZXRob2RzW3Byb3BlcnR5S2V5LnRvU3RyaW5nKCldLmZpbmFsID0gdHJ1ZTtcblx0fTtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIHRoYXQgd2UgYXJlIGdvaW5nIHRvIHVzZSBpbnN0YW50aWF0ZSBhIGNvbnRyb2xsZXIgZXh0ZW5zaW9uIHVuZGVyIHRoZSBmb2xsb3dpbmcgdmFyaWFibGUgbmFtZS5cbiAqXG4gKiBAcGFyYW0gZXh0ZW5zaW9uQ2xhc3MgVGhlIGNvbnRyb2xsZXIgZXh0ZW5zaW9uIHRoYXQgd2lsbCBiZSBpbnN0YW50aWF0ZWRcbiAqIEByZXR1cm5zIFRoZSBkZWNvcmF0ZWQgcHJvcGVydHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzaW5nRXh0ZW5zaW9uKGV4dGVuc2lvbkNsYXNzOiB0eXBlb2YgQ29udHJvbGxlckV4dGVuc2lvbiB8IEZ1bmN0aW9uKTogUHJvcGVydHlEZWNvcmF0b3Ige1xuXHRyZXR1cm4gZnVuY3Rpb24gKHRhcmdldDogVUk1Q29udHJvbGxlciwgcHJvcGVydHlLZXk6IHN0cmluZywgcHJvcGVydHlEZXNjcmlwdG9yOiBUeXBlZFByb3BlcnR5RGVzY3JpcHRvcjxhbnk+KSB7XG5cdFx0Y29uc3QgbWV0YWRhdGEgPSBlbnN1cmVNZXRhZGF0YSh0YXJnZXQpO1xuXHRcdGRlbGV0ZSAocHJvcGVydHlEZXNjcmlwdG9yIGFzIGFueSkuaW5pdGlhbGl6ZXI7XG5cdFx0bWV0YWRhdGEuY29udHJvbGxlckV4dGVuc2lvbnNbcHJvcGVydHlLZXkudG9TdHJpbmcoKV0gPSBleHRlbnNpb25DbGFzcztcblx0XHRyZXR1cm4gcHJvcGVydHlEZXNjcmlwdG9yO1xuXHR9IGFzIGFueTsgLy8gVGhpcyBpcyB0ZWNobmljYWxseSBhbiBhY2Nlc3NvciBkZWNvcmF0b3IsIGJ1dCBzb21laG93IHRoZSBjb21waWxlciBkb2Vzbid0IGxpa2UgaXQgaWYgaSBkZWNsYXJlIGl0IGFzIHN1Y2guXG59XG5cbi8qICNlbmRyZWdpb24gKi9cblxuLyogI3JlZ2lvbiBDT05UUk9MICovXG4vKipcbiAqIEluZGljYXRlcyB0aGF0IHRoZSBwcm9wZXJ0eSBzaGFsbCBiZSBkZWNsYXJlZCBhcyBhbiBldmVudCBvbiB0aGUgY29udHJvbCBtZXRhZGF0YS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZGVjb3JhdGVkIHByb3BlcnR5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBldmVudCgpOiBQcm9wZXJ0eURlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sLCBldmVudEtleSkge1xuXHRcdGNvbnN0IG1ldGFkYXRhID0gZW5zdXJlTWV0YWRhdGEodGFyZ2V0KTtcblx0XHRpZiAoIW1ldGFkYXRhLmV2ZW50c1tldmVudEtleS50b1N0cmluZygpXSkge1xuXHRcdFx0bWV0YWRhdGEuZXZlbnRzW2V2ZW50S2V5LnRvU3RyaW5nKCldID0ge307XG5cdFx0fVxuXHR9O1xufVxuXG4vKipcbiAqIERlZmluZXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0eSBpbiB0aGUgY29udHJvbCBtZXRhdGFkYS5cbiAqXG4gKiBAcGFyYW0gdWk1UHJvcGVydHlNZXRhZGF0YSBUaGUgcHJvcGVydHkgZGVmaW5pdGlvblxuICogQHJldHVybnMgVGhlIGRlY29yYXRlZCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnR5KHVpNVByb3BlcnR5TWV0YWRhdGE6IFVJNVByb3BlcnR5TWV0YWRhdGEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sLCBwcm9wZXJ0eUtleTogc3RyaW5nLCBwcm9wZXJ0eURlc2NyaXB0b3I6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPGFueT4pIHtcblx0XHRjb25zdCBtZXRhZGF0YSA9IGVuc3VyZU1ldGFkYXRhKHRhcmdldCk7XG5cdFx0aWYgKCFtZXRhZGF0YS5wcm9wZXJ0aWVzW3Byb3BlcnR5S2V5XSkge1xuXHRcdFx0bWV0YWRhdGEucHJvcGVydGllc1twcm9wZXJ0eUtleV0gPSB1aTVQcm9wZXJ0eU1ldGFkYXRhO1xuXHRcdH1cblx0XHRkZWxldGUgcHJvcGVydHlEZXNjcmlwdG9yLndyaXRhYmxlO1xuXHRcdGRlbGV0ZSAocHJvcGVydHlEZXNjcmlwdG9yIGFzIGFueSkuaW5pdGlhbGl6ZXI7XG5cblx0XHRyZXR1cm4gcHJvcGVydHlEZXNjcmlwdG9yO1xuXHR9IGFzIGFueTsgLy8gVGhpcyBpcyB0ZWNobmljYWxseSBhbiBhY2Nlc3NvciBkZWNvcmF0b3IsIGJ1dCBzb21laG93IHRoZSBjb21waWxlciBkb2Vzbid0IGxpa2UgaXQgaWYgaSBkZWNsYXJlIGl0IGFzIHN1Y2guO1xufVxuLyoqXG4gKiBEZWZpbmVzIGFuZCBjb25maWd1cmUgdGhlIGZvbGxvd2luZyBhZ2dyZWdhdGlvbiBpbiB0aGUgY29udHJvbCBtZXRhdGFkYS5cbiAqXG4gKiBAcGFyYW0gdWk1QWdncmVnYXRpb25NZXRhZGF0YSBUaGUgYWdncmVnYXRpb24gZGVmaW5pdGlvblxuICogQHJldHVybnMgVGhlIGRlY29yYXRlZCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFnZ3JlZ2F0aW9uKHVpNUFnZ3JlZ2F0aW9uTWV0YWRhdGE6IFVJNUFnZ3JlZ2F0aW9uTWV0YWRhdGEpOiBQcm9wZXJ0eURlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sLCBwcm9wZXJ0eUtleTogc3RyaW5nLCBwcm9wZXJ0eURlc2NyaXB0b3I6IFR5cGVkUHJvcGVydHlEZXNjcmlwdG9yPGFueT4pIHtcblx0XHRjb25zdCBtZXRhZGF0YSA9IGVuc3VyZU1ldGFkYXRhKHRhcmdldCk7XG5cdFx0aWYgKHVpNUFnZ3JlZ2F0aW9uTWV0YWRhdGEubXVsdGlwbGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gVUk1IGRlZmF1bHRzIHRoaXMgdG8gdHJ1ZSBidXQgdGhpcyBpcyBqdXN0IHdlaXJkLi4uXG5cdFx0XHR1aTVBZ2dyZWdhdGlvbk1ldGFkYXRhLm11bHRpcGxlID0gZmFsc2U7XG5cdFx0fVxuXHRcdGlmICghbWV0YWRhdGEuYWdncmVnYXRpb25zW3Byb3BlcnR5S2V5XSkge1xuXHRcdFx0bWV0YWRhdGEuYWdncmVnYXRpb25zW3Byb3BlcnR5S2V5XSA9IHVpNUFnZ3JlZ2F0aW9uTWV0YWRhdGE7XG5cdFx0fVxuXHRcdGlmICh1aTVBZ2dyZWdhdGlvbk1ldGFkYXRhLmlzRGVmYXVsdCkge1xuXHRcdFx0bWV0YWRhdGEuZGVmYXVsdEFnZ3JlZ2F0aW9uID0gcHJvcGVydHlLZXk7XG5cdFx0fVxuXHRcdGRlbGV0ZSBwcm9wZXJ0eURlc2NyaXB0b3Iud3JpdGFibGU7XG5cdFx0ZGVsZXRlIChwcm9wZXJ0eURlc2NyaXB0b3IgYXMgYW55KS5pbml0aWFsaXplcjtcblxuXHRcdHJldHVybiBwcm9wZXJ0eURlc2NyaXB0b3I7XG5cdH0gYXMgYW55OyAvLyBUaGlzIGlzIHRlY2huaWNhbGx5IGFuIGFjY2Vzc29yIGRlY29yYXRvciwgYnV0IHNvbWVob3cgdGhlIGNvbXBpbGVyIGRvZXNuJ3QgbGlrZSBpdCBpZiBpIGRlY2xhcmUgaXQgYXMgc3VjaC47XG59XG5cbi8qKlxuICogRGVmaW5lcyBhbmQgY29uZmlndXJlIHRoZSBmb2xsb3dpbmcgYXNzb2NpYXRpb24gaW4gdGhlIGNvbnRyb2wgbWV0YXRhZGEuXG4gKlxuICogQHBhcmFtIHVpNUFzc29jaWF0aW9uTWV0YWRhdGEgVGhlIGRlZmluaXRpb24gb2YgdGhlIGFzc29jaWF0aW9uLlxuICogQHJldHVybnMgVGhlIGRlY29yYXRlZCBwcm9wZXJ0eVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzb2NpYXRpb24odWk1QXNzb2NpYXRpb25NZXRhZGF0YTogVUk1QXNzb2NpYXRpb25NZXRhZGF0YSk6IFByb3BlcnR5RGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IFVJNUNvbnRyb2wsIHByb3BlcnR5S2V5OiBzdHJpbmcsIHByb3BlcnR5RGVzY3JpcHRvcjogVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8YW55Pikge1xuXHRcdGNvbnN0IG1ldGFkYXRhID0gZW5zdXJlTWV0YWRhdGEodGFyZ2V0KTtcblx0XHRpZiAoIW1ldGFkYXRhLmFzc29jaWF0aW9uc1twcm9wZXJ0eUtleV0pIHtcblx0XHRcdG1ldGFkYXRhLmFzc29jaWF0aW9uc1twcm9wZXJ0eUtleV0gPSB1aTVBc3NvY2lhdGlvbk1ldGFkYXRhO1xuXHRcdH1cblx0XHRkZWxldGUgcHJvcGVydHlEZXNjcmlwdG9yLndyaXRhYmxlO1xuXHRcdGRlbGV0ZSAocHJvcGVydHlEZXNjcmlwdG9yIGFzIGFueSkuaW5pdGlhbGl6ZXI7XG5cblx0XHRyZXR1cm4gcHJvcGVydHlEZXNjcmlwdG9yO1xuXHR9IGFzIGFueTsgLy8gVGhpcyBpcyB0ZWNobmljYWxseSBhbiBhY2Nlc3NvciBkZWNvcmF0b3IsIGJ1dCBzb21laG93IHRoZSBjb21waWxlciBkb2Vzbid0IGxpa2UgaXQgaWYgaSBkZWNsYXJlIGl0IGFzIHN1Y2guO1xufVxuXG4vKipcbiAqIERlZmluZXMgaW4gdGhlIG1ldGFkYXRhIHRoYXQgdGhpcyBjb250cm9sIGltcGxlbWVudHMgYSBzcGVjaWZpYyBpbnRlcmZhY2UuXG4gKlxuICogQHBhcmFtIGludGVyZmFjZU5hbWUgVGhlIG5hbWUgb2YgdGhlIGltcGxlbWVudGVkIGludGVyZmFjZVxuICogQHJldHVybnMgVGhlIGRlY29yYXRlZCBtZXRob2RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGltcGxlbWVudEludGVyZmFjZShpbnRlcmZhY2VOYW1lOiBzdHJpbmcpOiBQcm9wZXJ0eURlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sKSB7XG5cdFx0Y29uc3QgbWV0YWRhdGEgPSBlbnN1cmVNZXRhZGF0YSh0YXJnZXQpO1xuXG5cdFx0bWV0YWRhdGEuaW50ZXJmYWNlcy5wdXNoKGludGVyZmFjZU5hbWUpO1xuXHR9O1xufVxuXG4vKipcbiAqIEluZGljYXRlcyB0aGF0IHRoZSBmb2xsb3dpbmcgbWV0aG9kIHNob3VsZCBhbHNvIGJlIGV4cG9zZWQgc3RhdGljYWxseSBzbyB3ZSBjYW4gY2FsbCBpdCBmcm9tIFhNTC5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZGVjb3JhdGVkIG1ldGhvZFxuICovXG5leHBvcnQgZnVuY3Rpb24geG1sRXZlbnRIYW5kbGVyKCk6IE1ldGhvZERlY29yYXRvciB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBVSTVDb250cm9sLCBwcm9wZXJ0eWtleSkge1xuXHRcdGNvbnN0IGN1cnJlbnRDb25zdHJ1Y3RvcjogVUk1QVBJQ29udHJvbCA9IHRhcmdldC5jb25zdHJ1Y3RvciBhcyB1bmtub3duIGFzIFVJNUFQSUNvbnRyb2w7XG5cdFx0Y3VycmVudENvbnN0cnVjdG9yW3Byb3BlcnR5a2V5LnRvU3RyaW5nKCldID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRpZiAoYXJncyAmJiBhcmdzLmxlbmd0aCkge1xuXHRcdFx0XHRjb25zdCBjdXJyZW50VGFyZ2V0ID0gY3VycmVudENvbnN0cnVjdG9yLmdldEFQSShhcmdzWzBdIGFzIFVJNUV2ZW50KTtcblx0XHRcdFx0Y3VycmVudFRhcmdldD8uW3Byb3BlcnR5a2V5LnRvU3RyaW5nKCldKC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH07XG59XG5cbi8qKlxuICogSW5kaWNhdGVzIHRoYXQgdGhlIGZvbGxvd2luZyBjbGFzcyBzaG91bGQgZGVmaW5lIGEgVUk1IGNvbnRyb2wgb2YgdGhlIHNwZWNpZmllZCBuYW1lLlxuICpcbiAqIEBwYXJhbSBzVGFyZ2V0IFRoZSBmdWxseSBxdWFsaWZpZWQgbmFtZSBvZiB0aGUgbWFjcm8gQVBJXG4gKiBAcGFyYW0gbWV0YWRhdGFEZWZpbml0aW9uIElubGluZSBtZXRhZGF0YSBkZWZpbml0aW9uXG4gKiBAY2xhc3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVVJNUNsYXNzKHNUYXJnZXQ6IHN0cmluZywgbWV0YWRhdGFEZWZpbml0aW9uPzogYW55KTogQ2xhc3NEZWNvcmF0b3Ige1xuXHRyZXR1cm4gZnVuY3Rpb24gKGNvbnN0cnVjdG9yOiBGdW5jdGlvbikge1xuXHRcdGlmICghY29uc3RydWN0b3IucHJvdG90eXBlLm1ldGFkYXRhKSB7XG5cdFx0XHRjb25zdHJ1Y3Rvci5wcm90b3R5cGUubWV0YWRhdGEgPSB7fTtcblx0XHR9XG5cdFx0aWYgKG1ldGFkYXRhRGVmaW5pdGlvbikge1xuXHRcdFx0Zm9yIChjb25zdCBrZXkgaW4gbWV0YWRhdGFEZWZpbml0aW9uKSB7XG5cdFx0XHRcdGNvbnN0cnVjdG9yLnByb3RvdHlwZS5tZXRhZGF0YVtrZXldID0gbWV0YWRhdGFEZWZpbml0aW9uW2tleSBhcyBrZXlvZiBVSTVDb250cm9sTWV0YWRhdGFEZWZpbml0aW9uXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlZ2lzdGVyVUk1TWV0YWRhdGEoY29uc3RydWN0b3IsIHNUYXJnZXQsIGNvbnN0cnVjdG9yLnByb3RvdHlwZSk7XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZWZlcmVuY2U8VD4oKSB7XG5cdHJldHVybiB7XG5cdFx0Y3VycmVudDogdW5kZWZpbmVkIGFzIGFueSBhcyBULFxuXHRcdHNldEN1cnJlbnQ6IGZ1bmN0aW9uIChvQ29udHJvbEluc3RhbmNlOiBUKTogdm9pZCB7XG5cdFx0XHR0aGlzLmN1cnJlbnQgPSBvQ29udHJvbEluc3RhbmNlO1xuXHRcdH1cblx0fTtcbn1cbi8qKlxuICogRGVmaW5lcyB0aGF0IHRoZSBmb2xsb3dpbmcgb2JqZWN0IHdpbGwgaG9sZCBhIHJlZmVyZW5jZSB0byBhIGNvbnRyb2wgdGhyb3VnaCBqc3ggdGVtcGxhdGluZy5cbiAqXG4gKiBAcmV0dXJucyBUaGUgZGVjb3JhdGVkIHByb3BlcnR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lUmVmZXJlbmNlKCk6IFByb3BlcnR5RGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IFVJNUNvbnRyb2wsIHByb3BlcnR5S2V5OiBzdHJpbmcsIHByb3BlcnR5RGVzY3JpcHRvcjogVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8YW55Pikge1xuXHRcdGRlbGV0ZSBwcm9wZXJ0eURlc2NyaXB0b3Iud3JpdGFibGU7XG5cdFx0ZGVsZXRlIChwcm9wZXJ0eURlc2NyaXB0b3IgYXMgYW55KS5pbml0aWFsaXplcjtcblx0XHQocHJvcGVydHlEZXNjcmlwdG9yIGFzIGFueSkuaW5pdGlhbGl6ZXIgPSBjcmVhdGVSZWZlcmVuY2U7XG5cblx0XHRyZXR1cm4gcHJvcGVydHlEZXNjcmlwdG9yO1xuXHR9IGFzIGFueTsgLy8gVGhpcyBpcyB0ZWNobmljYWxseSBhbiBhY2Nlc3NvciBkZWNvcmF0b3IsIGJ1dCBzb21laG93IHRoZSBjb21waWxlciBkb2Vzbid0IGxpa2UgaXQgaWYgaSBkZWNsYXJlIGl0IGFzIHN1Y2guO1xufVxuXG4vKipcbiAqIEludGVybmFsIGhlYXZ5IGxpZnRpbmcgdGhhdCB3aWxsIHRha2UgY2FyZSBvZiBjcmVhdGluZyB0aGUgY2xhc3MgcHJvcGVydHkgZm9yIHVpNSB0byB1c2UuXG4gKlxuICogQHBhcmFtIGNsYXp6IFRoZSBjbGFzcyBwcm90b3R5cGVcbiAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBjcmVhdGVcbiAqIEBwYXJhbSBpbk9iaiBUaGUgbWV0YWRhdGEgb2JqZWN0XG4gKiBAcmV0dXJucyBUaGUgbWV0YWRhdGEgY2xhc3NcbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXJVSTVNZXRhZGF0YShjbGF6ejogYW55LCBuYW1lOiBzdHJpbmcsIGluT2JqOiBhbnkpOiBhbnkge1xuXHRpZiAoY2xhenouZ2V0TWV0YWRhdGEgJiYgY2xhenouZ2V0TWV0YWRhdGEoKS5pc0EoXCJzYXAudWkuY29yZS5tdmMuQ29udHJvbGxlckV4dGVuc2lvblwiKSkge1xuXHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGluT2JqKS5mb3JFYWNoKChvYmpOYW1lKSA9PiB7XG5cdFx0XHRjb25zdCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpbk9iaiwgb2JqTmFtZSk7XG5cdFx0XHRpZiAoZGVzY3JpcHRvciAmJiAhZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG5cdFx0XHRcdGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IHRydWU7XG5cdFx0XHRcdC8vXHRcdExvZy5lcnJvcihgUHJvcGVydHkgJHtvYmpOYW1lfSBmcm9tICR7bmFtZX0gc2hvdWxkIGJlIGRlY29yYXRlZCBhcyBwdWJsaWNgKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRjb25zdCBvYmo6IGFueSA9IHt9O1xuXHRvYmoubWV0YWRhdGEgPSBpbk9iai5tZXRhZGF0YSB8fCB7fTtcblx0b2JqLm92ZXJyaWRlID0gaW5PYmoub3ZlcnJpZGU7XG5cdG9iai5jb25zdHJ1Y3RvciA9IGNsYXp6O1xuXHRvYmoubWV0YWRhdGEuYmFzZVR5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY2xhenoucHJvdG90eXBlKS5nZXRNZXRhZGF0YSgpLmdldE5hbWUoKTtcblxuXHRpZiAoY2xheno/LmdldE1ldGFkYXRhKCk/LmdldFN0ZXJlb3R5cGUoKSA9PT0gXCJjb250cm9sXCIpIHtcblx0XHRjb25zdCByZW5kZXJlckRlZmluaXRpb24gPSBpbk9iai5yZW5kZXJlciB8fCBjbGF6ei5yZW5kZXJlciB8fCBjbGF6ei5yZW5kZXI7XG5cdFx0b2JqLnJlbmRlcmVyID0geyBhcGlWZXJzaW9uOiAyIH07XG5cdFx0aWYgKHR5cGVvZiByZW5kZXJlckRlZmluaXRpb24gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0b2JqLnJlbmRlcmVyLnJlbmRlciA9IHJlbmRlcmVyRGVmaW5pdGlvbjtcblx0XHR9IGVsc2UgaWYgKHJlbmRlcmVyRGVmaW5pdGlvbiAhPSB1bmRlZmluZWQpIHtcblx0XHRcdG9iai5yZW5kZXJlciA9IHJlbmRlcmVyRGVmaW5pdGlvbjtcblx0XHR9XG5cdH1cblx0b2JqLm1ldGFkYXRhLmludGVyZmFjZXMgPSBpbk9iai5tZXRhZGF0YT8uaW50ZXJmYWNlcyB8fCBjbGF6ei5tZXRhZGF0YT8uaW50ZXJmYWNlcztcblx0T2JqZWN0LmtleXMoY2xhenoucHJvdG90eXBlKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRpZiAoa2V5ICE9PSBcIm1ldGFkYXRhXCIpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdG9ialtrZXldID0gY2xhenoucHJvdG90eXBlW2tleV07XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblx0aWYgKG9iai5tZXRhZGF0YT8uY29udHJvbGxlckV4dGVuc2lvbnMgJiYgT2JqZWN0LmtleXMob2JqLm1ldGFkYXRhLmNvbnRyb2xsZXJFeHRlbnNpb25zKS5sZW5ndGggPiAwKSB7XG5cdFx0Zm9yIChjb25zdCBjRXh0TmFtZSBpbiBvYmoubWV0YWRhdGEuY29udHJvbGxlckV4dGVuc2lvbnMpIHtcblx0XHRcdG9ialtjRXh0TmFtZV0gPSBvYmoubWV0YWRhdGEuY29udHJvbGxlckV4dGVuc2lvbnNbY0V4dE5hbWVdO1xuXHRcdH1cblx0fVxuXHRjb25zdCBvdXRwdXQgPSBjbGF6ei5leHRlbmQobmFtZSwgb2JqKTtcblx0Y29uc3QgZm5Jbml0ID0gb3V0cHV0LnByb3RvdHlwZS5pbml0O1xuXHRvdXRwdXQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcblx0XHRpZiAoZm5Jbml0KSB7XG5cdFx0XHRmbkluaXQuYXBwbHkodGhpcywgYXJncyk7XG5cdFx0fVxuXHRcdHRoaXMubWV0YWRhdGEgPSBvYmoubWV0YWRhdGE7XG5cblx0XHRpZiAob2JqLm1ldGFkYXRhLnByb3BlcnRpZXMpIHtcblx0XHRcdGNvbnN0IGFQcm9wZXJ0eUtleXMgPSBPYmplY3Qua2V5cyhvYmoubWV0YWRhdGEucHJvcGVydGllcyk7XG5cdFx0XHRhUHJvcGVydHlLZXlzLmZvckVhY2goKHByb3BlcnR5S2V5KSA9PiB7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBwcm9wZXJ0eUtleSwge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRzZXQ6ICh2OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnNldFByb3BlcnR5KHByb3BlcnR5S2V5LCB2KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGdldDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0UHJvcGVydHkocHJvcGVydHlLZXkpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGFBZ2dyZWdhdGlvbktleXMgPSBPYmplY3Qua2V5cyhvYmoubWV0YWRhdGEuYWdncmVnYXRpb25zKTtcblx0XHRcdGFBZ2dyZWdhdGlvbktleXMuZm9yRWFjaCgoYWdncmVnYXRpb25LZXkpID0+IHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGFnZ3JlZ2F0aW9uS2V5LCB7XG5cdFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuXHRcdFx0XHRcdHNldDogKHY6IGFueSkgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuc2V0QWdncmVnYXRpb24oYWdncmVnYXRpb25LZXksIHYpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Z2V0OiAoKSA9PiB7XG5cdFx0XHRcdFx0XHRjb25zdCBhZ2dyZWdhdGlvbkNvbnRlbnQgPSB0aGlzLmdldEFnZ3JlZ2F0aW9uKGFnZ3JlZ2F0aW9uS2V5KTtcblx0XHRcdFx0XHRcdGlmIChvYmoubWV0YWRhdGEuYWdncmVnYXRpb25zW2FnZ3JlZ2F0aW9uS2V5XS5tdWx0aXBsZSkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYWdncmVnYXRpb25Db250ZW50IHx8IFtdO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFnZ3JlZ2F0aW9uQ29udGVudDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBhQXNzb2NpYXRpb25LZXlzID0gT2JqZWN0LmtleXMob2JqLm1ldGFkYXRhLmFzc29jaWF0aW9ucyk7XG5cdFx0XHRhQXNzb2NpYXRpb25LZXlzLmZvckVhY2goKGFzc29jaWF0aW9uS2V5KSA9PiB7XG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBhc3NvY2lhdGlvbktleSwge1xuXHRcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRzZXQ6ICh2OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnNldEFzc29jaWF0aW9uKGFzc29jaWF0aW9uS2V5LCB2KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGdldDogKCkgPT4ge1xuXHRcdFx0XHRcdFx0Y29uc3QgYWdncmVnYXRpb25Db250ZW50ID0gdGhpcy5nZXRBc3NvY2lhdGlvbihhc3NvY2lhdGlvbktleSk7XG5cdFx0XHRcdFx0XHRpZiAob2JqLm1ldGFkYXRhLmFzc29jaWF0aW9uc1thc3NvY2lhdGlvbktleV0ubXVsdGlwbGUpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGFnZ3JlZ2F0aW9uQ29udGVudCB8fCBbXTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBhZ2dyZWdhdGlvbkNvbnRlbnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblx0Y2xhenoub3ZlcnJpZGUgPSBmdW5jdGlvbiAob0V4dGVuc2lvbjogYW55KSB7XG5cdFx0Y29uc3QgcG9sID0ge307XG5cdFx0KHBvbCBhcyBhbnkpLmNvbnN0cnVjdG9yID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XG5cdFx0XHRyZXR1cm4gY2xhenouYXBwbHkodGhpcywgYXJncyBhcyBhbnkpO1xuXHRcdH07XG5cdFx0Y29uc3Qgb0NsYXNzID0gKE1ldGFkYXRhIGFzIGFueSkuY3JlYXRlQ2xhc3MoY2xhenosIGBhbm9ueW1vdXNFeHRlbnNpb25+JHt1aWQoKX1gLCBwb2wsIENvbnRyb2xsZXJNZXRhZGF0YSk7XG5cdFx0b0NsYXNzLmdldE1ldGFkYXRhKCkuX3N0YXRpY092ZXJyaWRlID0gb0V4dGVuc2lvbjtcblx0XHRvQ2xhc3MuZ2V0TWV0YWRhdGEoKS5fb3ZlcnJpZGUgPSBjbGF6ei5nZXRNZXRhZGF0YSgpLl9vdmVycmlkZTtcblx0XHRyZXR1cm4gb0NsYXNzO1xuXHR9O1xuXG5cdE9iamVjdFBhdGguc2V0KG5hbWUsIG91dHB1dCk7XG5cdHJldHVybiBvdXRwdXQ7XG59XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7OztFQXVFQSxJQUFNQSxjQUFjLEdBQUcsVUFBVUMsTUFBVixFQUFpQztJQUN2REEsTUFBTSxDQUFDQyxRQUFQLEdBQWtCQyxLQUFLLENBQ3RCO01BQ0NDLG9CQUFvQixFQUFFLEVBRHZCO01BRUNDLFVBQVUsRUFBRSxFQUZiO01BR0NDLGFBQWEsRUFBRSxFQUhoQjtNQUlDQyxZQUFZLEVBQUUsRUFKZjtNQUtDQyxZQUFZLEVBQUUsRUFMZjtNQU1DQyxPQUFPLEVBQUUsRUFOVjtNQU9DQyxNQUFNLEVBQUUsRUFQVDtNQVFDQyxVQUFVLEVBQUU7SUFSYixDQURzQixFQVd0QlYsTUFBTSxDQUFDQyxRQUFQLElBQW1CLEVBWEcsQ0FBdkI7SUFhQSxPQUFPRCxNQUFNLENBQUNDLFFBQWQ7RUFDQSxDQWZEO0VBaUJBOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0VBQ08sU0FBU1UsY0FBVCxDQUF3QkMsYUFBeEIsRUFBaUU7SUFDdkUsT0FBTyxVQUFVWixNQUFWLEVBQWlDYSxXQUFqQyxFQUE4QztNQUNwRCxJQUFJLENBQUNiLE1BQU0sQ0FBQ2MsUUFBWixFQUFzQjtRQUNyQmQsTUFBTSxDQUFDYyxRQUFQLEdBQWtCLEVBQWxCO01BQ0E7O01BQ0QsSUFBSUMsYUFBYSxHQUFHZixNQUFNLENBQUNjLFFBQTNCOztNQUNBLElBQUlGLGFBQUosRUFBbUI7UUFDbEIsSUFBSSxDQUFDRyxhQUFhLENBQUNDLFNBQW5CLEVBQThCO1VBQzdCRCxhQUFhLENBQUNDLFNBQWQsR0FBMEIsRUFBMUI7UUFDQTs7UUFDRCxJQUFJLENBQUNELGFBQWEsQ0FBQ0MsU0FBZCxDQUF3QkosYUFBeEIsQ0FBTCxFQUE2QztVQUM1Q0csYUFBYSxDQUFDQyxTQUFkLENBQXdCSixhQUF4QixJQUF5QyxFQUF6QztRQUNBOztRQUNERyxhQUFhLEdBQUdBLGFBQWEsQ0FBQ0MsU0FBZCxDQUF3QkosYUFBeEIsQ0FBaEI7TUFDQTs7TUFDREcsYUFBYSxDQUFDRixXQUFXLENBQUNJLFFBQVosRUFBRCxDQUFiLEdBQXlDakIsTUFBRCxDQUFnQmEsV0FBVyxDQUFDSSxRQUFaLEVBQWhCLENBQXhDO0lBQ0EsQ0FmRDtFQWdCQTtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxTQUFTQyxVQUFULENBQW9CQyxxQkFBcEIsRUFBZ0Y7SUFDdEYsT0FBTyxVQUFVbkIsTUFBVixFQUFpQ2EsV0FBakMsRUFBOEM7TUFDcEQsSUFBTVosUUFBUSxHQUFHRixjQUFjLENBQUNDLE1BQUQsQ0FBL0I7O01BQ0EsSUFBSSxDQUFDQyxRQUFRLENBQUNPLE9BQVQsQ0FBaUJLLFdBQVcsQ0FBQ0ksUUFBWixFQUFqQixDQUFMLEVBQStDO1FBQzlDaEIsUUFBUSxDQUFDTyxPQUFULENBQWlCSyxXQUFXLENBQUNJLFFBQVosRUFBakIsSUFBMkMsRUFBM0M7TUFDQTs7TUFDRGhCLFFBQVEsQ0FBQ08sT0FBVCxDQUFpQkssV0FBVyxDQUFDSSxRQUFaLEVBQWpCLEVBQXlDRyxpQkFBekMsR0FBNkRELHFCQUE3RDtJQUNBLENBTkQ7RUFPQTtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ08sU0FBU0UsZUFBVCxHQUE0QztJQUNsRCxPQUFPLFVBQVVyQixNQUFWLEVBQWlDYSxXQUFqQyxFQUE4Q1MsVUFBOUMsRUFBZ0U7TUFDdEUsSUFBTXJCLFFBQVEsR0FBR0YsY0FBYyxDQUFDQyxNQUFELENBQS9CO01BQ0FzQixVQUFVLENBQUNDLFVBQVgsR0FBd0IsSUFBeEI7O01BQ0EsSUFBSSxDQUFDdEIsUUFBUSxDQUFDTyxPQUFULENBQWlCSyxXQUFXLENBQUNJLFFBQVosRUFBakIsQ0FBTCxFQUErQztRQUM5Q2hCLFFBQVEsQ0FBQ08sT0FBVCxDQUFpQkssV0FBVyxDQUFDSSxRQUFaLEVBQWpCLElBQTJDLEVBQTNDO01BQ0E7O01BQ0RoQixRQUFRLENBQUNPLE9BQVQsQ0FBaUJLLFdBQVcsQ0FBQ0ksUUFBWixFQUFqQixFQUF5Q08sTUFBekMsR0FBa0QsSUFBbEQ7SUFDQSxDQVBEO0VBUUE7RUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztFQUNPLFNBQVNDLGdCQUFULEdBQTZDO0lBQ25ELE9BQU8sVUFBVXpCLE1BQVYsRUFBaUNhLFdBQWpDLEVBQThDUyxVQUE5QyxFQUEwRDtNQUNoRSxJQUFNckIsUUFBUSxHQUFHRixjQUFjLENBQUNDLE1BQUQsQ0FBL0I7TUFDQXNCLFVBQVUsQ0FBQ0MsVUFBWCxHQUF3QixJQUF4Qjs7TUFDQSxJQUFJLENBQUN0QixRQUFRLENBQUNPLE9BQVQsQ0FBaUJLLFdBQVcsQ0FBQ0ksUUFBWixFQUFqQixDQUFMLEVBQStDO1FBQzlDaEIsUUFBUSxDQUFDTyxPQUFULENBQWlCSyxXQUFXLENBQUNJLFFBQVosRUFBakIsSUFBMkMsRUFBM0M7TUFDQTs7TUFDRGhCLFFBQVEsQ0FBQ08sT0FBVCxDQUFpQkssV0FBVyxDQUFDSSxRQUFaLEVBQWpCLEVBQXlDTyxNQUF6QyxHQUFrRCxLQUFsRDtJQUNBLENBUEQ7RUFRQTtFQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ08sU0FBU0UsY0FBVCxHQUEyQztJQUNqRCxPQUFPLFVBQVUxQixNQUFWLEVBQWlDYSxXQUFqQyxFQUE4Q1MsVUFBOUMsRUFBMEQ7TUFDaEUsSUFBTXJCLFFBQVEsR0FBR0YsY0FBYyxDQUFDQyxNQUFELENBQS9CO01BQ0FzQixVQUFVLENBQUNDLFVBQVgsR0FBd0IsSUFBeEI7O01BQ0EsSUFBSSxDQUFDdEIsUUFBUSxDQUFDTyxPQUFULENBQWlCSyxXQUFXLENBQUNJLFFBQVosRUFBakIsQ0FBTCxFQUErQztRQUM5Q2hCLFFBQVEsQ0FBQ08sT0FBVCxDQUFpQkssV0FBVyxDQUFDSSxRQUFaLEVBQWpCLElBQTJDLEVBQTNDO01BQ0E7O01BQ0RoQixRQUFRLENBQUNPLE9BQVQsQ0FBaUJLLFdBQVcsQ0FBQ0ksUUFBWixFQUFqQixFQUF5Q1UsS0FBekMsR0FBaUQsSUFBakQ7SUFDQSxDQVBEO0VBUUE7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ08sU0FBU0MsY0FBVCxDQUF3QkMsY0FBeEIsRUFBa0c7SUFDeEcsT0FBTyxVQUFVN0IsTUFBVixFQUFpQ2EsV0FBakMsRUFBc0RpQixrQkFBdEQsRUFBd0c7TUFDOUcsSUFBTTdCLFFBQVEsR0FBR0YsY0FBYyxDQUFDQyxNQUFELENBQS9CO01BQ0EsT0FBUThCLGtCQUFELENBQTRCQyxXQUFuQztNQUNBOUIsUUFBUSxDQUFDRSxvQkFBVCxDQUE4QlUsV0FBVyxDQUFDSSxRQUFaLEVBQTlCLElBQXdEWSxjQUF4RDtNQUNBLE9BQU9DLGtCQUFQO0lBQ0EsQ0FMRCxDQUR3RyxDQU05RjtFQUNWO0VBRUQ7O0VBRUE7O0VBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxTQUFTRSxLQUFULEdBQW9DO0lBQzFDLE9BQU8sVUFBVWhDLE1BQVYsRUFBOEJpQyxRQUE5QixFQUF3QztNQUM5QyxJQUFNaEMsUUFBUSxHQUFHRixjQUFjLENBQUNDLE1BQUQsQ0FBL0I7O01BQ0EsSUFBSSxDQUFDQyxRQUFRLENBQUNRLE1BQVQsQ0FBZ0J3QixRQUFRLENBQUNoQixRQUFULEVBQWhCLENBQUwsRUFBMkM7UUFDMUNoQixRQUFRLENBQUNRLE1BQVQsQ0FBZ0J3QixRQUFRLENBQUNoQixRQUFULEVBQWhCLElBQXVDLEVBQXZDO01BQ0E7SUFDRCxDQUxEO0VBTUE7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ08sU0FBU2lCLFFBQVQsQ0FBa0JDLG1CQUFsQixFQUErRTtJQUNyRixPQUFPLFVBQVVuQyxNQUFWLEVBQThCYSxXQUE5QixFQUFtRGlCLGtCQUFuRCxFQUFxRztNQUMzRyxJQUFNN0IsUUFBUSxHQUFHRixjQUFjLENBQUNDLE1BQUQsQ0FBL0I7O01BQ0EsSUFBSSxDQUFDQyxRQUFRLENBQUNHLFVBQVQsQ0FBb0JTLFdBQXBCLENBQUwsRUFBdUM7UUFDdENaLFFBQVEsQ0FBQ0csVUFBVCxDQUFvQlMsV0FBcEIsSUFBbUNzQixtQkFBbkM7TUFDQTs7TUFDRCxPQUFPTCxrQkFBa0IsQ0FBQ00sUUFBMUI7TUFDQSxPQUFRTixrQkFBRCxDQUE0QkMsV0FBbkM7TUFFQSxPQUFPRCxrQkFBUDtJQUNBLENBVEQsQ0FEcUYsQ0FVM0U7RUFDVjtFQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxTQUFTTyxXQUFULENBQXFCQyxzQkFBckIsRUFBd0Y7SUFDOUYsT0FBTyxVQUFVdEMsTUFBVixFQUE4QmEsV0FBOUIsRUFBbURpQixrQkFBbkQsRUFBcUc7TUFDM0csSUFBTTdCLFFBQVEsR0FBR0YsY0FBYyxDQUFDQyxNQUFELENBQS9COztNQUNBLElBQUlzQyxzQkFBc0IsQ0FBQ0MsUUFBdkIsS0FBb0NDLFNBQXhDLEVBQW1EO1FBQ2xEO1FBQ0FGLHNCQUFzQixDQUFDQyxRQUF2QixHQUFrQyxLQUFsQztNQUNBOztNQUNELElBQUksQ0FBQ3RDLFFBQVEsQ0FBQ0ssWUFBVCxDQUFzQk8sV0FBdEIsQ0FBTCxFQUF5QztRQUN4Q1osUUFBUSxDQUFDSyxZQUFULENBQXNCTyxXQUF0QixJQUFxQ3lCLHNCQUFyQztNQUNBOztNQUNELElBQUlBLHNCQUFzQixDQUFDRyxTQUEzQixFQUFzQztRQUNyQ3hDLFFBQVEsQ0FBQ3lDLGtCQUFULEdBQThCN0IsV0FBOUI7TUFDQTs7TUFDRCxPQUFPaUIsa0JBQWtCLENBQUNNLFFBQTFCO01BQ0EsT0FBUU4sa0JBQUQsQ0FBNEJDLFdBQW5DO01BRUEsT0FBT0Qsa0JBQVA7SUFDQSxDQWhCRCxDQUQ4RixDQWlCcEY7RUFDVjtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxTQUFTYSxXQUFULENBQXFCQyxzQkFBckIsRUFBd0Y7SUFDOUYsT0FBTyxVQUFVNUMsTUFBVixFQUE4QmEsV0FBOUIsRUFBbURpQixrQkFBbkQsRUFBcUc7TUFDM0csSUFBTTdCLFFBQVEsR0FBR0YsY0FBYyxDQUFDQyxNQUFELENBQS9COztNQUNBLElBQUksQ0FBQ0MsUUFBUSxDQUFDTSxZQUFULENBQXNCTSxXQUF0QixDQUFMLEVBQXlDO1FBQ3hDWixRQUFRLENBQUNNLFlBQVQsQ0FBc0JNLFdBQXRCLElBQXFDK0Isc0JBQXJDO01BQ0E7O01BQ0QsT0FBT2Qsa0JBQWtCLENBQUNNLFFBQTFCO01BQ0EsT0FBUU4sa0JBQUQsQ0FBNEJDLFdBQW5DO01BRUEsT0FBT0Qsa0JBQVA7SUFDQSxDQVRELENBRDhGLENBVXBGO0VBQ1Y7RUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ08sU0FBU2Usa0JBQVQsQ0FBNEJDLGFBQTVCLEVBQXNFO0lBQzVFLE9BQU8sVUFBVTlDLE1BQVYsRUFBOEI7TUFDcEMsSUFBTUMsUUFBUSxHQUFHRixjQUFjLENBQUNDLE1BQUQsQ0FBL0I7TUFFQUMsUUFBUSxDQUFDUyxVQUFULENBQW9CcUMsSUFBcEIsQ0FBeUJELGFBQXpCO0lBQ0EsQ0FKRDtFQUtBO0VBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxTQUFTRSxlQUFULEdBQTRDO0lBQ2xELE9BQU8sVUFBVWhELE1BQVYsRUFBOEJpRCxXQUE5QixFQUEyQztNQUNqRCxJQUFNQyxrQkFBaUMsR0FBR2xELE1BQU0sQ0FBQ21ELFdBQWpEOztNQUNBRCxrQkFBa0IsQ0FBQ0QsV0FBVyxDQUFDaEMsUUFBWixFQUFELENBQWxCLEdBQTZDLFlBQTBCO1FBQUEsa0NBQWJtQyxJQUFhO1VBQWJBLElBQWE7UUFBQTs7UUFDdEUsSUFBSUEsSUFBSSxJQUFJQSxJQUFJLENBQUNDLE1BQWpCLEVBQXlCO1VBQ3hCLElBQU10QyxhQUFhLEdBQUdtQyxrQkFBa0IsQ0FBQ0ksTUFBbkIsQ0FBMEJGLElBQUksQ0FBQyxDQUFELENBQTlCLENBQXRCO1VBQ0FyQyxhQUFhLFNBQWIsSUFBQUEsYUFBYSxXQUFiLFlBQUFBLGFBQWEsQ0FBR2tDLFdBQVcsQ0FBQ2hDLFFBQVosRUFBSCxDQUFiLE9BQUFGLGFBQWEsRUFBOEJxQyxJQUE5QixDQUFiO1FBQ0E7TUFDRCxDQUxEO0lBTUEsQ0FSRDtFQVNBO0VBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ08sU0FBU0csY0FBVCxDQUF3QkMsT0FBeEIsRUFBeUNDLGtCQUF6QyxFQUFtRjtJQUN6RixPQUFPLFVBQVVOLFdBQVYsRUFBaUM7TUFDdkMsSUFBSSxDQUFDQSxXQUFXLENBQUNPLFNBQVosQ0FBc0J6RCxRQUEzQixFQUFxQztRQUNwQ2tELFdBQVcsQ0FBQ08sU0FBWixDQUFzQnpELFFBQXRCLEdBQWlDLEVBQWpDO01BQ0E7O01BQ0QsSUFBSXdELGtCQUFKLEVBQXdCO1FBQ3ZCLEtBQUssSUFBTUUsR0FBWCxJQUFrQkYsa0JBQWxCLEVBQXNDO1VBQ3JDTixXQUFXLENBQUNPLFNBQVosQ0FBc0J6RCxRQUF0QixDQUErQjBELEdBQS9CLElBQXNDRixrQkFBa0IsQ0FBQ0UsR0FBRCxDQUF4RDtRQUNBO01BQ0Q7O01BQ0QsT0FBT0MsbUJBQW1CLENBQUNULFdBQUQsRUFBY0ssT0FBZCxFQUF1QkwsV0FBVyxDQUFDTyxTQUFuQyxDQUExQjtJQUNBLENBVkQ7RUFXQTs7OztFQUVNLFNBQVNHLGVBQVQsR0FBOEI7SUFDcEMsT0FBTztNQUNOQyxPQUFPLEVBQUV0QixTQURIO01BRU51QixVQUFVLEVBQUUsVUFBVUMsZ0JBQVYsRUFBcUM7UUFDaEQsS0FBS0YsT0FBTCxHQUFlRSxnQkFBZjtNQUNBO0lBSkssQ0FBUDtFQU1BO0VBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7RUFDTyxTQUFTQyxlQUFULEdBQThDO0lBQ3BELE9BQU8sVUFBVWpFLE1BQVYsRUFBOEJhLFdBQTlCLEVBQW1EaUIsa0JBQW5ELEVBQXFHO01BQzNHLE9BQU9BLGtCQUFrQixDQUFDTSxRQUExQjtNQUNBLE9BQVFOLGtCQUFELENBQTRCQyxXQUFuQztNQUNDRCxrQkFBRCxDQUE0QkMsV0FBNUIsR0FBMEM4QixlQUExQztNQUVBLE9BQU8vQixrQkFBUDtJQUNBLENBTkQsQ0FEb0QsQ0FPMUM7RUFDVjtFQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0VBQ0EsU0FBUzhCLG1CQUFULENBQTZCTSxLQUE3QixFQUF5Q0MsSUFBekMsRUFBdURDLEtBQXZELEVBQXdFO0lBQUE7O0lBQ3ZFLElBQUlGLEtBQUssQ0FBQ0csV0FBTixJQUFxQkgsS0FBSyxDQUFDRyxXQUFOLEdBQW9CQyxHQUFwQixDQUF3QixxQ0FBeEIsQ0FBekIsRUFBeUY7TUFDeEZDLE1BQU0sQ0FBQ0MsbUJBQVAsQ0FBMkJKLEtBQTNCLEVBQWtDSyxPQUFsQyxDQUEwQyxVQUFDQyxPQUFELEVBQWE7UUFDdEQsSUFBTXBELFVBQVUsR0FBR2lELE1BQU0sQ0FBQ0ksd0JBQVAsQ0FBZ0NQLEtBQWhDLEVBQXVDTSxPQUF2QyxDQUFuQjs7UUFDQSxJQUFJcEQsVUFBVSxJQUFJLENBQUNBLFVBQVUsQ0FBQ0MsVUFBOUIsRUFBMEM7VUFDekNELFVBQVUsQ0FBQ0MsVUFBWCxHQUF3QixJQUF4QixDQUR5QyxDQUV6QztRQUNBO01BQ0QsQ0FORDtJQU9BOztJQUNELElBQU1xRCxHQUFRLEdBQUcsRUFBakI7SUFDQUEsR0FBRyxDQUFDM0UsUUFBSixHQUFlbUUsS0FBSyxDQUFDbkUsUUFBTixJQUFrQixFQUFqQztJQUNBMkUsR0FBRyxDQUFDOUQsUUFBSixHQUFlc0QsS0FBSyxDQUFDdEQsUUFBckI7SUFDQThELEdBQUcsQ0FBQ3pCLFdBQUosR0FBa0JlLEtBQWxCO0lBQ0FVLEdBQUcsQ0FBQzNFLFFBQUosQ0FBYTRFLFFBQWIsR0FBd0JOLE1BQU0sQ0FBQ08sY0FBUCxDQUFzQlosS0FBSyxDQUFDUixTQUE1QixFQUF1Q1csV0FBdkMsR0FBcURVLE9BQXJELEVBQXhCOztJQUVBLElBQUksQ0FBQWIsS0FBSyxTQUFMLElBQUFBLEtBQUssV0FBTCxrQ0FBQUEsS0FBSyxDQUFFRyxXQUFQLDRFQUFzQlcsYUFBdEIsUUFBMEMsU0FBOUMsRUFBeUQ7TUFDeEQsSUFBTUMsa0JBQWtCLEdBQUdiLEtBQUssQ0FBQ2MsUUFBTixJQUFrQmhCLEtBQUssQ0FBQ2dCLFFBQXhCLElBQW9DaEIsS0FBSyxDQUFDaUIsTUFBckU7TUFDQVAsR0FBRyxDQUFDTSxRQUFKLEdBQWU7UUFBRUUsVUFBVSxFQUFFO01BQWQsQ0FBZjs7TUFDQSxJQUFJLE9BQU9ILGtCQUFQLEtBQThCLFVBQWxDLEVBQThDO1FBQzdDTCxHQUFHLENBQUNNLFFBQUosQ0FBYUMsTUFBYixHQUFzQkYsa0JBQXRCO01BQ0EsQ0FGRCxNQUVPLElBQUlBLGtCQUFrQixJQUFJekMsU0FBMUIsRUFBcUM7UUFDM0NvQyxHQUFHLENBQUNNLFFBQUosR0FBZUQsa0JBQWY7TUFDQTtJQUNEOztJQUNETCxHQUFHLENBQUMzRSxRQUFKLENBQWFTLFVBQWIsR0FBMEIsb0JBQUEwRCxLQUFLLENBQUNuRSxRQUFOLG9FQUFnQlMsVUFBaEIseUJBQThCd0QsS0FBSyxDQUFDakUsUUFBcEMsb0RBQThCLGdCQUFnQlMsVUFBOUMsQ0FBMUI7SUFDQTZELE1BQU0sQ0FBQ2MsSUFBUCxDQUFZbkIsS0FBSyxDQUFDUixTQUFsQixFQUE2QmUsT0FBN0IsQ0FBcUMsVUFBQ2QsR0FBRCxFQUFTO01BQzdDLElBQUlBLEdBQUcsS0FBSyxVQUFaLEVBQXdCO1FBQ3ZCLElBQUk7VUFDSGlCLEdBQUcsQ0FBQ2pCLEdBQUQsQ0FBSCxHQUFXTyxLQUFLLENBQUNSLFNBQU4sQ0FBZ0JDLEdBQWhCLENBQVg7UUFDQSxDQUZELENBRUUsT0FBTzJCLENBQVAsRUFBVSxDQUNYO1FBQ0E7TUFDRDtJQUNELENBUkQ7O0lBU0EsSUFBSSxpQkFBQVYsR0FBRyxDQUFDM0UsUUFBSix3REFBY0Usb0JBQWQsSUFBc0NvRSxNQUFNLENBQUNjLElBQVAsQ0FBWVQsR0FBRyxDQUFDM0UsUUFBSixDQUFhRSxvQkFBekIsRUFBK0NrRCxNQUEvQyxHQUF3RCxDQUFsRyxFQUFxRztNQUNwRyxLQUFLLElBQU1rQyxRQUFYLElBQXVCWCxHQUFHLENBQUMzRSxRQUFKLENBQWFFLG9CQUFwQyxFQUEwRDtRQUN6RHlFLEdBQUcsQ0FBQ1csUUFBRCxDQUFILEdBQWdCWCxHQUFHLENBQUMzRSxRQUFKLENBQWFFLG9CQUFiLENBQWtDb0YsUUFBbEMsQ0FBaEI7TUFDQTtJQUNEOztJQUNELElBQU1DLE1BQU0sR0FBR3RCLEtBQUssQ0FBQ3VCLE1BQU4sQ0FBYXRCLElBQWIsRUFBbUJTLEdBQW5CLENBQWY7SUFDQSxJQUFNYyxNQUFNLEdBQUdGLE1BQU0sQ0FBQzlCLFNBQVAsQ0FBaUJpQyxJQUFoQzs7SUFDQUgsTUFBTSxDQUFDOUIsU0FBUCxDQUFpQmlDLElBQWpCLEdBQXdCLFlBQTBCO01BQUE7O01BQ2pELElBQUlELE1BQUosRUFBWTtRQUFBLG1DQUR3QnRDLElBQ3hCO1VBRHdCQSxJQUN4QjtRQUFBOztRQUNYc0MsTUFBTSxDQUFDRSxLQUFQLENBQWEsSUFBYixFQUFtQnhDLElBQW5CO01BQ0E7O01BQ0QsS0FBS25ELFFBQUwsR0FBZ0IyRSxHQUFHLENBQUMzRSxRQUFwQjs7TUFFQSxJQUFJMkUsR0FBRyxDQUFDM0UsUUFBSixDQUFhRyxVQUFqQixFQUE2QjtRQUM1QixJQUFNeUYsYUFBYSxHQUFHdEIsTUFBTSxDQUFDYyxJQUFQLENBQVlULEdBQUcsQ0FBQzNFLFFBQUosQ0FBYUcsVUFBekIsQ0FBdEI7UUFDQXlGLGFBQWEsQ0FBQ3BCLE9BQWQsQ0FBc0IsVUFBQzVELFdBQUQsRUFBaUI7VUFDdEMwRCxNQUFNLENBQUN1QixjQUFQLENBQXNCLEtBQXRCLEVBQTRCakYsV0FBNUIsRUFBeUM7WUFDeENrRixZQUFZLEVBQUUsSUFEMEI7WUFFeENDLEdBQUcsRUFBRSxVQUFDQyxDQUFELEVBQVk7Y0FDaEIsT0FBTyxLQUFJLENBQUNDLFdBQUwsQ0FBaUJyRixXQUFqQixFQUE4Qm9GLENBQTlCLENBQVA7WUFDQSxDQUp1QztZQUt4Q0UsR0FBRyxFQUFFLFlBQU07Y0FDVixPQUFPLEtBQUksQ0FBQ0MsV0FBTCxDQUFpQnZGLFdBQWpCLENBQVA7WUFDQTtVQVB1QyxDQUF6QztRQVNBLENBVkQ7UUFXQSxJQUFNd0YsZ0JBQWdCLEdBQUc5QixNQUFNLENBQUNjLElBQVAsQ0FBWVQsR0FBRyxDQUFDM0UsUUFBSixDQUFhSyxZQUF6QixDQUF6QjtRQUNBK0YsZ0JBQWdCLENBQUM1QixPQUFqQixDQUF5QixVQUFDNkIsY0FBRCxFQUFvQjtVQUM1Qy9CLE1BQU0sQ0FBQ3VCLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNEJRLGNBQTVCLEVBQTRDO1lBQzNDUCxZQUFZLEVBQUUsSUFENkI7WUFFM0NDLEdBQUcsRUFBRSxVQUFDQyxDQUFELEVBQVk7Y0FDaEIsT0FBTyxLQUFJLENBQUNNLGNBQUwsQ0FBb0JELGNBQXBCLEVBQW9DTCxDQUFwQyxDQUFQO1lBQ0EsQ0FKMEM7WUFLM0NFLEdBQUcsRUFBRSxZQUFNO2NBQ1YsSUFBTUssa0JBQWtCLEdBQUcsS0FBSSxDQUFDQyxjQUFMLENBQW9CSCxjQUFwQixDQUEzQjs7Y0FDQSxJQUFJMUIsR0FBRyxDQUFDM0UsUUFBSixDQUFhSyxZQUFiLENBQTBCZ0csY0FBMUIsRUFBMEMvRCxRQUE5QyxFQUF3RDtnQkFDdkQsT0FBT2lFLGtCQUFrQixJQUFJLEVBQTdCO2NBQ0EsQ0FGRCxNQUVPO2dCQUNOLE9BQU9BLGtCQUFQO2NBQ0E7WUFDRDtVQVowQyxDQUE1QztRQWNBLENBZkQ7UUFnQkEsSUFBTUUsZ0JBQWdCLEdBQUduQyxNQUFNLENBQUNjLElBQVAsQ0FBWVQsR0FBRyxDQUFDM0UsUUFBSixDQUFhTSxZQUF6QixDQUF6QjtRQUNBbUcsZ0JBQWdCLENBQUNqQyxPQUFqQixDQUF5QixVQUFDa0MsY0FBRCxFQUFvQjtVQUM1Q3BDLE1BQU0sQ0FBQ3VCLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNEJhLGNBQTVCLEVBQTRDO1lBQzNDWixZQUFZLEVBQUUsSUFENkI7WUFFM0NDLEdBQUcsRUFBRSxVQUFDQyxDQUFELEVBQVk7Y0FDaEIsT0FBTyxLQUFJLENBQUNXLGNBQUwsQ0FBb0JELGNBQXBCLEVBQW9DVixDQUFwQyxDQUFQO1lBQ0EsQ0FKMEM7WUFLM0NFLEdBQUcsRUFBRSxZQUFNO2NBQ1YsSUFBTUssa0JBQWtCLEdBQUcsS0FBSSxDQUFDSyxjQUFMLENBQW9CRixjQUFwQixDQUEzQjs7Y0FDQSxJQUFJL0IsR0FBRyxDQUFDM0UsUUFBSixDQUFhTSxZQUFiLENBQTBCb0csY0FBMUIsRUFBMENwRSxRQUE5QyxFQUF3RDtnQkFDdkQsT0FBT2lFLGtCQUFrQixJQUFJLEVBQTdCO2NBQ0EsQ0FGRCxNQUVPO2dCQUNOLE9BQU9BLGtCQUFQO2NBQ0E7WUFDRDtVQVowQyxDQUE1QztRQWNBLENBZkQ7TUFnQkE7SUFDRCxDQXRERDs7SUF1REF0QyxLQUFLLENBQUNwRCxRQUFOLEdBQWlCLFVBQVVnRyxVQUFWLEVBQTJCO01BQzNDLElBQU1DLEdBQUcsR0FBRyxFQUFaOztNQUNDQSxHQUFELENBQWE1RCxXQUFiLEdBQTJCLFlBQTBCO1FBQUEsbUNBQWJDLElBQWE7VUFBYkEsSUFBYTtRQUFBOztRQUNwRCxPQUFPYyxLQUFLLENBQUMwQixLQUFOLENBQVksSUFBWixFQUFrQnhDLElBQWxCLENBQVA7TUFDQSxDQUZEOztNQUdBLElBQU00RCxNQUFNLEdBQUlDLFFBQUQsQ0FBa0JDLFdBQWxCLENBQThCaEQsS0FBOUIsK0JBQTJEaUQsR0FBRyxFQUE5RCxHQUFvRUosR0FBcEUsRUFBeUVLLGtCQUF6RSxDQUFmO01BQ0FKLE1BQU0sQ0FBQzNDLFdBQVAsR0FBcUJnRCxlQUFyQixHQUF1Q1AsVUFBdkM7TUFDQUUsTUFBTSxDQUFDM0MsV0FBUCxHQUFxQmlELFNBQXJCLEdBQWlDcEQsS0FBSyxDQUFDRyxXQUFOLEdBQW9CaUQsU0FBckQ7TUFDQSxPQUFPTixNQUFQO0lBQ0EsQ0FURDs7SUFXQU8sVUFBVSxDQUFDdkIsR0FBWCxDQUFlN0IsSUFBZixFQUFxQnFCLE1BQXJCO0lBQ0EsT0FBT0EsTUFBUDtFQUNBIn0=