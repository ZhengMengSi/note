sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/library",
    "sap/ui/core/Locale",
    "sap/ui/core/LocaleData",
    "sap/ui/model/type/Currency"
], function (Controller, mobileLibrary, Locale, LocaleData, Currency) {
    "use strict";

    return Controller.extend("sap.ui.demo.db.controller.App", {
        formatMail: function (sFirstName, sLastName) {
            var oBundel = this.getView().getModel('i18n').getResourceBundle();
            return mobileLibrary.URLHelper.normalizeEmail(
                sFirstName + "." + sLastName + "@example.com",
                oBundel.getText("mailSubject", [sFirstName]),
                oBundel.getText("mailBody")
            )
        },
        formatStockValue: function (fUnitPrice, iStockLevel, sCurrCode) {
            var sBrowserLocale = sap.ui.getCore().getConfiguration().getLanguage()
            var oLocale = new Locale(sBrowserLocale)
            var oLocaleDate = new LocaleData(oLocale)
            var oCurrency = new Currency(oLocaleDate.mData.currencyFormat)
            return oCurrency.formatValue([fUnitPrice * iStockLevel, sCurrCode], "string")
        }
    })
})