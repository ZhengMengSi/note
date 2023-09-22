/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["./MacroMetadata"],function(M){"use strict";var C=M.extend("sap.fe.macros.Contact",{name:"Contact",namespace:"sap.fe.macros",fragment:"sap.fe.macros.Contact",metadata:{stereotype:"xmlmacro",properties:{id:{type:"string"},contact:{type:"sap.ui.model.Context",$Type:["com.sap.vocabularies.Communication.v1.ContactType"],required:true},dataField:{type:"sap.ui.model.Context",$Type:["com.sap.vocabularies.UI.v1.DataField","com.sap.vocabularies.UI.v1.DataFieldForAnnotation"]}},events:{}}});return C;});
