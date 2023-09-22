// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/resources"
], function (
    mobileLibrary,
    UIComponent,
    Filter,
    FilterOperator,
    JSONModel,
    resources
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    /* global Map, Set */

    // visualizationOrganizer Component
    return UIComponent.extend("sap.ushell.components.visualizationOrganizer.Component", {
        metadata: {
            version: "1.75.0",
            library: "sap.ushell.components.visualizationOrganizer",
            dependencies: { libs: ["sap.m"] }
        },

        /**
         * Initializes the VisualizationOrganizer and requests the required data.
         * If a model was set, its bindings are updated after the request is done.
         *
         * @see requestData
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments); // call the init function of the parent

            this.mVizIdInSpaces = new Map(); // a vizId map of sets of Spaces (to check if a vizId is in a Space)
            this.mVizIdInPages = new Map(); // a vizId map of sets of Pages (to check if a vizId is in a Page)
            this.mPageInSpaces = new Map(); // a Page map of sets of Spaces (to check if a Page is in a Space)
            this.mSpacePages = new Map(); // a Page map of sets of Spaces (to check if a Space has a Page)
            this.stPageIds = new Set(); // a set of every Page ID (to request the Pages via "getPages")

            this.requestData().then(function () {
                if (this.oModel) {
                    this.oModel.updateBindings(true);
                }
            }.bind(this));
        },

        /**
         * Requests the Spaces, Pages, and Visualizations data.
         * Populates the Maps and Sets to contain this data in a structured way.
         *
         * @returns {Promise<undefined>} A promise that resolves when the data request and processing is done.
         *
         * @see _collectPageIds
         * @see _fillVizIdMaps
         * @see setModel
         */
        requestData: function () {
            var oMenuService;
            var oCommonDataModelService;
            return Promise.all([
                sap.ushell.Container.getServiceAsync("Menu"),
                sap.ushell.Container.getServiceAsync("CommonDataModel")
            ])
                .then(function (aResults) {
                    oMenuService = aResults[0];
                    oCommonDataModelService = aResults[1];
                    return oMenuService.getSpacesPagesHierarchy();
                })
                .then(function (oSpaces) {
                    return oCommonDataModelService.getPages(this._collectPageIds(oSpaces.spaces));
                }.bind(this))
                .then(function (aMyPages) {
                    this._fillVizIdMaps(aMyPages);
                }.bind(this));
        },

        /**
         * Set the model that should have its bindings updated when {@link requestData} is done.
         *
         * @param {sap.ui.model.json.JSONModel} model The model that should have its bindings updated when {@link requestData} is done.
         *
         * @see requestData
         */
        setModel: function (model) {
            this.oModel = model;
        },

        /**
         * Collects the Page IDs from the given Spaces and populates "mPageInSpaces", "mSpacePages", and "stPageIds".
         * This is used by {@link requestData}.
         *
         * @param {object[]} aSpaces The Spaces to gather data from.
         * @returns {string[]} Every Page ID from the given Spaces.
         *
         * @see requestData
         */
        _collectPageIds: function (aSpaces) {
            aSpaces.forEach(function (oSpace) {
                oSpace.pages.forEach(function (oPage) {
                    if (this.mPageInSpaces.has(oPage.id)) {
                        this.mPageInSpaces.get(oPage.id).add(oSpace.id);
                    } else {
                        this.mPageInSpaces.set(oPage.id, new Set([oSpace.id]));
                    }
                    if (this.mSpacePages.has(oSpace.id)) {
                        this.mSpacePages.get(oSpace.id).add(oPage.id);
                    } else {
                        this.mSpacePages.set(oSpace.id, new Set([oPage.id]));
                    }
                    this.stPageIds.add(oPage.id);
                }.bind(this));
            }.bind(this));
            return Array.from(this.stPageIds);
        },

        /**
         * Collects the data from the given Pages and populates "mVizIdInPages" and "mVizIdInSpaces".
         * This is used by {@link requestData}.
         * Note: This function assumes that "mPageInSpaces" is already created and set,
         *       therefore "_collectPageIds()" must be called before calling this function.
         *
         * @param {object[]} aPages The Pages to gather data from.
         *
         * @see requestData
         */
        _fillVizIdMaps: function (aPages) {
            aPages.forEach(function (oPage) {
                Object.keys(oPage.payload.sections).forEach(function (sId) {
                    Object.keys(oPage.payload.sections[sId].payload.viz).forEach(function (vId) {
                        var vizId = oPage.payload.sections[sId].payload.viz[vId].vizId;
                        if (this.mVizIdInPages.has(vizId)) {
                            this.mVizIdInPages.get(vizId).add(oPage.identification.id);
                        } else {
                            this.mVizIdInPages.set(vizId, new Set([oPage.identification.id]));
                        }
                        var stSpaces = this.mPageInSpaces.get(oPage.identification.id);
                        if (!stSpaces) {
                            throw new Error("\"_collectPageIds\" must be called before calling \"_fillVizIdMaps\"");
                        }
                        if (this.mVizIdInSpaces.has(vizId)) {
                            stSpaces.forEach(function (sSpaceId) {
                                this.mVizIdInSpaces.get(vizId).add(sSpaceId);
                            }.bind(this));
                        } else {
                            this.mVizIdInSpaces.set(vizId, new Set(stSpaces));
                        }
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Check if a visualization is within any Page.
         *
         * @param {string} vizId The vizId of the visualization to check.
         * @returns {boolean} Whether the visualization is within some Page (true) or not (false).
         */
        isVizIdPresent: function (vizId) {
            var stPages = this.mVizIdInPages.get(vizId);
            return !!(stPages && stPages.size);
        },

        /**
         * @param {string} vizId The vizId of a visualization.
         * @returns {sap.ui.core.URI} The icon that should be used for that visualization "pin" button.
         *
         * @see isVizIdPresent
         */
        formatPinButtonIcon: function (vizId) {
            return (this.isVizIdPresent(decodeURIComponent(vizId)) ? "sap-icon://accept" : "sap-icon://add");
        },

        /**
         * @param {string} vizId The vizId of a visualization.
         * @returns {sap.m.ButtonType} The type that should be used for that visualization "pin" button.
         *
         * @see isVizIdPresent
         */
        formatPinButtonType: function (vizId) {
            return (this.isVizIdPresent(decodeURIComponent(vizId)) ? ButtonType.Emphasized : ButtonType.Default);
        },

        /**
         * Collects event data from the given event and calls {@link toggle} with it.
         *
         * @param {sap.ui.base.Event} oEvent The event that raised the "onTilePinButtonClick" handler.
         * @returns {Promise<undefined>} A promise that resolves when the popover is toggled.
         *
         * @see toggle
         * @see VisualizationPresence
         */
        onTilePinButtonClick: function (oEvent) {
            var oSource = oEvent.getSource();
            var oTileData = oSource.getBindingContext().getProperty();
            var sVizId = decodeURIComponent(oTileData.id);
            return this.toggle(
                oSource,
                oTileData,
                {
                    spaceIds: this.mVizIdInSpaces.get(sVizId),
                    pageIds: this.mVizIdInPages.get(sVizId)
                }
            );
        },

        /**
         * @typedef {object} VisualizationPresence Information used to check where a visualization exists.
         * @property {set} spaceIds The Space IDs where a visualization exists.
         * @property {set} pageIds The Page IDs where a visualization exists.
         */

        /**
         * Method to open the visualizationOrganizer popover.
         *
         * @param {sap.ui.Control} oOpenBy The ui5 control, the popover should be opened by.
         * @param {object} oVizInfo The information of the visualization, that should be added.
         * @param {VisualizationPresence} visualizationPresence The information used to check where a visualization is.
         * @returns {Promise<undefined>} A promise that resolves when the popover opens.
         *
         * @since 1.75.0
         * @protected
         */
        open: function (oOpenBy, oVizInfo, visualizationPresence) {
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");

            if (!oPopover) {
                oPopover = sap.ui.xmlfragment("sap.ushell.components.visualizationOrganizer.VisualizationOrganizerPopover", this);
                oPopover.setModel(new JSONModel({ spaces: [], searchTerm: "" }));
                oPopover.setModel(resources.i18nModel, "i18n");
            }

            this.oOpenBy = oOpenBy;
            this.sVisualizationId = decodeURIComponent(oVizInfo.id);
            this.sVisualizationTitle = oVizInfo.title;
            this.fnAddVisualizations = this._organizeVisualizations.bind(this);
            this.fnResetPopup = this._resetPopup.bind(this);
            oPopover.attachBeforeClose(this.fnAddVisualizations);
            oPopover.attachAfterClose(this.fnResetPopup);

            return sap.ushell.Container.getServiceAsync("Menu")
                .then(function (MenuService) {
                    return MenuService.getSpacesPagesHierarchy();
                })
                .then(function (oHierarchy) {
                    var oPopoverModel = oPopover.getModel();
                    oPopoverModel.setData(oHierarchy);
                    oPopoverModel.setProperty("/pinnedSpaces", visualizationPresence.spaceIds);
                    oPopoverModel.setProperty("/pinnedPages", visualizationPresence.pageIds);
                    oPopover.openBy(oOpenBy);
                });
        },

        /**
         * Method to close the visualizationOrganizer popover.
         *
         * @since 1.75.0
         * @protected
         */
        close: function () {
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
            if (oPopover) {
                oPopover.close();
            }
        },

        /**
         * Method to toggle the visualizationOrganizer popover.
         *
         * @param {sap.ui.Control} oOpenBy The ui5 control, the popover should be toggled by.
         * @param {object} oVizInfo The information of the visualization, that should be added.
         * @param {VisualizationPresence} visualizationPresence The information used to check where a visualization is.
         * @returns {Promise<undefined>} A promise that resolves when the popover is toggled.
         *
         * @since 1.75.0
         * @protected
         */
        toggle: function (oOpenBy, oVizInfo, visualizationPresence) {
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
            // To really make the visualizationOrganizer toggleable, we need to know the last openBy control.
            if (oPopover && oPopover.isOpen() && oPopover._oOpenBy && oPopover._oOpenBy.getId() === oOpenBy.getId()) {
                this.close();
                return Promise.resolve();
            }
            return this.open(oOpenBy, oVizInfo, visualizationPresence);
        },

        /**
         * Adds and removes visualizations to the selected Spaces/Pages and generates a MessageToast.
         *
         * @param {sap.ui.base.Event} oEvent The before close event of the popup.
         * @returns {Promise<undefined>} A promise that resolves when the visualization organization is done.
         *
         * @see _applyOrganizationChange
         * @since 1.75.0
         * @private
         */
        _organizeVisualizations: function (oEvent) {
            var oPopover = oEvent.getSource(),
                oSpacesList = oPopover.getContent()[2],
                oPopoverModel = oPopover.getModel(),
                // stInitialPages = oPopoverModel.getProperty("/pinnedPages") || new Set(), // not used for now
                stInitialSpaces = oPopoverModel.getProperty("/pinnedSpaces") || new Set(),
                aAddToItems = [],
                aDeleteFromItems = [];

            // reset the filter, as some selected items might be hidden
            oSpacesList.getBinding("items").filter(null);

            oSpacesList.getItems().forEach(function (oItem) {
                var sItemId = oItem.getBindingContext().getProperty("id");
                if (oItem.getSelected() && !stInitialSpaces.has(sItemId)) {
                    aAddToItems.push(oItem);
                } else if (!oItem.getSelected() && stInitialSpaces.has(sItemId)) {
                    aDeleteFromItems.push(oItem);
                }
            });

            return this._applyOrganizationChange({ addToItems: aAddToItems, deleteFromItems: aDeleteFromItems });
        },

        /**
         * @typedef {object} VisualizationChanges Collected changes done for a visualization in a "sapUshellVisualizationOrganizerPopover".
         * @property {object[]} addToItems The popover items representing where the visualization should be added to.
         * @property {object[]} deleteFromItems The popover items representing where the visualization should be deleted from.
         */

        /**
         * Applies the given visualization organization changes.
         * This is used by {@link _organizeVisualizations}.
         * When done, shows a {@link sap.m.MessageToast} informing the total number of organized visualizations.
         *
         * @param {VisualizationChanges} oVizualizationChanges The items representing where a visualization should be added and deleted.
         * @return {Promise<undefined>} A promise that resolves after every organization change.
         *
         * @see _organizeVisualizations
         */
        _applyOrganizationChange: function (oVizualizationChanges) {
            var iChangedVisualizations = (oVizualizationChanges.addToItems.length + oVizualizationChanges.deleteFromItems.length);
            if (!iChangedVisualizations) { return Promise.resolve(); }
            var sVizId = this.sVisualizationId;
            var stAlreadyRemovedFromPageId = new Set();
            var oPagesService;
            var oVizChangeChain = sap.ushell.Container.getServiceAsync("Pages").then(function (PagesService) {
                oPagesService = PagesService;
            });

            function buildVizDeleteChain (aVisualizationLocations) {
                var oVizDeleteChain;
                // indexes must be in descending order for correct iterative removal (last one first)
                var aSortedVisualizationLocations = aVisualizationLocations.sort(function (a, b) { return b.sectionIndex - a.sectionIndex; });
                aSortedVisualizationLocations.forEach(function (visualizationLocation) {
                    // indexes must be in descending order for correct iterative removal (last one first)
                    var aSortedVizIndexes = visualizationLocation.vizIndexes.sort(function (a, b) { return b - a; });
                    aSortedVizIndexes.forEach(function (vizIndex) {
                        if (!oVizDeleteChain) {
                            oVizDeleteChain = oPagesService.deleteVisualization(oPagesService.getPageIndex(visualizationLocation.pageId), visualizationLocation.sectionIndex, vizIndex);
                        } else {
                            oVizDeleteChain = oVizDeleteChain.then(function () {
                                return oPagesService.deleteVisualization(oPagesService.getPageIndex(visualizationLocation.pageId), visualizationLocation.sectionIndex, vizIndex);
                            });
                        }
                    });
                });
                return oVizDeleteChain || Promise.resolve();
            }

            oVizualizationChanges.deleteFromItems.forEach(function (oRemoveFromItem) {
                var oSpace = oRemoveFromItem.getBindingContext().getProperty();
                var sPageId = oSpace.pages[0].id; // for now, we just get the first Page (single Page scenario)
                if (!stAlreadyRemovedFromPageId.has(sPageId)) {
                    stAlreadyRemovedFromPageId.add(sPageId);
                    oVizChangeChain = oVizChangeChain.then(function () {
                        return oPagesService.findVisualization(sVizId, sPageId).then(buildVizDeleteChain);
                    });
                }
                this.mVizIdInPages.get(sVizId).delete(sPageId);
                this.mPageInSpaces.get(sPageId).forEach(function (spaceId) {
                    var aSpacePagesWithVizId = Array.from(this.mSpacePages.get(spaceId)).filter(function (pageId) {
                        return this.mVizIdInPages.get(sVizId).has(pageId);
                    }.bind(this));
                    if (!aSpacePagesWithVizId.length) {
                        this.mVizIdInSpaces.get(sVizId).delete(spaceId);
                    }
                }.bind(this));
            }.bind(this));

            oVizualizationChanges.addToItems.forEach(function (oAddToItem) {
                var oSpace = oAddToItem.getBindingContext().getProperty();
                var sPageId = oSpace.pages[0].id; // for now, we just get the first Page (single Page scenario)
                oVizChangeChain = oVizChangeChain.then(function () {
                    return oPagesService.addVisualization(sVizId, sPageId);
                });
                if (this.mVizIdInPages.has(sVizId)) {
                    this.mVizIdInPages.get(sVizId).add(sPageId);
                } else {
                    this.mVizIdInPages.set(sVizId, new Set([sPageId]));
                }
                this.mPageInSpaces.get(sPageId).forEach(function (spaceId) {
                    if (this.mVizIdInSpaces.has(sVizId)) {
                        this.mVizIdInSpaces.get(sVizId).add(spaceId);
                    } else {
                        this.mVizIdInSpaces.set(sVizId, new Set([spaceId]));
                    }
                }.bind(this));
            }.bind(this));

            oVizChangeChain.then(function () {
                if (this.oOpenBy) {
                    this.oOpenBy.getBinding("icon").refresh(true);
                    this.oOpenBy.getBinding("type").refresh(true);
                }
                sap.ui.require(["sap/m/MessageToast"], function (MessageToast) {
                    MessageToast.show(resources.i18n.getText("VisualizationOrganizer.MessageToast", [iChangedVisualizations]));
                });
            }.bind(this));

            return oVizChangeChain;
        },

        /**
         * Resets the changes to the content of the popover.
         *
         * @param {sap.ui.base.Event} oEvent The after close event of the popup.
         *
         * @since 1.75.0
         * @private
         */
        _resetPopup: function (oEvent) {
            var oPopover = oEvent.getSource(),
                oSearchField = oPopover.getContent()[1],
                oSpacesList = oPopover.getContent()[2];

            oPopover.detachBeforeClose(this.fnAddVisualizations);
            oPopover.detachAfterClose(this.fnResetPopup);

            oSearchField.setValue("");

            oSpacesList.removeSelections();

            delete this.fnAddVisualizations;
            delete this.fnResetPopup;
            delete this.sVisualizationId;
            delete this.sVisualizationTitle;
        },

        /**
         * Handles the Space press event.
         * On press the Space should toggle its selection.
         *
         * @param {sap.ui.base.Event} oEvent The press event.
         *
         * @since 1.75.0
         * @private
         */
        _spacePressed: function (oEvent) {
            var oSLI = oEvent.getSource(),
                oSpacesList = oSLI.getParent(),
                iSelectedIndex = oSpacesList.getSelectedItems().find(function (oSpace) {
                    return oSpace.getId() === oSLI.getId();
                });
            oSpacesList.setSelectedItemById(oSLI.getId(), !iSelectedIndex);
        },

        /**
         * Filters the list of Spaces.
         *
         * @param {sap.ui.base.Event} oEvent The search event.
         *
         * @since 1.75.0
         * @private
         */
        _onSearch: function (oEvent) {
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover"),
                oSpacesList = oPopover.getContent()[2],
                oBinding = oSpacesList.getBinding("items"),
                sSearchValue = oEvent.getSource().getValue();

            oBinding.filter(new Filter({
                path: "title",
                operator: FilterOperator.Contains,
                value1: sSearchValue
            }));

            if (oBinding.getLength() === 0) { // Adjust empty list of Spaces message in case all Spaces are filtered out.
                oSpacesList.setNoDataText(resources.i18n.getText(sSearchValue
                    ? "VisualizationOrganizer.SpacesList.NoResultsText"
                    : "VisualizationOrganizer.SpacesList.NoDataText"
                ));
            }
        },

        exit: function () {
            var oPopover = sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");
            if (oPopover) {
                oPopover.destroy();
            }
        }
    });
});
