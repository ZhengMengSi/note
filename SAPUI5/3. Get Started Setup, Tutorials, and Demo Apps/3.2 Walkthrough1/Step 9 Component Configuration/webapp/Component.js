sap.ui.define([
    'sap/ui/core/UIComponent',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
    console.log(UIComponent)

    var u = UIComponent.extend('zms.Component', {
        metadata : {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            "rootView": {
                "viewName": "zms.view.App",
                "type": "XML",
                /*"async": true, // implicitly set via the sap.ui.core.IAsyncContentCreation interface*/
                "id": "app"
            }
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments)

            // 数据设置从root view移动到了component上
            // set data model
            var oData = {
                recipient: {
                    name: "World"
                }
            }
            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            // set i18n model
            var i18nModel = new ResourceModel({
                bundleName: 'zms.i18n.i18n'
            })
            this.setModel(i18nModel, 'i18n')
        }
    })

    console.log(u);

    return u;
})