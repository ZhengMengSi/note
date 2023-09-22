/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Fragment","sap/ui/core/XMLTemplateProcessor"],function(F,X){"use strict";var t={init:function(){if(!sap.fe.templates){sap.fe.templates={};}sap.fe.templates.VariantManagement={None:"None",Page:"Page",Control:"Control"};if(!sap.fe.templates.ObjectPage){sap.fe.templates.ObjectPage={};}sap.fe.templates.ObjectPage.SectionLayout={Page:"Page",Tabs:"Tabs"};}};F.registerType("CUSTOM",{init:function(s){this._oContainingView=this;this.oController=s.containingView.getController().createExtensionAPI();this._aContent=X.parseTemplate(s.fragmentContent,this);}});return t;},false);
