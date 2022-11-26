sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/m/MessageToast',
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, Fragment) {
    "use strict";

    return Controller.extend("zms.controller.App", {
        onShowHello : function () {
            // read msg from i18n model
            var oBundle = this.getView().getModel('i18n').getResourceBundle()
            var sRecipient = this.getView().getModel().getProperty('/recipient/name')
            var sMsg = oBundle.getText('helloMsg', [sRecipient])
            MessageToast.show(sMsg)
        },
        onOpenDialog: function () {
            console.log(this.loadFragment)

            // create dialog lazily
            if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "zms.view.HelloDialog"
                });
            }
            this.pDialog.then(function(oDialog) {
                oDialog.open();
            });
        },
        onCloseDialog: function () {
            this.byId('helloDialog').close()
        }
    });
})