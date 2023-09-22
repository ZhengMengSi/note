/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/utils/utils","sap/apf/utils/filter","sap/apf/utils/hashtable","sap/apf/core/utils/checkForTimeout","sap/apf/core/utils/uriGenerator","sap/apf/core/utils/fileExists","sap/apf/core/utils/annotationHandler","sap/apf/core/utils/filter","sap/apf/core/messageHandler","sap/apf/core/path","sap/apf/core/persistence","sap/apf/core/metadataFactory","sap/apf/core/textResourceHandler","sap/apf/core/configurationFactory","sap/apf/core/sessionHandler","sap/apf/core/resourcePathHandler","sap/apf/core/constants","sap/apf/cloudFoundry/analysisPathProxy","sap/apf/cloudFoundry/ajaxHandler","sap/ui/comp/smartfilterbar/ControlConfiguration","sap/apf/core/metadataProperty","sap/apf/core/metadataFacade","sap/apf/core/metadata","sap/apf/core/readRequestByRequiredFilter","sap/apf/core/ajax","sap/apf/core/odataRequest","sap/apf/core/entityTypeMetadata","sap/apf/core/readRequest","sap/ui/thirdparty/jquery"],function(t,e,a,n,r,s,i,o,c,u,f,p,l,g,d,h,m,y,v,F,P,S,x,C,A,H,T,M,jQuery){"use strict";p=p||sap.apf.core.MetadataFactory;l=l||sap.apf.core.TextResourceHandler;g=g||sap.apf.core.ConfigurationFactory;d=d||sap.apf.core.SessionHandler;h=h||sap.apf.core.ResourcePathHandler;function R(c){var p=this;var l;var g,d,h;var y=c.instances.messageHandler;var v=c.instances.startParameter;c.constructors=c.constructors||{};var F=c.functions&&c.functions.checkForTimeout||n;var A={instances:{messageHandler:y,coreApi:this},constructors:{Request:c.constructors.Request},exits:{binding:{afterGetFilter:c.exits&&c.exits.binding&&c.exits.binding.afterGetFilter},path:{beforeAddingToCumulatedFilter:c.exits&&c.exits.path&&c.exits.path.beforeAddingToCumulatedFilter}},functions:c.functions};var H;var T;var M;var R;var b;var j;var E;var w;var B;var D;var k=c&&c.instances&&c.instances.datajs||OData;this.destroy=function(){b.destroy()};this.ajax=function(t){var e=jQuery.extend(true,{},t);e.functions=e.functions||{};e.functions.getSapSystem=v.getSapSystem;if(c.functions&&c.functions.ajax){e.functions.ajax=c.functions.ajax}e.instances=e.instances||{};e.instances.messageHandler=y;return sap.apf.core.ajax(e)};this.odataRequest=function(t,e,a,n){var r={instances:{datajs:k},functions:{getSapSystem:v.getSapSystem}};var s=c&&c.functions&&c.functions.odataRequest||sap.apf.core.odataRequestWrapper;s(r,t,e,a,n)};this.getStartParameterFacade=function(){return v};this.getMessageHandler=function(){return y};this.putMessage=function(t){return y.putMessage(t)};this.check=function(t,e,a){return y.check(t,e,a)};this.createMessageObject=function(t){return y.createMessageObject(t)};this.activateOnErrorHandling=function(t){y.activateOnErrorHandling(t)};this.setCallbackForMessageHandling=function(t){y.setMessageCallback(t)};this.getLogMessages=function(){return y.getLogMessages()};this.checkForTimeout=function(t){var e=F(t);if(e){y.putMessage(e)}return e};this.getUriGenerator=function(){return r};this.getMetadata=function(t){return T.getMetadata(t)};this.getMetadataFacade=function(){return T.getMetadataFacade()};this.getEntityTypeMetadata=function(t,e){return T.getEntityTypeMetadata(t,e)};this.loadApplicationConfig=function(t){H.loadConfigFromFilePath(t)};this.loadTextElements=function(t){M.loadTextElements(t)};this.registerTextWithKey=function(t,e){M.registerTextWithKey(t,e)};this.getApplicationConfigProperties=function(){return H.getConfigurationProperties()};this.getResourceLocation=function(t){return H.getResourceLocation(t)};this.getPersistenceConfiguration=function(){return H.getPersistenceConfiguration()};this.getCategories=function(){return R.getCategories()};this.existsConfiguration=function(t){return R.existsConfiguration(t)};this.getStepTemplates=function(){return R.getStepTemplates()};this.getConfigurationObjectById=function(t){return R.getConfigurationById(t)};this.registerSmartFilterBarInstance=function(t){if(!D){D=jQuery.Deferred()}D.resolve(t)};this.getSmartFilterBarAsPromise=function(){if(!D){D=jQuery.Deferred()}this.getSmartFilterBarConfigurationAsPromise().done(function(t){if(!t){D.resolve(null)}});return D};this.getSmartFilterBarConfigurationAsPromise=function(){return R.getSmartFilterBarConfiguration()};this.getSmartFilterBarPersistenceKey=function(t){return"APF"+R.getConfigHeader().AnalyticalConfiguration+t};this.getSmartFilterbarDefaultFilterValues=function(){var t=jQuery.Deferred();var e=[];c.functions.getCombinedContext().done(function(n){n.getProperties().forEach(function(t){var r={key:t,visibleInAdvancedArea:true,defaultFilterValues:a(n,t)};e.push(new sap.ui.comp.smartfilterbar.ControlConfiguration(r))});t.resolve(e)});return t;function a(t,e){var a=t.getFilterTermsForProperty(e);var n=[];a.forEach(function(t){var e=new sap.ui.comp.smartfilterbar.SelectOption({low:t.getValue(),operator:t.getOp(),high:t.getHighValue(),sign:"I"});n.push(e)});return n}};this.getReducedCombinedContext=function(){var t=jQuery.Deferred();c.functions.getCombinedContext().done(function(e){var a=p.getSmartFilterBarAsPromise();a.done(function(a){if(!a){t.resolve(e);return}var n=new o(c.instances.messageHandler);var r=a.getFilters();r.forEach(function(t){n.addAnd(o.transformUI5FilterToInternal(c.instances.messageHandler,t))});t.resolve(e.removeTermsByProperty(n.getProperties()))})});return t};this.getFacetFilterConfigurations=function(){return R.getFacetFilterConfigurations()};this.getNavigationTargets=function(){return R.getNavigationTargets()};this.createStep=function(t,e,a){var n;y.check(t!==undefined&&typeof t==="string"&&t.length!==0,"sStepID is  unknown or undefined");n=R.createStep(t,a);b.addStep(n,e);return n};this.getSteps=function(){return b.getSteps()};this.moveStepToPosition=function(t,e,a){b.moveStepToPosition(t,e,a)};this.updatePath=function(t,e){b.update(t,e)};this.removeStep=function(t,e){b.removeStep(t,e)};this.resetPath=function(){if(b){b.destroy()}b=new u.constructor(A)};this.stepIsActive=function(t){return b.stepIsActive(t)};this.isApfStateAvailable=function(){return j.isApfStateAvailable()};this.storeApfState=function(){j.storeApfState()};this.restoreApfState=function(){return j.restoreApfState()};this.serialize=function(){var t=b.serialize();p.getSmartFilterBarAsPromise().done(function(e){if(e){t.smartFilterBar=e.fetchVariant()}});return t};this.deserialize=function(t){if(t.smartFilterBar){if(!D){D=jQuery.Deferred()}D.done(function(e){e._apfOpenPath=true;e.applyVariant(t.smartFilterBar);e.clearVariantSelection();e.fireFilterChange()})}b.deserialize(t)};this.getTextNotHtmlEncoded=function(t,e){return M.getTextNotHtmlEncoded(t,e)};this.getTextHtmlEncoded=function(t,e){return M.getTextHtmlEncoded(t,e)};this.isInitialTextKey=function(t){return t===m.textKeyForInitialText};this.getMessageText=function(t,e){return M.getMessageText(t,e)};this.getXsrfToken=function(t){return j.getXsrfToken(t)};this.setDirtyState=function(t){j.setDirtyState(t)};this.isDirty=function(){return j.isDirty()};this.setPathName=function(t){j.setPathName(t)};this.getPathName=function(){return j.getPathName()};this.getCumulativeFilter=function(){return c.functions.getCumulativeFilter()};this.createReadRequest=function(t){var e=R.createRequest(t);var a;if(typeof t==="string"){a=R.getConfigurationById(t)}else{a=t}return new sap.apf.core.ReadRequest(A,e,a.service,a.entityType)};this.createReadRequestByRequiredFilter=function(t){var e=R.createRequest(t);var a;if(typeof t==="string"){a=R.getConfigurationById(t)}else{a=t}return new C(A,e,a.service,a.entityType)};this.loadMessageConfiguration=function(t,e){y.loadConfig(t,e)};this.loadAnalyticalConfiguration=function(t){R.loadConfig(t)};this.savePath=function(t,e,a,n){var r;var s;var i;var o;if(typeof t==="string"&&typeof e==="string"&&typeof a==="function"){r=t;s=e;i=a;o=n;this.setPathName(s);E.modifyPath(r,s,i,o)}else if(typeof t==="string"&&typeof e==="function"){s=t;i=e;o=a;this.setPathName(s);E.createPath(s,i,o)}else{y.putMessage(y.createMessageObject({code:"5027",aParameters:[t,e,a]}))}};this.readPaths=function(t){E.readPaths(t)};this.openPath=function(t,e){function a(t,a,n){if(!n){p.setPathName(t.path.AnalysisPathName)}e(t,a,n)}return E.openPath(t,a)};this.deletePath=function(t,e){E.deletePath(t,e)};this.createFilter=function(t){return new e(y,t)};this.getActiveStep=function(){return b.getActiveSteps()[0]};this.getCumulativeFilterUpToActiveStep=function(){return b.getCumulativeFilterUpToActiveStep()};this.setActiveStep=function(t){b.makeStepActive(t);var e=b.getActiveSteps();var a;for(a=0;a<e.length;++a){b.makeStepInactive(e[a])}return b.makeStepActive(t)};this.createFirstStep=function(t,e,a){var n=false;var r;r=p.getStepTemplates();r.forEach(function(e){n=e.id===t?true:n});if(!n){y.putMessage(y.createMessageObject({code:"5036",aParameters:[t]}))}else{p.createStep(t,a,e)}};this.getFunctionCreateRequest=function(){return R.createRequest};this.getAnnotationsForService=function(t){return w.getAnnotationsForService(t)};this.checkAddStep=function(t){return b.checkAddStep(t)};this.getPathFilterInformation=function(){return b.getFilterInformation()};this.getGenericExit=function(t){if(c&&c.exits&&c.exits[t]&&typeof c.exits[t]==="function"){return c.exits[t]}return undefined};this.getComponent=function(){return c&&c.instances&&c.instances.component};M=new(c.constructors.TextResourceHandler||sap.apf.core.TextResourceHandler)(A);y.setTextResourceHandler(M);if(c.manifests){A.manifests=c.manifests}B=new(c.constructors.FileExists||s)({functions:{ajax:p.ajax,getSapSystem:v.getSapSystem}});var q={manifests:c.manifests,functions:{getSapSystem:v.getSapSystem,getComponentNameFromManifest:t.getComponentNameFromManifest,getODataPath:r.getODataPath,getBaseURLOfComponent:r.getBaseURLOfComponent,addRelativeToAbsoluteURL:r.addRelativeToAbsoluteURL},instances:{fileExists:B}};w=new(c.constructors.AnnotationHandler||i.constructor)(q);R=new(c.constructors.ConfigurationFactory||sap.apf.core.ConfigurationFactory)(A);var I={constructors:{EntityTypeMetadata:sap.apf.core.EntityTypeMetadata,Hashtable:c.constructors.Hashtable||a,Metadata:c.constructors.Metadata||x,MetadataFacade:c.constructors.MetadataFacade||S,MetadataProperty:c.constructors.MetadataProperty||P,ODataModel:c.constructors.ODataModel||sap.ui.model.odata.v2.ODataModel},instances:{messageHandler:A.instances.messageHandler,coreApi:p,annotationHandler:w},functions:{getServiceDocuments:R.getServiceDocuments,getSapSystem:v.getSapSystem}};T=new(c.constructors.MetadataFactory||sap.apf.core.MetadataFactory)(I);b=new(c.constructors.Path||u.constructor)(A);j=new(c.constructors.SessionHandler||sap.apf.core.SessionHandler)(A);if(c.functions&&c.functions.isUsingCloudFoundryProxy){l=c.functions.isUsingCloudFoundryProxy}else{l=function(){return false}}if(l()){g={instances:{messageHandler:y},functions:{coreAjax:this.ajax}};d=c.constructors.AjaxHandler||sap.apf.cloudFoundry.AjaxHandler;h=new d(g)}var O={instances:{messageHandler:y,coreApi:this},functions:{getComponentName:c.functions&&c.functions.getComponentName},manifests:c.manifests};if(c.constructors.Persistence){O.instances.ajaxHandler=h;E=new c.constructors.Persistence(O)}else if(l()){O.instances.ajaxHandler=h;E=new sap.apf.cloudFoundry.AnalysisPathProxy(O)}else{E=new f.constructor(O)}var N={instances:{coreApi:p,messageHandler:A.instances.messageHandler,fileExists:B},functions:{checkForTimeout:F,initTextResourceHandlerAsPromise:M.loadResourceModelAsPromise,isUsingCloudFoundryProxy:l},corePromise:c.corePromise,manifests:c.manifests};if(c.constructors&&c.constructors.ProxyForAnalyticalConfiguration){N.constructors={ProxyForAnalyticalConfiguration:c.constructors.ProxyForAnalyticalConfiguration}}H=new(c.constructors.ResourcePathHandler||sap.apf.core.ResourcePathHandler)(N);if(c&&c.coreProbe){c.coreProbe({coreApi:this,startParameter:v,resourcePathHandler:H,textResourceHandler:M,configurationFactory:R,path:b,sessionHandler:j,persistence:E,fileExists:B,corePromise:c.corePromise})}}sap.apf=sap.apf||{};sap.apf.core=sap.apf.core||{};sap.apf.core.Instance=R;return{constructor:R}});
//# sourceMappingURL=instance.js.map