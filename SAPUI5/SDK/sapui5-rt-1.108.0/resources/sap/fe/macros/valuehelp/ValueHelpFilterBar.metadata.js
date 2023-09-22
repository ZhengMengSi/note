/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/fe/core/converters/controls/ListReport/FilterBar","sap/fe/core/converters/MetaModelConverter","sap/fe/core/helpers/ModelHelper","sap/fe/core/TemplateModel","sap/fe/macros/MacroMetadata"],function(e,t,a,r,l,o){"use strict";var i=a.getInvolvedDataModelObjects;var s=t.getSelectionFields;var n=t.getExpandFilterFields;var p=o.extend("sap.fe.macros.valuehelp.ValueHelpFilterBar",{name:"ValueHelpFilterBar",namespace:"sap.fe.macros.valuehelp",fragment:"sap.fe.macros.valuehelp.ValueHelpFilterBar",metadata:{stereotype:"xmlmacro",designtime:"sap/fe/macros/valuehelp/ValueHelpFilterBar.designtime",properties:{id:{type:"string"},contextPath:{type:"sap.ui.model.Context"},hideBasicSearch:{type:"boolean",defaultValue:false},enableFallback:{type:"boolean",defaultValue:false},p13nMode:{type:"sap.ui.mdc.FilterBarP13nMode[]"},useSemanticDateRange:{type:"boolean",defaultValue:true},liveMode:{type:"boolean",defaultValue:false},_valueList:{type:"sap.ui.model.Context",required:false},selectionFields:{type:"sap.ui.model.Context",required:false},filterConditions:{type:"string",required:false},suspendSelection:{type:"boolean",defaultValue:false},expandFilterFields:{type:"boolean",defaultValue:true}},events:{search:{type:"function"},filterChanged:{type:"function"}}},create:function(t,a,o){var p=t.contextPath;if(!p){e.error("Context Path not available for FilterBar Macro.");return}var d=p.getPath();var c=r.getEntitySetPath(d);var u=p.getModel();var f;if(!t.selectionFields){var v=t.metaPath;var m=v&&v.getPath();var g=i(p);f=this.getConverterContext(g,undefined,o);var F=s(f,[],m).selectionFields;t.selectionFields=new l(F,u).createBindingContext("/")}if(u.getObject(c+"@com.sap.vocabularies.Common.v1.DraftRoot")||u.getObject(c+"@com.sap.vocabularies.Common.v1.DraftNode")){t.showDraftEditState=true}var h=u.getObject(c+"@Org.OData.Capabilities.V1.FilterRestrictions");t.expandFilterFields=n(f,h,t._valueList);return t}});return p},false);
//# sourceMappingURL=ValueHelpFilterBar.metadata.js.map