sap.ui.define([
    './App.controller',
    'sap/ui/core/mvc/OverrideExecution'
], function (AppController, OverrideExecution) {
    return AppController.extend('uu.controller.App1', {
        // onInit: function () {
        //     console.log('App1 onInit')
        // },
        publicMethod: function () {
            console.log('App1 publicMethod')
        }
    })
})