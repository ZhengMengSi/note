sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("zms.controller.App", {
        onInit: function () {
            // set data model on view
            var oData = {
                recipient: {
                    name: "World"
                }
            }
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
            oModel.setProperty('/recipient/name', 'z')

            let m2 = this.getView().getModel()
            console.log(m2.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__)

            let obj = {}
            console.log(obj.__proto__)
        },
        onShowHello : function () {
            MessageToast.show('zms...iii')
        }
    });
});
