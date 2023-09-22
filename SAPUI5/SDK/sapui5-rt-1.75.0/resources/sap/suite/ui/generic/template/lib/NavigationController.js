/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/ComponentContainer","sap/ui/core/routing/HashChanger","sap/ui/core/routing/History","sap/ui/core/library","sap/suite/ui/generic/template/lib/ProcessObserver","sap/suite/ui/generic/template/lib/routingHelper","sap/suite/ui/generic/template/lib/TemplateComponent","sap/suite/ui/generic/template/lib/testableHelper","sap/ui/fl/ControlPersonalizationAPI","sap/base/Log","sap/base/util/merge","sap/base/util/extend","sap/base/util/isEmptyObject","sap/base/util/UriParameters"],function(B,C,H,a,c,P,r,T,t,b,L,m,d,f,U){"use strict";var g=c.routing.HistoryDirection;var h=a.getInstance();var o=sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");function k(R){var e=R.substring(R.length-5,R.length);if(e==="query"){return R.substring(0,R.length-5);}return R;}function n(e){if(e.indexOf("/")===0){return e;}return"/"+e;}function A(e){var D="";var R="";var j=Object.keys(e).sort();j.forEach(function(v){var V=e[v];if(Array.isArray(V)){var w=V.sort();for(var i=0;i<w.length;i++){var x=w[i];R=R+D+v+"="+x;D="&";}}else{R=R+D+v+"="+V;D="&";}});return R;}function l(e,i){e=e||"";var D=(e.charAt(e.length-1)==="/")?"?":"/?";return e+(i?D+i:"");}function p(e,i){var j=A(i);return l(e,j);}function q(i,R,j){var v=i.mRoutingTree[R.name];var w=R.template;var E=R.entitySet;var V=v.level;var O=-1;if(i.oFlexibleColumnLayoutHandler){O=V<3?V:0;}var x=O<0?i.oNavigationObserver:i.aNavigationObservers[O];var y=new P();var z=O<0?i.oHeaderLoadingObserver:i.aHeaderLoadingObservers[O];z.addObserver(y);var D={};var S={appComponent:i.oAppComponent,isLeaf:!R.pages||!R.pages.length,entitySet:E,navigationProperty:R.navigationProperty,componentData:{registryEntry:{oAppComponent:i.oAppComponent,componentCreateResolve:j,route:R.name,routeConfig:R,viewLevel:v.level,routingSpec:R.routingSpec,oNavigationObserver:x,oHeaderLoadingObserver:y,preprocessorsData:D}}};if(R.component.settings){d(S,R.component.settings);}var F;i.oAppComponent.runAsOwner(function(){try{var G=sap.ui.core.Component.create({name:w,settings:S,handleValidation:true,manifest:true});var I;F=new C({propagateModel:true,width:"100%",height:"100%",settings:S});I=G.then(function(J){F.setComponent(J);var v=i.mRoutingTree[R.name];v.componentId=J.getId();return F;});F.loaded=function(){return I;};}catch(e){throw new Error("Component "+w+" could not be loaded");}});return F;}function s(e,v){t.testable(q,"fnCreateComponentInstance");var w=!o||o.isInitialNavigation();var M={};var x={iHashChangeCount:0,backTarget:0,aCurrentKeys:[],componentsDisplayed:Object.create(null)};var y=[];var z=Promise.resolve();function G(){var i=v.oRouter,j=i.getTargets()._mTargets,d2=[];Object.keys(j).forEach(function(e2){var f2=j[e2],g2=f2._oOptions,h2=i.getRoute(g2.viewName),i2=h2&&h2._oConfig;if(i2&&(!i2.navigation||!i2.navigation.display)){d2.push({oConfig:i2});}});return d2;}t.testable(G,"fnGetAllPages");function D(i){var j=i||G();if(!Array.isArray(j)){j=[j];}j.forEach(function(d2){d2.oComponentContainer=q(e,d2.oConfig,function(){});});return j;}t.testable(D,"fnCreatePages");function E(){var i=v.oRouter.getViews();i.getView({viewName:"root"});return e.mRouteToTemplateComponentPromise.root;}function F(){return v.oAppComponent.getManifestEntry("sap.app").title;}function I(i,j,d2){var e2=i&&e.componentRegistry[i];var f2=e2&&e2.methods.getUrlParameterInfo;return f2?e2.viewRegistered.then(function(){var g2=j&&n(j);return f2(g2,x.componentsDisplayed[e2.route]===1).then(function(h2){d(d2,h2);});}):Promise.resolve();}function J(i){var j=i.treeNode.componentId;var d2=i.treeNode.getPath(2,i.keys);var e2=i.appStates;return I(j,d2,e2);}function K(i,j,d2){var e2=e.mRoutingTree[i];return I(e2.componentId,d2,j);}function S(i,j){var d2;if(!i&&j instanceof T){var e2=j&&e.componentRegistry[j.getId()];var f2=e2&&e2.methods.getTitle;d2=f2&&f2();}else if(!i&&j&&j.title){d2=j.title;}d2=d2||F();e.oShellServicePromise.then(function(g2){g2.setTitle(d2);}).catch(function(){L.warning("No ShellService available");});}function O(i){var j=[e.oPagesDataLoadedObserver.getProcessFinished(true)];var d2=null;var e2=x.iHashChangeCount;delete W.componentsDisplayed;var f2=-1;for(var g2 in e.componentRegistry){var h2=e.componentRegistry[g2];var i2=h2.oControllerUtils&&h2.oControllerUtils.oServices.oTemplateCapabilities.oMessageButtonHelper;var j2=x.componentsDisplayed[h2.route]===1;var k2=h2.utils.getTemplatePrivateModel();k2.setProperty("/generic/isActive",j2);if(j2){j.push(h2.oViewRenderedPromise);if(h2.viewLevel>f2){f2=h2.viewLevel;d2=h2.oComponent;}}else{h2.utils.suspendBinding();}if(i2){i2.setEnabled(j2);}}var l2=e.oFlexibleColumnLayoutHandler&&e.oFlexibleColumnLayoutHandler.isAppTitlePrefered();S(l2,i||d2);Promise.all(j).then(function(){if(e2===x.iHashChangeCount&&f(M)){e.oAppComponent.firePageDataLoaded();}});}var Q=O.bind(null,null);function R(i,j){var d2=[];for(var e2=i;e2.level>=j;e2=e.mRoutingTree[e2.parentRoute]){d2.push(e2);}return d2.reverse();}var V;var W;var X;t.testable(function(i){W=i;y.push(x);x={backTarget:0,componentsDisplayed:Object.create(null)};},"setCurrentIdentity");function Y(){return W;}function Z(j,d2){if(Array.isArray(j)&&j.length<2){j=j[0];}if(Array.isArray(d2)&&d2.length<2){d2=d2[0];}if(Array.isArray(j)){if(Array.isArray(d2)){if(j.length===d2.length){j=j.sort();d2=d2.sort();return j.every(function(e2,i){return e2===d2[i];});}return false;}return false;}return d2===j;}function $(i){if(!W||W.treeNode!==i.treeNode){return false;}for(var j=i.treeNode;j.level>0;j=e.mRoutingTree[j.parentRoute]){if(!j.noKey&&i.keys[j.level]!==W.keys[j.level]){return false;}}if(f(i.appStates)!==f(W.appStates)){return false;}if(f(i.appStates)){return true;}var d2=d(Object.create(null),i.appStates,W.appStates);for(var e2 in d2){if(!Z(i.appStates[e2],W.appStates[e2])){return false;}}return true;}function _(i,j,d2){var e2=Object.create(null);for(var f2=i;f2.level>0;f2=e.mRoutingTree[f2.parentRoute]){if(!f2.noKey){e2["keys"+f2.level]=j[f2.level];}}var g2=!f(d2);var h2=i.sRouteName+(g2?"query":"");if(g2){e2["query"]=d2;}return{route:h2,parameters:e2};}function a1(i){var j=_(V.identity.treeNode,V.identity.keys,V.identity.appStates);v.oRouter.navTo(j.route,j.parameters,i);}function b1(i){if(!i||!V.identity){return;}var j=function(e2,f2,g2){g2=f2?f2.getId():g2;var h2=e.componentRegistry[g2];(h2.methods.presetDisplayMode||Function.prototype)(i,e2);};for(var d2=V.identity.treeNode;d2;d2=d2.parentRoute&&e.mRoutingTree[d2.parentRoute]){if(d2.componentId){j(x.componentsDisplayed[d2.sRouteName]===1,null,d2.componentId);}else{e.mRouteToTemplateComponentPromise[d2.sRouteName].then(j.bind(null,false));}if(d2.fCLLevel===0||d2.fCLLevel===3){break;}}}function c1(i){var j;if(i){if(V||(W&&W.preset)){V={identity:i.identity,followUpNeeded:true};b1(i.displayMode);return;}if(i.identity&&$(i.identity)){return;}j=i.mode;V=i;b1(i.displayMode);delete V.displayMode;}else{j=1;}V.followUpNeeded=j<0;e.oBusyHelper.setBusyReason("HashChange",true);V.displayMode=0;if(j<0){window.history.go(j);}else{a1(j===1);}}function d1(i,j){i.text=((i.headerTitle!==j)&&j)||"";if(X&&X.linkInfos.length>i.level){X.adjustNavigationHierarchy();}}function e1(i,j){var d2=Object.create(null);if(e.oFlexibleColumnLayoutHandler){e.oFlexibleColumnLayoutHandler.adaptBreadCrumbUrlParameters(d2,i);}var e2={treeNode:i};var f2={treeNode:i,keys:W.keys.slice(0,i.level+1),appStates:d2};var g2=J(f2).then(function(){var i2=_(i,W.keys,d2);e2.fullLink=v.oRouter.getURL(i2.route,i2.parameters);});j.push(g2);e2.navigate=function(i2){e.oBusyHelper.setBusy(g2.then(function(){p1(f2,false,i2);}));};var h2=i.getPath(2,f2.keys);e2.adaptBreadCrumbLink=function(i2){g2.then(function(){var n2=H.getInstance();var o2=n2.hrefForAppSpecificHash?n2.hrefForAppSpecificHash(e2.fullLink):"#/"+e2.fullLink;i2.setHref(o2);});var j2=function(){d1(i,i2.getText());};if(!e2.bLinkAttached){e2.bLinkAttached=true;var k2=i2.getBindingInfo("text")||{};k2.events={change:j2};}var l2=i2.getElementBinding();var m2=l2&&l2.getPath();if(m2===h2){j2();}else{i2.bindElement({path:h2,canonicalRequest:!e.bCreateRequestsCanonical});}};return e2;}function f1(i,j){var d2={title:j.treeNode.headerTitle||"",icon:j.treeNode.titleIconUrl||"",subtitle:j.treeNode.text,intent:i+j.fullLink};return d2;}function g1(){var j=[];var d2=[];var e2=e.oFlexibleColumnLayoutHandler&&e.oFlexibleColumnLayoutHandler.hasNavigationMenuSelfLink(W);for(var f2=e2?W.treeNode:e.mRoutingTree[W.treeNode.parentRoute];f2;f2=e.mRoutingTree[f2.parentRoute]){var g2=e1(f2,d2);j[f2.level]=g2;}var h2=Promise.all(d2);var i2=location.hash;var j2=i2.indexOf("?");var k2=(j2!==-1&&j2<i2.indexOf("&"))?"?":"&";var l2=i2.split(k2)[0]+"&/";var m2=function(){e.oShellServicePromise.then(function(n2){n2.setHierarchy([]);h2.then(function(){var o2=[];for(var i=j.length-1;i>=0;i--){o2.push(f1(l2,j[i]));}n2.setHierarchy(o2);});}).catch(function(){L.warning("No ShellService available");});};X={linkInfos:j,adjustNavigationHierarchy:m2};m2();}function h1(){return X.linkInfos;}function i1(i){var j=W;if(V&&V.identity&&!V.followUpNeeded){W=V.identity;}else{W=Object.create(null);var d2=i.getParameter("config");var e2=k(d2.name);W.treeNode=e.mRoutingTree[e2];var f2=i.getParameter("arguments");W.appStates=f2["?query"]||Object.create(null);W.keys=[""];for(var g2=W.treeNode;g2.level>0;g2=e.mRoutingTree[g2.parentRoute]){W.keys[g2.level]=g2.noKey?"":f2["keys"+g2.level];}}W.previousIdentity=j;W.componentsDisplayed=Object.create(null);W.componentsDisplayed[W.treeNode.sRouteName]=1;g1();}function j1(i,j){var d2={identity:{treeNode:W.treeNode,keys:W.keys,appStates:d(Object.create(null),W.appStates)},mode:1};if(Array.isArray(j)&&j.length<2){j=j[0];}if(j){d2.identity.appStates[i]=j;}else{delete d2.identity.appStates[i];}c1(d2);}var k1;function l1(i,j,d2,e2){if(!i){E1(j);return;}var f2=q1(null,i,true,true);e.oBusyHelper.setBusy(f2.then(function(g2){g2.appStates=Object.create(null);var h2;if(g2.treeNode.fCLLevel===0||g2.treeNode.fCLLevel===3){h2=J(g2);}else{h2=e.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,g2);}if(!j&&e2&&e2.bIsCreate&&e2.bIsDraft&&!e2.bIsDraftModified){k1={index:y.length,path:i.getPath(),identity:g2,displayMode:u1()};}return h2.then(function(){p1(g2,j,d2);});}));}function m1(j){if(!k1||k1.path!==j.getPath()){return null;}var d2;var e2=function(k2,i){return k2!==d2.identity.keys[i];};for(var i=k1.index+1;i<y.length;i++){d2=y[i];if(d2.identity.treeNode.level<k1.identity.treeNode.level||k1.identity.keys.some(e2)){return null;}}var f2=0;for(var g2=x;g2.iHashChangeCount!==k1.index;g2=y[g2.backTarget]){if(g2.iHashChangeCount<k1.index){return null;}f2--;}var h2=y[k1.index].identity;var i2={treeNode:h2.treeNode,keys:h2.keys,appStates:Object.create(null)};var j2=c1.bind(null,{identity:i2,mode:f2,displayMode:k1.displayMode});if(h2.treeNode.fCLLevel===0||h2.treeNode.fCLLevel===3){d(i2.appStates,h2.appStates);return Promise.resolve(j2);}return e.oFlexibleColumnLayoutHandler.getSpecialDraftCancelPromise(W,h2,i2.appStates).then(function(){return j2;});}function n1(i,d2){var e2=r.determineNavigationPath(i);var f2={keys:["",e2.key],appStates:Object.create(null)};var g2=p1.bind(null,f2,true,d2);if(W.treeNode.level===1){f2.treeNode=W.treeNode;d(f2.appStates,W.appStates);return Promise.resolve(g2);}var h2=R(W.treeNode,2);var i2=h2.map(function(j){if(j.noKey){return Promise.resolve(true);}if(!j.isDraft){return Promise.resolve(W.keys[j.level]);}var k2=j.getPath(2,W.keys);var l2=e.oApplicationProxy.getSiblingPromise(k2);return l2.then(function(i){e2=r.determineNavigationPath(i,j.navigationProperty);return e2.key;},Function.prototype);});var j2=Promise.all(i2);return j2.then(function(k2){var l2=e.mEntityTree[e2.entitySet];for(var j=0;k2[j];j++){l2=h2[j];f2.keys.push(l2.noKey?"":k2[j]);}f2.treeNode=l2;if(l2===W.treeNode){d(f2.appStates,W.appStates);return g2;}var m2=e.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,f2);return m2.then(function(){return g2;});});}function o1(i,j){if((i&&i.treeNode)!==j.treeNode){return Promise.resolve(false);}if(e.oFlexibleColumnLayoutHandler&&!e.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(i,j)){return Promise.resolve(false);}var d2=true;var e2=i.treeNode.sRouteName;for(var f2=i.treeNode;f2.level>0;f2=e.mRoutingTree[f2.parentRoute]){var g2=f2.noKey||i.keys[f2.level]===j.keys[f2.level];if(!g2&&f2.noOData){return Promise.resolve(false);}d2=d2&&g2;if(f2.noOData){e2=f2.parentRoute;}}if(d2){return Promise.resolve(true);}var h2=e.mRoutingTree[e2];var i2=i.keys.slice(0,h2.level+1);var j2=j.keys.slice(0,h2.level+1);var k2=h2.getPath(2,i2);var l2=h2.getPath(2,j2);return e.oApplicationProxy.areTwoKnownPathesIdentical(k2,l2,h2.level===1);}function p1(i,j,d2){var e2=y[x.backTarget];var f2=-1;if(i.treeNode.level===0||(e.oFlexibleColumnLayoutHandler&&i.treeNode.fCLLevel===0)){for(;e2.backTarget>0&&e2.identity.treeNode.level>i.treeNode.level;f2--){e2=y[e2.backTarget];}}var g2=o1(e2&&e2.identity,i);var h2=g2.then(function(i2){var j2=i2?f2:(0+!!j);var k2={identity:i,mode:j2,displayMode:d2};c1(k2);});e.oBusyHelper.setBusy(h2);return h2;}function q1(i,j,d2,e2){if(!j){return e2?Promise.resolve({treeNode:e.mRoutingTree["root"],keys:[""]}):Promise.reject();}i=i||W.treeNode;var f2=r.determineNavigationPath(j);var g2=(i.level&&i.entitySet===f2.entitySet)?i:i.children.indexOf(f2.entitySet)>=0&&e.mEntityTree[f2.entitySet];if(g2){var h2=W.keys.slice(0,g2.level);h2.push(f2.key);return Promise.resolve({treeNode:g2,keys:h2});}if(d2){var i2=e.oAppComponent.getModel();var j2=i2.getMetaModel();var k2=j2.getODataEntitySet(f2.entitySet);var l2=j2.getODataEntityType(k2.entityType);var m2;var n2=i.children.some(function(p2){var q2=e.mEntityTree[p2];m2=q2.navigationProperty;if(!m2){return false;}var r2=j2.getODataAssociationEnd(l2,m2);return!!r2&&r2.multiplicity.endsWith("1");});if(n2){return new Promise(function(p2,q2){i2.createBindingContext(m2,j,null,function(r2){var s2=r2&&q1(i,r2,false);if(s2){s2.then(p2,q2);}else{q2();}});});}}if(e2&&i.level>0){var o2=e.mRoutingTree[i.parentRoute];return q1(o2,j,d2,true);}return Promise.reject();}function r1(i,j,d2){var e2={treeNode:i,keys:d2||W.keys.slice(0,i.level+1),appStates:j};if(i.fCLLevel===0||i.fCLLevel===3){return J(e2);}return e.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,e2);}function s1(i){var j=q1(e.mRoutingTree["root"],i,false,true);var d2=j.then(function(e2){e2.appStates=Object.create(null);var f2;if(e2.treeNode===W.treeNode){Object.assign(e2.appStates,W.appStates);f2={identity:e2,mode:1,displayMode:1};c1(f2);return null;}var g2=r1(e2.treeNode,e2.appStates);return g2.then(p1.bind(null,e2,true,1));});e.oBusyHelper.setBusy(d2);return d2;}function t1(i){var j;var d2=0;for(j=x;j.backTarget>0&&(!j.identity||j.identity.treeNode.level>i);d2++){j=y[j.backTarget];}if(!w&&(d2===0||j.identity.treeNode.level>i)){window.history.go(-d2-1);return;}var e2=-d2||1;var f2=V1(i);var g2={treeNode:f2,keys:W.keys.slice(0,f2.level+1),appStates:Object.create(null)};var h2=r1(g2.treeNode,g2.appStates).then(function(){if(e2<0&&(g2.treeNode.fCLLevel===1||g2.treeNode.fCLLevel===2)&&j.identity.treeNode===g2.treeNode){for(;j.backTarget>0&&!e.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(j.identity,g2);e2--){j=y[j.backTarget];if(j.identity.treeNode!==g2.treeNode){break;}}}var i2={identity:g2,mode:e2,displayMode:g2.treeNode.isDraft?6:1};c1(i2);});e.oBusyHelper.setBusy(h2);}function u1(){var i=e.componentRegistry[W.treeNode.componentId];var j=i.utils.getTemplatePrivateModel();var d2=j.getProperty("/objectPage/displayMode")||0;return d2;}function v1(i,j,d2,e2,f2){var g2=W.keys.slice(0,i.level);g2.push(j?d2:"");var h2=Object.create(null);var i2=r1(i,h2,g2);e.oBusyHelper.setBusy(i2.then(function(){var j2={treeNode:i,keys:g2,appStates:h2};p1(j2,e2,f2);}));}function w1(d2,e2,f2,g2,h2){var i2;var j2=true;for(var i=0;i<d2.children.length&&!i2;i++){var k2=d2.children[i];var l2=e.mEntityTree[k2];if(l2[d2.level?"navigationProperty":"sRouteName"]===e2){i2=l2.sRouteName;j2=!l2.noKey;}}var m2=!i2&&f2&&d2.embeddedComponents[f2];if(m2){for(var j=0;j<m2.pages.length&&!i2;j++){var n2=m2.pages[j];if(n2.navigationProperty===e2){i2=d2.sRouteName+"/"+f2+"/"+e2;j2=!(n2.routingSpec&&n2.routingSpec.noKey);}}}if(i2){var o2=e.mRoutingTree[i2];v1(o2,j2,g2,h2,u1());}}function x1(i,j,d2,e2){var f2=q1(i,j,true,false);e.oBusyHelper.setBusy(f2.then(function(g2){var h2=e2?e2>0:!!e.oFlexibleColumnLayoutHandler&&!e.oFlexibleColumnLayoutHandler.isNewHistoryEntryRequired(i);g2.appStates=Object.create(null);var i2=r1(g2.treeNode,g2.appStates,g2.keys);return i2.then(p1.bind(null,g2,h2,d2));}));}function y1(){return!!V;}function z1(i){L.info("Navigate back");if(x.backTarget&&n(h.getPreviousHash()||"")!==n(x.hash)){e.oBusyHelper.setBusyReason("HashChange",true);}x.LeaveByBack=!x.forwardingInfo;if(x.LeaveByBack){x.backSteps=i;}window.history.go(-i);}function A1(j,d2,e2,f2){var g2=e.oAppComponent.getObjectPageHeaderType()==="Dynamic"&&e.oAppComponent.getObjectPageVariantManagement()==="VendorLayer";var h2;var i2=new U(window.location.href);if(i2.mParams["sap-ui-layer"]){var j2=i2.mParams["sap-ui-layer"];for(var i=0;i<j2.length;i++){if(j2[i].toUpperCase()==="VENDOR"){h2=true;break;}}}j=n(j||"");L.info("Navigate to hash: "+j);if(j===x.hash){L.info("Navigation suppressed since hash is the current hash");return;}x.targetHash=j;if(x.backTarget&&n(h.getPreviousHash()||"")===j){z1(1);return;}if(x.oEvent){var k2=x.oEvent.getParameter("config").viewLevel;}if(g2&&h2){if(!f2){if(!e.oFlexibleColumnLayoutHandler){b.clearVariantParameterInURL();}else{if(k2>=e2){if(e2===1){b.clearVariantParameterInURL();}else if(e2===2){var l2;for(var m2 in e.componentRegistry){if(e.componentRegistry[m2].viewLevel===2){l2=e.componentRegistry[m2];break;}}var n2=l2.oController.byId("template::ObjectPage::ObjectPageVariant");b.clearVariantParameterInURL(n2);}}}}}e.oBusyHelper.setBusyReason("HashChange",true);x.LeaveByReplace=d2;if(d2){v.oHashChanger.replaceHash(j);}else{v.oHashChanger.setHash(j);}}function B1(i,j,d2,e2,f2,g2){var h2=j.then(function(i2){i=l(i,i2);if(f2){x.backwardingInfo={count:f2.count,index:f2.index,targetHash:n(i)};z1(f2.count);}else{A1(i,e2,d2,g2);}return i;});e.oBusyHelper.setBusy(h2);return h2;}function C1(i,j){var d2,e2,f2,g2,h2,i2;d2=0;e2=x.iHashChangeCount;f2=null;for(g2=x;g2.oEvent;d2++){h2=g2.oEvent.getParameter("config");i2=h2?h2.viewLevel:-1;if(i2===0||(i&&n(g2.hash).indexOf(j)!==0)){f2={count:d2,index:e2,routeName:h2?h2.name:undefined};break;}if(g2.backTarget===0){if(i){f2={count:d2+1,index:e2,routeName:undefined};}break;}e2=g2.backTarget;g2=y[e2];}return f2;}function D1(i,j,d2){if(d2===0){return C1();}var e2=y[x.backTarget];return e2&&e2.hash&&n(e2.hash.split("?")[0])===n(j)&&{count:1,index:x.backTarget};}function E1(i){if(W.treeNode.level===0){return;}var j={treeNode:e.mRoutingTree["root"],keys:[""],appStates:Object.create(null)};var d2=e.oFlexibleColumnLayoutHandler?e.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(W,j):J(j);d2.then(p1.bind(null,j,i));e.oBusyHelper.setBusy(d2);}function F1(i){var j=e.mEntityTree[i.entitySet].sRouteName;var d2=e.mRouteToTemplateComponentPromise[j];return[d2];}function G1(j,d2){var e2=x.componentsDisplayed;var f2=function(h2){var i2=e.componentRegistry[h2.getId()];(i2.methods.presetDisplayMode||Function.prototype)(d2,e2[i2.route]===1);};for(var i=0;i<j.length;i++){var g2=j[i];g2.then(f2);}}function H1(i){var j=i&&e.mEntityTree[i.entitySet];var d2=j?j.level:1;return d2;}function I1(j,d2){var e2=e.oApplicationProxy.getHierarchySectionsFromCurrentHash();var f2=j;for(var i=d2-2;i>=0;i--){f2=e2[i]+"/"+f2;}return"/"+f2;}function J1(i,j,d2,e2,f2){var g2={};var h2=e.oFlexibleColumnLayoutHandler&&e.oFlexibleColumnLayoutHandler.getFCLAppStatesPromise(i,g2);var i2=K(i,g2,j);var j2=(h2?Promise.all([h2,i2]):i2).then(A.bind(null,g2));var k2=D1(e2,j,d2);var l2=B1(j,j2,d2,e2,k2,f2);e.oBusyHelper.setBusy(l2);return l2;}function K1(j,d2,e2,f2,g2,h2){var i2;var j2,k2,l2;var m2=[];if(typeof j==="string"){i2=j;var n2=n(i2);if(n2==="/"){j2=0;}else{l2=n2.split("/");j2=l2.length-1;}switch(j2){case 0:k2="root";break;case 1:k2=l2[1].split("(")[0];break;default:k2="";var o2="";for(var i=0;i<j2;i++){var p2=l2[i+1];var q2=p2.indexOf("(");if(q2>0){p2=p2.substring(0,q2);}k2=k2+o2+p2;o2="/";}k2=k2.replace("---","/");}}else{var r2=r.determineNavigationPath(j,d2);j2=H1(r2);i2=r2.path;m2=F1(r2);k2=e.mEntityTree[r2.entitySet].sRouteName;}if(d2){i2=I1(i2,j2);}G1(m2,f2||0);if(g2){i2=p(i2,g2);A1(i2,e2,j2,h2);return Promise.resolve(i2);}else{return J1(k2,i2,j2,e2,h2);}}function L1(i,j,d2,e2,f2){return K1(i,j,d2,e2,undefined,f2);}function M1(i,j){x.componentsDisplayed[i]=j;var d2=e.mRoutingTree[i];var e2=d2.componentId;if(e2){var f2=e.componentRegistry[e2];var g2=f2.utils.getTemplatePrivateModel();g2.setProperty("/generic/isActive",j===1);}}function N1(i){var j,d2,e2,f2,g2,h2=null,i2,j2;if(i){j=i.entitySet;d2=i.text;h2=i.icon;j2=i.description;}if(j){i2=e.oAppComponent.getModel().getMetaModel();if(i2){e2=i2.getODataEntitySet(j);f2=i2.getODataEntityType(e2.entityType);g2=f2["com.sap.vocabularies.UI.v1.HeaderInfo"];}if(g2&&g2.TypeImageUrl&&g2.TypeImageUrl.String){h2=g2.TypeImageUrl.String;}}e.oTemplatePrivateGlobalModel.setProperty("/generic/messagePage",{text:d2,icon:h2,description:j2});if(e.oFlexibleColumnLayoutHandler){e.oFlexibleColumnLayoutHandler.displayMessagePage(i,x.componentsDisplayed);}else{var k2=v.oRouter.getTargets();k2.display("messagePage");for(var l2 in x.componentsDisplayed){M1(l2,5);}}O(i);}function O1(){if(!f(M)){var j=null;for(var i=0;!j;i++){j=M[i];}M={};N1(j);}}function P1(i){if(v.oTemplateContract.oFlexibleColumnLayoutHandler){i.viewLevel=i.viewLevel||0;M[i.viewLevel]=i;var j=Promise.all([z,v.oTemplateContract.oPagesDataLoadedObserver.getProcessFinished(true)]);j.then(O1);j.then(e.oBusyHelper.setBusyReason.bind(null,"HashChange",false));return;}N1(i);e.oBusyHelper.setBusyReason("HashChange",false);}function Q1(){var i=[];var j=W.componentsDisplayed||x.componentsDisplayed;for(var d2 in e.componentRegistry){var e2=e.componentRegistry[d2];if(j[e2.route]===1){i.push(d2);}}return i;}function R1(){var i=[];for(var j in e.componentRegistry){i.push(j);}return i;}function S1(i){return W.keys.slice(0,i+1);}function T1(j){var d2="";var e2=x.hash;var f2=e2.split("/");var g2="";for(var i=0;i<=j;i++){d2=d2+g2+f2[i];g2="/";}return d2;}function U1(){return x;}function V1(i){var j=W.treeNode;for(;j.level>i;){j=e.mRoutingTree[j.parentRoute];}return j;}function W1(i,j,d2){var e2=d2.getId();var f2=e.componentRegistry[e2];var g2=f2.route;var h2=j.componentsDisplayed[g2];var i2=h2===1;x.componentsDisplayed[g2]=1;var j2=d2.onActivate(i,i2)||Promise.resolve();return Promise.all([j2,f2.viewRegistered]).then(function(){f2.aKeys=S1(f2.viewLevel);});}function X1(i,j,d2){return W1(i,j,d2).then(Q);}function Y1(i,j,d2){var e2={};if(j||d2){var f2=i.level;for(var g2=0;g2<f2;g2++){e2[g2]=e.oPaginatorInfo[g2];}}e.oPaginatorInfo=e2;}function Z1(i){return e.oApplicationProxy.getAlternativeContextPromise(i);}function $1(i){i1(i);W.preset=true;if(e.oFlexibleColumnLayoutHandler){e.oFlexibleColumnLayoutHandler.handleBeforeRouteMatched(W);}}function _1(j){if(V&&V.followUpNeeded&&V.identity&&!$(V.identity)){c1();return;}e.oBusyHelper.setBusyReason("HashChange",false);var d2=W.treeNode.level;var e2=n(v.oHashChanger.getHash()||"");L.info("Route matched with hash "+e2);var f2;if(x.backwardingInfo){f2=x;f2.identity=W.previousIdentity;delete W.previousIdentity;y.push(f2);var g2=f2.iHashChangeCount+1;x={iHashChangeCount:g2,forwardingInfo:{bIsProgrammatic:true,bIsBack:true,iHashChangeCount:g2,targetHash:f2.backwardingInfo.targetHash,componentsDisplayed:f2.componentsDisplayed},backTarget:y[f2.backwardingInfo.index].backTarget,componentsDisplayed:Object.create(null)};}if(x.forwardingInfo&&x.forwardingInfo.targetHash&&x.forwardingInfo.targetHash!==e2){x.hash=e2;var h2=x.forwardingInfo.targetHash;delete x.forwardingInfo.targetHash;A1(h2,true);return;}var i2=false;for(var i=0;i<e.aStateChangers.length;i++){var j2=e.aStateChangers[i];if(j2.isStateChange(W.appStates)){i2=true;}}if(i2){V=null;x.hash=e2;return;}e.oTemplatePrivateGlobalModel.setProperty("/generic/routeLevel",d2);var k2=x.forwardingInfo;delete x.forwardingInfo;if(!k2){k2={componentsDisplayed:x.componentsDisplayed};var l2=x.iHashChangeCount;k2.iHashChangeCount=l2+1;var m2=h.getDirection();if(V){k2.bIsProgrammatic=!!V.identity;k2.bIsBack=V.mode<0;if(k2.bIsBack){x.backSteps=0-V.mode;}k2.bIsForward=!k2.bIsBack&&(m2===g.Forwards);x.LeaveByReplace=V.mode===1;}else{k2.bIsProgrammatic=(e2===x.targetHash);k2.bIsBack=!!(x.LeaveByBack||(!k2.bIsProgrammatic&&(m2===g.Backwards)));k2.bIsForward=!k2.bIsBack&&(m2===g.Forwards);x.LeaveByReplace=k2.bIsProgrammatic&&x.LeaveByReplace;}x.LeaveByBack=k2.bIsBack;f2=x;f2.identity=W.previousIdentity;delete W.previousIdentity;y.push(f2);x={iHashChangeCount:k2.iHashChangeCount,componentsDisplayed:Object.create(null)};if(f2.LeaveByReplace){x.backTarget=f2.backTarget;}else if(k2.bIsBack){var n2=f2.backTarget;for(var o2=f2.backSteps||1;o2>0;o2--){n2=y[n2].backTarget;}x.backTarget=n2;}else{x.backTarget=l2;}}V=null;x.oEvent=j;x.hash=e2;var p2=function(s2){if(s2){l1(s2.context,true,s2.iDisplayMode);return;}Y1(W.treeNode,k2.bIsProgrammatic,k2.bIsBack);if(e.oFlexibleColumnLayoutHandler){z=e.oFlexibleColumnLayoutHandler.handleRouteMatched(k2);}else{if(d2===0||k2.bIsBack||!k2.bIsProgrammatic){e.oApplicationProxy.setEditableNDC(false);}var t2=e.mRouteToTemplateComponentPromise[W.treeNode.sRouteName];z=t2.then(function(u2){return X1(W.treeNode.getPath(2,W.keys),k2,u2);});}e.oBusyHelper.setBusy(z);};if(k2.bIsBack){var q2=V1(1);var r2=q2&&q2.getPath(2,W.keys);e.oBusyHelper.setBusy(Z1(r2).then(p2));}else{p2();}}function a2(i){if(W&&W.preset){delete W.preset;}else{i1(i);}i=m({},i);var j=e.oStatePreserversAvailablePromise.then(_1.bind(null,i),e.oBusyHelper.setBusyReason.bind(null,"HashChange",false));e.oBusyHelper.setBusy(j);c2();}function b2(){W={appStates:Object.create(null),keys:[]};P1({title:e.getText("ST_ERROR"),text:e.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),description:""});}function c2(){var i;for(var j=W.treeNode;j;j=i){var d2=j.componentId&&e.componentRegistry[j.componentId];if(d2){var e2=d2.utils.getTemplatePrivateModel();e2.setProperty("/generic/currentActiveChildContext",j.selectedPath);}i=e.mRoutingTree[j.parentRoute];if(i){i.selectedPath=j.getPath(3,W.keys);}}}if(e.sRoutingType==="f"){v.oRouter.attachBeforeRouteMatched($1);}v.oRouter.attachRouteMatched(a2);v.oRouter.attachBypassed(b2);v.concatPathAndAppStates=p;v.navigate=A1;v.navigateBack=z1.bind(null,1);v.activateOneComponent=W1;v.afterActivation=Q;v.addUrlParameterInfoForRoute=K;v.getApplicableStateForIdentityAddedPromise=J;v.setVisibilityOfRoute=M1;v.getActiveComponents=Q1;v.getAllComponents=R1;v.getRootComponentPromise=E;v.getActivationInfo=U1;v.getCurrentKeys=S1;v.getCurrentHash=T1;v.getAppTitle=F;v.navigateByExchangingQueryParam=j1;v.navigateToSubContext=l1;v.getSwitchToSiblingPromise=n1;v.getSpecialDraftCancelPromise=m1;v.getCurrentIdentity=Y;v.navigateToIdentity=p1;v.navigateAfterActivation=s1;v.navigateUpAfterDeletion=t1;v.navigateToChild=w1;v.navigateFromNodeAccordingToContext=x1;v.isNavigating=y1;v.getLinksToUpperLayers=h1;v.setTextForTreeNode=d1;v.createComponentInstance=q;return{navigateToRoot:E1,navigateToContext:L1,navigateToMessagePage:P1,navigateBack:z1.bind(null,1)};}function u(e,i){var j={oAppComponent:i.oAppComponent,oRouter:i.oAppComponent.getRouter(),oTemplateContract:i,mRouteToComponentResolve:{}};if(j.oRouter){j.oHashChanger=j.oRouter.getHashChanger();}else{j.oHashChanger=H.getInstance();}i.oNavigationControllerProxy=j;var F=new Promise(function(R){j.fnInitializationResolve=R;});i.oBusyHelper.setBusy(F);d(e,s(i,j));d(j,e);j.oRouter._oViews._getViewWithGlobalId=function(v){v.viewName=v.name||v.viewName;for(var w in i.componentRegistry){if(i.componentRegistry[w].route===v.viewName){return i.componentRegistry[w].oComponent.getComponentContainer();}}var R=j.oRouter.getRoute(v.viewName);var x;if(R&&R._oConfig){x=q(i,R._oConfig,j.mRouteToComponentResolve[v.viewName]);}else{x=sap.ui.view({viewName:v.viewName,type:v.type,height:"100%"});}if(v.viewName==="root"){i.rootContainer=x;}return x.loaded();};r.startupRouter(j);}var N=B.extend("sap.suite.ui.generic.template.lib.NavigationController",{metadata:{library:"sap.suite.ui.generic.template"},constructor:function(e){B.apply(this,arguments);t.testableStatic(u,"NavigationController")(this,e);}});N._sChanges="Changes";return N;});