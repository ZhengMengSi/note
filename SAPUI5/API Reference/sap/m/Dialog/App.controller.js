sap.ui.define([
    'sap/ui/core/mvc/Controller',
    "sap/ui/core/Fragment"
], function (Controller, Fragment) {
    return Controller.extend('zms.App', {
        onInit: function () {
            // 新版本
            /*if (!this.pDialog) {
                this.pDialog = this.loadFragment({
                    name: "zms.HelloDialog"
                });
            }
            this.pDialog.then(function(oDialog) {
                oDialog.open();
            });*/

            // 老版本
            var oView = this.getView();

            // create dialog lazily
            if (!this.byId("helloDialog")) {
                // load asynchronous XML fragment
                Fragment.load({
                    id: oView.getId(),
                    name: "zms.HelloDialog"
                }).then(function (oDialog) {
                    // connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
                    oDialog.open();
                });
            } else {
                this.byId("helloDialog").open();
            }
        }
    })
})