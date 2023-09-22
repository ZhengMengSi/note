// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileOverview This module deals with the instantiation of visualizations in a platform independent way.
 * @version 1.77.2
 */
sap.ui.define([
    "sap/ushell/services/_VisualizationInstantiation/VizInstanceAbap"
], function (
    VizInstanceAbap
) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>sap.ushell.Container.getService("VisualizationInstantiation")</code>.
     * Constructs a new instance of the VisualizationInstantiation service.
     *
     * @namespace sap.ushell.services.VisualizationInstantiation
     *
     * @constructor
     * @class
     * @see {@link sap.ushell.services.Container#getService}
     * @since 1.77.0
     *
     * @private
     */
     function VisualizationInstantiation () {}

    /**
     * A factory function to create a VizInstance of type corresponding to source platform {ABAP|CDM}
     *
     * !!! Currently only the ABAP platform is supported !!!
     *
     * @param {object} vizData - visualizationData for one single visualization
     * @returns {object} oVizInstance - a VizInstance of one of {VizInstanceAbap|null} based on source platform
     * @since 1.77
     */
    VisualizationInstantiation.prototype.instantiateVisualization = function (vizData) {
        var oVizInstance;
        var sPlatform = vizData._instantiationData.platform;

        switch (sPlatform) {
            case "ABAP": {
                oVizInstance = new VizInstanceAbap(vizData);
                oVizInstance.load();
                break;
            }
            default: {
                break;
            }
        }

        return oVizInstance;
    };

    VisualizationInstantiation.hasNoAdapter = true;

    return VisualizationInstantiation;
});