/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/base/Log", "sap/ui/core/routing/HashChanger", "sap/ui/base/Object"],
	function (Log, HashChanger, BaseObject) {
		"use strict";
		var URL_KEY = "sap-url-hash";
		var TRANSIENT_KEY = "transient";
		var oLogger = Log.getLogger("sap.suite.ui.commons.collaboration.URLMinifier");

		/**
		 * Utility to minify URL
		 * @namespace
		 * @since 1.108
		 * @alias module:sap/suite/ui/commons/collaboration/URLMinifier
		 * @private
		 * @ui5-restricted
		 * @experimental Since 1.108
		 */
		var URLMinifier = BaseObject.extend(
			"sap.suite.ui.commons.collaboration.URLMinifier"
		);

		/**
		 * @param {string} sUrl full URL
		 * @returns {string} This function returns a shortened url in the format
		 * `<protocol>/<hostname>#<semantic-object>&/sap-url-hash=<UUID>`
		 * @description This function creates a shortened URL.
		 * @private
		 * @ui5-restricted sap.suite.suite-ui-commons
		 * @experimental since 1.108
		 */
		URLMinifier.compactHash = function (sUrl) {
			var oShellContainer = sap.ushell && sap.ushell.Container;
			if (!oShellContainer) {
				//In case uShell Container is not present, minification is not needed.
				return {
					url: sUrl
				};
			}
			return oShellContainer.getServiceAsync("AppState").then(
				function (oAppStateService) {
					var oEmptyAppState = oAppStateService.createEmptyAppState(
						undefined,
						false
					);
					var sKey = this._getNextKey(oEmptyAppState);
					if (!this._isEligibleForBackendPersistency(oAppStateService)) {
						oLogger.warning("Transient flag is true. URL will not be shortened");
						return {
							url: sUrl
						};
					}
					var sUrlBeforeHash = this._extractURLBeforeHash(sUrl);
					var sSemanticObjectAndAction = this._extractSemanticObjectAndAction();
					if (!sSemanticObjectAndAction) {
						// In case sSemanticObjectAndAction is undefined, let's not minify the url.
						return {
							url: sUrl
						};
					}
					return this._storeUrl(sUrl, oEmptyAppState)
						.then(function () {
							return {
								url: sUrlBeforeHash + "#" + sSemanticObjectAndAction + "&/" + URL_KEY + "=" + sKey
							};
						})
						.catch(function (error) {
							oLogger.warning("URL is not shortened due to an error." + error.toString());
							//In case if the wrapper promise is rejected then return the current url as shortened url.
							return {
								url: sUrl
							};
						});
				}.bind(this)
			);
		};

		/**
		 * @description This function redirects to the url which is stored against the hash.
		 * @public
		 */
		 URLMinifier.expandHash = function () {
			var sUrl = document.URL;
			//if the current url has url param, sap-url-hash, then we have to redirect to an actual url.
			if (sUrl.indexOf(URL_KEY) > -1) {
				var hash = HashChanger.getInstance().getHash().split('=')[1];
				return this._retrieveURL(hash).then(function (oAppState) {
					return Promise.resolve(oAppState);
				});
			}
			return Promise.resolve();
		};

		/**
		 * This function redirects to the url which is stored against the hash
		 * @param {string} sUrl Actual URL which is stored against the hash
		 */
		URLMinifier.redirect = function (sUrl) {
			window.location.replace(sUrl);
		};

		/**
		 * @param {string} hash hash from the URL
		 * @returns {AppState} instance of AppState
		 * @description This function retrieves the url stored against the hash in the K/V persistent store.
		 * @private
		 */
		URLMinifier._retrieveURL = function (hash) {
			if (sap.ushell && sap.ushell.Container) {
				return sap.ushell.Container.getServiceAsync("AppState").then(function (oAppStateService) {
					return oAppStateService.getAppState(hash);
				});
			}
		};

		/**
		 * @param {AppState} appStateInstance instance of AppState
		 * @returns {boolean} true if transient flag is set to false
		 * @description This function checks the transient flag in the _oConfig object.
		 * @private
		 */
		URLMinifier._isEligibleForBackendPersistency = function (appStateInstance) {
			return (
				appStateInstance != null &&
				appStateInstance._oConfig != null &&
				TRANSIENT_KEY in appStateInstance._oConfig &&
				!appStateInstance._oConfig[TRANSIENT_KEY]
			);
		};

		/**
		 * @param {AppState} oAppStateService instance of AppState
		 * @returns {string} Returns a randomly generated UUID string.
		 * @description This function generates an alphanumberic UUID string.
		 * @private
		 */
		URLMinifier._getNextKey = function (oAppStateService) {
			return oAppStateService.getKey();
		};

		/**
		 * @returns {string} Returns a string in the format <semantic-object>-<action>~<contextRaw>.
		 * @description This functions parses a url and extracts smenatic-object, action and context-raw if applicable.
		 * @private
		 */
		URLMinifier._extractSemanticObjectAndAction = function () {
			var URLParser = sap.ushell && sap.ushell.services && new sap.ushell.services.URLParsing();
			if (URLParser) {
				var parsedShellHash = URLParser.parseShellHash(document.location.hash);
				if (parsedShellHash) {
					return parsedShellHash.contextRaw ?
						parsedShellHash.semanticObject + "-" +
						parsedShellHash.action + "~" +
						parsedShellHash.contextRaw :
						parsedShellHash.semanticObject + "-" + parsedShellHash.action;
				}
			}
			return undefined;
		};

		/**
		 * @param {string} sUrl full url
		 * @description Extracting URL present before the # character.
		 * @returns {string} string before the # character in the URL.
		 * @private
		 */
		URLMinifier._extractURLBeforeHash = function (sUrl) {
			var sUrlFragementBeforeHash = sUrl.split("#")[0];
			return sUrlFragementBeforeHash;
		};

		/**
		 * @param {string} sUrl full URL
		 * @param {AppState} oAppStateService instance of AppState
		 * @description This function saves the hash and the long url in the K/V DB.
		 * @returns {Promise} Promise which ultimately resolves once the value is stored successfully.
		 * @private
		 */
		URLMinifier._storeUrl = function (sUrl, oAppStateService) {
			oAppStateService.setData(sUrl);
			return oAppStateService.save();
		};
		return URLMinifier;
	}
);