sap.ui.define(["sap/ui/test/OpaBuilder", "sap/fe/test/Utils"], function(OpaBuilder, Utils) {
	"use strict";

	var ElementStates = {
		focus: function(oElement) {
			// Need to also test the class sapMFocus for some elements that don't match with default jQuery focus selector (sap.m.InputBase)
			return oElement.$().is(":focus") || oElement.$().hasClass("sapMFocus") || oElement.$().find(":focus").length > 0;
		}
	};

	var FEBuilder = function() {
		return OpaBuilder.apply(this, arguments);
	};

	FEBuilder.create = function(oOpaInstance) {
		return new FEBuilder(oOpaInstance);
	};

	FEBuilder.prototype = Object.create(OpaBuilder.prototype);

	FEBuilder.prototype.hasState = function(mState) {
		if (!mState) {
			return this;
		}
		// check explicitly for boolean 'false', falsy value does not suffice
		if (mState.visible === false) {
			this.mustBeVisible(false);
		}
		if (mState.enabled === false) {
			this.mustBeEnabled(false);
		}
		return this.has(FEBuilder.Matchers.states(mState));
	};

	FEBuilder.Matchers = {
		/**
		 * Returns an array of aggregation items fulfilling given matcher(s).
		 *
		 * @param {string} sAggregationName the aggregation name
		 * @param {sap.ui.test.matchers.Matcher | function | Array | Object}
		 *                [vMatchers] the matchers to filter aggregation items
		 * @returns {function} matcher function
		 * @public
		 * @static
		 */
		aggregation: function(sAggregationName, vMatchers) {
			var fnFilter = OpaBuilder.Matchers.filter(vMatchers);
			return function(oControl) {
				return fnFilter(Utils.getAggregation(oControl, sAggregationName));
			};
		},
		state: function(sName, vValue) {
			if (sName in ElementStates) {
				return ElementStates[sName];
			}
			var mProperties = {};
			mProperties[sName] = vValue;
			return OpaBuilder.Matchers.properties(mProperties);
		},
		states: function(mStateMap) {
			if (!Utils.isOfType(mStateMap, Object)) {
				return OpaBuilder.Matchers.TRUE;
			}
			return function(oControl) {
				return Object.keys(mStateMap).every(function(sProperty) {
					return FEBuilder.Matchers.state(sProperty, mStateMap[sProperty])(oControl);
				});
			};
		},
		not: function(vMatchers) {
			var fnMatch = OpaBuilder.Matchers.match(vMatchers);
			return function(oControl) {
				return !fnMatch(oControl);
			};
		},
		allMatch: function(vMatchers) {
			var fnFilterMatcher = OpaBuilder.Matchers.filter(vMatchers);
			return function(aItems) {
				var iExpectedLength = (aItems && aItems.length) || 0;
				return iExpectedLength === fnFilterMatcher(aItems).length;
			};
		}
	};

	FEBuilder.Actions = {};

	return FEBuilder;
});
