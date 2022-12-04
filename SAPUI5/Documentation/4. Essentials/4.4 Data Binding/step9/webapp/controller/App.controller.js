sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/library"
], function (Controller, mobileLibrary) {
    "use strict";

    return Controller.extend("sap.ui.demo.db.controller.App", {
        formatMail: function (sFirstName, sLastName) {
            var oBundel = this.getView().getModel('i18n').getResourceBundle();
            return mobileLibrary.URLHelper.normalizeEmail(
                sFirstName + "." + sLastName + "@example.com",
                oBundel.getText("mailSubject", [sFirstName]),
                oBundel.getText("mailBody")
            )
        }
    })
})