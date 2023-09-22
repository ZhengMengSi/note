// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/_HomepageManager/PagingManager","sap/ui/thirdparty/jquery","sap/ushell/resources","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/library","sap/ui/Device","sap/ui/core/library","sap/ui/model/Context","sap/m/MessageToast","sap/ushell/Config","sap/ushell/services/AppType","sap/ushell/components/appfinder/VisualizationOrganizerHelper","sap/ushell/utils/WindowUtils"],function(P,q,r,F,a,m,D,c,C,M,b,A,V,W){"use strict";var d=c.mvc.ViewType;var S=m.SplitAppMode;sap.ui.controller("sap.ushell.components.appfinder.Catalog",{oPopover:null,onInit:function(){this.categoryFilter="";this.preCategoryFilter="";this.oMainModel=this.oView.getModel();this.oSubHeaderModel=this.oView.getModel("subHeaderModel");this.resetPage=false;this.bIsInProcess=false;this.oVisualizationOrganizerHelper=this.oView.oVisualizationOrganizerHelper;var t=this;sap.ui.getCore().byId("catalogSelect").addEventDelegate({onBeforeRendering:this.onBeforeSelectRendering},this);var R=this.getView().parentComponent.getRouter();R.attachRouteMatched(function(e){t.onShow(e);});this.timeoutId=0;document.subHeaderModel=this.oSubHeaderModel;document.mainModel=this.oMainModel;var T=this.oSubHeaderModel.bindProperty("/openCloseSplitAppButtonToggled");T.attachChange(t.handleToggleButtonModelChanged.bind(this));this.oView.oCatalogsContainer.setHandleSearchCallback(t.handleSearchModelChanged.bind(this));},onBeforeRendering:function(){sap.ui.getCore().getEventBus().publish("renderCatalog");},onAfterRendering:function(){this.wasRendered=true;if(!this.PagingManager){this._setPagingManager();}if(this.PagingManager.currentPageIndex===0){this.allocateNextPage();}q(window).resize(function(){var w=q(window).width(),e=q(window).height();this.PagingManager.setContainerSize(w,e);}.bind(this));this._handleAppFinderWithDocking();sap.ui.getCore().getEventBus().subscribe("launchpad","appFinderWithDocking",this._handleAppFinderWithDocking,this);sap.ui.getCore().getEventBus().subscribe("sap.ushell","appFinderAfterNavigate",this._handleAppFinderAfterNavigate,this);},_setPagingManager:function(){this.lastCatalogId=0;this.PagingManager=new P("catalogPaging",{supportedElements:{tile:{className:"sapUshellTile"}},containerHeight:window.innerHeight,containerWidth:window.innerWidth});this.getView().getCatalogContainer().setPagingManager(this.PagingManager);},_decodeUrlFilteringParameters:function(u){var U;try{U=JSON.parse(u);}catch(e){U=u;}var h=(U&&U.tagFilter&&U.tagFilter)||[];if(h){try{this.tagFilter=JSON.parse(h);}catch(e){this.tagFilter=[];}}else{this.tagFilter=[];}this.categoryFilter=(U&&U.catalogSelector&&U.catalogSelector)||this.categoryFilter;if(this.categoryFilter){this.categoryFilter=window.decodeURIComponent(this.categoryFilter);}this.searchFilter=(U&&U.tileFilter&&U.tileFilter)||null;if(this.searchFilter){this.searchFilter=window.decodeURIComponent(this.searchFilter);}},_applyFilters:function(w){var s=false;if(this.categoryFilter){this.categoryFilter=r.i18n.getText("all")===this.categoryFilter?"":this.categoryFilter;if(this.categoryFilter!==this.preCategoryFilter){s=true;}this.oView.setCategoryFilterSelection(this.categoryFilter,s);}else{s=true;this.oView.setCategoryFilterSelection("",s);}this.preCategoryFilter=this.categoryFilter;if(this.searchFilter&&this.searchFilter.length){this.searchFilter=this.searchFilter.replace(/\*/g,"");this.searchFilter=this.searchFilter.trim();this.oSubHeaderModel.setProperty("/search",{searchMode:true,searchTerm:this.searchFilter});}else if(w){this.oSubHeaderModel.setProperty("/search",{searchMode:false,searchTerm:""});this.resetPage=true;}if(this.tagFilter&&this.tagFilter.length){this.oSubHeaderModel.setProperty("/tag",{tagMode:true,selectedTags:this.tagFilter});}else if(w){this.oSubHeaderModel.setProperty("/tag",{tagMode:false,selectedTags:[]});this.resetPage=true;}this.handleSearchModelChanged();},_handleAppFinderAfterNavigate:function(){this.clearFilters();},clearFilters:function(){var s=false;if(this.categoryFilter!==this.preCategoryFilter){s=true;}var e=this.oSubHeaderModel.getProperty("/search/searchMode"),t=this.oSubHeaderModel.getProperty("/tag/tagMode");if(e){this.oSubHeaderModel.setProperty("/search",{searchMode:true,searchTerm:""});}if(t){this.oSubHeaderModel.setProperty("/tag",{tagMode:true,selectedTags:[]});}if(this.categoryFilter&&this.categoryFilter!==""){this.selectedCategoryId=undefined;this.categoryFilter=undefined;this.getView().getModel().setProperty("/categoryFilter","");this.oView.setCategoryFilterSelection("",s);}this.preCategoryFilter=this.categoryFilter;this.handleSearchModelChanged();},onShow:function(e){var u=e.getParameter("arguments").filters;q.extend(this.getView().getViewData(),e);this._decodeUrlFilteringParameters(u);if(this.wasRendered&&!u){this.clearFilters();}else{this._applyFilters(this.wasRendered);}},allocateNextPage:function(){var o=this.getView().getCatalogContainer();if(!o.nAllocatedUnits||o.nAllocatedUnits===0){this.PagingManager.moveToNextPage();this.allocateTiles=this.PagingManager._calcElementsPerPage();o.applyPagingCategoryFilters(this.allocateTiles,this.categoryFilter);}},onBeforeSelectRendering:function(){var s=sap.ui.getCore().byId("catalogSelect"),i=q.grep(s.getItems(),q.proxy(function(I){return I.getBindingContext().getObject().title===this.categoryFilter;},this));if(!i.length&&s.getItems()[0]){i.push(s.getItems()[0]);}},setTagsFilter:function(f){var p={catalogSelector:this.categoryFilter?this.categoryFilter:"All",tileFilter:(this.searchFilter&&this.searchFilter.length)?encodeURIComponent(this.searchFilter):"",tagFilter:f.length?JSON.stringify(f):[]};this._addNavigationContextToFilter(p);this.getView().parentComponent.getRouter().navTo("catalog",{filters:JSON.stringify(p)});},setCategoryFilter:function(f){var p={catalogSelector:f,tileFilter:this.searchFilter?encodeURIComponent(this.searchFilter):"",tagFilter:this.tagFilter.length?JSON.stringify(this.tagFilter):[]};this._addNavigationContextToFilter(p);this.getView().parentComponent.getRouter().navTo("catalog",{filters:JSON.stringify(p)});},setSearchFilter:function(f){var p={catalogSelector:this.categoryFilter?this.categoryFilter:"All",tileFilter:f?encodeURIComponent(f):"",tagFilter:this.tagFilter.length?JSON.stringify(this.tagFilter):[]};this._addNavigationContextToFilter(p);this.getView().parentComponent.getRouter().navTo("catalog",{filters:JSON.stringify(p)});},_addNavigationContextToFilter:function(f){var o=this.oVisualizationOrganizerHelper.getNavigationContext.apply(this);if(o){Object.keys(o).forEach(function(k){f[k]=o[k];});}return f;},onSearch:function(s){var e=this.oSubHeaderModel.getProperty("/activeMenu");if(this.oView.getId().indexOf(e)!==-1){var f=s.searchTerm?s.searchTerm:"";this.setSearchFilter(f);}else{this._restoreSelectedMasterItem();}},onTag:function(t){var s=this.oSubHeaderModel.getProperty("/activeMenu");if(this.oView.getId().indexOf(s)!==-1){var e=t.selectedTags?t.selectedTags:[];this.setTagsFilter(e);}else{this._restoreSelectedMasterItem();}},getGroupContext:function(){var o=this.getView().getModel(),g=o.getProperty("/groupContext/path");return{targetGroup:encodeURIComponent(g||"")};},_isTagFilteringChanged:function(s){var e=s.length===this.tagFilter.length,i=e;if(!i){return true;}s.some(function(t){i=this.tagFilter&&Array.prototype.indexOf.call(this.tagFilter,t)!==-1;return!i;}.bind(this));return i;},_setUrlWithTagsAndSearchTerm:function(s,e){var u={tileFilter:s&&s.length?encodeURIComponent(s):"",tagFilter:e.length?JSON.stringify(e):[]};this._addNavigationContextToFilter(u);this.getView().parentComponent.getRouter().navTo("catalog",{filters:JSON.stringify(u)});},handleSearchModelChanged:function(){var s=this.oSubHeaderModel.getProperty("/search/searchMode"),t=this.oSubHeaderModel.getProperty("/tag/tagMode"),p,e=this.oSubHeaderModel.getProperty("/search/searchTerm"),f=this.oSubHeaderModel.getProperty("/tag/selectedTags"),o,g,h,i=[],j;if(!this.PagingManager){this._setPagingManager();}this.PagingManager.resetCurrentPageIndex();this.nAllocatedTiles=0;this.PagingManager.moveToNextPage();this.allocateTiles=this.PagingManager._calcElementsPerPage();this.oView.oCatalogsContainer.updateAllocatedUnits(this.allocateTiles);this.oView.oCatalogsContainer.resetCatalogPagination();var k=sap.ui.getCore().byId("catalogTilesDetailedPage");if(k){k.scrollTo(0,0);}if(s||t||this.resetPage){if(f&&f.length>0){o=new F("tags","EQ","v");o.fnTest=function(T){var y,z;if(f.length===0){return true;}for(y=0;y<f.length;y++){z=f[y];if(T.indexOf(z)===-1){return false;}}return true;};g=new F([o],true);}e=e?e.replace(/\*/g,""):e;if(e){var l=e.split(/[\s,]+/);var n=new F(q.map(l,function(y){return(y&&new F("keywords",a.Contains,y));}),true);var u=new F(q.map(l,function(y){return(y&&new F("title",a.Contains,y));}),true);var v=new F(q.map(l,function(y){return(y&&new F("subtitle",a.Contains,y));}),true);i.push(n);i.push(u);i.push(v);h=new F(i,false);}var w=this.oView.oCatalogsContainer.getCatalogs();this.oSearchResultsTotal=[];var x=this;if(g&&g.aFilters.length>0&&h){j=new F([h].concat([g]),true);}else if(g&&g.aFilters.length>0){j=new F([g],true);}else if(h&&h.aFilters.length>0){j=new F([h],true);}w.forEach(function(y){y.getBinding("customTilesContainer").filter(j);y.getBinding("appBoxesContainer").filter(j);});this.oView.oCatalogsContainer.bSearchResults=false;this.oView.oCatalogsContainer.applyPagingCategoryFilters(this.oView.oCatalogsContainer.nAllocatedUnits,this.categoryFilter);this.bSearchResults=this.oView.oCatalogsContainer.bSearchResults;this.oView.splitApp.toDetail(x.getView()._calculateDetailPageId());this.resetPage=false;}else{this.oView.oCatalogsContainer.applyPagingCategoryFilters(this.oView.oCatalogsContainer.nAllocatedUnits,this.categoryFilter);}p=this.getView()._calculateDetailPageId();this.oView.splitApp.toDetail(p);},_handleAppFinderWithDocking:function(){if(q(".sapUshellContainerDocked").length>0){if(q("#mainShell").width()<710){if(window.innerWidth<1024){this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible",false);this.oView.splitApp.setMode(S.ShowHideMode);}else{this.oView.splitApp.setMode(S.HideMode);this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible",true);}}else{this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonVisible",false);this.oView.splitApp.setMode(S.ShowHideMode);}}},_restoreSelectedMasterItem:function(){var o=this.oView.splitApp.getMasterPage("catalogSelect"),O=sap.ui.getCore().byId(this.selectedCategoryId);if(O){this.categoryFilter=O.getTitle();}o.setSelectedItem(O);},handleToggleButtonModelChanged:function(){var B=this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonVisible"),e=this.oSubHeaderModel.getProperty("/openCloseSplitAppButtonToggled");if((e!==this.bCurrentButtonToggled)&&B){if(!D.system.phone){if(e&&!this.oView.splitApp.isMasterShown()){this.oView.splitApp.showMaster();}else if(this.oView.splitApp.isMasterShown()){this.oView.splitApp.hideMaster();}}else if(this.oView.splitApp.isMasterShown()){var o=sap.ui.getCore().byId(this.getView()._calculateDetailPageId());this.oView.splitApp.toDetail(o);}else if(e){var f=sap.ui.getCore().byId("catalogSelect");this.oView.splitApp.toMaster(f,"show");}}this.bCurrentButtonToggled=e;},_handleCatalogListItemPress:function(e){this.onCategoryFilter(e);if(this.oSubHeaderModel.getProperty("/search/searchTerm")!==""){this.oSubHeaderModel.setProperty("/search/searchMode",true);}if(D.system.phone||D.system.tablet){this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled",!this.oSubHeaderModel.setProperty("/openCloseSplitAppButtonToggled"));}},onCategoryFilter:function(e){var o=e.getSource(),s=o.getSelectedItem(),f=s.getBindingContext(),g=f.getModel();if(g.getProperty("static",f)){g.setProperty("/showCatalogHeaders",true);this.setCategoryFilter();this.selectedCategoryId=undefined;this.categoryFilter=undefined;}else{g.setProperty("/showCatalogHeaders",false);this.setCategoryFilter(window.encodeURIComponent(s.getBindingContext().getObject().title));this.categoryFilter=s.getTitle();this.selectedCategoryId=s.getId();}},onTileAfterRendering:function(e){var j=q(e.oSource.getDomRef()),f=j.find(".sapMGT");f.attr("tabindex","-1");},catalogTilePress:function(){sap.ui.getCore().getEventBus().publish("launchpad","catalogTileClick");},onAppBoxPressed:function(e){var o=e.getSource(),t=o.getBindingContext().getObject(),p;if(e.mParameters.srcControl.$().closest(".sapUshellPinButton").length){return;}p=sap.ushell.Container.getService("LaunchPage").getAppBoxPressHandler(t);if(p){p(t);}else{var u=o.getProperty("url");if(u&&u.indexOf("#")===0){hasher.setHash(u);}else{var l=b.last("/core/shell/enableRecentActivity")&&b.last("/core/shell/enableRecentActivityLogging");if(l){var R={title:o.getProperty("title"),appType:A.URL,url:u,appId:u};sap.ushell.Container.getRenderer("fiori2").logRecentActivity(R);}W.openURL(u,"_blank");}}},onTilePinButtonClick:function(e){var l=sap.ushell.Container.getService("LaunchPage");var o=l.getDefaultGroup();o.done(function(f){var g=e.getSource(),s=g.getBindingContext(),h=this.getView().getModel(),G=h.getProperty("/groupContext/path");if(G){this._handleTileFooterClickInGroupContext(s,G);}else{var i=h.getProperty("/groups");var l=sap.ushell.Container.getService("LaunchPage");var j=this.getCatalogTileDataFromModel(s);var t=j.tileData.associatedGroups;var k=[];var n=i.map(function(w){var x,y,T;x=l.getGroupId(w.object);y=!((t&&Array.prototype.indexOf.call(t,x)===-1));T={id:x,title:this._getGroupTitle(f,w.object),selected:y};k.push(T);return{selected:y,initiallySelected:y,oGroup:w};}.bind(this));var p=sap.ui.getCore().byId("sapUshellGroupsPopover");var u;if(!p){u=l.getCatalogTilePreviewTitle(h.getProperty(s.sPath).src);if(!u){u=l.getCatalogTileTitle(h.getProperty(s.sPath).src);}var v=new sap.ui.view("sapUshellGroupsPopover",{type:d.JS,viewName:"sap.ushell.components.appfinder.GroupListPopover",viewData:{groupData:n,title:u,enableHideGroups:h.getProperty("/enableHideGroups"),enableHelp:h.getProperty("/enableHelp"),sourceContext:s,catalogModel:this.getView().getModel(),catalogController:this}});v.getController().setSelectedStart(k);v.open(g).then(this._handlePopoverResponse.bind(this,s,j));}}}.bind(this));},_getGroupTitle:function(o,g){var l=sap.ushell.Container.getService("LaunchPage"),t;if(o&&(l.getGroupId(o)===l.getGroupId(g))){t=r.i18n.getText("my_group");}else{t=l.getGroupTitle(g);}return t;},_handlePopoverResponse:function(s,e,f){if(!f.addToGroups.length&&!f.newGroups.length&&!f.removeFromGroups.length){return;}var o=this.getView().getModel();var g=o.getProperty("/groups");var p=[];f.addToGroups.forEach(function(h){var i=g.indexOf(h);var G=new C(o,"/groups/"+i);var j=this._addTile(s,G);p.push(j);}.bind(this));f.removeFromGroups.forEach(function(h){var t=s.getModel().getProperty(s.getPath()).id;var i=g.indexOf(h);var j=this._removeTile(t,i);p.push(j);}.bind(this));f.newGroups.forEach(function(h){var n=(h.length>0)?h:r.i18n.getText("new_group_name");var i=this._createGroupAndSaveTile(s,n);p.push(i);}.bind(this));q.when.apply(q,p).then(function(){var h=Array.prototype.slice.call(arguments);this._handlePopoverGroupsActionPromises(e,f,h);}.bind(this));},_handlePopoverGroupsActionPromises:function(e,p,f){var g=f.filter(function(u){return!u.status;});if(g.length){var E=this.prepareErrorMessage(g,e.tileData.title);var h=sap.ushell.components.getCatalogsManager();h.resetAssociationOnFailure(E.messageId,E.parameters);return;}var t=[];var l=sap.ushell.Container.getService("LaunchPage");p.allGroups.forEach(function(u){if(u.selected){var v=l.getGroupId(u.oGroup.object);t.push(v);}});var o=this.getView().getModel();if(p.newGroups.length){var i=o.getProperty("/groups");var n=i.slice(i.length-p.newGroups.length);n.forEach(function(u){var v=l.getGroupId(u.object);t.push(v);});}o.setProperty(e.bindingContextPath+"/associatedGroups",t);var j=(p.addToGroups[0])?p.addToGroups[0].title:"";if(!j.length&&p.newGroups.length){j=p.newGroups[0];}var k=(p.removeFromGroups[0])?p.removeFromGroups[0].title:"";var s=this.prepareDetailedMessage(e.tileData.title,p.addToGroups.length+p.newGroups.length,p.removeFromGroups.length,j,k);M.show(s,{duration:3000,width:"15em",my:"center bottom",at:"center bottom",of:window,offset:"0 -50",collision:"fit fit"});},_getCatalogTileIndexInModel:function(s){var t=s.sPath,e=t.split("/"),f=e[e.length-1];return f;},_handleTileFooterClickInGroupContext:function(s,g){var l=sap.ushell.Container.getService("LaunchPage"),o=this.getView().getModel(),e=this.getCatalogTileDataFromModel(s),f=e.tileData.associatedGroups,G=o.getProperty(g),h=l.getGroupId(G.object),i=f?Array.prototype.indexOf.call(f,h):-1,t=e.bindingContextPath,j,k,R,T,n,p=this;if(e.isBeingProcessed){return;}o.setProperty(t+"/isBeingProcessed",true);if(i===-1){j=new C(s.getModel(),g);k=this._addTile(s,j);k.done(function(u){if(u.status==1){p._groupContextOperationSucceeded(s,e,G,true);}else{p._groupContextOperationFailed(e,G,true);}});k.always(function(){o.setProperty(t+"/isBeingProcessed",false);});}else{T=s.getModel().getProperty(s.getPath()).id;n=g.split("/")[2];R=this._removeTile(T,n);R.done(function(u){if(u.status==1){p._groupContextOperationSucceeded(s,e,G,false);}else{p._groupContextOperationFailed(e,G,false);}});R.always(function(){o.setProperty(t+"/isBeingProcessed",false);});}},_groupContextOperationSucceeded:function(s,o,g,t){var l=sap.ushell.Container.getService("LaunchPage"),G=l.getGroupId(g.object),e=o.tileData.associatedGroups,f,i;if(t){e.push(G);s.getModel().setProperty(o.bindingContextPath+"/associatedGroups",e);f=this.prepareDetailedMessage(o.tileData.title,1,0,g.title,"");}else{for(i in e){if(e[i]===G){e.splice(i,1);break;}}s.getModel().setProperty(o.bindingContextPath+"/associatedGroups",e);f=this.prepareDetailedMessage(o.tileData.title,0,1,"",g.title);}M.show(f,{duration:3000,width:"15em",my:"center bottom",at:"center bottom",of:window,offset:"0 -50",collision:"fit fit"});},_groupContextOperationFailed:function(o,g,t){var e=sap.ushell.components.getCatalogsManager(),E;if(t){E=r.i18n.getText({messageId:"fail_tile_operation_add_to_group",parameters:[o.tileData.title,g.title]});}else{E=r.i18n.getText({messageId:"fail_tile_operation_remove_from_group",parameters:[o.tileData.title,g.title]});}e.notifyOnActionFailure(E.messageId,E.parameters);},prepareErrorMessage:function(e,t){var g,s,f,h,n=0,N=0,i=false,j;for(var k in e){g=e[k].group;s=e[k].action;if(s==="add"){n++;if(n===1){f=g.title;}}else if(s==="remove"){N++;if(N===1){h=g.title;}}else if(s==="addTileToNewGroup"){n++;if(n===1){f=g.title;}}else{i=true;}}if(i){if(e.length===1){j=r.i18n.getText({messageId:"fail_tile_operation_create_new_group"});}else{j=r.i18n.getText({messageId:"fail_tile_operation_some_actions"});}}else if(e.length===1){if(n){j=r.i18n.getText({messageId:"fail_tile_operation_add_to_group",parameters:[t,f]});}else{j=r.i18n.getText({messageId:"fail_tile_operation_remove_from_group",parameters:[t,h]});}}else if(N===0){j=r.i18n.getText({messageId:"fail_tile_operation_add_to_several_groups",parameters:[t]});}else if(n===0){j=r.i18n.getText({messageId:"fail_tile_operation_remove_from_several_groups",parameters:[t]});}else{j=r.i18n.getText({messageId:"fail_tile_operation_some_actions"});}return j;},prepareDetailedMessage:function(t,n,e,f,g){var h;if(n===0){if(e===1){h=r.i18n.getText("tileRemovedFromSingleGroup",[t,g]);}else if(e>1){h=r.i18n.getText("tileRemovedFromSeveralGroups",[t,e]);}}else if(n===1){if(e===0){h=r.i18n.getText("tileAddedToSingleGroup",[t,f]);}else if(e===1){h=r.i18n.getText("tileAddedToSingleGroupAndRemovedFromSingleGroup",[t,f,g]);}else if(e>1){h=r.i18n.getText("tileAddedToSingleGroupAndRemovedFromSeveralGroups",[t,f,e]);}}else if(n>1){if(e===0){h=r.i18n.getText("tileAddedToSeveralGroups",[t,n]);}else if(e===1){h=r.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSingleGroup",[t,n,g]);}else if(e>1){h=r.i18n.getText("tileAddedToSeveralGroupsAndRemovedFromSeveralGroups",[t,n,e]);}}return h;},getCatalogTileDataFromModel:function(s){var B=s.getPath(),o=s.getModel(),t=o.getProperty(B);return{tileData:t,bindingContextPath:B,isBeingProcessed:t.isBeingProcessed};},_addTile:function(t,g){var o=sap.ushell.components.getCatalogsManager(),e=q.Deferred(),p=o.createTile({catalogTileContext:t,groupContext:g});p.done(function(f){e.resolve(f);});return e;},_removeTile:function(t,i){var o=sap.ushell.components.getCatalogsManager(),e=q.Deferred(),p=o.deleteCatalogTileFromGroup({tileId:t,groupIndex:i});p.done(function(f){e.resolve(f);});return e;},_createGroupAndSaveTile:function(t,n){var o=sap.ushell.components.getCatalogsManager(),e=q.Deferred(),p=o.createGroupAndSaveTile({catalogTileContext:t,newGroupName:n});p.done(function(f){e.resolve(f);});return e;},onExit:function(){V.destroy();sap.ui.getCore().getEventBus().unsubscribe("launchpad","appFinderWithDocking",this._handleAppFinderWithDocking,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","appFinderAfterNavigate",this._handleAppFinderAfterNavigate,this);}});});