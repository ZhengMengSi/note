/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

// Provides the Design Time Metadata for the sap.fe.macros.FilterField macro.
sap.ui.define(
	[],
	function() {
		"use strict";
		return {
			annotations: {
				/**
				 * Defines that a property is not displayed. As a consequence the filter field will not be created by the macro
				 * In contrast to <code>HiddenFilter</code>, a property annotated with <code>Hidden</code> is not used as a filter.
				 *
				 * <i>Example in OData V4 notation with hidden ProductPictureURL</i>
				 *
				 * <pre>
				 *     &lt;Annotations Target=&quot;ProductPictureURL&quot; &gt;
				 *         &lt;Annotation Term=&quot;com.sap.vocabularies.UI.v1.Hidden&quot;/&gt;
				 *     &lt;/Annotations&gt;
				 * </pre>
				 */
				hidden: {
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "Hidden",
					target: ["Property"],
					appliesTo: ["filterItem/hidden", "property/visible"],
					group: ["Behavior"],
					since: "1.67"
				},
				/**
				 * Defines that a property is not displayed as a filter. As a consequence the filter field will not be created by the macro
				 *
				 * <i>Example in OData V4 notation with invisible, filterable property "LocationName"</i>
				 * <pre>
				 *     &lt;Annotations Target=&quot;LocationName&quot; &gt;
				 *         &lt;Annotation Term=&quot;com.sap.vocabularies.UI.v1.HiddenFilter&quot;/&gt;
				 *     &lt;/Annotations&gt;
				 * </pre>
				 */
				hiddenFilter: {
					namespace: "com.sap.vocabularies.UI.v1",
					annotation: "HiddenFilter",
					target: ["Property"],
					appliesTo: ["filterItem/hiddenFilter"],
					group: ["Behavior"],
					since: "1.67"
				}
			}
		};
	},
	/* bExport= */ false
);
