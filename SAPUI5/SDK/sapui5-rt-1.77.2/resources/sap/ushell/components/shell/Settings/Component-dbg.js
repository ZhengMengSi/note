// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/components/shell/Settings/userAccount/UserAccountEntry",
    "sap/ushell/components/shell/Settings/homepage/HomepageEntry"
], function (
    XMLView,
    UIComponent,
    JSONModel,
    Config,
    EventHub,
    resources,
    UserAccountEntry,
    HomepageEntry
) {
    "use strict";

    var aDoables = [];

    return UIComponent.extend("sap.ushell.components.shell.Settings.Component", {

        metadata: {
            version: "1.77.2",
            library: "sap.ushell",
            dependencies: {
                libs: [
                    "sap.m",
                    "sap.ui.layout"
                ]
            }
        },

        /**
         * Initalizes the user settings and add standard entity into Config
         *
         * @private
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            this._addStandardEntityToConfig();
            this._loadSearchProfiling();
            aDoables.push(EventHub.on("openUserSettings").do(this._openUserSettings.bind(this)));
        },

        /**
         * Get all standard entity of setting dialog and update ushell Config
         * @private
         */
        _addStandardEntityToConfig: function () {
            var aEntities = Config.last("/core/userPreferences/entries");

            aEntities.push(UserAccountEntry.getEntry()); // User account
            if (Config.last("/core/home/enableHomePageSettings") && !Config.last("/core/spaces/enabled")) {
                aEntities.push(HomepageEntry.getEntry()); // Home Page
            }

            aEntities = sap.ushell.Container.getRenderer("fiori2").reorderUserPrefEntries(aEntities);
            Config.emit("/core/userPreferences/entries", aEntities);
        },

        /**
         * Create and open settings dialog
         * @param {object} oEvent Event contain id and time.
         * @private
         */
        _openUserSettings: function (oEvent) {
            if (!this.oDialog) {
                XMLView.create({
                    id: "settingsView",
                    viewName: "sap.ushell.components.shell.Settings.UserSettings"
                }).then(function (oSettingView) {
                    this.oSettingsView = oSettingView;
                    var oModel = Config.createModel("/core/userPreferences", JSONModel);
                    oSettingView.setModel(oModel);
                    oSettingView.setModel(resources.i18nModel, "i18n");
                    this.oDialog = oSettingView.byId("userSettingsDialog");
                    if (oEvent.id) {
                        sap.ui.getCore().byId(oEvent.id).addDependent(oSettingView);
                    }
                    this.oDialog.open();
                }.bind(this));
            } else {
                this.oDialog.open();
            }
        },

        /**
         * Load Search Settings.
         *
         * @private
         */
        _loadSearchProfiling: function () {
            function isSearchButtonEnabled () {
                return Config.last("/core/shellHeader/headEndItems").indexOf("sf") !== -1;
            }

            if (isSearchButtonEnabled()) {
                // search preferences (user profiling, concept of me)
                // entry is added async only if search is active
                sap.ui.require([
                    "sap/ushell/renderers/fiori2/search/userpref/SearchPrefs",
                    "sap/ushell/renderers/fiori2/search/SearchShellHelperAndModuleLoader"
                ], function (SearchPrefs) {
                    var oSearchPreferencesEntry = SearchPrefs.getEntry(),
                        oRenderer = sap.ushell.Container.getRenderer("fiori2");

                    oSearchPreferencesEntry.isSearchPrefsActive().done(function (isSearchPrefsActive) {
                        if (isSearchPrefsActive && oRenderer) {
                            // Add search as a profile entry
                            oRenderer.addUserProfilingEntry(oSearchPreferencesEntry);
                        }
                    });
                });
            }
        },

        /**
         * Turns the eventlistener in this component off.
         *
         * @private
         */
        exit: function () {
            for (var i = 0; i < aDoables.length; i++) {
                aDoables[i].off();
            }
            if (this.oSettingsView) {
                this.oSettingsView.destroy();
                this.oSettingsView = null;
                this.oDialog = null;
            }
        }
    });
});