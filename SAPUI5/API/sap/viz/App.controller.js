sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
    return Controller.extend('zms.App', {
        onInit: function () {
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            // oVizFrame.setVizProperties({
            //     plotArea: {
            //         dataPointStyle: {
            //             rules: [
            //                 {
            //                     dataContext: {
            //                         "Name of the measure as displayed in the chart": {
            //                             "max": 10
            //                         }
            //                     },
            //                     properties: {
            //                         "color":"sapUiChartPaletteSemanticGood"
            //                     },
            //                     "displayName":"Revenue < 10"
            //                 }
            //             ],
            //             others: {
            //                 "properties": {
            //                     "color": "sapUiChartPaletteSemanticBad"
            //                 },
            //                 "displayName": "Revenue > 10"
            //             }
            //         }
            //     }
            // });
            var dataModel = new JSONModel("./timeAxis1.json");
            oVizFrame.setModel(dataModel);
        },
        onPress: function () {
            this.oVizFrame.setVizProperties({
                plotArea: {
                    dataPointStyle: {
                        rules: [
                            {
                                dataContext: {
                                    "Name of the measure as displayed in the chart": {
                                        "max": 25
                                    }
                                },
                                properties: {
                                    "color":"indianred"
                                },
                                "displayName":"Revenue < 25"
                            }
                        ],
                        // others: {
                        //     "properties": {
                        //         "color": "sapUiChartPaletteSemanticBad"
                        //     },
                        //     "displayName": "Revenue > 30"
                        // }
                    }
                }
            });
        }
    })
})
