// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

/**
 * @fileoverview Provides functionality for "sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml"
 */
sap.ui.define([
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/m/ResponsivePopover",
    "sap/m/StandardListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Sorter",
    "sap/ushell/services/Container" // required for "sap.ushell.Container.getServiceAsync()"
], function (
    Button,
    mobileLibrary,
    List,
    ResponsivePopover,
    StandardListItem,
    Filter,
    FilterOperator,
    JSONModel,
    Sorter
    // Container
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    // shortcut for sap.m.ListSeparators
    var ListSeparators = mobileLibrary.ListSeparators;

    /**
     * TileSelector constructor
     *
     * @constructor
     *
     * @protected
     */
    return function () {
        var oParentView,
            oFragment,
            oToolbar,
            oList,
            oAddSelectedTilesButton,
            oModel,
            oRolesModel,
            resources = {},
            oAddSingleTileItem,
            oSectionList,
            oSectionSelectionPopover,
            fnAddTileHandler;

        /**
         * Initializes the TileSelector, must be called before calling any other TileSelector's method.
         * The controller's view "default" (unnamed) and "roles" model must already be set.
         *
         * @param {sap.ui.core.mvc.Controller} oController A reference to the controller it is going to be used on.
         *
         * @private
         */
        this.init = function (oController) {
            oParentView = oController.getView();
            oFragment = oParentView.byId("tileSelector");
            oToolbar = oParentView.byId("tileSelectorToolbar");
            oList = oParentView.byId("tileSelectorList");
            oAddSelectedTilesButton = oParentView.byId("tileSelectorAddButton");
            resources.i18n = oController.getResourceBundle();

            oList.setBusy(true);

            oModel = new JSONModel({ searchText: "", descending: false, tileSelectorHierarchySet: undefined });
            oModel.setSizeLimit(Infinity); // allow more list bindings than the model default limit of 100 entries
            oFragment.setModel(oModel);
            oRolesModel = oParentView.getModel("roles");

            oSectionList = new List({
                mode: ListMode.MultiSelect,
                showSeparators: ListSeparators.None,
                includeItemInSelection: true,
                selectionChange: function () { oSectionSelectionPopover.getBeginButton().setEnabled(!!oSectionList.getSelectedItem()); },
                items: {
                    path: "/page/sections",
                    template: new StandardListItem({ title: "{title}" })
                },
                noDataText: resources.i18n.getText("Message.NoSections")
            }).setModel(oParentView.getModel());

            oAddSelectedTilesButton.setEnabled(false);
            oList.attachSelectionChange(this._onSelectionChange);
        };

        /**
         * Sets the TileSelectorList model with the provided TileSelector hierarchy items.
         * This method can be called an arbitrary number of times.
         *
         * @param {object[]} [aTileSelectorHierarchy] The TileSelector hierarchy to be set on the List model.
         *   If not provided, the "PageRepository" model will be used (should be defined in the application manifest),
         *   assuming that it is connected to a data source providing the "tileSelectorHierarchySet" service.
         *
         * @private
         */
        this.initTiles = function (aTileSelectorHierarchy) {
            var oBindingInfo = {};
            oAddSelectedTilesButton.setEnabled(false);
            if (typeof aTileSelectorHierarchy !== "undefined") {
                oModel.setProperty("/tileSelectorHierarchySet", aTileSelectorHierarchy);
                oList.setModel(undefined);
            } else {
                oModel.setProperty("/tileSelectorHierarchySet", undefined);
                oList.setModel(oParentView.getModel("PageRepository"));
                oBindingInfo.parameters = { expand: "vizDetails" };
            }
            oBindingInfo.path = "/tileSelectorHierarchySet";
            oBindingInfo.sorter = _getSortersArray(oModel.getProperty("/descending")); // to keep user's current sort order
            // oBindingInfo.filters = _getFiltersArray(); // filters defined here are permanent and cannot be removed or changed!
            oBindingInfo.factory = function (sID, oBindingContext) {
                switch (oBindingContext.getProperty("type")) {
                    default:
                    case "catalog":
                        return oParentView.byId("tileSelectorGroupHeader").clone();
                    case "visualization":
                        return oParentView.byId("tileSelectorCustomListItem").clone()
                            .bindObject(oBindingContext.getPath() + "/vizDetails");
                }
            };
            oList.bindItems(oBindingInfo);
            oList.getBinding("items").filter(_getFiltersArray()); // only after binding it is possible to add non-permanent filters!
            oList.setBusy(false);
        };

        /**
         * Method to be called externally to notify the TileSelector that the role context selection has changed and must be refreshed.
         */
        this.refreshRoleContext = function () {
            oList.getBinding("items").filter(_getFiltersArray());
        };

        /**
         * Intended to be called by the view (e.g. a SearchField) for handling tile search events.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         *
         * @private
         */
        this.onSearchTiles = function (/*oEvent*/) {
            oList.getBinding("items").filter(_getFiltersArray());
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling add tile events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onAddTiles = function (oEvent) {
            var aSectionListItems = oSectionList.getItems(),
                oBindingContext = oEvent.getSource().getBindingContext();
            if (oBindingContext) {
                var sBindingContextPath = oBindingContext.getPath();
                oAddSingleTileItem = oList.getItems().filter(function (item) {
                    return (item.getBindingContextPath() === sBindingContextPath);
                })[0];
            } else {
                oAddSingleTileItem = undefined;
            }
            if (aSectionListItems.length === 1) { // skip asking to which section(s) if there is only one section
                aSectionListItems[0].setSelected(true);
                _addTiles();
            } else {
                _openSectionSelectionPopover(oEvent);
            }
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling sort catalogs toggle events.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         *
         * @private
         */
        this.onSortCatalogsToggle = function (/*oEvent*/) {
            _sortCatalogsToggle();
        };

        /**
         * Intended to be called by the view (e.g. a List) for handling selection change events.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         *
         * @private
         */
        this._onSelectionChange = function (/*oEvent*/) {
            oAddSelectedTilesButton.setEnabled(!!_getSelectedListItemsData().length);
        };

        /**
         * Sets a callback function for the add tiles event.
         *
         * @param {function} newAddTileHandler The callback function to be called when adding tiles.
         *   This function is called with the following arguments, in the following order:
         *     1. A tile object.
         *     2. An array of section indices.
         *
         * @private
         */
        this.setAddTileHandler = function (newAddTileHandler) {
            fnAddTileHandler = newAddTileHandler;
        };

        /**
         * Called when starting to drag a tile.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onDragStart = function (oEvent) {
            var oItemData = oEvent.getParameter("target").getBindingContext().getProperty();
            if (!oItemData.vizId) { // prevent dragging of items without vizId
                oEvent.preventDefault();
                return;
            }
            oEvent.getParameter("dragSession").setComplexData("callback", function callback (tileIndex, sectionIndex) {
                fnAddTileHandler(oItemData, [sectionIndex], tileIndex);
            });
        };

        /**
         * Helper function to get the Filters array for {@link sap.ui.model.ListBinding.prototype.filter}.
         * Takes into account the current context selected and the text currently in the SearchField.
         *
         * @returns {sap.ui.model.Filter[]} The resulting array of Filters.
         *
         * @private
         */
        function _getFiltersArray () {
            var aFilters = [];
            // var sSearchText = oModel.getProperty("/searchText"); // TODO: uncomment when service supports substring filtering
            if (!oModel.getProperty("/tileSelectorHierarchySet")) {
                var aSelectedRoles = oRolesModel.getProperty("/selected") || [];
                aSelectedRoles.forEach(function (sRole) {
                    aFilters.push(new Filter("roleIdFilter", FilterOperator.EQ, sRole));
                });
            }
            // TODO: uncomment when service supports substring filtering
            // aFilters.push(new Filter([
            //     new Filter("title", FilterOperator.Contains, sSearchText)//,
            //     new Filter("vizDetails/title", FilterOperator.Contains, sSearchText),
            //     new Filter("vizDetails/subTitle", FilterOperator.Contains, sSearchText)
            // ], false)); // filter combining: "AND" (true) or "OR" (false));
            return aFilters;
        }

        /**
         * Helper function to get the Sorters array for {@link sap.ui.model.ListBinding.prototype.sort}.
         *
         * @param {boolean} bSortDescending Whether to sort "descending" (true) or "ascending" (false).
         * @returns {sap.ui.model.Sorter[]} The resulting array of Sorters.
         *
         * @private
         */
        function _getSortersArray (bSortDescending) {
            return [
                new Sorter("title", bSortDescending),
                new Sorter("vizDetails/title", false) // visualizations are always sorted in ascending lexicographical order
            ];
        }

        /**
         * Toggles the lexicographical sort order of the List items between "ascending" and "descending".
         * Sorting is done based on the "title" property of the items.
         *
         * @param {boolean} [bForceDescending] Whether to force "descending" (true) or "ascending" (false).
         *
         * @private
         */
        function _sortCatalogsToggle (bForceDescending) {
            var bSortDescending = ((typeof bForceDescending !== "undefined") ? bForceDescending : !oModel.getProperty("/descending"));
            oList.getBinding("items").sort(_getSortersArray(bSortDescending));
            oModel.setProperty("/descending", bSortDescending);
        }

        /**
         * Get the item data of every selected List item.
         * This is needed because "getSelectedItems()" do not always return all selected items (e.g. within collapsed parents).
         *
         * @returns {object[]} An array of selected List item data.
         *
         * @private
         */
        function _getSelectedListItemsData () {
            if (oAddSingleTileItem) {
                // should add a single tile (from its own "Add" button)
                return [oAddSingleTileItem.getBindingContext().getProperty()];
            }
            var oListModel = oList.getModel();
            // should add all selected tiles (from header "Add" button)
            return oList.getSelectedContextPaths().map(function (sSelectedItemContextPath) {
                return oListModel.getContext(sSelectedItemContextPath).getProperty();
            });
        }

        /**
         * Opens the add tiles popover, containing the section list for selection of the tiles target sections.
         *
         * @param {sap.ui.base.Event} oEvent The event that raised the operation (e.g. a click on the "Add" button).
         *
         * @private
         */
        function _openSectionSelectionPopover (oEvent) {
            if (!oSectionSelectionPopover || oSectionSelectionPopover.bIsDestroyed) {
                _createSectionSelectionPopover();
            }
            oSectionList.removeSelections(true);
            oSectionSelectionPopover.getBeginButton().setEnabled(false);
            oSectionSelectionPopover.getEndButton().setEnabled(true);
            if (!oAddSingleTileItem && _isOverflownInOverflowToolbar(oAddSelectedTilesButton)) {
                oSectionSelectionPopover.openBy(oToolbar.getAggregation("_overflowButton"));
            } else {
                oSectionSelectionPopover.openBy(oEvent.getSource());
            }
        }

        /**
         * Checks if a control is currently overflown inside of an OverflowToolbar.
         *
         * @param {sap.ui.core.Control} oControl The control to check.
         * @returns {boolean} Whether the control is or is not overflown inside of an OverflowToolbar.
         *
         * @private
         */
        function _isOverflownInOverflowToolbar (oControl) {
            return (oControl.hasStyleClass("sapMOTAPButtonNoIcon") || oControl.hasStyleClass("sapMOTAPButtonWithIcon"));
        }

        /**
         * Creates the section selection popover, used to select to which section(s) the tile(s) should go to.
         *
         * @private
         */
        function _createSectionSelectionPopover () {
            oSectionSelectionPopover = new ResponsivePopover({
                placement: PlacementType.Auto,
                title: resources.i18n.getText("Tooltip.AddToSections"),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: resources.i18n.getText("Button.Add"),
                    press: function () { this.setEnabled(false); oSectionSelectionPopover.close(); _addTiles(); }
                }),
                endButton: new Button({
                    text: resources.i18n.getText("Button.Cancel"),
                    press: function () { this.setEnabled(false); oSectionSelectionPopover.close(); }
                }),
                content: oSectionList,
                initialFocus: oSectionList
            }).addStyleClass("sapContrastPlus");
            oFragment.addDependent(oSectionSelectionPopover);
        }

        /**
         * Calls the handler for adding tiles. Does nothing if no function is set for the add tiles handler.
         *
         * @see setAddTileHandler
         *
         * @private
         */
        var _addTiles = function () {
            if (typeof fnAddTileHandler !== "function") {
                return;
            }
            var aSelectedSectionsIndexes = oSectionList.getSelectedItems().map(function (oSelectedSection) {
                return oSectionList.indexOfItem(oSelectedSection);
            });
            var aSelectedTilesData = _getSelectedListItemsData();
            aSelectedTilesData.forEach(function (oSelectedTileData) {
                fnAddTileHandler(oSelectedTileData, aSelectedSectionsIndexes);
            });

            if (!oAddSingleTileItem) { // unselect all tiles when adding through the header "Add" button
                oList.removeSelections(true);
                this._onSelectionChange();
            } else if (oAddSingleTileItem.getSelected()) {
                oAddSingleTileItem.setSelected(false);
                this._onSelectionChange();
            }
        }.bind(this);
    };
});
