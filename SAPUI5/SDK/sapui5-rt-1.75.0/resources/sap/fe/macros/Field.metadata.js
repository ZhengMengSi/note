/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var F=M.extend("sap.fe.macros.Field",{name:"Field",namespace:"sap.fe.macros",fragment:"sap.fe.macros.Field",metadata:{stereotype:"xmlmacro",properties:{idPrefix:{type:"string"},vhIdPrefix:{type:"string",defaultValue:"FieldValueHelp"},entitySet:{type:"sap.ui.model.Context",required:true,$kind:["EntitySet","NavigationProperty"]},dataField:{type:"sap.ui.model.Context",required:true,$kind:"Property",$Type:["com.sap.vocabularies.UI.v1.DataField","com.sap.vocabularies.UI.v1.DataFieldWithUrl","com.sap.vocabularies.UI.v1.DataFieldForAnnotation","com.sap.vocabularies.UI.v1.DataFieldForAction","com.sap.vocabularies.UI.v1.DataPointType"]},editMode:{type:"sap.ui.mdc.EditMode",defaultValue:"Display"},createMode:{type:"boolean",defaultValue:"false"},parentControl:{type:"string"},wrap:{type:"boolean"},"class":{type:"string"}},events:{onChange:{type:"function"},onCallAction:{type:"function"}}}});return F;});
