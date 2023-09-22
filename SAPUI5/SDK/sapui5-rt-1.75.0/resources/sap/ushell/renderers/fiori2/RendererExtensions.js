// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/EventHub'],function(E){"use strict";function _(C){setTimeout(function(){sap.ui.getCore().getEventBus().publish("sap.ushell","rendererLoaded",{rendererName:"fiori2"});},0);E.emit("RendererLoaded",{rendererName:"fiori2"});}function a(x,D){setTimeout(function(){sap.ui.getCore().getEventBus().publish("sap.ushell.renderers.fiori2.Renderer",x,D);},0);}sap.ushell.renderers.fiori2.utils={};sap.ushell.renderers.fiori2.utils.publishExternalEvent=a;sap.ushell.renderers.fiori2.utils.init=_;function b(I,L,x){sap.ushell.Container.getRenderer("fiori2").showSubHeader(I.getId(),false,[L,x]);}function c(I,L,x){sap.ushell.Container.getRenderer("fiori2").hideSubHeader(I.getId(),false,[L,x]);}function d(I,L,x){sap.ushell.Container.getRenderer("fiori2").showHeaderItem(I.getId(),false,[L,x]);}function e(I,L,x){sap.ushell.Container.getRenderer("fiori2").hideHeaderItem(I.getId(),false,[L,x]);}function f(B,L,x){sap.ushell.Container.getRenderer("fiori2").showActionButton(B.getId(),false,[L,x]);}function g(B,L,x){sap.ushell.Container.getRenderer("fiori2").hideActionButton(B.getId(),false,[L,x]);}function h(C,L,x){sap.ushell.Container.getRenderer("fiori2").showLeftPaneContent(C.getId(),false,[L,x]);}function i(L,x){sap.ushell.Container.getRenderer("fiori2").hideLeftPaneContent(false,[L,x]);}function j(I,L,x){sap.ushell.Container.getRenderer("fiori2").showFloatingActionButton(I.getId(),false,[L,x]);}function k(I,L,x){sap.ushell.Container.getRenderer("fiori2").hideFloatingActionButton(I.getId(),false,[L,x]);}function l(I,L,x){sap.ushell.Container.getRenderer("fiori2").showHeaderEndItem(I.getId(),false,[L,x]);}function m(I,L,x){sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem(I.getId(),false,[L,x]);}function n(){return sap.ushell.Container.getRenderer("fiori2").getModelConfiguration();}function o(I,L,T,x){var y=sap.ui.getCore().byId(I);if(x){sap.ushell.Container.getRenderer("fiori2").showHeaderItem(y.getId(),T,[L]);}}function p(C,S){sap.ushell.Container.getRenderer("fiori2").addEndUserFeedbackCustomUI(C,S);}function q(x){sap.ushell.Container.getRenderer("fiori2").addUserPreferencesEntry(x);}function r(T){sap.ushell.Container.getRenderer("fiori2").setHeaderTitle(T);}function s(L,V){sap.ushell.Container.getRenderer("fiori2").setLeftPaneVisibility(L,V);}function t(H){sap.ushell.Container.getRenderer("fiori2").setHeaderHiding(H);}function u(F){sap.ushell.Container.getRenderer("fiori2").setFooter(F);}function v(){sap.ushell.Container.getRenderer("fiori2").removeFooter();}function R(){this.addHeaderItem=d;this.setHeaderItemVisibility=o;this.addSubHeader=b;this.removeSubHeader=c;this.addHeaderEndItem=l;this.removeHeaderItem=e;this.removeHeaderEndItem=m;this.addEndUserFeedbackCustomUI=p;this.addOptionsActionSheetButton=f;this.removeOptionsActionSheetButton=g;this.setFooter=u;this.removeFooter=v;this.addUserPreferencesEntry=q;this.setHeaderTitle=r;this.setHeaderHiding=t;this.LaunchpadState={App:"app",Home:"home"};this.addFloatingActionButton=j;this.removeFloatingActionButton=k;this.setLeftPaneContent=h;this.removeLeftPaneContent=i;this.setLeftPaneVisibility=s;this.getConfiguration=n;}var w=new R();return w;},true);