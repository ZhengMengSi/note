/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/zen/dsh/utils/BaseHandler"],function(jQuery,e,t){"use strict";var n=function(){var e=this;t.apply(this,arguments);this.sLocalizationPrefix="com.sap.zen.firefly.impl.";this.oRessources=jQuery.sap.resources({url:sap.ui.resource("sap.zen.dsh","i18n/localization/localization.properties")});this.getRuntimeText=function(t){return e.oRessources.getText(e.sLocalizationPrefix+t)};function n(e){if(e&&e.condition&&e.condition.thresholds){e.condition.thresholds=e.condition.thresholds.map(function(e){if(typeof e.value1!=="number"){e.value1=Number(e.value1)}if(e.value2&&typeof e.value2!=="number"){e.value2=Number(e.value2)}return e})}}this.create=function(e,t){n(t);var i=new sap.ui.model.json.JSONModel;i.setData(t);var a=e||new sap.m.Button(t.id,{visible:false});var s=o(i);a.ZEN_ConditionsDialog=s;a.exit=function(){if(a.ZEN_ConditionsDialog){a.ZEN_ConditionsDialog.destroy();a.ZEN_ConditionsDialog=null}};s.open();return a};function o(t){var n=new sap.m.Dialog({resizable:true,draggable:true,contentHeight:"420px",contentWidth:"715px"});var o=new sap.m.VBox({fitContainer:true});var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");var u=i(t);var l=u.getContent()[0];var d=s();o.addItem(u);o.addItem(a(l));o.addItem(d);n.addContent(o);n.addButton(new sap.m.Button({text:r.getText("VALUEHELPDLG_OK"),press:function(){new Function(e.prepareCommand(n.getModel().getProperty("/submitCommand"),"__JSON__",JSON.stringify({thresholds:l.getConditions(),dimensionEvaluationType:d.getContent()[1].getSelectedItem().getKey(),evaluateRulesWithAnd:Boolean(d.getContent()[3].getSelectedIndex())})))();n.close()},layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow})}));n.addButton(new sap.m.Button({text:r.getText("VALUEHELPDLG_CANCEL"),press:function(){n.close()},layoutData:new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow})}));n.setTitle(e.getRuntimeText("CONDITIONSDLG_TITLE"));n.attachBeforeOpen(function(){l.setConditions(t.getProperty("/condition/thresholds"))});n.setModel(t);return n}function i(t){var n=new sap.m.P13nFilterPanel({containerQuery:true,maxExcludes:0,items:{path:"/measures",template:new sap.m.P13nItem({columnKey:"{key}",text:"{text}",type:"numeric"})}});var o=n._oIncludeFilterPanel;var i=o._getFormatedConditionText;o._getFormatedConditionText=function(e,t,n,a,s){var r=i.apply(o,arguments);if(r!==""){return r}var u="";if(t!==""&&t!==undefined){var l=null;if(this._aKeyFields&&this._aKeyFields.length>1){for(var d=0;d<this._aKeyFields.length;d++){var p=this._aKeyFields[d];if(typeof p!=="string"){if(p.key===s&&p.text){l=p.text;break}}}}u=e+" "+t;if(l&&u!==""){u=l+": "+u}}return u};o._fillOperationListItems=function(t,n,i){if(i==="_STRING_"){i=""}if(i==="_TIME_"){i="_DATE_"}if(i==="_BOOLEAN_"){i=""}t.destroyItems();for(var a in n){var s=n[a],r;if(s.indexOf("ZEN")===0){r=e.getRuntimeText("CONDITIONPANEL_OPTION"+i+n[a])}else{r=o._oRb.getText("CONDITIONPANEL_OPTION"+i+n[a]);if(jQuery.sap.startsWith(r,"CONDITIONPANEL_OPTION")){r=o._oRb.getText("CONDITIONPANEL_OPTION"+n[a])}}t.addItem(new sap.ui.core.ListItem({key:n[a],text:r,tooltip:r}))}};n.setIncludeOperations([sap.m.P13nConditionOperation.EQ,"ZENNEQ",sap.m.P13nConditionOperation.BT,sap.m.P13nConditionOperation.LT,sap.m.P13nConditionOperation.LE,sap.m.P13nConditionOperation.GT,sap.m.P13nConditionOperation.GE,"ZENTopN","ZENTopPercent","ZENTopSum","ZENBottomN","ZENBottomPercent","ZENBottomSum"],"numeric");n.setConditions(t.getProperty("/condition/thresholds"));return new sap.ui.layout.form.SimpleForm({editable:true,title:e.getRuntimeText("CONDITIONSDLG_RULES"),content:[n]})}function a(t){return new sap.m.Button({text:e.getRuntimeText("CONDITIONSDLG_ADDITIONAL_RemoveAllRules"),icon:"sap-icon://undo",press:function(){t.setConditions([])}})}function s(){var t=new sap.ui.layout.form.SimpleForm({editable:true,title:e.getRuntimeText("CONDITIONSDLG_ADDITIONAL_SETTINGS")});t.addContent(new sap.m.Label({text:e.getRuntimeText("CONDITIONPANEL_OPTION_ZENTypeOfDimensionEvaluation")}));t.addContent(new sap.m.Select({selectedKey:"{/condition/dimensionEvaluationType}",items:[new sap.ui.core.Item({key:"mostDetailedOnRows",text:e.getRuntimeText("CONDITIONPANEL_OPTION_ZENDetailsOnRows")}),new sap.ui.core.Item({key:"mostDetailedOnCols",text:e.getRuntimeText("CONDITIONPANEL_OPTION_ZENDetailsOnColumns")}),new sap.ui.core.Item({key:"allInDrilldown",text:e.getRuntimeText("CONDITIONPANEL_OPTION_ZENIndependent")})]}));t.addContent(new sap.m.Label({text:e.getRuntimeText("CONDITIONPANEL_OPTION_ZENEvaluateRulesWith")}));t.addContent(new sap.m.RadioButtonGroup({selectedIndex:0,buttons:[new sap.m.RadioButton({text:e.getRuntimeText("CONDITIONPANEL_OPTION_ZENOr")}),new sap.m.RadioButton({text:e.getRuntimeText("CONDITIONPANEL_OPTION_ZENAnd")})]}));return t}this.update=function(e,t,o){if(e&&t){n(t);var i=e.ZEN_ConditionsDialog;if(i){i.getModel().setProperty("/",t);if(!i.isOpen()){i.open()}}else{this.create(e,t,o)}}};this.getType=function(){return"conditions_dialog"}};var o=new n;t.dispatcher.addHandlers(o.getType(),o);return o});
//# sourceMappingURL=conditionsdialog_handler.js.map