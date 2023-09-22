// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/Device","sap/ushell/utils","sap/ushell/ApplicationType","sap/m/MessagePopover","sap/ui/core/Component","sap/ui/core/ComponentContainer","sap/ui/core/Control","sap/ui/thirdparty/URI","sap/ushell/EventHub","sap/ui/core/Icon","sap/ushell/System","sap/ushell/User","sap/m/Text","sap/base/util/UriParameters","sap/base/util/deepEqual","sap/base/util/uid","sap/base/security/encodeXML","sap/ushell/utils/testableHelper"],function(D,u,A,M,C,a,b,U,E,I,S,c,T,d,f,g,h,t){"use strict";var p="sap.ushell.components.container.",s=p+"ApplicationContainer",j="sap.ushell.Container.dirtyState.",l,o,H,r,P=false,k=false,m=[],n=0;var q=["sap-ach","sap-fiori-id","sap-hide-intent-link","sap-priority","sap-tag","sap-ui-app-id-hint","sap-ui-debug","sap-ui-fl-control-variant-id","sap-ui-fl-max-layer","sap-ui-tech-hint","sap-ui2-tcode","sap-ui2-wd-app-id","sap-ui2-wd-conf-id","sap-ushell-cdm-site-url","sap-ushell-defaultedParameterNames","sap-ushell-navmode","sap-ushell-next-navmode","sap-ushell-url"];function v(e){var i=sap.ushell.Container.getService("CrossApplicationNavigation");i.isUrlSupported(e.url).done(function(){e.promise.resolve({"allowed":true,"id":e.id});}).fail(function(){e.promise.resolve({"allowed":false,"id":e.id});});}function w(e){var i={"asyncURLHandler":j1.prototype._adaptIsUrlSupportedResultForMessagePopover};if(M&&M.setDefaultHandlers){M.setDefaultHandlers(i);}E.emit("StepDone",e.stepName);}E.once("initMessagePopover").do(w);l=new u.Map();function x(e){return l.get(e.getId());}function y(){return o;}function z(e){var i=new d(e).mParams,k1=i["sap-xapp-state"],l1;delete i["sap-xapp-state"];l1={startupParameters:i};if(k1){l1["sap-xapp-state"]=k1;}return l1;}function B(e,i){if(!r){r=jQuery.sap.resources({url:jQuery.sap.getModulePath(p)+"/resources/resources.properties",language:sap.ui.getCore().getConfiguration().getLanguage()});}return r.getText(e,i);}function F(){return new I({size:"2rem",src:"sap-icon://error",tooltip:j1.prototype._getTranslatedText("an_error_has_occured")});}function G(e){var i=e.getAggregation("child"),k1;if(i instanceof a){k1=i.getComponentInstance().getMetadata().getName().replace(/\.Component$/,"");jQuery.sap.log.debug("unloading component "+k1,null,s);}e.destroyAggregation("child");}function J(e,i,k1){var l1,m1,n1,o1,p1,q1,r1,s1={},t1,u1;n1=i.indexOf("?");if(n1>=0){q1=j1.prototype._getParameterMap(i);s1=q1.startupParameters;i=i.slice(0,n1);}if(i.slice(-1)!=="/"){i+="/";}if(/\.view\.(\w+)$/i.test(k1)){p1=/^SAPUI5=(?:([^/]+)\/)?([^/]+)\.view\.(\w+)$/i.exec(k1);if(!p1){jQuery.sap.log.error("Invalid SAPUI5 URL",k1,s);return j1.prototype._createErrorControl();}r1=p1[1];t1=p1[2];u1=p1[3].toUpperCase();if(r1){t1=r1+"."+t1;}else{o1=t1.lastIndexOf(".");if(o1<1){jQuery.sap.log.error("Missing namespace",k1,s);return j1.prototype._createErrorControl();}r1=t1.slice(0,o1);}}else{r1=k1.replace(/^SAPUI5=/,"");}jQuery.sap.registerModulePath(r1,i+r1.replace(/\./g,"/"));j1.prototype._destroyChild(e);if(t1){if(e.getApplicationConfiguration()){s1.config=e.getApplicationConfiguration();}m1=sap.ui.view({id:e.getId()+"-content",type:u1,viewData:s1||{},viewName:t1});e.fireEvent("applicationConfiguration");}else{jQuery.sap.log.debug("loading component "+r1,null,s);var v1=q1?{startupParameters:q1.startupParameters}:{startupParameters:{}};if(q1&&q1["sap-xapp-state"]){v1["sap-xapp-state"]=q1["sap-xapp-state"];}if(e.getApplicationConfiguration()){v1.config=e.getApplicationConfiguration();}l1=sap.ui.component({id:e.getId()+"-component",componentData:v1,name:r1});e.fireEvent("applicationConfiguration",{"configuration":l1.getMetadata().getConfig()});m1=new a({id:e.getId()+"-content",component:l1});}m1.setWidth(e.getWidth());m1.setHeight(e.getHeight());m1.addStyleClass("sapUShellApplicationContainer");e.setAggregation("child",m1,true);return m1;}function K(e,i){setTimeout(function(){sap.ui.getCore().getEventBus().publish("sap.ushell",e,i);},0);}function L(e,i,k1){var l1,m1,n1,o1,p1={startupParameters:{}},q1,r1=e.getComponentHandle(),s1=sap.ushell.Container.getService("PluginManager"),t1,u1;u.addTime("createUi5Component");l1=i.indexOf("?");if(l1>=0){o1=j1.prototype._getParameterMap(i);p1={startupParameters:o1.startupParameters};if(o1["sap-xapp-state"]){p1["sap-xapp-state"]=o1["sap-xapp-state"];}i=i.slice(0,l1);}if(e.getApplicationConfiguration()){p1.config=e.getApplicationConfiguration();}if(i.slice(-1)!=="/"){i+="/";}j1.prototype._destroyChild(e);q1={id:e.getId()+"-component",name:k1,componentData:p1};jQuery.sap.log.debug("Creating component instance for "+k1,JSON.stringify(q1),s);sap.ui.getCore().getEventBus().publish("sap.ushell.components.container.ApplicationContainer","_prior.newUI5ComponentInstantion",{name:k1});if(r1){m1=r1.getInstance(q1);}else{jQuery.sap.registerModulePath(k1,i);jQuery.sap.log.error("No component handle available for '"+k1+"'; fallback to component.load()",null,s);m1=sap.ui.component({id:e.getId()+"-component",name:k1,componentData:p1});}e.fireEvent("applicationConfiguration",{"configuration":m1.getMetadata().getConfig()});n1=new a({id:e.getId()+"-content",component:m1});n1.setHeight(e.getHeight());n1.setWidth(e.getWidth());n1.addStyleClass("sapUShellApplicationContainer");e._disableRouterEventHandler=j1.prototype._disableRouter.bind(this,m1);sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer","_prior.newUI5ComponentInstantion",e._disableRouterEventHandler);e.setAggregation("child",n1,true);if(s1){t1=s1.getPluginLoadingPromise("RendererExtensions");u1=t1&&t1.state();if(u1==="pending"){t1.done(function(){j1.prototype._publishExternalEvent("appComponentLoaded",{component:m1});}).fail(function(){j1.prototype._publishExternalEvent("appComponentLoaded",{component:m1});});}if(u1==="resolved"||u1==="rejected"){j1.prototype._publishExternalEvent("appComponentLoaded",{component:m1});}}else{j1.prototype._publishExternalEvent("appComponentLoaded",{component:m1});}return n1;}function N(e){var i;if((e instanceof C)&&(typeof e.getRouter==="function")){i=e.getRouter();if(i&&(typeof i.stop==="function")){jQuery.sap.log.info("router stopped for instance "+e.getId());i.stop();}}}function O(e){var i=document.createElement("a"),k1=new d(e).get("sap-client"),l1;i.href=e;l1=i.protocol+"//"+i.host;return new S({alias:k1?l1+"?sap-client="+k1:l1,baseUrl:l1,client:k1||undefined,platform:"abap"});}function Q(e,i){var k1=false,l1=e.getDomRef(),m1,n1;if(e.getIframeWithPost()===true&&l1&&l1.getAttribute&&l1.getAttribute("sap-iframe-app")=="true"){l1=jQuery("#"+l1.getAttribute("id")+"-iframe")[0];}if(l1){m1=U(e._getIFrameUrl(l1)||window.location&&window.location.href||"");n1=m1.protocol()+"://"+m1.host();k1=(i.source===l1.contentWindow)||(i.origin===n1);}return k1;}function R(e,i,k1){var l1=JSON.stringify({type:"request",service:i,request_id:g(),body:{}});jQuery.sap.log.debug("Sending post message request to origin ' "+k1+"': "+l1,null,"sap.ushell.components.container.ApplicationContainer");e.postMessage(l1,k1);}function V(){var i=this.getDomRef();if(!i||i.tagName!=="IFRAME"){if(this.getIframeWithPost()===true&&i&&i.getAttribute&&i.getAttribute("sap-iframe-app")=="true"){return jQuery("#"+i.getAttribute("id")+"-iframe")[0];}return null;}return i;}function W(i){var e;if(i===undefined){i=this._getIFrame();}e=i.src;if(this.getIframeWithPost()===true){e=jQuery("#"+i.getAttribute("id").replace("-iframe","-form"))[0].action;}return e;}function X(e,i){if(e&&!e.getActive()){jQuery.sap.log.debug("Skipping handling of postMessage 'message' event with data '"+JSON.stringify(l1)+"' on inactive container '"+e.getId()+"'","Only active containers can handle 'message' postMessage event","sap.ushell.components.container.ApplicationContainer");return;}var k1=e.getUi5ComponentName&&e.getUi5ComponentName(),l1=i.data;if(typeof k1==="string"){jQuery.sap.log.debug("Skipping handling of postMessage 'message' event with data '"+JSON.stringify(l1)+"' on container of UI5 application '"+k1+"'","Only non UI5 application containers can handle 'message' postMessage event","sap.ushell.components.container.ApplicationContainer");return;}var m1={bApiRegistered:true};H(e,i,m1);Y(e,i,m1);}var X=t.testableStatic(X,"ApplicationContainer_handleMessageEvent");function Y(e,k1,l1){var m1,n1,o1;if(l1.bApiRegistered!==false){return;}if(P===false){P=true;m1=sap.ushell.Container.getService("PluginManager");if(m1){n1=m1.getPluginLoadingPromise("RendererExtensions");o1=n1&&n1.state();if(o1==="pending"){k=true;n1.done(function(){var p1;k=false;jQuery.sap.log.debug("Processing post messages queue after 'RendererExtensions' plugins loaded, queue size is: "+m.length,null,"sap.ushell.components.container.ApplicationContainer");for(var i=0;i<m.length;i++){p1=m[i];try{X.call(p1.that,p1.oContainer,p1.oMessage);}catch(ex){jQuery.sap.log.error(ex.message||ex,null,"sap.ushell.components.container.ApplicationContainer");}}m=[];});}}}if(k===true){m.push({index:n++,that:this,oContainer:e,oMessage:k1});}}var Y=t.testableStatic(Y,"ApplicationContainer_handlePostMessagesForPluginsPostLoading");function Z(){P=false;k=false;m=[];n=0;}var Z=t.testableStatic(Z,"ApplicationContainer_resetPluginsLoadIndications");function $(e,i){var k1=e._getIFrame(),l1=e.getApplicationType();if(u.isApplicationTypeEmbeddedInIframe(e.getApplicationType(l1))&&k1){var m1=new U(e._getIFrameUrl(k1));var n1=m1.protocol()+"://"+m1.host();k1.contentWindow.postMessage(JSON.stringify({action:"pro54_disableDirtyHandler"}),n1);i.preventDefault();}}function _(e,i,k1){e.write("<div").writeControlData(i).writeAccessibilityState(i).addClass("sapUShellApplicationContainer").writeClasses(i).addStyle("height",i.getHeight()).addStyle("width",i.getWidth()).writeStyles().write(">").renderControl(k1);e.write("</div>");}function a1(e,i,k1,l1){var m1,n1=function(){var u1=u.getParameterValueBoolean("sap-accessibility");if(u1!==undefined){return u1;}return sap.ushell.Container.getUser().getAccessibilityMode();},o1=function(){var u1=new d(e)||{mParams:{}};if(u1.mParams["sap-theme"]===undefined){return sap.ushell.Container.getUser().getTheme(c.prototype.constants.themeFormat.NWBC);}return undefined;},p1=function(){var u1=false,v1=new d(e)||{mParams:{}};u1=sap.ui.getCore().getConfiguration().getStatistics()&&v1.mParams["sap-statistics"]===undefined;return u1;},q1=function(){var u1=window.hasher&&window.hasher.getHash(),s1="",v1;if(u1&&u1.length>0&&u1.indexOf("sap-iapp-state=")>0){v1=/(?:sap-iapp-state=)([^&/]+)/.exec(u1);if(v1&&v1.length===2){s1=v1[1];}}return s1;},r1=function(){var u1="";var v1=(!!jQuery("body.sapUiSizeCompact").length);var w1=(!!jQuery("body.sapUiSizeCozy").length);if(v1===true){u1="0";}else if(w1){u1="1";}return u1;};e+=e.indexOf("?")>=0?"&":"?";e+="sap-ie=edge";m1=o1();if(m1){e+=e.indexOf("?")>=0?"&":"?";e+="sap-theme="+encodeURIComponent(m1);}if(k1){e+=e.indexOf("?")>=0?"&":"?";e+="sap-target-navmode="+encodeURIComponent(k1);}if(n1()){e+=e.indexOf("?")>=0?"&":"?";e+="sap-accessibility=X";}if(p1()){e+=e.indexOf("?")>=0?"&":"?";e+="sap-statistics=true";}if(l1){e+=e.indexOf("?")>=0?"&":"?";e+="sap-keepclientsession=1";}var s1=q1();if(s1&&s1.length>0){e+=e.indexOf("?")>=0?"&":"?";e+="sap-iapp-state="+s1;}var t1=r1();if(t1&&t1.length>0){e+=e.indexOf("?")>=0?"&":"?";e+="sap-touch="+t1;}return u.appendSapShellParam(e,i);}function b1(e,i,k1,l1){var m1=i.getAggregation("child");if(!m1||i._bRecreateChild){m1=j1.prototype._createUi5Component(i,k1,l1);i._bRecreateChild=false;}j1.prototype._renderControlInDiv(e,i,m1);}function c1(e,i,k1){var l1=e.getProperty(i);if(f(l1,k1)){return;}e.setProperty(i,k1);e._bRecreateChild=true;}function d1(e,i,k1,l1,m1){var n1;localStorage.removeItem(i.globalDirtyStorageKey);if(m1&&m1.indexOf("SAPUI5.Component=")===0&&k1===A.URL.type){b1(e,i,l1,m1.replace(/^SAPUI5\.Component=/,""));return;}if(m1&&m1.indexOf("SAPUI5=")===0&&k1===A.URL.type){j1.prototype._renderControlInDiv(e,i,j1.prototype._createUi5View(i,l1,m1));return;}jQuery.sap.log.debug("Not resolved as \"SAPUI5.Component=\" or \"SAPUI5=\" , "+"will attempt to load into iframe "+m1);if(!i.getActive()){jQuery.sap.log.debug("Skipping rendering container iframe","Container '"+i.getId()+"' is inactive");return;}try{l1=i.getFrameSource(k1,l1,m1);}catch(ex){jQuery.sap.log.error(ex.message||ex,null,s);i.fireEvent("applicationConfiguration");e.renderControl(j1.prototype._createErrorControl());return;}if(sap.ushell.Container){n1=j1.prototype._getLogoutHandler(i);if(!n1){if(u.isApplicationTypeEmbeddedInIframe(k1)){n1=j1.prototype._logout.bind(null,i);l.put(i.getId(),n1);sap.ushell.Container.attachLogoutEvent(n1);sap.ushell.Container.addRemoteSystem(j1.prototype._createSystemForUrl(l1));}}else if(!u.isApplicationTypeEmbeddedInIframe(k1)){sap.ushell.Container.detachLogoutEvent(n1);l.remove(i.getId());}}if(u.isApplicationTypeEmbeddedInIframe(k1)){var p1=i.getTargetNavigationMode();l1=j1.prototype._adjustNwbcUrl(l1,k1,p1,i.getIsStateful());u.localStorageSetItem(i.globalDirtyStorageKey,sap.ushell.Container.DirtyState.INITIAL);}l1=this._adjustURLForIsolationOpeningWithoutURLTemplate(l1);if(i.getIframeWithPost()===true&&u.isApplicationTypeEmbeddedInIframe(k1)){i.oDeferredRenderer=new jQuery.Deferred();l1=j1.prototype._filterURLParams(l1);var q1=[];var r1=j1.prototype._getParamKeys(l1,q1);j1.prototype._generateRootElementForIFrame(e,i,true);if(r1.length>0){var s1=sap.ushell.Container.getService("CrossApplicationNavigation");s1.getAppStateData(r1).then(function(o1){var t1;var u1=jQuery("#"+i.getId());if(u1){t1=sap.ui.getCore().createRenderManager();j1.prototype._buildHTMLElements(t1,i,o1,q1,l1,true);t1.flush(u1[0]);t1.destroy();i.oDeferredRenderer.resolve();}},function(o1){j1.prototype._buildHTMLElements(e,i,undefined,q1,l1,true);i.oDeferredRenderer.resolve();});}else{j1.prototype._buildHTMLElements(e,i,undefined,q1,l1,false);i.oDeferredRenderer.resolve();}j1.prototype._generateRootElementForIFrame(e,i,false);return;}i.fireEvent("applicationConfiguration");e.write("<iframe").writeControlData(i).writeAccessibilityState(i).writeAttributeEscaped("src",l1).addClass("sapUShellApplicationContainer").writeClasses(i).addStyle("height",i.getHeight()).addStyle("width",i.getWidth()).writeStyles().write("></iframe>");}function e1(e){var i=new U();if(i.query(true).hasOwnProperty("sap-isolation-enabled")){var k1=sap.ushell.Container.getService("URLParsing"),l1=k1.getHash(i.toString()),m1="&sap-plugins="+encodeURIComponent(sap.ushell.Container.getService("PluginManager")._getNamesOfPluginsWithAgents());if(m1==="&sap-plugins="){m1="";}if(l1){var n1=k1.parseShellHash("#"+l1),o1=k1.paramsToString(n1.params);if(o1&&o1.length>=0){var p1=sap.ushell.Container.getService("AppState").createEmptyAppState(),q1=sap.ushell.Container.getService("AppState").createEmptyAppState(),r1="";if(o1.indexOf("sap-intent-param")>=0){r1=encodeURIComponent(o1);}else{p1.setData(o1);p1.save();r1=encodeURIComponent("sap-intent-param="+p1.getKey());}q1.setData("sap-startup-params="+r1);q1.save();e=e.split("#")[0]+"&sap-intent-param="+q1.getKey()+m1+"#"+window.hasher.getHash();}else{e=e.split("#")[0]+m1+"#"+window.hasher.getHash();}}else{e+="#"+window.hasher.getHash();}}return e;}function f1(e){var i=new U(e);i=i.removeSearch(q);return i.toString();}function g1(e,i){var k1=[],l1;if(e.indexOf("sap-intent-param=")>0){l1=/(?:sap-intent-param=)([^&/]+)/.exec(e);if(l1&&l1.length===2){k1.push([l1[1]]);i.push("sap-intent-param-data");}}if(e.indexOf("sap-xapp-state=")>0){l1=/(?:sap-xapp-state=)([^&/]+)/.exec(e);if(l1&&l1.length===2){k1.push([l1[1]]);i.push("sap-xapp-state-data");}}if(e.indexOf("sap-iapp-state=")>0){l1=/(?:sap-iapp-state=)([^&/]+)/.exec(e);if(l1&&l1.length===2){k1.push([l1[1]]);i.push("sap-iapp-state-data");}}return k1;}function h1(e,i,k1,l1,m1,n1){var o1=i.getId()+"-form",p1="",q1=false;if(k1===undefined){k1=[];}k1.push([sap.ushell.Container.getFLPUrl(true)]);l1.push("sap-flp-url");var r1="";var s1={};l1.forEach(function(u1,v1){if(k1[v1][0]){s1[u1]=k1[v1][0];}});r1=JSON.stringify(s1);p1="<input name=\"sap-flp-params\" value=\""+h(r1)+"\"/>";i.fireEvent("applicationConfiguration");e.write("<form").writeAttributeEscaped("method","post").writeAttributeEscaped("id",o1).writeAttributeEscaped("name",o1).writeAttributeEscaped("target",i.getId()+"-iframe").writeAttributeEscaped("action",m1).addStyle("display","none").writeStyles().write(">").writeAttributeEscaped(p1).write("</form>");var t1=i.sId;if(!n1&&i.hasStyleClass("hidden")){q1=true;i.toggleStyleClass("hidden",false);}i.sId+="-iframe";e.write("<iframe").writeAttributeEscaped("name",i.getId()).writeControlData(i).writeAccessibilityState(i).writeAttributeEscaped("sap-orig-src",m1).addClass("sapUShellApplicationContainer").writeClasses(i).addStyle("height",i.getHeight()).addStyle("width",i.getWidth()).writeStyles().write("></iframe>");i.sId=t1;if(q1){i.toggleStyleClass("hidden",true);}}function i1(e,i,k1){if(k1){e.write("<div").writeControlData(i).writeAttributeEscaped("sap-iframe-app","true").addClass("sapUShellApplicationContainer").writeClasses(i).addStyle("height",i.getHeight()).addStyle("width",i.getWidth()).writeStyles().write(">");}else{e.write("</div>");}}var j1=b.extend(s,{metadata:{properties:{additionalInformation:{defaultValue:"",type:"string"},application:{type:"object"},applicationConfiguration:{type:"object"},applicationType:{defaultValue:"URL",type:p+"ApplicationType"},height:{defaultValue:"100%",type:"sap.ui.core.CSSSize"},navigationMode:{defaultValue:"",type:"string"},targetNavigationMode:{defaultValue:"",type:"string"},text:{defaultValue:"",type:"string"},url:{defaultValue:"",type:"string"},visible:{defaultValue:true,type:"boolean"},active:{defaultValue:true,type:"boolean"},"sap-system":{type:"string"},applicationDependencies:{type:"object"},componentHandle:{type:"object"},ui5ComponentName:{type:"string"},width:{defaultValue:"100%",type:"sap.ui.core.CSSSize"},shellUIService:{type:"object"},appIsolationService:{type:"object"},reservedParameters:{type:"object"},coreResourcesFullyLoaded:{type:"boolean"},isStateful:{defaultValue:false,type:"boolean"},iframeHandlers:{defaultValue:"",type:"string"},iframeWithPost:{defaultValue:false,type:"boolean"},beforeAppCloseEvent:{type:"object"}},events:{"applicationConfiguration":{}},aggregations:{child:{multiple:false,type:"sap.ui.core.Control",visibility:"hidden"}},library:"sap.ushell",designtime:"sap/ushell/designtime/ApplicationContainer.designtime"},exit:function(){var e,i=this;if(sap.ushell.Container){e=j1.prototype._getLogoutHandler(i);if(e){sap.ushell.Container.detachLogoutEvent(e);l.remove(i.getId());}}localStorage.removeItem(i.globalDirtyStorageKey);if(i._unloadEventListener){removeEventListener("unload",i._unloadEventListener);}if(i._disableRouterEventHandler){sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer","_prior.newUI5ComponentInstantion",i._disableRouterEventHandler);}if(i._storageEventListener){removeEventListener("storage",i._storageEventListener);}if(i._messageEventListener){removeEventListener("message",i._messageEventListener);}j1.prototype._destroyChild(i);if(b.exit){b.exit.apply(i);}},setHandleMessageEvent:function(i){H=i;},init:function(){var e=this;e.globalDirtyStorageKey=j+g();if(new d(window.location.href).get("sap-post")==="true"){e.setIframeWithPost(true);}e._unloadEventListener=e.exit.bind(e);addEventListener("unload",e._unloadEventListener);e._storageEventListener=function(i){var k1=e.getApplicationType();if(i.key===e.globalDirtyStorageKey&&i.newValue===sap.ushell.Container.DirtyState.PENDING&&u.isApplicationTypeEmbeddedInIframe(k1)){var l1=e._getIFrame();if(l1){jQuery.sap.log.debug("getGlobalDirty() send pro54_getGlobalDirty ",null,"sap.ushell.components.container.ApplicationContainer");var m1=new U(e._getIFrameUrl(l1));var n1=m1.protocol()+"://"+m1.host();l1.contentWindow.postMessage(JSON.stringify({action:"pro54_getGlobalDirty"}),n1);}}};addEventListener("storage",e._storageEventListener);e._messageEventListener=j1.prototype._handleMessageEvent.bind(null,e);addEventListener("message",e._messageEventListener);},onAfterRendering:function(){var e=this;this.rerender=function(){};if(D.os.ios&&this.$().prop("tagName")==="IFRAME"){this.$().parent().css("overflow","auto");}if(this.oDeferredRenderer){this.oDeferredRenderer.done(function(){var i=document.getElementById(e.getId()+"-form");if(i){i.submit();}});}},renderer:function(e,i){var k1=i.getApplication(),l1=i.launchpadData,m1;if(!i.getVisible()){j1.prototype._renderControlInDiv(e,i);return;}if(i.error){delete i.error;j1.prototype._renderControlInDiv(e,i,j1.prototype._createErrorControl());}else if(!k1){j1.prototype._render(e,i,i.getApplicationType(),i.getUrl(),i.getAdditionalInformation());}else if(!k1.isResolvable()){j1.prototype._render(e,i,k1.getType(),k1.getUrl(),"");}else if(l1){j1.prototype._render(e,i,l1.applicationType,l1.Absolute.url.replace(/\?$/,""),l1.applicationData);}else{jQuery.sap.log.debug("Resolving "+k1.getUrl(),null,s);k1.resolve(function(n1){jQuery.sap.log.debug("Resolved "+k1.getUrl(),JSON.stringify(n1),s);i.launchpadData=n1;j1.prototype._destroyChild(i);},function(n1){var o1=k1.getMenu().getDefaultErrorHandler();if(o1){o1(n1);}j1.prototype._destroyChild(i);i.error=n1;});m1=new T({text:j1.prototype._getTranslatedText("loading",[k1.getText()])});j1.prototype._destroyChild(i);i.setAggregation("child",m1);j1.prototype._renderControlInDiv(e,i,m1);}}});j1.prototype.getFrameSource=function(e,i){if(!Object.prototype.hasOwnProperty.call(A.enum,e)){throw new Error("Illegal application type: "+e);}return i;};j1.prototype.setUrl=function(e){c1(this,"url",e);};j1.prototype.setAdditionalInformation=function(e){c1(this,"additionalInformation",e);};j1.prototype.setApplicationType=function(e){c1(this,"applicationType",e);};j1.prototype.createPostMessageRequest=function(e,i){var k1=Date.now().toString();return{"type":"request","request_id":k1,"service":e,"body":i};};j1.prototype.setNewTRApplicationContext=function(e){var i=this._getIFrame();if(!i){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}e=u.appendSapShellParam(e);var k1=this.createPostMessageRequest("sap.its.startService",{"url":e});return this.postMessageToIframe(k1,i,true).catch(function(l1){return Promise.reject({eventData:l1,message:"Failed to change application context."});});};j1.prototype.postMessageToIframe=function(i,k1,l1){var m1=this;var n1=i.request_id;return new Promise(function(o1,p1){function q1(u1){var v1;try{v1=JSON.parse(u1.data,m1);if(n1!==v1.request_id){return;}if(v1.status==="success"){o1(v1);}else{p1(v1);}window.removeEventListener("message",q1);}catch(e){o1();jQuery.sap.log.warning("Obtained bad response from framework in response to message "+i.request_id);jQuery.sap.log.debug("Underlying framework returned invalid response data: '"+u1.data+"'");}}var r1=JSON.stringify(i);jQuery.sap.log.debug("Sending postMessage "+r1+" to application container '"+m1.getId()+"'");var s1=new U(m1._getIFrameUrl(k1));var t1=s1.protocol()+"://"+s1.host();if(l1){window.addEventListener("message",q1,false);k1.contentWindow.postMessage(r1,t1);}else{k1.contentWindow.postMessage(r1,t1);o1();}});};j1.prototype.postMessageToCurrentIframe=function(e,i){if(i===undefined){i=false;}var k1=this._getIFrame();if(!k1){if(i){return Promise.reject({message:"Expected opened iframe not found."});}return;}return this.postMessageToIframe(e,k1,i);};j1.prototype.setNewApplicationContext=function(e,i){var k1=this;var l1=this["setNew"+e+"ApplicationContext"];if(!l1){return Promise.reject({message:"Unsupported application type"});}var m1=this._getIFrame();if(!m1){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}var n1=this.createPostMessageRequest("sap.gui.triggerCloseSessionImmediately",{});return this.postMessageToIframe(n1,m1,true).then(function(){return l1.call(k1,i);},function(o1){return Promise.reject({eventData:o1,message:"Failed to change application context."});});};j1.prototype.onApplicationOpened=function(e){var i=this.getIsStateful();if(!i){return Promise.resolve();}var k1=this.getApplicationType();if(k1==="TR"&&e!=="TR"){var l1=this._getIFrame();if(!l1){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}var m1=this.createPostMessageRequest("sap.gui.triggerCloseSession",{});return this.postMessageToIframe(m1,l1,false).catch(function(n1){return Promise.reject({eventData:n1,message:"Failed to change application context."});});}return Promise.resolve();};j1.prototype.postMessageRequest=function(e,i){var k1=this._getIFrame();if(!k1){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}var l1=this.createPostMessageRequest(e,i||{});return this.postMessageToIframe(l1,k1,false).catch(function(m1){return Promise.reject({eventData:m1,message:"Failed to post message."});});};j1.prototype.sendBeforeAppCloseEvent=function(){var e=this.getBeforeAppCloseEvent&&this.getBeforeAppCloseEvent(),i;if(e&&e.enabled&&e.enabled===true){i=this.createPostMessageRequest("sap.ushell.services.CrossApplicationNavigation.beforeAppCloseEvent",e.params);return this.postMessageToIframe(i,this._getIFrame(),true);}else{return undefined;}};j1.prototype._getCommunicationHandlers=y;j1.prototype._adaptIsUrlSupportedResultForMessagePopover=v;j1.prototype._getLogoutHandler=x;j1.prototype._getParameterMap=z;j1.prototype._getTranslatedText=B;j1.prototype._createErrorControl=F;j1.prototype._destroyChild=G;j1.prototype._createUi5View=J;j1.prototype._publishExternalEvent=K;j1.prototype._createUi5Component=L;j1.prototype._disableRouter=N;j1.prototype._createSystemForUrl=O;j1.prototype._isTrustedPostMessageSource=Q;j1.prototype._handleMessageEvent=X;j1.prototype._logout=$;j1.prototype._renderControlInDiv=_;j1.prototype._adjustNwbcUrl=a1;j1.prototype._render=d1;j1.prototype._getParamKeys=g1;j1.prototype._buildHTMLElements=h1;j1.prototype._generateRootElementForIFrame=i1;j1.prototype._backButtonPressedCallback=R;j1.prototype._getIFrame=V;j1.prototype._getIFrameUrl=W;j1.prototype._filterURLParams=f1;j1.prototype._adjustURLForIsolationOpeningWithoutURLTemplate=e1;return j1;},true);