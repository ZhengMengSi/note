/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
/* eslint-disable no-alert */

/* global Promise */
sap.ui.define(["sap/base/Log", "sap/ui/base/Object"], function(Log, BaseObject) {
	"use strict";

	var PREFIX = "@FE.";
	var replaceRegEx = new RegExp(PREFIX, "g");

	return BaseObject.extend("sap.fe.core.TemplateModel", {
		oMetaModel: null,
		oConfigModel: null,

		constructor: function(oMetaModel, oConfigModel) {
			this.oMetaModel = oMetaModel;
			this.oConfigModel = oConfigModel;

			this.fnCreateMetaBindingContext = this.oMetaModel.createBindingContext.bind(this.oMetaModel);
			this.fnCreateConfigBindingContext = this.oConfigModel.createBindingContext.bind(this.oConfigModel);

			var fnGetObject = this.oConfigModel._getObject.bind(this.oConfigModel);
			this.oConfigModel._getObject = function(sPath, oContext) {
				var sResolvedPath = "";
				if (oContext) {
					sResolvedPath = oContext.getPath();
				}
				if (sPath) {
					sResolvedPath = sResolvedPath + (sResolvedPath ? "/" : "") + sPath;
				}

				sResolvedPath = sResolvedPath.replace(replaceRegEx, "");
				return fnGetObject(sResolvedPath);
			};

			this.oMetaModel.createBindingContext = this.createBindingContext.bind(this);
			this.oConfigModel.createBindingContext = this.createBindingContext.bind(this);
			return this.oMetaModel;
		},
		isConfig: function(sPath) {
			var aSections = sPath.split("/");
			return (
				aSections &&
				(aSections[aSections.length - 1].indexOf(PREFIX) === 0 ||
					(!isNaN(aSections[aSections.length - 1]) && aSections[aSections.length - 2].indexOf(PREFIX) === 0))
			);
		},
		createBindingContext: function(sPath, oContext, mParameters, fnCallBack) {
			var oBindingContext, sResolvedPath;

			if (this.isConfig(sPath)) {
				oBindingContext = this.fnCreateConfigBindingContext(sPath, oContext, mParameters, fnCallBack);
				sResolvedPath = oBindingContext.getObject();
				if (sResolvedPath && typeof sResolvedPath === "string" && !this.isConfig(sResolvedPath)) {
					oBindingContext = this.fnCreateMetaBindingContext(sResolvedPath, oContext, mParameters, fnCallBack);
				}
			} else {
				oBindingContext = this.fnCreateMetaBindingContext.apply(this.oMetaModel, arguments);
			}

			return oBindingContext;
		}
	});
});
