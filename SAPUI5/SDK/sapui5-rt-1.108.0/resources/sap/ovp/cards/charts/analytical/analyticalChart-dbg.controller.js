sap.ui.define([
    "sap/ovp/cards/generic/Card.controller",
    "sap/ovp/cards/charts/VizAnnotationManager",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/app/resources",
    "sap/base/util/each",
    "sap/ovp/cards/ovpLogger",
    "sap/ovp/app/FilterHelper",
    "sap/ui/core/Fragment",
    "sap/ovp/filter/FilterUtils",
    "sap/ui/core/Core",
    "sap/ovp/cards/Integration/IntegrationCard",
    "sap/ui/Device",
    "sap/ovp/cards/charts/Utils",
    "sap/ui/dom/units/Rem"
], function (
    CardController,
    VizAnnotationManager,
    FlattenedDataset,
    OVPCardAsAPIUtils,
    OvpResources,
    each,
    ovpLogger,
    FilterHelper,
    Fragment,
    FilterUtils,
    Core,
    IntegrationCard,
    Device,
    Utils,
    Rem
) {
    "use strict";

    var oLogger = new ovpLogger("OVP.analytical.analyticalChart");

    return CardController.extend("sap.ovp.cards.charts.analytical.analyticalChart", {
        onInit: function () {
            //The base controller lifecycle methods are not called by default, so they have to be called
            //Take reference from function mixinControllerDefinition in sap/ui/core/mvc/Controller.js
            CardController.prototype.onInit.apply(this, arguments);
            VizAnnotationManager.formatChartAxes();
            //				this.bFlag = true;
            var that = this;
            this.eventhandler = function (sChannelId, sEventName, aFilters) {
                FilterUtils.applyFiltersToV2Card(aFilters, that);
            };
            this.GloabalEventBus = Core.getEventBus();
            if (this.oMainComponent && this.oMainComponent.isMacroFilterBar) {
                this.GloabalEventBus.subscribe(
                    "OVPGlobalfilter",
                    "OVPGlobalFilterSeacrhfired",
                    that.eventhandler
                );
            }
            this.iPreviousRowSpan = 0;
        },
        onBeforeRendering: function () {
            if (this.bCardProcessed) {
                return;
            }
            VizAnnotationManager.validateCardConfiguration(this);
            var vizFrame = this.getView().byId("analyticalChart");
            var oCompData = this.getOwnerComponent().getComponentData();
            if (vizFrame) {
                vizFrame.setHeight("21rem");
            }
            if (
                this.getCardPropertiesModel().getProperty("/layoutDetail") === "resizable" &&
                oCompData &&
                oCompData.appComponent
            ) {
                var oDashboardLayoutUtil = oCompData.appComponent.getDashboardLayoutUtil();
                var oCard = oDashboardLayoutUtil.dashboardLayoutModel.getCardById(
                    oCompData.cardId
                );
                if (oCard.dashboardLayout.autoSpan && vizFrame) {
                    vizFrame.setHeight("21rem");
                }
            }

            var vbLayout = this.getView().byId("vbLayout");
            var navigation;
            var isVizPropSet = false;
            var oDataSet = new FlattenedDataset({
                data: {
                    path: "/"
                }
            });

            this.isVizPropSet = isVizPropSet;
            this.oDataSet = oDataSet;
            this.vizFrame = vizFrame;
            this.vbLayout = vbLayout;

            if (!vizFrame) {
                oLogger.error(
                    VizAnnotationManager.constants.ERROR_NO_CHART +
                    ": (" +
                    this.getView().getId() +
                    ")"
                );
            } else {
                this.vbLayout.setBusy(true);
                navigation = vizFrame.getModel("ovpCardProperties").getProperty("/navigation");
                //FIORITECHP1-6021 - Allow Disabling of Navigation from Graph
                if (
                    navigation === undefined ||
                    navigation == "datapointNav" ||
                    navigation != "headerNav"
                ) {
                    VizAnnotationManager.getSelectedDataPoint(vizFrame, this);
                }
                vizFrame.destroyDataset();
                var binding = vizFrame.getParent().getBinding("data");

                this._handleKPIHeader();

                if (binding && binding.getPath()) {
                    binding.attachDataReceived(this.onDataReceived.bind(this));
                    binding.attachDataRequested(this.onDataRequested.bind(this));
                } else {
                    Fragment.load("sap.ovp.cards.charts.generic.noData").then(
                        function (oControl) {
                            var cardContainer = this.getCardContentContainer();
                            cardContainer.removeAllItems();
                            cardContainer.addItem(oControl);
                        }.bind(this)
                    );
                }

                vizFrame.addEventDelegate({
                    onmouseover: function () {
                        var vizTooltip = vizFrame._oOvpVizFrameTooltip;
                        if (vizTooltip) {
                            vizTooltip._oPopup.close();
                        }
                    }
                });
            }
            this.bCardProcessed = true;
        },

        onAfterRendering: function () {
            CardController.prototype.onAfterRendering.apply(this, arguments);
            if (
                !OVPCardAsAPIUtils.checkIfAPIIsUsed(this) &&
                this.getCardPropertiesModel().getProperty("/layoutDetail") === "resizable"
            ) {
                var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);
                var sCardId = this.oDashboardLayoutUtil.getCardDomId(this.cardId);
                var element = document.getElementById(sCardId);
                var iHeaderHeight = this.getHeaderHeight();
                if (!oCard.dashboardLayout.autoSpan) {
                    if (element) {
                        var ovpWrapper = element.getElementsByClassName("sapOvpWrapper")[0];
                        if (ovpWrapper) {
                            ovpWrapper.style.height =
                                oCard.dashboardLayout.rowSpan *
                                this.oDashboardLayoutUtil.ROW_HEIGHT_PX +
                                2 -
                                (iHeaderHeight + 2 * this.oDashboardLayoutUtil.CARD_BORDER_PX) +
                                "px";
                        }
                    }
                }
                if (oCard.dashboardLayout.showOnlyHeader) {
                    element.classList.add("sapOvpMinHeightContainer");
                }
                var vizCard = this.getView().byId("analyticalChart");
                if (vizCard) {
                    vizCard.setHeight(this._calculateVizFrameHeight() + "px");
                    this._calculateWidth();
                }
            }
        },

        onDataReceived: function (oEvent) {
            var that = this;
            var vizFrame = this.getView().byId("analyticalChart");
            var bubbleText = this.getView().byId("bubbleText");
            var chartTitle = this.getView().byId("ovpCT");
            var bubbleSizeText = OvpResources.getText("BUBBLESIZE");

            this.oDataSet.bindData("analyticalmodel>/", "");
            vizFrame.setDataset(this.oDataSet);
            var handler = vizFrame.getParent();

            if (!this.isVizPropSet) {
                VizAnnotationManager.buildVizAttributes(vizFrame, handler, chartTitle, this);
                this.isVizPropSet = true;
                if (bubbleText != undefined) {
                    var feeds = vizFrame.getFeeds();
                    each(feeds, function (i, v) {
                        if (feeds[i].getUid() == "bubbleWidth") {
                            bubbleText.setText(bubbleSizeText + " " + feeds[i].getValues());
                        }
                    });
                }
                VizAnnotationManager.hideDateTimeAxis(vizFrame);
            }
            if (
                this.getCardPropertiesModel() &&
                this.getCardPropertiesModel().getData() &&
                this.getCardPropertiesModel().getData().colorPalette &&
                vizFrame.getVizType() === "stacked_column"
            ) {
                var allDims = vizFrame.getDataset().getDimensions(),
                    vfFeed = vizFrame.getFeeds(),
                    vfFeedColorName,
                    dim;
                for (var m = 0; m < vfFeed.length; m++) {
                    if (vfFeed[m].getUid() === "color") {
                        vfFeedColorName = vfFeed[m].getValues()[0];
                        break;
                    }
                }
                for (var n = 0; n < allDims.length; n++) {
                    if (allDims[n].getName() === vfFeedColorName) {
                        dim = allDims[n];
                        break;
                    }
                }
                if (vfFeedColorName && dim) {
                    var sorter = {};
                    sorter["bDescending"] = true;
                    dim.setSorter(sorter);
                }
            }
            var chartScaleTitle = this.getView().byId("ovpUoMTitle");
            var vizData = oEvent ? oEvent.getParameter("data") : null;
            //FIORITECHP1-4935Reversal of Scale factor in Chart and Chart title.
            VizAnnotationManager.setChartUoMTitle(vizFrame, vizData, chartScaleTitle);
            if (this.bFlag == true) {
                this.bFlag = false;
                this.vbLayout.setBusy(false);
            } else {
                setTimeout(function () {
                    that.vbLayout.setBusy(false);
                    if (that.getView() && that.getView().byId("sapOvpCardInsights")) {
                        that.getView().byId("sapOvpCardInsights").setEnabled(true);
                    }
                }, 0);
            }
            VizAnnotationManager.checkNoData(oEvent, this.getCardContentContainer(), vizFrame);

            if (Device.system.phone) {
                if (this.getCardPropertiesModel().getProperty("/layoutDetail") === "resizable") {
                   var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);
                   var iRowSpan = Math.max(oCard.dashboardLayout.rowSpan,  this.iPreviousRowSpan);
                   this.iPreviousRowSpan = iRowSpan;
                }
                if (Utils.isDataSetEmpty(oEvent)) {
                    vizFrame.setHeight(50 + "px");
                } else {
                    var iVizFrameHeight = this._calculateVizFrameHeight();
                    if (iVizFrameHeight !== undefined && typeof iVizFrameHeight === "number") {
                        vizFrame.setHeight(iVizFrameHeight + "px");
                    }
                }
            }
        },

        onDataRequested: function () {
            this.vbLayout.setBusy(true);
        },

        getCardItemsBinding: function () {
            var vizFrame = this.getView().byId("analyticalChart");
            if (vizFrame && vizFrame.getParent()) {
                return vizFrame.getParent().getBinding("data");
            }

            return null;
        },

        /**
         * Method called upon when card is resized manually
         *
         * @method resizeCard
         * @param {Object} newCardLayout - new card layout after resize
         */
        resizeCard: function (newCardLayout) {
            var oCardPropertiesModel = this.getCardPropertiesModel();
            this.newCardLayout = newCardLayout;
            oCardPropertiesModel.setProperty("/cardLayout/rowSpan", newCardLayout.rowSpan);
            oCardPropertiesModel.setProperty("/cardLayout/colSpan", newCardLayout.colSpan);
            var oCardLayout = this.getCardPropertiesModel().getProperty("/cardLayout");
            var iHeaderHeight = this.getHeaderHeight();
            //Set the height of cardContentContainer
            var setCardContentContainerHeight = this.getView()
                .getDomRef()
                .querySelectorAll(".sapOvpWrapper");
            for (var i = 0; i < setCardContentContainerHeight.length; i++) {
                setCardContentContainerHeight[i].style.height =
                    newCardLayout.rowSpan * oCardLayout.iRowHeightPx +
                    2 -
                    (iHeaderHeight + 2 * oCardLayout.iCardBorderPx) +
                    "px";
            }
            var vizCard = this.getView().byId("analyticalChart");
            var bubbleText = this.getView().byId("bubbleText");
            var chartTitle = this.getView().byId("ovpCT");

            if (vizCard) {
                if (
                    vizCard.getVizType() === "timeseries_bubble" ||
                    vizCard.getVizType() === "bubble"
                ) {
                    if (oCardLayout.colSpan > 1) {
                        bubbleText.setVisible(false);
                    } else {
                        bubbleText.setVisible(true);
                    }
                }
                vizCard.setHeight(this._calculateVizFrameHeight() + "px");
                this._calculateWidth();
            }
            var oOvpContent = this.getView().byId("ovpCardContentContainer").getDomRef();
            if (oOvpContent) {
                if (!newCardLayout.showOnlyHeader) {
                    oOvpContent.classList.remove("sapOvpContentHidden");
                } else {
                    oOvpContent.classList.add("sapOvpContentHidden");
                }
            }

            var bubbleSizeText = OvpResources.getText("BUBBLESIZE");
            this.oDataSet.bindData("analyticalmodel>/", "");
            this.vizFrame.setDataset(this.oDataSet);

            var handler = vizCard.getParent();
            if (!this.isVizPropSet) {
                VizAnnotationManager.buildVizAttributes(vizCard, handler, chartTitle, this);
                this.isVizPropSet = true;
                if (bubbleText != undefined) {
                    var feeds = vizCard.getFeeds();
                    each(feeds, function (i, v) {
                        if (feeds[i].getUid() == "bubbleWidth") {
                            bubbleText.setText(bubbleSizeText + " " + feeds[i].getValues());
                        }
                    });
                }
                VizAnnotationManager.hideDateTimeAxis(vizCard);
            }
            VizAnnotationManager.reprioritizeContent(this.newCardLayout, vizCard);
        },

        /**
         * Method to calculate viz frame height
         *
         * @method _calculateVizFrameHeight
         * @return {Integer} iVizFrameHeight - Calculated height of the viz frame
         * For Fixed layout - 480 px
         * For resizable layout - Calculated according to the rowspan
         */
        _calculateVizFrameHeight: function () {
            var iVizFrameHeight;
            //For resizable layout calculate height of vizframe
            if (this.getCardPropertiesModel().getProperty("/layoutDetail") === "resizable") {
                var vizCard = this.getView().byId("analyticalChart");
                var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);
               
                var oGenCardCtrl = this.getView().getController();
                var iDropDownHeight = this.getItemHeight(oGenCardCtrl, "toolbar");
                var iHeaderHeight = this.getHeaderHeight();
                var iChartTextHeight = this.getView().byId("ovpCT") ? 24 : 0;
                var iBubbleTextHeight =
                    (vizCard.getVizType() === "timeseries_bubble" ||
                        vizCard.getVizType() === "bubble") &&
                        oCard.dashboardLayout.colSpan === 1
                        ? 43
                        : 0;
                // Viz container height = Card Container height + Border top of OvpCardContainer[1px--.sapOvpCardContentContainer] - (Header height + Card padding top and bottom{16px} +
                // View switch toolbar height + Height of the Chart text(if present) + Height of bubble chart text +
                // Padding top to  the card container[0.875rem -- .ovpChartTitleVBox] + Margin top to viz frame[1rem .ovpViz])
                var rowSpan = (Device.system.phone && this.iPreviousRowSpan > 0) ? this.iPreviousRowSpan : oCard.dashboardLayout.rowSpan;
                iVizFrameHeight = rowSpan * this.oDashboardLayoutUtil.ROW_HEIGHT_PX + 2 -
                    (iHeaderHeight +
                        2 * this.oDashboardLayoutUtil.CARD_BORDER_PX +
                        iDropDownHeight +
                        iChartTextHeight +
                        iBubbleTextHeight +
                        30);
                var chartType = vizCard.getVizType();
                var cardId = vizCard.sId;
                if (chartType === "donut") {
                    var updatedVizHeight = this._calculateVizLegendGroupHeight(iVizFrameHeight);
                    var oVizCard = this.getView().byId(cardId);
                    if (oVizCard) {
                        oVizCard.setVizProperties(updatedVizHeight);
                    }
                }
            } else {
                iVizFrameHeight = Rem.toPx(21);
            }
            return iVizFrameHeight;
        },

        /**
         * Method to update the height of the viz frame in Donut.
         * @method _calculateVizLegendGroupHeight
         * @param {String} cardId - Id of the vizCard
         * @return {Object} updatedVizHeight
         *
         */

        _calculateVizLegendGroupHeight: function (iVizFrameHeight) {
            var layoutHeight;
            if (iVizFrameHeight <= 300) {
                layoutHeight = 0.1;
            } else if (iVizFrameHeight >= 400) {
                layoutHeight = 0.4;
            } else {
                layoutHeight = 0.3;
            }
            var updatedVizHeight = {
                legendGroup: {
                    layout: {
                        height: layoutHeight
                    }
                }
            };
            return updatedVizHeight;
        },

        /**
         * Method to calculate width for viz
         *
         * @method _calculateWidth
         */
        _calculateWidth: function () {
            var oCard = this.oDashboardLayoutUtil.dashboardLayoutModel.getCardById(this.cardId);
            var vizCard = this.getView().byId("analyticalChart");
            if (oCard) {
                var cardWidth = parseInt(oCard.dashboardLayout.width, 10);
                var chartType = vizCard.getVizType();
                var cardId = vizCard.sId;
                if (chartType === "donut") {
                    var updatedVizWidth = this._calculateVizLegendGroupWidth(cardWidth);
                    var oVizCard = this.getView().byId(cardId);
                    if (oVizCard) {
                        oVizCard.setVizProperties(updatedVizWidth);
                    }
                }
            }
        },

        /**
         * Method to update the width of the viz frame in Donut.
         * @method _calculateVizLegendGroupHeight
         * @param {Integer} cardWidth - width of the card
         * @return {Object} updatedVizWidth
         *
         */
        _calculateVizLegendGroupWidth: function (cardWidth) {
            var layoutWidth;
            if (cardWidth <= 600) {
                layoutWidth = 0.25;
            } else if (cardWidth <= 900) {
                layoutWidth = 0.55;
            } else if (cardWidth >= 1200) {
                layoutWidth = 0.7;
            } else {
                layoutWidth = 0.65;
            }
            var updatedVizWidth = {
                legendGroup: {
                    layout: {
                        maxWidth: layoutWidth
                    }
                }
            };
            return updatedVizWidth;
        },

        /**
         * Method to refresh the view after drag completion
         *
         * @method refreshCard
         */
        refreshCard: function () {
            this.getView().rerender();
        },

        /**
         * 
         * @param {sap.ui.base.Event} oEvent - Event from add to my insight button press
         */
        onShowInsightCardPreview: function(oEvent) {
            var oPopover = oEvent.getSource() && oEvent.getSource().getParent();
            if (oPopover) {
                oPopover.close();
            }
            var oCardView = this.getView();
            var oCardController = oCardView.getController();
            var oCardComponentData = oCardController.oCardComponentData;
            var that = this;

            IntegrationCard.showCard({
                vizFrame: oCardController.vizFrame,
                entitySet: oCardController.entitySet,
                entityType: oCardController.entityType,
                cardComponentName: "Analytical",
                cardComponentData: oCardComponentData,
                cardComponent: oCardController.oCardComponent,
                view: oCardView
            }).then(function(oCardManifestConfiguration) {
                that.saveGeneratedCardManifest(oCardManifestConfiguration); // Saving the manifest will be handled in card controller.
            });
        }
    });
}
);