// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/URI","sap/base/Log"],function(e,n){"use strict";var i={};function r(){i={}}function t(){return Object.keys(i).length}function a(e,n){var r=d(e);i[r]=n}function u(e){var n=d(e);if(i[n]){delete i[n]}}function f(e){if(e===undefined||t()===0){return undefined}var n=d(e);return n!==undefined?i[n]:undefined}function o(e){for(var n in i){if(i.hasOwnProperty(n)){var r=i[n];if(r.sId===e){return r}}}return undefined}function d(i){var r,t,a,u="",f="",o="",d;if(i===undefined||i===""||i==="../"){return i}try{r=new e(i);if(i.charAt(0)==="/"){t=window.location.origin}else{t=r.origin()}if(t===undefined||t===""){t=r.path();if(t===undefined||t===""){t=i}}a=r.query(true);if(a["sap-iframe-hint"]){u="@"+a["sap-iframe-hint"]}if(a["sap-ui-version"]){f="@"+a["sap-ui-version"]}if((u==="@GUI"||u==="@WDA"||u==="@WCF")&&a["sap-keep-alive"]){o="@"+a["sap-keep-alive"]+"-"+i.split("#")[0]}}catch(e){n.error("URL '"+i+"' can not be parsed: "+e,"sap.ushell.components.applicationIntegration.application.BlueBoxHandler");t=i}d=t+u+f+o;return d}return{init:r,getSize:t,add:a,remove:u,get:f,getById:o,getBlueBoxCacheKey:d}},false);
//# sourceMappingURL=BlueBoxesCache.js.map