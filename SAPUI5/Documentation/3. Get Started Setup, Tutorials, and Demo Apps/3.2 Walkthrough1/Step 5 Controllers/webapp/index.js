sap.ui.define([
    "sap/ui/core/mvc/XMLView"
], function (XMLView) {
    var x = XMLView.create({
        viewName: "zms.view.App"
    })

    var y = x.then(function (oView) {
        oView.placeAt("content");
    });
})
