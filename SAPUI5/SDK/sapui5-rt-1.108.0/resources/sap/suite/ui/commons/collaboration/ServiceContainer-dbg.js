sap.ui.define([
	"sap/base/Log",
	"./BaseHelperService",
	"./TeamsHelperService"
], function (Log, BaseHelperService, TeamsHelperService) {
	"use strict";

	var oLogger = Log.getLogger("sap.suite.ui.commons.collaboration.ServiceContainer");
	var oProviderConfiguration;
	var oServicePromise; // Promise object which will be returned by getServiceAsync method

	function fnGetCollaborationType() {
		var oHelperService;
		if (oProviderConfiguration) {
			var sProvider = oProviderConfiguration.sProvider;
			var oProviderConfig = oProviderConfiguration.oProviderConfig;
			if (sProvider === "COLLABORATION_MSTEAMS") {
				oHelperService = new TeamsHelperService(oProviderConfig);
				oServicePromise = Promise.resolve(oHelperService);
				return oServicePromise;
			}
		}

		oHelperService = new BaseHelperService({});
		oLogger.info("Collaboration provider is not activated on the tenant");
		return Promise.resolve(oHelperService);
	}

	// Private constructor so that no one could create an instance of the class
	function ServiceContainer() { }

	sap.suite.ui.commons.collaboration.ServiceContainer = new ServiceContainer();

	/**
	 * Method returns the Collaboration service object active on the system. MS Teams is supported as
	 * collaboration options & needs to be enabled through the communication service SAP_COM_0860.
	 * Type definition and class only available internally in SAP and not for the consumers
	 *
	 * @returns {Promise} Returns promise which is resolved to instance of Collaboration service.
	 * @internal
	 * @static
	 * @experimental Since 1.108
	 */
	sap.suite.ui.commons.collaboration.ServiceContainer.getServiceAsync = function () {
		if (oServicePromise) {
			return oServicePromise;
		}

		return fnGetCollaborationType();
	};
	sap.suite.ui.commons.collaboration.ServiceContainer.setCollaborationType = function (sProvider, oProviderConfig) {
		oLogger.info("Collaboration properties are now configured");
		oProviderConfiguration = {
			sProvider: sProvider,
			oProviderConfig: oProviderConfig
		};
	};
	return sap.suite.ui.commons.collaboration.ServiceContainer;
});
