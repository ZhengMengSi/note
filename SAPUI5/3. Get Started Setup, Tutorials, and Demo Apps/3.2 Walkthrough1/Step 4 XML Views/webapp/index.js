sap.ui.define([
    "sap/ui/core/mvc/XMLView"
], function (XMLView) {
    console.log(XMLView)

    var x = XMLView.create({
        viewName: "zms.view.App"
    })

    console.log(x);

    var y = x.then(function (oView) {
        console.log(oView)
        oView.placeAt("content");
    });

    console.log(y)
})
