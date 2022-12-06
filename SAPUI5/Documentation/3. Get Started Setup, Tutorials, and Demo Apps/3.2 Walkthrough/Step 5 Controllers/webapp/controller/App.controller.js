sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    console.log(Controller)
    var e = Controller.extend("zms.controller.App", {
        onAfterRendering: function () {
            var oComponent = this.getOwnerComponent()
            console.log(oComponent)
        },
        onShowHello : function () {
            // show a native JavaScript alert
            alert("Hello World");
        }
    });
    console.log(e)
    return e;
});