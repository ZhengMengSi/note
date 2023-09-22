// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery"],function(jQuery){"use strict";var e="user.postapi.";function s(){var e,s;this.init=function(t,n){e=t;s=n};this.getInterface=function(){var i={};i.registerPostMessageAPIs=t.bind(null,s);i[e===true?"postMessageToApp":"postMessageToFlp"]=n.bind(null,e);i.createPostMessageResult=r;return i}}function t(s,t,n){var r={status:"success",desc:""};var i={isActiveOnly:true,distributionType:["all"],fnResponseHandler:function(){}};if(t===undefined||Object.keys(t).length<=0){r.status="error";r.desc="no handler was found to register";return r}if(n===undefined){n=false}Object.keys(t).forEach(function(s){if(typeof s!=="string"){r.status="error";r.desc="oPostMessageAPIs should contain only string keys"}else if(n===false&&s.indexOf(e)!==0){r.status="error";r.desc="all user custom Message APIs must start with '"+e+"'"}else{Object.keys(t[s]).forEach(function(e){if(e=="inCalls"){t[s].oServiceCalls=t[s][e];delete t[s][e]}else if(e=="outCalls"){Object.keys(t[s][e]).forEach(function(n){t[s][e][n]=jQuery.extend(true,{},i,t[s][e][n])});t[s].oRequestCalls=t[s][e];delete t[s][e]}else{r.status="error";r.desc="api should contain either 'inCalls' or 'outCalls'"}})}});if(r.status==="success"){s(t)}return r}function n(e,s,t,n){var r=new jQuery.Deferred;if(n===undefined){n={}}if(e){sap.ui.require(["sap/ushell/components/applicationIntegration/AppLifeCycle"],function(e){e.postMessageToIframeApp(s,t,n,true).then(function(e){r.resolve(e&&e[0]&&e[0].body.result)})})}else{sap.ui.require(["sap/ushell/appRuntime/ui5/AppRuntimeService"],function(e){e.sendMessageToOuterShell(s+"."+t,n).done(function(e){r.resolve(e)})})}return r.promise()}function r(e){if(e===undefined){e={}}return(new jQuery.Deferred).resolve(e).promise()}return new s});
//# sourceMappingURL=PostMessageAPIInterface.js.map