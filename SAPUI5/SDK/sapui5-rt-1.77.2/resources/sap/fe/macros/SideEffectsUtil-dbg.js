/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Util class used to help handle side effects
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------

// TODO: enhance/take over common functionalities from macro field runtime, fe edit flow and transaction helper

sap.ui.define(["sap/base/Log"], function(Log) {
	"use strict";

	var oSideEffectsUtil = {};

	/**
	 * Checks the Side Effects path expressions for empty NavigationPropertyPaths and changes them to
	 * PropertyPaths with path "*"
	 * @function
	 * @name replaceEmptyNavigationPaths
	 * @param {Array} aPathExpressions the array of target path expressions used for the side effect
	 * @returns {Array} updated path expressions
	 */
	oSideEffectsUtil.replaceEmptyNavigationPaths = function(aPathExpressions) {
		return (
			(aPathExpressions &&
				aPathExpressions.map(function(oPathExpression) {
					if (oPathExpression["$NavigationPropertyPath"] === "") {
						return {
							"$PropertyPath": "*"
						};
					}
					return oPathExpression;
				})) ||
			[]
		);
	};

	/**
	 * Logs the Side Effects request with the information -
	 * 		1. Context path - of the context on which side effects are requested
	 * 		2. Property paths - the ones which are requested
	 * @function
	 * @name logRequest
	 * @param {map} oRequest the side effect request ready for execution
	 * @param {Object} oRequest.context the context on which side effect will be requested
	 * @param {Array} oRequest.pathExpressions array of $PropertyPath and $NavigationPropertyPath
	 */
	oSideEffectsUtil.logRequest = function(oRequest) {
		var sPropertyPaths =
			Array.isArray(oRequest.pathExpressions) &&
			oRequest.pathExpressions.reduce(function(sPaths, oPath) {
				return sPaths + "\n\t\t" + (oPath["$PropertyPath"] || oPath["$NavigationPropertyPath"] || "");
			}, "");
		Log.info("SideEffects request:\n\tContext path : " + oRequest.context.getPath() + "\n\tProperty paths :" + sPropertyPaths);
	};

	return oSideEffectsUtil;
});
