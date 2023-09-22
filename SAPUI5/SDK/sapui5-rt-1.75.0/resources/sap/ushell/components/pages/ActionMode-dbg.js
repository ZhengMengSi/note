//Copyright (c) 2009-2020 SAP SE, All Rights Reserved
/**
 * @fileOverview ActionMode for the PageRuntime view
 *
 * @version 1.75.0
 */

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/EventHub",
    "sap/base/Log"
], function (resources, EventHub, Log) {
    "use strict";
    var ActionMode = {};

    /**
     * Initialization of the action mode for the pages runtime
     *
     * @param {sap.ui.core.mvc.Controller} oController Controller of the pages runtime
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.start = function (oController) {
        this.oController = oController;
        oController.getView().getModel("viewSettings").setProperty("/actionModeActive", true);

        EventHub.emit("enableMenuBarNavigation", false);

        var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
        var sActionModeButtonText = resources.i18n.getText("PageRuntime.EditMode.Exit");
        oActionModeButton.setTooltip(sActionModeButtonText);
        oActionModeButton.setText(sActionModeButtonText);
    };

    /**
     * Handler for action mode cancel
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.cancel = function () {
        this._cleanup();
    };

    /**
     * Handler for action mode save
     *
     * @private
     * @since 1.74.0
     */
    ActionMode.save = function () {
        Log.info("store actions in pages service");
        this._cleanup();
    };

    /**
     * Disables the action mode and enables the navigation
     *
     * @private
     * @since 1.74.0
     */
    ActionMode._cleanup = function () {
        this.oController.getView().getModel("viewSettings").setProperty("/actionModeActive", false);
        EventHub.emit("enableMenuBarNavigation", true);

        var oActionModeButton = sap.ui.getCore().byId("ActionModeBtn");
        var sActionModeButtonText = resources.i18n.getText("PageRuntime.EditMode.Activate");
        oActionModeButton.setTooltip(sActionModeButtonText);
        oActionModeButton.setText(sActionModeButtonText);
    };

    /**
     * Handler for add visualization
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @private
     * @since 1.75.0
     */
    ActionMode.addVisualization = function (oEvent, oSource, oParameters) {
        Log.info("add visualization");
    };

    /**
     * Handler for add section
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @returns {Promise<void>} A promise that is resolved when the Pages service is retrieved.
     *
     * @private
     * @since 1.75.0
     */
    ActionMode.addSection = function (oEvent, oSource, oParameters) {
        var iSectionIndex = oParameters.index;

        var sPath = oSource.getBindingContext().getPath();
        // ["","pages","2"]
        var aPathParts = sPath.split("/");
        var iPageIndex = parseInt(aPathParts[2], 10);

        return this.oController._oPagesService.then(function (oPagesService) {
            oPagesService.addSection(iPageIndex, iSectionIndex);
        });
    };

    /**
     * Handler for delete section
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @returns {Promise<void>} A promise that is resolved when the Pages service is retrieved.
     *
     * @private
     * @since 1.75.0
     */
    ActionMode.deleteSection = function (oEvent, oSource, oParameters) {
        var oSection = oSource;

        var sPath = oSection.getBindingContext().getPath();

        // ["","pages","0","sections","1"]
        var aPathParts = sPath.split("/");
        var iPageIndex = parseInt(aPathParts[2], 10);
        var iSectionIndex = parseInt(aPathParts[4], 10);

        return this.oController._oPagesService.then(function (oPagesService) {
            oPagesService.deleteSection(iPageIndex, iSectionIndex);
        });
    };

    /**
     * Handler for reset section
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @returns {Promise<void>} A promise that is resolved when the Pages service is retrieved.
     *
     * @private
     * @since 1.75.0
     */
    ActionMode.resetSection = function (oEvent, oSource, oParameters) {
        var oSection = oSource;

        var sPath = oSection.getBindingContext().getPath();

        // ["","pages","0","sections","1"]
        var aPathParts = sPath.split("/");
        var iPageIndex = parseInt(aPathParts[2], 10);
        var iSectionIndex = parseInt(aPathParts[4], 10);

        return this.oController._oPagesService.then(function (oPagesService) {
            oPagesService.resetSection(iPageIndex, iSectionIndex);
        });
    };

    /**
     * Handler for change section title
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @returns {Promise<void>} A promise that is resolved when the Pages service is retrieved.
     *
     * @private
     * @since 1.75.0
     */
    ActionMode.changeSectionTitle = function (oEvent, oSource, oParameters) {
        var sPath = oSource.getBindingContext().getPath();
        var sNewTitle = oSource.getProperty("title");

        // ["","pages","0","sections","1"]
        var aPathParts = sPath.split("/");
        var iPageIndex = parseInt(aPathParts[2], 10);
        var iSectionIndex = parseInt(aPathParts[4], 10);

        return this.oController._oPagesService.then(function (oPagesService) {
            oPagesService.renameSection(iPageIndex, iSectionIndex, sNewTitle);
        });
    };

    /**
     * Handler for section drag and drop
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @returns {Promise<void>} A promise that is resolved when the Pages service is retrieved.
     *
     * @private
     * @since 1.75.0
     */
    ActionMode.moveSection = function (oEvent, oSource, oParameters) {
        var sSourcePath = oParameters.draggedControl.getBindingContext().getPath();
        var sTargetPath = oParameters.droppedControl.getBindingContext().getPath();
        var sDropPosition = oParameters.dropPosition;

        var aTargetPathParts = sTargetPath.split("/");
        var aSourcePathParts = sSourcePath.split("/");

        var iPageIndex = parseInt(aSourcePathParts[2], 10);
        var iSourceSectionIndex = parseInt(aSourcePathParts[4], 10);
        var iTargetSectionIndex = parseInt(aTargetPathParts[4], 10);


        if (iSourceSectionIndex === iTargetSectionIndex - 1 && sDropPosition === "Before" ||
                iSourceSectionIndex === iTargetSectionIndex + 1 && sDropPosition === "After") {
            return Promise.resolve();
        }

        // Needed, to not pass the drop position to the service.
        if (sDropPosition === "After") {
            iTargetSectionIndex = iTargetSectionIndex + 1;
        }

        var oPage = this.oController._getAncestorPage(oParameters.droppedControl);
        var aSections = oPage.getSections();
        var i;

        // sourceSection got dragged downwards, the sections inbetween move upwards
        if (iSourceSectionIndex < iTargetSectionIndex) {
            for (i = iSourceSectionIndex + 1; i < iTargetSectionIndex; i++) {
                this.oController._setPromiseInSection(aSections[i], aSections[i - 1]);
            }
            this.oController._setPromiseInSection(aSections[iSourceSectionIndex], aSections[iTargetSectionIndex - 1]);
        // sourceSection got dragged upwards, the sections inbetween move downwards
        } else {
            for (i = iTargetSectionIndex; i < iSourceSectionIndex; i++) {
                this.oController._setPromiseInSection(aSections[i], aSections[i + 1]);
            }
            this.oController._setPromiseInSection(aSections[iSourceSectionIndex], aSections[iTargetSectionIndex]);
        }

        return this.oController._oPagesService.then(function (oPagesService) {
            oPagesService.moveSection(iPageIndex, iSourceSectionIndex, iTargetSectionIndex);
        });
    };

    /**
     * Handler for hide and unhide section
     *
     * @param {sap.ui.base.Event} oEvent Event object
     * @param {sap.ui.core.Control} oSource Source control
     * @param {object} oParameters Event parameters
     *
     * @returns {Promise<void>} A promise that is resolved when the Pages service is retrieved.
     *
     * @private
     * @since 1.75.0
     */
    ActionMode.changeSectionVisibility = function (oEvent, oSource, oParameters) {
        if (this.oController === undefined || oParameters.visible === undefined) {
            return Promise.resolve();
        }

        var sPath = oSource.getBindingContext().getPath();
        var bVisibility = oParameters.visible;

        // ["","pages","0","sections","1"]
        var aPathParts = sPath.split("/");
        var iPageIndex = parseInt(aPathParts[2], 10);
        var iSectionIndex = parseInt(aPathParts[4], 10);

        return this.oController._oPagesService.then(function (oPagesService) {
            oPagesService.setSectionVisibility(iPageIndex, iSectionIndex, bVisibility);
        });
    };

    return ActionMode;
});