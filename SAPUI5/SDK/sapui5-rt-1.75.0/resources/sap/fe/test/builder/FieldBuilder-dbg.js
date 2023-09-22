sap.ui.define(["./FEBuilder", "sap/ui/mdc/library", "sap/fe/test/Utils"], function(FEBuilder, mdcLibrary, Utils) {
	"use strict";

	var FieldDisplay = mdcLibrary.FieldDisplay;

	var FieldBuilder = function() {
		return FEBuilder.apply(this, arguments);
	};

	FieldBuilder.create = function(oOpaInstance) {
		return new FieldBuilder(oOpaInstance);
	};

	FieldBuilder.prototype = Object.create(FEBuilder.prototype);

	FieldBuilder.prototype.hasValue = function(vValue) {
		return this.has(FieldBuilder.Matchers.value(vValue));
	};

	FieldBuilder.Matchers = {
		value: function(vExpectedValue) {
			return function(oField) {
				if (!oField.isA("sap.ui.mdc.Field")) {
					throw new Error("Expected sap.ui.mdc.Field but got " + oField.getMetadata().getName());
				}

				vExpectedValue = [].concat(vExpectedValue, Array.prototype.slice.call(arguments, 1));

				var aValue = oField.getValue(),
					aAdditionalValue = oField.getAdditionalValue(),
					aValuesToCheck = [];

				switch (oField.getDisplay()) {
					case FieldDisplay.Value:
						aValuesToCheck = aValuesToCheck.concat(aValue);
						break;
					case FieldDisplay.Description:
						aValuesToCheck = aValuesToCheck.concat(aAdditionalValue);
						break;
					case FieldDisplay.ValueDescription:
					case FieldDisplay.DescriptionValue:
						aValuesToCheck = aValuesToCheck.concat(aValue, aAdditionalValue);
						break;
					default:
						throw new Error("not supported display type " + oField.getDisplay());
				}
				return vExpectedValue.every(function(vValue, iIndex) {
					return iIndex < aValuesToCheck.length && (vValue || "") == (aValuesToCheck[iIndex] || "");
				});
			};
		}
	};

	FieldBuilder.Actions = {};

	return FieldBuilder;
});
