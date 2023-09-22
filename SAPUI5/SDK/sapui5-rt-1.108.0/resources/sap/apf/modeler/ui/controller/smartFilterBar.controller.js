/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){"use strict";var e,t,i,r,a;function o(t){if(e&&e.arguments&&e.arguments.smartFilterId){a=r.getSmartFilterBar()}}function n(e){var o,n;var s={oTextReader:t,oConfigurationHandler:i,oConfigurationEditor:r,oParentObject:a,getCalatogServiceUri:e.getView().getViewData().getCalatogServiceUri,oCoreApi:e.getView().getViewData().oCoreApi};o=new sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBarRequest");n=new sap.ui.view({viewName:"sap.apf.modeler.ui.view.requestOptions",type:sap.ui.core.mvc.ViewType.XML,id:e.createId("idSFBRequestView"),viewData:s,controller:o});e.byId("idSFBRequestVBox").insertItem(n)}sap.ui.controller("sap.apf.modeler.ui.controller.smartFilterBar",{onInit:function(){var a=this;var s=a.getView().getViewData();t=s.getText;e=s.oParams;i=s.oConfigurationHandler;r=s.oConfigurationEditor;o(a);n(a)},setDetailData:function(){},getValidationState:function(){var e=this;return e.byId("idSFBRequestView").getController().getValidationState()},onExit:function(){var e=this;e.byId("idSFBRequestView").destroy()}})})();
//# sourceMappingURL=smartFilterBar.controller.js.map