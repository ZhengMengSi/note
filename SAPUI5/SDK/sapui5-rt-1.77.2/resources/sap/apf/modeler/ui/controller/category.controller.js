/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");jQuery.sap.require("sap.apf.modeler.ui.utils.nullObjectChecker");jQuery.sap.require("sap.apf.modeler.ui.utils.viewValidator");(function(){"use strict";var p,t,c,C,T,o,v;var n=sap.apf.modeler.ui.utils.nullObjectChecker;function _(g){g.byId("idCategoryBasicData").setText(t("categoryData"));g.byId("idCategoryTitleLabel").setText(t("categoryTitle"));g.byId("idCategoryTitle").setPlaceholder(t("newCategory"));g.byId("idTotalStepsLabel").setText(t("totalSteps"));}function a(g){var s;if(p&&p.arguments&&p.arguments.categoryId){o=C.getCategory(p.arguments.categoryId);}if(!n.checkIsNotUndefined(o)){s=C.setCategory();o=C.getCategory(s);b(g);}}function b(g,h){var i={id:o.getId(),icon:"sap-icon://open-folder"};if(h){delete i.icon;i.name=h;}g.getView().getViewData().updateSelectedNode(i);}function d(g,h){var s=t("category")+": "+h;g.getView().getViewData().updateTitleAndBreadCrumb(s);}function e(g){if(!n.checkIsNotNullOrUndefinedOrBlank(C.getCategory(p.arguments.categoryId))){return;}if(n.checkIsNotNullOrUndefinedOrBlank(o.labelKey)&&T.get(o.labelKey)){g.byId("idCategoryTitle").setValue(T.get(o.labelKey).TextElementDescription);}else{g.byId("idCategoryTitle").setValue(o.getId());}}function f(g){var h=C.getCategoryStepAssignments(o.getId()).length;g.byId("idTotalSteps").setValue(h);}sap.ui.controller("sap.apf.modeler.ui.controller.category",{onInit:function(){var g=this;var V=g.getView().getViewData();t=V.getText;p=V.oParams;c=V.oConfigurationHandler;T=c.getTextPool();C=V.oConfigurationEditor;if(!C){c.loadConfiguration(p.arguments.configId,function(h){C=h;});}v=new sap.apf.modeler.ui.utils.ViewValidator(g.getView());_(g);a(g);g.setDetailData();v.addField("idCategoryTitle");},onAfterRendering:function(){if(this.getView().byId("idCategoryTitle").getValue().length===0){this.getView().byId("idCategoryTitle").focus();}},setDetailData:function(){var g=this;e(g);f(g);},handleChangeDetailValue:function(E){var g=this,h;var s=g.byId("idCategoryTitle").getValue().trim();var i=sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;if(n.checkIsNotNullOrUndefinedOrBlank(s)){T.setTextAsPromise(s,i).done(function(j){h={labelKey:j};C.setCategory(h,o.getId());b(g,s);d(g,s);C.setIsUnsaved();});}else{C.setIsUnsaved();}},handleSuggestions:function(E){var g=sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;var s=new sap.apf.modeler.ui.utils.SuggestionTextHandler(T);s.manageSuggestionTexts(E,g);},updateSubViewInstancesOnReset:function(g){C=g;o=C.getCategory(o.getId());},getValidationState:function(){return v.getValidationState();},onExit:function(){v=null;}});})();