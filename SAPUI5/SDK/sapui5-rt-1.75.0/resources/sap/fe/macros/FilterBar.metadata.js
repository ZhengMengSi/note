/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var F=M.extend("sap.fe.macros.FilterBar",{name:"FilterBar",namespace:"sap.fe.macros",fragment:"sap.fe.macros.FilterBar",metadata:{stereotype:"xmlmacro",properties:{id:{type:"string"},entitySet:{type:"sap.ui.model.Context",required:true,$kind:"EntitySet"},hideBasicSearch:{type:"boolean",defaultValue:false},enableFallback:{type:"boolean",defaultValue:false},showAdaptFiltersButton:{type:"boolean",defaultValue:false},p13nMode:{type:"sap.ui.mdc.FilterBarP13nMode[]"},listBindingNames:{type:"string"},liveMode:{type:"boolean",defaultValue:false},draftEditStateModelName:{type:"string",defaultValue:false}},events:{search:{type:"function"},filtersChanged:{type:"function"}}}});return F;});
