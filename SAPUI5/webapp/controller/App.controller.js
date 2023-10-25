sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
        onInit: function () {
            var that = this;
            // setInterval(() => {
            //     this.getView().byId('xx').addItem(new sap.m.Text({
            //         text: '55'
            //     }))
            // }, 500)

            var oModel = new sap.ui.model.json.JSONModel({
                names: [
                    {
                        key: 'z',
                        text: 'z',
                    },
                    {
                        key: 'z1',
                        text: 'z1',
                    },
                ],
                f: "",
            });
            this.getView().setModel(oModel, 'xx')

            // $是一个函数：ƒ (s,a){return new Q.fn.init(s,a);}
            // setTimeout(() => {
            //     console.log($(".t").length);
            // }, 200);
        },
        onAfterRendering: function () {
            console.log($(".t").length);
        },
        onShowHello : function () {
            // read msg from i18n model
            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            var sMsg = oBundle.getText("helloMsg", [sRecipient]);
            MessageToast.show(sMsg);

            this.getView().getModel('xx').setProperty('/f', 'z1')
        },
        selectionChange: function (oControlEvent) {
            console.log(1);
        }
    });
});