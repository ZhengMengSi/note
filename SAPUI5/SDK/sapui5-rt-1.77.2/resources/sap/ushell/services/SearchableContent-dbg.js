// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview This module exposes the searchable content.
 * @version 1.77.2
 */
sap.ui.define([
    "sap/ushell/Config",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readApplications",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readPages",
    "sap/base/util/values"
], function (
    Config,
    readApplications,
    readVisualizations,
    readPages,
    objectValues
) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("SearchableContent")</code>.
     * Constructs a new instance of the searchable content service.
     *
     * @namespace sap.ushell.services.SearchableContent
     *
     * @constructor
     * @class
     * @see {@link sap.ushell.services.Container#getService}
     * @since 1.77.0
     *
     * @public
     */
    var SearchableContent = function () {};
    SearchableContent.COMPONENT_NAME = "sap/ushell/services/SearchableContent";

    /**
     * @typedef appData
     * @type {object}
     * @property {string} id
     * @property {string} title
     * @property {string} subtitle
     * @property {string} icon
     * @property {string} info
     * @property {string[]} keywords
     *    Search key words
     * @property {object} target
     *    Same format as in CDM RT schema in visualization/vizConfig/sap.flp/target.
     * @property {vizData[]} visualizations
     *    List of tiles etc.
     */

    /**
     * @typedef vizData
     * @type {object}
     * @property {string} id
     * @property {string} vizId
     * @property {string} vizTypeId
     * @property {string} title
     * @property {string} subtitle
     * @property {string} icon
     * @property {string} info
     * @property {string[]} keywords
     *    Search key words
     * @property {object} target
     *    Same format as in CDM RT schema in visualization/vizConfig/sap.flp/target.
     * @property {object} _instantiationData
     *    Platform-specific data for instantiation
     */

    /**
     * Collects and returns all apps
     * @returns {Promise<appData[]>} A list of appData.
     *
     * @since 1.77.0
     * @public
     */
    SearchableContent.prototype.getApps = function () {
        if (Config.last("/core/spaces/enabled")) {
            return this._getPagesAppData()
                .then(this._filterGetApps);
        }
        return this._getLaunchPageAppData()
            .then(this._filterGetApps);
    };

    /**
     * Filters duplicates and appData with empty vizData
     * @param {appData[]} aAppData An array of appData
     * @returns {appData[]} The filtered array of appData
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._filterGetApps = function (aAppData) {
        aAppData.forEach(function (oAppData) {
            // remove duplicates
            var aVisualizations = oAppData.visualizations;
            var aUniqueProperties = [];
            oAppData.visualizations = [];
            aVisualizations.forEach(function (oViz) {
                var sUniqueProperties = JSON.stringify({
                    title: oViz.title,
                    subtitle: oViz.subtitle,
                    icon: oViz.icon,
                    vizTypeId: oViz.vizTypeId
                });
                if (aUniqueProperties.indexOf(sUniqueProperties) === -1) {
                    oAppData.visualizations.push(oViz);
                    aUniqueProperties.push(sUniqueProperties);
                }
            });
        });

        return aAppData.filter(function (oAppData) {
            // remove apps without visualization
            return oAppData.visualizations.length > 0;
        });
    };

    /**
     * Collects all appData occurrences within the classic homepage scenario
     * @returns {Promise<appData[]>} An array of appData
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._getLaunchPageAppData = function () {
        return sap.ushell.Container.getServiceAsync("LaunchPage")
            .then(function (oLaunchPageService) {
                this._oLaunchPageService = oLaunchPageService;
                return this._collectLaunchPageTiles();
            }.bind(this))
            .then(function (aLaunchPageTiles) {
                var mAppData = {};
                var aVizData = aLaunchPageTiles
                    .map(this._buildVizDataFromLaunchPageTile.bind(this))
                    .filter(function (oVizData) {
                        return oVizData;
                    });

                aVizData.forEach(function (oVizData) {
                    var sTarget = this._getTargetHash(undefined, oVizData.target);

                    if (mAppData[sTarget]) {
                        mAppData[sTarget].visualizations.push(oVizData);
                    } else {
                        mAppData[sTarget] = this._buildAppDataFromViz(oVizData);
                    }
                }.bind(this));
                return objectValues(mAppData);
            }.bind(this));
    };

    /**
     * Collects catalog and group tiles from the LaunchPage service
     * @returns {Promise<object[]>} Resolves an array of LaunchPage tiles
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._collectLaunchPageTiles = function () {
        return new Promise(function (resolve, reject) {
            this._oLaunchPageService.getCatalogs().then(function (aCatalogs) {
                var aDeferreds = [];
                aCatalogs.forEach(function (oCatalog) {
                    aDeferreds.push(this._oLaunchPageService.getCatalogTiles(oCatalog));
                }.bind(this));
                var oGroupTilesDeferred = this._oLaunchPageService.getGroups().then(function (aGroups) {
                    var aTiles = [];
                    aGroups.forEach(function (oGroup) {
                        Array.prototype.push.apply(aTiles, this._oLaunchPageService.getGroupTiles(oGroup) || []);
                    }.bind(this));
                    return aTiles;
                }.bind(this));
                aDeferreds.push(oGroupTilesDeferred);
                return jQuery.when.apply(jQuery, aDeferreds).then(function () {
                    var aTiles = [];
                    var aDeferredResults = Array.prototype.slice.call(arguments);
                    aDeferredResults.forEach(function (aDeferredResult) {
                        Array.prototype.push.apply(aTiles, aDeferredResult);
                    });
                    resolve(aTiles);
                });
            }.bind(this));
        }.bind(this));
    };

    /**
     * Collects all appData occurrences within the pages scenario
     * @returns {Promise<appData[]>} An array of appData
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._getPagesAppData = function () {
        return sap.ushell.Container.getServiceAsync("CommonDataModel")
            .then(function (oCdmService) {
                return Promise.all([
                    oCdmService.getAllPages(),
                    oCdmService.getApplications(),
                    oCdmService.getVisualizations(),
                    sap.ushell.Container.getServiceAsync("URLParsing")
                ]);
            }).then(function (aResult) {
                var aPages = aResult[0];
                var oApplications = aResult[1];
                var oVisualizations = aResult[2];
                this._oUrlParsingService = aResult[3];

                var oSite = {
                    applications: oApplications,
                    visualizations: oVisualizations
                };
                var mAppData = {};

                this._applyCdmApplications(oSite, mAppData);
                this._applyCdmPages(oSite, aPages, mAppData);

                return objectValues(mAppData);
            }.bind(this));
    };

    /**
     * Manipulates the map of appData by adding all applications
     * @param {object} oSite The cdm site containing atleast applications and visualizations
     * @param {object} mAppData The map of appData
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._applyCdmApplications = function (oSite, mAppData) {
        objectValues(oSite.applications).forEach(function (oApp) {
            var oInbounds = readApplications.getInbounds(oApp) || {};
            objectValues(oInbounds).forEach(function (oInbound) {
                var sTarget = this._getTargetHash(oSite, oInbound);
                mAppData[sTarget] = this._buildAppDataFromAppAndInbound(oApp, oInbound);
                mAppData[sTarget].target = this._oUrlParsingService.parseShellHash(sTarget);
            }.bind(this));
        }.bind(this));
    };

    /**
     * Manipulates the map of appData by adding all visualizations from the pages
     * @param {object} oSite The cdm site containing atleast applications and visualizations
     * @param {object[]} aPages The list of pages
     * @param {object} mAppData The map of appData
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._applyCdmPages = function (oSite, aPages, mAppData) {
        aPages.forEach(function (oPage) {
            var aVizReferences = readPages.getVisualizationReferences(oPage);
            aVizReferences.forEach(function (oVizReference) {
                var oVizData = readVisualizations.getVizData(oSite, oVizReference);
                var sTarget = this._getTargetHash(oSite, oVizData.target);

                if (mAppData[sTarget]) {
                    mAppData[sTarget].visualizations.push(oVizData);
                } else {
                    mAppData[sTarget] = this._buildAppDataFromViz(oVizData);
                }
            }.bind(this));
        }.bind(this));
    };

    /**
     * Returns the hash of the target, what can be based on a url, an inbound or a target object
     * @param {object} oSite A cdm site object
     * @param {object} oSite.applications The applications object within the cdm site
     * @param {object} oTarget The target object
     *
     * @returns {string} The hash for this target or undefined when object is not parsable
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._getTargetHash = function (oSite, oTarget) {
        var sTarget;
        var sAppId = oTarget.appId;
        var sInboundId = oTarget.inboundId;
        if (oTarget.url) {
            sTarget = oTarget.url;
            if (sTarget[0] === "#") {
                sTarget = sTarget.substring(1);
            }

        } else if (sAppId && sInboundId) {
            var oApplication = readVisualizations.getAppDescriptor(oSite, sAppId) || {};
            var oInbound = readApplications.getInbound(oApplication, sInboundId) || {};
            sTarget = this._oUrlParsingService.constructShellHash(oInbound);

        } else {
            sTarget = this._oUrlParsingService.constructShellHash(oTarget);
        }
        return sTarget;
    };

    /**
     * Constructs an appData object based on an application and inbound
     * @param {object} oApp An application
     * @param {object} oInb An inbound
     * @returns {appData} The appData object
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._buildAppDataFromAppAndInbound = function (oApp, oInb) {
        return {
            id: readApplications.getId(oApp),
            title: oInb.title || readApplications.getTitle(oApp),
            subtitle: oInb.subTitle || readApplications.getSubTitle(oApp),
            icon: oInb.icon || readApplications.getIcon(oApp),
            info: oInb.info || readApplications.getInfo(oApp),
            keywords: oInb.keywords || readApplications.getKeywords(oApp),
            visualizations: []
        };
    };

    /**
     * Constructs an appData object based on vizData
     * @param {vizData} oVizData The vizData object
     * @returns {appData} The appData object
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._buildAppDataFromViz = function (oVizData) {
        return {
            id: oVizData.vizId,
            title: oVizData.title,
            subtitle: oVizData.subtitle,
            icon: oVizData.icon,
            info: oVizData.info,
            keywords: oVizData.keywords,
            target: oVizData.target,
            visualizations: [
                oVizData
            ]
        };
    };

    /**
     * Constructs an vizData object based on a LaunchPage tile
     * @param {object} oLaunchPageTile A LaunchPage tile
     * @returns {vizData} The vizData object
     *
     * @since 1.77.0
     * @private
     */
    SearchableContent.prototype._buildVizDataFromLaunchPageTile = function (oLaunchPageTile) {
        var oTileView;

        // Filter all tiles with missing tileResolution
        if (!this._oLaunchPageService.getCatalogTileTargetURL(oLaunchPageTile)) {
            return;
        }
        if (this._oLaunchPageService.isTileIntentSupported && !this._oLaunchPageService.isTileIntentSupported(oLaunchPageTile)) {
            return;
        }

        // Some tiles need the view for tile properties
        if (!this._oLaunchPageService.getCatalogTilePreviewTitle(oLaunchPageTile)) {
            oTileView = this._oLaunchPageService.getCatalogTileView(oLaunchPageTile);
        }

        var oVizData = {
            id: this._oLaunchPageService.getTileId(oLaunchPageTile)
                || this._oLaunchPageService.getCatalogTileId(oLaunchPageTile),
            vizId: this._oLaunchPageService.getCatalogTileId(oLaunchPageTile)
                || this._oLaunchPageService.getTileId(oLaunchPageTile)
                || "",
            vizTypeId: "",
            title: this._oLaunchPageService.getCatalogTilePreviewTitle(oLaunchPageTile)
                || this._oLaunchPageService.getCatalogTileTitle(oLaunchPageTile)
                || this._oLaunchPageService.getTileTitle(oLaunchPageTile)
                || "",
            subtitle: this._oLaunchPageService.getCatalogTilePreviewSubtitle(oLaunchPageTile)
                || "",
            icon: this._oLaunchPageService.getCatalogTilePreviewIcon(oLaunchPageTile)
                || "sap-icon://business-objects-experience",
            info: this._oLaunchPageService.getCatalogTilePreviewInfo(oLaunchPageTile)
                || "",
            keywords: this._oLaunchPageService.getCatalogTileKeywords(oLaunchPageTile)
                || [],
            target: {
                type: "URL",
                url: this._oLaunchPageService.getCatalogTileTargetURL(oLaunchPageTile)
            }
        };

        if (oTileView) {
            if (!oTileView.destroy) {
                var oError = new Error("The tileview \"" + oVizData.title + "\" with target url \"" + oVizData.target.url + "\" does not implement mandatory function destroy!");
                throw oError;
            }
            oTileView.destroy();
        }

        return oVizData;
    };

    SearchableContent.hasNoAdapter = true;
    return SearchableContent;
}, /*export=*/ true);
