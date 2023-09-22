sap.ui.define(["sap/ui/core/UIComponent","sap/ovp/cards/rta/SettingsDialogConstants","sap/ui/core/routing/Router","sap/ui/thirdparty/jquery","sap/base/util/ObjectPath","sap/base/Log","sap/ui/model/json/JSONModel","sap/ovp/ui/DashboardLayoutUtil","sap/ui/core/mvc/ViewType","sap/ui/model/resource/ResourceModel","sap/ovp/app/resources","sap/ui/core/CustomData","sap/ushell/Config","sap/ui/rta/RuntimeAuthoring"],function(U,S,R,q,O,L,J,D,V,a,b,C,c){"use strict";return U.extend("sap.ovp.app.Component",{metadata:{routing:{config:{routerClass:R},targets:{},routes:[]},properties:{"cardContainerFragment":{"type":"string","defaultValue":"sap.ovp.app.CardContainer"},"dashboardLayoutUtil":{"type":"sap.ovp.ui.DashboardLayoutUtil"},"designtimePath":{"type":"string","defaultValue":"sap/ovp/ui/OVPWrapper.designtime"}},version:"1.75.0",library:"sap.ovp.app",dependencies:{libs:["sap.ovp"],components:[]},config:{fullWidth:true,hideLightBackground:true}},_getOvpCardOriginalConfig:function(s){var o=this.getOvpConfig();return o.cards[s];},getOvpConfig:function(){var o;var e=[];var m=this.getMetadata();while(m&&m.getComponentName()!=="sap.ovp.app"){o=m.getManifestEntry("sap.ovp");if(o){e.unshift(o);}m=m.getParent();}e.unshift({});e.unshift(true);o=q.extend.apply(q,e);return o;},_removeExtraArrayElements:function(s,o){var d=s["staticContent"],e=o["staticContent"],f=s["tabs"],g=o["tabs"];if(d&&e){if(d.length>e.length){s["staticContent"].splice(e.length,d.length-e.length);}}if(f&&g){if(f.length>g.length){s["tabs"].splice(g.length,f.length-g.length);}}},_emptyAllArrayElements:function(s){var d=s["staticContent"],e=s["tabs"],i;if(d){for(i=0;i<d.length;i++){s["staticContent"][i]={};}}if(e){for(i=0;i<e.length;i++){s["tabs"][i]={};}}},_mergeObjects:function(o,d){for(var p in d){if(d.hasOwnProperty(p)){var v=d[p];if(typeof v=="object"&&o[p]){if(v.operation==="DELETE"){delete o[p];}else{this._mergeObjects(o[p],v);}}else{if(typeof v=="object"&&!o[p]&&v.operation==="DELETE"){continue;}o[p]=v;}}}return o;},_mergeLayerObject:function(o,l){if(!o[l+".settings"]){return o;}var s=q.extend(true,{},o["settings"]),d=q.extend(true,{},o[l+".settings"]);this._removeExtraArrayElements(s,d);this._emptyAllArrayElements(s);o["settings"]=this._mergeObjects(s,d);return o;},_mergeKeyUserChanges:function(o){if(!o.hasOwnProperty("customer.settings")&&!o.hasOwnProperty("customer_base.settings")&&!o.hasOwnProperty("vendor.settings")){return o;}o=this._mergeLayerObject(o,"vendor");o=this._mergeLayerObject(o,"customer_base");o=this._mergeLayerObject(o,"customer");return o;},_getFullyQualifiedNameForEntity:function(e,f){var n,r;if(!e){return"";}if(e.indexOf(".")>-1){return e;}var d=f&&f.getODataEntityContainer();n=d&&d.namespace;if(n&&!(e.indexOf(n)>-1)){r=n+"."+e;}else{r=e;}return r;},createXMLView:function(o){if(this.getRouter()){this.getRouter().initialize();}var d=this.getMetadata().getManifestEntry("sap.app");var u=this.getMetadata().getManifestEntry("sap.ui");var i=O.get("icons.icon",u);var s=this.getMetadata().getComponentName();var e=s.replace(/\./g,"/");o.baseUrl=sap.ui.require.toUrl(e);if(o.smartVariantRequired===undefined||o.smartVariantRequired===null){o.smartVariantRequired=true;}if(o.enableLiveFilter===undefined||o.enableLiveFilter===null){o.enableLiveFilter=true;}if(o.showDateInRelativeFormat===undefined||o.showDateInRelativeFormat===null){o.showDateInRelativeFormat=true;}if(o.useDateRangeType===undefined||o.useDateRangeType===null){o.useDateRangeType=false;}if(o.bHeaderExpanded===undefined||o.bHeaderExpanded===null){o.bHeaderExpanded=false;}var f=this.getModel(o.globalFilterModel);var F=f&&f.getMetaModel();this.setModel(f);if(o.globalFilterEntitySet&&o.globalFilterEntitySet!==" "){var E=F&&F.getODataEntitySet(o.globalFilterEntitySet);o.globalFilterEntityType=E&&E.entityType;}if(o.globalFilterEntityType&&o.globalFilterEntityType!==" "&&o.globalFilterEntityType.length>0){o.globalFilterEntityType=this._getFullyQualifiedNameForEntity(o.globalFilterEntityType,F);o.globalFilterEntityTypeNQ=o.globalFilterEntityType.split(".").pop();}var g=new J(o);g.setProperty("/applicationId",O.get("id",d));g.setProperty("/title",O.get("title",d));g.setProperty("/description",O.get("description",d));if(i){if(i.indexOf("sap-icon")<0&&i.charAt(0)!=='/'){i=o.baseUrl+"/"+i;}g.setProperty("/icon",i);}var h=o.cards;var j=[];var k;for(var l in h){if(h.hasOwnProperty(l)&&h[l]){k=this._mergeKeyUserChanges(h[l]);k.id=l;j.push(k);}}j.sort(function(r,t){if(r.id<t.id){return-1;}else if(r.id>t.id){return 1;}else{return 0;}});g.setProperty("/cards",j);if(this.inResizableTestMode()===true){o.containerLayout="resizable";}if(o.containerLayout&&o.containerLayout==="resizable"){g.setProperty("/cardContainerFragment","sap.ovp.app.DashboardCardContainer");g.setProperty("/dashboardLayout",o.resizableLayout);var m=new D(g);this.setDashboardLayoutUtil(m);}else{g.setProperty("/cardContainerFragment",this.getCardContainerFragment());}this.setModel(g,"ui");var n=this._getOvpLibResourceBundle();this.setModel(n,"ovplibResourceBundle");var p=F&&F.getODataEntityType(o.globalFilterEntityType,true);var v=sap.ui.view("mainView",{height:"100%",preprocessors:{xml:{bindingContexts:{ui:g.createBindingContext("/"),meta:F.createBindingContext(p)},models:{ui:g,meta:F}}},type:V.XML,viewName:"sap.ovp.app.Main",async:true,customData:[new C({key:"sap-ui-custom-settings",value:{"sap.ui.dt":{"designtime":"sap/ovp/ui/OVPWrapper.designtime"}}})]});return v;},_showErrorPage:function(){var v=sap.ui.view({height:"100%",type:V.XML,viewName:"sap.ovp.app.Error"});var o=this._getOvpLibResourceBundle();v.setModel(o,"ovplibResourceBundle");this.setAggregation("rootControl",v);this.oContainer.invalidate();},_formParamString:function(p){var k=Object.keys(p);var i;var P="?";for(i=0;i<k.length;i++){P=P+k[i]+"="+p[k[i]]+"&";}return P.slice(0,-1);},_checkForAuthorizationForLineItems:function(){return new Promise(function(r,d){var A=[],o=[];var e=this.getOvpConfig();var f=e["cards"];for(var s in f){if(f.hasOwnProperty(s)&&f[s]){var g=f[s];var h=g.settings;if(g.template==="sap.ovp.cards.linklist"&&h.listFlavor==="standard"&&h.staticContent){var k=h.staticContent;for(var i=0;i<k.length;i++){if(k[i].semanticObject||k[i].action){var I="#"+k[i].semanticObject+"-"+k[i].action;if(k[i].params){var p=this._formParamString(k[i].params);I=I+p;}if(o.indexOf(s)===-1){o.push(s);}if(A.indexOf(I)===-1){A.push(I);}}}}}}this._oCardsWithStaticContent=o;if(sap.ushell&&sap.ushell.Container){sap.ushell.Container.getService('CrossApplicationNavigation').isIntentSupported(A).done(function(l){var e=this.getOvpConfig();for(var m in l){if(l.hasOwnProperty(m)&&l[m].supported===false){for(var i=0;i<this._oCardsWithStaticContent.length;i++){var k=e["cards"][this._oCardsWithStaticContent[i]].settings.staticContent;for(var j=k.length-1;j>=0;j--){var I="#"+k[j].semanticObject+"-"+k[j].action;if(k[j].params){var p=this._formParamString(k[j].params);I=I+p;}if(m===I){k.splice(j,1);}}e["cards"][this._oCardsWithStaticContent[i]].settings.staticContent=k;}}}delete this._oCardsWithStaticContent;r(e);}.bind(this)).fail(function(E){L.error(E);d(E);});}else{r(e);}}.bind(this));},setContainer:function(){var o=this.getOvpConfig();var f=this.getModel(o.globalFilterModel);U.prototype.setContainer.apply(this,arguments);if(f&&!this.getAggregation("rootControl")){Promise.all([f.getMetaModel().loaded(),this._checkForAuthorizationForLineItems(o),b.pResourcePromise]).then(function(r){this.oOvpConfig=r[1];this.runAsOwner(function(){var v=this.createXMLView(this.oOvpConfig);v.loaded().then(function(){this.setAggregation("rootControl",v);this.oContainer.invalidate();}.bind(this));}.bind(this));}.bind(this));f.attachMetadataFailed(function(){this._showErrorPage();}.bind(this));}},_getOvpLibResourceBundle:function(){if(!this.ovplibResourceBundle){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ovp");this.ovplibResourceBundle=r?new a({bundleUrl:r.oUrlInfo.url,bundle:r}):null;}return this.ovplibResourceBundle;},createMapForEntityContainer:function(e){var E={};var o=e.entitySet;for(var i=0;i<o.length;i++){E[o[i].name]=o[i].entityType;}return E;},inResizableTestMode:function(){return this._getQueryParamUpToTop('resizableTest')=='true';},_getQueryParamUpToTop:function(n){var w=window;var v=this.getQueryParam(w.location.search,n);if(v!=null){return v;}if(w==w.parent){return null;}w=w.parent;return null;},getQueryParam:function(d,n){var v=null;if(!d){return v;}if(d.indexOf('?')!=-1){d=d.substring(d.indexOf('?'));}if(d.length>1&&d.indexOf(n)!=-1){d=d.substring(1);var p=d.split('&');for(var i=0;i<p.length;i++){var e=p[i].split('=');if(e[0]==n){v=e[1];break;}}}return v;}});});