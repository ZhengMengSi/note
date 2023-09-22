/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Macro for creating a FilterField based on provided OData v4 metadata.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:FilterField
	 *   idPrefix="SomePrefix"
	 *   vhIdPrefix="SomeVhPrefix"
	 *   metadataContexts="
	 *     {model: 'SomeModel', path: '/someEntitySet', name: 'entitySet'},
	 *     {model: 'SomeModel', path: '/someEntitySet/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath', name: 'property'}
	 *   " /&gt;
	 * </pre>
	 * <h3>Annotations evaluated by this macro</h3>
	 * <ul>
	 *    <li>Target <b>property</b>
	 *        <ul>
	 *        <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Common com.sap.vocabularies.Common.v1}
	 *                <ul>
	 *                <li>Term <b>Label</b> <br/>
	 *                        The label for the filter field
	 *                    </li>
	 *                </ul>
	 *            </li>
	 *        <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+UI com.sap.vocabularies.UI.v1}
	 *                <ul>
	 *                <li>Term <b>Hidden</b><br/>
	 *                        The filter field will not be created
	 *                    </li>
	 *                <li>Term <b>HiddenFilter</b><br/>
	 *                        The filter field will not be created
	 *                    </li>
	 *                </ul>
	 *            </li>
	 *        </ul>
	 *    </li>
	 *    <li>Target <b>entitySet</b>
	 *        <ul>
	 *        <li>Namespace {@link https://github.com/oasis-tcs/odata-vocabularies/blob/master/vocabularies/Org.OData.Capabilities.V1.md Org.OData.Capabilities.V1}
	 *                <ul>
	 *                <li>Term <b>{@link https://github.com/oasis-tcs/odata-vocabularies/blob/master/vocabularies/Org.OData.Capabilities.V1.md#FilterRestrictionsType FilterRestrictions/NonFilterableProberties}</b><br/>
	 *                        The filter field will not be created, if it is mentioned in a collection of NonFilterableProperties of the entitySet
	 *                    </li>
	 *                </ul>
	 *            </li>
	 *        </ul>
	 *    </li>
	 * </ul>
	 *
	 * @class sap.fe.macros.FilterField
	 * @hideconstructor
	 * @property {string}  idPrefix Prefix added to the generated ID of the filter field. Default: <code>FF</code>
	 * @property {string} vhIdPrefix Prefix added to the generated ID of the value help used for the filter field. Default: <code>FFVH</code>
	 * @property {EntityType} entity Prefix added to the generated ID of the value help used for the filter field. Default: <code>FFVH</code>
	 * @property {sap.fe.macros.MetadataContext[]} metadataContexts A collection of provided metadata contexts. Requires the following contexts:
	 * <ul>
	 *   <li><code>entitySet</code> The entitySet owning the property. In case the property is accessed through an association
	 *    (using a navigation property) it has to be the leading entitySet. E.g. if Property is
	 *        <code>/someEntitySet/someNavigationProperty/SomeProperty</code> and <code>/someEntitySet/someNavigationProperty</code>
	 *        is targeting the entitySet <code>/someOtherEntitySet</code> the expectation is that <code>/someEntitySet</code>
	 *        is passed in the metadataContext.
	 *   </li>
	 *   <li><code>property</code> The property for the filters managed by the filter field</li>
	 * </ul>
	 * @private
	 * @ui5-restricted
	 * @experimental
	 */
	var FilterField = MacroMetadata.extend("sap.fe.macros.FilterField", {
		/**
		 * Name of the macro control.
		 */
		name: "FilterField",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.FilterField",

		/**
		 * The metadata describing the macro control.
		 */
		metadata: {
			/**
			 * Define macro stereotype for documentation purpose
			 */
			stereotype: "xmlmacro",
			/**
			 * Location of the designtime info
			 */
			designtime: "sap/fe/macros/FilterField.designtime",
			/**
			 * Properties.
			 */
			properties: {
				/**
				 * Prefix added to the generated ID of the filter field
				 */
				idPrefix: {
					type: "string",
					defaultValue: "FF"
				},
				/**
				 * Prefix added to the generated ID of the value help used for the filter field
				 */
				vhIdPrefix: {
					type: "string",
					defaultValue: "FFVH"
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
				 * Temporary workaround only
				 * path to valuelist
				 */
				_valueList: {
					type: "sap.ui.model.Context",
					required: false
				}
			},

			events: {}
		}
	});

	return FilterField;
});
