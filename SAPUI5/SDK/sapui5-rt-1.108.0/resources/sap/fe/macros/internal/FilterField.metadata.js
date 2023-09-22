/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/macros/MacroMetadata"],function(e){"use strict";var t=e.extend("sap.fe.macros.internal.FilterField",{name:"FilterField",namespace:"sap.fe.macros.internal",fragment:"sap.fe.macros.internal.FilterField",metadata:{stereotype:"xmlmacro",designtime:"sap/fe/macros/internal/FilterField.designtime",properties:{idPrefix:{type:"string",defaultValue:"FilterField"},vhIdPrefix:{type:"string",defaultValue:"FilterFieldValueHelp"},contextPath:{type:"sap.ui.model.Context",required:true},property:{type:"sap.ui.model.Context",required:true,$kind:["Property"]},_valueList:{type:"sap.ui.model.Context",required:false},useSemanticDateRange:{type:"boolean",defaultValue:true},settings:{type:"string",defaultValue:""},navigationPrefix:{type:"string"},visualFilter:{type:"sap.ui.model.Context"},_visualFilter:{type:"boolean"},required:{type:"boolean",defaultValue:false}},events:{}}});return t},false);
//# sourceMappingURL=FilterField.metadata.js.map