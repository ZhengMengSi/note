sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/resource/ResourceModel'
], function (Controller, MessageToast, JSONModel, ResourceModel) {
    'use strict';

    return Controller.extend('sap.ui5.walkthrough.controller.App', {
        onInit: function () {
            var oData = {
                recipient: {
                    name: '初探'
                }
            }

            var oModel = new JSONModel(oData)
            this.getView().setModel(oModel)

            var i18nModel = new ResourceModel({
                bundleName: 'sap.ui5.walkthrough.i18n.i18n'
            })
            this.getView().setModel(i18nModel, 'zmsi18n')
        },
        onShowHello: function () {
            // MessageToast.show('hello')
            var oBundle = this.getView().getModel('zmsi18n').getResourceBundle()
            var name = this.getView().getModel().getProperty('/recipient/name')
            var sMsg = oBundle.getText('helloMsg', [name])
            MessageToast.show(sMsg)
        }
    })
})