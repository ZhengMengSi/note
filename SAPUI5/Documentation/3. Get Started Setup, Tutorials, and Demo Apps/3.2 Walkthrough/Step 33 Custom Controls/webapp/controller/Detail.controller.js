sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/m/MessageToast"

], function (Controller, History, MessageToast) {
  "use strict";
  return Controller.extend("zms.controller.Detail", {
    onInit: function () {
      // ManagedObject zms.Component#container-zms
      // console.log(this.getOwnerComponent())
      var oRouter = this.getOwnerComponent().getRouter();
      // EventProvider sap.m.routing.Router
      // console.log(oRouter)
      // EventProvider sap.ui.core.routing.Route
      // console.log(oRouter.getRoute("detail"))
      // oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
      oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
    },
    _onObjectMatched: function (oEvent) {
      // EventProvider zms.controller.Detail
      console.log(this)
      this.byId("rating").reset();
      this.getView().bindElement({
        path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
        model: "invoice"
      });
    },
    onNavBack: function () {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("overview", {}, true);
      }
    },

    onRatingChange: function (oEvent) {
      var fValue = oEvent.getParameter("value");
      var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

      MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
    }
  });
});
