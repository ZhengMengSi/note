// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ushell/components/tiles/utils","sap/ui/core/library","sap/m/MessageBox"],function(e,t,a,i){"use strict";var n=a.ValueState;return e.extend("sap.ushell.components.tiles.action.Configuration",{sEnterValuePlaceHolder:"",sDuplicateErrorMsg:"",sDuplicateErrorTitle:"",sInvalidParmMsg:"",aDefaultObjects:[{obj:"",name:""},{obj:"*",name:"*"}],onConfigurationInputChange:function(e){t.checkTMInput(this.getView(),e)},onInit:function(){var e=this.getView();var a=e.byId("semantic_objectInput");var i=e.byId("navigation_provider_roleInput");var n=e.byId("navigation_provider_instanceInput");var r=e.byId("target_application_aliasInput");var s=e.byId("semantic_actionInput");var o=e.byId("targetTypeInput");var l=t.getResourceBundleModel();e.setModel(l,"i18n");e.setViewName("sap.ushell.components.tiles.action.Configuration");t.createSemanticObjectModel(this,a,this.aDefaultObjects);t.createRoleModel(this,i,n);t.createAliasModel(this,r);t.createActionModel(this,s);t.createNavigationProviderModel(this,o);a.attachChange(function(t){var a=t.getSource().getValue();e.getModel().setProperty("/config/semantic_object",a)});i.attachChange(function(a){var i=a.getSource().getValue();e.getModel().setProperty("/config/navigation_provider_role",i);t.updateAliasModel(e,r)});n.attachChange(function(t){var a=t.getSource().getValue();e.getModel().setProperty("/config/navigation_provider_instance",a)});r.attachChange(function(t){var a=t.getSource().getValue();e.getModel().setProperty("/config/target_application_alias",a)});var c=l.getResourceBundle();this.sEnterValuePlaceHolder=c.getText("configuration.signature.table.valueFieldLbl");this.sDuplicateErrorMsg=c.getText("configuration.signature.uniqueParamMessage.text");this.sDuplicateErrorTitle=c.getText("configuration.signature.uniqueParamMessage.title");this.sInvalidParmMsg=c.getText("configuration.signature.invalidParamMessage.text")},handleMandatoryChange:function(e){var t=e.getParameter("id");var a=sap.ui.getCore().byId(t).getParent().getCells();var i=e.getParameter("checked");if(i){a[2].setEnabled(true);a[2].setPlaceholder(this.sEnterValuePlaceHolder);a[4].setEnabled(false);a[4].setValue("");a[4].setPlaceholder("");a[3].setEnabled(true)}else{a[2].setEnabled(false);a[2].setValue("");a[2].setPlaceholder("");a[4].setEnabled(true);a[4].setPlaceholder(this.sEnterValuePlaceHolder);a[3].setEnabled(false);a[3].setChecked(false)}},addRow:function(){var e=this.getView();var a=e.getModel();var i=a.getProperty("/config/rows");var n=t.getEmptyRowObj();i.push(n);a.setProperty("/config/rows",i)},deleteRow:function(){var e=this.getView();var t=e.getModel();var a=t.getProperty("/config/rows");var i=e.byId("mappingSignatureTable");var n=i.getSelectedIndices();var r=n.sort(function(e,t){return t-e}).slice();for(var s=0;s<r.length;s++){i.removeSelectionInterval(r[s],r[s]);a.splice(r[s],1)}t.setProperty("/config/rows",a)},checkDuplicateNames:function(e){var a=this.getView().getModel();var r=a.getProperty("/config/rows");var s=sap.ui.getCore().byId(e.getParameter("id"));var o=e.getParameter("newValue");if(o!=""&&!/^[\w-/]+$/.test(o)){s.setValueState(n.Error);i.alert(this.sInvalidParmMsg,this.focusNameField.bind(s),this.sDuplicateErrorTitle)}if(t.tableHasDuplicateParameterNames(r)){s.setValueState(n.Error);i.alert(this.sDuplicateErrorMsg,this.focusNameField.bind(s),this.sDuplicateErrorTitle)}else{s.setValueState(n.None)}},focusNameField:function(){this.focus()},onValueHelpRequest:function(e){t.objectSelectOnValueHelpRequest(this,e,false)},onActionValueHelpRequest:function(e){t.actionSelectOnValueHelpRequest(this,e)},onRoleValueHelpRequest:function(e){t.roleSelectOnValueHelpRequest(this,e)},onInstanceValueHelpRequest:function(e){t.instanceSelectOnValueHelpRequest(this,e)},instanceSuggest:function(e){t.instanceSuggest(this,e)},aliasSuggest:function(e){t.aliasSuggest(this,e)},onAliasValueHelpRequest:function(e){t.applicationAliasSelectOnValueHelpRequest(this,e)},onFormFactorChange:function(){var e=this.getView().getModel();e.setProperty("/config/formFactorConfigDefault",false)},onApplicationTypeChange:function(e){var a=e.getParameters();if(a.selectedItem){t.displayApplicationTypeFields(a.selectedItem.getKey(),this.getView())}}})});
//# sourceMappingURL=Configuration.controller.js.map