/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Macro for creating a Contact based on provided OData v4 metadata.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;
	 * macro:Contact
	 * 	id="someID"
	 *	contact="{contact>}"
	 * 	dataField="{dataField>}"
	 * /&gt;
	 * </pre>
	 * <h3>Annotations evaluated by this macro</h3>
	 * <ul>
	 *    <li>Target <b>property</b>
	 *		<ul>
	 *        <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *			<ul>
	 *				<li>Term <b>fn</b> <br/>
	 *					The Full name for the contact
	 *              </li>
	 *			</ul>
	 *        </li>
	 *        <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *        	<ul>
	 *          	<li>Term <b>title</b><br/>
	 *              	The title of the contact
	 *              </li>
	 *			</ul>
	 *        </li>
	 * 		  <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *        	<ul>
	 *          	<li>Term <b>role</b><br/>
	 *              	The role of the contact
	 *          	</li>
	 *        	</ul>
	 *        </li>
	 *        <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *        	<ul>
	 *          	<li>Term <b>org</b><br/>
	 *              	The organization of the contact
	 *          	</li>
	 *			</ul>
	 *		  </li>
	 * 		  <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *        	<ul>
	 *          	<li>Term <b>photo</b><br/>
	 *              	The photo of the contact
	 *          	</li>
	 *         	</ul>
	 *         </li>
	 * 		   <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *         	<ul>
	 *         		<li>Term <b>adr</b><br/>
	 *              	Array of addresses of the contact
	 *          	</li>
	 *         	</ul>
	 *         </li>
	 * 		   <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *         	<ul>
	 *          	<li>Term <b>email</b><br/>
	 *              	Array of email addresses of the contact
	 *          	</li>
	 *          </ul>
	 *         </li>
	 *     	   <li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+Communication#ContactType}
	 *         	<ul>
	 *          	<li>Term <b>tel</b><br/>
	 *              	Array of telephone numbers of the contact
	 *              </li>
	 *          </ul>
	 *         </li>
	 *      </ul>
	 *    </li>
	 * </ul>
	 *
	 * @class sap.fe.macros.Contact
	 * @hideconstructor
	 * @private
	 * @ui5-restricted
	 * @experimental
	 */
	var Contact = MacroMetadata.extend("sap.fe.macros.Contact", {
		/**
		 * Name of the macro control.
		 */
		name: "Contact",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.Contact",

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
				 * Id for the contact
				 */
				id: {
					type: "string"
				},
				/**
				 * Metadata path to the Contact
				 */
				contact: {
					type: "sap.ui.model.Context",
					$Type: ["com.sap.vocabularies.Communication.v1.ContactType"],
					required: true
				},
				/**
				 * Metadata path to the dataField
				 */
				dataField: {
					type: "sap.ui.model.Context",
					$Type: ["com.sap.vocabularies.UI.v1.DataField", "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"]
				}
			},

			events: {}
		}
	});

	return Contact;
});
