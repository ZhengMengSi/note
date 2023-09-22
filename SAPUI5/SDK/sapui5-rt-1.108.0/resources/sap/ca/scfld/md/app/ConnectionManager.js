/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.scfld.md.app.ConnectionManager");jQuery.sap.require("sap.ca.ui.message.message");jQuery.sap.require("sap.ca.ui.utils.busydialog");jQuery.sap.require("sap.ui.model.odata.ODataUtils");sap.ui.base.ManagedObject.extend("sap.ca.scfld.md.app.ConnectionManager",{metadata:{properties:{identity:"string",configuration:"object",defaultConfiguration:"object",component:"object"}},initModels:function(){function e(e,a){(a||"").split("&").forEach(function(a){var t=a.indexOf("="),s=a,r="";if(t>=0){r=decodeURIComponent(s.slice(t+1));s=s.slice(0,t)}s=decodeURIComponent(s);if(s){e[s]=r}})}function a(e){var a=JSON.parse(JSON.stringify(e));jQuery.each(a,function(a,t){t.fRequestFailed=e[a].fRequestFailed});return a}this.modelList={};this.mockServerList={};this.iRequestCount=0;var t=jQuery.isArray(this.getConfiguration().getServiceList())?a(this.getConfiguration().getServiceList()):null;var s=this.getConfiguration().getExcludedQueryStringParameters()||[];var r=this.getConfiguration().isMock();var i=this;var o=jQuery.sap.getUriParameters().get("sap-server");var n=jQuery.sap.getUriParameters().get("sap-host");var u=jQuery.sap.getUriParameters().get("sap-host-http");var l=jQuery.sap.getUriParameters().get("sap-client");var d=i.getComponent();var c=(d.getComponentData()||{}).startupParameters||{};var g=c["sap-system"]||{};var p=typeof g==="object"?g[0]:g;this.sErrorInStartMessage="";this.bIsComponentBase=!!d.setRouterSetCloseDialogs;this.bIsShowingMessage=false;if(!sap.ui.getCore().getConfiguration().getDisableCustomizing()&&d&&d.getMetadata()){var f=d.getMetadata().getConfig(),m=d.getMetadata().getParent().getName(),h=f["sap.ca.serviceConfigs"]||[];var M=function(e,t){var s,r;var i=jQuery.isArray(t)?a(t):[];for(var o=0;o<e.length;o++){s=e[o];for(var n=0;n<i.length;n++){r=i[n];if(s.name==r.name){for(var u in r){s[u]=r[u]}i.splice(n,1);n--}}}e=e.concat(i);return e};if(m!=="sap.ca.scfld.md.ComponentBase"){var y=d.getMetadata().getManifestEntry("sap.app");if(y&&y.dataSources){var v=y.dataSources,C=[];for(var S in v){var R=v[S],j=R.settings,D={name:S,serviceUrl:R.uri};if(j&&j.localUri){D.mockedDataSource=jQuery.sap.getModulePath(y.id)+"/"+j.localUri}C.push(D)}if(C.length>0){h=M(h,C)}}}if(h.length>0&&t!=null){t=M(t,h)}}if(t!=null){jQuery.each(t,function(a,t){function d(e,a){var t="Cannot load meta data for service "+a.serviceUrl,s=e.getParameter("statusCode"),r=i.getIdentity()||"sap.ca.scfld.md.app.ConnectionManager";s+=" (";s+=e.getParameter("statusText");s+=") - ";s+=e.getParameter("message");s+="\n";s+=e.getParameter("responseText");jQuery.sap.log.error(t,s,r)}var c=URI(t.serviceUrl),g=t.useV2ODataModel===true;if(o!=null&&jQuery.inArray("sap-server",s)==-1){c.addSearch("sap-server",o)}else if(n!=null&&jQuery.inArray("sap-host",s)==-1){c.addSearch("sap-host",n)}else if(u!=null&&jQuery.inArray("sap-host-http",s)==-1){c.addSearch("sap-host-http",u)}if(l!=null&&jQuery.inArray("sap-client",s)==-1){c.addSearch("sap-client",l)}var f=c.toString();if(p){f=sap.ui.model.odata.ODataUtils.setOrigin(f,p)}var m={metadataUrlParams:{},json:true,loadMetadataAsync:t.loadMetadataAsync===true||g};if(r){jQuery.sap.require("sap.ui.core.util.MockServer");var h=f.split("?")[0].replace(/\/?$/,"/");var M=new sap.ui.core.util.MockServer({rootUri:h});if(t.mockedDataSource){M.simulate(t.mockedDataSource,{sMockdataBaseUrl:t.mockedDataSource.replace(/[^\/]+$/,""),bGenerateMissingMockData:true})}else{M.simulate(h+"$metadata")}M.start();i.mockServerList[t.name]=M;if(t.isDefault){i.mockServerList[undefined]=M}m.metadataUrlParams["sap-ca-scfld-cachebuster"]=Date.now()}e(m.metadataUrlParams,t.metadataParams);if(t.serviceUrl.indexOf("/sap/opu/")===0){var y;if(sap.ushell&&sap.ushell.Container){y=sap.ushell.Container.getUser().getLanguage();if(y&&!/^[A-Z]{2}$/i.test(y)){y=sap.ui.getCore().getConfiguration().getSAPLogonLanguage()}}else{y=jQuery.sap.getUriParameters().get("sap-language")}if(y&&s.indexOf("sap-language")<0){m.metadataUrlParams["sap-language"]=y}}var v=g?new sap.ui.model.odata.v2.ODataModel(f,m):new sap.ui.model.odata.ODataModel(f,m);if(m.loadMetadataAsync){v.attachMetadataLoaded({oModel:v,oService:t},function(e,a){i.checkModelMetaData(a.oModel,a.oService)},this);v.attachMetadataFailed({oModel:v,oService:t},function(e,a){d(e,a.oService);i.checkModelMetaData(a.oModel,a.oService)},this)}else{v.attachMetadataFailed(t,d,this);i.checkModelMetaData(v,t)}if(t.overrideGetPropertyMetadata&&v.oMetadata){v.oMetadata._getPropertyMetadata=function(e,a){a=a.replace(/^\/|\/$|\)$|\w*\(/g,"");return sap.ui.model.odata.ODataMetadata.prototype._getPropertyMetadata.apply(this,[e,a])}}if(t.useBatch&&!r){v.setUseBatch(true)}if(t.countSupported){if(g){v.setDefaultCountMode(sap.ui.model.odata.CountMode.Request)}else{v.setCountSupported(true)}}else{if(g){v.setDefaultCountMode(sap.ui.model.odata.CountMode.Inline)}else{v.setCountSupported(false)}}if(t.sDefaultBindingMode){v.setDefaultBindingMode(t.sDefaultBindingMode)}if(t.fRequestFailed){v.attachRequestFailed(null,t.fRequestFailed)}else{v.attachRequestFailed(null,jQuery.proxy(i.handleRequestFailed,i))}if(t.noBusyIndicator==true){v.attachRequestSent(null,jQuery.proxy(i.handleRequestSentInner,i));v.attachRequestCompleted(null,jQuery.proxy(i.handleRequestCompletedInner,i))}else{v.attachRequestSent(null,jQuery.proxy(i.handleRequestSent,i));v.attachRequestCompleted(null,jQuery.proxy(i.handleRequestCompleted,i))}if(t.isDefault){i.modelList[undefined]=v;i.setDefaultConfiguration(t)}else{i.modelList[t.name]=v}})}},checkModelMetaData:function(e,a){if(!e.getServiceMetadata()){var t=this.getProperty("configuration").oApplicationFacade.oApplicationImplementation.UilibI18nModel.getResourceBundle();this.sErrorInStartMessage=t.getText("ERROR_MSG_NO_METADATA",[a.name]);var s={type:sap.ca.ui.message.Type.ERROR,message:this.sErrorInStartMessage,details:t.getText("ERROR_DETAIL_NO_METADATA",[a.serviceUrl])};this.showMessageBox(s);return}},setIdentity:function(e){var a=this.getIdentity();if(a!=e){this.setProperty("identity",e)}},getModel:function(e){return this.modelList[e]},handleRequestSent:function(e){sap.ca.ui.utils.busydialog.requireBusyDialog();this.handleRequestSentInner(e)},handleRequestSentInner:function(e){this.iRequestCount++;jQuery.sap.log.info("Connection Manager","Request sent")},handleRequestFailed:function(e){jQuery.sap.log.error("Connection Manager","Failed to load data");var a=e.getParameter("response"),t={type:sap.ca.ui.message.Type.ERROR,message:e.getParameter("message")||a&&a.message,details:e.getParameter("responseText")||a&&a.responseText};this.showMessageBox(t)},handleRequestCompleted:function(e){sap.ca.ui.utils.busydialog.releaseBusyDialog();this.handleRequestCompletedInner(e)},handleRequestCompletedInner:function(e){if(e.getParameter("success")){jQuery.sap.log.info("Connection Manager","Request succesfully completed")}else{jQuery.sap.log.info("Connection Manager","Request completed with errors",e.getParameter("message"))}},showMessageBox:function(e){if(this.bIsShowingMessage){return}this.bIsShowingMessage=true;if(this.bIsComponentBase){var a=this.getComponent();var t=a._bRouterCloseDialogs;a.setRouterSetCloseDialogs(false)}sap.ca.ui.message.showMessageBox(e,jQuery.proxy(function(){this.bIsShowingMessage=false;if(this.bIsComponentBase){a.setRouterSetCloseDialogs(t)}},this))}});sap.ca.scfld.md.app.ConnectionManager.getNewInstance=function(e,a,t,s){var r=new sap.ca.scfld.md.app.ConnectionManager({identity:e,configuration:a,defaultConfiguration:t,component:s});r.initModels();return r};
//# sourceMappingURL=ConnectionManager.js.map