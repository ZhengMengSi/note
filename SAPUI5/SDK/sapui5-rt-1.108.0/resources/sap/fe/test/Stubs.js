/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/test/OpaBuilder"],function(s){"use strict";var e={prepareStubs:function(s){if(!s.sapFEStubs){s.sapFEStubs={}}},stubAll:function(s){this.stubConfirm(s);this.stubMessageToast(s);this.stubMisc(s)},restoreAll:function(s){this.restoreConfirm(s);this.restoreMessageToast(s);this.restoreMisc(s)},stubConfirm:function(s){e.prepareStubs(s);s.sapFEStubs._confirmOriginal=s.confirm;s.confirm=function(s){throw"Unexpected confirm dialog - "+s}},restoreConfirm:function(s){if(!s.sapFEStubs||!s.sapFEStubs._confirmOriginal){return}s.confirm=s.sapFEStubs._confirmOriginal;delete s.sapFEStubs._confirmOriginal},stubMessageToast:function(s){e.prepareStubs(s);var t=s.sap.ui.require("sap/m/MessageToast");s.sapFEStubs._sapMMessageToastShowOriginal=t.show;s.sapFEStubs.setLastToastMessage=function(e){s.sapFEStubs._sapMMessageToastLastMessage=e};s.sapFEStubs.getLastToastMessage=function(){return s.sapFEStubs._sapMMessageToastLastMessage};t.show=function(e){s.sapFEStubs.setLastToastMessage(e);return s.sapFEStubs._sapMMessageToastShowOriginal.apply(this,arguments)}},restoreMessageToast:function(s){if(!s.sapFEStubs||!s.sapFEStubs._sapMMessageToastShowOriginal){return}var e=s.sap.ui.require("sap/m/MessageToast");e.show=s.sapFEStubs._sapMMessageToastShowOriginal;delete s.sapFEStubs._sapMMessageToastShowOriginal;delete s.sapFEStubs._sapMMessageToastLastMessage;delete s.sapFEStubs.setLastToastMessage;delete s.sapFEStubs.getLastToastMessage},stubMisc:function(s){e.prepareStubs(s);s.sap.ui.require(["sap/ui/table/CreationRow"],function(e){s.sapFEStubs._sapUiTableCreationRowOnSapEnter=e.prototype.onsapenter;delete e.prototype.onsapenter})},restoreMisc:function(s){if(!s.sapFEStubs||!s.sapFEStubs._sapUiTableCreationRowOnSapEnter){return}var e=s.sap.ui.require("sap/ui/table/CreationRow");e.prototype.onsapenter=s.sapFEStubs._sapUiTableCreationRowOnSapEnter;delete s.sapFEStubs._sapUiTableCreationRowOnSapEnter}};return e});
//# sourceMappingURL=Stubs.js.map