/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/resource/ResourceModel',
    "sap/m/MessageToast",
    '../CardHelper'], function (Controller, JSONModel, ResourceModel, MessageToast, CardHelper) {
        return Controller.extend('sap.insights.preview.Preview', {
            onInit: function () {
                this.getView().setModel(new JSONModel({
                    descriptor: {},
                    isMessageVisible: false,
                    message: "",
                    messageType: "Information"
                }), "cardPreviewModel");
                this.I18_BUNDLE = sap.ui.getCore().getLibraryResourceBundle("sap.insights");
                this.getView().setModel(new ResourceModel({ bundle: this.I18_BUNDLE }), "i18n");
            },
            save: function () {
                var oCard = this.getView().getModel("cardPreviewModel").getProperty("/descriptor");
                if (oCard["sap.card"].header.title) {
                    oCard["sap.insights"].visible = oCard["sap.insights"].visible || false;
                    this._getPreviewDialog().setBusy(true);
                    CardHelper.getServiceAsync().then(function (oCardHelperServiceInstance) {
                        var oCard = this.getView().getModel("cardPreviewModel").getProperty("/descriptor");
                        oCard["sap.insights"].visible = oCard["sap.insights"].visible || false;
                        oCardHelperServiceInstance.createCard(oCard).then(function (oCreatedCard) {
                            MessageToast.show("Card created Successfully.");
                            this._getPreviewDialog().setBusy(false);
                            this._getPreviewDialog().close();
                        }.bind(this)).catch(function (oError) {
                            var oModel = this.getView().getModel("cardPreviewModel");
                            oModel.setProperty("/message", oError.message);
                            oModel.setProperty("/isMessageVisible", true);
                            oModel.setProperty("/messageType", "Error");
                            this._getPreviewDialog().setBusy(false);
                        }.bind(this));
                    }.bind(this));
                }
            },
            cancel: function () {
                this._getPreviewDialog().close();
            },
            handleTitleChange: function (oEvent) {
                var oTitleInput = oEvent.getSource();
                var sTitleText = oTitleInput.getValue();
                var oCard = this.getView().byId("insightsCard");
                if (sTitleText) {
                    oTitleInput.setValueState("None");
                    oTitleInput.setValueStateText("");
                    oCard.getCardHeader().setTitle(sTitleText);
                } else {
                    oTitleInput.setValueState("Error");
                    oTitleInput.setValueStateText(this.I18_BUNDLE.getText("INT_Preview_Title_ValueStateText"));
                }
            },
            handleSubTitleChange: function(oEvent) {
                var oSubTitleInput = oEvent.getSource();
                var sSubTitleText = oSubTitleInput.getValue();
                var oCard = this.getView().byId("insightsCard");
                oCard.getCardHeader().setSubtitle(sSubTitleText);
            },
            handleVisibilityChange: function(oEvent) {
                var oModel = this.getView().getModel("cardPreviewModel");
                var val = oEvent.getParameter("state");
                var oCard = oModel.getProperty("/descriptor");
                oCard["sap.insights"].visible = val;
                oModel.setProperty("/descriptor", oCard);
            },
            showCardSelectionDialog: function () {
                this._getPreviewDialog().close();
                var oModel = this.getView().getModel("cardPreviewModel");
                var oCard = oModel.getProperty("/descriptor");
                CardHelper.getServiceAsync("UIService").then(function (oCardUIHelperInstance) {
                    oCardUIHelperInstance._showCardSelectionDialog(oCard);
                });
            },
            _getPreviewDialog: function () {
                return this.getView().byId('previewDialog');
            },
            showPreview: function (oCard) {
                var oModel = this.getView().getModel("cardPreviewModel");
                oModel.setProperty("/message", "");
                oModel.setProperty("/isMessageVisible", false);
                oModel.setProperty("/messageType", "Information");
                return CardHelper.getServiceAsync().then(function (oCardHelperServiceInstance) {
                    return oCardHelperServiceInstance.getUserCards().then(function (aCards) {
                        var aVisibleCards = aCards.filter(function (oCard) {
                            return oCard.visibility;
                        });
                        if (aVisibleCards.length > 9) {
                            oCard["sap.insights"].visible = false;
                            oModel.setProperty("/message", this.I18_BUNDLE.getText("insightMaxCardText"));
                            oModel.setProperty("/isMessageVisible", true);
                            oModel.setProperty("/messageType", "Warning");
                        }
                        oModel.setProperty("/descriptor", oCard);
                        this._getPreviewDialog().open();
                        return Promise.resolve();
                    }.bind(this));
                }.bind(this));
            }
        });
    });
