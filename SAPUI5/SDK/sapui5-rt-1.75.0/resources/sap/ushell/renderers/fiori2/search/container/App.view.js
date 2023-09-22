// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchModel','sap/ushell/renderers/fiori2/search/SearchShellHelper','sap/m/Bar','sap/ushell/renderers/fiori2/search/SearchHelper','sap/ushell/renderers/fiori2/search/controls/SearchFilterBar'],function(S,a,B,b,c){"use strict";return sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.App",{createContent:function(){var t=this;if(!this.oModel){this.oModel=sap.ushell.renderers.fiori2.search.getModelSingleton();}this.setModel(sap.ushell.resources.i18nModel,"i18n");this.oSearchResults=sap.ui.view({id:"searchContainerResultsView",tooltip:"{i18n>searchResultsView_tooltip}",viewName:"sap.ushell.renderers.fiori2.search.container.Search",type:sap.ui.core.mvc.ViewType.JS});this.oSearchResults.setModel(t.oModel);this.oSearchResults.setAppView(t);var s=new sap.m.Bar({contentLeft:[t.oSearchResults.assembleFilterButton(),t.oSearchResults.assembleDataSourceTapStrips()],contentRight:t.oSearchResults.assembleSearchToolbar()});s.addStyleClass('sapUshellSearchBar');var f=new sap.ushell.renderers.fiori2.search.controls.SearchFilterBar({visible:{parts:[{path:'/facetVisibility'},{path:'/uiFilter/rootCondition'}],formatter:function(d,r){if(!d&&r&&r.hasFilters()){return true;}return false;}}});this.oModel.parseURL();this.oPage=this.pageFactory("searchPage",this.oSearchResults,s,f);this.oSearchResults.reorgTabBarSequence();this.oPage.addEventDelegate({onAfterRendering:function(e){window.onbeforeunload=function(){t.oModel.eventLogger.logEvent({type:t.oModel.eventLogger.LEAVE_PAGE});};}});return this.oPage;},beforeExit:function(){},pageFactory:function(i,C,h,s){var t=this;var p=new sap.m.Page({id:i,customHeader:h,subHeader:s,content:[C],enableScrolling:true,showFooter:{parts:['/multiSelectionAvailable','/multiSelectionActions','/errors/length'],formatter:function(m,f,n){return m||n>0;}},showHeader:true,showSubHeader:{parts:[{path:'/facetVisibility'},{path:'/uiFilter/rootCondition'}],formatter:function(f,r){if(!f&&r&&r.hasFilters()){return true;}return false;}}});p.setModel(t.oModel);var e=["onAfterHide","onAfterShow","onBeforeFirstShow","onBeforeHide","onBeforeShow"];var d={};t.createFooter(p);jQuery.each(e,function(I,E){d[E]=jQuery.proxy(function(f){jQuery.each(this.getContent(),function(I,C){C._handleEvent(f);});},p);});p.addEventDelegate(d);if(!sap.ui.Device.system.desktop){p._bUseIScroll=true;}return p;},getControllerName:function(){return"sap.ushell.renderers.fiori2.search.container.App";},createFooter:function(p){var t=this;if(jQuery.device.is.phone){return;}var m=new sap.m.ToggleButton({icon:"sap-icon://multi-select",tooltip:sap.ushell.resources.i18n.getText("toggleSelectionModeBtn"),press:function(){var d=t.oBar.getContent();var i,f;if(this.getPressed()){t.oSearchResults.resultList.enableSelectionMode();t.oModel.setProperty("/multiSelectionEnabled",true);for(i=0;i<d.length;i++){f=d[i];if(f.hasStyleClass("sapUshellSearchResultList-multiSelectionActionButton")){t.oBar.removeContent(f);}}var g=t.oModel.getDataSource();var h=t.oModel.config.getDataSourceConfig(g);var s=new h.searchResultListSelectionHandlerControl();var k=s.actionsForDataSource();t.oModel.setProperty("/multiSelectionActions",k);for(i=0;i<k.length;i++){var l=k[i];var n=new sap.m.Button({text:l.text,press:function(){var r=t.oModel.getProperty("/results");var j=[];for(var i=0;i<r.length;i++){var q=r[i];if(q.selected){j.push(q);}}l.action(j);},visible:{parts:[{path:'/multiSelectionEnabled'}],mode:sap.ui.model.BindingMode.OneWay}});n.setModel(t.oModel);n.addStyleClass("sapUshellSearchResultList-multiSelectionActionButton");t.oBar.insertContent(n,2);}}else{var o=t.oSearchResults.resultList.disableSelectionMode();o.done(function(){t.oModel.setProperty("/multiSelectionEnabled",false);t.oModel.setProperty("/multiSelectionActions",undefined);var r=t.oModel.getProperty("/boResults");if(r){for(var j=0;j<r.length;j++){var q=r[j];q.selected=false;}}for(i=0;i<d.length;i++){f=d[i];if(f.hasStyleClass("sapUshellSearchResultList-multiSelectionActionButton")){t.oBar.removeContent(f);}}});}},visible:{parts:[{path:'/multiSelectionAvailable'}],mode:sap.ui.model.BindingMode.OneWay}});m.setModel(this.oModel);m.addStyleClass("sapUshellSearchResultList-toggleMultiSelectionButton");var e=new sap.m.MessagePopover({placement:"Top"});e.setModel(this.oModel);t.oModel.setProperty("/errorPopoverControlId",e.getId());e.bindAggregation("items","/errors",function(i,C){var f=new sap.m.MessagePopoverItem({title:"{title}",description:"{description}"});switch(C.oModel.getProperty(C.sPath).type.toLowerCase()){case"error":f.setType(sap.ui.core.MessageType.Error);break;case"warning":f.setType(sap.ui.core.MessageType.Warning);break;default:f.setType(sap.ui.core.MessageType.Information);}return f;});var E=new sap.m.Button("searchErrorButton",{icon:sap.ui.core.IconPool.getIconURI("alert"),text:{parts:[{path:'/errors/length'}],formatter:function(l){return l;}},visible:{parts:[{path:'/errors/length'}],formatter:function(l){return l>0;},mode:sap.ui.model.BindingMode.OneWay},type:sap.m.ButtonType.Emphasized,tooltip:sap.ushell.resources.i18n.getText('errorBtn'),press:function(){e.setVisible(true);e.openBy(E);}});E.addDelegate({onAfterRendering:function(){if(!t.oModel.getProperty('/isErrorPopovered')){E.firePress();t.oModel.setProperty('/isErrorPopovered',true);}}});E.setLayoutData(new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow}));m.setLayoutData(new sap.m.OverflowToolbarLayoutData({priority:sap.m.OverflowToolbarPriority.NeverOverflow}));var d=[E,new sap.m.ToolbarSpacer(),m];t.oBar=new sap.m.OverflowToolbar({content:d}).addStyleClass("MyBar");p.setFooter(t.oBar);}});});