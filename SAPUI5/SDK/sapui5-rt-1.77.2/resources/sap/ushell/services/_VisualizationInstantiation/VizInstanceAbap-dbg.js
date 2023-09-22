// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/services/_VisualizationInstantiation/VizInstance"
], function (VizInstance) {
    "use strict";

    /**
     * @constructor for a VizInstance for ABAP data
     *
     * @extends sap.ushell.ui.launchpad.VizInstance
     * @param {object} vizData The visualization entity
     *
     * @name sap.ushell.ui.launchpad.VizInstanceAbap
     *
     * @since 1.77
     */
    var VizInstanceAbap = VizInstance.extend("sap.ushell.ui.launchpad.VizInstanceAbap", {
        metadata: {
            library: "sap.ushell"
        },
        constructor: function (vizData) {
            this._oVizData = vizData;

            this._oPageBuildingServicePromise = sap.ushell.Container.getServiceAsync("PageBuilding");

            VizInstance.prototype.constructor.call(this);
        },
        fragment: "sap.ushell.services._VisualizationInstantiation.VizInstanceAbap"
    });

    /**
     * VizInstanceAbap initializer
     *
     * @since 1.77
     * @private
     */
    VizInstanceAbap.prototype.init = function () {
        this._oPageBuildingServicePromise.then(function (oPageBuildingService) {
            var oFactory = oPageBuildingService.getFactory();
            this.oChipInstance = oFactory.createChipInstance({
                chipId: this._oVizData._instantiationData.chip.id,
                chip: this._oVizData._instantiationData.chip
            });
        }.bind(this));
    };

    /**
     * A function which sets the content of the VizInstance to a UI5 view
     *
     * @param {boolean} isPreview Load the tile in preview mode, i.e. dynamic tiles do not send requests
     * @returns {Promise<void>} Resolves when the chip instance is loaded
     * @since 1.77
     */
    VizInstanceAbap.prototype.load = function (isPreview) {
        return new Promise(function (resolve, reject) {
            this._oPageBuildingServicePromise.then(function () {
                this.oChipInstance.load(function () {
                    if (isPreview) {
                        var oPreviewContract = this.oChipInstance.getContract("preview");

                        if (!oPreviewContract) {
                            reject(new Error("The chip instance has no preview contract"));
                            return;
                        }

                        oPreviewContract.setEnabled(true);
                    }
                    var oView = this.oChipInstance.getImplementationAsSapui5();

                    var iWidth = parseInt(this.oChipInstance.getConfigurationParameter("col"), 10) || 1;
                    var iHeight = parseInt(this.oChipInstance.getConfigurationParameter("row"), 10) || 1;

                    // The generic tiles have fixed sizes of e.g. 1x1 or 1x2 which refer to
                    // 2:2 and 4:2 grid cells. As the width and the height of a vizInstance always
                    // refers to grid cells the sizes are converted to the grid size.
                    iWidth = iWidth * 2;
                    iHeight = iHeight * 2;

                    this.setWidth(iWidth);
                    this.setHeight(iHeight);

                    this._setContent(oView);
                    resolve();
                }.bind(this), reject);
            }.bind(this));
        }.bind(this));
    };

    return VizInstanceAbap;
});