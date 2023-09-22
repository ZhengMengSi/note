/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Macro for creating a ValueHelp based on provided OData v4 metadata.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:ValueHelp
	 *   idPrefix="SomePrefix"
	 *   entitySet="{someEntitySet>}"
	 *   property="{someProperty>}"
	 *   conditionModel="$filter"
	 *   /&gt
	 * </pre>
	 * <h3>Annotations evaluated by this macro</h3>
	 * <ul>
	 * <li>@com.sap.vocabularies.Common.v1.ValueListReferences</li>
	 * <li>@com.sap.vocabularies.Common.v1.ValueListMapping</li>
	 * <li>@com.sap.vocabularies.Common.v1.ValueList</li>
	 *
	 * <li>@com.sap.vocabularies.Common.v1.Text</li>
	 * <li>@com.sap.vocabularies.UI.v1.HiddenFilter</li>
	 * <li>@com.sap.vocabularies.UI.v1.Hidden</li>
	 * </ul>
	 *
	 * @class sap.fe.macros.ValueHelp
	 * @hideconstructor
	 * @property {string}  idPrefix Prefix added to the generated ID of the Value Help. Default: <code>VH</code>
	 * @property {EntityType} entity Prefix added to the generated ID of the value help used for the filter field. Default: <code>FFVH</code>
	 * @property {sap.fe.macros.MetadataContext} entitySet The entitySet owning the property
	 * @property {sap.fe.macros.MetadataContext} property The property
	 * @property {string} conditionModel Indicator whether the field help is for a filter field. Then it is set to "$filter"
	 * @private
	 * @ui5-restricted
	 * @experimental
	 */
	var ValueHelp = MacroMetadata.extend("sap.fe.macros.ValueHelp", {
		/**
		 * Name of the macro control.
		 */
		name: "ValueHelp",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.ValueHelp",

		/**
		 * The metadata describing the macro control.
		 */
		metadata: {
			/**
			 * Define macro stereotype for documentation purpose
			 */
			stereotype: "xmlmacro",
			/**
			 * Properties.
			 */
			properties: {
				/**
				 * Prefix added to the generated ID of the value help
				 */
				idPrefix: {
					type: "string",
					defaultValue: "VH"
				},
				/**
				 * Metadata path to the entity set
				 */
				entitySet: {
					type: "sap.ui.model.Context",
					required: true,
					$kind: "EntitySet"
				},
				/**
				 * Metadata path to the property
				 */
				property: {
					type: "sap.ui.model.Context",
					required: true,
					$kind: "Property"
				},
				/**
				 * Indicator whether the field help is for a filter field
				 */
				conditionModel: {
					type: "string",
					defaultValue: ""
				},
				/**
				 * Enforce to display a value help for this field. Necessary if no value help is annotated,
				 * but a value help with just the condition tab should be available
				 */
				forceValueHelp: {
					type: "boolean",
					defaultValue: false
				}
			},

			events: {}
		}
	});

	return ValueHelp;
});
