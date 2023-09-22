//@ui5-bundle sap/ushell/components/shell/MenuBar/Component-h2-preload.js
// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.predefine('sap/ushell/components/shell/MenuBar/Component',["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/ushell/Config"],function(U,J,C){"use strict";return U.extend("sap.ushell.components.shell.MenuBar.Component",{init:function(){U.prototype.init.apply(this,arguments);var m=new J();this.setModel(m,"menu");var c;sap.ushell.Container.getServiceAsync("Menu").then(function(M){M.isMenuEnabled().then(function(i){if(i){c=sap.ui.getCore().byId("menuBarComponentContainer");}return M.getMenuEntries();}).then(function(a){if(c){m.setProperty("/",a);c.setComponent(this);}if(C.last("/core/shell/model/currentState/stateName")!=="home"){c.setVisible(false);}}.bind(this));}.bind(this));}});});
sap.ui.require.preload({
	"sap/ushell/components/shell/MenuBar/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"sap.ushell.components.shell.MenuBar","applicationVersion":{"version":"1.75.0"},"i18n":"../../../renderers/fiori2/resources/resources.properties","type":"component","title":"{{Component.MenuBar.Title}}"},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ushell.components.shell.MenuBar.view.MenuBar","type":"XML","async":true},"dependencies":{"minUI5Version":"1.72","libs":{"sap.m":{}}},"models":{},"contentDensities":{"compact":true,"cozy":true}}}'
},"sap/ushell/components/shell/MenuBar/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/components/shell/MenuBar/Component.js":["sap/ui/core/UIComponent.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js"],
"sap/ushell/components/shell/MenuBar/controller/MenuBar.controller.js":["sap/base/util/ObjectPath.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/EventHub.js"],
"sap/ushell/components/shell/MenuBar/view/MenuBar.view.xml":["sap/m/IconTabFilter.js","sap/m/IconTabHeader.js","sap/ui/core/mvc/XMLView.js","sap/ushell/components/shell/MenuBar/controller/MenuBar.controller.js"]
}});
//# sourceMappingURL=Component-h2-preload.js.map