sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/mvc/OverrideExecution',
    './App2.controller'
], function (Controller, OverrideExecution, App2) {
    return Controller.extend('uu.controller.App', {
        App2: App2.override({
            publicMethod: function () {
                console.log('App publicMethod')
            }
        }),
        // metadata: {
        //     methods: {
        //         onMyHook: {public: true /*default*/, final: false /*default*/, overrideExecution: OverrideExecution.After},
        //     }
        // },
        onInit: function () {
            console.log('App onInit')
            this.counter = 0;

            // console.log('Controller实例：', this)
            // console.log('实例方法byId：', this.byId('ttt'))
            // console.log('实例方法getMetadata：', this.getMetadata().getPublicMethods())
            this.App2.publicMethod()
        },
        onExit: function () {
            console.log('onExit')
        },
        onAfterRendering: function () {
            // console.log('onAfterRendering')
        },
        onBeforeRendering: function () {
            // console.log('onBeforeRendering')
        },
        increaseCounter: function() {
            this.counter++;
        },
        // adding a public method, might be called from,
        // but not overridden by other controllers or controller extensions as well
        // publicMethod: function() {
        //     console.log('App publicMethod')
        // },
        onMyHook: function() {
            console.log('App onMyHook')
        },
    })
})