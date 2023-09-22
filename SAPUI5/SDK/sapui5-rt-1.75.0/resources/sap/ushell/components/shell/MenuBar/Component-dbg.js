// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config"
], function (UIComponent, JSONModel, Config) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.MenuBar.Component", {
        init: function () {

            UIComponent.prototype.init.apply(this, arguments);
            var oMenuModel = new JSONModel();
            this.setModel(oMenuModel, "menu");
            var oComponentContainer;

            sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    oMenuService.isMenuEnabled().then(function (bIsEnabled) {
                        if (bIsEnabled) {
                            oComponentContainer = sap.ui.getCore().byId("menuBarComponentContainer");
                        }
                        return oMenuService.getMenuEntries();
                    })
                    .then(function (aMenuEntries) {
                        if (oComponentContainer) {
                            oMenuModel.setProperty("/", aMenuEntries);
                            oComponentContainer.setComponent(this);
                        }
                        if (Config.last("/core/shell/model/currentState/stateName")!=="home") {
                            oComponentContainer.setVisible(false);
                        }
                    }.bind(this));
                }.bind(this));
        }
    });
});