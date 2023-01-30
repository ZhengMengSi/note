sap.ui.define([
  'sap/ui/core/mvc/XMLView'
], function (XMLView) {
  XMLView.create({
    viewName: 'jsj.App'
  }).then(function (oView) {
    oView.placeAt('content')
  })
})