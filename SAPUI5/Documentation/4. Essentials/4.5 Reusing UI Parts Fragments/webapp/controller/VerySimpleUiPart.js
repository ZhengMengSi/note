sap.ui.define([
    'sap/ui/core/mvc/ControllerExtension',
    'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel'
], function (ControllerExtension, Fragment, JSONModel) {
    return ControllerExtension.extend('ii.controller.VerySimpleUiPart', {
        getButton: function () {
            console.log(this.getView().getModel('obj').getProperty('/a'))
            this.base.doSomething()
            // console.log(this)

            Fragment.load({
                name: 'ii.view.VerySimpleUiPart',
                type: 'XML',
                controller: this,
                id: this.getView().getId()
            }).then(function (oButton) {
                // console.log(oButton);

                var theSameButton = this.base.byId("btnInFragment");
                // console.log(theSameButton)
                // console.log(theSameButton === oButton)
            }.bind(this));
        }
    })
})