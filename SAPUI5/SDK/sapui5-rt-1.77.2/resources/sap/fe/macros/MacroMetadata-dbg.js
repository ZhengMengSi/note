/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define([], function() {
	"use strict";
	var MacroMetadata = {
		extend: function(fnName, oContent) {
			oContent.hasValidation = true;
			return oContent;
		}
	};
	return MacroMetadata;
});
