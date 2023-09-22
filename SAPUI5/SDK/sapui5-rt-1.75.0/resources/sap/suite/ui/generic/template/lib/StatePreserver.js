sap.ui.define(["sap/ui/base/Object","sap/suite/ui/generic/template/lib/testableHelper","sap/base/Log","sap/base/util/extend","sap/base/util/deepExtend","sap/base/util/isEmptyObject"],function(B,t,L,e,d,a){"use strict";var c=(sap&&sap.ushell&&sap.ushell.Container)?sap.ushell.Container.getService("CrossApplicationNavigation"):(function(){var i=0;var r={done:function(b){b(Object.create(null));},fail:function(){}};return{createEmptyAppState:function(){return{getKey:function(){i++;return""+i;},setData:Function.prototype,save:function(){return Promise.resolve();}};},getAppState:function(){return r;}};})();t.testableStatic(function setCrossAppNavService(s){c=s;},"StatePreserver_setCrossAppNavService");function g(T,s){var r="";var A=Promise.resolve();var n=null;var b=false;var S=null;var f=null;var l,h;var C=Object.create(null);var o={};var j={};function I(){C.permanentEntries=Object.create(null);C.sessionEntries=Object.create(null);C.pageEntries=Object.create(null);C.allEntries=Object.create(null);}I();function k(i){I();for(var N in i){var O=d({},i[N]);C.allEntries[N]=O;var P=O.lifecycle||Object.create(null);if(P.permanent){C.permanentEntries[N]=O;}else if(P.session){C.sessionEntries[N]=O;}if(P.page||P.pagination){C.pageEntries[N]=O;}}return C;}function m(i,P){if(P===i){return;}var N=P.next.next;P.next.next=i.next;i.next=P.next;P.next=N;}function p(i,N,P){if(a(N)){return{appStateKey:""};}var O=JSON.stringify(N);var Q=0;var U;for(U=i;U.next&&Q<10;Q++){if(U.next.serialize===O){m(i,U);return{appStateKey:i.next.appStateKey};}U=U.next;}U.next=null;var V=c.createEmptyAppState(s.oComponent.getAppComponent(),!P);var W={next:i.next,serialize:O,appStateKey:V.getKey()};V.setData(N);V.save();i.next=W;return{appStateKey:W.appStateKey};}function q(){var i=p(j,C.sessionEntries,false);var N=Object.create(null);if(i.appStateKey){N.sessionAppStateKey=i.appStateKey;}if(!a(C.permanentEntries)){N.permanentEntries=C.permanentEntries;}S=p(o,N,true);b=false;if(f===S.appStateKey){S=null;}else{T.oNavigationControllerProxy.navigateByExchangingQueryParam(s.appStateName,S.appStateKey);}}function u(){if(!b){return;}var i=s.getCurrentState()||Object.create(null);k(i);q();}function v(){var N=T.componentRegistry[s.oComponent.getId()];var O=N.aKeys;var P="";var Q=N.route;for(var i=O.length-1;i>0;i--){var U=T.mRoutingTree[Q];var V=i===1?U.entitySet:U.navigationProperty;P="/"+V+(O[i]?"("+O[i]+")":"")+P;Q=U.parentRoute;}return P;}function w(P,i){return A.then(function(){var N=Object.create(null);var O=(!P||v()===P)&&l;if(O){N[s.appStateName]=O;}return N;});}function x(){if(!b){b=true;if(n){u();}else{setTimeout(u,0);}}}function y(i){r=i;S=null;l=i;}function z(i,N,U){if(!N){return;}for(var O in N){var P=N[O];if(U||P.lifecycle.page){i[O]=P;}}}function R(i,N,O){k(O);var P=Object.create(null);for(var Q in O){P[Q]=O[Q].data;}s.applyState(P,i);if(n){n();n=null;}y(N);q();}function D(i,N,O){for(var P=i;P.next;P=P.next){if(P.next.appStateKey===O){m(i,P);return;}}var Q={next:i.next,serialize:JSON.stringify(N),appStateKey:O};i.next=Q;}function E(i,N,O,P,Q,U,V,W){if(f===null){f=O;}else if(O!==f){N();return;}if(W){var X=W.getData();D(j,X,V);z(Q,X,true);}z(Q,U,true);R(P,f,Q);i();}function F(i,N,O,P,Q,U){var V=U.getData();D(o,V,O);if(V.sessionAppStateKey){var W=c.getAppState(s.oComponent.getAppComponent(),V.sessionAppStateKey);W.done(E.bind(null,i,N,O,P,Q,V.permanentEntries,V.sessionAppStateKey));W.fail(E.bind(null,i,N,O,P,Q,V.permanentEntries,"",null));}else{E(i,N,O,P,Q,V.permanentEntries,"",null);}}function G(i){var N=T.componentRegistry[s.oComponent.getId()];var O=N.utils.getHeaderDataAvailablePromise()||Promise.resolve();return O.then(function(){return T.oApplicationProxy.areTwoKnownPathesIdentical(h,i,N.viewLevel===1);});}function H(i,N){if(i===h){N(true);return;}if(!i||!h){N(false);return;}G(i).then(N);}function J(i,N){var O=new Promise(function(P,Q){H(i,function(U){h=i;var V=Object.create(null);z(V,C[U?"allEntries":"pageEntries"],U||N);if(f===r||!f){if(f||U){z(V,C.sessionEntries,true);z(V,C.permanentEntries,true);}R(U,f,V);P();return;}if(!n){A=new Promise(function(X){n=X;});}var W=c.getAppState(s.oComponent.getAppComponent(),f);W.done(F.bind(null,P,Q,f,U,V));W.fail(Q);},Q);});return O;}function K(i){f=i[s.appStateName]||"";if(Array.isArray(f)){f=f.sort()[0]||"";}if(S){if(S.appStateKey!==f){L.error("StatePreserver: Got AppstateKey "+f+" expected "+S.appStateKey);return false;}y(f);return true;}return false;}function M(){return{isStateChange:K};}return{getUrlParameterInfo:w,stateChanged:x,applyAppState:J,getAsStateChanger:M};}return B.extend("sap.suite.ui.generic.template.lib.StatePreserver",{constructor:function(T,s){e(this,g(T,s));}});});