sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    return Controller.extend('zms.App', {
        onInit: function () {
            var dateFrom = new Date(),
                dateTo = new Date(),
                oModel = new JSONModel();
            oModel.setData({
                delimiterDRS1: "@",
                dateValueDRS1: dateFrom,
                secondDateValueDRS1: dateTo,
                dateFormatDRS1: "yyyy/MM"
            })
            this.getView().setModel(oModel);
        }
    })
})