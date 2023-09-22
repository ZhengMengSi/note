//@ui5-bundle sap/ushell/components/pages/Component-h2-preload.js
//Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/components/pages/Component',["sap/ui/core/UIComponent","sap/ushell/components/SharedComponentUtils","sap/ushell/resources"],function(U,S,r){"use strict";return U.extend("sap.ushell.components.pages.Component",{metadata:{manifest:"json"},init:function(){U.prototype.init.apply(this,arguments);S.toggleUserActivityLog();S.getEffectiveHomepageSetting("/core/home/sizeBehavior","/core/home/sizeBehaviorConfigurable");this.setModel(r.i18nModel,"i18n");},getComponentData:function(){return{};}});});
sap.ui.require.preload({
	"sap/ushell/components/pages/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"sap.ushell.components.pages","applicationVersion":{"version":"1.75.0"},"i18n":"../../renderers/fiori2/resources/resources.properties","ach":"CA-FLP-FE-COR","type":"component","title":"{{Component.Pages.Title}}"},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ushell.components.pages.view.PageRuntime","type":"XML","async":true},"dependencies":{"minUI5Version":"1.72","libs":{"sap.m":{},"sap.f":{}}},"contentDensities":{"compact":true,"cozy":true}}}'
},"sap/ushell/components/pages/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/components/pages/ActionMode.js":["sap/base/Log.js","sap/ushell/EventHub.js","sap/ushell/resources.js"],
"sap/ushell/components/pages/Component.js":["sap/ui/core/UIComponent.js","sap/ushell/components/SharedComponentUtils.js","sap/ushell/resources.js"],
"sap/ushell/components/pages/controller/PageRuntime.controller.js":["sap/base/Log.js","sap/base/util/ObjectPath.js","sap/m/GenericTile.js","sap/m/MessageToast.js","sap/m/library.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/EventHub.js","sap/ushell/components/pages/StateManager.js","sap/ushell/components/pages/formatter/PageRuntimeFormatter.js","sap/ushell/resources.js","sap/ushell/utils.js"],
"sap/ushell/components/pages/formatter/PageRuntimeFormatter.js":["sap/ui/Device.js"],
"sap/ushell/components/pages/view/PageRuntime.view.xml":["sap/m/Bar.js","sap/m/Button.js","sap/m/MessagePage.js","sap/m/NavContainer.js","sap/m/Page.js","sap/ui/core/dnd/DropInfo.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/pages/controller/PageRuntime.controller.js","sap/ushell/ui/launchpad/Page.js","sap/ushell/ui/launchpad/Section.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map