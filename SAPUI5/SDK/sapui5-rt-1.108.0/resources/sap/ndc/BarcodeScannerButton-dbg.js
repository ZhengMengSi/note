/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */

// Provides control sap.ndc.BarcodeScannerButton.
sap.ui.define([
	'./BarcodeScanner',
	'./BarcodeScannerButtonRenderer',
	'./library',
	'sap/m/Button',
	'sap/ui/core/Control',
	'sap/ui/model/resource/ResourceModel'
], function(BarcodeScanner, BarcodeScannerButtonRenderer, library, Button, Control, ResourceModel) {
	"use strict";



	/**
	 * Constructor for a new BarcodeScannerButton.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A button control (displaying a bar code icon) to start the bar code scanning process. If the native scanning feature is
	 * not available or camera capability is not granted, the button is either hidden or it provides a fallback by opening a dialog with an input field where the bar code can
	 * be entered manually.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 *
	 * @constructor
	 * @public
	 * @alias sap.ndc.BarcodeScannerButton
	 */
	var BarcodeScannerButton = Control.extend("sap.ndc.BarcodeScannerButton", /** @lends sap.ndc.BarcodeScannerButton.prototype */ {
		metadata : {

			library : "sap.ndc",
			properties : {

				/**
				 * If set to true, the button remains visible if the scanner is not available and triggers a dialog to enter bar code.
				 */
				provideFallback : {type : "boolean", defaultValue : true},

				/**
				 * The invisible bar code scanner button is not rendered regardless of the availability of the native scan feature.
				 */
				visible : {type : "boolean", defaultValue : true},

				/**
				 * Defines the width of the scanner button.
				 */
				width : {type: "sap.ui.core.CSSSize", defaultValue : null},

				/**
				 * Defines the bar code input dialog title. If unset, a predefined title will be used.
				 */
				dialogTitle : {type: "string", defaultValue: null},

				/**
				 * If set to true, the front camera will be used to decode.
				 */
				preferFrontCamera : {type : "boolean", defaultValue : false},

				/**
				 * Defines the frame rate of the camera.
				 */
				frameRate : {type : "float"},

				/**
				 * Defines the zoom of the camera. This parameter is not supported on iOS.
				 */
				zoom : {type : "float"},

				/**
				 * If set to true, the camera should be used for scanning in Zebra Enterprise Browser.
				 */
				keepCameraScan : {type : "boolean", defaultValue : false}
			},
			aggregations : {

				/**
				 * Internal aggregation to hold the inner Button.
				 */
				_btn : {type : "sap.m.Button", multiple : false, visibility : "hidden"}
			},
			events : {

				/**
				 * Event is fired when the scanning is finished or cancelled
				 */
				scanSuccess : {
					parameters : {

						/**
						 * The the text representation of the bar code data.
						 */
						text : {type : "string"},

						/**
						 * The type of the bar code detected.
						 */
						format : {type : "string"},

						/**
						 * Indicates whether or not the user cancelled the scan.
						 */
						cancelled : {type : "boolean"}
					}
				},

				/**
				 * Event is fired when the native scanning process is failed.
				 */
				scanFail : {},

				/**
				 * Event is fired when the text in the dialog's input field is changed.
				 */
				inputLiveUpdate : {
					parameters : {

						/**
						 * The new value of the input field.
						 */
						newValue : {type : "string"}
					}
				}
			}
		},
		renderer: BarcodeScannerButtonRenderer
	});

	var oResourceModel;

	BarcodeScannerButton.prototype.init = function () {
		var oBarcodeStatus;

		oResourceModel = new ResourceModel({
			bundleName: "sap.ndc.messagebundle"
		});

		this.setAggregation("_btn", new Button({
			icon: "sap-icon://bar-code",
			tooltip: oResourceModel.getProperty("BARCODE_SCANNER_BUTTON_TOOLTIP"),
			press: this._onBtnPressed.bind(this),
			width: "100%"
		}));

		oBarcodeStatus = BarcodeScanner.getStatusModel();
		this.setModel(oBarcodeStatus, "status");
	};

	BarcodeScannerButton.prototype._onBtnPressed = function (oEvent) {
		BarcodeScanner.scan(
			this._onScanSuccess.bind(this),
			this._onScanFail.bind(this),
			this._onInputLiveUpdate.bind(this),
			this.getProperty("dialogTitle"),
			this.getProperty("preferFrontCamera"),
			this.getProperty("frameRate"),
			this.getProperty("zoom"),
			this.getProperty("keepCameraScan")
		);
	};

	BarcodeScannerButton.prototype._onScanSuccess = function (mArguments) {
		this.fireScanSuccess(mArguments);
	};

	BarcodeScannerButton.prototype._onScanFail = function (mArguments) {
		this.fireScanFail(mArguments);
	};

	BarcodeScannerButton.prototype._onInputLiveUpdate = function (mArguments) {
		this.fireInputLiveUpdate(mArguments);
	};

	BarcodeScannerButton.prototype.setProvideFallback = function (bFallback) {
		var bValue = this.getProvideFallback();
		var oBtn;

		bFallback = !!bFallback;

		if (bValue !== bFallback) {
			this.setProperty("provideFallback", bFallback);
			oBtn = this.getAggregation("_btn");
			if (bFallback) {
				oBtn.unbindProperty("visible");
				oBtn.setVisible(true);
			} else {
				oBtn.bindProperty("visible", "status>/available");
			}
		}

		return this;
	};

	return BarcodeScannerButton;

});