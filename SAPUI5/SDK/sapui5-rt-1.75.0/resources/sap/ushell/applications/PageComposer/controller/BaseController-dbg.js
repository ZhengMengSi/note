// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "../util/Transport",
    "sap/base/Log",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (
    TransportHelper,
    Log,
    MessageBox,
    Fragment,
    Controller,
    UIComponent
) {
    "use strict";

    return Controller.extend("sap.ushell.applications.PageComposer.controller.BaseController", {
        /**
         * Instantiates the page persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.PageComposer.util.PagePersistence} An instance of the page persistence utility.
         * @protected
         */
        getPageRepository: function () {
            return this.getOwnerComponent().getPageRepository();
        },

        /**
         * Convenience method for accessing the router.
         *
         * @returns {sap.ui.core.routing.Router} The router for this component.
         * @protected
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         *
         * @param {string} [sName] The model name.
         * @returns {sap.ui.model.Model} The model instance.
         * @protected
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         *
         * @param {sap.ui.model.Model} oModel The model instance.
         * @param {string} [sName] The model name.
         * @returns {sap.ui.mvc.View} The view instance.
         * @protected
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the root view. Useful, for example, for dialogs.
         *
         * @returns {sap.ui.core.Control|sap.ui.core.mvc.View} The view control.
         * @protected
         */
        getRootView: function () {
            return this.getOwnerComponent().getRootControl();
        },

        /**
         * Getter for the resource bundle.
         *
         * @returns {sap.ui.model.resource.ResourceModel} The resource model of the component.
         * @protected
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Returns the transportHelper utility class
         *
         * @returns {object} The transportHelper instance
         */
        getTransportHelper: function () {
            if (!this.oTransportHelper) {
                this.oTransportHelper = new TransportHelper();
            }
            return this.oTransportHelper;
        },

        /**
         * Creates an edit dialog.
         *
         * @param {function} onConfirm The confirm function.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @returns {Promise} A promise resolving to the EditPage dialog controller.
         * @private
         */
        _createEditDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/EditDialog.controller"
                ], function (EditPageDialogController) {
                    if (!this.oEditPageDialogController) {
                        this.oEditPageDialogController = new EditPageDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oEditPageDialogController.attachCancel(onCancel);
                    this.oEditPageDialogController.attachConfirm(onConfirm);
                    this.oEditPageDialogController.load().then(function () {
                        resolve(this.oEditPageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the create page dialog and enhances it with transport fields if required.
         *
         * @param {function} onConfirm Function to call when create is confirmed.
         * @param {function} onCancel Function to call when create is cancelled.
         * @returns {Promise} A promise resolving to the CreatePage dialog controller.
         * @protected
         */
        showCreateDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller"
                ], function (CreatePageDialogController) {
                    if (!this.oCreatePageDialogController) {
                        this.oCreatePageDialogController = new CreatePageDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oCreatePageDialogController.attachConfirm(onConfirm);
                    this.oCreatePageDialogController.attachCancel(onCancel);
                    this.oCreatePageDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (oTransportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCreatePageDialogController,
                                    oTransportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCreatePageDialogController;
                    }.bind(this)).then(function (oEnhancedDialog) {
                        if (oEnhancedDialog) {
                            oEnhancedDialog.open();
                        }
                        resolve();
                    }).catch(function (oError) {
                        this.oCreatePageDialogController.destroy();
                        this.handleBackendError(oError);
                        reject();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the delete page dialog.
         *
         * @param {function} onConfirm Function to call when delete is confirmed.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @returns {Promise<object>} A promise resolving to the delete dialog controller.
         * @private
         */
        _createDeleteDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/DeleteDialog.controller"
                ], function (DeleteDialogController) {
                    if (!this.oDeletePageDialogController) {
                        this.oDeletePageDialogController = new DeleteDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oDeletePageDialogController.attachCancel(onCancel);
                    this.oDeletePageDialogController.attachConfirm(onConfirm);
                    this.oDeletePageDialogController.load().then(function () {
                        resolve(this.oDeletePageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Checks if the edit dialog should be shown and creates the dialog if required.
         *
         * @param {object} page The page to edit.
         * @param {function} onConfirm The confirm function.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowEditDialog: function (page, onConfirm, onCancel) {
            var fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return Promise.resolve();
            }
            return this.getOwnerComponent().createTransportComponent(page.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(page),
                        oTransportComponent.showLockedMessage(page)
                    ]).then(function (aResults) {
                        var bShowTransport = aResults[0],
                            oLockedInformation = aResults[1];

                        if (oLockedInformation) {
                            this.showMessageBoxError(this.getResourceBundle().getText(
                                "Dialog.LockedText",
                                [page.transportId, oLockedInformation.foreignOwner]
                            ), true);
                        } else if (bShowTransport) {
                            this._createEditDialog(onConfirm, onCancel).then(function (oDialog) {
                                oDialog.getModel().setProperty(
                                    "/message",
                                    this.getResourceBundle().getText("EditDialog.TransportRequired")
                                );
                                var oEnhancedDialog = this.getTransportHelper().enhanceDialogWithTransport(
                                    oDialog,
                                    oTransportComponent,
                                    onConfirm
                                );
                                oEnhancedDialog.open();
                            }.bind(this)).catch(fnError);
                        }
                    }.bind(this)).catch(fnError);
                }.bind(this)).catch(fnError);
        },

        /**
         * Shows the delete dialog and enhances the dialog with transport fields if required
         *
         * @param {object} page The page object.
         * @param {function} [onConfirm] The confirm function handler.
         * @param {function} [onCancel] The cancel function handler.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowDeleteDialog: function (page, onConfirm, onCancel) {
            var oResourceBundle = this.getResourceBundle(),
                fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return this._createDeleteDialog(onConfirm, onCancel).then(function (oDialog) {
                    oDialog.getModel().setProperty("/message", oResourceBundle.getText("DeleteDialog.Text"));
                    oDialog.open();
                });
            }
            return this.getOwnerComponent().createTransportComponent(page.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(page),
                        oTransportComponent.showLockedMessage(page)
                    ]).then(function (aResults) {
                        var bShowTransport = aResults[0],
                            oLockedInformation = aResults[1];

                        if (oLockedInformation) {
                            this.showMessageBoxError(oResourceBundle.getText(
                                "Dialog.LockedText",
                                [page.transportId, oLockedInformation.foreignOwner]
                            ), true);
                        } else {
                            this._createDeleteDialog(onConfirm, onCancel)
                                .then(function (oDialog) {
                                    oDialog.getModel().setProperty(
                                        "/message",
                                        oResourceBundle.getText("DeleteDialog.Text")
                                    );

                                    if (bShowTransport) {
                                        oDialog.getModel().setProperty(
                                            "/message",
                                            oResourceBundle.getText("DeleteDialog.TransportRequired")
                                        );
                                        oDialog = this.getTransportHelper().enhanceDialogWithTransport(
                                            oDialog,
                                            oTransportComponent,
                                            onConfirm
                                        );
                                    }
                                    oDialog.open();
                                }.bind(this)).catch(fnError);
                        }
                    }.bind(this)).catch(fnError);
                }.bind(this)).catch(fnError);
        },

        /**
         * Shows the copy page dialog and enhances it with transport fields if required.
         *
         * @param {function} oPage Page to copy.
         * @param {function} onConfirm Function to call when copy is confirmed.
         * @param {function} onCancel Function to call when copy is cancelled.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        showCopyDialog: function (oPage, onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller"
                ], function (CopyPageDialogController) {
                    if (!this.oCopyPageDialogController) {
                        this.oCopyPageDialogController = new CopyPageDialogController(this.getRootView(), this.getResourceBundle());
                    }
                    this.oCopyPageDialogController.attachConfirm(onConfirm);
                    this.oCopyPageDialogController.attachCancel(onCancel);
                    return this.oCopyPageDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (transportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCopyPageDialogController,
                                    transportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCopyPageDialogController;
                    }.bind(this)).then(function (enhancedDialog) {
                        if (enhancedDialog) {
                            enhancedDialog.open();
                            enhancedDialog.getModel().setProperty("/sourceId", oPage.id);
                            enhancedDialog.getModel().setProperty("/sourceTitle", oPage.title);
                        }
                        resolve();
                    }).catch(function (error) {
                        this.oCopyPageDialogController.destroy();
                        this.handleBackendError(error);
                        reject(error);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Opens the TileInfoPopover by the oOpenByControl argument using the oNewBindingContext argument as the new binding context.
         *
         * @param {sap.ui.core.Control} oOpenByControl The control to anchor the popover to.
         * @param {sap.ui.model.Context} oBindingContext The new binding context to be used for displaying the popover bound content.
         * @param {string} [sModelName] The model name to be used with the new binding context. If omitted, the default model is used.
         */
        _openTileInfoPopover: function (oOpenByControl, oBindingContext, sModelName) {
            var oRootView = this.getRootView();
            if (!oRootView.oTileInfoPopover) {
                Fragment.load({
                    id: oRootView.getId(),
                    name: "sap.ushell.applications.PageComposer.view.TileInfoPopover",
                    controller: this
                }).then(function (oTileInfoPopover) {
                    oRootView.oTileInfoPopover = oTileInfoPopover;
                    oRootView.addDependent(oRootView.oTileInfoPopover);
                    this._openTileInfoPopover(oOpenByControl, oBindingContext, sModelName);
                }.bind(this));
            } else {
                oRootView.oTileInfoPopover.setModel(oBindingContext.getModel(sModelName));
                oRootView.oTileInfoPopover.setBindingContext(oBindingContext);
                oRootView.oTileInfoPopover.openBy(oOpenByControl);
            }
        },

        /**
         * Displays a MessageBox with an error message.
         *
         * @param {string} sErrorMsg The error message.
         * @param {boolean} [bNavToPageOverview] Indicates whether to navigate to the page overview on close. Defaults to "false".
         * @protected
         */
        showMessageBoxError: function (sErrorMsg, bNavToPageOverview) {
            if (bNavToPageOverview) {
                MessageBox.error(sErrorMsg, { onClose: this.navigateToPageOverview.bind(this) });
            } else {
                MessageBox.error(sErrorMsg);
            }
        },

        /**
         * Displays a MessageBox with an Warning message.
         *
         * @param {string} sWarningMsg The warning message.
         * @param {boolean} [bNavToPageOverview] Indicates whether to navigate to the page overview after close.
         * @protected
         */
        showMessageBoxWarning: function (sWarningMsg, bNavToPageOverview) {
            if (bNavToPageOverview) {
                MessageBox.warning(sWarningMsg, {
                    onClose: function () {
                        this.navigateToPageOverview();
                    }.bind(this)
                });
            } else {
                MessageBox.warning(sWarningMsg);
            }
        },

        /**
         * Navigates to the pageOverview page.
         *
         * @protected
         */
        navigateToPageOverview: function () {
            this.getRouter().navTo("overview");
        },

        /**
         * Navigates to the error page.
         *
         * @param {string} sPageId The error message.
         * @protected
         */
        navigateToErrorPage: function (sPageId) {
            this.getRouter().navTo("error", {
                pageId: encodeURIComponent(sPageId)
            }, null, true);
        },

        /**
         * Shows the preview of the page. It is a design-time preview without live data.
         *
         * @protected
         */
        preview: function () {
            var oParentView = this.getView();
            sap.ui.require([
                "sap/ushell/applications/PageComposer/controller/PagePreviewDialog.controller"
            ], function (PagePreviewDialogController) {
                PagePreviewDialogController.open(oParentView);
            });
        },

        /**
         * Checks if the page's masterLanguage is the same as the logon language.
         * Shows error message box if "false".
         *
         * @param {object} page The page to check.
         * @return {boolean} Returns "true" if there is a language mismatch or "false" otherwise.
         */
        checkMasterLanguageMismatch: function (page) {
            var bCheckLanguageMismatch = this.getOwnerComponent().getMetadata().getConfig().checkLanguageMismatch,
                sUserLanguage = sap.ui.getCore().getConfiguration().getSAPLogonLanguage().toUpperCase(),
                sPageMasterLanguage = page.masterLanguage.toUpperCase();
            if (bCheckLanguageMismatch && sUserLanguage !== sPageMasterLanguage) {
                this.showMessageBoxError(this.getResourceBundle().getText(
                    "EditDialog.LanguageMismatch",
                    [
                        sPageMasterLanguage,
                        sUserLanguage
                    ]
                ), true);
                return true;
            }
            return false;
        },

        /**
         * Called if a backend error needs to be handled.
         *
         * @param {object} oError The error object.
         * @protected
         */
        handleBackendError: function (oError) {
            if (oError.responseText) {
                this.getOwnerComponent().showErrorDialog(oError);
            } else {
                Log.error(oError);
            }
        },

        /**
         * Cleanup when leaving the route.
         */
        onRouteLeave: function () {
            this.getPageRepository().abortPendingBackendRequests();
        },

        /**
         * @typedef {object} RoleObject Object expanded from the oData model containing role information.
         * @property {string} title Title of the role.
         * @property {string} name Name, i.e. the ID of the role.
         * @property {object} catalogs A deferred object to the page catalogs.
         * @property {object} __metadata The metadata for this role object.
         */
        /**
         * Fetches the roles of a page to set the context.
         * Used, for example, for the page preview.
         *
         * @param {string} pageId The ID of the desired page.
         * @returns {Promise<RoleObject[]>} A promise that resolves to an array of role objects.
         * @private
         */
        fetchRoles: function (pageId) {
            return this.getPageRepository().getRoles(pageId).then(function (roles) {
                return roles || [];
            }).catch(function (error) {
                Log.error(error);
                return [];
            });
        },

        /**
         * Returns filtered error messages.
         *
         * @param {string} sPageId The page Id to be filtered.
         * @returns {boolean} The result boolean.
         * @private
         */
        onfilterErrorMessages: function (sPageId) {
            function filterItems (arr, query) {
                return arr.filter(function (obj) {
                    return obj.target.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                });
            }
            var oMessageModelData = this.getModel("message").getData(),
                errormessage = filterItems(oMessageModelData, "/pageSet('" + sPageId + "')");
            return errormessage;
        }
    });
});
