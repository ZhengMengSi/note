// 参考资料
//
// https://www.cnblogs.com/xiaoshiwang/p/15236633.html

sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    '../model/formatter',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return Controller.extend('zms.controller.InvoiceList', {
        formatter: formatter,
        onInit: function () {
            var oViewModel = new JSONModel({
                currency: 'EUR'
            })
            this.getView().setModel(oViewModel, 'view')
        },
        onFilterInvoices: function (oEvent) {
            var aFilter = [];
            var sQuery = oEvent.getParameter("query");
            if (sQuery) {
                aFilter.push(new Filter('ProductName', FilterOperator.Contains, sQuery))
            }

            var oList = this.byId('invoiceList') // sap.ui.core.Element
            console.log(oList)
            var oBinding = oList.getBinding('items') // sap.ui.model.Binding | sap.ui.model.ClientListBinding
            console.log(oBinding.constructor)
            oBinding.filter(aFilter)
        }
    })
})