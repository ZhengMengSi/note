sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/thirdparty/jquery"], function(Opa5, OpaBuilder, jQuery) {
	"use strict";
	// All common actions for all Opa tests are defined here
	return Opa5.extend("sap.fe.integrations.common.BaseActions", {
		iClosePopover: function() {
			var bPopoverClosed = false,
				fnCloseCallback = function() {
					bPopoverClosed = true;
				};
			OpaBuilder.create(this)
				.hasType("sap.m.Popover")
				.has(function(oPopover) {
					return oPopover.isOpen();
				})
				.checkNumberOfMatches(1)
				.do(function(oPopover) {
					oPopover.attachEventOnce("afterClose", fnCloseCallback);
					oPopover.close();
				})
				.execute();
			return OpaBuilder.create(this)
				.check(function() {
					return bPopoverClosed;
				})
				.description("Closing open popover")
				.execute();
		},
		iPressEscape: function() {
			return OpaBuilder.create(this)
				.do(function() {
					jQuery.event.trigger({ type: "keydown", which: 27 });
				})
				.description("Pressing escape button")
				.execute();
		},
		iNavigateBack: function() {
			return OpaBuilder.create(this)
				.viewId(null)
				.hasId("backBtn")
				.doPress()
				.description("Navigating back via shell")
				.execute();
		},
		iExpandShellNavMenu: function() {
			return OpaBuilder.create(this)
				.viewId(null)
				.hasId("shellAppTitle")
				.doPress()
				.description("Expanding Navigation Menu")
				.execute();
		},
		iNavigateViaShellNavMenu: function(sItem) {
			return OpaBuilder.create(this)
				.viewId(null)
				.hasId("sapUshellNavHierarchyItems")
				.doOnAggregation("items", OpaBuilder.Matchers.properties({ title: sItem }), OpaBuilder.Actions.press())
				.description("Navigating to " + sItem)
				.execute();
		}
	});
});
