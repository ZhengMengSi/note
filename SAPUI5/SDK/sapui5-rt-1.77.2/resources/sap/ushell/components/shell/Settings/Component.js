// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/XMLView","sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/ushell/Config","sap/ushell/EventHub","sap/ushell/resources","sap/ushell/components/shell/Settings/userAccount/UserAccountEntry","sap/ushell/components/shell/Settings/homepage/HomepageEntry"],function(X,U,J,C,E,r,a,H){"use strict";var d=[];return U.extend("sap.ushell.components.shell.Settings.Component",{metadata:{version:"1.77.2",library:"sap.ushell",dependencies:{libs:["sap.m","sap.ui.layout"]}},init:function(){U.prototype.init.apply(this,arguments);this._addStandardEntityToConfig();this._loadSearchProfiling();d.push(E.on("openUserSettings").do(this._openUserSettings.bind(this)));},_addStandardEntityToConfig:function(){var e=C.last("/core/userPreferences/entries");e.push(a.getEntry());if(C.last("/core/home/enableHomePageSettings")&&!C.last("/core/spaces/enabled")){e.push(H.getEntry());}e=sap.ushell.Container.getRenderer("fiori2").reorderUserPrefEntries(e);C.emit("/core/userPreferences/entries",e);},_openUserSettings:function(e){if(!this.oDialog){X.create({id:"settingsView",viewName:"sap.ushell.components.shell.Settings.UserSettings"}).then(function(s){this.oSettingsView=s;var m=C.createModel("/core/userPreferences",J);s.setModel(m);s.setModel(r.i18nModel,"i18n");this.oDialog=s.byId("userSettingsDialog");if(e.id){sap.ui.getCore().byId(e.id).addDependent(s);}this.oDialog.open();}.bind(this));}else{this.oDialog.open();}},_loadSearchProfiling:function(){function i(){return C.last("/core/shellHeader/headEndItems").indexOf("sf")!==-1;}if(i()){sap.ui.require(["sap/ushell/renderers/fiori2/search/userpref/SearchPrefs","sap/ushell/renderers/fiori2/search/SearchShellHelperAndModuleLoader"],function(S){var s=S.getEntry(),R=sap.ushell.Container.getRenderer("fiori2");s.isSearchPrefsActive().done(function(b){if(b&&R){R.addUserProfilingEntry(s);}});});}},exit:function(){for(var i=0;i<d.length;i++){d[i].off();}if(this.oSettingsView){this.oSettingsView.destroy();this.oSettingsView=null;this.oDialog=null;}}});});