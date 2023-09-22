// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview The menu service provides the entries for the menu bar
 * @version 1.75.0
 */
sap.ui.define([
    "sap/ushell/utils"
], function (
    UShellUtils
) {
    "use strict";

    /**
     * @typedef {object} MenuEntry A Menu Entry
     * @property {string} text The text of the menu entry
     * @property {string} intent The intent of the menu entry
     */

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("Menu")</code>.
     * Constructs a new instance of the menu service.
     *
     * @namespace sap.ushell.services.Menu
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.71.0
     * @private
     */
    function Menu () {
        this._init.apply(this, arguments);
    }

    /**
     * Private initializer.
     *
     * @param {object} adapter The menu adapter for the frontend server.
     *
     * @since 1.72.0
     * @private
     */
    Menu.prototype._init = function (adapter) {
        this.oAdapter = adapter;
    };

    /**
     * Returns whether the menu is enabled.
     *
     * @returns {Promise<boolean>} True if menu is enabled
     *
     * @since 1.71.0
     * @private
     */
    Menu.prototype.isMenuEnabled = function () {
        return this.oAdapter.isMenuEnabled();
    };

    /**
     * Gets the menu entries sorted alphabetically by their title
     * and inserts a new unique id for easy menu entry access.
     *
     * @returns {Promise<MenuEntry[]>} The menu entries
     *
     * @since 1.71.0
     * @private
     */
    Menu.prototype.getMenuEntries = function () {
        return this.oAdapter.getMenuEntries().then(function (aMenuEntries) {
            return aMenuEntries
                .map(function (oMenuEntry) {
                    oMenuEntry.uid = UShellUtils.generateUniqueId([]);
                    return oMenuEntry;
                })
                .sort(function (oEntryA, oEntryB) {
                    return oEntryA.title.localeCompare(oEntryB.title);
                });
        });
    };

    /**
     * Gets the menu entries and reduces the information to only contain required information
     *
     * @returns {Promise<MenuEntry[]>} The reduced menu entries
     *
     * @since 1.75.0
     * @private
     */
    Menu.prototype.getSpacesPagesHierarchy = function () {
        return this.getMenuEntries()
            .then(function (aMenuEntries) {
                return {
                    spaces: aMenuEntries
                        .filter(function (oMenuEntry) {
                            return oMenuEntry.type === "intent"
                                && oMenuEntry.target
                                && oMenuEntry.target.semanticObject === "Launchpad"
                                && oMenuEntry.target.action === "openFLPPage";
                        })
                        .map(function (oSpace) {
                            return {
                                title: oSpace.title,
                                id: oSpace.target.parameters[0].value,
                                pages: [
                                    // currently there is only a 1 to 1 matching between spaces and pages considered
                                    { id: oSpace.target.parameters[1].value }
                                ]
                            };
                        })
                };
            })
            .catch(function () {
                return { spaces: [] };
            });
    };

    Menu.hasNoAdapter = false;
    return Menu;
});
