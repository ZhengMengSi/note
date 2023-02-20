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
        },
        onPress: function (oEvent) {
            var oItem = oEvent.getSource();
            // console.log(oItem) // Element sap.m.ObjectListItem#__item0-__xmlview1--invoiceList-0
            // console.log(this.getOwnerComponent()) // ManagedObject zms.Component#container-zms
            var oRouter = this.getOwnerComponent().getRouter();
            // console.log(oRouter) // EventProvider sap.m.routing.Router
            var invoicePath = window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substr(1));
            oRouter.navTo("detail", {
                invoicePath: invoicePath
            });
        }
    })
})