// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/Device","sap/ushell/utils","sap/ushell/ApplicationType","sap/m/MessagePopover","sap/ui/core/Component","sap/ui/core/ComponentContainer","sap/ui/core/Control","sap/ui/thirdparty/URI","sap/ushell/EventHub","sap/ui/core/Icon","sap/ushell/System","sap/ushell/User","sap/m/Text","sap/base/util/UriParameters","sap/base/util/deepEqual","sap/base/util/uid","sap/base/security/encodeXML"],function(D,u,A,M,C,a,b,U,E,I,S,c,T,d,f,g,h){"use strict";var p="sap.ushell.components.container.",s=p+"ApplicationContainer",i="sap.ushell.Container.dirtyState.",l,o,H,r;var j=["sap-ach","sap-fiori-id","sap-hide-intent-link","sap-priority","sap-tag","sap-ui-app-id-hint","sap-ui-debug","sap-ui-fl-control-variant-id","sap-ui-fl-max-layer","sap-ui-tech-hint","sap-ui2-tcode","sap-ui2-wd-app-id","sap-ui2-wd-conf-id","sap-ushell-cdm-site-url","sap-ushell-defaultedParameterNames","sap-ushell-navmode","sap-ushell-next-navmode","sap-ushell-url"];function k(e){var c1=sap.ushell.Container.getService("CrossApplicationNavigation");c1.isUrlSupported(e.url).done(function(){e.promise.resolve({"allowed":true,"id":e.id});}).fail(function(){e.promise.resolve({"allowed":false,"id":e.id});});}function m(e){var c1={"asyncURLHandler":b1.prototype._adaptIsUrlSupportedResultForMessagePopover};if(M&&M.setDefaultHandlers){M.setDefaultHandlers(c1);}E.emit("StepDone",e.stepName);}E.once("initMessagePopover").do(m);l=new u.Map();function n(e){return l.get(e.getId());}function q(){return o;}function t(e){var c1=new d(e).mParams,d1=c1["sap-xapp-state"],e1;delete c1["sap-xapp-state"];e1={startupParameters:c1};if(d1){e1["sap-xapp-state"]=d1;}return e1;}function v(e,c1){if(!r){r=jQuery.sap.resources({url:jQuery.sap.getModulePath(p)+"/resources/resources.properties",language:sap.ui.getCore().getConfiguration().getLanguage()});}return r.getText(e,c1);}function w(){return new I({size:"2rem",src:"sap-icon://error",tooltip:b1.prototype._getTranslatedText("an_error_has_occured")});}function x(e){var c1=e.getAggregation("child"),d1;if(c1 instanceof a){d1=c1.getComponentInstance().getMetadata().getName().replace(/\.Component$/,"");jQuery.sap.log.debug("unloading component "+d1,null,s);}e.destroyAggregation("child");}function y(e,c1,d1){var e1,f1,g1,h1,i1,j1,k1,l1={},m1,n1;g1=c1.indexOf("?");if(g1>=0){j1=b1.prototype._getParameterMap(c1);l1=j1.startupParameters;c1=c1.slice(0,g1);}if(c1.slice(-1)!=="/"){c1+="/";}if(/\.view\.(\w+)$/i.test(d1)){i1=/^SAPUI5=(?:([^/]+)\/)?([^/]+)\.view\.(\w+)$/i.exec(d1);if(!i1){jQuery.sap.log.error("Invalid SAPUI5 URL",d1,s);return b1.prototype._createErrorControl();}k1=i1[1];m1=i1[2];n1=i1[3].toUpperCase();if(k1){m1=k1+"."+m1;}else{h1=m1.lastIndexOf(".");if(h1<1){jQuery.sap.log.error("Missing namespace",d1,s);return b1.prototype._createErrorControl();}k1=m1.slice(0,h1);}}else{k1=d1.replace(/^SAPUI5=/,"");}jQuery.sap.registerModulePath(k1,c1+k1.replace(/\./g,"/"));b1.prototype._destroyChild(e);if(m1){if(e.getApplicationConfiguration()){l1.config=e.getApplicationConfiguration();}f1=sap.ui.view({id:e.getId()+"-content",type:n1,viewData:l1||{},viewName:m1});e.fireEvent("applicationConfiguration");}else{jQuery.sap.log.debug("loading component "+k1,null,s);var o1=j1?{startupParameters:j1.startupParameters}:{startupParameters:{}};if(j1&&j1["sap-xapp-state"]){o1["sap-xapp-state"]=j1["sap-xapp-state"];}if(e.getApplicationConfiguration()){o1.config=e.getApplicationConfiguration();}e1=sap.ui.component({id:e.getId()+"-component",componentData:o1,name:k1});e.fireEvent("applicationConfiguration",{"configuration":e1.getMetadata().getConfig()});f1=new a({id:e.getId()+"-content",component:e1});}f1.setWidth(e.getWidth());f1.setHeight(e.getHeight());f1.addStyleClass("sapUShellApplicationContainer");e.setAggregation("child",f1,true);return f1;}function z(e,c1){setTimeout(function(){sap.ui.getCore().getEventBus().publish("sap.ushell",e,c1);},0);}function B(e,c1,d1){var e1,f1,g1,h1,i1={startupParameters:{}},j1,k1=e.getComponentHandle(),l1=sap.ushell.Container.getService("PluginManager"),m1,n1;u.addTime("createUi5Component");e1=c1.indexOf("?");if(e1>=0){h1=b1.prototype._getParameterMap(c1);i1={startupParameters:h1.startupParameters};if(h1["sap-xapp-state"]){i1["sap-xapp-state"]=h1["sap-xapp-state"];}c1=c1.slice(0,e1);}if(e.getApplicationConfiguration()){i1.config=e.getApplicationConfiguration();}if(c1.slice(-1)!=="/"){c1+="/";}b1.prototype._destroyChild(e);j1={id:e.getId()+"-component",name:d1,componentData:i1};jQuery.sap.log.debug("Creating component instance for "+d1,JSON.stringify(j1),s);sap.ui.getCore().getEventBus().publish("sap.ushell.components.container.ApplicationContainer","_prior.newUI5ComponentInstantion",{name:d1});if(k1){f1=k1.getInstance(j1);}else{jQuery.sap.registerModulePath(d1,c1);jQuery.sap.log.error("No component handle available for '"+d1+"'; fallback to component.load()",null,s);f1=sap.ui.component({id:e.getId()+"-component",name:d1,componentData:i1});}e.fireEvent("applicationConfiguration",{"configuration":f1.getMetadata().getConfig()});g1=new a({id:e.getId()+"-content",component:f1});g1.setHeight(e.getHeight());g1.setWidth(e.getWidth());g1.addStyleClass("sapUShellApplicationContainer");e._disableRouterEventHandler=b1.prototype._disableRouter.bind(this,f1);sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer","_prior.newUI5ComponentInstantion",e._disableRouterEventHandler);e.setAggregation("child",g1,true);if(l1){m1=l1.getPluginLoadingPromise("RendererExtensions");n1=m1&&m1.state();if(n1==="pending"){m1.done(function(){b1.prototype._publishExternalEvent("appComponentLoaded",{component:f1});}).fail(function(){b1.prototype._publishExternalEvent("appComponentLoaded",{component:f1});});}if(n1==="resolved"||n1==="rejected"){b1.prototype._publishExternalEvent("appComponentLoaded",{component:f1});}}else{b1.prototype._publishExternalEvent("appComponentLoaded",{component:f1});}return g1;}function F(e){var rt;if((e instanceof C)&&(typeof e.getRouter==="function")){rt=e.getRouter();if(rt&&(typeof rt.stop==="function")){jQuery.sap.log.info("router stopped for instance "+e.getId());rt.stop();}}}function G(e){var c1=document.createElement("a"),d1=new d(e).get("sap-client"),e1;c1.href=e;e1=c1.protocol+"//"+c1.host;return new S({alias:d1?e1+"?sap-client="+d1:e1,baseUrl:e1,client:d1||undefined,platform:"abap"});}function J(e,c1){var d1=false,e1=e.getDomRef(),f1,g1;if(e.getIframeWithPost()===true&&e1&&e1.getAttribute&&e1.getAttribute("sap-iframe-app")=="true"){e1=jQuery("#"+e1.getAttribute("id")+"-iframe")[0];}if(e1){f1=U(e._getIFrameUrl(e1)||window.location&&window.location.href||"");g1=f1.protocol()+"://"+f1.host();d1=(c1.source===e1.contentWindow)||(c1.origin===g1);}return d1;}function K(e,c1,d1){var e1=JSON.stringify({type:"request",service:c1,request_id:g(),body:{}});jQuery.sap.log.debug("Sending post message request to origin ' "+d1+"': "+e1,null,"sap.ushell.components.container.ApplicationContainer");e.postMessage(e1,d1);}function L(){var e=this.getDomRef();if(!e||e.tagName!=="IFRAME"){if(this.getIframeWithPost()===true&&e&&e.getAttribute&&e.getAttribute("sap-iframe-app")=="true"){return jQuery("#"+e.getAttribute("id")+"-iframe")[0];}return null;}return e;}function N(e){var c1;if(e===undefined){e=this._getIFrame();}c1=e.src;if(this.getIframeWithPost()===true){c1=jQuery("#"+e.getAttribute("id").replace("-iframe","-form"))[0].action;}return c1;}function O(e,c1){var d1=e.getUi5ComponentName&&e.getUi5ComponentName(),e1=c1.data;if(typeof d1==="string"){jQuery.sap.log.debug("Skipping handling of postMessage 'message' event with data '"+JSON.stringify(e1)+"' on container of UI5 application '"+d1+"'","Only non UI5 application containers can handle 'message' postMessage event","sap.ushell.components.container.ApplicationContainer");return;}if(!e.getActive()){jQuery.sap.log.debug("Skipping handling of postMessage 'message' event with data '"+JSON.stringify(e1)+"' on inactive container '"+e.getId()+"'","Only active containers can handle 'message' postMessage event","sap.ushell.components.container.ApplicationContainer");return;}H(e,c1);}function P(e,c1){var d1=e._getIFrame(),e1=e.getApplicationType();if(u.isApplicationTypeEmbeddedInIframe(e.getApplicationType(e1))&&d1){var f1=new U(e._getIFrameUrl(d1));var g1=f1.protocol()+"://"+f1.host();d1.contentWindow.postMessage(JSON.stringify({action:"pro54_disableDirtyHandler"}),g1);c1.preventDefault();}}function Q(e,c1,d1){e.write("<div").writeControlData(c1).writeAccessibilityState(c1).addClass("sapUShellApplicationContainer").writeClasses(c1).addStyle("height",c1.getHeight()).addStyle("width",c1.getWidth()).writeStyles().write(">").renderControl(d1);e.write("</div>");}function R(e,c1,d1,e1){var f1,g1=function(){var n1=u.getParameterValueBoolean("sap-accessibility");if(n1!==undefined){return n1;}return sap.ushell.Container.getUser().getAccessibilityMode();},h1=function(){var n1=new d(e)||{mParams:{}};if(n1.mParams["sap-theme"]===undefined){return sap.ushell.Container.getUser().getTheme(c.prototype.constants.themeFormat.NWBC);}return undefined;},i1=function(){var n1=false,o1=new d(e)||{mParams:{}};n1=sap.ui.getCore().getConfiguration().getStatistics()&&o1.mParams["sap-statistics"]===undefined;return n1;},j1=function(){var n1=window.hasher&&window.hasher.getHash(),l1="",o1;if(n1&&n1.length>0&&n1.indexOf("sap-iapp-state=")>0){o1=/(?:sap-iapp-state=)([^&/]+)/.exec(n1);if(o1&&o1.length===2){l1=o1[1];}}return l1;},k1=function(){var n1="";var o1=(!!jQuery("body.sapUiSizeCompact").length);var p1=(!!jQuery("body.sapUiSizeCozy").length);if(o1===true){n1="0";}else if(p1){n1="1";}return n1;};e+=e.indexOf("?")>=0?"&":"?";e+="sap-ie=edge";f1=h1();if(f1){e+=e.indexOf("?")>=0?"&":"?";e+="sap-theme="+encodeURIComponent(f1);}if(d1){e+=e.indexOf("?")>=0?"&":"?";e+="sap-target-navmode="+encodeURIComponent(d1);}if(g1()){e+=e.indexOf("?")>=0?"&":"?";e+="sap-accessibility=X";}if(i1()){e+=e.indexOf("?")>=0?"&":"?";e+="sap-statistics=true";}if(e1){e+=e.indexOf("?")>=0?"&":"?";e+="sap-keepclientsession=1";}var l1=j1();if(l1&&l1.length>0){e+=e.indexOf("?")>=0?"&":"?";e+="sap-iapp-state="+l1;}var m1=k1();if(m1&&m1.length>0){e+=e.indexOf("?")>=0?"&":"?";e+="sap-touch="+m1;}return u.appendSapShellParam(e,c1);}function V(e,c1,d1,e1){var f1=c1.getAggregation("child");if(!f1||c1._bRecreateChild){f1=b1.prototype._createUi5Component(c1,d1,e1);c1._bRecreateChild=false;}b1.prototype._renderControlInDiv(e,c1,f1);}function W(e,c1,d1){var e1=e.getProperty(c1);if(f(e1,d1)){return;}e.setProperty(c1,d1);e._bRecreateChild=true;}function X(e,c1,d1,e1,f1){var g1;localStorage.removeItem(c1.globalDirtyStorageKey);if(f1&&f1.indexOf("SAPUI5.Component=")===0&&d1===A.URL.type){V(e,c1,e1,f1.replace(/^SAPUI5\.Component=/,""));return;}if(f1&&f1.indexOf("SAPUI5=")===0&&d1===A.URL.type){b1.prototype._renderControlInDiv(e,c1,b1.prototype._createUi5View(c1,e1,f1));return;}jQuery.sap.log.debug("Not resolved as \"SAPUI5.Component=\" or \"SAPUI5=\" , "+"will attempt to load into iframe "+f1);if(!c1.getActive()){jQuery.sap.log.debug("Skipping rendering container iframe","Container '"+c1.getId()+"' is inactive");return;}try{e1=c1.getFrameSource(d1,e1,f1);}catch(ex){jQuery.sap.log.error(ex.message||ex,null,s);c1.fireEvent("applicationConfiguration");e.renderControl(b1.prototype._createErrorControl());return;}if(sap.ushell.Container){g1=b1.prototype._getLogoutHandler(c1);if(!g1){if(u.isApplicationTypeEmbeddedInIframe(d1)){g1=b1.prototype._logout.bind(null,c1);l.put(c1.getId(),g1);sap.ushell.Container.attachLogoutEvent(g1);sap.ushell.Container.addRemoteSystem(b1.prototype._createSystemForUrl(e1));}}else if(!u.isApplicationTypeEmbeddedInIframe(d1)){sap.ushell.Container.detachLogoutEvent(g1);l.remove(c1.getId());}}if(u.isApplicationTypeEmbeddedInIframe(d1)){var i1=c1.getTargetNavigationMode();e1=b1.prototype._adjustNwbcUrl(e1,d1,i1,c1.getIsStateful());u.localStorageSetItem(c1.globalDirtyStorageKey,sap.ushell.Container.DirtyState.INITIAL);}e1=Y(e1);if(c1.getIframeWithPost()===true&&u.isApplicationTypeEmbeddedInIframe(d1)){c1.oDeferredRenderer=new jQuery.Deferred();e1=b1.prototype._filterURLParams(e1);var j1=[];var k1=b1.prototype._getParamKeys(e1,j1);b1.prototype._generateRootElementForIFrame(e,c1,true);if(k1.length>0){var l1=sap.ushell.Container.getService("CrossApplicationNavigation");l1.getAppStateData(k1).then(function(h1){var m1;var n1=jQuery("#"+c1.getId());if(n1){m1=sap.ui.getCore().createRenderManager();b1.prototype._buildHTMLElements(m1,c1,h1,j1,e1,true);m1.flush(n1[0]);m1.destroy();c1.oDeferredRenderer.resolve();}},function(h1){b1.prototype._buildHTMLElements(e,c1,undefined,j1,e1,true);c1.oDeferredRenderer.resolve();});}else{b1.prototype._buildHTMLElements(e,c1,undefined,j1,e1,false);c1.oDeferredRenderer.resolve();}b1.prototype._generateRootElementForIFrame(e,c1,false);return;}c1.fireEvent("applicationConfiguration");e.write("<iframe").writeControlData(c1).writeAccessibilityState(c1).writeAttributeEscaped("src",e1).addClass("sapUShellApplicationContainer").writeClasses(c1).addStyle("height",c1.getHeight()).addStyle("width",c1.getWidth()).writeStyles().write("></iframe>");}function Y(e){var c1=new U();if(c1.query(true).hasOwnProperty("sap-isolation-enabled")){var d1=sap.ushell.Container.getService("URLParsing"),e1=d1.getHash(c1.toString());if(e1){var f1=d1.parseShellHash("#"+e1),g1=d1.paramsToString(f1.params);if(g1&&g1.length>=0){var h1=sap.ushell.Container.getService("AppState").createEmptyAppState(),i1=sap.ushell.Container.getService("AppState").createEmptyAppState(),j1="";if(g1.indexOf("sap-intent-param")>=0){j1=encodeURIComponent(g1);}else{h1.setData(g1);h1.save();j1=encodeURIComponent("sap-intent-param="+h1.getKey());}i1.setData("sap-startup-params="+j1);i1.save();e=e.split("#")[0]+"&sap-intent-param="+i1.getKey()+"#"+window.hasher.getHash();}else{e=e.split("#")[0]+"#"+window.hasher.getHash();}}else{e+="#"+window.hasher.getHash();}}return e;}function Z(e){var c1=new U(e);c1=c1.removeSearch(j);return c1.toString();}function $(e,c1){var d1=[],e1;if(e.indexOf("sap-intent-param=")>0){e1=/(?:sap-intent-param=)([^&/]+)/.exec(e);if(e1&&e1.length===2){d1.push([e1[1]]);c1.push("sap-intent-param-data");}}if(e.indexOf("sap-xapp-state=")>0){e1=/(?:sap-xapp-state=)([^&/]+)/.exec(e);if(e1&&e1.length===2){d1.push([e1[1]]);c1.push("sap-xapp-state-data");}}if(e.indexOf("sap-iapp-state=")>0){e1=/(?:sap-iapp-state=)([^&/]+)/.exec(e);if(e1&&e1.length===2){d1.push([e1[1]]);c1.push("sap-iapp-state-data");}}return d1;}function _(e,c1,d1,e1,f1,g1){var h1=c1.getId()+"-form",i1="",j1="",k1=false;if(d1===undefined){d1=[];}d1.push([sap.ushell.Container.getFLPUrl(true)]);e1.push("sap-flp-url");var l1="";e1.forEach(function(n1,o1){if(d1[o1][0]){if(typeof d1[o1][0]==="object"){l1=JSON.stringify(d1[o1][0]);}else{l1=d1[o1][0];}i1="<input name=\""+n1+"\" value=\""+h(l1)+"\"/>";j1+=i1;}});c1.fireEvent("applicationConfiguration");e.write("<form").writeAttributeEscaped("method","post").writeAttributeEscaped("id",h1).writeAttributeEscaped("name",h1).writeAttributeEscaped("target",c1.getId()+"-iframe").writeAttributeEscaped("action",f1).addStyle("display","none").writeStyles().write(">").writeAttributeEscaped(j1).write("</form>");var m1=c1.sId;if(!g1&&c1.hasStyleClass("hidden")){k1=true;c1.toggleStyleClass("hidden",false);}c1.sId+="-iframe";e.write("<iframe").writeAttributeEscaped("name",c1.getId()).writeControlData(c1).writeAccessibilityState(c1).writeAttributeEscaped("sap-orig-src",f1).addClass("sapUShellApplicationContainer").writeClasses(c1).addStyle("height",c1.getHeight()).addStyle("width",c1.getWidth()).writeStyles().write("></iframe>");c1.sId=m1;if(k1){c1.toggleStyleClass("hidden",true);}}function a1(e,c1,d1){if(d1){e.write("<div").writeControlData(c1).writeAttributeEscaped("sap-iframe-app","true").addClass("sapUShellApplicationContainer").writeClasses(c1).addStyle("height",c1.getHeight()).addStyle("width",c1.getWidth()).writeStyles().write(">");}else{e.write("</div>");}}var b1=b.extend(s,{metadata:{properties:{additionalInformation:{defaultValue:"",type:"string"},application:{type:"object"},applicationConfiguration:{type:"object"},applicationType:{defaultValue:"URL",type:p+"ApplicationType"},height:{defaultValue:"100%",type:"sap.ui.core.CSSSize"},navigationMode:{defaultValue:"",type:"string"},targetNavigationMode:{defaultValue:"",type:"string"},text:{defaultValue:"",type:"string"},url:{defaultValue:"",type:"string"},visible:{defaultValue:true,type:"boolean"},active:{defaultValue:true,type:"boolean"},"sap-system":{type:"string"},applicationDependencies:{type:"object"},componentHandle:{type:"object"},ui5ComponentName:{type:"string"},width:{defaultValue:"100%",type:"sap.ui.core.CSSSize"},shellUIService:{type:"object"},appIsolationService:{type:"object"},reservedParameters:{type:"object"},coreResourcesFullyLoaded:{type:"boolean"},isStateful:{defaultValue:false,type:"boolean"},iframeHandlers:{defaultValue:"",type:"string"},iframeWithPost:{defaultValue:false,type:"boolean"},beforeAppCloseEvent:{type:"object"}},events:{"applicationConfiguration":{}},aggregations:{child:{multiple:false,type:"sap.ui.core.Control",visibility:"hidden"}},library:"sap.ushell",designtime:"sap/ushell/designtime/ApplicationContainer.designtime"},exit:function(){var e,c1=this;if(sap.ushell.Container){e=b1.prototype._getLogoutHandler(c1);if(e){sap.ushell.Container.detachLogoutEvent(e);l.remove(c1.getId());}}localStorage.removeItem(c1.globalDirtyStorageKey);if(c1._unloadEventListener){removeEventListener("unload",c1._unloadEventListener);}if(c1._disableRouterEventHandler){sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer","_prior.newUI5ComponentInstantion",c1._disableRouterEventHandler);}if(c1._storageEventListener){removeEventListener("storage",c1._storageEventListener);}if(c1._messageEventListener){removeEventListener("message",c1._messageEventListener);}b1.prototype._destroyChild(c1);if(b.exit){b.exit.apply(c1);}},setHandleMessageEvent:function(e){H=e;},init:function(){var e=this;e.globalDirtyStorageKey=i+g();if(new d(window.location.href).get("sap-post")==="true"){e.setIframeWithPost(true);}e._unloadEventListener=e.exit.bind(e);addEventListener("unload",e._unloadEventListener);e._storageEventListener=function(c1){var d1=e.getApplicationType();if(c1.key===e.globalDirtyStorageKey&&c1.newValue===sap.ushell.Container.DirtyState.PENDING&&u.isApplicationTypeEmbeddedInIframe(d1)){var e1=e._getIFrame();if(e1){jQuery.sap.log.debug("getGlobalDirty() send pro54_getGlobalDirty ",null,"sap.ushell.components.container.ApplicationContainer");var f1=new U(e._getIFrameUrl(e1));var g1=f1.protocol()+"://"+f1.host();e1.contentWindow.postMessage(JSON.stringify({action:"pro54_getGlobalDirty"}),g1);}}};addEventListener("storage",e._storageEventListener);e._messageEventListener=b1.prototype._handleMessageEvent.bind(null,e);addEventListener("message",e._messageEventListener);},onAfterRendering:function(){var e=this;this.rerender=function(){};if(D.os.ios&&this.$().prop("tagName")==="IFRAME"){this.$().parent().css("overflow","auto");}if(this.oDeferredRenderer){this.oDeferredRenderer.done(function(){var c1=document.getElementById(e.getId()+"-form");if(c1){c1.submit();}});}},renderer:function(e,c1){var d1=c1.getApplication(),e1=c1.launchpadData,f1;if(!c1.getVisible()){b1.prototype._renderControlInDiv(e,c1);return;}if(c1.error){delete c1.error;b1.prototype._renderControlInDiv(e,c1,b1.prototype._createErrorControl());}else if(!d1){b1.prototype._render(e,c1,c1.getApplicationType(),c1.getUrl(),c1.getAdditionalInformation());}else if(!d1.isResolvable()){b1.prototype._render(e,c1,d1.getType(),d1.getUrl(),"");}else if(e1){b1.prototype._render(e,c1,e1.applicationType,e1.Absolute.url.replace(/\?$/,""),e1.applicationData);}else{jQuery.sap.log.debug("Resolving "+d1.getUrl(),null,s);d1.resolve(function(g1){jQuery.sap.log.debug("Resolved "+d1.getUrl(),JSON.stringify(g1),s);c1.launchpadData=g1;b1.prototype._destroyChild(c1);},function(g1){var h1=d1.getMenu().getDefaultErrorHandler();if(h1){h1(g1);}b1.prototype._destroyChild(c1);c1.error=g1;});f1=new T({text:b1.prototype._getTranslatedText("loading",[d1.getText()])});b1.prototype._destroyChild(c1);c1.setAggregation("child",f1);b1.prototype._renderControlInDiv(e,c1,f1);}}});b1.prototype.getFrameSource=function(e,c1){if(!Object.prototype.hasOwnProperty.call(A.enum,e)){throw new Error("Illegal application type: "+e);}return c1;};b1.prototype.setUrl=function(e){W(this,"url",e);};b1.prototype.setAdditionalInformation=function(e){W(this,"additionalInformation",e);};b1.prototype.setApplicationType=function(e){W(this,"applicationType",e);};b1.prototype.createPostMessageRequest=function(e,c1){var d1=Date.now().toString();return{"type":"request","request_id":d1,"service":e,"body":c1};};b1.prototype.setNewTRApplicationContext=function(e){var c1=this._getIFrame();if(!c1){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}e=u.appendSapShellParam(e);var d1=this.createPostMessageRequest("sap.its.startService",{"url":e});return this.postMessageToIframe(d1,c1,true).catch(function(e1){return Promise.reject({eventData:e1,message:"Failed to change application context."});});};b1.prototype.postMessageToIframe=function(c1,d1,e1){var f1=this;var g1=c1.request_id;return new Promise(function(h1,i1){function j1(n1){var o1;try{o1=JSON.parse(n1.data,f1);if(g1!==o1.request_id){return;}if(o1.status==="success"){h1(o1);}else{i1(o1);}window.removeEventListener("message",j1);}catch(e){h1();jQuery.sap.log.warning("Obtained bad response from framework in response to message "+c1.request_id);jQuery.sap.log.debug("Underlying framework returned invalid response data: '"+n1.data+"'");}}var k1=JSON.stringify(c1);jQuery.sap.log.debug("Sending postMessage "+k1+" to application container '"+f1.getId()+"'");var l1=new U(f1._getIFrameUrl(d1));var m1=l1.protocol()+"://"+l1.host();if(e1){window.addEventListener("message",j1,false);d1.contentWindow.postMessage(k1,m1);}else{d1.contentWindow.postMessage(k1,m1);h1();}});};b1.prototype.postMessageToCurrentIframe=function(e,c1){if(c1===undefined){c1=false;}var d1=this._getIFrame();if(!d1){if(c1){return Promise.reject({message:"Expected opened iframe not found."});}return;}return this.postMessageToIframe(e,d1,c1);};b1.prototype.setNewApplicationContext=function(e,c1){var d1=this;var e1=this["setNew"+e+"ApplicationContext"];if(!e1){return Promise.reject({message:"Unsupported application type"});}var f1=this._getIFrame();if(!f1){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}var g1=this.createPostMessageRequest("sap.gui.triggerCloseSessionImmediately",{});return this.postMessageToIframe(g1,f1,true).then(function(){return e1.call(d1,c1);},function(h1){return Promise.reject({eventData:h1,message:"Failed to change application context."});});};b1.prototype.onApplicationOpened=function(e){var c1=this.getIsStateful();if(!c1){return Promise.resolve();}var d1=this.getApplicationType();if(d1==="TR"&&e!=="TR"){var e1=this._getIFrame();if(!e1){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}var f1=this.createPostMessageRequest("sap.gui.triggerCloseSession",{});return this.postMessageToIframe(f1,e1,false).catch(function(g1){return Promise.reject({eventData:g1,message:"Failed to change application context."});});}return Promise.resolve();};b1.prototype.postMessageRequest=function(e,c1){var d1=this._getIFrame();if(!d1){return Promise.reject({message:"Expected an exisiting TR application application frame but found none."});}var e1=this.createPostMessageRequest(e,c1||{});return this.postMessageToIframe(e1,d1,false).catch(function(f1){return Promise.reject({eventData:f1,message:"Failed to post message."});});};b1.prototype.sendBeforeAppCloseEvent=function(){var e=this.getBeforeAppCloseEvent&&this.getBeforeAppCloseEvent(),c1;if(e&&e.enabled&&e.enabled===true){c1=this.createPostMessageRequest("sap.ushell.services.CrossApplicationNavigation.beforeAppCloseEvent",e.params);return this.postMessageToIframe(c1,this._getIFrame(),true);}else{return undefined;}};b1.prototype._getCommunicationHandlers=q;b1.prototype._adaptIsUrlSupportedResultForMessagePopover=k;b1.prototype._getLogoutHandler=n;b1.prototype._getParameterMap=t;b1.prototype._getTranslatedText=v;b1.prototype._createErrorControl=w;b1.prototype._destroyChild=x;b1.prototype._createUi5View=y;b1.prototype._publishExternalEvent=z;b1.prototype._createUi5Component=B;b1.prototype._disableRouter=F;b1.prototype._createSystemForUrl=G;b1.prototype._isTrustedPostMessageSource=J;b1.prototype._handleMessageEvent=O;b1.prototype._logout=P;b1.prototype._renderControlInDiv=Q;b1.prototype._adjustNwbcUrl=R;b1.prototype._render=X;b1.prototype._getParamKeys=$;b1.prototype._buildHTMLElements=_;b1.prototype._generateRootElementForIFrame=a1;b1.prototype._backButtonPressedCallback=K;b1.prototype._getIFrame=L;b1.prototype._getIFrameUrl=N;b1.prototype._filterURLParams=Z;return b1;},true);