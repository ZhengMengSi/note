/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/Core",
    "sap/base/security/URLListValidator",
    "./URLMinifier",
    "sap/suite/ui/commons/collaboration/BaseHelperService",
    'sap/ui/performance/trace/FESRHelper',
    'sap/ui/core/Element'
], function (Log, Core, URLListValidator, URLMinifier, BaseHelperService, FESRHelper, Element) {
    "use strict";

    /**
     * Provides the Share options
     * @namespace
     * @since 1.104
     * @alias module:sap/suite/ui/commons/collaboration/TeamsHelperService
     * @private
     * @ui5-restricted
     * @experimental Since 1.108
     */
    var TeamsHelperService = BaseHelperService.extend("sap.suite.ui.commons.collaboration.TeamsHelperService");

    /**
     * sTeamsAppID is hardcoded as of now, will be changed when app is published at org level.
     */
    var COLLABORATION_MSTEAMS_APPID = '7e4759cc-15a7-4f18-8de5-19d1273e6ca3';
    var oLogger = Log.getLogger("sap.suite.ui.commons.collaboration.TeamsHelperService");

    var oResourceBundle = Core.getLibraryResourceBundle("sap.suite.ui.commons");
    var oElement = new Element();

    /**
     * Gives list of all Collaboration Options
     * @param {object} oParams Optional argument in case consumer wants to influence the options, otherwise pass as undefined
     * @param {boolean} oParams.isShareAsLinkEnabled Allow Share as Chat option
     * @param {boolean} oParams.isShareAsTabEnabled Allow Share as Tab option
     * @returns {array} Array of available options
     * @private
     * @ui5-restricted
     * @experimental Since 1.108
     */
    TeamsHelperService.prototype.getOptions = function (oParams) {
        var oDefaultParams = {
            isShareAsLinkEnabled: true,
            isShareAsTabEnabled: true
        };

        var oTeamsParams = oParams || oDefaultParams;
        var aOptions = [];
        var aFinalOptions = [];

        if (oTeamsParams.isShareAsLinkEnabled) {
            if (this._providerConfig.isShareAsLinkEnabled) {
                aOptions.push({
                    "text": oResourceBundle.getText("COLLABORATION_MSTEAMS_CHAT"),
                    "key": "COLLABORATION_MSTEAMS_CHAT",
                    "icon": "sap-icon://post"
                });
            } else {
                oLogger.info("Share as Chat option is not enabled in the tenant");
            }
        } else {
            oLogger.info("Consumer disable Share as Chat option");
        }

        if (oTeamsParams.isShareAsTabEnabled) {
            if (this._providerConfig.isShareAsTabEnabled) {
                aOptions.push({
                    "text": oResourceBundle.getText("COLLABORATION_MSTEAMS_TAB"),
                    "key": "COLLABORATION_MSTEAMS_TAB",
                    "icon": "sap-icon://image-viewer"
                });
            } else {
                oLogger.info("Share as Tab option is not enabled in the tenant");
            }
        } else {
            oLogger.info("Consumer disable Share as Tab option");
        }

        if (aOptions.length === 1) {
            aFinalOptions = aOptions;
            if (aFinalOptions[0].key === "COLLABORATION_MSTEAMS_CHAT") {
                aFinalOptions[0].text = oResourceBundle.getText("COLLABORATION_MSTEAMS_CHAT_SINGLE");
            } else if (aFinalOptions[0].key === "COLLABORATION_MSTEAMS_TAB") {
                aFinalOptions[0].text = oResourceBundle.getText("COLLABORATION_MSTEAMS_TAB_SINGLE");
            }
            return aFinalOptions;
        }

        if (aOptions.length > 1) {
            aFinalOptions.push({
                "type": "microsoft",
                "text": oResourceBundle.getText("COLLABORATION_MSTEAMS_SHARE"),
                "icon": "sap-icon://collaborate",
                "subOptions": aOptions
            });
        }

        return aFinalOptions;
    };

    /**
     * Method to be called to trigger the share operation
     *
     * @param {Object} oOption Option Object/SubObject which is clicked
     * @param {Object} oParams Parameter object which contain the information to share
     * @param {string} oParams.url Url of the application which needs to be shared
     * @param {string} oParams.appTitle Title of the application which needs to be used while integration
     * @returns {void}
     * @private
     * @ui5-restricted
     * @experimental Since 1.108
     */
    TeamsHelperService.prototype.share = function (oOption, oParams) {

        if (!oParams.url) {
            oLogger.error("url is not supplied in object so terminating Click");
            return;
        }

        if (!URLListValidator.validate(oParams.url)) {
            oLogger.error("Invalid URL supplied");
            return;
        }

        if (oOption.key === "COLLABORATION_MSTEAMS_CHAT") {
            this._shareAsChat(oParams);
            return;
        }

        if (oOption.key === "COLLABORATION_MSTEAMS_TAB") {
            this._shareAsTab(oParams);
            return;
        }
    };

    /**
     * Helper method which shares the URL as Link
     *
     * @param {Object} oParams Parameter object which contain the information to share
     * @param {string} oParams.url Url of the application which needs to be shared
     * @param {string} oParams.appTitle Title of the application which needs to be used in the chat message
     * @returns {void}
     * @private
     * @ui5-restricted
     * @experimental Since 1.108
     */
    TeamsHelperService.prototype._shareAsChat = function (oParams) {
        // Needed for Telemetry
        FESRHelper.setSemanticStepname(oElement, "press", "ShareAsLink");
        var newWindow = window.open(
            "",
            "ms-teams-share-popup",
            "width=700,height=600"
        );
        var sMessage = oParams.appTitle;
        if (oParams.subTitle.length > 0) {
            sMessage += ": " + oParams.subTitle;
        }

        newWindow.opener = null;
        URLMinifier.compactHash(oParams.url, []).then(function (sShortURL) {
            newWindow.location = "https://teams.microsoft.com/share?msgText=" + encodeURIComponent(sMessage) + "&href=" + encodeURIComponent(sShortURL.url);
        });
    };

    /**
     * Helper method which shares the application as a Tab in MS Teams
     *
     * @param {Object} oParams Parameter object which contain the information to share
     * @param {string} oParams.url Url of the application which needs to be shared
     * @param {string} oParams.appTitle Title of the application which needs to be used in the Tab title
     * @returns {void}
     * @private
     * @ui5-restricted
     * @experimental Since 1.108
     */
    TeamsHelperService.prototype._shareAsTab = function (oParams) {
        // Needed for Telemetry
        FESRHelper.setSemanticStepname(oElement, "press", "ShareAsTab");
        var oUshellContainer = sap.ushell && sap.ushell.Container;
        var oURLParsing = oUshellContainer && oUshellContainer.getService("URLParsing");
        var sAppUri = oParams.url;
        var iIndexOfHash = sAppUri.indexOf('#');
        if (iIndexOfHash !== -1) {
            var sUriForHeaderLess = sAppUri.substring(0, iIndexOfHash);
            var iIndexOfQuestionMark = sUriForHeaderLess.indexOf('?', 0);
            var sParam = 'sap-ushell-config=headerless&sap-collaboration-teams=true';
            if (iIndexOfQuestionMark !== -1) {
                sUriForHeaderLess = sUriForHeaderLess.substring(0, iIndexOfQuestionMark + 1) + sParam + '&' + sUriForHeaderLess.substring(iIndexOfQuestionMark + 1);
            } else {
                sUriForHeaderLess += ("?" + sParam);
            }
            sAppUri = sUriForHeaderLess + sAppUri.substring(iIndexOfHash);
            iIndexOfHash = sAppUri.indexOf('#');
            var oHashPartOfUri = oURLParsing.parseShellHash(sAppUri.substring(iIndexOfHash));
            oHashPartOfUri.params['sap-ushell-navmode'] = 'explace';
            oHashPartOfUri.params['sap-ushell-next-navmode'] = 'explace';
            var sHashOfUri = oURLParsing.constructShellHash(oHashPartOfUri);
            sAppUri = sAppUri.substring(0, iIndexOfHash) + '#' + sHashOfUri;
        }

        var oData = {
            "subEntityId": {
                "url": sAppUri,
                "appTitle": oParams.appTitle,
                "subTitle": oParams.subTitle,
                "mode": "tab"
            }
        };
        var sURL = "https://teams.microsoft.com/l/entity/" + COLLABORATION_MSTEAMS_APPID + "/home?&context=" + encodeURIComponent(JSON.stringify(oData));
        sap.m.URLHelper.redirect(sURL, true);
    };

    return TeamsHelperService;
});