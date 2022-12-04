sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    return Controller.extend('zms.App', {
        dataPath : "https://sapui5.hana.ondemand.com/test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost",
        onInit: function () {
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            // oVizFrame.setVizProperties(this.settingsModel.chartType.values[3].vizProperties);
            var dataModel = new JSONModel(this.dataPath + "/column/timeAxis.json");
            oVizFrame.setModel(dataModel);
        },
        onPress: function () {
            console.log(1)
        }
    })
})