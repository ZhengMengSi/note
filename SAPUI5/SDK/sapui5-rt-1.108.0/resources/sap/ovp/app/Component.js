sap.ui.define(["sap/fe/core/AppComponent","sap/base/util/ObjectPath","sap/ui/model/json/JSONModel","sap/ovp/ui/DashboardLayoutUtil","sap/ui/core/mvc/ViewType","sap/ui/model/resource/ResourceModel","sap/ovp/app/resources","sap/ui/core/CustomData","sap/base/util/merge","sap/base/util/isEmptyObject","sap/ovp/cards/ovpLogger","sap/ui/Device","sap/ovp/cards/CommonUtils","sap/ovp/placeholder/placeholderHelper","sap/m/App","sap/m/DynamicDateUtil","sap/ovp/cards/MetadataAnalyser","sap/ovp/cards/charts/VizAnnotationManager","sap/ui/core/mvc/XMLView","sap/ui/core/Core","sap/insights/CardHelper","sap/ui/VersionInfo","sap/ui/rta/RuntimeAuthoring"],function(e,t,r,i,n,a,o,s,l,u,p,g,f,c,d,h,v,y,m,b,C,P){"use strict";var S=new p("OVP.app.Component");return e.extend("sap.ovp.app.Component",{metadata:{manifest:"json",routing:{config:{routerClass:"sap.m.routing.Router"},targets:{},routes:[]},properties:{cardContainerFragment:{type:"string",defaultValue:"sap.ovp.app.CardContainer"},dashboardLayoutUtil:{type:"sap.ovp.ui.DashboardLayoutUtil"},designtimePath:{type:"string",defaultValue:"sap/ovp/ui/OVPWrapper.designtime"}},designtime:{actions:{},aggregations:{rootControl:{actions:{},propagateMetadata:function(){return{}}}}},version:"1.108.0",library:"sap.ovp.app",dependencies:{libs:["sap.ovp"],components:[]},config:{fullWidth:true,hideLightBackground:true}},onServicesStarted:function(){},getRoutingService:function(){return{beforeExit:function(){}}},_getOvpCardOriginalConfig:function(e){var t=this.getOvpConfig();return t.cards[e]},suspend:function(){},restore:function(){var e=this.ovpConfig.cards,t=this.createId("mainView"),r=this.byId(t);var i=this.ovpConfig.refreshStrategyOnAppRestore&&this.ovpConfig.refreshStrategyOnAppRestore.entitySets;if(typeof i==="object"){var n=Object.keys(i);var a=e.filter(function(e){return n.includes(e.settings.entitySet)});for(var o=0;o<a.length;o++){var s=a[o];var l=r.createId(s.id);var u=this.byId(l);var p=u.getComponentInstance()&&u.getComponentInstance().getRootControl()&&u.getComponentInstance().getRootControl().getController();if(p){p.refreshCardContent()}}}y.formatChartAxes()},getOvpConfig:function(){var e;var t=[];var r=this.getMetadata();while(r&&r.getComponentName()!=="sap.ovp.app"){e=r.getManifestEntry("sap.ovp");if(e){t.unshift(e)}r=r.getParent()}t.unshift({});t.unshift(true);e=l.apply(l,t);return e},_removeExtraArrayElements:function(e,t){var r=e["staticContent"],i=t["staticContent"],n=e["tabs"],a=t["tabs"];if(r&&i){if(r.length>i.length){e["staticContent"].splice(i.length,r.length-i.length)}}if(n&&a){if(n.length>a.length){e["tabs"].splice(a.length,n.length-a.length)}}},_emptyAllArrayElements:function(e,t){var r=e["staticContent"],i=t["staticContent"],n=e["tabs"],a=t["tabs"];if(r&&i){for(var o=0;o<r.length;o++){e["staticContent"][o]={}}}if(n&&a){for(var o=0;o<n.length;o++){e["tabs"][o]={}}}},_mergeObjects:function(e,t){for(var r in t){if(t.hasOwnProperty(r)){var i=t[r];if(typeof i=="object"&&e[r]){if(i.operation==="DELETE"){delete e[r]}else{this._mergeObjects(e[r],i)}}else{if(typeof i=="object"&&!e[r]&&i.operation==="DELETE"){continue}e[r]=i}}}return e},_mergeLayerObject:function(e,t){if(!e[t+".settings"]){return e}var r=l({},e["settings"]),i=l({},e[t+".settings"]);this._removeExtraArrayElements(r,i);this._emptyAllArrayElements(r,i);e["settings"]=this._mergeObjects(r,i);return e},_mergeKeyUserChanges:function(e){if(!e.hasOwnProperty("customer.settings")&&!e.hasOwnProperty("customer_base.settings")&&!e.hasOwnProperty("vendor.settings")){return e}e=this._mergeLayerObject(e,"vendor");e=this._mergeLayerObject(e,"customer_base");e=this._mergeLayerObject(e,"customer");return e},_getFullyQualifiedNameForEntity:function(e,t){var r="",i;if(!e){return""}if(e.indexOf(".")>-1){return e}var n=t.getMetaModel();if(f.isODataV4(t)){var a=n.getObject("/");var o=a[e];r=o.$Type;return r}else{var s=n&&n.getODataEntityContainer();r=s&&s.namespace;if(r&&!(e.indexOf(r)>-1)){i=r+"."+e}else{i=e}return i}},_getDatePropertiesFromEntitySet:function(e,t,r){var i=[],n=[];var a=e.getMetaModel();var o=a&&a.getODataEntityContainer();var s=o.entitySet.filter(function(e){return e.entityType===r});var l=s.length>0?s[0]:{};var p=v.checkAnalyticalParameterisedEntitySet(e,l.name);if(p){var g=v.getParametersByEntitySet(e,l.name);if(g.entitySetName){i=v.getPropertyOfEntitySet(e,g.entitySetName);i.forEach(function(e){e._filterRestriction="single-value"})}}i=i.concat(t.property);for(var c in i){var d={};if(f.isDate(i[c])){d.PropertyPath=i[c].name}if(!u(d)){n.push(d)}}return n},_getAllControlConfiguration:function(e,t,r){for(var i=0;i<e.length;i++){if(r[e[i].PropertyPath]){var n=false;for(var a=0;a<t.length;a++){if(t[a].PropertyPath===e[i].PropertyPath){n=true}}if(!n){e[i].bNotPartOfSelectionField=true;t.push(e[i])}}}return t},_getSettingsForDateProperties:function(e,t){var r={};for(var i in e){if(t.fields&&t.fields[e[i].PropertyPath]){r[e[i].PropertyPath]=this.getConditionTypeForDateSetting(t.fields[e[i].PropertyPath])}else{if(t.customDateRangeImplementation||t.filter||t.selectedValues){r[e[i].PropertyPath]=this.getConditionTypeForDateSetting(t)}}}return r},getConditionTypeForDateSetting:function(e){if(e.customDateRangeImplementation){return{customDateRangeImplementation:e.customDateRangeImplementation}}else if(e.filter){return{filter:e.filter}}else if(e.selectedValues){return{selectedValues:e.selectedValues,exclude:e.exclude!==undefined?e.exclude:true}}else if(e.defaultValue){return{defaultValue:e.defaultValue}}return undefined},createXMLView:function(e){if(this.getRouter()){this.getRouter().initialize()}var a=this.getMetadata().getManifestEntry("sap.app");var o=this.getMetadata().getManifestEntry("sap.ui");var p=t.get("icons.icon",o);var c=this.getModel(e.globalFilterModel);var d=c&&c.getMetaModel();this.setModel(c);var v=this.getMetadata().getComponentName();var y=v.replace(/\./g,"/");e.baseUrl=sap.ui.require.toUrl(y);e.useMacroFilterBar=c?f.isODataV4(c):false;if(e.smartVariantRequired===undefined||e.smartVariantRequired===null){e.smartVariantRequired=true}if(e.enableLiveFilter===undefined||e.enableLiveFilter===null){e.enableLiveFilter=true}if(e.showDateInRelativeFormat===undefined||e.showDateInRelativeFormat===null){e.showDateInRelativeFormat=true}if(e.filterSettings&&e.filterSettings.dateSettings&&e.filterSettings.dateSettings.useDateRange!==undefined&&e.useDateRangeType!==undefined){throw new Error("Defining both useDateRange and useDateRangeType in the manifest is not allowed")}e.useDateRangeType=e.filterSettings&&e.filterSettings.dateSettings&&e.filterSettings.dateSettings.useDateRange!==undefined?e.filterSettings.dateSettings.useDateRange:e.useDateRangeType;if(e.useDateRangeType===undefined||e.useDateRangeType===null){e.useDateRangeType=false}if(e.bHeaderExpanded===undefined||e.bHeaderExpanded===null){e.bHeaderExpanded=g.system.desktop?true:false}if(e.chartSettings===undefined||e.chartSettings===null){e.chartSettings={}}if(e.chartSettings.showDataLabel===undefined||e.chartSettings.showDataLabel===null){e.chartSettings.showDataLabel=false}if(e.globalFilterEntitySet&&e.globalFilterEntitySet!==" "){var b=d&&d.getODataEntitySet(e.globalFilterEntitySet);e.globalFilterEntityType=b&&b.entityType}var C=e.globalFilterEntityType;if(e.globalFilterEntityType&&e.globalFilterEntityType!==" "&&e.globalFilterEntityType.length>0){e.globalFilterEntityType=this._getFullyQualifiedNameForEntity(e.globalFilterEntityType,c);e.globalFilterEntityTypeNQ=e.globalFilterEntityType.split(".").pop()}var P=new r(e);P.setProperty("/applicationId",t.get("id",a));P.setProperty("/title",t.get("title",a));P.setProperty("/description",t.get("description",a));if(e.globalFilterEntityType){var S,O;if(f.isODataV4(c)){S=d.getObject("/"+e.globalFilterEntityType+"@com.sap.vocabularies.UI.v1.SelectionFields");O=d.getObject("/"+e.globalFilterEntityType);P.setProperty("/mainEntityVersion","ODataV4")}else{O=d.getODataEntityType(e.globalFilterEntityType);S=l([],O["com.sap.vocabularies.UI.v1.SelectionFields"]);P.setProperty("/mainEntityVersion","ODataV2");if(e.filterSettings&&e.filterSettings.dateSettings){var E=this._getDatePropertiesFromEntitySet(c,O,e.globalFilterEntityType);var D=this._getSettingsForDateProperties(E,e.filterSettings.dateSettings);if(P.getProperty("/useDateRangeType")&&D&&!u(D)){P.setProperty("/useDateRangeType",false);E.forEach(function(e){if(!D.hasOwnProperty(e["PropertyPath"])||!D[e["PropertyPath"]]){var t=e["PropertyPath"];D[t]={selectedValues:h.getAllOptionKeys().toString(),exclude:false}}})}S=this._getAllControlConfiguration(E,S,D);P.setProperty("/datePropertiesSettings",D)}}P.setProperty("/allControlConfiguration",S);P.setProperty("/mainEntityType",O)}if(p){if(p.indexOf("sap-icon")<0&&p.charAt(0)!=="/"){p=e.baseUrl+"/"+p}P.setProperty("/icon",p)}var F=e.cards;var T=[];var _;for(var R in F){if(F.hasOwnProperty(R)&&F[R]){_=this._mergeKeyUserChanges(F[R]);_.id=R;T.push(_)}}T.sort(function(e,t){if(e.id<t.id){return-1}else if(e.id>t.id){return 1}else{return 0}});P.setProperty("/cards",T);if(this.inResizableTestMode()===true){e.containerLayout="resizable"}if(e.containerLayout&&e.containerLayout==="resizable"){P.setProperty("/cardContainerFragment","sap.ovp.app.DashboardCardContainer");P.setProperty("/dashboardLayout",e.resizableLayout);var M=new i(P);this.setDashboardLayoutUtil(M)}else{P.setProperty("/cardContainerFragment",this.getCardContainerFragment())}this.setModel(P,"ui");var w=this._getOvpLibResourceBundle();this.setModel(w,"ovplibResourceBundle");var O;if(f.isODataV4(c)){O="/"+e.globalFilterEntityType}else{O=d&&d.getODataEntityType(e.globalFilterEntityType,true)}var A=this.createId("mainView");var V=new m(A,{height:"100%",preprocessors:{xml:{bindingContexts:{ui:P.createBindingContext("/"),meta:d.createBindingContext(O),contextPath:d.createBindingContext("/"+C),entitySet:C},models:{ui:P,meta:d,contextPath:d,metaModel:d}}},type:n.XML,viewName:"sap.ovp.app.Main",async:true,customData:[new s({key:"sap-ui-custom-settings",value:{"sap.ui.dt":{designtime:"sap/ovp/ui/OVPWrapper.designtime"}}})]});return V},_showErrorPage:function(){var e=new m({height:"100%",type:n.XML,viewName:"sap.ovp.app.Error"});var t=this._getOvpLibResourceBundle();e.setModel(t,"ovplibResourceBundle");this.setAggregation("rootControl",e);if(this.oContainer){this.oContainer.invalidate()}},_formParamString:function(e){var t=Object.keys(e);var r;var i="?";for(r=0;r<t.length;r++){i=i+t[r]+"="+e[t[r]]+"&"}return i.slice(0,-1)},_checkForAuthorizationForCards:function(e){var t=b.getConfiguration();var r=t&&t.getDesignMode();if(r){return Promise.resolve(e)}var i=[];var n=[];for(var a in e.cards){var o=e.cards[a];if(o&&o.settings&&o.settings.requireAppAuthorization){n.push(a);i.push({target:{shellHash:o.settings.requireAppAuthorization}})}}if(i.length>0&&sap.ushell&&sap.ushell.Container){return sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(e){return e.isNavigationSupported(i)}).then(function(t){var r=n.filter(function(e,r){if(!t[r].supported){return e}});for(var i=0;i<r.length;i++){for(var a in e.cards){if(r[i]===a){delete e.cards[a];break}}}return Promise.resolve(e)}).catch(function(e){S.error(e);return Promise.reject(e)})}else{return Promise.resolve(e)}},_checkForAuthorizationForLineItems:function(){return new Promise(function(e,t){var r=[],i=[];var n=this.getOvpConfig();var a=n["cards"];for(var o in a){if(a.hasOwnProperty(o)&&a[o]){var s=a[o];var l=s.settings;if((s.template==="sap.ovp.cards.linklist"||s.template==="sap.ovp.cards.v4.linklist")&&l.listFlavor==="standard"&&l.staticContent){var u=l.staticContent;for(var p=0;p<u.length;p++){if(u[p].semanticObject||u[p].action){var g="#"+u[p].semanticObject+"-"+u[p].action;if(u[p].params){var f=this._formParamString(u[p].params);g=g+f}if(i.indexOf(o)===-1){i.push(o)}if(r.indexOf(g)===-1){r.push(g)}}}}}}this._oCardsWithStaticContent=i;if(sap.ushell&&sap.ushell.Container){sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported(r).done(function(t){var r=this.getOvpConfig();for(var i in t){if(t.hasOwnProperty(i)&&t[i].supported===false){for(var n=0;n<this._oCardsWithStaticContent.length;n++){var a=r["cards"][this._oCardsWithStaticContent[n]].settings.staticContent;for(var o=a.length-1;o>=0;o--){var s="#"+a[o].semanticObject+"-"+a[o].action;if(a[o].params){var l=this._formParamString(a[o].params);s=s+l}if(i===s){a.splice(o,1)}}r["cards"][this._oCardsWithStaticContent[n]].settings.staticContent=a}}}delete this._oCardsWithStaticContent;e(r)}.bind(this)).fail(function(e){S.error(e);t(e)})}else{e(n)}}.bind(this))},createContent:function(){var e=this.getOvpConfig();var t=this.getModel(e.globalFilterModel);var r=[this._checkForAuthorizationForLineItems(e),o.pResourcePromise,this._isInsightRTEnabled(),P.load({library:"sap.ui.core"})];if(f.isODataV4(t)){r.unshift(t&&t.getMetaModel().requestObject("/"+e.globalFilterModel))}else{r.unshift(t&&t.getMetaModel().loaded())}if(t&&!this.getAggregation("rootControl")){Promise.all(r).then(function(e){var t=e[3];this.ovpConfig=e[1];this.ovpConfig.sapUICoreVersionInfo=e[4];if(this._isInsightDTEnabled()){this.ovpConfig.bInsightDTEnabled=true;return Promise.resolve(this.ovpConfig)}else{if(t){this.ovpConfig.bInsightRTEnabled=true}return this._checkForAuthorizationForCards(this.ovpConfig)}}.bind(this)).then(function(e){this.oOvpConfig=e;this.runAsOwner(function(){var e=this.createId("host"),t=new d(e),r=this.createXMLView(this.oOvpConfig);r.loaded().then(function(){if(c.isPlaceHolderEnabled()){t.addPage(r);this.setAggregation("rootControl",t);c.showPlaceholder(t)}else{this.setAggregation("rootControl",r)}this.oContainer.invalidate()}.bind(this))}.bind(this))}.bind(this));if(!f.isODataV4(t)){t.attachMetadataFailed(function(){this._showErrorPage()}.bind(this))}}},_getOvpLibResourceBundle:function(){if(!this.ovplibResourceBundle){var e=b.getLibraryResourceBundle("sap.ovp");this.ovplibResourceBundle=e?new a({bundleUrl:e.oUrlInfo.url,bundle:e}):null}return this.ovplibResourceBundle},createMapForEntityContainer:function(e){var t={};var r=e.entitySet;for(var i=0;i<r.length;i++){t[r[i].name]=r[i].entityType}return t},inResizableTestMode:function(){return this._getQueryParamUpToTop("resizableTest")=="true"},_isInsightDTEnabled:function(){return this._getQueryParamUpToTop("mode")==="myInsight"||this._getQueryParamUpToTop("mode")==="DT"},_isInsightRTEnabled:function(){var e=this._getQueryParamUpToTop("mode")==="RT";return new Promise(function(t,r){if(!C||!C.getServiceAsync){t(e);return}return C.getServiceAsync().then(function(r){t(!!r||e)}).catch(function(r){S.error("Failed to get CardHelperServiceInstance."+r);t(e)})})},_getQueryParamUpToTop:function(e){var t=window;var r=this.getQueryParam(t.location.search,e);if(r!=null){return r}if(t==t.parent){return null}t=t.parent;return null},getQueryParam:function(e,t){var r=null;if(!e){return r}if(e.indexOf("?")!=-1){e=e.substring(e.indexOf("?"))}if(e.length>1&&e.indexOf(t)!=-1){e=e.substring(1);var i=e.split("&");for(var n=0;n<i.length;n++){var a=i[n].split("=");if(a[0]==t){r=a[1];break}}}return r}})});
//# sourceMappingURL=Component.js.map