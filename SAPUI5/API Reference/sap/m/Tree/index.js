sap.ui.define([
    'sap/ui/core/mvc/XMLView'
], function (XMLView) {
    XMLView.create({
        viewName: 'tree.App'
    }).then(function (oView) {
        oView.placeAt('content')
    })
})