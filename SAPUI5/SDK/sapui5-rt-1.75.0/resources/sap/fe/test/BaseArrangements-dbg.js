sap.ui.define(
	[
		"sap/ui/test/launchers/iFrameLauncher",
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"sap/ui/thirdparty/jquery",
		"sap/base/util/UriParameters",
		"sap/fe/test/Utils"
	],
	function(iFrameLauncher, Opa5, OpaBuilder, jQuery, UriParameters, Utils) {
		"use strict";

		// All common arrangements for all Opa tests are defined here
		return Opa5.extend("sap.fe.integrations.common.BaseArrangements", {
			iStartMyApp: function(appName, sAppParams, mSandboxParams) {
				// using NodeJS Mockserver on 4004 as backend
				var oUriParams = new UriParameters(window.location.href),
					sBackendUrl = oUriParams.get("useBackendUrl") || "http://localhost:4004",
					sSandBoxParams = Object.keys(mSandboxParams || {}).reduce(function(sCurrent, sKey) {
						return sCurrent + "&" + sKey + "=" + mSandboxParams[sKey];
					}, "");
				this.iStartMyAppInAFrame(
					"test-resources/sap/fe/internal/demokit/flpSandbox.html?sap-ui-log-level=ERROR&sap-ui-xx-viewCache=true&useBackendUrl=" +
						sBackendUrl +
						sSandBoxParams +
						"#" +
						appName +
						(sAppParams || "")
				);
				// We need to reset the native navigation functions in the iFrame
				// as the navigation mechanism in Fiori elements uses them
				// (they are overridden in OPA by the iFrameLauncher)
				// We also need to override native confirm dialog, as it blocks the test
				return OpaBuilder.create(this)
					.success(function() {
						var iFrameWindow = iFrameLauncher.getWindow();
						var iParentWindow = iFrameWindow.parent;
						iFrameWindow.history.go = iParentWindow.history.go;
						iFrameWindow.history.back = iParentWindow.history.back;

						iFrameWindow.confirm = function(sMessage) {
							throw "Unexpected confirm dialog - " + sMessage;
						};
					})
					.description(Utils.formatMessage("App '{0}' started", appName))
					.execute();
			},
			iResetTestData: function() {
				var oUriParams = new UriParameters(window.location.href),
					sBackendUrl = oUriParams.get("useBackendUrl") || "http://localhost:4004",
					sProxyPrefix = "/databinding/proxy/" + sBackendUrl.replace("://", "/"),
					bSuccess = false,
					sTenantID =
						window.__karma__ && window.__karma__.config && window.__karma__.config.ui5
							? window.__karma__.config.ui5.shardIndex
							: "default";

				return OpaBuilder.create(this)
					.success(function() {
						//clear local storage so no flex change / variant management zombies exist
						localStorage.clear();
						jQuery.post(sProxyPrefix + "/redeploy?tenant=" + sTenantID, function() {
							bSuccess = true;
						});
						return OpaBuilder.create(this)
							.check(function() {
								return bSuccess;
							})
							.execute();
					})
					.description(Utils.formatMessage("Reset test data on tenant '{0}'", sTenantID))
					.execute();
			},
			iTearDownMyApp: function() {
				return OpaBuilder.create(this)
					.do(this.iTeardownMyAppFrame.bind(this))
					.description("Tearing down my app")
					.execute();
			}
		});
	}
);
