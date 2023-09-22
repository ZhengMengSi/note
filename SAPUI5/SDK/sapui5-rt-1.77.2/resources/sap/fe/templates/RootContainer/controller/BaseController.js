sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/core/mvc/Controller","sap/ui/core/Component","sap/ui/core/routing/HashChanger","sap/fe/core/CommonUtils","sap/base/Log"],function(J,C,a,H,b,L){"use strict";return C.extend("sap.fe.templates.RootContainer.controller.BaseController",{onInit:function(){this.shellTitleHandler();},waitForRightMostViewReady:function(e){return new Promise(function(r,c){var d=e.getParameter("views");var v=d[d.length-1].getComponentInstance();var V=v.getRootControl();if(v.isPageReady()){r(V);}else{v.attachEventOnce("pageReady",function(){r(V);});}});},shellTitleHandler:function(){var t=this;var r=this.getView();var A=b.getAppComponent(r);var R=A.getRouter();var f=function(e){t.waitForRightMostViewReady(e).then(function(v){var A=b.getAppComponent(v);var o=A.getRouterProxy();var d={oView:v,oAppComponent:A};t.computeTitleHierarchy(d);var h=o._oManagedHistory;var c=window.location.hash;var l;for(var i=h.length-1;i>-1;i--){var s="#"+h[i].hash;if(c===s||s===c+"&/"){l=h[i].oLastFocusControl;break;}else{h[i].oLastFocusControl=undefined;}}if(v.getController().onPageReady){v.getParent().onPageReady({lastFocusedControl:l});}}).catch(function(){L.error("An error occurs while computing the title hierarchy and calling focus method");});};R.attachRouteMatched(f);},getTitleHierarchyCache:function(){if(!this.oTitleHierarchyCache){this.oTitleHierarchyCache={};}return this.oTitleHierarchyCache;},_computeTitleInfo:function(t,s,i){return{title:t,subtitle:s,intent:i,icon:""};},addNewEntryInCacheTitle:function(p,A){var t=this.getView().getModel("title");if(!t){var s=A.getMetadata().getManifestEntry("/sap.app/dataSources/mainService/uri");t=new sap.ui.model.odata.v4.ODataModel({serviceUrl:s,synchronizationMode:"None"});}var c=this;var e=p.replace(/ *\([^)]*\) */g,"");var T=A.getMetaModel().getProperty(e+"/@com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value");var d=A.getMetaModel().getProperty(e+"/@com.sap.vocabularies.UI.v1.HeaderInfo/TypeName");var B=t.createBindingContext(p);var P=t.bindProperty(T["$Path"],B);A.getRootControl().setModel(t,"title");P.initialize();return new Promise(function(r,f){var g=H.getInstance().hrefForAppSpecificHash("");var i=g+p.slice(1);var h=function(E){var o=c.getTitleHierarchyCache();o[p]=c._computeTitleInfo(d,E.getSource().getValue(),i);r(o[p]);P.detachChange(h);};P.attachChange(h);});},computeTitleHierarchy:function(d){var t=this;var v=d.oView;var A=d.oAppComponent;var c=v.getBindingContext();if(c){var n=c.getPath();if(this.bIsComputingTitleHierachy===true){L.warning("computeTitleHierarchy already running ... this call is canceled");return;}this.bIsComputingTitleHierachy=true;var o=v.getParent();var T=[];if(o&&o.getPageTitleInformation){var s=H.getInstance().hrefForAppSpecificHash("");var p=n.split("/"),P="";var N=p.length;p.splice(-1,1);var e;p.forEach(function(g,i){if(i===0){var r=A.getManifestEntry("/sap.ui5/routing/routes"),h=A.getManifestEntry("/sap.ui5/routing/targets");var l=function(m){if(typeof r[this.index].target==="string"){return m===r[this.index].target;}else if(typeof r[this.index].target==="object"){for(var k=0;k<r[this.index].target.length;k++){return m===r[this.index].target[k];}}};for(var j=0;j<r.length;j++){var R=A.getRouter().getRoute(r[j].name);if(R.match(p[i])){var m=Object.keys(h).find(l,{index:j});e=A.getRouter().getTarget(m)._oOptions.name;break;}}if(e==="sap.fe.templates.ListReport"){var q=A.getMetadata().getManifestEntry("sap.app").title||"",u=A.getMetadata().getManifestEntry("sap.app").appSubTitle||"",w=s;T.push(Promise.resolve(t._computeTitleInfo(q,u,w)));}}else if(i<N){P+="/"+g;if(!t.getTitleHierarchyCache()[P]){T.push(t.addNewEntryInCacheTitle(P,A));}else{T.push(Promise.resolve(t.getTitleHierarchyCache()[P]));}}});var f=o.getPageTitleInformation().then(function(g){g.intent=s+H.getInstance().getHash();t.getTitleHierarchyCache()[n]=g;return g;});T.push(f);}else{T.push(Promise.reject("Title information missing in HeaderInfo"));}Promise.all(T).then(function(g){A.getService("ShellUIService").then(function(S){var h=g[g.length-1].title;S.setHierarchy(g.reverse());S.setTitle(h);},function(E){L.warning("No ShellService available");});}).catch(function(E){L.error(E);}).finally(function(){t.bIsComputingTitleHierachy=false;});}}});});