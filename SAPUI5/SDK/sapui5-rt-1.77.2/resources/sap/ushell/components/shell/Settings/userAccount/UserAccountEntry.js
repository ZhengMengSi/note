// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/XMLView","sap/base/Log","sap/ushell/Config","sap/ushell/resources"],function(X,L,C,r){"use strict";function g(){var s=sap.ushell.Container.getRenderer("fiori2").getShellConfig(),u=s.enableUserImgConsent;var v=u?"userAccountSelector":"userAccountSetting";var c=u?"sap.ushell.components.shell.Settings.userAccount.UserAccountSelector":"sap.ushell.components.shell.Settings.userAccount.UserAccountSetting";var i=C.last("/core/shell/model/userImage/account")||"sap-icon://account";var V;var e={id:"userAccountEntry",entryHelpID:"userAccountEntry",title:r.i18n.getText("UserAccountFld"),valueResult:null,contentResult:null,icon:i,valueArgument:sap.ushell.Container.getUser().getFullName(),contentFunc:function(){return X.create({id:v,viewName:c}).then(function(o){V=o;return o;});},onSave:function(){if(V){return V.getController().onSave();}L.warning("Save operation for user account settings was not executed, because the userAccount view was not initialized");return Promise.resolve();},onCancel:function(){if(V){V.getController().onCancel();return;}L.warning("Cancel operation for user account settings was not executed, because the userAccount view was not initialized");},provideEmptyWrapper:true};return e;}return{getEntry:g};});