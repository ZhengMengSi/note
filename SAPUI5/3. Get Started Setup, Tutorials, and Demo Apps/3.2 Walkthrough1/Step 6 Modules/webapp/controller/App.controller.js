sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    console.log(MessageToast)

    var e = Controller.extend("zms.controller.App", {
        onShowHello : function () {
            MessageToast.show('zms...iii')
        }
    });

    return e;
});
