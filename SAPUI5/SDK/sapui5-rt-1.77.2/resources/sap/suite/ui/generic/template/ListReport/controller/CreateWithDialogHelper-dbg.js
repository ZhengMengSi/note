sap.ui.define([
	"sap/ui/base/Object",
	"sap/suite/ui/generic/template/js/StableIdHelper",
    "sap/suite/ui/generic/template/lib/MessageUtils",
    "sap/base/util/extend",
    "sap/suite/ui/generic/template/lib/testableHelper"
], function(BaseObject, StableIdHelper, MessageUtils, extend, testableHelper) {
	"use strict";

	// This helper class handles creation using dialog in the List Report
	// In case the create with dialog is enabled in List Report it instantiates an instance of
	// sap.suite.ui.generic.template.Listreport.controller.CreateWithDialogHelper which implements the main part of the logic
	// This class only contains the glue code which is used to adapt the services provided by  generic class to the requirements of the List Report

	// oState is used as a channel to transfer data to the controller and back
	// oController is the controller of the enclosing ListReport
	// oTemplateUtils are the template utils as passed to the controller implementation
	function getMethods(oState, oController, oTemplateUtils) {

        function fnGetStableIdForDialog() {
            var sIdForCreationDialog = StableIdHelper.getStableId({
                type: "ListReportAction",
                subType: "CreateWithDialog"
            });
            return sIdForCreationDialog;
        }

        function fnGetFilterForCurrentState(oDialog) {
            if (oDialog && oDialog.getBindingContext && oController && oDialog.getBindingContext().getPath) {
                return {
                    "aFilters": [
                        {
                            sPath: "fullTarget",
                            sOperator: "StartsWith",
                            oValue1: oDialog.getBindingContext().getPath()
                        },
                        {
                            sPath: "target",
                            sOperator: "EQ",
                            oValue1: "/" + oController.getOwnerComponent().getEntitySet()
                        }]
                };
            }
        }

        function fnRemoveOldMessageFromModel(oDialog) {
            var oContextFilter = fnGetFilterForCurrentState(oDialog);
            var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
            if (oContextFilter) {
                var oMessageBinding = oMessageModel.bindList("/", null, null, [oContextFilter]); // Note: It is necessary to create  binding each time, since UI5 does not update it (because there is no change handler)
                var aContexts = oMessageBinding.getContexts();
                if (aContexts.length) {
                    var aErrorToBeRemoved = [];
                    for (var oContext in aContexts) {
                        aErrorToBeRemoved.push(aContexts[oContext].getObject());
                    }
                    sap.ui.getCore().getMessageManager().removeMessages(aErrorToBeRemoved); //to remove error state from field
                }
            }
        }

        function fnCancelPopUpDialog() {
            var oDialog = oController.byId(fnGetStableIdForDialog());
            if (oDialog && oController && oTemplateUtils) {
                oDialog.close();
                if (oTemplateUtils.oComponentUtils.isDraftEnabled()) {
                    oTemplateUtils.oServices.oCRUDManager.deleteEntities([oDialog.getBindingContext().getPath()], true);
                } else {
                    fnRemoveOldMessageFromModel(oDialog);
                    oController.getView().getModel().deleteCreatedEntry(oDialog.getBindingContext());
                }
                oDialog.setBindingContext(null);
            }
        }

        function fnSavePopUpDialog(oEvent) {
            var bMessageModelContainsError = false;

            // client side error processing
            var oModelData = sap.ui.getCore().getMessageManager().getMessageModel().getData();
            for (var i = 0; i < oModelData.length; i++) {
                if (oModelData[i].type === "Error" && oModelData[i].validation) {	//Validation Errors if any
                    bMessageModelContainsError = true;
                }
            }
            if (!bMessageModelContainsError && oTemplateUtils.oComponentUtils.isDraftEnabled()) { //Draft save
                oState.oSaveScenarioHandler = oTemplateUtils.oServices.oApplication.getSaveScenarioHandler(oController, oTemplateUtils.oCommonUtils);
                oTemplateUtils.oCommonUtils.executeIfControlReady(oState.oSaveScenarioHandler.handleSaveScenario.bind(null, 1, fnActivateImpl()), oEvent.getSource().getId());
            } else if (!bMessageModelContainsError) {    //non-draft save
                var oView = oController.getView();
                var oModel = oView.getModel();
                var oPendingChanges = oModel.getPendingChanges();
                var mPendingChangesToContextInfo = Object.create(null);
                if (oPendingChanges) {
                    for (var sProperty in oPendingChanges) {
                        if (oPendingChanges.hasOwnProperty(sProperty)) {
                            var oPendingContext = oModel.getContext("/" + sProperty);
                            mPendingChangesToContextInfo[sProperty] = {
                                context: oPendingContext,
                                change: oPendingChanges[sProperty]
                            };
                        }
                    }
                }
                oTemplateUtils.oCommonEventHandlers.submitChangesForSmartMultiInput();
                var oDialog = oController.byId(fnGetStableIdForDialog());
                var oFilter = fnGetFilterForCurrentState(oDialog);
                var oSaveEntityPromise = oTemplateUtils.oServices.oCRUDManager.saveEntity(oFilter);
                oSaveEntityPromise.then(function () {
                    if (oDialog && oState && oTemplateUtils) {
                        oDialog.close();
                        oTemplateUtils.oCommonUtils.refreshModel(oState.oSmartTable);
                        oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
                        fnRemoveOldMessageFromModel(oDialog);
                        oDialog.setBindingContext(null);
                    }
                });
                var oEvent1 = {
                    saveEntityPromise: oSaveEntityPromise
                };
                oTemplateUtils.oComponentUtils.fire(oController, "AfterSave", oEvent1);
            }
        }

        function fnActivateImpl() {	//activate draft entity
            var oDialog = oController.byId(fnGetStableIdForDialog());
            if (oDialog && oState && oTemplateUtils) {
                var oActivationPromise = oTemplateUtils.oServices.oCRUDManager.activateDraftEntity(oState.oSaveScenarioHandler, oDialog.getBindingContext());
                oActivationPromise.then(function (oResponse) {
                    if (oResponse && oResponse.response && oResponse.response.statusCode === "200") {
                        oDialog.close();
                        oDialog.setBindingContext(null);
                        MessageUtils.showSuccessMessageIfRequired(oTemplateUtils.oCommonUtils.getText("OBJECT_SAVED"), oTemplateUtils.oServices);
                        oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
                    }
                }, Function.prototype);
                var oEvent = {
                    activationPromise: oActivationPromise
                };
                oTemplateUtils.oComponentUtils.fire(oController, "AfterActivate", oEvent);
            }
        }

        function fnCreateWithDialog(oEventSource) {
            var oSmartFilterbar = oState.oSmartFilterbar;
            var oDialog = oController.byId(fnGetStableIdForDialog());
            var oTable = oTemplateUtils.oCommonUtils.getOwnerControl(oEventSource);
            oTable = oTemplateUtils.oCommonUtils.isSmartTable(oTable) ? oTable : oTable.getParent();
            if (oTemplateUtils.oComponentUtils.isDraftEnabled()) {	//Create Dialog load for draft apps
                oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, false, oSmartFilterbar, false, false, true).then(
                    function (oTargetInfo) {
                        oTemplateUtils.oServices.oApplication.registerContext(oTargetInfo);
                        oDialog.setBindingContext(oTargetInfo);
                        oDialog.open();
                    });
            } else {	//create dialog for non-draft apps.
                var oNewContext = oTemplateUtils.oServices.oApplication.createNonDraft(oTable.getEntitySet());
                oDialog.setBindingContext(oNewContext);
                oDialog.open();
            }
        }

        testableHelper.testableStatic(fnActivateImpl, "CreateWithDialogHelper_fnActivateImpl");
        testableHelper.testableStatic(fnRemoveOldMessageFromModel, "CreateWithDialogHelper_fnRemoveOldMessageFromModel");
        testableHelper.testableStatic(fnGetFilterForCurrentState, "CreateWithDialogHelper_fnGetFilterForCurrentState");
		// public instance methods
		return {
            getStableIdForDialog: fnGetStableIdForDialog,
            onCancelPopUpDialog: fnCancelPopUpDialog,
            onSavePopUpDialog: fnSavePopUpDialog,
            createWithDialog: fnCreateWithDialog
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.CreateWithDialogHelper", {
		constructor: function(oState, oController, oTemplateUtils) {
			extend(this, getMethods(oState, oController, oTemplateUtils));
		}
	});
});
