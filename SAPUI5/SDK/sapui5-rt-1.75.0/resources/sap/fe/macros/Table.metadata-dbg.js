/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["./MacroMetadata"], function(MacroMetadata) {
	"use strict";

	/**
	 * @classdesc
	 * Macro for creating a Table based on provided OData v4 metadata.
	 *
	 *
	 * Usage example:
	 * <pre>
	 * &lt;macro:Table
	 *   collection="{EntitySet>}"
	 *   presentation="{LineItem>}"
	 *   id="SomeID"
	 *   rowsBindingInfo="{ui5object: true, path:'/SalesOrderManage',parameters:{$select: 'isVerified', $count : true }}"
	 *   navigationPath="/SalesOrderManage"
	 *   editMode="Display"
	 *   rowPress=".routing.navigateToNewPage()"
	 *   rowAction="Navigation"
	 *   selectionMode="Multi"
	 *   busy="{ui>/busy}"
	 *   onCallAction=".transaction.onCallAction"
	 *   onCreate=".editFlow.createDocument"
	 *   creatable="true"
	 *   selectedContextsModel="localUI"
	 *   groupId="$auto.associations"
	 *   showCreate="true"
	 *   showDelete="true"
	 *   onDelete=".editFlow.deleteDocument"
	 *   threshold="30"
	 *   noDataText="No data found. Try adjusting the filter settings."
	 *   onDataReceived=".editFlow.handleError"
	 *   creationMode="Inline"
	 *   autoBindOnInit="true"
	 *   createAtEnd="false"
	 *   namedBindingId="fe::table::SalesOrderManage::myTable"
	 *   p13nMode="Sort,Column"
	 *   enableControlVM="false"
	 *   tableType= "ResponsiveTable"
	 * /&gt;
	 * </pre>
	 *
	 * @class sap.fe.macros.Table
	 * @hideconstructor
	 * @private
	 * @ui5-restricted
	 * @experimental
	 */

	var Table = MacroMetadata.extend("sap.fe.macros.Table", {
		/**
		 * Name of the macro control.
		 */
		name: "Table",
		/**
		 * Namespace of the macro control
		 */
		namespace: "sap.fe.macros",
		/**
		 * Fragment source of the macro (optional) - if not set, fragment is generated from namespace and name
		 */
		fragment: "sap.fe.macros.Table",
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
				collection: {
					type: "sap.ui.model.Context",
					required: true,
					$kind: ["EntitySet", "NavigationProperty"]
				},
				parentEntitySet: {
					type: "sap.ui.model.Context"
				},
				presentation: {
					type: "sap.ui.model.Context",
					required: true
				},
				columnSettings: {
					type: "sap.ui.model.Context"
				},
				id: {
					type: "string"
				},
				rowsBindingInfo: {
					type: "object"
				},
				navigationPath: {
					type: "string"
				},
				editMode: {
					type: "string",
					defaultValue: "Display"
				},
				rowPress: {
					type: "function"
				},
				rowAction: {
					type: "string",
					defaultValue: null
				},
				selectionMode: {
					type: "string",
					defaultValue: "None"
				},
				busy: {
					type: "string"
				},
				onCallAction: {
					type: "function"
				},
				onCreate: {
					type: "function"
				},
				creatable: {
					type: "boolean",
					defaultValue: true
				},
				selectedContextsModel: {
					type: "string"
				},
				groupId: {
					type: "string"
				},
				showCreate: {
					type: "boolean",
					defaultValue: false
				},
				showDelete: {
					type: "boolean",
					defaultValue: false
				},
				onDelete: {
					type: "function"
				},
				threshold: {
					type: "string",
					defaultValue: undefined
				},
				noDataText: {
					type: "string"
				},
				onDataReceived: {
					type: "function"
				},
				creationMode: {
					type: "string",
					defaultValue: "Inline"
				},
				autoBindOnInit: {
					type: "boolean",
					defaultValue: true
				},
				createAtEnd: {
					type: "boolean",
					defaultValue: false
				},
				p13nMode: {
					type: "array"
				},
				enableControlVM: {
					type: "boolean",
					defaultValue: false
				},
				tableType: {
					type: "string",
					defaultValue: "ResponsiveTable"
				},
				filter: {
					type: "string"
				}
			},
			events: {}
		},
		create: function(oProps) {
			if (oProps.columnSettings) {
				var sEntitySetName = oProps.presentation.getObject("@sapui.name");
				if (oProps.navigationPath !== "") {
					sEntitySetName = oProps.navigationPath + "/" + sEntitySetName;
				}
				oProps.columnSettings.sPath = "/controlConfiguration/" + sEntitySetName + "/columnSettings";
			}
			return oProps;
		}
	});
	return Table;
});
