sap.ui.define(["sap/ui/test/OpaBuilder", "sap/ui/test/launchers/iFrameLauncher"], function(OpaBuilder, iFrameLauncher) {
	"use strict";

	var _bLastConfirm; // Undefined by default

	return {
		create: function() {
			return {
				actions: {
					iSetNextConfirmAnswer: function(bConfirm) {
						var iFrameWindow = iFrameLauncher.getWindow(),
							fnConfirm = iFrameWindow.confirm;

						function custConfirm(sMessage) {
							// Reset original confirm
							iFrameWindow.confirm = fnConfirm;

							_bLastConfirm = bConfirm;
							return bConfirm;
						}

						_bLastConfirm = undefined;
						iFrameWindow.confirm = custConfirm;
					}
				},
				assertions: {
					confirmDialogHasBeenDisplayed: function(bExpectedAnswer) {
						return OpaBuilder.create(this)
							.check(function() {
								var bRes = _bLastConfirm !== undefined && bExpectedAnswer === _bLastConfirm;
								_bLastConfirm = undefined;
								return bRes;
							}, true)
							.description("Confirm dialog has been displayed and " + (bExpectedAnswer ? "accepted" : "refused"))
							.execute();
					},

					confirmDialogHasNotBeenDisplayed: function() {
						return OpaBuilder.create(this)
							.check(function() {
								return _bLastConfirm === undefined;
							}, true)
							.description("No confirm dialog has been displayed")
							.execute();
					}
				}
			};
		}
	};
});
