/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/util/extend","sap/base/util/isPlainObject","sap/m/NavContainer","sap/f/FlexibleColumnLayout","sap/ui/core/UIComponent","sap/ui/model/base/ManagedObjectModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/ui/model/odata/MessageScope","sap/ui/model/resource/ResourceModel","sap/ui/generic/app/ApplicationController","sap/suite/ui/generic/template/genericUtilities/ProcessObserver","sap/suite/ui/generic/template/lib/Application","sap/suite/ui/generic/template/lib/BusyHelper","sap/suite/ui/generic/template/lib/DataLossHandler","sap/suite/ui/generic/template/lib/navigation/NavigationController","sap/suite/ui/generic/template/lib/TemplateAssembler","sap/suite/ui/generic/template/lib/CRUDHelper","sap/suite/ui/generic/template/lib/ViewDependencyHelper","sap/suite/ui/generic/template/genericUtilities/testableHelper","sap/suite/ui/generic/template/support/lib/CommonMethods","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/suite/ui/generic/template/lib/navigation/startupParameterHelper","sap/suite/ui/generic/template/lib/PageLeaveHandler","sap/suite/ui/generic/template/lib/ShareUtils","sap/suite/ui/commons/collaboration/URLMinifier"],function(e,t,a,n,o,i,r,s,l,p,u,c,g,d,f,v,m,y,b,S,h,C,P,M,N,A,H){"use strict";var w="lib.AppComponent";var R=new P(w).getLogger();c=h.observableConstructor(c);var E=sap.m.DraftIndicatorState;var L=y.getRegisterAppComponent();var O=true;if(window["sap-ushell-config"]&&window["sap-ushell-config"].apps&&window["sap-ushell-config"].apps.placeholder){O=window["sap-ushell-config"].apps.placeholder.enabled}var B;function T(){B=B||new u({bundleName:"sap/suite/ui/generic/template/lib/i18n/i18n"}).getResourceBundle();return B.getText.apply(B,arguments)}function V(){return new g({processObservers:[]})}var x=sap.ui.getCore().getMessageManager().getMessageModel();var D=new r({path:"validation",operator:s.EQ,value1:true});function I(r,s){var u;var y={oAppComponent:r,leaveAppPromise:Promise.resolve(),ghostapp:function(){var e=r.getManifestEntry("sap.ui.generic.app");return!!(e&&e.settings&&e.settings.ghostapp)}(),componentRegistry:Object.create(null),aRunningSideEffectExecutions:[],getText:T,oTemplatePrivateGlobalModel:(new l).setDefaultBindingMode("TwoWay"),aStateChangers:[],oPaginatorInfo:Object.create(null),oStatePreserversAvailablePromise:Promise.resolve(),oValidationMessageBinding:x.bindList("/",null,null,D),mBusyTopics:Object.create(null),bEnablePlaceholder:O,bStateHandlingSuspended:false};y.oDataLossHandler=new v(y);y.oPageLeaveHandler=new N(y);y.oValidationMessageBinding.attachChange(Function.prototype);var P;var H;var w;function B(){var e=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("URLParsing");y.oTemplatePrivateGlobalModel.setProperty("/generic",{draftIndicatorState:E.Clear,shellServiceUnavailable:false,forceFullscreenCreate:false});r.setModel(y.oTemplatePrivateGlobalModel,"_templPrivGlobal");y.oShellServicePromise.catch(function(){y.oTemplatePrivateGlobalModel.setProperty("/generic/shellServiceUnavailable",true)});var t=A.getCurrentUrl();t.then(function(t){var a=e&&e.isIntentUrlAsync(t);if(a){a.then(function(e){y.oTemplatePrivateGlobalModel.setProperty("/generic/crossAppNavSupport",e)})}else{y.oTemplatePrivateGlobalModel.setProperty("/generic/crossAppNavSupport",false)}});y.oTemplatePrivateGlobalModel.setProperty("/generic/replaceShareWithLogo",true);var a=sap.ui.getCore().getMessageManager().getMessageModel();r.setModel(a,"_templPrivMessage")}function I(){y.fnAddSideEffectPromise=function(e){var t=0;for(;y.aRunningSideEffectExecutions[t];){t++}y.aRunningSideEffectExecutions[t]=e;var a=function(){y.aRunningSideEffectExecutions[t]=null};e.then(a,a)};P.attachEvent("beforeSideEffectExecution",function(e){y.fnAddSideEffectPromise(e.getParameter("promise"))});var e=r.getModel("_templPrivGlobal");var t="/generic/draftIndicatorState";P.attachBeforeQueueItemProcess(function(a){if(a.draftSave){e.setProperty(t,E.Saving)}});P.attachOnQueueCompleted(function(){if(e.getProperty(t)===E.Saving){e.setProperty(t,E.Saved)}});P.attachOnQueueFailed(function(){if(e.getProperty(t)===E.Saving){e.setProperty(t,E.Clear)}});e.setProperty("/generic/appComponentName",r.getMetadata().getComponentName())}function j(){var t=r.getId();R.info("Init called for AppComponent "+t);var a={appComponent:r,oTemplateContract:y,application:new d(y),oViewDependencyHelper:new S(y)};y.oViewDependencyHelper=a.oViewDependencyHelper;y.oShellServicePromise=r.getService("ShellUIService").catch(function(){var e=sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.ShellUIService");return e&&e.createInstance()||Promise.reject()});y.oShellServicePromise.catch(function(){R.warning("No ShellService available")});var n=$().settings;if(n&&n.hasOwnProperty("ghostapp")){n=e({},n);delete n.ghostapp}else{n=n||Object.create(null)}r.applySettings(n);(o.prototype.init||Function.prototype).apply(r,arguments);y.appSettings=new i(r);y.oBusyHelper.setBusy(y.oShellServicePromise,undefined,undefined,true);w=L(a);var s=r.getModel();y.bCreateRequestsCanonical=true;var l=s.messageScopeSupported();y.oBusyHelper.setBusy(l,undefined,undefined,true);l.then(function(e){if(e){s.setPersistTechnicalMessages(true);s.setMessageScope(p.BusinessObject);y.bCreateRequestsCanonical=false}P=new c(s);B();H=new m(y);I();b.enableAutomaticDraftSaving(y);if(!s.oMetadata||!s.oMetadata.isLoaded()||s.oMetadata.isFailed()){s.attachMetadataFailed(function(){H.navigateToMessagePage({title:T("ST_GENERIC_ERROR_TITLE"),text:T("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE"),icon:"sap-icon://message-error",description:T("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE_DESC")});for(var e in y.componentRegistry){y.componentRegistry[e].fnViewRegisteredResolve(true)}})}if(r&&r.getMetadata()&&r.getMetadata().getManifest()){C.setAppComponent(r)}C.setApplicationStatus(C.mApplicationStatus.LOADING);C.publishEvent("elements","ViewRenderingStarted",{});var t=sap.ushell&&sap.ushell.Container;if(t){t.registerDirtyStateProvider(ne)}});W();R.info("Init done for AppComponent "+t)}function U(){if(y.oNavigationHost){return""}if(r.getFlexibleColumnLayout()){var e=new n;y.oNavigationHost=e;y.aNavigationObservers=[new g({processName:"BeginColumnNavigation",eventHandlers:{attachProcessStart:e.attachBeginColumnNavigate.bind(e),attachProcessStop:e.attachAfterBeginColumnNavigate.bind(e)}}),new g({processName:"MidColumnNavigation",eventHandlers:{attachProcessStart:e.attachMidColumnNavigate.bind(e),attachProcessStop:e.attachAfterMidColumnNavigate.bind(e)}}),new g({processName:"EndColumnNavigation",eventHandlers:{attachProcessStart:e.attachEndColumnNavigate.bind(e),attachProcessStop:e.attachAfterEndColumnNavigate.bind(e)}})];y.oNavigationObserver=new g({processObservers:y.aNavigationObservers});y.aHeaderLoadingObservers=[V(),V(),V()]}else{var t=new a({id:r.getId()+"-appContent"});y.oNavigationHost=t;y.oNavigationObserver=new g({processName:"Navigation",eventHandlers:{attachProcessStart:t.attachNavigate.bind(t),attachProcessStop:t.attachAfterNavigate.bind(t)}})}y.oHeaderLoadingObserver=new g({processObservers:y.aHeaderLoadingObservers||[]});y.oPagesDataLoadedObserver=new g({processObservers:[y.oHeaderLoadingObserver,y.oNavigationObserver]});y.oNavigationHost.addStyleClass(y.oApplicationProxy.getContentDensityClass());y.oBusyHelper=new f(y);y.oBusyHelper.setBusyReason("HashChange",true,true,undefined,true);y.oBusyHelper.getUnbusy().then(function(){y.oShellServicePromise.then(function(e){e.setBackNavigation(y.oApplicationProxy.onBackButtonPressed)})});return y.oNavigationHost}function F(){for(var e in y.componentRegistry){var t=y.componentRegistry[e];t.utils.leaveApp(false)}}function _(){y.oNavigationControllerProxy&&y.oNavigationControllerProxy.leave();var e=r.getId();R.info("Exit called for AppComponent "+e);var t=sap.ushell&&sap.ushell.Container;if(t){t.deregisterDirtyStateProvider(ne)}y.ghostapp=true;if(y.oNavigationHost){y.oNavigationHost.destroy()}if(P){P.destroy()}if(H){H.destroy()}if(y.oValidationMessageBinding){y.oValidationMessageBinding.destroy()}C.setAppComponent(null);(o.prototype.exit||Function.prototype).apply(r,arguments);w();h.endApp(s);if(u){u()}R.info("Exit done for AppComponent "+e)}function G(){for(var e in y.componentRegistry){var t=y.componentRegistry[e];if(t.methods.onSuspend){t.methods.onSuspend()}}F();var a=sap.ushell&&sap.ushell.Container;if(a){a.deregisterDirtyStateProvider(ne)}y.ghostapp=true;y.aStateChangers.forEach(function(e){e.leaveApp()});y.oNavigationControllerProxy&&y.oNavigationControllerProxy.suspend();u();u=null}function k(){y.oBusyHelper.setBusyReason("exiting",false);for(var e in y.componentRegistry){var t=y.componentRegistry[e];if(t.methods.onRestore){t.methods.onRestore()}}W();var a=sap.ushell&&sap.ushell.Container;if(a){a.registerDirtyStateProvider(ne)}y.ghostapp=false;y.oNavigationControllerProxy.restore()}function W(){y.leaveAppPromise=new Promise(function(e){u=e})}function q(e){var t=Object.keys(e).map(function(t){var a=e[t];if(a.pages){a.pages=q(a.pages)}return e[t]});return t}function Q(e){if(e.pages&&t(e.pages)){e.pages=e.pages&&t(e.pages)?q(e.pages):e.pages}}function X(e,t){if(!e){return}for(var a=0;a<e.length;a++){var n=e[a];if(n.routingSpec&&n.routingSpec.noOData){n.entitySet=n.routingSpec.routeName;if(t>1){n.navigationProperty=n.routingSpec.routeName}}X(n.pages,t+1);if(n.embeddedComponents){for(var o in n.embeddedComponents){var i=n.embeddedComponents[o];if(i.pages){i.pages=q(i.pages);X(i.pages,t+1)}}}if(n.implementingComponent&&n.implementingComponent.pages){n.implementingComponent.pages=q(n.implementingComponent.pages);X(n.implementingComponent.pages,t+1)}}}function z(e){X(e.pages,0)}function Y(e){if(e){var t=e.entitySet;var a=e.component&&e.component.settings&&e.component.settings.quickVariantSelectionX&&e.component.settings.quickVariantSelectionX.variants||{};var n=function(e){for(var t in e){var a=e[t];if(a.entitySet){return true}}return false};if(n(a)){for(var o in a){var i=a[o];if(i.entitySet===undefined){i.entitySet=t}}}}}function J(e){Y(e.pages[0])}function K(e){if(e&&e.objectPageDynamicHeaderTitleWithVM){e.objectPageHeaderType=e.objectPageHeaderType||"Dynamic";e.objectPageVariantManagement=e.objectPageVariantManagement||"VendorLayer"}}var Z;function $(){if(!Z){var e=r.getMetadata();Z=e.getManifestEntry("sap.ui.generic.app");if(!Z){return Object.create(null)}Q(Z);z(Z);J(Z);K(Z.settings)}return Z}var ee;function te(){if(!ee){ee=e({},r.getMetadata().getManifest());ee["sap.ui.generic.app"]=$()}return ee}function ae(){var e=r.getFlexibleColumnLayout()?"f":"m";return"sap."+e+".routing.Router"}function ne(e){return!y.ghostapp&&y.oDataLossHandler.getShellDataLossPopup(e)}function oe(){y.bStateHandlingSuspended=true}function ie(){y.bStateHandlingSuspended=false}var re;var se={init:j,createContent:U,exit:_,suspend:G,restore:k,_getRouterClassName:ae,getConfig:$,getInternalManifest:te,uiAdaptationStarted:oe,uiAdaptationStopped:ie,getTransactionController:function(){return P.getTransactionController()},getApplicationController:function(){return P},getNavigationController:function(){return H},navigateBasedOnStartupParameter:function(e){re=e;y.oBusyHelper.getUnbusy().then(function(){if(!re||y.oBusyHelper.isBusy()){re=null;return}var e=y.oNavigationControllerProxy.clearHistory().then(M.parametersToNavigation.bind(null,y,re));y.oBusyHelper.setBusy(e);re=null})}};var Q=h.testable(Q,"fnNormalizePagesMapToArray");$=h.testable($,"getConfig");h.testable(W,"AppComponent_setLeaveAppPromise");return se}return o.extend("sap.suite.ui.generic.template.lib.AppComponent",{metadata:{config:{title:"SAP UI Application Component",fullWidth:true},properties:{forceGlobalRefresh:{type:"boolean",defaultValue:false},considerAnalyticalParameters:{type:"boolean",defaultValue:false},showDraftToggle:{type:"boolean",defaultValue:true},objectPageHeaderType:{type:"string",defaultValue:"Static"},objectPageVariantManagement:{type:"string",defaultValue:"None"},flexibleColumnLayout:{type:"object",defaultValue:null},inboundParameters:{type:"object",defaultValue:null},tableColumnVerticalAlignment:{type:"string",defaultValue:"Middle"},useColumnLayoutForSmartForm:{type:"boolean",defaultValue:true},objectPageColumns:{type:"object",properties:{screenSizeXL:{type:"int",defaultValue:6}}},statePreservationMode:{type:"string",defaultValue:"auto"},enableAutoColumnWidthForSmartTable:{type:"boolean",defaultValue:true},draftDiscardConfirmationSettings:{type:"object",defaultValue:{enabled:"always"}}},events:{pageDataLoaded:{}},routing:{config:{async:true,viewType:"XML",viewPath:"",clearTarget:false},routes:[],targets:[]},library:"sap.suite.ui.generic.template"},suppressDataLossPopup:function(){return false},constructor:function(){var t=h.startApp();e(this,I(this,t));(o.prototype.constructor||Function.prototype).apply(this,arguments)}})});
//# sourceMappingURL=AppComponent.js.map