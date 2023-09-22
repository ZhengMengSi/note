// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview PagePersistenceAdapter for the ABAP platform.
 * @version 1.77.2
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ushell/resources",
    "sap/ushell/utils/clone"
], function (ObjectPath, ODataModel, resources, fnClone) {
    "use strict";

    /**
     * Gets the service url from window["sap-ushell-config"].services.PagePersistence.
     *
     * @returns {string} the service url.
     */
    function getServiceUrl () {
        var oServiceConfig = (window["sap-ushell-config"].services && window["sap-ushell-config"].services.PagePersistence) || {};
        return (ObjectPath.get("config.serviceUrl", oServiceConfig.adapter) || "").replace(/\/?$/, "/");
    }

    var oODataModel = new ODataModel({
        serviceUrl: getServiceUrl(),
        headers: {
            "sap-language": sap.ushell.Container.getUser().getLanguage(),
            "sap-client": sap.ushell.Container.getLogonSystem().getClient()
        },
        defaultCountMode: "None",
        skipMetadataAnnotationParsing: true,
        useBatch: false
    });

    var oMetaDataPromise = new Promise(function (resolve, reject) {
        oODataModel.attachMetadataLoaded(resolve);
        oODataModel.attachMetadataFailed(reject);
    });

    /**
    * Constructs a new instance of the PagePersistenceAdapter for the ABAP
    * platform
    *
    * @constructor
    *
    * @experimental Since 1.67.0
    * @private
    */
    var PagePersistenceAdapter = function () {
        this.S_COMPONENT_NAME = "sap.ushell_abap.adapters.abap.PagePersistenceAdapter";
    };

    /**
     * Returns the instance of ODataModel
     *
     * @returns {sap.ui.model.odata.v2.ODataModel} The OData model
     */
    PagePersistenceAdapter.prototype.getODataModel = function () {
        return oODataModel;
    };

    /**
     * Returns the instance of ODataModel
     *
     * @returns {sap.ui.model.odata.v2.ODataModel} The OData model
     */
    PagePersistenceAdapter.prototype.getMetadataPromise = function () {
        return oMetaDataPromise;
    };

    /**
    * Returns a page
    *
    * @param {string} pageId The page ID
    * @returns {Promise} Resolves to a page
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype.getPage = function (pageId) {
        return this._readPage(pageId)
            .then(this._convertODataToReferencePage)
            .catch(this._rejectWithError.bind(this));
    };

    /**
    * Returns array of pages
    *
    * @param {array} aPageId The array of page ID
    * @returns {Promise} Resolves to array of pages
    *
    * @experimental Since 1.75.0
    * @private
    */
    PagePersistenceAdapter.prototype.getPages = function (aPageId) {
        return this._readPages(aPageId)
            .then(function (page) {
                return page.results.map(this._convertODataToReferencePage);
            }.bind(this))
            .catch(this._rejectWithError.bind(this));
    };

    /**
    * Reads a page from the server
    *
    * @param {string} pageId The page ID
    * @returns {Promise} Resolves to a page in the OData format
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._readPage = function (pageId) {
        return this.getMetadataPromise().then(function () {
            return new Promise(function (resolve, reject) {
                this.getODataModel().read("/pageSet('" + encodeURIComponent(pageId) + "')", {
                    urlParameters: {
                        "$expand": "sections/tiles"
                    },
                    success: resolve,
                    error: reject
                });
            }.bind(this));
        }.bind(this));
    };

    /**
    * Reads pages from the server
    *
    * @param {array} aPageId The array of page ID
    * @returns {Promise} Resolves to a array of page in the OData format
    *
    * @experimental Since 1.75.0
    * @private
    */
    PagePersistenceAdapter.prototype._readPages = function (aPageId) {
        return this.getMetadataPromise().then(function () {
            return new Promise(function (resolve, reject) {
                sap.ui.define(["sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (Filter, FilterOperator) {
                    var aPageFilters = [],
                        oPageFilter;
                    for (var i = 0; i < aPageId.length; i++) {
                        oPageFilter = new Filter({
                            path: "id",
                            operator: FilterOperator.EQ,
                            value1: aPageId[i],
                            and: false
                        });
                        aPageFilters.push(oPageFilter);
                    }
                    return this.getODataModel().read("/pageSet", {
                        urlParameters: {
                            "$expand": "sections/tiles"
                        },
                        filters: aPageFilters,
                        success: resolve,
                        error: reject
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    };

    /**
    * Converts a reference page from the OData format to the FLP internal format.
    *
    * @param {object} page The page in the OData format.
    * @returns {object} The page in the FLP format.
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._convertODataToReferencePage = function (page) {
        var oPage = fnClone(page);
        delete oPage.__metadata;
        if (oPage.sections && oPage.sections.results) {
            oPage.sections = oPage.sections.results;
            oPage.sections.forEach(function (section) {
                delete section.__metadata;
                section.visualizations = section.tiles.results; // naming mismatch between frontend and backend
                delete section.tiles;
                section.visualizations.forEach(function (visualization) {
                    delete visualization.__metadata;
                    visualization.vizId = visualization.catalogTile; // naming mismatch between frontend and backend
                    visualization.inboundPermanentKey = visualization.targetMapping; // naming mismatch between frontend and backend
                });
            });
        }
        if (!oPage.createdByFullname && oPage.createdBy) { oPage.createdByFullname = oPage.createdBy; }
        if (!oPage.modifiedByFullname && oPage.modifiedBy) { oPage.modifiedByFullname = oPage.modifiedBy; }
        return oPage;
    };

    /**
    *
    * @param {object} error The error object
    * @returns {Promise} A rejected promise containing the error
    *
    * @experimental Since 1.67.0
    * @private
    */
    PagePersistenceAdapter.prototype._rejectWithError = function (error) {
        var oError = {
            component: this.S_COMPONENT_NAME,
            description: resources.i18n.getText("PagePersistenceAdapter.CannotLoadPage"),
            detail: error
        };
        return Promise.reject(oError);
    };

    return PagePersistenceAdapter;
}, true /* bExport */);
