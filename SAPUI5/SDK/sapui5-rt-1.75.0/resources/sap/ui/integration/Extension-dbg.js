/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
		'sap/ui/core/Element'],
	function (Element) {
		"use strict";

		/**
		 * Constructor for a new <code>Extension</code>.
		 *
		 * @param {string} [sId] ID for the new data provider, generated automatically if no ID is given.
		 * @param {object} [mSettings] Initial settings for the new data provider.
		 *
		 * @class
		 *
		 *
		 * @extends sap.ui.base.ManagedObject
		 *
		 * @author SAP SE
		 * @version 1.75.0
		 *
		 * @constructor
		 * @experimental
		 * @since 1.75
		 * @alias sap.ui.integration.Extension
		 */
		var Extension = Element.extend("sap.ui.integration.Extension", {
			metadata: {
				library: "sap.ui.integration",
				properties: {
					/**
					 * The actions
					 */
					actions: {
						type: "array"
					}
				},
				events: {

					onAction: {

						allowPreventDefault: true,

						parameters: {
							card: {type: "sap.ui.core.Control"},
							actionConfig: {type: 'object'},

							/**
							 * The action source.
							 */
							actionSource: {
								type: "sap.ui.core.Control"
							},

							/**
							 * The manifest parameters related to the triggered action.
							 */
							manifestParameters: {
								type: "object"
							},

							/**
							 * The type of the action.
							 */
							type: {
								type: "sap.ui.integration.CardActionType"
							}
						}
					}
				}
			}
		});

		return Extension;
	});