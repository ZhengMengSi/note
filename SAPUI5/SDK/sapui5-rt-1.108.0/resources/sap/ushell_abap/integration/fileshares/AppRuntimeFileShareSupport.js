// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Core","sap/ui/core/Manifest","sap/base/Log","sap/ushell/Container"],function(e,t,a){"use strict";var r={_getDataSourcePromise:null};var n="sap.ushell_abap.integration.fileshares.AppRuntimeFileShareSupport";var s="FileShare";var i="manage";var o="/sap/bc/ui2/start_up?so="+s+"&action="+i+"&systemAliasesFormat=object&formFactor=desktop&shellType=FLP&depth=0";r.getDataSource=function(){if(!r._getDataSourcePromise){var s=sap.ushell.Container.getLogonSystem().getClient();var i=sap.ushell.Container.getUser().getLanguage();var p=o+"&sap-language="+i+"&sap-client="+s;r._getDataSourcePromise=fetch(p,{method:"GET",headers:{"Content-Type":"application/json; utf-8",Accept:"application/json","Accept-Language":e.getConfiguration().getLanguageTag()}}).then(function(e){if(e.ok===false){a.error("Could not fetch data, request failed","error: "+e.status+", "+e.statusText+",\nurl: "+p,n);return Promise.reject(e.statusText)}return e.json()}).then(function(e){if(e&&e.targetMappings&&Object.keys(e.targetMappings).length>0){var r=e.targetMappings[Object.keys(e.targetMappings)[0]].applicationDependencies;if(r){var s;try{s=JSON.parse(r).manifest}catch(t){a.error("Could not parse JSON data of applicationDependencies for targetMapping '"+Object.keys(e.targetMappings)[0]+"': "+t.message,null,n)}if(s){return t.load({manifestUrl:s,async:true})}}}var i=["No manifest URL defined:",JSON.stringify(e)].join(" ");a.error(i,null,n);throw new Error(i)}).then(function(e){return e.getEntry("/sap.app/dataSources/mainService")})}return r._getDataSourcePromise};return r});
//# sourceMappingURL=AppRuntimeFileShareSupport.js.map