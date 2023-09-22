// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ushell/Config"
], function (mobileLibrary, Config) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /**
     * VisualizationOrganizerHelper constructor.
     *
     * @constructor
     * @protected
     */
    return function () {
        var oVisualizationOrganizer;

        /**
         * Helper function to check whether "Spaces" setting is enabled or not.
         *
         * @returns {boolean} Whether "Spaces" setting is enabled (true) or not (false).
         */
        function isSpacesEnabled () {
            return Config.last("/core/spaces/enabled");
        }

        /**
         * Returns a promise that resolves to the VisualizationOrganizer.
         * If the VisualizationOrganizer was already loaded before, then it resolves to that same instance.
         *
         * @returns {Promise<sap.ushell.components.visualizationOrganizer.Component>} A promise that resolves to the VisualizationOrganizer.
         *
         * @see sap.ushell.components.visualizationOrganizer.Component
         */
        this.loadVisualizationOrganizer = function () {
            return new Promise(function (resolve) {
                if (oVisualizationOrganizer) {
                    resolve(oVisualizationOrganizer);
                } else {
                    sap.ui.require(["sap/ushell/components/visualizationOrganizer/Component"], function (VisualizationOrganizer) {
                        oVisualizationOrganizer = new VisualizationOrganizer();
                        resolve(oVisualizationOrganizer);
                    });
                }
            });
        };

        if (isSpacesEnabled()) {
            this.loadVisualizationOrganizer().then(function () {
                if (this.oModel) {
                    this.setModel(this.oModel);
                }
            }.bind(this));
        }

        /**
         * Forwarder of a model to the VisualizationOrganizer.
         * This model is used by the VisualizationOrganizer to refresh the bindings after loading and processing the data.
         *
         * @param {sap.ui.model.json.JSONModel} model The model to have its bindings refreshed after loading and processing the data.
         */
        this.setModel = function (model) {
            if (oVisualizationOrganizer) {
                oVisualizationOrganizer.setModel(model);
            }
            this.oModel = model;
        };

        /**
         * Determines the tooltip text of the "pin" button.
         * Checks if Spaces are enabled:
         * - Spaces disabled: forwards the call to the original handler with original arguments.
         * - Spaces enabled: forwards the call to the original handler with the first argument only.
         *
         * @param {string} sAddTileGroups String to display if tile is added to groups.
         * @returns {string} The formatted string.
         *
         * @since 1.75.0
         * @protected
         */
        this.formatPinButtonTooltip = function (sAddTileGroups) {
            if (!isSpacesEnabled()) {
                return this.formatPinButtonTooltip.apply(this, arguments);
            }
            return this.formatPinButtonTooltip(sAddTileGroups);
        };

        /**
         * Determines the "selected" state of the "pin" button.
         * Checks if Spaces are enabled:
         * - Spaces disabled: forwards the call to the original handler with original arguments.
         * - Spaces enabled: returns "false" ("pin" button should never be selected).
         *
         * @returns {boolean} The boolean result.
         *
         * @since 1.75.0
         * @protected
         */
        this.formatPinButtonSelectState = function () {
            if (!isSpacesEnabled()) {
                return this.formatPinButtonSelectState.apply(this, arguments);
            }
            return false;
        };

        /**
         * Forwarder function for the VisualizationOrganizer "formatPinButtonIcon" method.
         * Checks if Spaces are enabled:
         * - Spaces disabled: returns "sap-icon://pushpin-off".
         * - Spaces enabled: forwards the call to the VisualizationOrganizer.
         *
         * @param {string} vizId The vizId of the visualization to be checked.
         * @returns {sap.ui.core.URI} The icon that should be used for the "pin" button.
         *
         * @see shouldUseVisualizationOrganizer
         */
        this.formatPinButtonIcon = function (vizId) {
            if (!isSpacesEnabled()) {
                return "sap-icon://pushpin-off";
            }
            return oVisualizationOrganizer.formatPinButtonIcon(vizId);
        };

        /**
         * Forwarder function for the VisualizationOrganizer "formatPinButtonType" method.
         * Checks if Spaces are enabled:
         * - Spaces disabled: returns "ButtonType.Default".
         * - Spaces enabled: forwards the call to the VisualizationOrganizer.
         *
         * @param {string} vizId The vizId of the visualization to be checked.
         * @returns {sap.m.ButtonType} The type that should be used for the "pin" button.
         *
         * @see shouldUseVisualizationOrganizer
         */
        this.formatPinButtonType = function (vizId) {
            if (!isSpacesEnabled()) {
                return ButtonType.Default;
            }
            return oVisualizationOrganizer.formatPinButtonType(vizId);
        };

        /**
         * Forwarder function for the VisualizationOrganizer "onTilePinButtonClick" method.
         * Checks if Spaces are enabled:
         * - Spaces disabled: forwards the call to the original handler.
         * - Spaces enabled: forwards the call to the VisualizationOrganizer.
         *
         * @param {sap.ui.base.Event} oEvent The press event.
         *
         * @since 1.75.0
         * @protected
         */
        this.onTilePinButtonClick = function (oEvent) {
            if (!isSpacesEnabled()) {
                this.getController().onTilePinButtonClick(oEvent);
                return;
            }
            oVisualizationOrganizer.onTilePinButtonClick(oEvent);
        };
    };
});
