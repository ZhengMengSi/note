/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/model/odata/v4/ODataListBinding","sap/ui/model/odata/v4/Context","sap/ui/model/Filter","sap/ui/base/ManagedObject","sap/ui/model/ChangeReason","sap/ui/model/resource/ResourceModel","sap/ui/model/odata/v4/ODataContextBinding","sap/base/Log","sap/fe/macros/filter/EditState"],function(J,O,C,F,M,a,R,b,L,E){"use strict";var c="_$DraftModel";var A=false;var p={};function s(r,K,t){var v=typeof r==="string"?r:r.getId(),P=(p[v]=p[v]||{});P[K]=t;if(A&&!r[c]){r[c]=P;}}function g(r,K){var t=typeof r==="string"?r:r.getId();return p[t]&&p[t][K];}function d(r){var t=r.getMetaModel(),v=g(r,"aEntitySets"),w=v?Promise.resolve(v):t&&t.requestObject("/").then(function(x){var P=[];Object.keys(x).forEach(function(y){var z=x[y],B;if(z.$kind==="EntitySet"){B=t.requestObject("/"+y+"@");P.push(B.then(function(G){var H={};H["@"]=G;H["@sapui.name"]=y;return H;}));}});return Promise.all(P);});return w;}function e(r,t,v){var w=r.getModel();v=v||{$$inheritExpandSelect:false};return w.bindContext(t+"(...)",r,v);}function f(){if(!this.getProperty("IsActiveEntity")){var r=e(this,arguments[0],{$$inheritExpandSelect:true});return r.execute().then(function(t){return t;});}else{throw new Error("The activation action cannot be executed on an active document");}}function h(r){if(!this.getProperty("IsActiveEntity")){var t=e(this,arguments[0]);r=arguments[1];if(typeof r==="undefined"){r="";}t.setParameter("SideEffectsQualifier",r);return t.execute().then(function(){return t;});}else{throw new Error("The preparation action cannot be executed on an active document");}}function i(){if(!this.getProperty("IsActiveEntity")){var r=e(this,arguments[0]);return r.execute().then(function(){return r;});}else{throw new Error("The validation function cannot be executed on an active document");}}function j(r){if(this.getProperty("IsActiveEntity")){var t=e(this,arguments[0],{$$inheritExpandSelect:true});r=arguments[1];t.setParameter("PreserveChanges",r);return t.execute().then(function(v){return v;});}else{throw new Error("The edit action cannot be executed on a draft document");}}var o={"ActivationAction":f,"PreparationAction":h,"ValidationFunction":i,"EditAction":j};function k(r,t){var v=t["@"]["@com.sap.vocabularies.Common.v1.DraftRoot"]||t["@"]["@com.sap.vocabularies.Common.v1.DraftNode"];Object.keys(v).forEach(function(w){var x=v[w];if(o[w]){r["executeDraft"+w]=o[w].bind(r,x);}});}function l(r){if(g(r,"bIsDraftEnabled")===undefined){return d(r).then(function(t){var v=t.filter(function(w){var x=w["@"]||{};return(x.hasOwnProperty("@com.sap.vocabularies.Common.v1.DraftRoot")||x.hasOwnProperty("@com.sap.vocabularies.Common.v1.DraftNode"));}),I=Array.isArray(v)&&v.length>0;if(I){s(r,"aEntitySets",t);s(r,"aDraftEntitySets",v);}s(r,"bIsDraftEnabled",I);return I;});}else{return Promise.resolve(g(r,"bIsDraftEnabled"));}}function _(r){if(g(r,"bUpgraded")){L.warning("Model was already upgraded to DraftModel");return;}var t={},v={},w=-1,x=sap.ui.getCore().getLibraryResourceBundle("sap.fe.core"),y={"editStates":[{id:E.ALL.id,name:E.ALL.display},{id:E.UNCHANGED.id,name:E.UNCHANGED.display},{id:E.OWN_DRAFT.id,name:E.OWN_DRAFT.display},{id:E.LOCKED.id,name:E.LOCKED.display},{id:E.UNSAVED_CHANGES.id,name:E.UNSAVED_CHANGES.display}],"entitySets":{}},I,z=g(r,"aDraftEntitySets");s(r,"mListBindings",v);z.forEach(function(G){y.entitySets[G["@sapui.name"]]={editState:E.ALL};});I=new J(y);s(r,"oDraftAccessModel",I);r.getDraftAccessModel=n;t.bindList=r.bindList;r.bindList=function(P,G,S,H,K){var N=I.getObject("/entitySets"+P),Q;if(N){var T="";K=K||{};T=K.$expand;if(T){if(T.indexOf("DraftAdministrativeData")<0){T+=",DraftAdministrativeData";}}else{T="DraftAdministrativeData";}K.$expand=T;}arguments[4]=K;Q=t.bindList.apply(this,arguments);if(N){Q._bDraftModelUpgrade=true;v[++w]=Q;Q.destroy=(function(U){return function(){delete v[U];return O.prototype.destroy.apply(this,arguments);};})(w);}return Q;};function B(G){var H=false,P=G.getPath();if(g(r,"bUpgraded")&&P){z.forEach(function(K){var N=!H&&P.substring(P.indexOf("/")+1,P.indexOf("("))===K["@sapui.name"];if(N){H=true;k(G,K);}});}return G;}t.create=C.create;C.create=function(r,G,P,H,K){return B(t.create.apply(null,arguments));};t.createReturnValueContext=C.createReturnValueContext;C.createReturnValueContext=function(r,G,P){return B(t.createReturnValueContext.apply(null,arguments));};t.modelDestroy=r.destroy;r.destroy=function(){delete p[this.getId()];return t.modelDestroy.apply(this,arguments);};s(r,"bUpgraded",true);return true;}function u(r){return l(r).then(function(t){if(t){return _(r);}else{throw new Error("The model is not draft enabled");}});}function m(r){return l(r).then(function(t){if(t){_(r);}return t;});}function n(){return g(this,"oDraftAccessModel");}var q={};var D={upgrade:u,upgradeOnDemand:m,isDraftModel:l,EDITSTATE:E};return D;},true);