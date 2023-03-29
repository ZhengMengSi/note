sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    return Controller.extend('zms.App', {
        onInit: function () {
            this.getView().setModel(new JSONModel({
                rows: [
                    {
                        name: '银行存款',
                        max: 18,
                        min: 1,
                        minValue: 10,
                        maxValue: 100,
                        Target: 80,
                        Actual: 200
                    },
                    {
                        name: '应收账款>客户>阿里巴巴',
                        max: 14,
                        min: 1,
                        minValue: 10,
                        maxValue: 100,
                        Target: 80,
                        Actual: 40
                    },
                ]
            }))
        }
    })
})