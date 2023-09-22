// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview PagePersistenceAdapter for the local platform.
 * @version 1.75.0
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ui/util/Storage",
    "sap/base/util/ObjectPath"
], function (utils, Storage, ObjectPath) {
    "use strict";

    /**
     * Constructs a new instance of the PagePersistenceAdapter for the local platform
     *
     * @param {object} system The system information. This is not used in a local environment.
     * @param {string} parameter The Adapter parameter.
     * @param {object} adapterConfiguration The Adapter configuration.
     *
     * @constructor
     * @experimental Since 1.67.0
     * @private
     */
    var PagePersistenceAdapter = function (system, parameter, adapterConfiguration) {
        var sStorageType = ObjectPath.get("config.storageType", adapterConfiguration) || Storage.Type.local;
        if (sStorageType !== Storage.Type.local && sStorageType !== Storage.Type.session) {
            throw new utils.Error("PagePersistence Adapter Local Platform: unsupported storage type: '" + sStorageType + "'");
        }
        this._oStorage = new Storage(sStorageType, "com.sap.ushell.adapters.local.PagePersistence");
    };

    PagePersistenceAdapter.prototype.getPage = function (id) {
        var that = this;
        return new Promise(function (resolve, reject) {
            var aPages = that._oStorage.get("pages") || [];
            aPages.forEach(function (page) {
                if (page.id === id) {
                    resolve(page);
                }
            });
            reject({ error: "No page with id '" + id + "' was found." });
        });
    };

    return PagePersistenceAdapter;
}, true /* bExport */);
