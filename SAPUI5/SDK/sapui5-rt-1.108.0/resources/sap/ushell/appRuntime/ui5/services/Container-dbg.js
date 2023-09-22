// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer",
    "sap/ushell/appRuntime/ui5/ui/UIProxy",
    "sap/ushell/appRuntime/ui5/SessionHandlerAgent"
], function (oContainer, AppRuntimeService, Renderer, UIProxy, SessionHandlerAgent) {
    "use strict";

    function ContainerProxy () {
        var oAdapter,
            isDirty = false,
            aRegisteredDirtyMethods = [];

        this.bootstrap = function (sPlatform, mAdapterPackagesByPlatform) {
            return sap.ushell.bootstrap(sPlatform, mAdapterPackagesByPlatform).then(function (Container) {
                oAdapter = sap.ushell.Container._getAdapter();

                //get indication if we are in App Runtime
                sap.ushell.Container.inAppRuntime = function () {
                    return true;
                };
                //for backward computability
                sap.ushell.Container.runningInIframe = sap.ushell.Container.inAppRuntime;

                sap.ushell.Container.getFLPUrl = function (bIncludeHash) {
                    return AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.Container.getFLPUrl", {
                            bIncludeHash: bIncludeHash
                        });
                };

                sap.ushell.Container.getFLPUrlAsync = function (bIncludeHash) {
                    return sap.ushell.Container.getFLPUrl(bIncludeHash);
                };

                sap.ushell.Container.getRenderer = function () {
                    return Renderer;
                };

                sap.ushell.Container.logout = function () {
                    return oAdapter.logout();
                };

                sap.ushell.Container.getFLPPlatform = function () {
                    return AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.Container.getFLPPlatform"
                    );
                };

                sap.ushell.Container.extendSession = function () {
                    SessionHandlerAgent.userActivityHandler();
                };

                sap.ushell.Container.setDirtyFlag = function (bIsDirty) {
                    isDirty = bIsDirty;
                    AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.Container.setDirtyFlag", {
                            bIsDirty: bIsDirty
                        });
                };

                sap.ushell.Container.getDirtyFlag = function () {
                    return isDirty || sap.ushell.Container.handleDirtyStateProvider();
                };

                sap.ushell.Container.registerDirtyStateProvider = function (fnDirty) {
                    if (typeof fnDirty !== "function") {
                        throw new Error("fnDirty must be a function");
                    }
                    aRegisteredDirtyMethods.push(fnDirty);
                    // register the first time in the outer-shell
                    if (aRegisteredDirtyMethods.length === 1) {
                        AppRuntimeService.sendMessageToOuterShell(
                            "sap.ushell.services.Container.registerDirtyStateProvider", {
                                bRegister: true
                            });
                    }
                };

                sap.ushell.Container.handleDirtyStateProvider = function (oNavigationContext) {
                    var bDirty = false;
                    if (aRegisteredDirtyMethods.length > 0) {
                        for (var i = 0; i < aRegisteredDirtyMethods.length && bDirty === false; i++) {
                            bDirty = bDirty || (aRegisteredDirtyMethods[i](oNavigationContext) || false);
                        }
                    }
                    return bDirty;
                };

                sap.ushell.Container.deregisterDirtyStateProvider = function (fnDirty) {
                    if (typeof fnDirty !== "function") {
                        throw new Error("fnDirty must be a function");
                    }

                    var nIndex = -1;
                    for (var i = aRegisteredDirtyMethods.length - 1; i >= 0; i--) {
                        if (aRegisteredDirtyMethods[i] === fnDirty) {
                            nIndex = i;
                            break;
                        }
                    }

                    if (nIndex === -1) {
                        return;
                    }

                    aRegisteredDirtyMethods.splice(nIndex, 1);
                    if (aRegisteredDirtyMethods.length === 0) {
                        AppRuntimeService.sendMessageToOuterShell(
                            "sap.ushell.services.Container.registerDirtyStateProvider", {
                                bRegister: false
                            });
                    }
                };

                sap.ushell.Container.cleanDirtyStateProviderArray = function () {
                    aRegisteredDirtyMethods = [];
                    isDirty = false;
                };

                sap.ushell.Container.setAsyncDirtyStateProvider = function () {
                };

                // This is used ONLY when a keep-alive application is stored
                sap.ushell.Container.getAsyncDirtyStateProviders = function () {
                    return aRegisteredDirtyMethods;
                };

                // This is used ONLY when a keep-alive application is restored
                // Dirty state providers that was registered before are re-registered
                sap.ushell.Container.setAsyncDirtyStateProviders = function (aDirtyStateProviders) {
                    aRegisteredDirtyMethods = aDirtyStateProviders;
                    // Registering again in the outer shell
                    if (aRegisteredDirtyMethods.length > 0) {
                        AppRuntimeService.sendMessageToOuterShell(
                            "sap.ushell.services.Container.registerDirtyStateProvider", {
                                bRegister: true
                            });
                    }
                };
            });
        };
    }

    return new ContainerProxy();
}, true);
