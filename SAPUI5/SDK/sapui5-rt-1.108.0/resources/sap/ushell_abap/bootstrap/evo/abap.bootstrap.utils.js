// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/base/util/ObjectPath","sap/ushell_abap/pbServices/ui2/Utils","sap/base/Log"],function(t,e,a,r){"use strict";var n={};n.getUrlParameterValue=function(t,e){var r=e||a.getParameterMap();return r[t]&&r[t][0]};n.createAndOpenXHR=function(t,e,a){a=a||"GET";var r=new XMLHttpRequest;r.open(a,t,true);if(e){n.addCommonHeadersToXHR(r,e)}return r};n.addCommonHeadersToXHR=function(t,e){t.setRequestHeader("Accept","application/json");if(e.client){t.setRequestHeader("sap-client",e.client)}if(e.language){t.setRequestHeader("sap-language",e.language)}return t};n.getCacheIdAsQueryParameter=function(t){var a=e.get("services.targetMappings.cacheId",t);if(typeof a==="string"){return"&sap-cache-id="+a}return""};n.isSapStatisticsSet=function(e){var a=e||window.location.search,n=/sap-statistics=(true|x|X)/.test(a);try{n=n||t.getLocalStorageItem("sap-ui-statistics")==="X"}catch(t){r.warning("failed to read sap-statistics setting from local storage",null,"sap.ushell_abap.bootstrap")}return n};n.mergeConfig=function(t,e,a){var r=a?JSON.parse(JSON.stringify(e)):e;if(typeof e!=="object"){return}Object.keys(r).forEach(function(e){if(Object.prototype.toString.apply(t[e])==="[object Object]"&&Object.prototype.toString.apply(r[e])==="[object Object]"){n.mergeConfig(t[e],r[e],false);return}t[e]=r[e]})};n.getLocationOrigin=function(){return location.protocol+"//"+location.host};n.getLocationHref=function(){return location.href};return n});
//# sourceMappingURL=abap.bootstrap.utils.js.map