// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ui/core/XMLComposite"
], function (mobileLibrary, XMLComposite) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;
    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;

    /**
     * @constructor
     */
    var VizInstance = XMLComposite.extend("sap.ushell.ui.launchpad.VizInstance", /** @lends  sap.ushell.ui.launchpad.VizInstance.prototype*/ {
        metadata: {
            library: "sap.ushell",
            properties: {
                title: {
                    type: "string",
                    defaultValue: "",
                    bindable: true
                },
                height: {
                    type: "int",
                    defaultValue: 2
                },
                width: {
                    type: "int",
                    defaultValue: 2
                },
                state: {
                    type: "sap.m.LoadState",
                    defaultValue: LoadState.Loaded,
                    bindable: true
                },
                sizeBehavior: {
                    type: "sap.m.TileSizeBehavior",
                    defaultValue: TileSizeBehavior.Responsive,
                    bindable: true
                },
                editable: {
                    type: "boolean",
                    defaultValue: false,
                    bindable: true
                },
                active: {
                    type: "boolean",
                    defaultValue: false
                }
            },
            aggregations: {
                layoutData: {
                    type: "sap.ui.core.LayoutData",
                    multiple: false
                }
            },
            events: {
                press: {
                    parameters: {
                        scope: { type: "sap.m.GenericTileScope" },
                        action: { type: "string" }
                    }
                }
            }
        },
        fragment: "sap.ushell.services._VisualizationInstantiation.VizInstance"
    });

    /**
     * Returns the layout data for the Gridcontainer/Section
     *
     * @returns {object} oLayout the layout data in "columns x rows" format. E.g.: "2x2"
     * @since 1.77.0
     */
    VizInstance.prototype.getLayout = function () {
        return {
            columns: this.getWidth(),
            rows: this.getHeight()
        };
    };

    /**
     * Updates the content aggregation of the XML composite and recalculates its layout data
     *
     * @param {sap.ui.core.Control} content The control to be put inside the visualization
     * @since 1.77.0
     */
    VizInstance.prototype._setContent = function (content) {
        var oGridData = this.getLayoutData();
        if (oGridData && oGridData.isA("sap.f.GridContainerItemLayoutData")) {
            oGridData.setRows(this.getHeight());
            oGridData.setColumns(this.getWidth());
            this.getParent().invalidate();
        }

        // Replace the generic tile of the XML composite control with the actual content
        this.setAggregation("_content", content);
    };

    /**
     * Loads the content of the VizInstance and resolves the returned Promise
     * when loading is completed.
     *
     * @returns {Promise<void>} Resolves when loading is completed
     * @abstract
     * @since 1.77.0
     */
    VizInstance.prototype.load = function () {
        // As this is the base control that doesn't load anything a resolved Promise is
        // returned always.
        return Promise.resolve();
    };

    return VizInstance;

});