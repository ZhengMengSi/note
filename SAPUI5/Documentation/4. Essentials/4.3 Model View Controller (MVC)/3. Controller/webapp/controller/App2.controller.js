sap.ui.define([
    'sap/ui/core/mvc/ControllerExtension',
    'sap/ui/core/mvc/OverrideExecution'
], function (ControllerExtension, OverrideExecution) {
    return ControllerExtension.extend('uu.controller.App2', {
        metadata: {
            methods: {
                publicMethod: {public: true /*default*/, final: false /*default*/, overrideExecution: OverrideExecution.After},
            }
        },
        onInit: function () {
            // console.log('App onInit')
            this.counter = 0;

            // console.log('Controller实例：', this)
            // console.log('实例方法byId：', this.byId('ttt'))
            // console.log('实例方法getMetadata：', this.getMetadata().getPublicMethods())
            // this.onMyHook()
        },
        publicMethod: function () {
            console.log('App2 publicMethod')
        }
    })
})