sap.ui.define([
    'sap/ui/core/UIComponent',
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    console.log(UIComponent)

    var u = UIComponent.extend('zms.Component', {
        metadata : {
            "interfaces": ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json"
        },
        init: function () {
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
        }
    })

    console.log(u);

    return u;
})