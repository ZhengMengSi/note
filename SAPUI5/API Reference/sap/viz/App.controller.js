sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    return Controller.extend('zms.App', {
        onInit: function () {
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            // oVizFrame.setVizProperties(this.settingsModel.chartType.values[3].vizProperties);
            var dataModel = new JSONModel("./timeAxis.json");
            oVizFrame.setModel(dataModel);
        },
        onPress: function () {
            console.log(1)
        }
    })
})
