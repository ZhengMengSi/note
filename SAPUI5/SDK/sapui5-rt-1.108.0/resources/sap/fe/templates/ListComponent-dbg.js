/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport", "sap/fe/core/library", "sap/fe/core/TemplateComponent"], function (ClassSupport, CoreLibrary, TemplateComponent) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var property = ClassSupport.property;
  var defineUI5Class = ClassSupport.defineUI5Class;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var VariantManagement = CoreLibrary.VariantManagement,
      InitialLoadMode = CoreLibrary.InitialLoadMode;
  var ListBasedComponent = (_dec = defineUI5Class("sap.fe.templates.ListComponent", {
    manifest: {
      "sap.ui": {
        "technology": "UI5",
        "deviceTypes": {
          "desktop": true,
          "tablet": true,
          "phone": true
        },
        "supportedThemes": ["sap_fiori_3", "sap_hcb", "sap_bluecrystal", "sap_belize", "sap_belize_plus", "sap_belize_hcw"]
      },
      "sap.ui5": {
        "services": {
          "templatedViewService": {
            "factoryName": "sap.fe.core.services.TemplatedViewService",
            "startup": "waitFor",
            "settings": {
              "viewName": "sap.fe.templates.ListReport.ListReport",
              "converterType": "ListReport",
              "errorViewName": "sap.fe.core.services.view.TemplatingErrorPage"
            }
          },
          "asyncComponentService": {
            "factoryName": "sap.fe.core.services.AsyncComponentService",
            "startup": "waitFor"
          }
        },
        "commands": {
          "Create": {
            "name": "Create",
            "shortcut": "Ctrl+Enter"
          },
          "DeleteEntry": {
            "name": "DeleteEntry",
            "shortcut": "Ctrl+D"
          },
          "TableSettings": {
            "name": "TableSettings",
            "shortcut": "Ctrl+,"
          },
          "Share": {
            "name": "Share",
            "shortcut": "Shift+Ctrl+S"
          },
          "FE_FilterSearch": {
            "name": "FE_FilterSearch",
            "shortcut": "Ctrl+Enter"
          }
        },
        "handleValidation": true,
        "dependencies": {
          "minUI5Version": "${sap.ui5.core.version}",
          "libs": {
            "sap.f": {},
            "sap.fe.macros": {
              "lazy": true
            },
            "sap.m": {},
            "sap.suite.ui.microchart": {
              "lazy": true
            },
            "sap.ui.core": {},
            "sap.ui.layout": {},
            "sap.ui.mdc": {},
            "sap.ushell": {
              "lazy": true
            },
            "sap.ui.fl": {}
          }
        },
        "contentDensities": {
          "compact": true,
          "cozy": true
        }
      }
    },
    library: "sap.fe.templates"
  }), _dec2 = property({
    type: "sap.fe.core.InitialLoadMode",
    defaultValue: InitialLoadMode.Auto
  }), _dec3 = property({
    type: "sap.fe.core.VariantManagement",
    defaultValue: VariantManagement.Page
  }), _dec4 = property({
    type: "string",
    defaultValue: undefined
  }), _dec5 = property({
    type: "boolean",
    defaultValue: false
  }), _dec(_class = (_class2 = /*#__PURE__*/function (_TemplateComponent) {
    _inheritsLoose(ListBasedComponent, _TemplateComponent);

    function ListBasedComponent() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _TemplateComponent.call.apply(_TemplateComponent, [this].concat(args)) || this;

      _initializerDefineProperty(_this, "initialLoad", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "variantManagement", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "defaultTemplateAnnotationPath", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "liveMode", _descriptor4, _assertThisInitialized(_this));

      return _this;
    }

    return ListBasedComponent;
  }(TemplateComponent), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "initialLoad", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "variantManagement", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "defaultTemplateAnnotationPath", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "liveMode", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  })), _class2)) || _class);
  return ListBasedComponent;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJWYXJpYW50TWFuYWdlbWVudCIsIkNvcmVMaWJyYXJ5IiwiSW5pdGlhbExvYWRNb2RlIiwiTGlzdEJhc2VkQ29tcG9uZW50IiwiZGVmaW5lVUk1Q2xhc3MiLCJtYW5pZmVzdCIsImxpYnJhcnkiLCJwcm9wZXJ0eSIsInR5cGUiLCJkZWZhdWx0VmFsdWUiLCJBdXRvIiwiUGFnZSIsInVuZGVmaW5lZCIsIlRlbXBsYXRlQ29tcG9uZW50Il0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJMaXN0Q29tcG9uZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlZmluZVVJNUNsYXNzLCBwcm9wZXJ0eSB9IGZyb20gXCJzYXAvZmUvY29yZS9oZWxwZXJzL0NsYXNzU3VwcG9ydFwiO1xuaW1wb3J0IENvcmVMaWJyYXJ5IGZyb20gXCJzYXAvZmUvY29yZS9saWJyYXJ5XCI7XG5pbXBvcnQgVGVtcGxhdGVDb21wb25lbnQgZnJvbSBcInNhcC9mZS9jb3JlL1RlbXBsYXRlQ29tcG9uZW50XCI7XG5jb25zdCBWYXJpYW50TWFuYWdlbWVudCA9IENvcmVMaWJyYXJ5LlZhcmlhbnRNYW5hZ2VtZW50LFxuXHRJbml0aWFsTG9hZE1vZGUgPSBDb3JlTGlicmFyeS5Jbml0aWFsTG9hZE1vZGU7XG5cbkBkZWZpbmVVSTVDbGFzcyhcInNhcC5mZS50ZW1wbGF0ZXMuTGlzdENvbXBvbmVudFwiLCB7XG5cdG1hbmlmZXN0OiB7XG5cdFx0XCJzYXAudWlcIjoge1xuXHRcdFx0XCJ0ZWNobm9sb2d5XCI6IFwiVUk1XCIsXG5cdFx0XHRcImRldmljZVR5cGVzXCI6IHtcblx0XHRcdFx0XCJkZXNrdG9wXCI6IHRydWUsXG5cdFx0XHRcdFwidGFibGV0XCI6IHRydWUsXG5cdFx0XHRcdFwicGhvbmVcIjogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdFwic3VwcG9ydGVkVGhlbWVzXCI6IFtcInNhcF9maW9yaV8zXCIsIFwic2FwX2hjYlwiLCBcInNhcF9ibHVlY3J5c3RhbFwiLCBcInNhcF9iZWxpemVcIiwgXCJzYXBfYmVsaXplX3BsdXNcIiwgXCJzYXBfYmVsaXplX2hjd1wiXVxuXHRcdH0sXG5cdFx0XCJzYXAudWk1XCI6IHtcblx0XHRcdFwic2VydmljZXNcIjoge1xuXHRcdFx0XHRcInRlbXBsYXRlZFZpZXdTZXJ2aWNlXCI6IHtcblx0XHRcdFx0XHRcImZhY3RvcnlOYW1lXCI6IFwic2FwLmZlLmNvcmUuc2VydmljZXMuVGVtcGxhdGVkVmlld1NlcnZpY2VcIixcblx0XHRcdFx0XHRcInN0YXJ0dXBcIjogXCJ3YWl0Rm9yXCIsXG5cdFx0XHRcdFx0XCJzZXR0aW5nc1wiOiB7XG5cdFx0XHRcdFx0XHRcInZpZXdOYW1lXCI6IFwic2FwLmZlLnRlbXBsYXRlcy5MaXN0UmVwb3J0Lkxpc3RSZXBvcnRcIixcblx0XHRcdFx0XHRcdFwiY29udmVydGVyVHlwZVwiOiBcIkxpc3RSZXBvcnRcIixcblx0XHRcdFx0XHRcdFwiZXJyb3JWaWV3TmFtZVwiOiBcInNhcC5mZS5jb3JlLnNlcnZpY2VzLnZpZXcuVGVtcGxhdGluZ0Vycm9yUGFnZVwiXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcImFzeW5jQ29tcG9uZW50U2VydmljZVwiOiB7XG5cdFx0XHRcdFx0XCJmYWN0b3J5TmFtZVwiOiBcInNhcC5mZS5jb3JlLnNlcnZpY2VzLkFzeW5jQ29tcG9uZW50U2VydmljZVwiLFxuXHRcdFx0XHRcdFwic3RhcnR1cFwiOiBcIndhaXRGb3JcIlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJjb21tYW5kc1wiOiB7XG5cdFx0XHRcdFwiQ3JlYXRlXCI6IHtcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJDcmVhdGVcIixcblx0XHRcdFx0XHRcInNob3J0Y3V0XCI6IFwiQ3RybCtFbnRlclwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwiRGVsZXRlRW50cnlcIjoge1xuXHRcdFx0XHRcdFwibmFtZVwiOiBcIkRlbGV0ZUVudHJ5XCIsXG5cdFx0XHRcdFx0XCJzaG9ydGN1dFwiOiBcIkN0cmwrRFwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdFwiVGFibGVTZXR0aW5nc1wiOiB7XG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwiVGFibGVTZXR0aW5nc1wiLFxuXHRcdFx0XHRcdFwic2hvcnRjdXRcIjogXCJDdHJsKyxcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcIlNoYXJlXCI6IHtcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJTaGFyZVwiLFxuXHRcdFx0XHRcdFwic2hvcnRjdXRcIjogXCJTaGlmdCtDdHJsK1NcIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHRcIkZFX0ZpbHRlclNlYXJjaFwiOiB7XG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwiRkVfRmlsdGVyU2VhcmNoXCIsXG5cdFx0XHRcdFx0XCJzaG9ydGN1dFwiOiBcIkN0cmwrRW50ZXJcIlxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0XCJoYW5kbGVWYWxpZGF0aW9uXCI6IHRydWUsXG5cdFx0XHRcImRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XHRcdFwibWluVUk1VmVyc2lvblwiOiBcIiR7c2FwLnVpNS5jb3JlLnZlcnNpb259XCIsXG5cdFx0XHRcdFwibGlic1wiOiB7XG5cdFx0XHRcdFx0XCJzYXAuZlwiOiB7fSxcblx0XHRcdFx0XHRcInNhcC5mZS5tYWNyb3NcIjoge1xuXHRcdFx0XHRcdFx0XCJsYXp5XCI6IHRydWVcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFwic2FwLm1cIjoge30sXG5cdFx0XHRcdFx0XCJzYXAuc3VpdGUudWkubWljcm9jaGFydFwiOiB7XG5cdFx0XHRcdFx0XHRcImxhenlcIjogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJzYXAudWkuY29yZVwiOiB7fSxcblx0XHRcdFx0XHRcInNhcC51aS5sYXlvdXRcIjoge30sXG5cdFx0XHRcdFx0XCJzYXAudWkubWRjXCI6IHt9LFxuXHRcdFx0XHRcdFwic2FwLnVzaGVsbFwiOiB7XG5cdFx0XHRcdFx0XHRcImxhenlcIjogdHJ1ZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XCJzYXAudWkuZmxcIjoge31cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwiY29udGVudERlbnNpdGllc1wiOiB7XG5cdFx0XHRcdFwiY29tcGFjdFwiOiB0cnVlLFxuXHRcdFx0XHRcImNvenlcIjogdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0bGlicmFyeTogXCJzYXAuZmUudGVtcGxhdGVzXCJcbn0pXG5jbGFzcyBMaXN0QmFzZWRDb21wb25lbnQgZXh0ZW5kcyBUZW1wbGF0ZUNvbXBvbmVudCB7XG5cdEBwcm9wZXJ0eSh7XG5cdFx0dHlwZTogXCJzYXAuZmUuY29yZS5Jbml0aWFsTG9hZE1vZGVcIixcblx0XHRkZWZhdWx0VmFsdWU6IEluaXRpYWxMb2FkTW9kZS5BdXRvXG5cdH0pXG5cdGluaXRpYWxMb2FkITogdHlwZW9mIEluaXRpYWxMb2FkTW9kZTtcblxuXHRAcHJvcGVydHkoe1xuXHRcdHR5cGU6IFwic2FwLmZlLmNvcmUuVmFyaWFudE1hbmFnZW1lbnRcIixcblx0XHRkZWZhdWx0VmFsdWU6IFZhcmlhbnRNYW5hZ2VtZW50LlBhZ2Vcblx0fSlcblx0dmFyaWFudE1hbmFnZW1lbnQhOiB0eXBlb2YgVmFyaWFudE1hbmFnZW1lbnQ7XG5cdEBwcm9wZXJ0eSh7XG5cdFx0dHlwZTogXCJzdHJpbmdcIixcblx0XHRkZWZhdWx0VmFsdWU6IHVuZGVmaW5lZFxuXHR9KVxuXHRkZWZhdWx0VGVtcGxhdGVBbm5vdGF0aW9uUGF0aCE6IHN0cmluZztcblx0QHByb3BlcnR5KHtcblx0XHR0eXBlOiBcImJvb2xlYW5cIixcblx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlXG5cdH0pXG5cdGxpdmVNb2RlITogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdEJhc2VkQ29tcG9uZW50O1xuIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFHQSxJQUFNQSxpQkFBaUIsR0FBR0MsV0FBVyxDQUFDRCxpQkFBdEM7RUFBQSxJQUNDRSxlQUFlLEdBQUdELFdBQVcsQ0FBQ0MsZUFEL0I7TUFpRk1DLGtCLFdBOUVMQyxjQUFjLENBQUMsZ0NBQUQsRUFBbUM7SUFDakRDLFFBQVEsRUFBRTtNQUNULFVBQVU7UUFDVCxjQUFjLEtBREw7UUFFVCxlQUFlO1VBQ2QsV0FBVyxJQURHO1VBRWQsVUFBVSxJQUZJO1VBR2QsU0FBUztRQUhLLENBRk47UUFPVCxtQkFBbUIsQ0FBQyxhQUFELEVBQWdCLFNBQWhCLEVBQTJCLGlCQUEzQixFQUE4QyxZQUE5QyxFQUE0RCxpQkFBNUQsRUFBK0UsZ0JBQS9FO01BUFYsQ0FERDtNQVVULFdBQVc7UUFDVixZQUFZO1VBQ1gsd0JBQXdCO1lBQ3ZCLGVBQWUsMkNBRFE7WUFFdkIsV0FBVyxTQUZZO1lBR3ZCLFlBQVk7Y0FDWCxZQUFZLHdDQUREO2NBRVgsaUJBQWlCLFlBRk47Y0FHWCxpQkFBaUI7WUFITjtVQUhXLENBRGI7VUFVWCx5QkFBeUI7WUFDeEIsZUFBZSw0Q0FEUztZQUV4QixXQUFXO1VBRmE7UUFWZCxDQURGO1FBZ0JWLFlBQVk7VUFDWCxVQUFVO1lBQ1QsUUFBUSxRQURDO1lBRVQsWUFBWTtVQUZILENBREM7VUFLWCxlQUFlO1lBQ2QsUUFBUSxhQURNO1lBRWQsWUFBWTtVQUZFLENBTEo7VUFTWCxpQkFBaUI7WUFDaEIsUUFBUSxlQURRO1lBRWhCLFlBQVk7VUFGSSxDQVROO1VBYVgsU0FBUztZQUNSLFFBQVEsT0FEQTtZQUVSLFlBQVk7VUFGSixDQWJFO1VBaUJYLG1CQUFtQjtZQUNsQixRQUFRLGlCQURVO1lBRWxCLFlBQVk7VUFGTTtRQWpCUixDQWhCRjtRQXNDVixvQkFBb0IsSUF0Q1Y7UUF1Q1YsZ0JBQWdCO1VBQ2YsaUJBQWlCLHlCQURGO1VBRWYsUUFBUTtZQUNQLFNBQVMsRUFERjtZQUVQLGlCQUFpQjtjQUNoQixRQUFRO1lBRFEsQ0FGVjtZQUtQLFNBQVMsRUFMRjtZQU1QLDJCQUEyQjtjQUMxQixRQUFRO1lBRGtCLENBTnBCO1lBU1AsZUFBZSxFQVRSO1lBVVAsaUJBQWlCLEVBVlY7WUFXUCxjQUFjLEVBWFA7WUFZUCxjQUFjO2NBQ2IsUUFBUTtZQURLLENBWlA7WUFlUCxhQUFhO1VBZk47UUFGTyxDQXZDTjtRQTJEVixvQkFBb0I7VUFDbkIsV0FBVyxJQURRO1VBRW5CLFFBQVE7UUFGVztNQTNEVjtJQVZGLENBRHVDO0lBNEVqREMsT0FBTyxFQUFFO0VBNUV3QyxDQUFuQyxDLFVBK0ViQyxRQUFRLENBQUM7SUFDVEMsSUFBSSxFQUFFLDZCQURHO0lBRVRDLFlBQVksRUFBRVAsZUFBZSxDQUFDUTtFQUZyQixDQUFELEMsVUFNUkgsUUFBUSxDQUFDO0lBQ1RDLElBQUksRUFBRSwrQkFERztJQUVUQyxZQUFZLEVBQUVULGlCQUFpQixDQUFDVztFQUZ2QixDQUFELEMsVUFLUkosUUFBUSxDQUFDO0lBQ1RDLElBQUksRUFBRSxRQURHO0lBRVRDLFlBQVksRUFBRUc7RUFGTCxDQUFELEMsVUFLUkwsUUFBUSxDQUFDO0lBQ1RDLElBQUksRUFBRSxTQURHO0lBRVRDLFlBQVksRUFBRTtFQUZMLENBQUQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBakJ1QkksaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQXdCbEJWLGtCIn0=