/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(function(){"use strict";var e={patternMatch:function(e){this.params={};var t=this;sap.ui.core.UIComponent.getRouterFor(e).attachRoutePatternMatched(function(a){t.params={name:a.getParameter("name"),arguments:a.getParameter("arguments")};e.getView().byId("idConfigMasterData").setBusy(true);e.getView().byId("idConfigDetail").setBusy(true);if(t.params.name!=="applicationList"){var i=e.oCoreApi;e.appId=t.params.arguments.appId;e.configId=t.params.arguments.configId;i.getApplicationHandler(function(a){e.applicationHandler=a;e.appName=a.getApplication(e.appId).ApplicationName;var n=e.byId("idConfigTitleMaster").getText();if(n===""||t.params.name==="configurationList"){e.setConfigListMasterTitle(e.appName);e.oTreeInstance.setApplicationId(t.params.arguments.appId)}i.getConfigurationHandler(e.appId,function(a){e.configurationHandler=a;e.oTextPool=e.configurationHandler.getTextPool();if(e.configurationHandler.getList().length>e.getView().getModel().getData().aConfigDetails.length){e.createConfigList();if(t.params.name==="configurationList"){e.updateConfigListView()}}if(e.configurationHandler.getList().length===0&&e.configId===undefined){e.oTreeInstance.addNodeInTree(sap.apf.modeler.ui.utils.CONSTANTS.configurationObjectTypes.CONFIGURATION);var i=e.oTreeInstance.getItems();var n=i[i.length-1];e.oTreeInstance.setSelectedItem(n);e.oTreeInstance.expand(0);e.getView().byId("idConfigDetail").setBusy(false)}else if(e.configId===undefined){e.oTreeInstance.expandToLevel(1);e.oTreeInstance.collapseAll()}if(e.configId!==undefined){var o=a.getConfiguration(e.configId);if(o){a.loadConfiguration(e.configId,function(a){e.configEditor=a;var i=e.getSPathForConfig(e.configId);if(e.oModel.getData().aConfigDetails[i.split("/")[2]].bIsLoaded===false){e.updateTree();if(t.params.name!=="navigationTarget"){t.setCurrentSelectionState(t.params,e)}}else{t.setCurrentSelectionState(t.params,e)}})}else{t.setCurrentSelectionState(t.params,e)}}e.getView().byId("idConfigMasterData").setBusy(false)})})}})},setCurrentSelectionState:function(e,t){var a=t.getSPathFromURL(e);if(e.name!=="configurationList"){if(a&&a.objectType){if(e.name==="step"){var i=t.getStepConfigDataBysPath(a.sPath);e.bIsHierarchicalStep=i&&i.bIsHierarchicalStep?true:false}t.updateSubView(e);if(a.sPath){t.setSelectionOnTree(a)}t.updateTitleAndBreadCrumb()}else{t.showNoConfigSelectedText();t.removeSelectionOnTree()}}t.getView().byId("idConfigDetail").setBusy(false)}};return e},true);
//# sourceMappingURL=APFRouter.js.map