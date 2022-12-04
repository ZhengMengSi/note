sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/core/Fragment',
    './VerySimpleUiPart',
    'sap/ui/model/json/JSONModel'
], function (Controller, Fragment, VerySimpleUiPart, JSONModel) {
    return Controller.extend('ii.controller.App', {
        VerySimpleUiPart: VerySimpleUiPart,
        onAfterRendering: function () {
            // Instantiation of Fragments

            // 第一种Fragment实例化方式: Programmatically Instantiating JS Fragments
            /*Fragment.load({
                name: 'ii.view.UiPartX',
                type: 'JS',
                controller: this
            }).then(function (oButton) {
                console.log(oButton);

                // oButton这个fragment怎么用？
            })*/

            // 第二种Fragment实例化方式: Programmatically Instantiating XML Fragments
            /*Fragment.load({
                name: 'ii.view.VerySimpleUiPart',
                type: 'XML',
                controller: this,
                id: this.getView().getId()
            }).then(function (oButton) {
                console.log(oButton);

                var theSameButton = this.byId("btnInFragment");
                console.log(theSameButton)
                console.log(theSameButton === oButton)
            }.bind(this));*/

            var oModel = new JSONModel({
                a: 1
            });
            this.getView().setModel(oModel, 'obj')
            this.VerySimpleUiPart.getButton()
        },
        doSomething: function () {
            console.log('do')
        }
    })
})