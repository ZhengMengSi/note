/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["@sap-ux/jest-mock-ui5/dist/generic", "sap/fe/core/controllerextensions/EditFlow", "sap/fe/core/controllerextensions/InternalEditFlow", "sap/fe/core/controllerextensions/InternalRouting", "sap/fe/core/controllerextensions/SideEffects", "sap/ui/base/Event", "sap/ui/core/mvc/Controller", "sap/ui/core/mvc/View", "sap/ui/model/CompositeBinding", "sap/ui/model/odata/v4/Context", "sap/ui/model/odata/v4/ODataContextBinding", "sap/ui/model/odata/v4/ODataListBinding", "sap/ui/model/odata/v4/ODataMetaModel", "sap/ui/model/odata/v4/ODataModel", "sap/ui/model/odata/v4/ODataPropertyBinding"], function (generic, EditFlow, InternalEditFlow, InternalRouting, SideEffects, Event, Controller, View, CompositeBinding, Context, ODataContextBinding, ODataListBinding, ODataMetaModel, ODataModel, ODataPropertyBinding) {
  "use strict";

  var _exports = {};
  var mock = generic.mock;

  /**
   * Factory function to create a new MockContext.
   *
   * @param oContextData A map of the different properties of the context. The value for the key '$path' will be returned by the 'getPath' method
   * @param oBinding The binding of the context
   * @param isInactive Is the context iniactive or not
   * @returns A new MockContext
   */
  function createMockContext(oContextData, oBinding, isInactive) {
    // Ugly workaround to get a proper mock pbject, as Context isn't properly exported from UI5
    var mocked = mock(Object.getPrototypeOf(Context.createNewContext(null, null, "/e")));
    mocked._isKeptAlive = false;
    mocked._contextData = oContextData || {};
    mocked._oBinding = oBinding;
    mocked._isInactive = !!isInactive; // Default behavior

    mocked.mock.isA.mockImplementation(function (sClassName) {
      return sClassName === "sap.ui.model.odata.v4.Context";
    });
    mocked.mock.getProperty.mockImplementation(function (key) {
      return mocked._contextData[key];
    });
    mocked.mock.requestProperty.mockImplementation(function (keyOrKeys) {
      if (Array.isArray(keyOrKeys)) {
        return Promise.resolve(keyOrKeys.map(function (key) {
          return mocked._contextData[key];
        }));
      }

      return Promise.resolve(mocked._contextData[keyOrKeys]);
    });
    mocked.mock.requestObject.mockImplementation(function (key) {
      return Promise.resolve(mocked._contextData[key]);
    });
    mocked.mock.setProperty.mockImplementation(function (key, value) {
      mocked._contextData[key] = value;
      return mocked._contextData[key];
    });
    mocked.mock.getObject.mockImplementation(function (path) {
      var result = path ? mocked._contextData[path] : mocked._contextData;

      if (!result && path && path.indexOf("/") > -1) {
        var parts = path.split("/");
        result = parts.reduce(function (sum, part) {
          sum = part ? sum[part] : sum;
          return sum;
        }, mocked._contextData);
      }

      return result;
    });
    mocked.mock.getPath.mockImplementation(function () {
      return mocked._contextData["$path"];
    });
    mocked.mock.getBinding.mockImplementation(function () {
      return mocked._oBinding;
    });
    mocked.mock.getModel.mockImplementation(function () {
      var _mocked$_oBinding;

      return (_mocked$_oBinding = mocked._oBinding) === null || _mocked$_oBinding === void 0 ? void 0 : _mocked$_oBinding.getModel();
    });
    mocked.mock.setKeepAlive.mockImplementation(function (bool, _fnOnBeforeDestroy, _bRequestMessages) {
      mocked._isKeptAlive = bool;
    });
    mocked.mock.isKeepAlive.mockImplementation(function () {
      return mocked._isKeptAlive;
    });
    mocked.mock.isInactive.mockImplementation(function () {
      return mocked._isInactive;
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockContext instead.
   */


  _exports.createMockContext = createMockContext;
  var MockContext = createMockContext;
  /**
   * Utility type to mock a sap.ui.base.Event
   */

  _exports.MockContext = MockContext;

  /**
   * Factory function to create a new MockEvent.
   *
   * @param params The parameters of the event
   * @returns A new MockEvent
   */
  function createMockEvent(params) {
    var mocked = mock(Event);
    mocked._params = params || {}; // Default behavior

    mocked.mock.getParameter.mockImplementation(function (name) {
      return mocked._params[name];
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockEvent instead.
   */


  _exports.createMockEvent = createMockEvent;
  var MockEvent = createMockEvent;
  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataListBinding
   */

  _exports.MockEvent = MockEvent;

  /**
   * Factory function to create a new MockListBinding.
   *
   * @param aContextData An array of objects holding the different properties of the contexts referenced by the ListBinding
   * @param oMockModel The model of the ListBinding
   * @returns A new MockListBinding
   */
  function createMockListBinding(aContextData, oMockModel) {
    var mocked = mock(ODataListBinding);
    aContextData = aContextData || [];
    mocked._aMockContexts = aContextData.map(function (contextData) {
      return createMockContext(contextData, mocked);
    });
    mocked._mockModel = oMockModel; // Utility API

    mocked.setModel = function (model) {
      mocked._mockModel = model;
    }; // Default behavior


    mocked.mock.isA.mockImplementation(function (sClassName) {
      return sClassName === "sap.ui.model.odata.v4.ODataListBinding";
    });
    mocked.mock.requestContexts.mockImplementation(function () {
      return Promise.resolve(mocked._aMockContexts);
    });
    mocked.mock.getCurrentContexts.mockImplementation(function () {
      return mocked._aMockContexts;
    });
    mocked.mock.getAllCurrentContexts.mockImplementation(function () {
      return mocked._aMockContexts;
    });
    mocked.mock.getModel.mockImplementation(function () {
      return mocked._mockModel;
    });
    mocked.mock.getUpdateGroupId.mockReturnValue("auto");
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockListBinding instead.
   */


  _exports.createMockListBinding = createMockListBinding;
  var MockListBinding = createMockListBinding;
  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataPropertyBinding
   */

  _exports.MockListBinding = MockListBinding;

  /**
   * Factory function to create a new MockPropertyBinding.
   *
   * @param value The value returnd by the PropertyBinding
   * @param path The path of the PropertyBinding
   * @param oMockModel The model of the PropertyBinding
   * @returns A new MockPropertyBinding
   */
  function createMockPropertyBinding(value, path, oMockModel) {
    var mocked = mock(ODataPropertyBinding);
    mocked._mockModel = oMockModel;
    mocked._value = value;
    mocked._path = path; // Default behavior

    mocked.mock.isA.mockImplementation(function (sClassName) {
      return sClassName === "sap.ui.model.odata.v4.ODataPropertyBinding";
    });
    mocked.mock.getModel.mockImplementation(function () {
      return mocked._mockModel;
    });
    mocked.mock.getValue.mockImplementation(function () {
      return mocked._value;
    });
    mocked.mock.getPath.mockImplementation(function () {
      return mocked._path;
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockPropertyBinding instead.
   */


  _exports.createMockPropertyBinding = createMockPropertyBinding;
  var MockPropertyBinding = createMockPropertyBinding;
  /**
   * Utility type to mock a sap.ui.model.CompositeBinding
   */

  _exports.MockPropertyBinding = MockPropertyBinding;

  /**
   * Factory function to create a new MockCompositeBinding.
   *
   * @param aBindings The bindings of the CompositeBinding
   * @returns A new MockCompositeBinding
   */
  function createMockCompositeBinding(aBindings) {
    var mocked = mock(CompositeBinding);
    mocked._aBindings = aBindings; // Default behavior

    mocked.mock.isA.mockImplementation(function (sClassName) {
      return sClassName === "sap.ui.model.CompositeBinding";
    });
    mocked.mock.getBindings.mockImplementation(function () {
      return mocked._aBindings;
    });
    mocked.mock.getValue.mockImplementation(function () {
      return mocked._aBindings.map(function (binding) {
        return binding.getValue();
      });
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockCompositeBinding instead.
   */


  _exports.createMockCompositeBinding = createMockCompositeBinding;
  var MockCompositeBinding = createMockCompositeBinding;
  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataContextBinding
   */

  _exports.MockCompositeBinding = MockCompositeBinding;

  /**
   * Factory function to create a new MockContextBinding.
   *
   * @param oContext The context of the ContextBinding
   * @param oMockModel The model of the ContextBinding
   * @returns A new MockContextBinding
   */
  function createMockContextBinding(oContext, oMockModel) {
    var mocked = mock(ODataContextBinding);
    mocked.mockModel = oMockModel;
    mocked.oMockContext = createMockContext(oContext || {}, mocked); // Utility API

    mocked.getInternalMockContext = function () {
      return mocked.oMockContext;
    };

    mocked.setModel = function (oModel) {
      mocked.mockModel = oModel;
    }; // Default behavior


    mocked.mock.isA.mockImplementation(function (sClassName) {
      return sClassName === "sap.ui.model.odata.v4.ODataContextBinding";
    });
    mocked.mock.getBoundContext.mockImplementation(function () {
      return mocked.oMockContext;
    });
    mocked.mock.getModel.mockImplementation(function () {
      return mocked.mockModel;
    });
    mocked.mock.execute.mockResolvedValue(true);
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockContextBinding instead.
   */


  _exports.createMockContextBinding = createMockContextBinding;
  var MockContextBinding = createMockContextBinding;
  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataMetaModel
   */

  _exports.MockContextBinding = MockContextBinding;

  /**
   * Factory function to create a new MockMetaModel.
   *
   * @param oMetaData A map of the different metadata properties of the MetaModel (path -> value).
   * @returns A new MockMetaModel
   */
  function createMockMetaModel(oMetaData) {
    var mocked = mock(ODataMetaModel);
    mocked.oMetaContext = createMockContext(oMetaData || {}); // Default behavior

    mocked.mock.getMetaContext.mockImplementation(function (sPath) {
      return createMockContext({
        $path: sPath
      });
    });
    mocked.mock.getObject.mockImplementation(function (sPath) {
      return mocked.oMetaContext.getProperty(sPath);
    });
    mocked.mock.createBindingContext.mockImplementation(function (sPath) {
      return createMockContext({
        $path: sPath
      });
    });
    mocked.mock.getMetaPath.mockImplementation(function (sPath) {
      var metamodel = new ODataMetaModel();
      return sPath ? metamodel.getMetaPath(sPath) : sPath;
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockMetaModel instead.
   */


  _exports.createMockMetaModel = createMockMetaModel;
  var MockMetaModel = createMockMetaModel;
  /**
   * Utility type to mock a sap.ui.model.odata.v4.ODataModel
   */

  _exports.MockMetaModel = MockMetaModel;

  /**
   * Factory function to create a new MockModel.
   *
   * @param oMockListBinding A list binding that will be returned when calling bindList.
   * @param oMockContextBinding A context binding that will be returned when calling bindContext.
   * @returns A new MockModel
   */
  function createMockModel(oMockListBinding, oMockContextBinding) {
    var mocked = mock(ODataModel);
    mocked.mockListBinding = oMockListBinding;
    mocked.mockContextBinding = oMockContextBinding;

    if (oMockListBinding) {
      oMockListBinding.setModel(mocked);
    }

    if (oMockContextBinding) {
      oMockContextBinding.setModel(mocked);
    } // Utility API


    mocked.setMetaModel = function (oMetaModel) {
      mocked.oMetaModel = oMetaModel;
    }; // Default behavior


    mocked.mock.bindList.mockImplementation(function () {
      return mocked.mockListBinding;
    });
    mocked.mock.bindContext.mockImplementation(function () {
      return mocked.mockContextBinding;
    });
    mocked.mock.getMetaModel.mockImplementation(function () {
      return mocked.oMetaModel;
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockModel instead.
   */


  _exports.createMockModel = createMockModel;
  var MockModel = createMockModel;
  /**
   * Factory function to create a new MockModel used with a listBinding.
   *
   * @param oMockListBinding A list binding that will be returned when calling bindList.
   * @returns A new MockModel
   */

  _exports.MockModel = MockModel;

  function createMockModelFromListBinding(oMockListBinding) {
    return createMockModel(oMockListBinding);
  }
  /**
   *  Factory function to create a new MockModel used with a contextBinding.
   *
   * @param oMockContextBinding A context binding that will be returned when calling bindContext.
   * @returns A new MockModel
   */


  _exports.createMockModelFromListBinding = createMockModelFromListBinding;

  function createMockModelFromContextBinding(oMockContextBinding) {
    return createMockModel(undefined, oMockContextBinding);
  }
  /**
   * Utility type to mock a sap.ui.core.mvc.View
   */


  _exports.createMockModelFromContextBinding = createMockModelFromContextBinding;

  /**
   * Factory function to create a new MockView.
   *
   * @returns A new MockView
   */
  function createMockView() {
    var mocked = mock(View); // Default behavior

    mocked.mock.isA.mockImplementation(function (sClassName) {
      return sClassName === "sap.ui.core.mvc.View";
    });
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function createMockView instead.
   */


  _exports.createMockView = createMockView;
  var MockView = createMockView;
  /**
   * Utility type to mock a sap.fe.core.PageController
   */

  _exports.MockView = MockView;

  /**
   * Factory function to create a new MockController.
   *
   * @returns A new MockController
   */
  function createMockController() {
    var mocked = mock(Controller);
    mocked._routing = mock(InternalRouting);
    mocked._editFlow = mock(InternalEditFlow);
    mocked._sideEffects = mock(SideEffects);
    mocked.editFlow = mock(EditFlow); // Default Behavior

    mocked.mock.getView.mockReturnValue(createMockView());
    mocked.mock.isA.mockReturnValue(false);
    return mocked;
  }
  /**
   * For compatibility reasons, we keep a new operator. Use the factory function mockController instead.
   */


  _exports.createMockController = createMockController;
  var MockController = createMockController;
  _exports.MockController = MockController;

  /**
   * Generate model, view and controller mocks that refer to each other.
   *
   * @param existing Optional existing mocked instances that should be used
   * @returns Mocked model, view and controller instances
   */
  function mockMVC(existing) {
    var model = (existing === null || existing === void 0 ? void 0 : existing.model) || createMockModel();
    var view = (existing === null || existing === void 0 ? void 0 : existing.view) || createMockView();
    var controller = (existing === null || existing === void 0 ? void 0 : existing.controller) || createMockController();
    view.mock.getController.mockReturnValue(controller);
    view.mock.getModel.mockReturnValue(model);
    controller.mock.getView.mockReturnValue(view);
    return {
      model: model,
      view: view,
      controller: controller
    };
  }

  _exports.mockMVC = mockMVC;
  return _exports;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjcmVhdGVNb2NrQ29udGV4dCIsIm9Db250ZXh0RGF0YSIsIm9CaW5kaW5nIiwiaXNJbmFjdGl2ZSIsIm1vY2tlZCIsIm1vY2siLCJPYmplY3QiLCJnZXRQcm90b3R5cGVPZiIsIkNvbnRleHQiLCJjcmVhdGVOZXdDb250ZXh0IiwiX2lzS2VwdEFsaXZlIiwiX2NvbnRleHREYXRhIiwiX29CaW5kaW5nIiwiX2lzSW5hY3RpdmUiLCJpc0EiLCJtb2NrSW1wbGVtZW50YXRpb24iLCJzQ2xhc3NOYW1lIiwiZ2V0UHJvcGVydHkiLCJrZXkiLCJyZXF1ZXN0UHJvcGVydHkiLCJrZXlPcktleXMiLCJBcnJheSIsImlzQXJyYXkiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm1hcCIsInJlcXVlc3RPYmplY3QiLCJzZXRQcm9wZXJ0eSIsInZhbHVlIiwiZ2V0T2JqZWN0IiwicGF0aCIsInJlc3VsdCIsImluZGV4T2YiLCJwYXJ0cyIsInNwbGl0IiwicmVkdWNlIiwic3VtIiwicGFydCIsImdldFBhdGgiLCJnZXRCaW5kaW5nIiwiZ2V0TW9kZWwiLCJzZXRLZWVwQWxpdmUiLCJib29sIiwiX2ZuT25CZWZvcmVEZXN0cm95IiwiX2JSZXF1ZXN0TWVzc2FnZXMiLCJpc0tlZXBBbGl2ZSIsIk1vY2tDb250ZXh0IiwiY3JlYXRlTW9ja0V2ZW50IiwicGFyYW1zIiwiRXZlbnQiLCJfcGFyYW1zIiwiZ2V0UGFyYW1ldGVyIiwibmFtZSIsIk1vY2tFdmVudCIsImNyZWF0ZU1vY2tMaXN0QmluZGluZyIsImFDb250ZXh0RGF0YSIsIm9Nb2NrTW9kZWwiLCJPRGF0YUxpc3RCaW5kaW5nIiwiX2FNb2NrQ29udGV4dHMiLCJjb250ZXh0RGF0YSIsIl9tb2NrTW9kZWwiLCJzZXRNb2RlbCIsIm1vZGVsIiwicmVxdWVzdENvbnRleHRzIiwiZ2V0Q3VycmVudENvbnRleHRzIiwiZ2V0QWxsQ3VycmVudENvbnRleHRzIiwiZ2V0VXBkYXRlR3JvdXBJZCIsIm1vY2tSZXR1cm5WYWx1ZSIsIk1vY2tMaXN0QmluZGluZyIsImNyZWF0ZU1vY2tQcm9wZXJ0eUJpbmRpbmciLCJPRGF0YVByb3BlcnR5QmluZGluZyIsIl92YWx1ZSIsIl9wYXRoIiwiZ2V0VmFsdWUiLCJNb2NrUHJvcGVydHlCaW5kaW5nIiwiY3JlYXRlTW9ja0NvbXBvc2l0ZUJpbmRpbmciLCJhQmluZGluZ3MiLCJDb21wb3NpdGVCaW5kaW5nIiwiX2FCaW5kaW5ncyIsImdldEJpbmRpbmdzIiwiYmluZGluZyIsIk1vY2tDb21wb3NpdGVCaW5kaW5nIiwiY3JlYXRlTW9ja0NvbnRleHRCaW5kaW5nIiwib0NvbnRleHQiLCJPRGF0YUNvbnRleHRCaW5kaW5nIiwibW9ja01vZGVsIiwib01vY2tDb250ZXh0IiwiZ2V0SW50ZXJuYWxNb2NrQ29udGV4dCIsIm9Nb2RlbCIsImdldEJvdW5kQ29udGV4dCIsImV4ZWN1dGUiLCJtb2NrUmVzb2x2ZWRWYWx1ZSIsIk1vY2tDb250ZXh0QmluZGluZyIsImNyZWF0ZU1vY2tNZXRhTW9kZWwiLCJvTWV0YURhdGEiLCJPRGF0YU1ldGFNb2RlbCIsIm9NZXRhQ29udGV4dCIsImdldE1ldGFDb250ZXh0Iiwic1BhdGgiLCIkcGF0aCIsImNyZWF0ZUJpbmRpbmdDb250ZXh0IiwiZ2V0TWV0YVBhdGgiLCJtZXRhbW9kZWwiLCJNb2NrTWV0YU1vZGVsIiwiY3JlYXRlTW9ja01vZGVsIiwib01vY2tMaXN0QmluZGluZyIsIm9Nb2NrQ29udGV4dEJpbmRpbmciLCJPRGF0YU1vZGVsIiwibW9ja0xpc3RCaW5kaW5nIiwibW9ja0NvbnRleHRCaW5kaW5nIiwic2V0TWV0YU1vZGVsIiwib01ldGFNb2RlbCIsImJpbmRMaXN0IiwiYmluZENvbnRleHQiLCJnZXRNZXRhTW9kZWwiLCJNb2NrTW9kZWwiLCJjcmVhdGVNb2NrTW9kZWxGcm9tTGlzdEJpbmRpbmciLCJjcmVhdGVNb2NrTW9kZWxGcm9tQ29udGV4dEJpbmRpbmciLCJ1bmRlZmluZWQiLCJjcmVhdGVNb2NrVmlldyIsIlZpZXciLCJNb2NrVmlldyIsImNyZWF0ZU1vY2tDb250cm9sbGVyIiwiQ29udHJvbGxlciIsIl9yb3V0aW5nIiwiSW50ZXJuYWxSb3V0aW5nIiwiX2VkaXRGbG93IiwiSW50ZXJuYWxFZGl0RmxvdyIsIl9zaWRlRWZmZWN0cyIsIlNpZGVFZmZlY3RzIiwiZWRpdEZsb3ciLCJFZGl0RmxvdyIsImdldFZpZXciLCJNb2NrQ29udHJvbGxlciIsIm1vY2tNVkMiLCJleGlzdGluZyIsInZpZXciLCJjb250cm9sbGVyIiwiZ2V0Q29udHJvbGxlciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiVUk1TW9ja0hlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFdpdGhNb2NrIH0gZnJvbSBcIkBzYXAtdXgvamVzdC1tb2NrLXVpNS9kaXN0L2dlbmVyaWNcIjtcbmltcG9ydCB7IG1vY2sgfSBmcm9tIFwiQHNhcC11eC9qZXN0LW1vY2stdWk1L2Rpc3QvZ2VuZXJpY1wiO1xuaW1wb3J0IEVkaXRGbG93IGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9FZGl0Rmxvd1wiO1xuaW1wb3J0IEludGVybmFsRWRpdEZsb3cgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0ludGVybmFsRWRpdEZsb3dcIjtcbmltcG9ydCBJbnRlcm5hbFJvdXRpbmcgZnJvbSBcInNhcC9mZS9jb3JlL2NvbnRyb2xsZXJleHRlbnNpb25zL0ludGVybmFsUm91dGluZ1wiO1xuaW1wb3J0IFNpZGVFZmZlY3RzIGZyb20gXCJzYXAvZmUvY29yZS9jb250cm9sbGVyZXh0ZW5zaW9ucy9TaWRlRWZmZWN0c1wiO1xuaW1wb3J0IEV2ZW50IGZyb20gXCJzYXAvdWkvYmFzZS9FdmVudFwiO1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSBcInNhcC91aS9jb3JlL212Yy9Db250cm9sbGVyXCI7XG5pbXBvcnQgVmlldyBmcm9tIFwic2FwL3VpL2NvcmUvbXZjL1ZpZXdcIjtcbmltcG9ydCBDb21wb3NpdGVCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvQ29tcG9zaXRlQmluZGluZ1wiO1xuaW1wb3J0IENvbnRleHQgZnJvbSBcInNhcC91aS9tb2RlbC9vZGF0YS92NC9Db250ZXh0XCI7XG5pbXBvcnQgT0RhdGFDb250ZXh0QmluZGluZyBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhQ29udGV4dEJpbmRpbmdcIjtcbmltcG9ydCBPRGF0YUxpc3RCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFMaXN0QmluZGluZ1wiO1xuaW1wb3J0IE9EYXRhTWV0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNZXRhTW9kZWxcIjtcbmltcG9ydCBPRGF0YU1vZGVsIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFNb2RlbFwiO1xuaW1wb3J0IE9EYXRhUHJvcGVydHlCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvb2RhdGEvdjQvT0RhdGFQcm9wZXJ0eUJpbmRpbmdcIjtcblxuLyoqXG4gKiBVdGlsaXR5IHR5cGUgdG8gbW9jayBhIHNhcC51aS5tb2RlbC5vZGF0YS52NC5Db250ZXh0XG4gKi9cbmV4cG9ydCB0eXBlIE1vY2tDb250ZXh0ID0gV2l0aE1vY2s8Q29udGV4dD4gJiB7XG5cdF9pc0tlcHRBbGl2ZTogYm9vbGVhbjtcblx0X2NvbnRleHREYXRhOiBhbnk7XG5cdF9vQmluZGluZzogYW55O1xuXHRfaXNJbmFjdGl2ZTogYm9vbGVhbjtcbn07XG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IE1vY2tDb250ZXh0LlxuICpcbiAqIEBwYXJhbSBvQ29udGV4dERhdGEgQSBtYXAgb2YgdGhlIGRpZmZlcmVudCBwcm9wZXJ0aWVzIG9mIHRoZSBjb250ZXh0LiBUaGUgdmFsdWUgZm9yIHRoZSBrZXkgJyRwYXRoJyB3aWxsIGJlIHJldHVybmVkIGJ5IHRoZSAnZ2V0UGF0aCcgbWV0aG9kXG4gKiBAcGFyYW0gb0JpbmRpbmcgVGhlIGJpbmRpbmcgb2YgdGhlIGNvbnRleHRcbiAqIEBwYXJhbSBpc0luYWN0aXZlIElzIHRoZSBjb250ZXh0IGluaWFjdGl2ZSBvciBub3RcbiAqIEByZXR1cm5zIEEgbmV3IE1vY2tDb250ZXh0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrQ29udGV4dChvQ29udGV4dERhdGE/OiBhbnksIG9CaW5kaW5nPzogYW55LCBpc0luYWN0aXZlPzogYm9vbGVhbik6IE1vY2tDb250ZXh0IHtcblx0Ly8gVWdseSB3b3JrYXJvdW5kIHRvIGdldCBhIHByb3BlciBtb2NrIHBiamVjdCwgYXMgQ29udGV4dCBpc24ndCBwcm9wZXJseSBleHBvcnRlZCBmcm9tIFVJNVxuXHRjb25zdCBtb2NrZWQgPSBtb2NrKE9iamVjdC5nZXRQcm90b3R5cGVPZigoQ29udGV4dCBhcyBhbnkpLmNyZWF0ZU5ld0NvbnRleHQobnVsbCwgbnVsbCwgXCIvZVwiKSkpIGFzIE1vY2tDb250ZXh0O1xuXHRtb2NrZWQuX2lzS2VwdEFsaXZlID0gZmFsc2U7XG5cdG1vY2tlZC5fY29udGV4dERhdGEgPSBvQ29udGV4dERhdGEgfHwge307XG5cdG1vY2tlZC5fb0JpbmRpbmcgPSBvQmluZGluZztcblx0bW9ja2VkLl9pc0luYWN0aXZlID0gISFpc0luYWN0aXZlO1xuXG5cdC8vIERlZmF1bHQgYmVoYXZpb3Jcblx0bW9ja2VkLm1vY2suaXNBLm1vY2tJbXBsZW1lbnRhdGlvbigoc0NsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0cmV0dXJuIHNDbGFzc05hbWUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0LkNvbnRleHRcIjtcblx0fSk7XG5cdG1vY2tlZC5tb2NrLmdldFByb3BlcnR5Lm1vY2tJbXBsZW1lbnRhdGlvbigoa2V5OiBzdHJpbmcpID0+IHtcblx0XHRyZXR1cm4gbW9ja2VkLl9jb250ZXh0RGF0YVtrZXldO1xuXHR9KTtcblx0bW9ja2VkLm1vY2sucmVxdWVzdFByb3BlcnR5Lm1vY2tJbXBsZW1lbnRhdGlvbigoa2V5T3JLZXlzOiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4ge1xuXHRcdGlmIChBcnJheS5pc0FycmF5KGtleU9yS2V5cykpIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoa2V5T3JLZXlzLm1hcCgoa2V5KSA9PiBtb2NrZWQuX2NvbnRleHREYXRhW2tleV0pKTtcblx0XHR9XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShtb2NrZWQuX2NvbnRleHREYXRhW2tleU9yS2V5c10pO1xuXHR9KTtcblx0bW9ja2VkLm1vY2sucmVxdWVzdE9iamVjdC5tb2NrSW1wbGVtZW50YXRpb24oKGtleTogc3RyaW5nKSA9PiB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShtb2NrZWQuX2NvbnRleHREYXRhW2tleV0pO1xuXHR9KTtcblx0bW9ja2VkLm1vY2suc2V0UHJvcGVydHkubW9ja0ltcGxlbWVudGF0aW9uKChrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4ge1xuXHRcdG1vY2tlZC5fY29udGV4dERhdGFba2V5XSA9IHZhbHVlO1xuXHRcdHJldHVybiBtb2NrZWQuX2NvbnRleHREYXRhW2tleV07XG5cdH0pO1xuXG5cdG1vY2tlZC5tb2NrLmdldE9iamVjdC5tb2NrSW1wbGVtZW50YXRpb24oKHBhdGg6IHN0cmluZykgPT4ge1xuXHRcdGxldCByZXN1bHQgPSBwYXRoID8gbW9ja2VkLl9jb250ZXh0RGF0YVtwYXRoXSA6IG1vY2tlZC5fY29udGV4dERhdGE7XG5cblx0XHRpZiAoIXJlc3VsdCAmJiBwYXRoICYmIHBhdGguaW5kZXhPZihcIi9cIikgPiAtMSkge1xuXHRcdFx0Y29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KFwiL1wiKTtcblx0XHRcdHJlc3VsdCA9IHBhcnRzLnJlZHVjZSgoc3VtLCBwYXJ0OiBhbnkpID0+IHtcblx0XHRcdFx0c3VtID0gcGFydCA/IHN1bVtwYXJ0XSA6IHN1bTtcblx0XHRcdFx0cmV0dXJuIHN1bTtcblx0XHRcdH0sIG1vY2tlZC5fY29udGV4dERhdGEpO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0pO1xuXG5cdG1vY2tlZC5tb2NrLmdldFBhdGgubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG1vY2tlZC5fY29udGV4dERhdGFbXCIkcGF0aFwiXSk7XG5cdG1vY2tlZC5tb2NrLmdldEJpbmRpbmcubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG1vY2tlZC5fb0JpbmRpbmcpO1xuXHRtb2NrZWQubW9jay5nZXRNb2RlbC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbW9ja2VkLl9vQmluZGluZz8uZ2V0TW9kZWwoKSk7XG5cdG1vY2tlZC5tb2NrLnNldEtlZXBBbGl2ZS5tb2NrSW1wbGVtZW50YXRpb24oKGJvb2w6IGJvb2xlYW4sIF9mbk9uQmVmb3JlRGVzdHJveT86IGFueSwgX2JSZXF1ZXN0TWVzc2FnZXM/OiBib29sZWFuKSA9PiB7XG5cdFx0bW9ja2VkLl9pc0tlcHRBbGl2ZSA9IGJvb2w7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5pc0tlZXBBbGl2ZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbW9ja2VkLl9pc0tlcHRBbGl2ZSk7XG5cdG1vY2tlZC5tb2NrLmlzSW5hY3RpdmUubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG1vY2tlZC5faXNJbmFjdGl2ZSk7XG5cblx0cmV0dXJuIG1vY2tlZDtcbn1cbi8qKlxuICogRm9yIGNvbXBhdGliaWxpdHkgcmVhc29ucywgd2Uga2VlcCBhIG5ldyBvcGVyYXRvci4gVXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIGNyZWF0ZU1vY2tDb250ZXh0IGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2NrQ29udGV4dDogbmV3IChvVmFsdWVzPzogYW55LCBvQmluZGluZz86IGFueSwgaXNJbmFjdGl2ZT86IGJvb2xlYW4pID0+IE1vY2tDb250ZXh0ID0gY3JlYXRlTW9ja0NvbnRleHQgYXMgYW55O1xuXG4vKipcbiAqIFV0aWxpdHkgdHlwZSB0byBtb2NrIGEgc2FwLnVpLmJhc2UuRXZlbnRcbiAqL1xuZXhwb3J0IHR5cGUgTW9ja0V2ZW50ID0gV2l0aE1vY2s8RXZlbnQ+ICYge1xuXHRfcGFyYW1zOiB7IFtrZXk6IHN0cmluZ106IGFueSB9O1xufTtcbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgTW9ja0V2ZW50LlxuICpcbiAqIEBwYXJhbSBwYXJhbXMgVGhlIHBhcmFtZXRlcnMgb2YgdGhlIGV2ZW50XG4gKiBAcmV0dXJucyBBIG5ldyBNb2NrRXZlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tFdmVudChwYXJhbXM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogTW9ja0V2ZW50IHtcblx0Y29uc3QgbW9ja2VkID0gbW9jayhFdmVudCkgYXMgTW9ja0V2ZW50O1xuXHRtb2NrZWQuX3BhcmFtcyA9IHBhcmFtcyB8fCB7fTtcblxuXHQvLyBEZWZhdWx0IGJlaGF2aW9yXG5cdG1vY2tlZC5tb2NrLmdldFBhcmFtZXRlci5tb2NrSW1wbGVtZW50YXRpb24oKG5hbWUpID0+IG1vY2tlZC5fcGFyYW1zW25hbWVdKTtcblxuXHRyZXR1cm4gbW9ja2VkO1xufVxuLyoqXG4gKiBGb3IgY29tcGF0aWJpbGl0eSByZWFzb25zLCB3ZSBrZWVwIGEgbmV3IG9wZXJhdG9yLiBVc2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gY3JlYXRlTW9ja0V2ZW50IGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2NrRXZlbnQ6IG5ldyAocGFyYW1zPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkgPT4gTW9ja0V2ZW50ID0gY3JlYXRlTW9ja0V2ZW50IGFzIGFueTtcblxuLyoqXG4gKiBVdGlsaXR5IHR5cGUgdG8gbW9jayBhIHNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YUxpc3RCaW5kaW5nXG4gKi9cbmV4cG9ydCB0eXBlIE1vY2tMaXN0QmluZGluZyA9IFdpdGhNb2NrPE9EYXRhTGlzdEJpbmRpbmc+ICYge1xuXHRfYU1vY2tDb250ZXh0czogTW9ja0NvbnRleHRbXTtcblx0X21vY2tNb2RlbD86IE1vY2tNb2RlbDtcblxuXHQvKipcblx0ICogVXRpbGl0eSBtZXRob2QgdG8gc2V0IHRoZSBtb2RlbCBvZiB0aGUgTGlzdEJpbmRpbmdcblx0ICovXG5cdHNldE1vZGVsOiAobW9kZWw6IE1vY2tNb2RlbCkgPT4gdm9pZDtcbn07XG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IE1vY2tMaXN0QmluZGluZy5cbiAqXG4gKiBAcGFyYW0gYUNvbnRleHREYXRhIEFuIGFycmF5IG9mIG9iamVjdHMgaG9sZGluZyB0aGUgZGlmZmVyZW50IHByb3BlcnRpZXMgb2YgdGhlIGNvbnRleHRzIHJlZmVyZW5jZWQgYnkgdGhlIExpc3RCaW5kaW5nXG4gKiBAcGFyYW0gb01vY2tNb2RlbCBUaGUgbW9kZWwgb2YgdGhlIExpc3RCaW5kaW5nXG4gKiBAcmV0dXJucyBBIG5ldyBNb2NrTGlzdEJpbmRpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tMaXN0QmluZGluZyhhQ29udGV4dERhdGE/OiBhbnlbXSwgb01vY2tNb2RlbD86IE1vY2tNb2RlbCk6IE1vY2tMaXN0QmluZGluZyB7XG5cdGNvbnN0IG1vY2tlZCA9IG1vY2soT0RhdGFMaXN0QmluZGluZykgYXMgTW9ja0xpc3RCaW5kaW5nO1xuXHRhQ29udGV4dERhdGEgPSBhQ29udGV4dERhdGEgfHwgW107XG5cdG1vY2tlZC5fYU1vY2tDb250ZXh0cyA9IGFDb250ZXh0RGF0YS5tYXAoKGNvbnRleHREYXRhKSA9PiB7XG5cdFx0cmV0dXJuIGNyZWF0ZU1vY2tDb250ZXh0KGNvbnRleHREYXRhLCBtb2NrZWQpO1xuXHR9KTtcblx0bW9ja2VkLl9tb2NrTW9kZWwgPSBvTW9ja01vZGVsO1xuXG5cdC8vIFV0aWxpdHkgQVBJXG5cdG1vY2tlZC5zZXRNb2RlbCA9IChtb2RlbDogTW9ja01vZGVsKSA9PiB7XG5cdFx0bW9ja2VkLl9tb2NrTW9kZWwgPSBtb2RlbDtcblx0fTtcblxuXHQvLyBEZWZhdWx0IGJlaGF2aW9yXG5cdG1vY2tlZC5tb2NrLmlzQS5tb2NrSW1wbGVtZW50YXRpb24oKHNDbGFzc05hbWU6IHN0cmluZykgPT4ge1xuXHRcdHJldHVybiBzQ2xhc3NOYW1lID09PSBcInNhcC51aS5tb2RlbC5vZGF0YS52NC5PRGF0YUxpc3RCaW5kaW5nXCI7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5yZXF1ZXN0Q29udGV4dHMubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG1vY2tlZC5fYU1vY2tDb250ZXh0cyk7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5nZXRDdXJyZW50Q29udGV4dHMubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcblx0XHRyZXR1cm4gbW9ja2VkLl9hTW9ja0NvbnRleHRzO1xuXHR9KTtcblx0bW9ja2VkLm1vY2suZ2V0QWxsQ3VycmVudENvbnRleHRzLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5fYU1vY2tDb250ZXh0cztcblx0fSk7XG5cdG1vY2tlZC5tb2NrLmdldE1vZGVsLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5fbW9ja01vZGVsO1xuXHR9KTtcblx0bW9ja2VkLm1vY2suZ2V0VXBkYXRlR3JvdXBJZC5tb2NrUmV0dXJuVmFsdWUoXCJhdXRvXCIpO1xuXG5cdHJldHVybiBtb2NrZWQ7XG59XG4vKipcbiAqIEZvciBjb21wYXRpYmlsaXR5IHJlYXNvbnMsIHdlIGtlZXAgYSBuZXcgb3BlcmF0b3IuIFVzZSB0aGUgZmFjdG9yeSBmdW5jdGlvbiBjcmVhdGVNb2NrTGlzdEJpbmRpbmcgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1vY2tMaXN0QmluZGluZzogbmV3IChhQ29udGV4dHM/OiBhbnlbXSwgbW9ja01vZGVsPzogTW9ja01vZGVsKSA9PiBNb2NrTGlzdEJpbmRpbmcgPSBjcmVhdGVNb2NrTGlzdEJpbmRpbmcgYXMgYW55O1xuXG4vKipcbiAqIFV0aWxpdHkgdHlwZSB0byBtb2NrIGEgc2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhUHJvcGVydHlCaW5kaW5nXG4gKi9cbmV4cG9ydCB0eXBlIE1vY2tQcm9wZXJ0eUJpbmRpbmcgPSBXaXRoTW9jazxPRGF0YVByb3BlcnR5QmluZGluZz4gJiB7XG5cdF92YWx1ZT86IGFueTtcblx0X3BhdGg/OiBzdHJpbmc7XG5cdF9tb2NrTW9kZWw/OiBNb2NrTW9kZWw7XG59O1xuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBNb2NrUHJvcGVydHlCaW5kaW5nLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgcmV0dXJuZCBieSB0aGUgUHJvcGVydHlCaW5kaW5nXG4gKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCBvZiB0aGUgUHJvcGVydHlCaW5kaW5nXG4gKiBAcGFyYW0gb01vY2tNb2RlbCBUaGUgbW9kZWwgb2YgdGhlIFByb3BlcnR5QmluZGluZ1xuICogQHJldHVybnMgQSBuZXcgTW9ja1Byb3BlcnR5QmluZGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1Byb3BlcnR5QmluZGluZyh2YWx1ZTogYW55LCBwYXRoPzogc3RyaW5nLCBvTW9ja01vZGVsPzogTW9ja01vZGVsKTogTW9ja1Byb3BlcnR5QmluZGluZyB7XG5cdGNvbnN0IG1vY2tlZCA9IG1vY2soT0RhdGFQcm9wZXJ0eUJpbmRpbmcpIGFzIE1vY2tQcm9wZXJ0eUJpbmRpbmc7XG5cdG1vY2tlZC5fbW9ja01vZGVsID0gb01vY2tNb2RlbDtcblx0bW9ja2VkLl92YWx1ZSA9IHZhbHVlO1xuXHRtb2NrZWQuX3BhdGggPSBwYXRoO1xuXG5cdC8vIERlZmF1bHQgYmVoYXZpb3Jcblx0bW9ja2VkLm1vY2suaXNBLm1vY2tJbXBsZW1lbnRhdGlvbigoc0NsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0cmV0dXJuIHNDbGFzc05hbWUgPT09IFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhUHJvcGVydHlCaW5kaW5nXCI7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5nZXRNb2RlbC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuXHRcdHJldHVybiBtb2NrZWQuX21vY2tNb2RlbDtcblx0fSk7XG5cdG1vY2tlZC5tb2NrLmdldFZhbHVlLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5fdmFsdWU7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5nZXRQYXRoLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5fcGF0aDtcblx0fSk7XG5cblx0cmV0dXJuIG1vY2tlZDtcbn1cbi8qKlxuICogRm9yIGNvbXBhdGliaWxpdHkgcmVhc29ucywgd2Uga2VlcCBhIG5ldyBvcGVyYXRvci4gVXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIGNyZWF0ZU1vY2tQcm9wZXJ0eUJpbmRpbmcgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1vY2tQcm9wZXJ0eUJpbmRpbmc6IG5ldyAodmFsdWU6IGFueSwgb01vY2tNb2RlbD86IE1vY2tNb2RlbCkgPT4gTW9ja1Byb3BlcnR5QmluZGluZyA9IGNyZWF0ZU1vY2tQcm9wZXJ0eUJpbmRpbmcgYXMgYW55O1xuXG4vKipcbiAqIFV0aWxpdHkgdHlwZSB0byBtb2NrIGEgc2FwLnVpLm1vZGVsLkNvbXBvc2l0ZUJpbmRpbmdcbiAqL1xuZXhwb3J0IHR5cGUgTW9ja0NvbXBvc2l0ZUJpbmRpbmcgPSBXaXRoTW9jazxDb21wb3NpdGVCaW5kaW5nPiAmIHtcblx0X2FCaW5kaW5nczogTW9ja1Byb3BlcnR5QmluZGluZ1tdO1xufTtcbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgTW9ja0NvbXBvc2l0ZUJpbmRpbmcuXG4gKlxuICogQHBhcmFtIGFCaW5kaW5ncyBUaGUgYmluZGluZ3Mgb2YgdGhlIENvbXBvc2l0ZUJpbmRpbmdcbiAqIEByZXR1cm5zIEEgbmV3IE1vY2tDb21wb3NpdGVCaW5kaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrQ29tcG9zaXRlQmluZGluZyhhQmluZGluZ3M6IE1vY2tQcm9wZXJ0eUJpbmRpbmdbXSk6IE1vY2tDb21wb3NpdGVCaW5kaW5nIHtcblx0Y29uc3QgbW9ja2VkID0gbW9jayhDb21wb3NpdGVCaW5kaW5nKSBhcyBNb2NrQ29tcG9zaXRlQmluZGluZztcblx0bW9ja2VkLl9hQmluZGluZ3MgPSBhQmluZGluZ3M7XG5cblx0Ly8gRGVmYXVsdCBiZWhhdmlvclxuXHRtb2NrZWQubW9jay5pc0EubW9ja0ltcGxlbWVudGF0aW9uKChzQ2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcblx0XHRyZXR1cm4gc0NsYXNzTmFtZSA9PT0gXCJzYXAudWkubW9kZWwuQ29tcG9zaXRlQmluZGluZ1wiO1xuXHR9KTtcblx0bW9ja2VkLm1vY2suZ2V0QmluZGluZ3MubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcblx0XHRyZXR1cm4gbW9ja2VkLl9hQmluZGluZ3M7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5nZXRWYWx1ZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuXHRcdHJldHVybiBtb2NrZWQuX2FCaW5kaW5ncy5tYXAoKGJpbmRpbmcpID0+IGJpbmRpbmcuZ2V0VmFsdWUoKSk7XG5cdH0pO1xuXG5cdHJldHVybiBtb2NrZWQ7XG59XG4vKipcbiAqIEZvciBjb21wYXRpYmlsaXR5IHJlYXNvbnMsIHdlIGtlZXAgYSBuZXcgb3BlcmF0b3IuIFVzZSB0aGUgZmFjdG9yeSBmdW5jdGlvbiBjcmVhdGVNb2NrQ29tcG9zaXRlQmluZGluZyBpbnN0ZWFkLlxuICovXG5leHBvcnQgY29uc3QgTW9ja0NvbXBvc2l0ZUJpbmRpbmc6IG5ldyAoYUJpbmRpbmdzOiBNb2NrUHJvcGVydHlCaW5kaW5nW10pID0+IE1vY2tDb21wb3NpdGVCaW5kaW5nID0gY3JlYXRlTW9ja0NvbXBvc2l0ZUJpbmRpbmcgYXMgYW55O1xuXG4vKipcbiAqIFV0aWxpdHkgdHlwZSB0byBtb2NrIGEgc2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhQ29udGV4dEJpbmRpbmdcbiAqL1xuZXhwb3J0IHR5cGUgTW9ja0NvbnRleHRCaW5kaW5nID0gV2l0aE1vY2s8T0RhdGFDb250ZXh0QmluZGluZz4gJiB7XG5cdG9Nb2NrQ29udGV4dDogTW9ja0NvbnRleHQ7XG5cdGlzS2VwdEFsaXZlOiBib29sZWFuO1xuXHRtb2NrTW9kZWw/OiBNb2NrTW9kZWw7XG5cblx0LyoqXG5cdCAqIFV0aWxpdHkgbWV0aG9kIHRvIGFjY2VzcyB0aGUgaW50ZXJuYWwgTW9ja0NvbnRleHQgb2YgdGhlIENvbnRleHRCaW5kaW5nXG5cdCAqL1xuXHRnZXRJbnRlcm5hbE1vY2tDb250ZXh0OiAoKSA9PiBNb2NrQ29udGV4dDtcblx0LyoqXG5cdCAqIFV0aWxpdHkgbWV0aG9kIHRvIHNldCB0aGUgbW9kZWwgb2YgdGhlIENvbnRleHRCaW5kaW5nXG5cdCAqL1xuXHRzZXRNb2RlbDogKG9Nb2RlbDogTW9ja01vZGVsKSA9PiB2b2lkO1xufTtcbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgTW9ja0NvbnRleHRCaW5kaW5nLlxuICpcbiAqIEBwYXJhbSBvQ29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgQ29udGV4dEJpbmRpbmdcbiAqIEBwYXJhbSBvTW9ja01vZGVsIFRoZSBtb2RlbCBvZiB0aGUgQ29udGV4dEJpbmRpbmdcbiAqIEByZXR1cm5zIEEgbmV3IE1vY2tDb250ZXh0QmluZGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja0NvbnRleHRCaW5kaW5nKG9Db250ZXh0PzogYW55LCBvTW9ja01vZGVsPzogTW9ja01vZGVsKTogTW9ja0NvbnRleHRCaW5kaW5nIHtcblx0Y29uc3QgbW9ja2VkID0gbW9jayhPRGF0YUNvbnRleHRCaW5kaW5nKSBhcyBNb2NrQ29udGV4dEJpbmRpbmc7XG5cdG1vY2tlZC5tb2NrTW9kZWwgPSBvTW9ja01vZGVsO1xuXHRtb2NrZWQub01vY2tDb250ZXh0ID0gY3JlYXRlTW9ja0NvbnRleHQob0NvbnRleHQgfHwge30sIG1vY2tlZCk7XG5cblx0Ly8gVXRpbGl0eSBBUElcblx0bW9ja2VkLmdldEludGVybmFsTW9ja0NvbnRleHQgPSAoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5vTW9ja0NvbnRleHQ7XG5cdH07XG5cdG1vY2tlZC5zZXRNb2RlbCA9IChvTW9kZWw6IE1vY2tNb2RlbCkgPT4ge1xuXHRcdG1vY2tlZC5tb2NrTW9kZWwgPSBvTW9kZWw7XG5cdH07XG5cblx0Ly8gRGVmYXVsdCBiZWhhdmlvclxuXHRtb2NrZWQubW9jay5pc0EubW9ja0ltcGxlbWVudGF0aW9uKChzQ2xhc3NOYW1lOiBzdHJpbmcpID0+IHtcblx0XHRyZXR1cm4gc0NsYXNzTmFtZSA9PT0gXCJzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFDb250ZXh0QmluZGluZ1wiO1xuXHR9KTtcblx0bW9ja2VkLm1vY2suZ2V0Qm91bmRDb250ZXh0Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5vTW9ja0NvbnRleHQ7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5nZXRNb2RlbC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuXHRcdHJldHVybiBtb2NrZWQubW9ja01vZGVsO1xuXHR9KTtcblx0bW9ja2VkLm1vY2suZXhlY3V0ZS5tb2NrUmVzb2x2ZWRWYWx1ZSh0cnVlKTtcblxuXHRyZXR1cm4gbW9ja2VkO1xufVxuLyoqXG4gKiBGb3IgY29tcGF0aWJpbGl0eSByZWFzb25zLCB3ZSBrZWVwIGEgbmV3IG9wZXJhdG9yLiBVc2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gY3JlYXRlTW9ja0NvbnRleHRCaW5kaW5nIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2NrQ29udGV4dEJpbmRpbmc6IG5ldyAob0NvbnRleHQ/OiBhbnksIG9Nb2NrTW9kZWw/OiBNb2NrTW9kZWwpID0+IE1vY2tDb250ZXh0QmluZGluZyA9IGNyZWF0ZU1vY2tDb250ZXh0QmluZGluZyBhcyBhbnk7XG5cbi8qKlxuICogVXRpbGl0eSB0eXBlIHRvIG1vY2sgYSBzYXAudWkubW9kZWwub2RhdGEudjQuT0RhdGFNZXRhTW9kZWxcbiAqL1xuZXhwb3J0IHR5cGUgTW9ja01ldGFNb2RlbCA9IFdpdGhNb2NrPE9EYXRhTWV0YU1vZGVsPiAmIHtcblx0b01ldGFDb250ZXh0OiBNb2NrQ29udGV4dDtcbn07XG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IE1vY2tNZXRhTW9kZWwuXG4gKlxuICogQHBhcmFtIG9NZXRhRGF0YSBBIG1hcCBvZiB0aGUgZGlmZmVyZW50IG1ldGFkYXRhIHByb3BlcnRpZXMgb2YgdGhlIE1ldGFNb2RlbCAocGF0aCAtPiB2YWx1ZSkuXG4gKiBAcmV0dXJucyBBIG5ldyBNb2NrTWV0YU1vZGVsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNb2NrTWV0YU1vZGVsKG9NZXRhRGF0YT86IGFueSk6IE1vY2tNZXRhTW9kZWwge1xuXHRjb25zdCBtb2NrZWQgPSBtb2NrKE9EYXRhTWV0YU1vZGVsKSBhcyBNb2NrTWV0YU1vZGVsO1xuXHRtb2NrZWQub01ldGFDb250ZXh0ID0gY3JlYXRlTW9ja0NvbnRleHQob01ldGFEYXRhIHx8IHt9KTtcblxuXHQvLyBEZWZhdWx0IGJlaGF2aW9yXG5cdG1vY2tlZC5tb2NrLmdldE1ldGFDb250ZXh0Lm1vY2tJbXBsZW1lbnRhdGlvbigoc1BhdGg6IHN0cmluZykgPT4ge1xuXHRcdHJldHVybiBjcmVhdGVNb2NrQ29udGV4dCh7ICRwYXRoOiBzUGF0aCB9KTtcblx0fSk7XG5cdG1vY2tlZC5tb2NrLmdldE9iamVjdC5tb2NrSW1wbGVtZW50YXRpb24oKHNQYXRoOiBzdHJpbmcpID0+IHtcblx0XHRyZXR1cm4gbW9ja2VkLm9NZXRhQ29udGV4dC5nZXRQcm9wZXJ0eShzUGF0aCk7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5jcmVhdGVCaW5kaW5nQ29udGV4dC5tb2NrSW1wbGVtZW50YXRpb24oKHNQYXRoOiBzdHJpbmcpID0+IHtcblx0XHRyZXR1cm4gY3JlYXRlTW9ja0NvbnRleHQoeyAkcGF0aDogc1BhdGggfSk7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5nZXRNZXRhUGF0aC5tb2NrSW1wbGVtZW50YXRpb24oKHNQYXRoOiBzdHJpbmcpID0+IHtcblx0XHRjb25zdCBtZXRhbW9kZWwgPSBuZXcgT0RhdGFNZXRhTW9kZWwoKTtcblx0XHRyZXR1cm4gc1BhdGggPyBtZXRhbW9kZWwuZ2V0TWV0YVBhdGgoc1BhdGgpIDogc1BhdGg7XG5cdH0pO1xuXG5cdHJldHVybiBtb2NrZWQ7XG59XG4vKipcbiAqIEZvciBjb21wYXRpYmlsaXR5IHJlYXNvbnMsIHdlIGtlZXAgYSBuZXcgb3BlcmF0b3IuIFVzZSB0aGUgZmFjdG9yeSBmdW5jdGlvbiBjcmVhdGVNb2NrTWV0YU1vZGVsIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2NrTWV0YU1vZGVsOiBuZXcgKG9NZXRhRGF0YT86IGFueSkgPT4gTW9ja01ldGFNb2RlbCA9IGNyZWF0ZU1vY2tNZXRhTW9kZWwgYXMgYW55O1xuXG4vKipcbiAqIFV0aWxpdHkgdHlwZSB0byBtb2NrIGEgc2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTW9kZWxcbiAqL1xuZXhwb3J0IHR5cGUgTW9ja01vZGVsID0gV2l0aE1vY2s8T0RhdGFNb2RlbD4gJiB7XG5cdG9NZXRhTW9kZWw/OiBNb2NrTWV0YU1vZGVsO1xuXHRtb2NrTGlzdEJpbmRpbmc/OiBNb2NrTGlzdEJpbmRpbmc7XG5cdG1vY2tDb250ZXh0QmluZGluZz86IE1vY2tDb250ZXh0QmluZGluZztcblxuXHQvKipcblx0ICogVXRpbGl0eSBtZXRob2QgdG8gc2V0IHRoZSBtZXRhbW9kZWwgb2YgdGhlIE1vY2tNb2RlbFxuXHQgKi9cblx0c2V0TWV0YU1vZGVsOiAob01ldGFNb2RlbDogTW9ja01ldGFNb2RlbCkgPT4gdm9pZDtcbn07XG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IE1vY2tNb2RlbC5cbiAqXG4gKiBAcGFyYW0gb01vY2tMaXN0QmluZGluZyBBIGxpc3QgYmluZGluZyB0aGF0IHdpbGwgYmUgcmV0dXJuZWQgd2hlbiBjYWxsaW5nIGJpbmRMaXN0LlxuICogQHBhcmFtIG9Nb2NrQ29udGV4dEJpbmRpbmcgQSBjb250ZXh0IGJpbmRpbmcgdGhhdCB3aWxsIGJlIHJldHVybmVkIHdoZW4gY2FsbGluZyBiaW5kQ29udGV4dC5cbiAqIEByZXR1cm5zIEEgbmV3IE1vY2tNb2RlbFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja01vZGVsKG9Nb2NrTGlzdEJpbmRpbmc/OiBNb2NrTGlzdEJpbmRpbmcsIG9Nb2NrQ29udGV4dEJpbmRpbmc/OiBNb2NrQ29udGV4dEJpbmRpbmcpOiBNb2NrTW9kZWwge1xuXHRjb25zdCBtb2NrZWQgPSBtb2NrKE9EYXRhTW9kZWwpIGFzIE1vY2tNb2RlbDtcblx0bW9ja2VkLm1vY2tMaXN0QmluZGluZyA9IG9Nb2NrTGlzdEJpbmRpbmc7XG5cdG1vY2tlZC5tb2NrQ29udGV4dEJpbmRpbmcgPSBvTW9ja0NvbnRleHRCaW5kaW5nO1xuXHRpZiAob01vY2tMaXN0QmluZGluZykge1xuXHRcdG9Nb2NrTGlzdEJpbmRpbmcuc2V0TW9kZWwobW9ja2VkKTtcblx0fVxuXHRpZiAob01vY2tDb250ZXh0QmluZGluZykge1xuXHRcdG9Nb2NrQ29udGV4dEJpbmRpbmcuc2V0TW9kZWwobW9ja2VkKTtcblx0fVxuXG5cdC8vIFV0aWxpdHkgQVBJXG5cdG1vY2tlZC5zZXRNZXRhTW9kZWwgPSAob01ldGFNb2RlbDogTW9ja01ldGFNb2RlbCkgPT4ge1xuXHRcdG1vY2tlZC5vTWV0YU1vZGVsID0gb01ldGFNb2RlbDtcblx0fTtcblxuXHQvLyBEZWZhdWx0IGJlaGF2aW9yXG5cdG1vY2tlZC5tb2NrLmJpbmRMaXN0Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5tb2NrTGlzdEJpbmRpbmc7XG5cdH0pO1xuXHRtb2NrZWQubW9jay5iaW5kQ29udGV4dC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuXHRcdHJldHVybiBtb2NrZWQubW9ja0NvbnRleHRCaW5kaW5nO1xuXHR9KTtcblx0bW9ja2VkLm1vY2suZ2V0TWV0YU1vZGVsLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG5cdFx0cmV0dXJuIG1vY2tlZC5vTWV0YU1vZGVsO1xuXHR9KTtcblxuXHRyZXR1cm4gbW9ja2VkO1xufVxuLyoqXG4gKiBGb3IgY29tcGF0aWJpbGl0eSByZWFzb25zLCB3ZSBrZWVwIGEgbmV3IG9wZXJhdG9yLiBVc2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gY3JlYXRlTW9ja01vZGVsIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2NrTW9kZWw6IG5ldyAob01vY2tMaXN0QmluZGluZz86IE1vY2tMaXN0QmluZGluZywgb01vY2tDb250ZXh0QmluZGluZz86IE1vY2tDb250ZXh0QmluZGluZykgPT4gTW9ja01vZGVsID1cblx0Y3JlYXRlTW9ja01vZGVsIGFzIGFueTtcbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgTW9ja01vZGVsIHVzZWQgd2l0aCBhIGxpc3RCaW5kaW5nLlxuICpcbiAqIEBwYXJhbSBvTW9ja0xpc3RCaW5kaW5nIEEgbGlzdCBiaW5kaW5nIHRoYXQgd2lsbCBiZSByZXR1cm5lZCB3aGVuIGNhbGxpbmcgYmluZExpc3QuXG4gKiBAcmV0dXJucyBBIG5ldyBNb2NrTW9kZWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNb2RlbEZyb21MaXN0QmluZGluZyhvTW9ja0xpc3RCaW5kaW5nOiBNb2NrTGlzdEJpbmRpbmcpOiBNb2NrTW9kZWwge1xuXHRyZXR1cm4gY3JlYXRlTW9ja01vZGVsKG9Nb2NrTGlzdEJpbmRpbmcpO1xufVxuLyoqXG4gKiAgRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgTW9ja01vZGVsIHVzZWQgd2l0aCBhIGNvbnRleHRCaW5kaW5nLlxuICpcbiAqIEBwYXJhbSBvTW9ja0NvbnRleHRCaW5kaW5nIEEgY29udGV4dCBiaW5kaW5nIHRoYXQgd2lsbCBiZSByZXR1cm5lZCB3aGVuIGNhbGxpbmcgYmluZENvbnRleHQuXG4gKiBAcmV0dXJucyBBIG5ldyBNb2NrTW9kZWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tNb2RlbEZyb21Db250ZXh0QmluZGluZyhvTW9ja0NvbnRleHRCaW5kaW5nOiBNb2NrQ29udGV4dEJpbmRpbmcpOiBNb2NrTW9kZWwge1xuXHRyZXR1cm4gY3JlYXRlTW9ja01vZGVsKHVuZGVmaW5lZCwgb01vY2tDb250ZXh0QmluZGluZyk7XG59XG5cbi8qKlxuICogVXRpbGl0eSB0eXBlIHRvIG1vY2sgYSBzYXAudWkuY29yZS5tdmMuVmlld1xuICovXG5leHBvcnQgdHlwZSBNb2NrVmlldyA9IFdpdGhNb2NrPFZpZXc+O1xuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBNb2NrVmlldy5cbiAqXG4gKiBAcmV0dXJucyBBIG5ldyBNb2NrVmlld1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTW9ja1ZpZXcoKTogTW9ja1ZpZXcge1xuXHRjb25zdCBtb2NrZWQgPSBtb2NrKFZpZXcpO1xuXG5cdC8vIERlZmF1bHQgYmVoYXZpb3Jcblx0bW9ja2VkLm1vY2suaXNBLm1vY2tJbXBsZW1lbnRhdGlvbigoc0NsYXNzTmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0cmV0dXJuIHNDbGFzc05hbWUgPT09IFwic2FwLnVpLmNvcmUubXZjLlZpZXdcIjtcblx0fSk7XG5cblx0cmV0dXJuIG1vY2tlZDtcbn1cbi8qKlxuICogRm9yIGNvbXBhdGliaWxpdHkgcmVhc29ucywgd2Uga2VlcCBhIG5ldyBvcGVyYXRvci4gVXNlIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIGNyZWF0ZU1vY2tWaWV3IGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjb25zdCBNb2NrVmlldzogbmV3ICgpID0+IE1vY2tWaWV3ID0gY3JlYXRlTW9ja1ZpZXcgYXMgYW55O1xuXG4vKipcbiAqIFV0aWxpdHkgdHlwZSB0byBtb2NrIGEgc2FwLmZlLmNvcmUuUGFnZUNvbnRyb2xsZXJcbiAqL1xuZXhwb3J0IHR5cGUgTW9ja0NvbnRyb2xsZXIgPSBXaXRoTW9jazxDb250cm9sbGVyPiAmIHtcblx0X3JvdXRpbmc6IFdpdGhNb2NrPEludGVybmFsUm91dGluZz47XG5cdF9lZGl0RmxvdzogV2l0aE1vY2s8SW50ZXJuYWxFZGl0Rmxvdz47XG5cdF9zaWRlRWZmZWN0czogV2l0aE1vY2s8U2lkZUVmZmVjdHM+O1xuXHRlZGl0RmxvdzogV2l0aE1vY2s8RWRpdEZsb3c+O1xufTtcbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgTW9ja0NvbnRyb2xsZXIuXG4gKlxuICogQHJldHVybnMgQSBuZXcgTW9ja0NvbnRyb2xsZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1vY2tDb250cm9sbGVyKCk6IE1vY2tDb250cm9sbGVyIHtcblx0Y29uc3QgbW9ja2VkID0gbW9jayhDb250cm9sbGVyKSBhcyBNb2NrQ29udHJvbGxlcjtcblx0bW9ja2VkLl9yb3V0aW5nID0gbW9jayhJbnRlcm5hbFJvdXRpbmcpO1xuXHRtb2NrZWQuX2VkaXRGbG93ID0gbW9jayhJbnRlcm5hbEVkaXRGbG93KTtcblx0bW9ja2VkLl9zaWRlRWZmZWN0cyA9IG1vY2soU2lkZUVmZmVjdHMpO1xuXHRtb2NrZWQuZWRpdEZsb3cgPSBtb2NrKEVkaXRGbG93KTtcblxuXHQvLyBEZWZhdWx0IEJlaGF2aW9yXG5cdG1vY2tlZC5tb2NrLmdldFZpZXcubW9ja1JldHVyblZhbHVlKGNyZWF0ZU1vY2tWaWV3KCkpO1xuXHRtb2NrZWQubW9jay5pc0EubW9ja1JldHVyblZhbHVlKGZhbHNlKTtcblxuXHRyZXR1cm4gbW9ja2VkO1xufVxuLyoqXG4gKiBGb3IgY29tcGF0aWJpbGl0eSByZWFzb25zLCB3ZSBrZWVwIGEgbmV3IG9wZXJhdG9yLiBVc2UgdGhlIGZhY3RvcnkgZnVuY3Rpb24gbW9ja0NvbnRyb2xsZXIgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1vY2tDb250cm9sbGVyOiBuZXcgKCkgPT4gTW9ja0NvbnRyb2xsZXIgPSBjcmVhdGVNb2NrQ29udHJvbGxlciBhcyBhbnk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTVZDTW9jayB7XG5cdG1vZGVsOiBNb2NrTW9kZWw7XG5cdHZpZXc6IE1vY2tWaWV3O1xuXHRjb250cm9sbGVyOiBNb2NrQ29udHJvbGxlcjtcbn1cbi8qKlxuICogR2VuZXJhdGUgbW9kZWwsIHZpZXcgYW5kIGNvbnRyb2xsZXIgbW9ja3MgdGhhdCByZWZlciB0byBlYWNoIG90aGVyLlxuICpcbiAqIEBwYXJhbSBleGlzdGluZyBPcHRpb25hbCBleGlzdGluZyBtb2NrZWQgaW5zdGFuY2VzIHRoYXQgc2hvdWxkIGJlIHVzZWRcbiAqIEByZXR1cm5zIE1vY2tlZCBtb2RlbCwgdmlldyBhbmQgY29udHJvbGxlciBpbnN0YW5jZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vY2tNVkMoZXhpc3Rpbmc/OiBQYXJ0aWFsPE1WQ01vY2s+KTogTVZDTW9jayB7XG5cdGNvbnN0IG1vZGVsID0gZXhpc3Rpbmc/Lm1vZGVsIHx8IGNyZWF0ZU1vY2tNb2RlbCgpO1xuXHRjb25zdCB2aWV3ID0gZXhpc3Rpbmc/LnZpZXcgfHwgY3JlYXRlTW9ja1ZpZXcoKTtcblx0Y29uc3QgY29udHJvbGxlciA9IGV4aXN0aW5nPy5jb250cm9sbGVyIHx8IGNyZWF0ZU1vY2tDb250cm9sbGVyKCk7XG5cblx0dmlldy5tb2NrLmdldENvbnRyb2xsZXIubW9ja1JldHVyblZhbHVlKGNvbnRyb2xsZXIpO1xuXHR2aWV3Lm1vY2suZ2V0TW9kZWwubW9ja1JldHVyblZhbHVlKG1vZGVsKTtcblx0Y29udHJvbGxlci5tb2NrLmdldFZpZXcubW9ja1JldHVyblZhbHVlKHZpZXcpO1xuXG5cdHJldHVy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