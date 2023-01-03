sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    var x = {
        onInit: function () {
            var oModel = new JSONModel({
                x: 1,
                list: [
                    {
                        label: 'Implementation Phase',
                        value: '40.0',
                        displayValue: '40.0',
                    },
                    {
                        label: 'Design Phase',
                        value: '21.5',
                        displayValue: '21.5',
                    },
                    {
                        label: 'Test Phase',
                        value: '38.5',
                        displayValue: '38.5',
                    },
                ]
            });
            this.getView().setModel(oModel, 'zms');
        },
        onPress: function () {
            console.log(this)
        }
    }

    return Controller.extend('zms.App', x)
})
