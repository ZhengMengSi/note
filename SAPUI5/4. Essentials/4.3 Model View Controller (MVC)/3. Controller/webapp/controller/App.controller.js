sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/mvc/OverrideExecution'
], function (Controller, OverrideExecution) {
    return Controller.extend('uu.controller.App', {
        metadata: {
            methods: {
                publicMethod: {
                    public: true,
                    final: false,
                    overrideExecution: OverrideExecution.After
                }
            }
        },
        onInit: function () {
            console.log('App onInit')
            this.counter = 0;

            // console.log('Controller实例：', this)
            // console.log('实例方法byId：', this.byId('ttt'))
            // console.log('实例方法getMetadata：', this.getMetadata().getPublicMethods())
            // this.publicMethod()
            console.log(this.getMetadata())
        },
        onExit: function () {
            console.log('onExit')
        },
        onAfterRendering: function () {
            console.log('onAfterRendering')
        },
        onBeforeRendering: function () {
            console.log('onBeforeRendering')
        },
        increaseCounter: function() {
            this.counter++;
        },
        // adding a public method, might be called from,
        // but not overridden by other controllers or controller extensions as well
        publicMethod: function() {
            console.log('App publicMethod')
        },
    })
})