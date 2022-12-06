sap.ui.define([
    'sap/ui/core/UIComponent',
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    var u = UIComponent.extend('zms.Component', {
        metadata : {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json"
        },
        init: function () {
            // console.log(this) // ManagedObject zms.Component#container-zms

            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments)

            // i18n从component移动到了manifest.json
            // set data model
            var oData = {
                recipient: {
                    name: "World"
                }
            }
            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            this.getRouter().initialize();
        }
    })

    return u;
})