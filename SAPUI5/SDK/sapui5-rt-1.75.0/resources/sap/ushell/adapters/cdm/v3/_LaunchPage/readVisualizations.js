// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ushell/adapters/cdm/v3/_LaunchPage/readHome"],function(u,r){"use strict";var a={};a.getMap=function(s){return s.visualizations;};a.get=function(s,i){return s.visualizations[i];};a.getTypeMap=function(s){return s.vizTypes;};a.getType=function(s,i){return s.vizTypes[i];};a.getTypeId=function(v){return v.vizType;};a.getConfig=function(v){return v.vizConfig;};a.getTarget=function(v){var V=this.getConfig(v);return V&&V["sap.flp"]&&V["sap.flp"].target;};a.getAppId=function(v){var t=this.getTarget(v);return t&&t.appId;};a.getInboundId=function(v){var t=this.getTarget(v);return t&&t.inboundId;};a.getOutbound=function(v,i){var o;o={semanticObject:i.semanticObject,action:i.action,parameters:this.getTarget(v).parameters||{}};o.parameters["sap-ui-app-id-hint"]={value:{format:"plain",value:this.getAppId(v)}};return o;};a.startsExternalUrl=function(v){var t=this.getTarget(v);return t&&t.type==="URL";};a.getAppDescriptor=function(s,i){return s.applications&&s.applications[i];};a.getKeywords=function(c){var C=u.clone(c);C.splice(2,1);C.splice(0,1);return u.getNestedObjectProperty(C,["sap|app.tags.keywords","sap|app.tags.keywords"]);};a.getTitle=function(c){return u.getNestedObjectProperty(c,["title","sap|app.title","title","sap|app.title"]);};a.getSubTitle=function(c){return u.getNestedObjectProperty(c,["subTitle","sap|app.subTitle","subTitle","sap|app.subTitle"]);};a.getIcon=function(c){return u.getNestedObjectProperty(c,["icon","sap|ui.icons.icon","icon","sap|ui.icons.icon"]);};a.getInfo=function(c){return u.getNestedObjectProperty(c,["info","sap|app.info","info","sap|app.info"]);};a.getShortTitle=function(c){var C=u.clone(c);C.splice(0,1);return u.getNestedObjectProperty(C,["sap|app.shortTitle","shortTitle","sap|app.shortTitle"]);};a.getCdmParts=function(s,t){var v=this.get(s,r.getTileVizId(t))||{};var V=this.getConfig(v);var A=this.getAppDescriptor(s,this.getAppId(v));var i=r.getInbound(A,this.getInboundId(v));if(i){i=i.inbound;}return[t,V,i,A];};return a;},true);