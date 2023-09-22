sap.ui.define(["./FooterAPI", "sap/fe/test/Utils", "sap/ui/test/OpaBuilder", "sap/fe/test/builder/FEBuilder"], function(
	FooterAPI,
	Utils,
	OpaBuilder,
	FEBuilder
) {
	"use strict";

	/**
	 * Constructor.
	 * @param {sap.fe.test.builder.OverflowToolbarBuilder} oOverflowToolbarBuilder the OverflowToolbarBuilder instance to operate on
	 * @param {string} [vFooterDescription] the footer description (optional), used to log message
	 * @returns {sap.fe.test.api.FooterActions} the instance
	 * @constructor
	 * @private
	 */
	var FooterActions = function(oOverflowToolbarBuilder, vFooterDescription, sEntityPath) {
		this._sEntityPath = sEntityPath;
		return FooterAPI.call(this, oOverflowToolbarBuilder, vFooterDescription);
	};
	FooterActions.prototype = Object.create(FooterAPI.prototype);
	FooterActions.prototype.constructor = FooterActions;
	FooterActions.prototype.isAction = true;

	/**
	 * Execute a footer action.
	 *
	 * @param {string} [vValue] The new target value.
	 * @private
	 * @experimental
	 */
	FooterActions.prototype.iExecuteAction = function(vActionIdentifier) {
		var aArguments = Utils.parseArguments([[Object, String]], arguments),
			oOverflowToolbarBuilder = this.getBuilder();

		return this.prepareResult(
			oOverflowToolbarBuilder
				.doOnContent(this.createActionMatcher(vActionIdentifier), OpaBuilder.Actions.press())
				.description(Utils.formatMessage("Executing footer action '{0}'", aArguments[0]))
				.execute()
		);
	};

	/**
	 * Execute the Save action in the ObjectPage footer bar.
	 *
	 * @private
	 * @experimental
	 */
	FooterActions.prototype.iExecuteSave = function() {
		var oOverflowToolbarBuilder = this.getBuilder(),
			sSaveId = "fe::save::" + this._sEntityPath;

		return this.prepareResult(
			oOverflowToolbarBuilder
				.doOnContent(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sSaveId))), OpaBuilder.Actions.press())
				.description("Pressing save action on footer bar")
				.execute()
		);
	};
	/**
	 * Execute the Cancel action in the ObjectPage footer bar.
	 *
	 * @private
	 * @experimental
	 */
	FooterActions.prototype.iExecuteCancel = function() {
		var oOverflowToolbarBuilder = this.getBuilder(),
			sSaveId = "fe::cancel::" + this._sEntityPath;

		return this.prepareResult(
			oOverflowToolbarBuilder
				.doOnContent(FEBuilder.Matchers.id(new RegExp(Utils.formatMessage("{0}$", sSaveId))), OpaBuilder.Actions.press())
				.description("Pressing cancel action on footer bar")
				.execute()
		);
	};
	/**
	 * Execute the Cancel action in the ObjectPage footer bar.
	 *
	 * @private
	 * @experimental
	 */
	FooterActions.prototype.iConfirmCancel = function() {
		return this.prepareResult(
			OpaBuilder.create(this)
				.hasType("sap.m.Popover")
				.isDialogElement()
				.doOnChildren(
					OpaBuilder.Matchers.resourceBundle("text", "sap.fe.core", "SAPFE_DRAFT_DISCARD_BUTTON"),
					OpaBuilder.Actions.press()
				)
				.description("Confirming discard changes")
				.execute()
		);
	};

	return FooterActions;
});
