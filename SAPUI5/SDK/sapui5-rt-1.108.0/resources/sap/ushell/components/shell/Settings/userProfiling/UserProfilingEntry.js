// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/Log","sap/ui/core/mvc/XMLView","sap/ushell/Config","sap/ushell/resources"],function(e,n,r,i){"use strict";return{getEntry:function(){var t;return{id:"userProfiling",entryHelpID:"userProfiling",title:i.i18n.getText("userProfiling"),valueResult:null,contentResult:null,icon:"sap-icon://user-settings",valueArgument:function(){var e=r.last("/core/userPreferences/profiling"),n={value:e&&e.length>0?1:0,displayText:""};return Promise.resolve(n)},contentFunc:function(){return n.create({id:"userProfilingView",viewName:"sap.ushell.components.shell.Settings.userProfiling.UserProfiling"}).then(function(e){t=e;return e})},onSave:function(){if(t){return t.getController().onSave()}e.warning("Save operation for user profiling was not executed, because the userProfiling view was not initialized");return Promise.resolve()},onCancel:function(){if(t){t.getController().onCancel();return}e.warning("Cancel operation for user profiling was not executed, because the userProfiling view was not initialized")},provideEmptyWrapper:false,visible:false}}}});
//# sourceMappingURL=UserProfilingEntry.js.map