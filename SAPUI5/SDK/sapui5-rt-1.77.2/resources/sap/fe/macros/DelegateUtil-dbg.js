/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Util class used to help create the table/column delegates and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/ui/mdc/TableDelegate",
		"sap/ui/mdc/FilterBarDelegate",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/Fragment",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/CommonHelper",
		"sap/fe/macros/StableIdHelper",
		"sap/fe/macros/field/FieldHelper",
		"sap/base/util/ObjectPath",
		"sap/ui/mdc/odata/v4/FieldBaseDelegate",
		"sap/ui/model/odata/type/String",
		"sap/fe/macros/ResourceModel",
		"sap/base/util/merge"
	],
	function(
		TableDelegate,
		FilterBarDelegate,
		XMLTemplateProcessor,
		XMLPreprocessor,
		Fragment,
		JSONModel,
		CommonHelper,
		StableIdHelper,
		FieldHelper,
		ObjectPath,
		FieldBaseDelegate,
		String,
		ResourceModel,
		merge
	) {
		"use strict";

		var oDelegateUtil = {},
			NS_MACRODATA = "http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1";

		function _retrieveModel() {
			this.control.detachModelContextChange(_retrieveModel, this);
			var sModelName = this.modelName,
				oModel = this.control.getModel(sModelName);

			if (oModel) {
				this.resolve(oModel);
			} else {
				this.control.attachModelContextChange(_retrieveModel, this);
			}
		}

		oDelegateUtil.getCustomDataProperty = function(sProperty, oControl, oModifier) {
			if (oModifier && oModifier.targets === "xmlTree") {
				return oControl.getAttributeNS(NS_MACRODATA, sProperty);
			}
			return (oControl.data && oControl.data(sProperty)) || undefined;
		};

		oDelegateUtil.fetchPropertiesForEntity = function(sEntitySet, oMetaModel) {
			return oMetaModel.requestObject(sEntitySet + "/");
		};

		oDelegateUtil.fetchAnnotationsForEntity = function(sEntitySet, oMetaModel) {
			return oMetaModel.requestObject(sEntitySet + "@");
		};

		oDelegateUtil.fetchModel = function(oControl) {
			return new Promise(function(resolve, reject) {
				var sModelName = oControl.getDelegate().payload && oControl.getDelegate().payload.modelName,
					oContext = { modelName: sModelName, control: oControl, resolve: resolve };
				_retrieveModel.call(oContext);
			});
		};

		oDelegateUtil.templateControlFragment = function(sFragmentName, oPreprocessorSettings, oController, bIsXML) {
			return XMLPreprocessor.process(
				XMLTemplateProcessor.loadTemplate(sFragmentName, "fragment"),
				{ name: sFragmentName },
				oPreprocessorSettings
			).then(function(oFragment) {
				var oControl = oFragment.firstElementChild;
				if (bIsXML && oControl) {
					return oControl;
				}
				return Fragment.load({
					definition: oFragment,
					controller: oController
				});
			});
		};

		oDelegateUtil.checkValueHelp = function(mParameters) {
			var bValueHelpExists = false,
				sPropertyName = mParameters.sPropertyName || "",
				sVHIdPrefix = mParameters.sVHIdPrefix || "",
				oMetaModel = mParameters.oMetaModel,
				oModifier = mParameters.oModifier,
				sProperty = mParameters.sBindingPath + "/" + sPropertyName,
				oPropertyContext = oMetaModel.createBindingContext(sProperty);
			return Promise.all([
				oMetaModel.requestObject(sProperty + "@com.sap.vocabularies.Common.v1.ValueListReferences"),
				oMetaModel.requestObject(sProperty + "@com.sap.vocabularies.Common.v1.ValueListMapping"),
				oMetaModel.requestObject(sProperty + "@com.sap.vocabularies.Common.v1.ValueList")
			]).then(function(aResults) {
				var bSupportsValueHelp = aResults[0] || aResults[1] || aResults[2];
				if (bSupportsValueHelp) {
					var sValueHelpProperty = FieldHelper.valueHelpProperty(oPropertyContext),
						sGeneratedId = StableIdHelper.generate([
							StableIdHelper.generate([oModifier.getId(mParameters.oControl), sVHIdPrefix]),
							sPropertyName
						]);
					// unit/currency
					if (sValueHelpProperty.indexOf("$Path") > -1) {
						sValueHelpProperty = oMetaModel.getObject(sValueHelpProperty);
					}
					if (sProperty !== sValueHelpProperty) {
						sGeneratedId = StableIdHelper.generate([sGeneratedId, sValueHelpProperty]);
					}
					bValueHelpExists = oModifier.getAggregation(mParameters.oControl, "dependents").some(function(oDependent) {
						return oModifier.getId(oDependent) === sGeneratedId;
					});
				}
				return bSupportsValueHelp && !bValueHelpExists;
			});
		};

		return oDelegateUtil;
	}
);
