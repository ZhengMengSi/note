/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ----------------------------------------------------------------------------------
// Provides base class sap.fe.AppComponent for all generic app components
// ----------------------------------------------------------------------------------
sap.ui.define(["sap/fe/core/AppComponent", "sap/base/Log", "sap/m/MessageToast"], function(CoreAppComponent, Log, MessageToast) {
	"use strict";

	/**
	 * @classname "sap.fe.AppComponent"
	 * @private
	 * @deprecated please use sap.fe.core.AppComponent instead
	 */
	return CoreAppComponent.extend("sap.fe.AppComponent", {
		init: function() {
			var sText = 'This class of the AppComponent is deprecated, please use "sap.fe.core.AppComponent" instead';
			Log.error(sText);
			MessageToast.show(sText);
			CoreAppComponent.prototype.init.apply(this, arguments);
		}
	});
});
