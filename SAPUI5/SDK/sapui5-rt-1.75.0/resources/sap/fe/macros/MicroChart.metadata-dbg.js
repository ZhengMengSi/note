/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Macro for creating a MicroChart based on provided OData v4 metadata.
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:MicroChart
	 *	id="someID"
	 *	groupId="$auto.microCharts"
	 *	collection="{entitySet>}"
	 *	chartAnnotation="{chartAnnotation>}"
	 * /&gt;
	 * </pre>
	 * <h3>Annotations evaluated by this macro</h3>
	 * <ul>
	 * 	<li>Target <b>chartAnnotation</b>
	 *		<ul>
	 *  		<li>Namespace {@link https://wiki.scn.sap.com/wiki/display/EmTech/OData+4.0+Vocabularies+-+SAP+UI com.sap.vocabularies.UI.v1}
	 *				<ul>
	 *  				<li>Term <b>Chart</b><br/>
	 * 						Chart Annotations
	 *	 				</li>
	 * 				</ul>
	 * 			</li>
	 * 		</ul>
	 *	</li>
	 *  <li>Target <b>entitySet</b>
	 *        <ul>
	 *        <li>Namespace {@link https://github.com/oasis-tcs/odata-vocabularies/blob/master/vocabularies/Org.OData.Capabilities.V1.md Org.OData.Capabilities.V1}
	 *                <ul>
	 *                <li>Term <b>{@link https://github.com/oasis-tcs/odata-vocabularies/blob/master/vocabularies/Org.OData.Capabilities.V1.md#FilterRestrictionsType FilterRestrictions/NonFilterableProberties}</b><br/>
	 *                        The filter field will not be created, if it is mentioned in a collection of NonFilterableProperties of the entitySet
	 *                    </li>
	 *                </ul>
	 *            </li>
	 *        </ul>
	 *  </li>
	 * </ul>
	 *
	 * @class sap.fe.macros.MicroChart
	 * @hideconstructor
	 * @ui5-restricted
	 * @experimental
	 */
	var MicroChart = MacroMetadata.extend("sap.fe.macros.MicroChart", {
		/**
		 * Name of the macro control.
		 */
		name: "MicroChart",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.MicroChart",

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
			// designtime: "sap/fe/macros/MicroChart.designtime",
			/**
			 * Properties.
			 */
			properties: {
				/**
				 * Metadata path to the entitySet or navigationProperty
				 */
				collection: {
					type: "sap.ui.model.Context",
					required: true,
					$kind: ["EntitySet", "NavigationProperty"]
				},
				/**
				 * Metadata path to the chart annotations
				 */
				chartAnnotation: {
					type: "sap.ui.model.Context",
					required: true
				},
				/**
				 * ID of the MicroChart
				 */
				id: {
					type: "string"
				},
				/**
				 * To control rendering of Title, Subtitle and Currency Labels.
				 */
				renderLabels: {
					type: "boolean",
					defaultValue: true
				},
				/**
				 * GroupId to group the requests from the Micro Chart
				 */
				groupId: {
					type: "string",
					defaultValue: ""
				},
				/**
				 * Title for the micro chart. If not provided, title from chart annotations is considered. Rendered only if 'renderLabels' is not <false>.
				 */
				title: {
					type: "string",
					defaultValue: ""
				},
				/**
				 * Description for the micro chart. If not provided, description from chart annotations is considered. Rendered only if 'renderLabels' is not <false>.
				 */
				description: {
					type: "string",
					defaultValue: ""
				}
			},

			events: {}
		}
	});

	return MicroChart;
});
