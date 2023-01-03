sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    var x = {
        onInit: function () {
            console.log(this)
            console.log(this === x)
        },
        onPress: function () {
            console.log(this)
        }
    }

    return Controller.extend('zms.App', x)
})
