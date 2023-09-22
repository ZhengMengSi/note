sap.ui.define(["sap/ui/generic/app/navigation/service/SelectionVariant","sap/suite/ui/generic/template/AnalyticalListPage/extensionAPI/ExtensionAPI","sap/suite/ui/generic/template/AnalyticalListPage/controller/FilterBarController","sap/suite/ui/generic/template/listTemplates/controller/ToolbarController","sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterBarController","sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController","sap/suite/ui/generic/template/AnalyticalListPage/controller/AnalyticGridController","sap/ui/table/AnalyticalTable","sap/ui/model/odata/AnnotationHelper","sap/ui/model/analytics/odata4analytics","sap/suite/ui/generic/template/AnalyticalListPage/controller/ContentAreaController","sap/suite/ui/generic/template/listTemplates/controller/IappStateHandler","sap/ui/Device","sap/m/SegmentedButtonItem","sap/m/SegmentedButton","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/m/library","sap/ui/model/Context","sap/suite/ui/generic/template/AnalyticalListPage/util/AnnotationHelper","sap/suite/ui/generic/template/genericUtilities/controlHelper","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil","sap/base/util/ObjectPath","sap/suite/ui/generic/template/lib/ShareUtils","sap/base/util/merge","sap/base/util/deepExtend","sap/suite/ui/generic/template/listTemplates/listUtils","sap/suite/ui/generic/template/listTemplates/controller/MultipleViewsHandler","sap/suite/ui/generic/template/js/StableIdHelper","sap/suite/ui/generic/template/listTemplates/controller/MessageStripHelper","sap/ui/model/json/JSONModel","sap/suite/ui/generic/template/listTemplates/controller/DetailController","sap/ui/comp/personalization/Util","sap/suite/ui/generic/template/lib/AddCardsHelper","sap/insights/CardHelper"],function(e,t,a,r,n,i,o,l,s,c,g,d,u,p,f,m,v,C,S,F,b,h,y,P,T,I,A,B,D,M,H,V,E,w,_,R){"use strict";var O=new h("AnalyticalListPage.controller.ControllerImplementation");var U=O.getLogger();var L=O.Level;var x="chart",K="visual",k="compact",N=900;return{getMethods:function(f,m,v){var C={};C.oRefreshTimer=null;C.nRefreshInterval=0;C.bVisualFilterInitialised=false;C._bIsStartingUp=true;function S(e){C.oRefreshTimer=setTimeout(function(){var e=v.getOwnerComponent();var t=e.getModel("_templPriv");if(!t.getProperty("/alp/filterChanged")){f.refreshBinding()}},e)}function h(e){if(C.nRefreshInterval!==0){if(C.oRefreshTimer!==null){clearTimeout(C.oRefreshTimer)}if(!e){S(C.nRefreshInterval)}}}function y(){var e=v.getOwnerComponent();var t=e.getModel("_templPriv");t.setProperty("/listReport/isLeaf",e.getIsLeaf())}function E(e,t){var a=e&&e.property;return a.filter(function(e){return typeof e[t]!=="undefined"})}function O(t){var a=t.getModel(),r=a&&a.getMetaModel(),n=r&&r.getODataEntityType(t.getEntityType()),i,o=r&&r.getODataEntityType(t.getEntityType(),true),l=F.createSVAnnotation(n,r,C.oController.getOwnerComponent().getQualifier());if(C.oController.getOwnerComponent().getFilterDefaultsFromSelectionVariant()&&l){i=B.createSVObject(I({},l),t)}else{if(C.oController.getOwnerComponent().getFilterDefaultsFromSelectionVariant()&&!l){U.warning("No SelectionVariant found in the annotation : No default values filled in FilterBar")}var g=n&&E(n,"com.sap.vocabularies.Common.v1.FilterDefaultValue"),d,u,p,f,m,v=[];try{d=new c.Model(new c.Model.ReferenceByModel(a));m=d&&d.findQueryResultByName(t.getEntitySet());u=m&&m.getParameterization();p=u&&r.getODataEntitySet(u.getEntitySet().getQName());f=p&&r.getODataEntityType(p.entityType);v=f?E(f,"defaultValue"):[]}catch(e){U.error(e)}if(g.length>0||v.length>0){i=new e;g.forEach(function(e){var t=r.createBindingContext(o+"/property/[${path:'name'}==='"+e.name+"']/com.sap.vocabularies.Common.v1.FilterDefaultValue");i.addSelectOption(e.name,"I","EQ",s.format(t))});v.forEach(function(e){i.addParameter(e.name,e.defaultValue)})}}return i}function j(e){var t=e.getSource();t.suspendSetFilterData();var a=O(t);if(a){C.oIappStateHandler.fnSetFiltersUsingUIState(a.toJSONObject(),{},true,false)}C.oIappStateHandler.onSmartFilterBarInitialise();v.onInitSmartFilterBarExtension(e);v.templateBaseExtension.onInitSmartFilterBar(e)}function z(){var e=C.oController.getOwnerComponent();if(C.hideVisualFilter||e.getDefaultFilterMode()=="visual"&&e.getModel().mMetadataUrlParams&&e.getModel().mMetadataUrlParams["sap-value-list"]==="none"){if(C.alr_visualFilterBar&&!C.alr_visualFilterBar.getAssociateValueListsCalled()){C.alr_visualFilterBar.setAssociateValueListsCalled(true)}C.oSmartFilterbar.associateValueLists()}var t=C.oIappStateHandler.onSmartFilterBarInitialized();t.then(function(){C._bIsStartingUp=false;if(C.bVisualFilterInitialised){C.oIappStateHandler.fnUpdateVisualFilterBar()}if(C.sNavType!==sap.ui.generic.app.navigation.service.NavType.iAppState){C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL()}},function(e){if(e instanceof Error){e.showMessageBox()}C.oIappStateHandler.fnOnError();C._bIsStartingUp=false}).finally(function(){if(C.oSmartFilterableKPI){var e=C.oSmartFilterableKPI.getContent();e.forEach(function(e){if(e.getSmartFilterId){e._bStopDataLoad=false;e._updateKpiList(true)}})}})}function G(e){var t=e.getSource(),a=e.getParameters().limitReached,r=t.getSelectedIndices(),n,i;if(r.length>0){if(a){n="Your last selection was limited to the maximum of "+t.getLimit()+" items.";m.oServices.oApplication.showMessageToast(n)}}i=t.getParent();m.oCommonUtils.setEnabledToolbarButtons(i)}function q(e){var t=e.getParameters();var a=e.getSource();m.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(a,t)}function W(e){var t,a;t=e.getParameters();a=e.getSource();m.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(a.getEntitySet(),a.getFieldSemanticObjectMap(),t,C)}function J(e){var t=C.oSmartFilterbar;var a=[];if(e.fetchVariant()&&e.fetchVariant().filter&&e.fetchVariant().filter.filterItems){a=e.fetchVariant().filter.filterItems}var r={search:!!t.getBasicSearchValue(),filter:!!(a.length||t.retrieveFiltersWithValues().length)};return r}function Q(e){var t=e.getId();var a=J(e);var r="";if(a.search||a.filter){r=m.oCommonUtils.getContextText("NOITEMS_SMARTCHART_WITH_FILTER",t)}else{r=m.oCommonUtils.getContextText("NOITEMS_SMARTCHART",t)}e.getChartAsync().then(function(e){e.setCustomMessages({NO_DATA:r})})}function X(e){var t={sharePageToPressed:function(e){var t=m.oServices.oApplication.getBusyHelper();if(t.isBusy()){return}var a=m.oServices.oApplication.getAppTitle();var r=T.getCurrentUrl().then(function(t){switch(e){case"MicrosoftTeams":T.openMSTeamsShareDialog(a,t);break;case"Email":a=m.oCommonUtils.getText("EMAIL_HEADER",[a]);sap.m.URLHelper.triggerEmail(null,a,t);break;default:break}});t.setBusy(r)},shareJamPressed:function(){T.openJamShareDialog(m.oServices.oApplication.getAppTitle())},shareTilePressed:function(){T.fireBookMarkPress()},getDownloadUrl:function(){var e=C.oSmartTable.getTable();var t=e.getBinding("rows")||e.getBinding("items");return t&&t.getDownloadUrl()||""},getServiceUrl:function(){return C.oSmartFilterbar.hasDateRangeTypeFieldsWithValue().then(function(e){var a=e?"":t.getDownloadUrl();a=a&&a+"&$top=0&$inlinecount=allpages";var r={serviceUrl:a};v.onSaveAsTileExtension(r);return r.serviceUrl})},getModelData:function(){var e=P.get("sap.ushell.Container.getUser");var a=v.getOwnerComponent().getAppComponent().getMetadata();var r=a.getManifestEntry("sap.ui");var n=a.getManifestEntry("sap.app");return t.getServiceUrl().then(function(t){return T.getCurrentUrl().then(function(a){return{serviceUrl:t,icon:r&&r.icons?r.icons.icon:"",title:n?n.title:"",isShareInJamActive:!!e&&e().isJamActive(),customUrl:T.getCustomUrl(),currentUrl:a}})})}};T.openSharePopup(m.oCommonUtils,e,t)}return{onInit:function(){var e=v.getOwnerComponent();U.setLevel(L.WARNING,"ALPSmartFilterBar");var t=e.getModel("_templPriv");t.setProperty("/alp",{filterMode:e.getHideVisualFilter()?k:e.getDefaultFilterMode(),contentView:e.getDefaultContentView(),autoHide:e.getAutoHide(),visibility:{hybridView:u.system.phone||u.system.tablet&&!u.system.desktop?false:true},filterChanged:false});C.hideVisualFilter=e.getHideVisualFilter();C.hideVisualFilter=C.hideVisualFilter===undefined||C.hideVisualFilter!==true?false:true;C.quickVariantSelectionX=e.getQuickVariantSelectionX();C.oSmartFilterbar=v.byId("template::SmartFilterBar");C.oSmartTable=v.byId("table");C.oSmartFilterableKPI=v.byId("template::KPITagContainer::filterableKPIs");C.oPage=v.byId("template::Page");C.oSmartChart=v.byId("chart");var i=new D(C,v,m);C.oMultipleViewsHandler=i;C.oMessageStripHelper=new H(m.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(C.oSmartTable),i,v,m,"alp");if(v.getOwnerComponent().getProperty("dshQueryName")){C.oAnalyticGridContainer=v.byId("template::AnalyticGridContainer");C.oAnalyticGridController=new o;C.oAnalyticGridController.setState(C)}C.alr_compactFilterContainer=v.byId("template::CompactFilterContainer");C.alr_visualFilterContainer=v.byId("template::VisualFilterContainer");C.alr_filterContainer=v.byId("template::FilterContainer");C.alr_visualFilterBar=v.byId("template::VisualFilterBar");var s="";if(C.quickVariantSelectionX){s=i.getSelectedKey()}var c=M.getStableId({type:"ALPTable",subType:"ColumnListItem",sQuickVariantKey:s});C.alp_ColumnListItem=v.byId(c);if(C.alr_visualFilterBar){var p=e.getFilterSettings();if(p&&Object.keys(p).length>0){C.alr_visualFilterBar.setFilterSettings(p)}C.alr_visualFilterBar.setSmartFilterId(C.oSmartFilterbar.getId());C.alr_visualFilterBar.attachOnFilterItemAdded(function(e){var t=e.getParameters();t.attachBeforeRebindVisualFilter(function(e){var t=e.getParameters();var a=t.sEntityType;var r=t.sDimension;var n=t.sMeasure;var i=t.oContext;var o=C.oController;o.onBeforeRebindVisualFilterExtension(a,r,n,i)})})}C.oKpiTagContainer=v.byId("template::KPITagContainer::globalKPIs");C.oFilterableKpiTagContainer=v.byId("template::KPITagContainer::filterableKPIs");if(C.oKpiTagContainer||C.oFilterableKpiTagContainer){sap.ui.require(["sap/suite/ui/generic/template/AnalyticalListPage/controller/KpiTagController"],function(e){e.init(C)})}C.oContentArea=new g;C.oTemplateUtils=m;C.toolbarController=new r;C.oController=v;C.filterBarController=new a;C.filterBarController.init(C);C.oContentArea.createAndSetCustomModel(C);C.oMultipleViewsHandler.getInitializationPromise().then(function(){C.oContentArea.setState(C)});if(!C.hideVisualFilter){C.visualFilterBarContainer=new n;C.visualFilterBarContainer.init(C)}if(C.alr_visualFilterBar){C.alr_visualFilterBar.addEventDelegate({onAfterRendering:function(){if(C.oSmartFilterbar.isInitialised()){C.oSmartFilterbar.setFilterData({_CUSTOM:C.oIappStateHandler.getFilterState()})}}})}C.oIappStateHandler=new d(C,v,m);y();v.byId("template::FilterText").attachBrowserEvent("click",function(){v.byId("template::Page").setHeaderExpanded(true)});t.setProperty("/listReport/isHeaderExpanded",true);if(C.oSmartTable){var F=C.oSmartTable.getTable()}var P="sapUiSizeCozy",T="sapUiSizeCompact",I="sapUiSizeCondensed";if(b.isUiTable(F)||F instanceof l){var B=v.getView();var V=document.body;if(V.classList.contains(P)||B.hasStyleClass(P)){C.oSmartTable.addStyleClass(P)}else if(V.classList.contains(T)||B.hasStyleClass(T)){var E=e.getCondensedTableLayout();if(E===false){C.oSmartTable.addStyleClass(T)}else{C.oSmartTable.addStyleClass(I)}}}if(C.oSmartFilterableKPI){C.oSmartFilterableKPI.setModel(e.getModel("_templPriv"),"_templPriv");var w=C.oSmartFilterableKPI.getContent(),_=C.oController;w.forEach(function(e){if(e.getSmartFilterId){e.attachBeforeRebindFilterableKPI(function(e){var t=e.getParameters(),a=t.selectionVariant,r=t.entityType,n=e.getSource().getId();_.onBeforeRebindFilterableKPIExtension(a,r,n)},_)}})}f.getUrlParameterInfo=function(){return C.oIappStateHandler.getUrlParameterInfo()};f.onComponentActivate=function(){};f.refreshBinding=function(){if(C.alr_visualFilterBar&&C.alr_visualFilterBar.updateVisualFilterBindings){C.alr_visualFilterBar.updateVisualFilterBindings()}if(C.oSmartChart&&C.oSmartChart.rebindChart){C.oSmartChart.rebindChart()}if(C.oSmartTable){m.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(C.oSmartTable).refresh()}if(C.oKpiTagContainer){var e=C.oKpiTagContainer.mAggregations.content;for(var t in e){if(e[t]._createGlobalKpi){e[t]._createGlobalKpi()}}}if(C.oFilterableKpiTagContainer){var e=C.oFilterableKpiTagContainer.mAggregations.content;for(var t in e){if(e[t]._createFilterableKpi){e[t]._createFilterableKpi()}}}h()};f.onSuspend=function(){h(true)};f.onRestore=function(){if(C.nRefreshInterval){S(C.nRefreshInterval)}};if(C.alr_visualFilterBar){C.alr_visualFilterBar.attachInitialized(function(e){C.bVisualFilterInitialised=true;if(!C._bIsStartingUp){C.oIappStateHandler.fnUpdateVisualFilterBar(true)}})}C.oSmartFilterbar.attachFilterChange(function(t){var a=e.getModel("_templPriv");C.oIappStateHandler.fnCheckMandatory();var r=C.oSmartFilterbar.isDialogOpen();var n=t.getSource(),i;i=A({},n.getFilterData(true));if(r&&C.visualFilterDialogContainer){var o=C.visualFilterDialogContainer.oVerticalBox.getModel("_dialogFilter");o.setData(i)}else{var l=C.oController.getOwnerComponent().getModel("_filter");l.setData(i)}if(t.getParameters().filterItem){if(!C.hideVisualFilter){C.filterBarController.changeVisibility(t)}a.setProperty("/alp/_ignoreChartSelections",false)}C.filterBarController._updateFilterLink();if(!C.oSmartFilterbar.isLiveMode()&&!C.oSmartFilterbar.isDialogOpen()){a.setProperty("/alp/filterChanged",true)}});var B=v.getView();var V=document.body;var R,O;if(V.classList.contains(P)||B.hasStyleClass(P)){R=true}if(R&&e.getTableType()!=="ResponsiveTable"){var x=e.getModel("_templPriv");if(u.resize.height<=N){O=x.getProperty("/alp/contentView");x.setProperty("/alp/enableHybridMode",false);x.setProperty("/alp/contentView",O==="charttable"?"chart":O)}C.resizeHandler=function(e){var t=e.height;if(t<=N){O=x.getProperty("/alp/contentView");x.setProperty("/alp/enableHybridMode",false);x.setProperty("/alp/contentView",O==="charttable"?"chart":O)}else{x.setProperty("/alp/enableHybridMode",true)}};u.resize.attachHandler(C.resizeHandler)}if(e.getRefreshIntervalInMinutes()){C.nRefreshInterval=e.getRefreshIntervalInMinutes();C.nRefreshInterval=(C.nRefreshInterval<1?1:C.nRefreshInterval)*6e4}var K=v.byId(M.getStableId({type:"ALPAction",subType:"Share"})+"-internalBtn");if(K){K.attachPress(function(){X(K)})}},attachRefreshInterval:S,clearingRefreshTimerInterval:h,onExit:function(){if(C.resizeHandler){u.resize.detachHandler(C.resizeHandler)}if(C.oRefreshTimer!==null){clearTimeout(C.oRefreshTimer)}},handlers:{onBack:function(){m.oServices.oNavigationController.navigateBack()},onSmartTableInit:function(e){var t=e.getSource(),a=t.getCustomToolbar(),r=a.getContent(),n;t.setHeight("100%");m.oCommonUtils.checkToolbarIntentsSupported(t);if(C._pendingTableToolbarInit){if(!C.oSmartFilterableKPI&&!C.oMultipleViewsHandler.getMode()){a.insertContent(C.alr_viewSwitchButtonOnTable,r.length)}}if(C._pendingTableToolbarInit){for(var i=0;i<r.length;i++){if(r[i].mProperties.text==="Settings"){n=i}}a.insertContent(C._autoHideToggleBtn,n)}delete C._pendingTableToolbarInit;t.attachShowOverlay(function(e){t.getCustomToolbar().setEnabled(!e.getParameter("overlay").show)});var o=new V({highlightMode:"rebindTable"});t.setModel(o,"_tableHighlight")},onBeforeRebindTable:function(e){var t=e.getSource();var a=t&&t.fetchVariant();var r=e.getParameter("bindingParams");C.oMessageStripHelper.onBeforeRebindControl(e);if(C.chartController&&C.chartController.oChart){var n=C.chartController.oChart,i=C.chartController._chartInfo,o=i.drillStack&&i.drillStack.length>0?i.drillStack[i.drillStack.length-1]:undefined}if(!a){return}var l=v.getOwnerComponent().getModel("_templPriv");var s=l.getProperty("/alp/_ignoreChartSelections");if(C.detailController.isFilter()&&C.oSmartChart&&!s){C.detailController._applyChartSelectionOnTableAsFilter(e,n)}if(C.detailController.isFilter()&&o&&o.filter){r.filters.push(o.filter)}var c=[];var g=t.getTable().getColumns();for(var d=0;d<g.length;d++){var u=g[d];if(u.getGrouped&&u.getGrouped()){c.push(u.getLeadingProperty?u.getLeadingProperty():w.getColumnKey(u))}}C.detailController._updateExpandLevelInfo(c);if(v.getOwnerComponent().getModel().getDefaultCountMode()==="None"&&t._isAnalyticalTable){r.parameters.provideTotalResultSize=false;t.setShowRowCount(false)}v.onBeforeRebindTableExtension(e);C.oMultipleViewsHandler.aTableFilters=A({},r.filters);var p=r.events.refresh||Function.prototype;r.events.refresh=function(e){C.oMultipleViewsHandler.onDataRequested();p.call(this,e)};var f=r.events.dataRequested||Function.prototype;r.events.dataRequested=function(e){C.detailController.onSmartTableDataRequested(t);f.call(this,e)};var S=r.events.dataReceived||Function.prototype;r.events.dataReceived=function(e){C.oContentArea.enableToolbar();m.oCommonEventHandlers.onDataReceived(t);m.oComponentUtils.hidePlaceholder();S.call(this,e)};m.oCommonEventHandlers.onBeforeRebindTable(e,{setBindingPath:t.setTableBindingPath.bind(t),ensureExtensionFields:v.templateBaseExtension.ensureFieldsForSelect,addExtensionFilters:v.templateBaseExtension.addFilters,resolveParamaterizedEntitySet:C.oMultipleViewsHandler.resolveParameterizedEntitySet,isMandatoryFiltersRequired:false,isFieldControlRequired:false,isPopinWithoutHeader:false,isDataFieldForActionRequired:false,isFieldControlsPathRequired:false});var F=r.filters.slice(0);C.oMultipleViewsHandler.onRebindContentControl(r,F);t.getModel("_tableHighlight")&&t.getModel("_tableHighlight").setProperty("/highlightMode","rebindTable");C.detailController._applyCriticalityInfo(e,t);B.handleErrorsOnTableOrChart(m,e,C)},onSelectionDetailsActionPress:function(e){C.oMultipleViewsHandler.onDetailsActionPress(e)},addEntry:function(e){var t=e.getSource();m.oCommonEventHandlers.addEntry(t,false,C.oSmartFilterbar)},deleteEntries:function(e){m.oCommonEventHandlers.deleteEntries(e)},onSelectionChange:function(e){var t=e.getSource(),a=t.getModel(),r=t.getModel("_templPriv");var n=a.getMetaModel(),i=n.getODataEntitySet(this.getOwnerComponent().getEntitySet()),o=i["Org.OData.Capabilities.V1.DeleteRestrictions"];var l=o&&o.Deletable&&o.Deletable.Path?o.Deletable.Path:"";var s=false;var c=true;var g=l&&l!=="";var d=m.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(m.oCommonUtils.getOwnerPresentationControl(t)).getSelectedContexts();if(d.length>0){for(var u=0;u<d.length;u++){var p=a.getObject(d[u].getPath());if(!(p.IsActiveEntity&&p.HasDraftEntity&&p.DraftAdministrativeData&&p.DraftAdministrativeData.InProcessByUser)){c=false}if(g){if(a.getProperty(l,d[u])){g=false}}if(!c&&!g){s=true;break}}}r.setProperty("/listReport/deleteEnabled",s)},onMultiSelectionChange:G,onChange:function(e){m.oCommonEventHandlers.onChange(e)},onContactDetails:function(e){m.oCommonEventHandlers.onContactDetails(e)},onSmartFilterBarInitialise:j,onSmartFilterBarInitialized:z,onEditStateFilterChanged:function(e){e.getSource().fireChange()},onFilterPress:function(e){C.filterBarController.showDialog.call(C.filterBarController)},onClearPress:function(e){C.filterBarController.clearFilters();v.onClearFilterExtension(e)},onGoPress:function(e){C.filterBarController.fnCheckMandatory();var t=C.oSmartFilterbar.isDialogOpen();if(!t){C.filterBarController.onGoFilter()}},onBeforeSFBVariantSave:function(){if(C.oSmartFilterbar.isDialogOpen()&&!C.hideVisualFilter){C.visualFilterDialogContainer._updateFilterBarFromDialog.call(C.visualFilterDialogContainer)}var e=C.oIappStateHandler.getCurrentAppState();if(!this.getOwnerComponent().getProperty("smartVariantManagement")){delete e.customData["sap.suite.ui.generic.template.genericData"].contentView}var t=C.oSmartFilterbar.getFilterData(true);var a,r=C.oSmartFilterbar.getBasicSearchControl();if(r&&r.getValue){a=r.getValue()}t._CUSTOM=e.customData;C.oSmartFilterbar.setFilterData(t,true);if(a){C.oSmartFilterbar.getBasicSearchControl().setValue(a)}C.oSmartFilterbar.fireFilterChange()},onAfterSFBVariantLoad:function(e){if(!C.oSmartFilterbar.isDialogOpen()){C.filterBarController._afterSFBVariantLoad();if(C.oSmartFilterableKPI&&!C.oSmartFilterbar.isLiveMode()){var t=C.oSmartFilterableKPI.getContent();t.forEach(function(t){if(t.getSmartFilterId){if(e.getParameter("executeOnSelect")){t.bSearchTriggred=true}}})}}},onBeforeRebindChart:function(e){var t=e.getSource();Q(t);var a=e.getParameters().bindingParams;C.oMultipleViewsHandler.aTableFilters=A({},a.filters);var r=a.filters.slice(0);var n={setBindingPath:t.setChartBindingPath.bind(t),ensureExtensionFields:Function.prototype,addExtensionFilters:v.templateBaseExtension.addFilters,resolveParamaterizedEntitySet:C.oMultipleViewsHandler.resolveParameterizedEntitySet,isFieldControlRequired:false,isMandatoryFiltersRequired:true};v.onBeforeRebindChartExtension(e);var i=a.events.dataReceived||Function.prototype;a.events.dataReceived=function(e){if(!t.getToolbar().getEnabled()){C.oContentArea.enableToolbar()}m.oComponentUtils.hidePlaceholder();i.call(this,e)};m.oCommonUtils.onBeforeRebindTableOrChart(e,n,C.oSmartFilterbar);C.oMultipleViewsHandler.onRebindContentControl(a,r);B.handleErrorsOnTableOrChart(m,e)},onListNavigate:function(e){m.oCommonEventHandlers.onListNavigate(e,C)},onCallActionFromToolBar:function(e){var t=m.oCommonUtils.getParentTable;m.oCommonUtils.getParentTable=function(){return C.oSmartTable};m.oCommonEventHandlers.onCallActionFromToolBar(e,C);m.oCommonUtils.getParentTable=t;t=null},onCallActionFromList:function(e){},onDataFieldForIntentBasedNavigation:function(e){m.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(e,C)},onDataFieldWithIntentBasedNavigation:function(e){m.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(e,C)},onBeforeSemanticObjectLinkPopoverOpens:function(e){var t=e.getSource();var a=C.oSmartFilterbar.getUiState({allFilters:false}).getSelectionVariant();if(C.oSmartFilterbar.getEntitySet()!==t.getEntitySet()){a.FilterContextUrl=m.oServices.oApplication.getNavigationHandler().constructContextUrl(t.getEntitySet(),t.getModel())}var r=JSON.stringify(a);m.oCommonUtils.semanticObjectLinkNavigation(e,r,v)},onAssignedFiltersChanged:function(e){if(e&&e.getSource()){if(C&&C.oSmartFilterbar&&C.filterBarController){v.byId("template::FilterText").setText(C.oSmartFilterbar.retrieveFiltersWithValuesAsText())}}},onToggleFiltersPressed:function(){var e=v.getOwnerComponent();var t=e.getModel("_templPriv");t.setProperty("/listReport/isHeaderExpanded",t.getProperty("/listReport/isHeaderExpanded")===true?false:true)},onSearchButtonPressed:function(){if(u.system.phone&&C.oPage.getHeaderExpanded()){C.oPage.setHeaderExpanded(false)}var e=v.getOwnerComponent().getModel();C.oController.getOwnerComponent().getModel("_templPriv").setProperty("/alp/filterChanged",false);e.attachEventOnce("requestSent",function(){if(!C._bIsStartingUp){C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL()}else{C.oIappStateHandler.fnResolveStartUpPromise()}});C.oController.getOwnerComponent().getModel("_templPriv").setProperty("/alp/_ignoreChartSelections",true);if(C.oSmartTable){m.oCommonUtils.refreshModel(C.oSmartTable.getEntitySet())}else{m.oCommonUtils.refreshModel(C.oSmartChart.getEntitySet())}h()},onSemanticObjectLinkNavigationPressed:q,onSemanticObjectLinkNavigationTargetObtained:W,onAfterTableVariantSave:function(){C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL()},onAfterApplyTableVariant:function(){C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL()},onAfterChartVariantSave:function(e){C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();m.oCommonUtils.setEnabledToolbarButtons(e.getSource())},onAfterApplyChartVariant:function(){C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL()},onFilterModeSegmentedButtonChange:function(e){C.filterBarController.handleFilterSwitch(e.getParameter("key"),e.oSource._bApplyingVariant);C.oController._templateEventHandlers.onSegmentButtonPressed();C.filterBarController.fnCheckMandatory()},onContentViewSegmentButtonPressed:function(e){if(e.getParameter("key")==="crosstable"&&!C.oAnalyticGrid){C.oAnalyticGridController.initAnalyticGrid()}if(!C.oSmartFilterableKPI&&!C.oController.getOwnerComponent().getContentTitle()){var t=C.oController.getView(),a;if(e.getSource().getSelectedKey()==="customview1"){a="template::contentViewExtensionToolbar"}else if(e.getSource().getSelectedKey()==="customview2"){a="template::contentViewExtension2Toolbar"}else if(e.getSource().getSelectedKey()==="chart"||e.getSource().getSelectedKey()==="charttable"){a=t.byId("template::masterViewExtensionToolbar")?"template::masterViewExtensionToolbar":"template::ChartToolbar"}else if(e.getSource().getSelectedKey()==="table"){a="template::TableToolbar"}C.oController._templateEventHandlers.setFocusOnContentViewSegmentedButtonItem(t,a)}C.oController._templateEventHandlers.onSegmentButtonPressed(!C.oController.getOwnerComponent().getProperty("smartVariantManagement"))},setFocusOnContentViewSegmentedButtonItem:function(e,t){var a=e.byId(t);if(a){var r=a.getContent().length,n=a.getContent()[r-1];if(n){n.addEventDelegate({onAfterRendering:function(e){e.srcControl.focus()}})}}},onSegmentButtonPressed:function(e){if(!e){C.oController.byId("template::PageVariant").currentVariantSetModified(true);C.oSmartFilterbar.setFilterData({_CUSTOM:C.oIappStateHandler.getFilterState()})}C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL()},onShareListReportActionButtonPress:function(e){m.oCommonUtils.executeIfControlReady(X,M.getStableId({type:"ALPAction",subType:"Share"})+"-internalBtn")},onDeterminingDataFieldForAction:function(e){var t=C.oController.getOwnerComponent().getModel("_templPriv");var a=t.getProperty("/alp/contentView");var r=m.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(a===x?C.oSmartChart:C.oSmartTable);m.oCommonEventHandlers.onDeterminingDataFieldForAction(e,r)},onDeterminingDataFieldForIntentBasedNavigation:function(e){var t=e.getSource();var a=C.oController.getOwnerComponent().getModel("_templPriv");var r=a.getProperty("/alp/contentView");var n=m.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(r===x?C.oSmartChart:C.oSmartTable).getSelectedContexts();m.oCommonEventHandlers.onDeterminingDataFieldForIntentBasedNavigation(t,n,C.oSmartFilterbar)},onInlineDataFieldForAction:function(e){m.oCommonEventHandlers.onInlineDataFieldForAction(e)},onInlineDataFieldForIntentBasedNavigation:function(e){m.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(e.getSource(),C)},onAutoHideToggle:function(){C.oSmartTable.getModel("_tableHighlight").setProperty("/highlightMode","eyeModeSwitch");C.chartController&&C.chartController._updateTable();C.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL()},onFullScreenToggled:function(e){var t=e.getParameter("fullScreen");var a=e.getSource().getModel("_templPriv");a.setProperty("/alp/fullScreen",t)},onDialogClosed:function(e){C.visualFilterDialogContainer._closeDialog.call(C.visualFilterDialogContainer,e)},onDialogOpened:function(e){if(!C.visualFilterDialogContainer){C.visualFilterDialogContainer=new i;C.visualFilterDialogContainer.init(C)}var t=C.oController.getView().getModel("_templPriv"),a=K,r={},n;n=t.getProperty("/alp/searchable");if(!n){if(C.alr_visualFilterBar&&!C.alr_visualFilterBar.getAssociateValueListsCalled()){C.alr_visualFilterBar.setAssociateValueListsCalled(true);C.oSmartFilterbar.associateValueLists()}}r.item=new p({icon:"sap-icon://filter-analytics",tooltip:"{i18n>FILTER_VISUAL}",key:a,enabled:"{_templPriv>/alp/searchable}"});r.selectionChange=function(e){C.visualFilterDialogContainer._toggle.call(C.visualFilterDialogContainer,e)};r.content=C.visualFilterDialogContainer._createForm();r.search=function(e){C.visualFilterDialogContainer._triggerSearchInFilterDialog.call(C.visualFilterDialogContainer,e)};r.filterSelect=function(e){C.visualFilterDialogContainer._triggerDropdownSearch.call(C.visualFilterDialogContainer,e)};C.oSmartFilterbar.addAdaptFilterDialogCustomContent(r)},onSearchForFilters:function(e){C.visualFilterDialogContainer._triggerSearchInFilterDialog.call(C.visualFilterDialogContainer,e)},onDialogSearch:function(e){C.visualFilterDialogContainer._searchDialog.call(C.visualFilterDialogContainer)},onDialogClear:function(e){v.onClearFilterExtension(e)},onRestore:function(e){C.visualFilterDialogContainer._restoreDialog.call(C.visualFilterDialogContainer)},onDialogCancel:function(e){C.visualFilterDialogContainer._cancelDialog.call(C.visualFilterDialogContainer)},onRowSelectionChange:function(e){var t=e.getSource();m.oCommonUtils.setEnabledToolbarButtons(t)},dataStateFilter:function(e,t){return C.oMessageStripHelper.dataStateFilter(e,t)},dataStateClose:function(){C.oMessageStripHelper.onClose()},onAddCardsToRepository:function(e){var t=m.oServices.oPresentationControlHandlerFactory.getPresentationControlHandler(C.oSmartChart);var a=C.oController.getOwnerComponent();var r=t.getModel();var n=t.getEntitySet();var i=C.oController.getView();var o=r.getMetaModel().getODataEntitySet(n);var l=r.getMetaModel().getODataEntityType(o.entityType);var s={};s["currentControlHandler"]=t;s["component"]=a;s["view"]=i;s["entitySet"]=o;s["entityType"]=l;s["oSmartFilterbar"]=C.oSmartFilterbar;var c=_.createAnalyticalCardForPreview(s);R.getServiceAsync("UIService").then(function(e){e.showCardPreview(c.getManifest()).then(function(){})}).catch(function(e){})}},formatters:{formatItemTextForMultipleView:function(e){return C.oMultipleViewsHandler?C.oMultipleViewsHandler.formatItemTextForMultipleView(e):""},formatMessageStrip:function(e,t){return C.oMultipleViewsHandler?C.oMultipleViewsHandler.formatMessageStrip(e,t):""}},extensionAPI:new t(m,v,C)}}}});
//# sourceMappingURL=ControllerImplementation.js.map