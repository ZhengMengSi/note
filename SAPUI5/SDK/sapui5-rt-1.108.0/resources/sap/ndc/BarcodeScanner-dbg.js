/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */


// configure shim for zxing library to allow AMD-like import
sap.ui.loader.config({
	shim: {
		'sap/ndc/thirdparty/ZXing': {
			amd: true,
			exports: 'ZXing'
		}
	}
});

sap.ui.define([
		"sap/base/Log",
		'sap/ui/model/json/JSONModel',
		'sap/ui/model/resource/ResourceModel',
		'sap/m/Input',
		'sap/m/Label',
		'sap/m/Button',
		'sap/m/Dialog',
		"sap/ui/dom/includeStylesheet",
		"./BarcodeScannerUIContainer",
		"sap/m/MessageToast",
		'sap/m/library',
		"sap/ui/base/Event",
		"sap/ui/base/EventProvider",
		'sap/ui/Device'
	],
	function(Log, JSONModel, ResourceModel, Input, Label, Button, Dialog, includeStylesheet, BarcodeScannerUIContainer, MessageToast, mobileLibrary, Event, EventProvider, Device) {
	"use strict";

	/*global cordova EB*/
	document.addEventListener("settingsDone", init);
	document.addEventListener("SettingCompleted", init);
	document.addEventListener("mockSettingsDone", init);

	includeStylesheet({
		url: sap.ui.require.toUrl("sap/ndc/css/sapNdcBarcodeScanner.css")
	});

	/**
	 * @class
	 *
	 * Please refer to <a target="_blank" rel="noopener,noreferrer" href="https://launchpad.support.sap.com/#/notes/2402585">SAP Note 2402585</a> for information on barcode scanner support in native iOS and Android browsers.
	 *
	 * Here is an example of how to trigger the scan function of BarcodeScanner:
	 * <pre>
	 * sap.ui.require(["sap/ndc/BarcodeScanner"], function(BarcodeScanner) {
	 * 	BarcodeScanner.scan(
	 * 		function (oResult) { / * process scan result * / },
	 * 		function (oError) { / * handle scan error * / },
	 * 		function (oResult) { / * handle input dialog change * / }
	 * 	);
	 * });
	 * </pre>
	 *
	 * The Barcode Scanner control integrates with the laser scanner when the page is loaded in the Enterprise Browser on a Zebra device. To enable laser scanning with a Zebra device, two JavaScript files (ebapi.js and eb.barcode.js) need to be loaded during runtime by the Enterprise Browser.
	 * <ul>
	 * <li>Your company admin / IT should configure the Barcode API settings in the Enterprise Browser config.xml file using mobile device management (MDM). Refer to <a target="_blank" rel="noopener,noreferrer" href="https://techdocs.zebra.com/enterprise-browser/3-3/guide/configreference/">CustomDOMElements</a> for detailed information (recommended).</li>
	 * <li>Developers can load these files directly into an HTML file. Refer to <a target="_blank" rel="noopener,noreferrer" href="https://techdocs.zebra.com/enterprise-browser/3-3/api/barcode/">Enabling the API</a> for detailed information.</li>
	 * </ul>
	 *
	 * @author SAP SE
	 * @since 1.28.0
	 *
	 * @namespace
	 * @public
	 * @alias sap.ndc.BarcodeScanner
	 */
	var BarcodeScanner = {},

	/* =========================================================== */
	/* Internal methods and properties							 */
	/* =========================================================== */

		oCordovaScannerAPI,
		oZXingScannerAPI,
		oZXing,

		oStatusModel = new JSONModel({
			available: false
		}),
		oScanDialog = null,
		oScanDialogController = {},
		oDialogTitle = "",

		defaultConstraints = {
			audio: false,
			video: {
				facingMode: 'environment'
			}
		},
		oPreferFrontCamera,
		oFrameRate,
		oZoom,
		onFnFail,
		onFnSuccess,
		zebraEBPhysicalScanCalled,

		oBarcodeScannerUIContainer = null,

		oBarcodeVideoDOM,
		oBarcodeOverlayDOM,
		oBarcodeHighlightDOM,
		imgTruncX = 0,
		imgTruncY = 0,

		bBarcodeOverlaySetup = false,

		bReady = true,			// No scanning is in progress
		// TODO: following var is not used, right now it is useless // bInitialized = false,	// Flag indicating whether the feature vector (sap.Settings) is available
								// sap.Settings might be loaded later, so it is checked again the next scan
		oResourceModel = new ResourceModel({
			bundleName: "sap.ndc.messagebundle"
		});

	function getFeatureAPI() {
		try {
			oCordovaScannerAPI = cordova.plugins.barcodeScanner;
			if (oCordovaScannerAPI) {
				Log.debug("Cordova BarcodeScanner plugin is available!");
			} else {
				Log.error("BarcodeScanner: cordova.plugins.barcodeScanner is not available");
				getZXingAPI();
			}
		} catch (e) {
			Log.info("BarcodeScanner: cordova.plugins is not available");
			getZXingAPI();
		}
	}

	function getZXingAPI() {
		sap.ui.require([
			"sap/ndc/thirdparty/ZXing"
		], function (ZXing) {
			oZXing = ZXing;
			if (oZXing) {
				oZXingScannerAPI = new oZXing.BrowserMultiFormatReader();
				if (oZXingScannerAPI) {
					Log.debug("ZXing BrowserMultiFormatReader API is available!");
				} else {
					oStatusModel.setProperty("/available", false);
					Log.error("BarcodeScanner: ZXing BrowserMultiFormatReader API is not available");
				}
			} else {
				oStatusModel.setProperty("/available", false);
				Log.error("BarcodeScanner: Scanner API is not available");
			}
		}, function (oError) {
			oStatusModel.setProperty("/available", false);
			Log.error("BarcodeScanner: ZXing is not available");
		});
	}


	/**
	 * Used to detect browsers which does not have access to html5 user media api and cant use device camera
	 * @private
	 * @returns {boolean} true is user media access supported by html5 compatible browser
	 */
	function isUserMediaAccessSupported() {
		return !!(window && window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia);
	}

	function checkCordovaInIframe() {
		try {
			if (self != top && typeof cordova === "undefined") {
				// self != top, means the app is loaded in an iframe.
				// typeof cordova === "undefined", means cannot find cordova plugins in the iframe.
				// Now assign top.cordova to window.cordova variable in current iframe.
				window.cordova = top.cordova;
			}
		} catch (err) {
			// Catch the DOMException in the cross-origin iframe. Cordova doesn't support cross-origin
			Log.info("BarcodeScanner: cordova is not available in cross-origin iframe");
		}
	}

	function checkZebraEBInIframe() {
		try {
			// typeof EB === "undefined" || typeof Rho === "undefined", means cannot find EB API in the iframe.
			if (self != top && (typeof EB === "undefined" || typeof Rho === "undefined")) {
				if (typeof top.EB !== "undefined" || typeof top.Rho !== "undefined") {
					// Now assign window.EB to top.EB and window.Rho to top.Rho variable in current iframe.
					window.EB = top.EB;
					window.Rho = top.Rho;
				}
			}
		} catch (oErr) {
			Log.info("BarcodeScanner: EB and Rho are not available in cross-origin iframe");
		}
		if (BarcodeScanner.getScanAPIInfo() === 'ZebraEnterpriseBrowser') {
			EB.Barcode.disable();
		}
	}

	// Check:
	//	* Feature vector (sap.Settings.isFeatureEnabled) is available
	//  * Barcode scanner is enabled by the Feature Vector
	//  * Barcode scanner Cordova plug-in (cordova.plugins.barcodeScanner) or zxing-js (ZXing.BrowserMultiFormatReader) is available
	function init() {
		checkCordovaInIframe();
		oCordovaScannerAPI = null;
		oZXingScannerAPI = null;
		oZXing = null;
		checkZebraEBInIframe();
		onFnFail = null;
		onFnSuccess = null;

		//true by default and only false if feature is forbidden from feature vector
		oStatusModel.setProperty("/available", true);
		//sap.Settings is provided by Kapsel SettingsExchange plugin.
		if (sap.Settings === undefined) {
			//native device capabilities should be by default enabled if there is no feature vector
			//available to restrict the capability.
			Log.debug("No sap.Settings. No feature vector available.");
			//still try to check if only barcode scanner plugin is present without the settings plugin.
			getFeatureAPI();
		} else if (sap.Settings && typeof sap.Settings.isFeatureEnabled === "function") {
			// TODO: following var is not used, right now it is useless // bInitialized = true;
			sap.Settings.isFeatureEnabled("cordova.plugins.barcodeScanner",
				// Feature check success
				function (bEnabled) {
					if (bEnabled) {
						getFeatureAPI();
					} else {
						oStatusModel.setProperty("/available", false);
						Log.warning("BarcodeScanner: Feature disabled");
					}
				},
				// Feature check error
				function () {
					Log.warning("BarcodeScanner: Feature check failed");
				}
			);
		} else {
			Log.warning("BarcodeScanner: Feature vector (sap.Settings.isFeatureEnabled) is not available");
		}
	}

	/**
	 * Makes sure that fallback option with input field appears in case if video device not available
	 * @private
	 * @param {string} sMessage popup will contain label with this explanatory message about reason why scanner is not available
	 */
	function openBarcodeInputDialog(sMessage) {
		if (sMessage) {
			Log.warning("isNoScanner. Message: " + sMessage);
		}
		closeZXingScanContain();

		oScanDialog.destroyContent();
		oScanDialog.setTitle('');
		oScanDialog.setStretch(false);
		oScanDialog.setContentHeight('auto');
		oScanDialog.removeStyleClass('sapUiNoContentPadding');

		oScanDialog.setTitle(oDialogTitle);

		var oMSGLabel = new Label(oScanDialog.getId() + '-txt_barcode', {
			text: "{i18n>BARCODE_DIALOG_MSG}",
			visible: "{/isNoScanner}"
		});
		oScanDialog.addContent(
			oMSGLabel
		);

		var oFallbackInput = new Input(oScanDialog.getId() + '-inp_barcode', {
			value: "{/barcode}",
			valueLiveUpdate: true,
			ariaLabelledBy: oMSGLabel.getId(),
			liveChange: function(oEvent) {
				if (typeof oScanDialogController.onLiveUpdate === "function") {
					oScanDialogController.onLiveUpdate({
						newValue: oEvent.getParameter("newValue")
					});
				}
			},
			placeholder: "{i18n>BARCODE_DIALOG_PLACEHOLDER}"
		});
		oScanDialog.addContent(oFallbackInput);

		// shortcut for sap.m.ButtonType
		var ButtonType = mobileLibrary.ButtonType;

		oScanDialog.setBeginButton(
			new Button(oScanDialog.getId() + '-btn_barcode_ok', {
				type: ButtonType.Emphasized,
				text: "{i18n>BARCODE_DIALOG_OK}",
				press: function(oEvent) {
					BarcodeScanner.closeScanDialog();
					if (typeof oScanDialogController.onSuccess === "function") {
						oScanDialogController.onSuccess({
							text: oScanDialog.getModel().getProperty("/barcode"),
							cancelled: false
						});
					}
				}
			})
		);
		oScanDialog.setEndButton(
			new Button({
				text: "{i18n>BARCODE_DIALOG_CANCEL}",
				press: function() {
					BarcodeScanner.closeScanDialog();
				}
			})
		);

		oScanDialog.setBusy(false);
		oScanDialog.open();
	}


	/**
	 * Initializes ZXing code reader scan, video device gets turned on and starts waiting for barcode
	 * @private
	 */
	function openBarcodeScannerDialog() {
		if (window.navigator.mediaDevices.getUserMedia) {
			if (oPreferFrontCamera) {
				defaultConstraints.video.facingMode = 'user';
			} else {
				defaultConstraints.video.facingMode = 'environment';
			}
			// Reset frameRate
			if (defaultConstraints.video.frameRate !== undefined) {
				delete defaultConstraints.video.frameRate;
			}
			window.navigator.mediaDevices
				.getUserMedia(defaultConstraints)
				.then(
					function(stream) {
						if (oZXingScannerAPI) {
							// When decoding QR-code by iPhone (iOS 16), this stream will clash with another stream from ZXing-js.
							if (Device.os.ios && Device.os.versionStr.split('.')[0] === '16') {
								var videoTrack = stream.getTracks();
								videoTrack[0].stop();
							}
							openBarcodeScannerDialogContains();
						} else {
							oScanDialog.getModel().setProperty("/isNoScanner", true);
							openBarcodeInputDialog();
						}
					}
				)
				.catch(
					function() {
						oScanDialog.getModel().setProperty("/isNoScanner", true);
						openBarcodeInputDialog();
					}
				);
		} else {
			oScanDialog.getModel().setProperty("/isNoScanner", true);
			openBarcodeInputDialog();
		}
	}

	function getScanDialog(fnSuccess, fnFail, fnLiveUpdate, sTitle) {
		var oDialogModel;
		oScanDialogController.onSuccess = fnSuccess;
		oScanDialogController.onFail = fnFail;
		oScanDialogController.onLiveUpdate = fnLiveUpdate;

		if (!oScanDialog || (oScanDialog && oScanDialog.getContent().length === 0)) {
			oDialogModel = new JSONModel();
			oScanDialog = new Dialog('sapNdcBarcodeScannerDialog', {
				icon: 'sap-icon://bar-code',
				title: oResourceModel.getProperty("BARCODE_DIALOG_SCANNING_TITLE"),
				stretch: true,
				horizontalScrolling: false,
				verticalScrolling: false,
				endButton: new Button({
					text: "{i18n>BARCODE_DIALOG_CANCEL}",
					enabled: false,
					press: function() {
						closeZXingScanContain();
						oScanDialog.getModel().setProperty("/isNoScanner", false);
						openBarcodeInputDialog();
					}
				}),
				afterClose: function() {
					closeZXingScanContain();
					oScanDialog.destroyContent();
					oScanDialog.destroy();
					oScanDialog = null;
				}
			});
			oScanDialog.setEscapeHandler(function(promise) {
				BarcodeScanner.closeScanDialog();
				if (typeof fnSuccess === "function") {
					fnSuccess({
						text: oDialogModel.getProperty("/barcode"),
						cancelled: true
					});
				}
				promise.resolve();
			});
			oScanDialog.setModel(oDialogModel);
			oScanDialog.setModel(oResourceModel, "i18n");
		}

		if (typeof sTitle === "string" && sTitle != null && sTitle.trim() != "") {
			oDialogTitle = sTitle;
		} else {
			oDialogTitle = oResourceModel.getProperty("BARCODE_DIALOG_TITLE");
		}

		if (!oCordovaScannerAPI && isUserMediaAccessSupported()) {
			openBarcodeScannerDialog();
		} else {
			if (oStatusModel.getProperty("/available")) {
				oScanDialog.getModel().setProperty("/isNoScanner", false);
			} else {
				oScanDialog.getModel().setProperty("/isNoScanner", true);
			}
			openBarcodeInputDialog();
		}

		return oScanDialog;
	}

	/**
	 * Opens Barcode Scanner dialog, called when code reader is ready
	 * @private
	 */
	function openBarcodeScannerDialogContains() {
		oScanDialog.attachAfterOpen(
			function() {
				// Dev note: if video element dom reference is not available at this point (console exception)
				// some error happened during dialog creation and may not be directly related to video element
				oScanDialog.getEndButton().setEnabled(true);
				oScanDialog.setBusy(false);

				if (!oBarcodeHighlightDOM) {
					oBarcodeHighlightDOM = oBarcodeScannerUIContainer ? oBarcodeScannerUIContainer.getDomRef('highlight') : undefined;
				}
				if (!oBarcodeVideoDOM) {
					oBarcodeVideoDOM = oBarcodeScannerUIContainer ? oBarcodeScannerUIContainer.getDomRef('video') : undefined;
				}
				if (typeof oFrameRate === "number" && oFrameRate > 0) {
					defaultConstraints.video.frameRate = oFrameRate;
				} else if (typeof oFrameRate !== 'undefined') {
					MessageToast.show(
						oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_CAMERA_UPDATE_PARAMETER_ERROR_MSG', 'frameRate'),
						{
							duration: 1000
						}
					);
				}
				oZXingScannerAPI.decodeFromConstraints(defaultConstraints, oBarcodeScannerUIContainer.getId() + '-video', function (result, err) {
					oScanFrame();
					if (result) {
						var point, scaleX, scaleY;
						var bottom = 0,
							right = 0,
							top = 0,
							left = 0,
							i;

						if (oBarcodeHighlightDOM && !bBarcodeOverlaySetup) {
							oBarcodeHighlightDOM.innerHTML = '';
							bBarcodeOverlaySetup = true;
						}

						if (oBarcodeHighlightDOM) {
							scaleX = oBarcodeVideoDOM.clientWidth / oBarcodeVideoDOM.videoWidth;
							scaleY = oBarcodeVideoDOM.clientHeight / oBarcodeVideoDOM.videoHeight;
							if (result.resultPoints) {
								top = result.resultPoints[0].y;
								left = result.resultPoints[0].x;
								right = result.resultPoints[0].x;
								bottom = result.resultPoints[0].y;

								for (i = 0; i < result.resultPoints.length; i++) {
									point = result.resultPoints[i];
									if (point.x < left && point.x < right) {
										left = point.x;
									} else if (point.x > left && point.x > right) {
										right = point.x;
									}
									if (point.y < top && point.y < bottom) {
										top = point.y;
									} else if (point.y > top && point.y > bottom) {
										bottom = point.y;
									}
								}
							}

							oBarcodeHighlightDOM.hidden = false;
							oBarcodeHighlightDOM.style.top = top * scaleY + 'px';
							oBarcodeHighlightDOM.style.left = left * scaleX + 'px';
							oBarcodeHighlightDOM.style.width = (right - left > 0 ? (right - left + imgTruncX) * scaleX : 5) + 'px';
							oBarcodeHighlightDOM.style.height = (bottom - top > 0 ? (bottom - top + imgTruncY) * scaleY : 5) + 'px';
						}

						if (result.cancelled === "false" || !result.cancelled) {
							result.cancelled = false;
							if (typeof oScanDialogController.onSuccess === "function") {
								oScanDialogController.onSuccess(result);
							}
							closeZXingScanContain();
							BarcodeScanner.closeScanDialog();
						}
					} else {
						if (oBarcodeHighlightDOM && bBarcodeOverlaySetup) {
							oBarcodeHighlightDOM.hidden = true;
							oBarcodeHighlightDOM.style.top = '0';
							oBarcodeHighlightDOM.style.left = '0';
							oBarcodeHighlightDOM.style.width = '0';
							oBarcodeHighlightDOM.style.height = '0';
						}
					}

					if (err && oZXing && !(err instanceof oZXing.NotFoundException)) {
						Log.warning("Started continuous decode failed.");
						if (typeof oScanDialogController.onFail === "function") {
							oScanDialogController.onFail(err);
							oScanDialog.getModel().setProperty("/isNoScanner", true);
							openBarcodeInputDialog();
						}
					}
				});
			});
		oScanDialog.destroyContent();
		oBarcodeHighlightDOM = undefined;
		oBarcodeOverlayDOM = undefined;
		oBarcodeVideoDOM = undefined;

		oBarcodeScannerUIContainer = new BarcodeScannerUIContainer();
		oScanDialog.addContent(oBarcodeScannerUIContainer);

		oScanDialog.setContentWidth('100%');
		oScanDialog.setContentHeight('100%');
		oScanDialog.addStyleClass('sapUiNoContentPadding');
		oScanDialog.setBusy(true);
		oScanDialog.open();

		bBarcodeOverlaySetup = false;
	}

	function oScanFrame() {
		var iInactiveZonePercent = 0.15;
		if (!oBarcodeVideoDOM || !oBarcodeVideoDOM.videoHeight || !oBarcodeVideoDOM.videoWidth) {
			return;
		}

		if (!oBarcodeOverlayDOM && oBarcodeScannerUIContainer) {
			oBarcodeOverlayDOM = oBarcodeScannerUIContainer.getDomRef('overlay');
		}

		updateZoom();

		if (oBarcodeOverlayDOM) {
			var oBarcodeOverlayWidthTemp = oBarcodeVideoDOM.clientWidth * (1 - 2 * iInactiveZonePercent);
			var oBarcodeOverlayHeightTemp = oBarcodeVideoDOM.clientHeight * (1 - 2 * iInactiveZonePercent);

			if (oBarcodeOverlayWidthTemp <= oBarcodeOverlayHeightTemp) {
				oBarcodeOverlayHeightTemp = oBarcodeOverlayWidthTemp * (1 - 2 * iInactiveZonePercent);
			}

			// Base on the size of video Dom, reset the size of barcode scanner box
			var oBarcodeScannerBox = oBarcodeScannerUIContainer.getDomRef('overlay-box');
			oBarcodeScannerBox.style.width = oBarcodeOverlayWidthTemp + 'px';
			oBarcodeScannerBox.style.height = oBarcodeOverlayHeightTemp + 'px';

			oBarcodeOverlayDOM.style.width = oBarcodeOverlayWidthTemp + 'px';
			oBarcodeOverlayDOM.style.height = oBarcodeOverlayHeightTemp + 'px';
			oBarcodeOverlayDOM.style.borderWidth = (oBarcodeVideoDOM.clientHeight - oBarcodeOverlayHeightTemp) / 2 + 'px ' + (oBarcodeVideoDOM.clientWidth - oBarcodeOverlayWidthTemp) / 2 + 'px';
		}
	}

	function updateZoom() {
		if (oZoom !== "skipUpdateZoom" && oBarcodeVideoDOM) {
			var videoTrack = oBarcodeVideoDOM.srcObject.getVideoTracks();
			var oSupport = window.navigator.mediaDevices.getSupportedConstraints();
			var capabilities = videoTrack[0].getCapabilities();
			// Verify the permission about updating zoom
			if (oSupport.zoom && capabilities && capabilities.zoom) {
				Log.debug("Support zoom to update");
				if (typeof oZoom === 'undefined' || oZoom === null) {
					// reset zoom
					oZoom = capabilities.zoom.min;
				}
			} else {
				Log.debug("Don't support zoom or getCapabilities() failed.");
				oZoom = "skipUpdateZoom";
				return;
			}
			// Update zoom
			try {
				videoTrack[0].applyConstraints(
					{
						advanced: [{
							zoom: oZoom
						}]
					}
				).then(
					function() {
						oZoom = "skipUpdateZoom";
						Log.debug("The zoom is updated successfully.");
					}
				).catch(
					function(error) {
						if (error && error.message && error.message.match(/out of range|Failed to read the 'zoom' property/i)) {
							oZoom = "skipUpdateZoom";
							MessageToast.show(
								oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_CAMERA_UPDATE_PARAMETER_ERROR_MSG', 'zoom'),
								{
									duration: 1000
								}
							);
						} else {
							Log.error("Update zoom failed. Error Message:" + error);
						}
					}
				);
			} catch (err) {
				Log.error("applyConstraints() failed. Error Message:" + err);
				oZoom = "skipUpdateZoom";
			}
			var settings = videoTrack[0].getSettings();
			Log.debug("frameRate is " + settings.frameRate + ". zoom is " + settings.zoom);
		}
	}

	function closeZXingScanContain() {
		if (oZXingScannerAPI) {
			oZXingScannerAPI.reset();
			oZXingScannerAPI.stopContinuousDecode();
			oZXingScannerAPI.reader.reset();
		}
	}

	function zebraEBScanEnable() {
		var zebraEBScanCallBackFn = function(jsonObject) {
			if (jsonObject['data'] == "" || jsonObject['time'] == "") {
				if (typeof onFnFail === "function") {
					var zebraEBScanFailResult = {
						text: "Zebra Scan failed",
						resultStatus: "Error"
					};
					if (zebraEBPhysicalScanCalled) {
						zebraEBScanFailResult = new Event('scanFailEvent', new EventProvider(), {
							text: "Zebra Scan failed",
							resultStatus: "Error"
						});
					}
					onFnFail(zebraEBScanFailResult);
				}
				Log.error("Zebra Enterprise Browser Scan Failed");
			} else {
				Log.debug("Zebra EB Scan Result: " + jsonObject.data + "; Scan Json: " + JSON.stringify(jsonObject));
				if (typeof onFnSuccess === "function") {
					var zebraEBScanSuccessResult = {
						text: jsonObject.data,
						format: jsonObject.source,
						resultStatus: "Success",
						cancelled: false
					};
					if (zebraEBPhysicalScanCalled) {
						zebraEBScanSuccessResult = new Event('scanSuccessEvent',  new EventProvider(), {
							text: jsonObject.data,
							format: jsonObject.source,
							resultStatus: "Success",
							cancelled: false
						});
					}
					onFnSuccess(zebraEBScanSuccessResult);
				}
			}
		};
		EB.Barcode.enable({}, zebraEBScanCallBackFn);
	}

	function checkZebraEBScanEnable(keepCameraScan) {
		var zebraEBScanEnable = false;
		if (BarcodeScanner.getScanAPIInfo() === "ZebraEnterpriseBrowser" && (!keepCameraScan || typeof keepCameraScan !== 'boolean')) {
			zebraEBScanEnable = true;
		}
		return zebraEBScanEnable;
	}

	/* =========================================================== */
	/* API methods												 */
	/* =========================================================== */

	/**
	 * Starts the bar code scanning process either showing the live input from the camera or displaying a dialog
	 * to enter the value directly if the bar code scanning feature is not available.
	 *
	 * The bar code scanning is done asynchronously. When it is triggered, this function returns without waiting for
	 * the scanning process to finish. The applications have to provide callback functions to react to the events of
	 * a successful scanning, an error during scanning, and the live input on the dialog.
	 *
	 * <code>fnSuccess</code> is passed an object with text, format and cancelled properties. Text is the text representation
	 * of the bar code data, format is the type of the bar code detected, and cancelled is whether or not the user cancelled
	 * the scan. <code>fnError</code> is given the error, <code>fnLiveUpdate</code> is passed the new value entered in the
	 * dialog's input field. An example:
	 *
	 * <pre>
	 * sap.ui.require(["sap/ndc/BarcodeScanner"], function(BarcodeScanner) {
	 * 	BarcodeScanner.scan(
	 *		function (mResult) {
	 *			alert("We got a bar code\n" +
	 *			 	"Result: " + mResult.text + "\n" +
	 *			 	"Format: " + mResult.format + "\n" +
	 *			 	"Cancelled: " + mResult.cancelled);
	 *		},
	 *		function (Error) {
	 *			alert("Scanning failed: " + Error);
	 *		},
	 *		function (mParams) {
	 *			alert("Value entered: " + mParams.newValue);
	 *		},
	 *		"Enter Product Bar Code",
	 *		true,
	 *		30,
	 *		1,
	 *		false
	 * 	);
	 * });
	 * </pre>
	 *
	 * @param {function} [fnSuccess] Function to be called when the scanning is done or cancelled
	 * @param {function} [fnFail] Function to be called when the scanning is failed
	 * @param {function} [fnLiveUpdate] Function to be called when value of the dialog's input is changed
	 * @param {string} [dialogTitle] Defines the bar code input dialog title. If unset, a predefined title will be used.
	 * @param {boolean} [preferFrontCamera] Flag, which defines whether the front or back camera should be used.
	 * @param {float} [frameRate] Defines the frame rate of the camera.
	 * @param {float} [zoom] Defines the zoom of the camera. This parameter is not supported on iOS.
	 * @param {boolean} [keepCameraScan] Flag, which defines whether the camera should be used for scanning in Zebra Enterprise Browser.
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.scan = function (fnSuccess, fnFail, fnLiveUpdate, dialogTitle, preferFrontCamera, frameRate, zoom, keepCameraScan) {
		if (!bReady) {
			Log.error("Barcode scanning is already in progress.");
			return;
		}

		bReady = false;
		oPreferFrontCamera = preferFrontCamera;
		oFrameRate = frameRate;
		oZoom = zoom;

		if (oStatusModel.getProperty("/available") == true && oCordovaScannerAPI == null && oZXingScannerAPI == null){
			//in case we do not have feature vectore we still would like to allow the use
			//of native device capability.
			getFeatureAPI();
		}

		if (checkZebraEBScanEnable(keepCameraScan)) {
			bReady = true;
			zebraEBPhysicalScanCalled = false;
			if (typeof onFnSuccess === "function" && typeof onFnFail === "function") {
				onFnSuccess = fnSuccess;
				onFnFail = fnFail;
			} else {
				onFnSuccess = fnSuccess;
				onFnFail = fnFail;
				zebraEBScanEnable();
			}
			EB.Barcode.triggerType = EB.Barcode.SOFT_ONCE;
			EB.Barcode.start();
		} else if (oCordovaScannerAPI) {
			var options;
			if (oPreferFrontCamera) {
				options = {
					preferFrontCamera: true
				};
			}
			oCordovaScannerAPI.scan(
				function (oResult) {
					if (oResult.cancelled === "false" || !oResult.cancelled) {
						oResult.cancelled = false;
						if (typeof fnSuccess === "function") {
							fnSuccess(oResult);
						}
					} else {
						getScanDialog(fnSuccess, fnFail, fnLiveUpdate, dialogTitle);
					}
					bReady = true;
				},
				function (oEvent) {
					Log.error("Barcode scanning failed.");
					bReady = true;
					if (typeof fnFail === "function") {
						if (typeof oEvent === "string") {
							var str = oEvent;
							oEvent = {"text": str};
							Log.debug("Change the type of oEvent from string to object");
						}
						fnFail(oEvent);
					}
				},
				options
			);
		} else {
			getScanDialog(fnSuccess, fnFail, fnLiveUpdate, dialogTitle);
		}
	};

	/**
	 * Closes the bar code input dialog. It can be used to close the dialog before the user presses the OK or the Cancel button
	 * (e.g. in the fnLiveUpdate callback function of the {@link sap.ndc.BarcodeScanner.scan} method.)
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.closeScanDialog = function () {
		if (oScanDialog) {
			oScanDialog.close();
		}
		bReady = true;
	};

	/**
	 * Returns the status model of the BarcodeScanner. It is a JSON model which contains a single boolean property
	 * '<code>available</code>' indicating whether or not the bar code scanner feature is available. It can be used
	 * to bind to the <code>visible</code> property of UI controls which have to be hidden in case the feature is unavailable.
	 *
	 * @returns {sap.ui.model.json.JSONModel} A JSON model containing the 'available' property
	 * @public
	 * @static
	 */
	BarcodeScanner.getStatusModel = function () {
		return oStatusModel;
	};

	/**
	 * Returns the API info that will be used to scan.
	 *
	 * @returns {string} The Barcode Scanner API info. (e.g. ZebraEnterpriseBrowser, Cordova, ZXing or unknown)
	 * @public
	 * @static
	 */
	BarcodeScanner.getScanAPIInfo = function () {
		var oScanAPIInfo = 'unknown';
		if (typeof EB !== "undefined" && typeof EB.Barcode !== "undefined") {
			oScanAPIInfo = 'ZebraEnterpriseBrowser';
		} else if (oCordovaScannerAPI) {
			oScanAPIInfo = 'Cordova';
		} else if (oZXingScannerAPI) {
			oScanAPIInfo = 'ZXing';
		}
		return oScanAPIInfo;
	};

	/**
	 * Set the callback function for the physical scan button.
	 *
	 * @param {function} [fnPhysicalScan] Function to be called when the scanning is done by pressing physical scan button.
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.setPhysicalScan = function (fnPhysicalScan) {
		if (BarcodeScanner.getScanAPIInfo() === "ZebraEnterpriseBrowser" && typeof fnPhysicalScan === "function") {
			zebraEBPhysicalScanCalled = true;
			document.addEventListener("visibilitychange", function() {
				if (document.visibilityState === 'visible') {
					checkZebraEBInIframe();
					zebraEBScanEnable();
				}
			});
			if (typeof onFnSuccess === "function" && typeof onFnFail === "function") {
				onFnSuccess = fnPhysicalScan;
				onFnFail = fnPhysicalScan;
			} else {
				onFnSuccess = fnPhysicalScan;
				onFnFail = fnPhysicalScan;
				zebraEBScanEnable();
			}
		}
	};

	init();	//must be called to enable control if no feature vector is available.
	return BarcodeScanner;

}, /* bExport= */ true);