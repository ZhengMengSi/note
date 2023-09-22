/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Macro for creating a FormContainer based on provided OData v4 metadata.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:FormContainer
	 *   id="SomeId"
	 *   idPrefix="SomePrefix"
	 *   vhIdPrefix="SomeVhPrefix"
	 *   entitySet="{entitySet>}"
	 *   dataFieldCollection ="{dataFieldCollection>}"
	 *   editMode="Editable"
	 *   createMode="true"
	 *   title="someTitle"
	 *   navigationPath="/SalesOrderManage"
	 *   visibilityPath="false"
	 *   onChange=".handlers.onFieldValueChange"
	 * /&gt;
	 * </pre>
	 * <h3>Annotations evaluated by this macro</h3>
	 * <ul>
	 *    <li>Target <b>property</b>
	 *        <ul>
	 *        	<li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+UI com.sap.vocabularies.UI.v1}
	 *                <ul>
	 * 					  <li>Term <b>Hidden</b><br/>
	 *                        The data field will not be visible
	 *                    </li>
	 *                </ul>
	 *            </li>
	 *        </ul>
	 *    </li>
	 * </ul>
	 *
	 * @class sap.fe.macros.FormContainer
	 * @hideconstructor
	 * @private
	 * @ui5-restricted
	 * @experimental
	 */
	var FormContainer = MacroMetadata.extend("sap.fe.macros.FormContainer", {
		/**
		 * Name of the macro control.
		 */
		name: "FormContainer",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.FormContainer",

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
			// designtime: "sap/fe/macros/FormContainer.designtime",
			/**
			 * Properties.
			 */
			properties: {
				/**
				 * id of the FormContainer
				 */
				id: {
					type: "string"
				},
				/**
				 * Metadata path to the entity set
				 */
				entitySet: {
					type: "sap.ui.model.Context",
					required: true,
					$kind: ["EntitySet", "NavigationProperty"]
				},
				/**
				 * Metadata path to the dataFieldCollection
				 */
				dataFieldCollection: {
					type: "sap.ui.model.Context"
				},

				/**
				 * Control the edit mode of the form (Display,Editable,ReadOnly,Disabled) / Default: Display
				 */
				editMode: {
					type: "string",
					defaultValue: "Display"
				},
				/**
				 * Control the create mode of the form container (true, false)/ Default: false
				 */
				createMode: {
					type: "string",
					defaultValue: "false"
				},
				/**
				 * Title of the form container
				 */
				title: {
					type: "string"
				},
				/**
				 * binding the form container using a navigation path
				 */
				navigationPath: {
					type: "string"
				},
				/**
				 * binding the visibility of the form container using a propertyPath
				 */ visibilityPath: {
					type: "string"
				}
			},

			events: {
				/**
				 * Change handler name
				 */
				onChange: {
					type: "function"
				}
			}
		}
	});

	return FormContainer;
});
