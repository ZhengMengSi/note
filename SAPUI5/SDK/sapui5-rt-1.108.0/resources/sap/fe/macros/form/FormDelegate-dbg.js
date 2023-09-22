/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/CommonHelper", "sap/fe/macros/DelegateUtil", "sap/ui/model/json/JSONModel", "sap/ui/model/ListBinding"], function (Common, DelegateUtil, JSONModel, ListBinding) {
  "use strict";

  var Delegate = {
    /**
     * @param mPropertyBag Object with parameters as properties
     * @param mPropertyBag.modifier Modifier to harmonize access, creation and manipulation to controls in XML Views and JS Controls
     * @param [mPropertyBag.appComponent] Needed to calculate the correct ID in case you provide an selector
     * @param [mPropertyBag.view] XML node of the view, required for XML case to create nodes and to find elements
     * @param [mPropertyBag.fieldSelector] Selector to calculate the ID for the control that is created
     * @param mPropertyBag.bindingPath Runtime binding path the control should be bound to
     * @param mPropertyBag.payload Payload parameter attached to the delegate, undefined if no payload was assigned
     * @param mPropertyBag.controlType Control type of the element the delegate is attached to
     * @param mPropertyBag.aggregationName Name of the aggregation the delegate should provide additional elements
     * @param mPropertyBag.element
     * @param mPropertyBag.parentSelector
     * @returns Map containing the controls to add
     */
    createLayout: function (mPropertyBag) {
      try {
        var oModifier = mPropertyBag.modifier,
            oMetaModel = mPropertyBag.appComponent && mPropertyBag.appComponent.getModel().getMetaModel(),
            oForm = mPropertyBag.element;
        return Promise.resolve(DelegateUtil.getCustomData(oForm, "entitySet", oModifier)).then(function (sEntitySet) {
          function _temp4() {
            var sPath = sEntitySet.startsWith("/") ? "".concat(sEntitySet) : "/".concat(sEntitySet);
            var oFormContainer = mPropertyBag.parentSelector ? mPropertyBag.modifier.bySelector(mPropertyBag.parentSelector, mPropertyBag.appComponent, mPropertyBag.view) : undefined;
            return Promise.resolve(DelegateUtil.getCustomData(oFormContainer, "navigationPath", oModifier)).then(function (sNavigationPath) {
              var fnTemplateFormElement = function (sFragmentName, oView, navigationPath) {
                try {
                  return Promise.resolve(DelegateUtil.getCustomData(oForm, "onChange", oModifier)).then(function (sOnChangeCustomData) {
                    return Promise.resolve(DelegateUtil.getCustomData(oForm, "displayMode", oModifier)).then(function (sDisplayModeCustomData) {
                      var _mPropertyBag$fieldSe2;

                      var oThis = new JSONModel({
                        // properties and events of Field macro
                        _flexId: (_mPropertyBag$fieldSe2 = mPropertyBag.fieldSelector) === null || _mPropertyBag$fieldSe2 === void 0 ? void 0 : _mPropertyBag$fieldSe2.id,
                        onChange: Common.removeEscapeCharacters(sOnChangeCustomData),
                        displayMode: Common.removeEscapeCharacters(sDisplayModeCustomData),
                        navigationPath: navigationPath
                      });
                      var oPreprocessorSettings = {
                        bindingContexts: {
                          "entitySet": oMetaModelContext,
                          "dataField": oPropertyContext,
                          "this": oThis.createBindingContext("/")
                        },
                        models: {
                          "this": oThis,
                          "entitySet": oMetaModel,
                          metaModel: oMetaModel,
                          "dataField": oMetaModel
                        }
                      };
                      return DelegateUtil.templateControlFragment(sFragmentName, oPreprocessorSettings, {
                        view: oView
                      }, oModifier);
                    });
                  });
                } catch (e) {
                  return Promise.reject(e);
                }
              };

              var sBindingPath = sNavigationPath ? "".concat(sPath, "/").concat(sNavigationPath) : sPath;
              var oMetaModelContext = oMetaModel.getMetaContext(sBindingPath);
              var oPropertyContext = oMetaModel.createBindingContext("".concat(sBindingPath, "/").concat(mPropertyBag.bindingPath));
              var sFormId = mPropertyBag.element.sId || mPropertyBag.element.id;

              function fnTemplateValueHelp(sFragmentName) {
                var _mPropertyBag$fieldSe;

                var oThis = new JSONModel({
                  id: sFormId,
                  idPrefix: (_mPropertyBag$fieldSe = mPropertyBag.fieldSelector) === null || _mPropertyBag$fieldSe === void 0 ? void 0 : _mPropertyBag$fieldSe.id
                }),
                    oPreprocessorSettings = {
                  bindingContexts: {
                    "entitySet": oMetaModelContext,
                    "property": oPropertyContext,
                    "this": oThis.createBindingContext("/")
                  },
                  models: {
                    "this": oThis,
                    "entitySet": oMetaModel,
                    metaModel: oMetaModel,
                    "property": oMetaModel
                  }
                };
                return DelegateUtil.templateControlFragment(sFragmentName, oPreprocessorSettings, {}, oModifier);
              }

              var oParameters = {
                sPropertyName: mPropertyBag.bindingPath,
                sBindingPath: sBindingPath,
                sValueHelpType: "FormVH",
                oControl: oForm,
                oMetaModel: oMetaModel,
                oModifier: oModifier
              };
              return Promise.resolve(DelegateUtil.isValueHelpRequired(oParameters)).then(function (bValueHelpRequired) {
                return Promise.resolve(DelegateUtil.doesValueHelpExist(oParameters)).then(function (bValueHelpExists) {
                  function _temp2() {
                    return Promise.resolve(fnTemplateFormElement("sap.fe.macros.form.FormElementFlexibility", mPropertyBag.view, sNavigationPath)).then(function (oField) {
                      return {
                        control: oField,
                        valueHelp: oValueHelp
                      };
                    });
                  }

                  var oValueHelp;

                  var _temp = function () {
                    if (bValueHelpRequired && !bValueHelpExists) {
                      return Promise.resolve(fnTemplateValueHelp("sap.fe.macros.form.ValueHelpWrapper")).then(function (_fnTemplateValueHelp) {
                        oValueHelp = _fnTemplateValueHelp;
                      });
                    }
                  }();

                  return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
                });
              });
            });
          }

          var _temp3 = function () {
            if (!sEntitySet) {
              return Promise.resolve(DelegateUtil.getCustomData(oForm, "navigationPath", oModifier)).then(function (_DelegateUtil$getCust) {
                sEntitySet = _DelegateUtil$getCust;
              });
            }
          }();

          return _temp3 && _temp3.then ? _temp3.then(_temp4) : _temp4(_temp3);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // getPropertyInfo is a patched version of ODataV4ReadDelegates to dela with navigationPath
    getPropertyInfo: function (mPropertyBag) {
      function _isComplexType(mProperty) {
        if (mProperty && mProperty.$Type) {
          if (mProperty.$Type.toLowerCase().indexOf("edm") !== 0) {
            return true;
          }
        }

        return false;
      } //Check if a given property path starts with a navigation property.


      function _startsWithNavigationProperty(sPropertyPath, aNavigationProperties) {
        return aNavigationProperties.some(function (sNavProp) {
          return sPropertyPath.startsWith(sNavProp);
        });
      }

      function _enrichProperty(sPropertyPath, mElement, mPropertyAnnotations, sEntityType, oElement, sAggregationName, aNavigationProperties) {
        var mProp = {
          name: sPropertyPath,
          bindingPath: sPropertyPath,
          entityType: sEntityType
        }; // get label information, either via DataFieldDefault annotation (if exists) or Label annotation

        var mDataFieldDefaultAnnotation = mPropertyAnnotations["@com.sap.vocabularies.UI.v1.DataFieldDefault"];
        var sLabel = mDataFieldDefaultAnnotation && mDataFieldDefaultAnnotation.Label || mPropertyAnnotations["@com.sap.vocabularies.Common.v1.Label"];
        mProp.label = sLabel || "[LABEL_MISSING: " + sPropertyPath + "]"; // evaluate Hidden annotation

        var mHiddenAnnotation = mPropertyAnnotations["@com.sap.vocabularies.UI.v1.Hidden"];
        mProp.hideFromReveal = mHiddenAnnotation;

        if (mHiddenAnnotation && mHiddenAnnotation.$Path) {
          var _oElement$getBindingC;

          mProp.hideFromReveal = (_oElement$getBindingC = oElement.getBindingContext()) === null || _oElement$getBindingC === void 0 ? void 0 : _oElement$getBindingC.getProperty(mHiddenAnnotation.$Path);
        } // evaluate FieldControl annotation


        var mFieldControlAnnotation;

        if (!mProp.hideFromReveal) {
          mFieldControlAnnotation = mPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];

          if (mFieldControlAnnotation) {
            mProp.hideFromReveal = mFieldControlAnnotation.$EnumMember === "com.sap.vocabularies.Common.v1.FieldControlType/Hidden";
          }
        } // @runtime hidden by field control value = 0


        mFieldControlAnnotation = mPropertyAnnotations["@com.sap.vocabularies.Common.v1.FieldControl"];
        var sFieldControlPath = mFieldControlAnnotation && mFieldControlAnnotation.Path;

        if (sFieldControlPath && !mProp.hideFromReveal) {
          // if the binding is a list binding, skip the check for field control
          var bListBinding = oElement.getBinding(sAggregationName) instanceof ListBinding;

          if (!bListBinding) {
            var _oElement$getBindingC2;

            var iFieldControlValue = (_oElement$getBindingC2 = oElement.getBindingContext()) === null || _oElement$getBindingC2 === void 0 ? void 0 : _oElement$getBindingC2.getProperty(sFieldControlPath);
            mProp.hideFromReveal = iFieldControlValue === 0;
          }
        } // no support for DataFieldFor/WithAction and DataFieldFor/WithIntentBasedNavigation within DataFieldDefault annotation


        if (mDataFieldDefaultAnnotation && (mDataFieldDefaultAnnotation.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" || mDataFieldDefaultAnnotation.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" || mDataFieldDefaultAnnotation.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithAction" || mDataFieldDefaultAnnotation.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation")) {
          mProp.unsupported = true;
        } // no support for navigation properties and complex properties


        if (_startsWithNavigationProperty(sPropertyPath, aNavigationProperties) || _isComplexType(mElement)) {
          mProp.unsupported = true;
        }

        return mProp;
      } // Convert metadata format to delegate format.


      function _convertMetadataToDelegateFormat(mODataEntityType, sEntityType, oMetaModel, oElement, sAggregationName) {
        var aProperties = [];
        var sElementName = "";
        var aNavigationProperties = [];
        var mElement;

        for (sElementName in mODataEntityType) {
          mElement = mODataEntityType[sElementName];

          if (mElement.$kind === "NavigationProperty") {
            aNavigationProperties.push(sElementName);
          }
        }

        for (sElementName in mODataEntityType) {
          mElement = mODataEntityType[sElementName];

          if (mElement.$kind === "Property") {
            var mPropAnnotations = oMetaModel.getObject("/" + sEntityType + "/" + sElementName + "@");

            var mProp = _enrichProperty(sElementName, mElement, mPropAnnotations, sEntityType, oElement, sAggregationName, aNavigationProperties);

            aProperties.push(mProp);
          }
        }

        return aProperties;
      } //Get binding path either from payload (if available) or the element's binding context.


      function _getBindingPath(oElement, mPayload) {
        if (mPayload.path) {
          return mPayload.path;
        }

        var vBinding = oElement.getBindingContext();

        if (vBinding) {
          if (oElement.data("navigationPath")) {
            return vBinding.getPath() + "/" + oElement.data("navigationPath");
          }

          return vBinding.getPath();
        }
      } //Get all properties of the element's model.


      function _getODataPropertiesOfModel(oElement, sAggregationName, mPayload) {
        var oModel = oElement.getModel(mPayload.modelName);

        if (oModel) {
          if (oModel.isA("sap.ui.model.odata.v4.ODataModel")) {
            var oMetaModel = oModel.getMetaModel();

            var sBindingContextPath = _getBindingPath(oElement, mPayload);

            if (sBindingContextPath) {
              var oMetaModelContext = oMetaModel.getMetaContext(sBindingContextPath);
              var oMetaModelContextObject = oMetaModelContext.getObject();
              var mODataEntityType = oMetaModelContext.getObject(oMetaModelContextObject.$Type);
              return _convertMetadataToDelegateFormat(mODataEntityType, oMetaModelContextObject.$Type, oMetaModel, oElement, sAggregationName);
            }
          }
        }

        return Promise.resolve([]);
      }

      return Promise.resolve().then(function () {
        return _getODataPropertiesOfModel(mPropertyBag.element, mPropertyBag.aggregationName, mPropertyBag.payload);
      });
    }
  };
  return Delegate;
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEZWxlZ2F0ZSIsImNyZWF0ZUxheW91dCIsIm1Qcm9wZXJ0eUJhZyIsIm9Nb2RpZmllciIsIm1vZGlmaWVyIiwib01ldGFNb2RlbCIsImFwcENvbXBvbmVudCIsImdldE1vZGVsIiwiZ2V0TWV0YU1vZGVsIiwib0Zvcm0iLCJlbGVtZW50IiwiRGVsZWdhdGVVdGlsIiwiZ2V0Q3VzdG9tRGF0YSIsInNFbnRpdHlTZXQiLCJzUGF0aCIsInN0YXJ0c1dpdGgiLCJvRm9ybUNvbnRhaW5lciIsInBhcmVudFNlbGVjdG9yIiwiYnlTZWxlY3RvciIsInZpZXciLCJ1bmRlZmluZWQiLCJzTmF2aWdhdGlvblBhdGgiLCJmblRlbXBsYXRlRm9ybUVsZW1lbnQiLCJzRnJhZ21lbnROYW1lIiwib1ZpZXciLCJuYXZpZ2F0aW9uUGF0aCIsInNPbkNoYW5nZUN1c3RvbURhdGEiLCJzRGlzcGxheU1vZGVDdXN0b21EYXRhIiwib1RoaXMiLCJKU09OTW9kZWwiLCJfZmxleElkIiwiZmllbGRTZWxlY3RvciIsImlkIiwib25DaGFuZ2UiLCJDb21tb24iLCJyZW1vdmVFc2NhcGVDaGFyYWN0ZXJzIiwiZGlzcGxheU1vZGUiLCJvUHJlcHJvY2Vzc29yU2V0dGluZ3MiLCJiaW5kaW5nQ29udGV4dHMiLCJvTWV0YU1vZGVsQ29udGV4dCIsIm9Qcm9wZXJ0eUNvbnRleHQiLCJjcmVhdGVCaW5kaW5nQ29udGV4dCIsIm1vZGVscyIsIm1ldGFNb2RlbCIsInRlbXBsYXRlQ29udHJvbEZyYWdtZW50Iiwic0JpbmRpbmdQYXRoIiwiZ2V0TWV0YUNvbnRleHQiLCJiaW5kaW5nUGF0aCIsInNGb3JtSWQiLCJzSWQiLCJmblRlbXBsYXRlVmFsdWVIZWxwIiwiaWRQcmVmaXgiLCJvUGFyYW1ldGVycyIsInNQcm9wZXJ0eU5hbWUiLCJzVmFsdWVIZWxwVHlwZSIsIm9Db250cm9sIiwiaXNWYWx1ZUhlbHBSZXF1aXJlZCIsImJWYWx1ZUhlbHBSZXF1aXJlZCIsImRvZXNWYWx1ZUhlbHBFeGlzdCIsImJWYWx1ZUhlbHBFeGlzdHMiLCJvRmllbGQiLCJjb250cm9sIiwidmFsdWVIZWxwIiwib1ZhbHVlSGVscCIsImdldFByb3BlcnR5SW5mbyIsIl9pc0NvbXBsZXhUeXBlIiwibVByb3BlcnR5IiwiJFR5cGUiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJfc3RhcnRzV2l0aE5hdmlnYXRpb25Qcm9wZXJ0eSIsInNQcm9wZXJ0eVBhdGgiLCJhTmF2aWdhdGlvblByb3BlcnRpZXMiLCJzb21lIiwic05hdlByb3AiLCJfZW5yaWNoUHJvcGVydHkiLCJtRWxlbWVudCIsIm1Qcm9wZXJ0eUFubm90YXRpb25zIiwic0VudGl0eVR5cGUiLCJvRWxlbWVudCIsInNBZ2dyZWdhdGlvbk5hbWUiLCJtUHJvcCIsIm5hbWUiLCJlbnRpdHlUeXBlIiwibURhdGFGaWVsZERlZmF1bHRBbm5vdGF0aW9uIiwic0xhYmVsIiwiTGFiZWwiLCJsYWJlbCIsIm1IaWRkZW5Bbm5vdGF0aW9uIiwiaGlkZUZyb21SZXZlYWwiLCIkUGF0aCIsImdldEJpbmRpbmdDb250ZXh0IiwiZ2V0UHJvcGVydHkiLCJtRmllbGRDb250cm9sQW5ub3RhdGlvbiIsIiRFbnVtTWVtYmVyIiwic0ZpZWxkQ29udHJvbFBhdGgiLCJQYXRoIiwiYkxpc3RCaW5kaW5nIiwiZ2V0QmluZGluZyIsIkxpc3RCaW5kaW5nIiwiaUZpZWxkQ29udHJvbFZhbHVlIiwidW5zdXBwb3J0ZWQiLCJfY29udmVydE1ldGFkYXRhVG9EZWxlZ2F0ZUZvcm1hdCIsIm1PRGF0YUVudGl0eVR5cGUiLCJhUHJvcGVydGllcyIsInNFbGVtZW50TmFtZSIsIiRraW5kIiwicHVzaCIsIm1Qcm9wQW5ub3RhdGlvbnMiLCJnZXRPYmplY3QiLCJfZ2V0QmluZGluZ1BhdGgiLCJtUGF5bG9hZCIsInBhdGgiLCJ2QmluZGluZyIsImRhdGEiLCJnZXRQYXRoIiwiX2dldE9EYXRhUHJvcGVydGllc09mTW9kZWwiLCJvTW9kZWwiLCJtb2RlbE5hbWUiLCJpc0EiLCJzQmluZGluZ0NvbnRleHRQYXRoIiwib01ldGFNb2RlbENvbnRleHRPYmplY3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJhZ2dyZWdhdGlvbk5hbWUiLCJwYXlsb2FkIl0sInNvdXJjZVJvb3QiOiIuIiwic291cmNlcyI6WyJGb3JtRGVsZWdhdGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbW1vbiBmcm9tIFwic2FwL2ZlL21hY3Jvcy9Db21tb25IZWxwZXJcIjtcbmltcG9ydCBEZWxlZ2F0ZVV0aWwgZnJvbSBcInNhcC9mZS9tYWNyb3MvRGVsZWdhdGVVdGlsXCI7XG5pbXBvcnQgQ29udHJvbCBmcm9tIFwic2FwL3VpL2NvcmUvQ29udHJvbFwiO1xuaW1wb3J0IHR5cGUgQ29udGV4dCBmcm9tIFwic2FwL3VpL21vZGVsL0NvbnRleHRcIjtcbmltcG9ydCBKU09OTW9kZWwgZnJvbSBcInNhcC91aS9tb2RlbC9qc29uL0pTT05Nb2RlbFwiO1xuaW1wb3J0IExpc3RCaW5kaW5nIGZyb20gXCJzYXAvdWkvbW9kZWwvTGlzdEJpbmRpbmdcIjtcbmltcG9ydCBPRGF0YU1ldGFNb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL29kYXRhL3Y0L09EYXRhTWV0YU1vZGVsXCI7XG50eXBlIERlbGVnYXRlUHJvcGVydHkgPSB7XG5cdG5hbWU6IHN0cmluZztcblx0YmluZGluZ1BhdGg6IHN0cmluZztcblx0ZW50aXR5VHlwZTogc3RyaW5nO1xuXHRsYWJlbD86IHN0cmluZztcblx0aGlkZUZyb21SZXZlYWw/OiBhbnk7XG5cdHVuc3VwcG9ydGVkPzogYm9vbGVhbjtcbn07XG5cbmNvbnN0IERlbGVnYXRlID0ge1xuXHQvKipcblx0ICogQHBhcmFtIG1Qcm9wZXJ0eUJhZyBPYmplY3Qgd2l0aCBwYXJhbWV0ZXJzIGFzIHByb3BlcnRpZXNcblx0ICogQHBhcmFtIG1Qcm9wZXJ0eUJhZy5tb2RpZmllciBNb2RpZmllciB0byBoYXJtb25pemUgYWNjZXNzLCBjcmVhdGlvbiBhbmQgbWFuaXB1bGF0aW9uIHRvIGNvbnRyb2xzIGluIFhNTCBWaWV3cyBhbmQgSlMgQ29udHJvbHNcblx0ICogQHBhcmFtIFttUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50XSBOZWVkZWQgdG8gY2FsY3VsYXRlIHRoZSBjb3JyZWN0IElEIGluIGNhc2UgeW91IHByb3ZpZGUgYW4gc2VsZWN0b3Jcblx0ICogQHBhcmFtIFttUHJvcGVydHlCYWcudmlld10gWE1MIG5vZGUgb2YgdGhlIHZpZXcsIHJlcXVpcmVkIGZvciBYTUwgY2FzZSB0byBjcmVhdGUgbm9kZXMgYW5kIHRvIGZpbmQgZWxlbWVudHNcblx0ICogQHBhcmFtIFttUHJvcGVydHlCYWcuZmllbGRTZWxlY3Rvcl0gU2VsZWN0b3IgdG8gY2FsY3VsYXRlIHRoZSBJRCBmb3IgdGhlIGNvbnRyb2wgdGhhdCBpcyBjcmVhdGVkXG5cdCAqIEBwYXJhbSBtUHJvcGVydHlCYWcuYmluZGluZ1BhdGggUnVudGltZSBiaW5kaW5nIHBhdGggdGhlIGNvbnRyb2wgc2hvdWxkIGJlIGJvdW5kIHRvXG5cdCAqIEBwYXJhbSBtUHJvcGVydHlCYWcucGF5bG9hZCBQYXlsb2FkIHBhcmFtZXRlciBhdHRhY2hlZCB0byB0aGUgZGVsZWdhdGUsIHVuZGVmaW5lZCBpZiBubyBwYXlsb2FkIHdhcyBhc3NpZ25lZFxuXHQgKiBAcGFyYW0gbVByb3BlcnR5QmFnLmNvbnRyb2xUeXBlIENvbnRyb2wgdHlwZSBvZiB0aGUgZWxlbWVudCB0aGUgZGVsZWdhdGUgaXMgYXR0YWNoZWQgdG9cblx0ICogQHBhcmFtIG1Qcm9wZXJ0eUJhZy5hZ2dyZWdhdGlvbk5hbWUgTmFtZSBvZiB0aGUgYWdncmVnYXRpb24gdGhlIGRlbGVnYXRlIHNob3VsZCBwcm92aWRlIGFkZGl0aW9uYWwgZWxlbWVudHNcblx0ICogQHBhcmFtIG1Qcm9wZXJ0eUJhZy5lbGVtZW50XG5cdCAqIEBwYXJhbSBtUHJvcGVydHlCYWcucGFyZW50U2VsZWN0b3Jcblx0ICogQHJldHVybnMgTWFwIGNvbnRhaW5pbmcgdGhlIGNvbnRyb2xzIHRvIGFkZFxuXHQgKi9cblx0Y3JlYXRlTGF5b3V0OiBhc3luYyBmdW5jdGlvbiAobVByb3BlcnR5QmFnOiB7XG5cdFx0bW9kaWZpZXI6IGFueTtcblx0XHRhcHBDb21wb25lbnQ/OiBhbnk7XG5cdFx0dmlldz86IEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cdFx0ZmllbGRTZWxlY3Rvcj86IHsgaWQ/OiBzdHJpbmc7IGlzTG9jYWxJZD86IGJvb2xlYW4gfSB8IHVuZGVmaW5lZDtcblx0XHRiaW5kaW5nUGF0aDogc3RyaW5nO1xuXHRcdHBheWxvYWQ6IG9iamVjdDtcblx0XHRjb250cm9sVHlwZTogc3RyaW5nO1xuXHRcdGFnZ3JlZ2F0aW9uTmFtZTogc3RyaW5nO1xuXHRcdGVsZW1lbnQ/OiBhbnk7XG5cdFx0cGFyZW50U2VsZWN0b3I/OiBhbnk7XG5cdH0pIHtcblx0XHRjb25zdCBvTW9kaWZpZXIgPSBtUHJvcGVydHlCYWcubW9kaWZpZXIsXG5cdFx0XHRvTWV0YU1vZGVsID0gbVByb3BlcnR5QmFnLmFwcENvbXBvbmVudCAmJiBtUHJvcGVydHlCYWcuYXBwQ29tcG9uZW50LmdldE1vZGVsKCkuZ2V0TWV0YU1vZGVsKCksXG5cdFx0XHRvRm9ybSA9IG1Qcm9wZXJ0eUJhZy5lbGVtZW50O1xuXG5cdFx0bGV0IHNFbnRpdHlTZXQgPSBhd2FpdCBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvRm9ybSwgXCJlbnRpdHlTZXRcIiwgb01vZGlmaWVyKTtcblx0XHRpZiAoIXNFbnRpdHlTZXQpIHtcblx0XHRcdHNFbnRpdHlTZXQgPSBhd2FpdCBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvRm9ybSwgXCJuYXZpZ2F0aW9uUGF0aFwiLCBvTW9kaWZpZXIpO1xuXHRcdH1cblx0XHRjb25zdCBzUGF0aCA9IHNFbnRpdHlTZXQuc3RhcnRzV2l0aChcIi9cIikgPyBgJHtzRW50aXR5U2V0fWAgOiBgLyR7c0VudGl0eVNldH1gO1xuXHRcdGNvbnN0IG9Gb3JtQ29udGFpbmVyID0gbVByb3BlcnR5QmFnLnBhcmVudFNlbGVjdG9yXG5cdFx0XHQ/IG1Qcm9wZXJ0eUJhZy5tb2RpZmllci5ieVNlbGVjdG9yKG1Qcm9wZXJ0eUJhZy5wYXJlbnRTZWxlY3RvciwgbVByb3BlcnR5QmFnLmFwcENvbXBvbmVudCwgbVByb3BlcnR5QmFnLnZpZXcpXG5cdFx0XHQ6IHVuZGVmaW5lZDtcblx0XHRjb25zdCBzTmF2aWdhdGlvblBhdGggPSBhd2FpdCBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvRm9ybUNvbnRhaW5lciwgXCJuYXZpZ2F0aW9uUGF0aFwiLCBvTW9kaWZpZXIpO1xuXHRcdGNvbnN0IHNCaW5kaW5nUGF0aCA9IHNOYXZpZ2F0aW9uUGF0aCA/IGAke3NQYXRofS8ke3NOYXZpZ2F0aW9uUGF0aH1gIDogc1BhdGg7XG5cdFx0Y29uc3Qgb01ldGFNb2RlbENvbnRleHQ6IENvbnRleHQgPSBvTWV0YU1vZGVsLmdldE1ldGFDb250ZXh0KHNCaW5kaW5nUGF0aCk7XG5cdFx0Y29uc3Qgb1Byb3BlcnR5Q29udGV4dDogQ29udGV4dCA9IG9NZXRhTW9kZWwuY3JlYXRlQmluZGluZ0NvbnRleHQoYCR7c0JpbmRpbmdQYXRofS8ke21Qcm9wZXJ0eUJhZy5iaW5kaW5nUGF0aH1gKTtcblx0XHRjb25zdCBzRm9ybUlkID0gbVByb3BlcnR5QmFnLmVsZW1lbnQuc0lkIHx8IG1Qcm9wZXJ0eUJhZy5lbGVtZW50LmlkO1xuXG5cdFx0Y29uc3Qgb1BhcmFtZXRlcnMgPSB7XG5cdFx0XHRzUHJvcGVydHlOYW1lOiBtUHJvcGVydHlCYWcuYmluZGluZ1BhdGgsXG5cdFx0XHRzQmluZGluZ1BhdGg6IHNCaW5kaW5nUGF0aCxcblx0XHRcdHNWYWx1ZUhlbHBUeXBlOiBcIkZvcm1WSFwiLFxuXHRcdFx0b0NvbnRyb2w6IG9Gb3JtLFxuXHRcdFx0b01ldGFNb2RlbDogb01ldGFNb2RlbCxcblx0XHRcdG9Nb2RpZmllcjogb01vZGlmaWVyXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGZuVGVtcGxhdGVWYWx1ZUhlbHAoc0ZyYWdtZW50TmFtZTogYW55KSB7XG5cdFx0XHRjb25zdCBvVGhpcyA9IG5ldyBKU09OTW9kZWwoe1xuXHRcdFx0XHRcdGlkOiBzRm9ybUlkLFxuXHRcdFx0XHRcdGlkUHJlZml4OiBtUHJvcGVydHlCYWcuZmllbGRTZWxlY3Rvcj8uaWRcblx0XHRcdFx0fSksXG5cdFx0XHRcdG9QcmVwcm9jZXNzb3JTZXR0aW5ncyA9IHtcblx0XHRcdFx0XHRiaW5kaW5nQ29udGV4dHM6IHtcblx0XHRcdFx0XHRcdFwiZW50aXR5U2V0XCI6IG9NZXRhTW9kZWxDb250ZXh0LFxuXHRcdFx0XHRcdFx0XCJwcm9wZXJ0eVwiOiBvUHJvcGVydHlDb250ZXh0LFxuXHRcdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0bW9kZWxzOiB7XG5cdFx0XHRcdFx0XHRcInRoaXNcIjogb1RoaXMsXG5cdFx0XHRcdFx0XHRcImVudGl0eVNldFwiOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0bWV0YU1vZGVsOiBvTWV0YU1vZGVsLFxuXHRcdFx0XHRcdFx0XCJwcm9wZXJ0eVwiOiBvTWV0YU1vZGVsXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLnRlbXBsYXRlQ29udHJvbEZyYWdtZW50KHNGcmFnbWVudE5hbWUsIG9QcmVwcm9jZXNzb3JTZXR0aW5ncywge30sIG9Nb2RpZmllcik7XG5cdFx0fVxuXG5cdFx0YXN5bmMgZnVuY3Rpb24gZm5UZW1wbGF0ZUZvcm1FbGVtZW50KHNGcmFnbWVudE5hbWU6IGFueSwgb1ZpZXc6IGFueSwgbmF2aWdhdGlvblBhdGg6IHN0cmluZykge1xuXHRcdFx0Y29uc3Qgc09uQ2hhbmdlQ3VzdG9tRGF0YTogc3RyaW5nID0gYXdhaXQgRGVsZWdhdGVVdGlsLmdldEN1c3RvbURhdGEob0Zvcm0sIFwib25DaGFuZ2VcIiwgb01vZGlmaWVyKTtcblx0XHRcdGNvbnN0IHNEaXNwbGF5TW9kZUN1c3RvbURhdGEgPSBhd2FpdCBEZWxlZ2F0ZVV0aWwuZ2V0Q3VzdG9tRGF0YShvRm9ybSwgXCJkaXNwbGF5TW9kZVwiLCBvTW9kaWZpZXIpO1xuXHRcdFx0Y29uc3Qgb1RoaXMgPSBuZXcgSlNPTk1vZGVsKHtcblx0XHRcdFx0Ly8gcHJvcGVydGllcyBhbmQgZXZlbnRzIG9mIEZpZWxkIG1hY3JvXG5cdFx0XHRcdF9mbGV4SWQ6IG1Qcm9wZXJ0eUJhZy5maWVsZFNlbGVjdG9yPy5pZCxcblx0XHRcdFx0b25DaGFuZ2U6IENvbW1vbi5yZW1vdmVFc2NhcGVDaGFyYWN0ZXJzKHNPbkNoYW5nZUN1c3RvbURhdGEpLFxuXHRcdFx0XHRkaXNwbGF5TW9kZTogQ29tbW9uLnJlbW92ZUVzY2FwZUNoYXJhY3RlcnMoc0Rpc3BsYXlNb2RlQ3VzdG9tRGF0YSksXG5cdFx0XHRcdG5hdmlnYXRpb25QYXRoOiBuYXZpZ2F0aW9uUGF0aFxuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBvUHJlcHJvY2Vzc29yU2V0dGluZ3MgPSB7XG5cdFx0XHRcdGJpbmRpbmdDb250ZXh0czoge1xuXHRcdFx0XHRcdFwiZW50aXR5U2V0XCI6IG9NZXRhTW9kZWxDb250ZXh0LFxuXHRcdFx0XHRcdFwiZGF0YUZpZWxkXCI6IG9Qcm9wZXJ0eUNvbnRleHQsXG5cdFx0XHRcdFx0XCJ0aGlzXCI6IG9UaGlzLmNyZWF0ZUJpbmRpbmdDb250ZXh0KFwiL1wiKVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb2RlbHM6IHtcblx0XHRcdFx0XHRcInRoaXNcIjogb1RoaXMsXG5cdFx0XHRcdFx0XCJlbnRpdHlTZXRcIjogb01ldGFNb2RlbCxcblx0XHRcdFx0XHRtZXRhTW9kZWw6IG9NZXRhTW9kZWwsXG5cdFx0XHRcdFx0XCJkYXRhRmllbGRcIjogb01ldGFNb2RlbFxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRyZXR1cm4gRGVsZWdhdGVVdGlsLnRlbXBsYXRlQ29udHJvbEZyYWdtZW50KHNGcmFnbWVudE5hbWUsIG9QcmVwcm9jZXNzb3JTZXR0aW5ncywgeyB2aWV3OiBvVmlldyB9LCBvTW9kaWZpZXIpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGJWYWx1ZUhlbHBSZXF1aXJlZCA9IGF3YWl0IERlbGVnYXRlVXRpbC5pc1ZhbHVlSGVscFJlcXVpcmVkKG9QYXJhbWV0ZXJzKTtcblx0XHRjb25zdCBiVmFsdWVIZWxwRXhpc3RzID0gYXdhaXQgRGVsZWdhdGVVdGlsLmRvZXNWYWx1ZUhlbHBFeGlzdChvUGFyYW1ldGVycyk7XG5cdFx0bGV0IG9WYWx1ZUhlbHA7XG5cdFx0aWYgKGJWYWx1ZUhlbHBSZXF1aXJlZCAmJiAhYlZhbHVlSGVscEV4aXN0cykge1xuXHRcdFx0b1ZhbHVlSGVscCA9IGF3YWl0IGZuVGVtcGxhdGVWYWx1ZUhlbHAoXCJzYXAuZmUubWFjcm9zLmZvcm0uVmFsdWVIZWxwV3JhcHBlclwiKTtcblx0XHR9XG5cdFx0Y29uc3Qgb0ZpZWxkID0gYXdhaXQgZm5UZW1wbGF0ZUZvcm1FbGVtZW50KFwic2FwLmZlLm1hY3Jvcy5mb3JtLkZvcm1FbGVtZW50RmxleGliaWxpdHlcIiwgbVByb3BlcnR5QmFnLnZpZXcsIHNOYXZpZ2F0aW9uUGF0aCk7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbnRyb2w6IG9GaWVsZCxcblx0XHRcdHZhbHVlSGVscDogb1ZhbHVlSGVscFxuXHRcdH07XG5cdH0sXG5cdC8vIGdldFByb3BlcnR5SW5mbyBpcyBhIHBhdGNoZWQgdmVyc2lvbiBvZiBPRGF0YVY0UmVhZERlbGVnYXRlcyB0byBkZWxhIHdpdGggbmF2aWdhdGlvblBhdGhcblx0Z2V0UHJvcGVydHlJbmZvOiBmdW5jdGlvbiAobVByb3BlcnR5QmFnOiBhbnkpIHtcblx0XHRmdW5jdGlvbiBfaXNDb21wbGV4VHlwZShtUHJvcGVydHk6IGFueSkge1xuXHRcdFx0aWYgKG1Qcm9wZXJ0eSAmJiBtUHJvcGVydHkuJFR5cGUpIHtcblx0XHRcdFx0aWYgKG1Qcm9wZXJ0eS4kVHlwZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJlZG1cIikgIT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vQ2hlY2sgaWYgYSBnaXZlbiBwcm9wZXJ0eSBwYXRoIHN0YXJ0cyB3aXRoIGEgbmF2aWdhdGlvbiBwcm9wZXJ0eS5cblx0XHRmdW5jdGlvbiBfc3RhcnRzV2l0aE5hdmlnYXRpb25Qcm9wZXJ0eShzUHJvcGVydHlQYXRoOiBzdHJpbmcsIGFOYXZpZ2F0aW9uUHJvcGVydGllczogc3RyaW5nW10pIHtcblx0XHRcdHJldHVybiBhTmF2aWdhdGlvblByb3BlcnRpZXMuc29tZShmdW5jdGlvbiAoc05hdlByb3ApIHtcblx0XHRcdFx0cmV0dXJuIHNQcm9wZXJ0eVBhdGguc3RhcnRzV2l0aChzTmF2UHJvcCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBfZW5yaWNoUHJvcGVydHkoXG5cdFx0XHRzUHJvcGVydHlQYXRoOiBzdHJpbmcsXG5cdFx0XHRtRWxlbWVudDogYW55LFxuXHRcdFx0bVByb3BlcnR5QW5ub3RhdGlvbnM6IGFueSxcblx0XHRcdHNFbnRpdHlUeXBlOiBzdHJpbmcsXG5cdFx0XHRvRWxlbWVudDogQ29udHJvbCxcblx0XHRcdHNBZ2dyZWdhdGlvbk5hbWU6IHN0cmluZyxcblx0XHRcdGFOYXZpZ2F0aW9uUHJvcGVydGllczogc3RyaW5nW11cblx0XHQpOiBEZWxlZ2F0ZVByb3BlcnR5IHtcblx0XHRcdGNvbnN0IG1Qcm9wOiBEZWxlZ2F0ZVByb3BlcnR5ID0ge1xuXHRcdFx0XHRuYW1lOiBzUHJvcGVydHlQYXRoLFxuXHRcdFx0XHRiaW5kaW5nUGF0aDogc1Byb3BlcnR5UGF0aCxcblx0XHRcdFx0ZW50aXR5VHlwZTogc0VudGl0eVR5cGVcblx0XHRcdH07XG5cdFx0XHQvLyBnZXQgbGFiZWwgaW5mb3JtYXRpb24sIGVpdGhlciB2aWEgRGF0YUZpZWxkRGVmYXVsdCBhbm5vdGF0aW9uIChpZiBleGlzdHMpIG9yIExhYmVsIGFubm90YXRpb25cblx0XHRcdGNvbnN0IG1EYXRhRmllbGREZWZhdWx0QW5ub3RhdGlvbiA9IG1Qcm9wZXJ0eUFubm90YXRpb25zW1wiQGNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZERlZmF1bHRcIl07XG5cdFx0XHRjb25zdCBzTGFiZWwgPVxuXHRcdFx0XHQobURhdGFGaWVsZERlZmF1bHRBbm5vdGF0aW9uICYmIG1EYXRhRmllbGREZWZhdWx0QW5ub3RhdGlvbi5MYWJlbCkgfHxcblx0XHRcdFx0bVByb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkxhYmVsXCJdO1xuXHRcdFx0bVByb3AubGFiZWwgPSBzTGFiZWwgfHwgXCJbTEFCRUxfTUlTU0lORzogXCIgKyBzUHJvcGVydHlQYXRoICsgXCJdXCI7XG5cdFx0XHQvLyBldmFsdWF0ZSBIaWRkZW4gYW5ub3RhdGlvblxuXHRcdFx0Y29uc3QgbUhpZGRlbkFubm90YXRpb24gPSBtUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5IaWRkZW5cIl07XG5cdFx0XHRtUHJvcC5oaWRlRnJvbVJldmVhbCA9IG1IaWRkZW5Bbm5vdGF0aW9uO1xuXHRcdFx0aWYgKG1IaWRkZW5Bbm5vdGF0aW9uICYmIG1IaWRkZW5Bbm5vdGF0aW9uLiRQYXRoKSB7XG5cdFx0XHRcdG1Qcm9wLmhpZGVGcm9tUmV2ZWFsID0gb0VsZW1lbnQuZ2V0QmluZGluZ0NvbnRleHQoKT8uZ2V0UHJvcGVydHkobUhpZGRlbkFubm90YXRpb24uJFBhdGgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZXZhbHVhdGUgRmllbGRDb250cm9sIGFubm90YXRpb25cblx0XHRcdGxldCBtRmllbGRDb250cm9sQW5ub3RhdGlvbjtcblx0XHRcdGlmICghbVByb3AuaGlkZUZyb21SZXZlYWwpIHtcblx0XHRcdFx0bUZpZWxkQ29udHJvbEFubm90YXRpb24gPSBtUHJvcGVydHlBbm5vdGF0aW9uc1tcIkBjb20uc2FwLnZvY2FidWxhcmllcy5Db21tb24udjEuRmllbGRDb250cm9sXCJdO1xuXHRcdFx0XHRpZiAobUZpZWxkQ29udHJvbEFubm90YXRpb24pIHtcblx0XHRcdFx0XHRtUHJvcC5oaWRlRnJvbVJldmVhbCA9IG1GaWVsZENvbnRyb2xBbm5vdGF0aW9uLiRFbnVtTWVtYmVyID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLkNvbW1vbi52MS5GaWVsZENvbnRyb2xUeXBlL0hpZGRlblwiO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBAcnVudGltZSBoaWRkZW4gYnkgZmllbGQgY29udHJvbCB2YWx1ZSA9IDBcblx0XHRcdG1GaWVsZENvbnRyb2xBbm5vdGF0aW9uID0gbVByb3BlcnR5QW5ub3RhdGlvbnNbXCJAY29tLnNhcC52b2NhYnVsYXJpZXMuQ29tbW9uLnYxLkZpZWxkQ29udHJvbFwiXTtcblx0XHRcdGNvbnN0IHNGaWVsZENvbnRyb2xQYXRoID0gbUZpZWxkQ29udHJvbEFubm90YXRpb24gJiYgbUZpZWxkQ29udHJvbEFubm90YXRpb24uUGF0aDtcblx0XHRcdGlmIChzRmllbGRDb250cm9sUGF0aCAmJiAhbVByb3AuaGlkZUZyb21SZXZlYWwpIHtcblx0XHRcdFx0Ly8gaWYgdGhlIGJpbmRpbmcgaXMgYSBsaXN0IGJpbmRpbmcsIHNraXAgdGhlIGNoZWNrIGZvciBmaWVsZCBjb250cm9sXG5cdFx0XHRcdGNvbnN0IGJMaXN0QmluZGluZyA9IG9FbGVtZW50LmdldEJpbmRpbmcoc0FnZ3JlZ2F0aW9uTmFtZSkgaW5zdGFuY2VvZiBMaXN0QmluZGluZztcblx0XHRcdFx0aWYgKCFiTGlzdEJpbmRpbmcpIHtcblx0XHRcdFx0XHRjb25zdCBpRmllbGRDb250cm9sVmFsdWUgPSBvRWxlbWVudC5nZXRCaW5kaW5nQ29udGV4dCgpPy5nZXRQcm9wZXJ0eShzRmllbGRDb250cm9sUGF0aCk7XG5cdFx0XHRcdFx0bVByb3AuaGlkZUZyb21SZXZlYWwgPSBpRmllbGRDb250cm9sVmFsdWUgPT09IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIG5vIHN1cHBvcnQgZm9yIERhdGFGaWVsZEZvci9XaXRoQWN0aW9uIGFuZCBEYXRhRmllbGRGb3IvV2l0aEludGVudEJhc2VkTmF2aWdhdGlvbiB3aXRoaW4gRGF0YUZpZWxkRGVmYXVsdCBhbm5vdGF0aW9uXG5cdFx0XHRpZiAoXG5cdFx0XHRcdG1EYXRhRmllbGREZWZhdWx0QW5ub3RhdGlvbiAmJlxuXHRcdFx0XHQobURhdGFGaWVsZERlZmF1bHRBbm5vdGF0aW9uLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckFjdGlvblwiIHx8XG5cdFx0XHRcdFx0bURhdGFGaWVsZERlZmF1bHRBbm5vdGF0aW9uLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZEZvckludGVudEJhc2VkTmF2aWdhdGlvblwiIHx8XG5cdFx0XHRcdFx0bURhdGFGaWVsZERlZmF1bHRBbm5vdGF0aW9uLiRUeXBlID09PSBcImNvbS5zYXAudm9jYWJ1bGFyaWVzLlVJLnYxLkRhdGFGaWVsZFdpdGhBY3Rpb25cIiB8fFxuXHRcdFx0XHRcdG1EYXRhRmllbGREZWZhdWx0QW5ub3RhdGlvbi4kVHlwZSA9PT0gXCJjb20uc2FwLnZvY2FidWxhcmllcy5VSS52MS5EYXRhRmllbGRXaXRoSW50ZW50QmFzZWROYXZpZ2F0aW9uXCIpXG5cdFx0XHQpIHtcblx0XHRcdFx0bVByb3AudW5zdXBwb3J0ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gbm8gc3VwcG9ydCBmb3IgbmF2aWdhdGlvbiBwcm9wZXJ0aWVzIGFuZCBjb21wbGV4IHByb3BlcnRpZXNcblx0XHRcdGlmIChfc3RhcnRzV2l0aE5hdmlnYXRpb25Qcm9wZXJ0eShzUHJvcGVydHlQYXRoLCBhTmF2aWdhdGlvblByb3BlcnRpZXMpIHx8IF9pc0NvbXBsZXhUeXBlKG1FbGVtZW50KSkge1xuXHRcdFx0XHRtUHJvcC51bnN1cHBvcnRlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbVByb3A7XG5cdFx0fVxuXG5cdFx0Ly8gQ29udmVydCBtZXRhZGF0YSBmb3JtYXQgdG8gZGVsZWdhdGUgZm9ybWF0LlxuXHRcdGZ1bmN0aW9uIF9jb252ZXJ0TWV0YWRhdGFUb0RlbGVnYXRlRm9ybWF0KFxuXHRcdFx0bU9EYXRhRW50aXR5VHlwZTogYW55LFxuXHRcdFx0c0VudGl0eVR5cGU6IHN0cmluZyxcblx0XHRcdG9NZXRhTW9kZWw6IE9EYXRhTWV0YU1vZGVsLFxuXHRcdFx0b0VsZW1lbnQ6IENvbnRyb2wsXG5cdFx0XHRzQWdncmVnYXRpb25OYW1lOiBzdHJpbmdcblx0XHQpOiBEZWxlZ2F0ZVByb3BlcnR5W10ge1xuXHRcdFx0Y29uc3QgYVByb3BlcnRpZXMgPSBbXTtcblx0XHRcdGxldCBzRWxlbWVudE5hbWUgPSBcIlwiO1xuXHRcdFx0Y29uc3QgYU5hdmlnYXRpb25Qcm9wZXJ0aWVzID0gW107XG5cdFx0XHRsZXQgbUVsZW1lbnQ7XG5cdFx0XHRmb3IgKHNFbGVtZW50TmFtZSBpbiBtT0RhdGFFbnRpdHlUeXBlKSB7XG5cdFx0XHRcdG1FbGVtZW50ID0gbU9EYXRhRW50aXR5VHlwZVtzRWxlbWVudE5hbWVdO1xuXHRcdFx0XHRpZiAobUVsZW1lbnQuJGtpbmQgPT09IFwiTmF2aWdhdGlvblByb3BlcnR5XCIpIHtcblx0XHRcdFx0XHRhTmF2aWdhdGlvblByb3BlcnRpZXMucHVzaChzRWxlbWVudE5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHNFbGVtZW50TmFtZSBpbiBtT0RhdGFFbnRpdHlUeXBlKSB7XG5cdFx0XHRcdG1FbGVtZW50ID0gbU9EYXRhRW50aXR5VHlwZVtzRWxlbWVudE5hbWVdO1xuXHRcdFx0XHRpZiAobUVsZW1lbnQuJGtpbmQgPT09IFwiUHJvcGVydHlcIikge1xuXHRcdFx0XHRcdGNvbnN0IG1Qcm9wQW5ub3RhdGlvbnMgPSBvTWV0YU1vZGVsLmdldE9iamVjdChcIi9cIiArIHNFbnRpdHlUeXBlICsgXCIvXCIgKyBzRWxlbWVudE5hbWUgKyBcIkBcIik7XG5cdFx0XHRcdFx0Y29uc3QgbVByb3AgPSBfZW5yaWNoUHJvcGVydHkoXG5cdFx0XHRcdFx0XHRzRWxlbWVudE5hbWUsXG5cdFx0XHRcdFx0XHRtRWxlbWVudCxcblx0XHRcdFx0XHRcdG1Qcm9wQW5ub3RhdGlvbnMsXG5cdFx0XHRcdFx0XHRzRW50aXR5VHlwZSxcblx0XHRcdFx0XHRcdG9FbGVtZW50LFxuXHRcdFx0XHRcdFx0c0FnZ3JlZ2F0aW9uTmFtZSxcblx0XHRcdFx0XHRcdGFOYXZpZ2F0aW9uUHJvcGVydGllc1xuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0YVByb3BlcnRpZXMucHVzaChtUHJvcCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBhUHJvcGVydGllcztcblx0XHR9XG5cblx0XHQvL0dldCBiaW5kaW5nIHBhdGggZWl0aGVyIGZyb20gcGF5bG9hZCAoaWYgYXZhaWxhYmxlKSBvciB0aGUgZWxlbWVudCdzIGJpbmRpbmcgY29udGV4dC5cblx0XHRmdW5jdGlvbiBfZ2V0QmluZGluZ1BhdGgob0VsZW1lbnQ6IENvbnRyb2wsIG1QYXlsb2FkOiBhbnkpIHtcblx0XHRcdGlmIChtUGF5bG9hZC5wYXRoKSB7XG5cdFx0XHRcdHJldHVybiBtUGF5bG9hZC5wYXRoO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgdkJpbmRpbmcgPSBvRWxlbWVudC5nZXRCaW5kaW5nQ29udGV4dCgpO1xuXHRcdFx0aWYgKHZCaW5kaW5nKSB7XG5cdFx0XHRcdGlmIChvRWxlbWVudC5kYXRhKFwibmF2aWdhdGlvblBhdGhcIikpIHtcblx0XHRcdFx0XHRyZXR1cm4gdkJpbmRpbmcuZ2V0UGF0aCgpICsgXCIvXCIgKyBvRWxlbWVudC5kYXRhKFwibmF2aWdhdGlvblBhdGhcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHZCaW5kaW5nLmdldFBhdGgoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvL0dldCBhbGwgcHJvcGVydGllcyBvZiB0aGUgZWxlbWVudCdzIG1vZGVsLlxuXHRcdGZ1bmN0aW9uIF9nZXRPRGF0YVByb3BlcnRpZXNPZk1vZGVsKG9FbGVtZW50OiBDb250cm9sLCBzQWdncmVnYXRpb25OYW1lOiBzdHJpbmcsIG1QYXlsb2FkOiBhbnkpIHtcblx0XHRcdGNvbnN0IG9Nb2RlbCA9IG9FbGVtZW50LmdldE1vZGVsKG1QYXlsb2FkLm1vZGVsTmFtZSk7XG5cdFx0XHRpZiAob01vZGVsKSB7XG5cdFx0XHRcdGlmIChvTW9kZWwuaXNBKFwic2FwLnVpLm1vZGVsLm9kYXRhLnY0Lk9EYXRhTW9kZWxcIikpIHtcblx0XHRcdFx0XHRjb25zdCBvTWV0YU1vZGVsID0gb01vZGVsLmdldE1ldGFNb2RlbCgpIGFzIE9EYXRhTWV0YU1vZGVsO1xuXHRcdFx0XHRcdGNvbnN0IHNCaW5kaW5nQ29udGV4dFBhdGggPSBfZ2V0QmluZGluZ1BhdGgob0VsZW1lbnQsIG1QYXlsb2FkKTtcblx0XHRcdFx0XHRpZiAoc0JpbmRpbmdDb250ZXh0UGF0aCkge1xuXHRcdFx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbENvbnRleHQgPSBvTWV0YU1vZGVsLmdldE1ldGFDb250ZXh0KHNCaW5kaW5nQ29udGV4dFBhdGgpO1xuXHRcdFx0XHRcdFx0Y29uc3Qgb01ldGFNb2RlbENvbnRleHRPYmplY3QgPSBvTWV0YU1vZGVsQ29udGV4dC5nZXRPYmplY3QoKTtcblx0XHRcdFx0XHRcdGNvbnN0IG1PRGF0YUVudGl0eVR5cGUgPSBvTWV0YU1vZGVsQ29udGV4dC5nZXRPYmplY3QoKG9NZXRhTW9kZWxDb250ZXh0T2JqZWN0IGFzIGFueSkuJFR5cGUpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIF9jb252ZXJ0TWV0YWRhdGFUb0RlbGVnYXRlRm9ybWF0KFxuXHRcdFx0XHRcdFx0XHRtT0RhdGFFbnRpdHlUeXBlLFxuXHRcdFx0XHRcdFx0XHQob01ldGFNb2RlbENvbnRleHRPYmplY3QgYXMgYW55KS4kVHlwZSxcblx0XHRcdFx0XHRcdFx0b01ldGFNb2RlbCxcblx0XHRcdFx0XHRcdFx0b0VsZW1lbnQsXG5cdFx0XHRcdFx0XHRcdHNBZ2dyZWdhdGlvbk5hbWVcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gX2dldE9EYXRhUHJvcGVydGllc09mTW9kZWwobVByb3BlcnR5QmFnLmVsZW1lbnQsIG1Qcm9wZXJ0eUJhZy5hZ2dyZWdhdGlvbk5hbWUsIG1Qcm9wZXJ0eUJhZy5wYXlsb2FkKTtcblx0XHR9KTtcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgRGVsZWdhdGU7XG4iXSwibWFwcGluZ3MiOiI7QUFBQTtBQUFBO0FBQUE7Ozs7RUFnQkEsSUFBTUEsUUFBUSxHQUFHO0lBQ2hCO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7SUFDQ0MsWUFBWSxZQUFrQkMsWUFBbEI7TUFBQSxJQVdUO1FBQ0YsSUFBTUMsU0FBUyxHQUFHRCxZQUFZLENBQUNFLFFBQS9CO1FBQUEsSUFDQ0MsVUFBVSxHQUFHSCxZQUFZLENBQUNJLFlBQWIsSUFBNkJKLFlBQVksQ0FBQ0ksWUFBYixDQUEwQkMsUUFBMUIsR0FBcUNDLFlBQXJDLEVBRDNDO1FBQUEsSUFFQ0MsS0FBSyxHQUFHUCxZQUFZLENBQUNRLE9BRnRCO1FBREUsdUJBS3FCQyxZQUFZLENBQUNDLGFBQWIsQ0FBMkJILEtBQTNCLEVBQWtDLFdBQWxDLEVBQStDTixTQUEvQyxDQUxyQixpQkFLRVUsVUFMRjtVQUFBO1lBU0YsSUFBTUMsS0FBSyxHQUFHRCxVQUFVLENBQUNFLFVBQVgsQ0FBc0IsR0FBdEIsY0FBZ0NGLFVBQWhDLGVBQW1EQSxVQUFuRCxDQUFkO1lBQ0EsSUFBTUcsY0FBYyxHQUFHZCxZQUFZLENBQUNl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