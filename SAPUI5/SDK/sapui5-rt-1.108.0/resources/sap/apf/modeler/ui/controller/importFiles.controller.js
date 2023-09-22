/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/controller/overwriteExistingConfiguration","sap/apf/modeler/ui/utils/nullObjectChecker"],function(e,t){"use strict";var i,l,a,o,r;function n(e){var t=i.getText;e.byId("idImportFilesDialog").setTitle(t("importConfig"));e.byId("idJsonFileLabel").setText(t("jsonFile"));e.byId("idJsonFileUploader").setPlaceholder(t("jsonFileInputPlaceHolder"));e.byId("idTextFileLabel").setText(t("textFile"));e.byId("idTextFileUploader").setPlaceholder(t("textFileInputPlaceHolder"));e.byId("idUploadOfConfig").setText(t("upload"));e.byId("idCancelImportOfConfig").setText(t("cancel"))}function s(e,t,l,a){var r=new sap.ui.core.CustomData({value:{callbackOverwrite:t,callbackCreateNew:l}});o=sap.ui.xmlfragment("idOverwriteConfirmationFragment","sap.apf.modeler.ui.fragment.overwriteConfirmation",e);e.getView().addDependent(o);e.setOverwriteConfirmationDialogText(i.getText);o.removeAllCustomData();o.addCustomData(r);sap.ui.core.Fragment.byId("idOverwriteConfirmationFragment","idNewConfigTitleInput").setValue(a);o.open()}function d(e){var t=i.createMessageObject({code:e});i.putMessage(t)}function c(e,a,o){var r=this;var n=r.byId("idTextFileUploader");if(!t.checkIsNotUndefined(o)){l.fireEvent("updateAppListEvent");d("11515");if(n&&n.getValue()){n.upload()}else{r.closeAllOpenDialogs()}}else{var s=i.createMessageObject({code:"11502"});s.setPrevious(o);i.putMessage(s);r.closeAllOpenDialogs()}}function p(e,l){i.importTexts(l,function(e){if(!t.checkIsNotUndefined(e)){d("11516")}else{var l=i.createMessageObject({code:"11503"});l.setPrevious(e);i.putMessage(l)}});e.closeAllOpenDialogs()}return e.extend("sap.apf.modeler.ui.controller.importFiles",{onInit:function(){var e=this;i=e.getView().getViewData().oCoreApi;l=e.getView().getViewData().oParentControl;i.getApplicationHandler(function(e,l){if(e&&!t.checkIsNotUndefined(l)){a=e}else{var o=i.createMessageObject({code:"11508"});o.setPrevious(l);i.putMessage(o)}});n(e);e.byId("idImportFilesDialog").setInitialFocus("true");e.byId("idImportFilesDialog").open()},addAcceptAttribute:function(){var e=this;var t=jQuery("#"+e.getView().getId()+"--idJsonFileUploader-fu");var i=jQuery("#"+e.getView().getId()+"--idTextFileUploader-fu");t.attr("accept",".json");i.attr("accept",".properties")},handleTypeMissmatchForJSONFile:function(){d("11517")},handleTypeMissmatchForPropertiesFile:function(){d("11518")},handleJSONFileUploadComplete:function(e){var t=this;var l=e.getSource().oFileUpload.files[0];if(l){var a=new FileReader;a.readAsText(l,"UTF-8");a.onload=function(e){r=JSON.parse(e.target.result).configHeader.Application;i.importConfiguration(JSON.stringify(JSON.parse(e.target.result)),function(e,i,l){s(t,e,i,l)},c.bind(t))};a.onerror=function(){d("11519")}}},handleTextFileUploadComplete:function(e){var i=this,l,o;l=e.getSource().oFileUpload.files[0];o=i.byId("idJsonFileUploader");if(l){var n=new FileReader;n.readAsText(l,"UTF-8");n.onload=function(e){var l=e.target.result.split(/\r?\n/);var n,s,c;for(s=0;s<l.length;s++){n=/^\#\s*ApfApplicationId=[0-9A-F]+\s*$/.exec(l[s]);if(t.checkIsNotNull(n)){c=l[s].split("=")[1]}}var u;if(a){for(s=0;s<a.getList().length;s++){if(c===a.getList()[s].Application){u=true;break}else{u=false}}}if(!u&&o&&!o.getValue()){d("11520")}else if(o&&o.getValue()){if(r&&c&&c!==r){d("11521")}else{p(i,e.target.result)}}else if(u&&o&&!o.getValue()){p(i,e.target.result)}};n.onerror=function(){d("11522")}}i.closeAllOpenDialogs()},handleUploadOfConfig:function(){var e=this;var i=t.checkIsNotNullOrUndefinedOrBlank(e.byId("idJsonFileUploader").getValue());var l=t.checkIsNotNullOrUndefinedOrBlank(e.byId("idTextFileUploader").getValue());if(i&&l||i){e.byId("idJsonFileUploader").upload()}else{e.byId("idTextFileUploader").upload()}},handleCancelOfImportFilesDialog:function(){var e=this;e.byId("idImportFilesDialog").close()},closeAllOpenDialogs:function(){var e=this.byId("idImportFilesDialog");if(o&&o.isOpen()){this.handleCancelOfOverwriteDialog()}if(e&&e.isOpen()){this.handleCancelOfImportFilesDialog()}}})});
//# sourceMappingURL=importFiles.controller.js.map