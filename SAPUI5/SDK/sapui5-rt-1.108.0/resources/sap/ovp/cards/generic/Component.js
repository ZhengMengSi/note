sap.ui.define(["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel","sap/ovp/cards/CommonUtils","sap/ui/Device","sap/ui/model/resource/ResourceModel","sap/ui/core/mvc/ViewType","sap/base/util/merge","sap/ovp/app/OVPUtils","sap/ovp/cards/ovpLogger","sap/ui/core/mvc/XMLView","sap/ui/base/Object","sap/ui/core/Core"],function(e,t,a,n,i,o,r,s,l,d,p,c){"use strict";var u=new l("OVP.generic.Component");return e.extend("sap.ovp.cards.generic.Component",{metadata:{properties:{contentFragment:{type:"string"},controllerName:{type:"string",defaultValue:"sap.ovp.cards.generic.Card"},headerExtensionFragment:{type:"string"},contentPosition:{type:"string",defaultValue:"Middle"},headerFragment:{type:"string",defaultValue:"sap.ovp.cards.generic.Header"},footerFragment:{type:"string"},identificationAnnotationPath:{type:"string",defaultValue:"com.sap.vocabularies.UI.v1.Identification"},selectionAnnotationPath:{type:"string"},filters:{type:"object"},parameters:{type:"object"},addODataSelect:{type:"boolean",defaultValue:false},enableAddToInsight:{type:"boolean",defaultValue:false}},version:"1.108.0",library:"sap.ovp",includes:[],dependencies:{libs:[],components:[]},config:{}},setSelectionVariant:function(e,t){if(/^@/.test(e)){e=e.slice(1)}t.selectionAnnotationPath=e},setPresentationVariant:function(e,t,a){if(/^@/.test(e)){e=e.slice(1)}t.presentationAnnotationPath=e;var n=e.split("/");var i=n.length===1?a[e].Visualizations:a[n[0]][n[1]][n[2]].Visualizations;var o;for(o=0;o<i.length;o++){var r=i[o].AnnotationPath;if(r){if(/^@/.test(r)){r=r.slice(1)}if(/.LineItem/.test(r)){t.annotationPath=r;break}}}for(o=0;o<i.length;o++){var r=i[o].AnnotationPath;if(r){if(/^@/.test(r)){r=r.slice(1)}if(/.Chart/.test(r)){t.chartAnnotationPath=r;break}}}},setDataPointAnnotationPath:function(e,t){if(/^@/.test(e)){e=e.slice(1)}t.dataPointAnnotationPath=e},getCustomPreprocessor:function(){},getPreprocessors:function(e){var i=this.getComponentData(),o=i.settings,l=i.model,d,p,c,u;if(o.description&&!o.subTitle){o.subTitle=o.description}if(l&&a.isODataV4(l)){d=l&&l.getMetaModel();var f="/"+o.entitySet;var p=d.getObject(f);u=d.createBindingContext(f);if(p&&p["$Type"]){c=d.createBindingContext("/"+p["$Type"])}}else if(l&&o.entitySet){d=l&&l.getMetaModel();var v=d.getODataEntitySet(o.entitySet);var h=d.getODataEntitySet(o.entitySet,true);p=d.getODataEntityType(v.entityType);u=d.createBindingContext(h);c=d.createBindingContext(p.$path)}var g=this._getCardPropertyDefaults();var m=this._completeLayoutDefaults(g,o);var y,C;if(i.appComponent&&i.appComponent.getModel("ui")&&i.appComponent.getModel("ui").oData){var b=i.appComponent.getModel("ui").oData;y=b.showDateInRelativeFormat;C=b.disableTableCardFlexibility}else{if(i.showDateInRelativeFormat){y=i.showDateInRelativeFormat}if(i.disableTableCardFlexibility){C=i.disableTableCardFlexibility}}if(i.ovpCardsAsApi){i.settings.enableAddToInsight=false}var P=i&&i.appComponent&&i.appComponent.ovpConfig||{};var D={metaModel:d,entityType:p,webkitSupport:n.browser.webkit,layoutDetail:m&&m.cardLayout?m.cardLayout.containerLayout:"fixed",bInsightDTEnabled:P.bInsightDTEnabled||false,bInsightRTEnabled:P.bInsightRTEnabled||false,bInsightEnabled:P.bInsightDTEnabled||P.bInsightRTEnabled||false,showDateInRelativeFormat:y,disableTableCardFlexibility:C,cardId:i.cardId};if(!!i&&!!i.cardId){var I=i.mainComponent;var T=null;if(!!I){T=I._getCardFromManifest(i.cardId)?I._getCardFromManifest(i.cardId).template:null}else{T=i.template}if(!!T){D.template=T}}g.densityStyle=a._setCardpropertyDensityAttribute();if(i.errorReason){var V=i.errorReason;var A=V.getParameters?V.getParameters():V.mParameters;var M="sap-icon://message-error";if(A&&A.response){g.errorStatusCode=A.response.statusCode;g.errorStatusText=A.response.statusText;g.responseText=A.response.responseText;g.sMessageIcon=A.response.sIcon?A.response.sIcon:M}}if(m){D.cardLayout=m.cardLayout}if(g.state!=="Error"){if(o&&o.kpiAnnotationPath){var L=p[o.kpiAnnotationPath];var S=g.contentFragment;if(L&&(S==="sap.ovp.cards.charts.analytical.analyticalChart"||S==="sap.ovp.cards.charts.smart.analyticalChart")){var x=L.SelectionVariant&&L.SelectionVariant.Path?L.SelectionVariant.Path:o.kpiAnnotationPath+"/SelectionVariant";if(x){this.setSelectionVariant(x,o)}var O=L.Detail&&L.Detail.DefaultPresentationVariant&&L.Detail.DefaultPresentationVariant.Path?L.Detail.DefaultPresentationVariant.Path:o.kpiAnnotationPath+"/Detail/DefaultPresentationVariant";if(O){this.setPresentationVariant(O,o,p)}var R=L.DataPoint&&L.DataPoint.Path?L.DataPoint.Path:o.kpiAnnotationPath+"/DataPoint";if(R){this.setDataPointAnnotationPath(R,o)}}}else if(o&&o.selectionPresentationAnnotationPath){var w=p[o.selectionPresentationAnnotationPath];if(w){var x=w.SelectionVariant&&w.SelectionVariant.Path;if(x){this.setSelectionVariant(x,o)}var O=w.PresentationVariant&&w.PresentationVariant.Path;if(O){this.setPresentationVariant(O,o,p)}}}}if(i.ovpCardsAsApi&&o.ignoreSelectionVariant){o.selectionAnnotationPath="";var F=[];for(var B=0;!!o.filters&&B<o.filters.length;B++){F.push({id:"headerFilterText--"+(B+1),index:B})}o.idForExternalFilters=F}if(!!D.entityType&&!!o.selectionAnnotationPath&&!!D.entityType[o.selectionAnnotationPath]){var k=D.entityType[o.selectionAnnotationPath].SelectOptions;for(var _=0;!!k&&_<k.length;_++){k[_].id="headerFilterText--"+(_+1)}D.entityType[o.selectionAnnotationPath].SelectOptions=k}if((D.template==="sap.ovp.cards.linklist"||D.template==="sap.ovp.cards.v4.linklist")&&!!o.staticContent){for(var E=0;E<o.staticContent.length;E++){o.staticContent[E].id="linkListItem--"+(E+1)}}else if(D.template==="sap.ovp.cards.charts.analytical"){o.dataStep=o.dataStep?o.dataStep:10}g=s.merge(true,{},D,g,o);var U=new t(g);var j={xml:{bindingContexts:{entityType:c,entitySet:u},models:{device:a.deviceModel,entityType:d,entitySet:d,ovpMeta:d,ovpCardProperties:U,ovplibResourceBundle:e,ovpConstants:a.ovpConstantModel},ovpCardProperties:U,dataModel:l,_ovpCache:{}}};return r({},this.getCustomPreprocessor(),j)},_completeLayoutDefaults:function(e,t){var a={},n=this.getComponentData(),i=null,o=null;if(n.appComponent){i=n.appComponent.getOvpConfig()}if(!i){return null}if(i.containerLayout==="resizable"&&n.cardId&&e.contentFragment!=="sap.ovp.cards.quickview.Quickview"){o=n.appComponent.getDashboardLayoutUtil();var r=n.cardId;var s=o.aCards.filter(function(e){return e.id===r});a.cardLayout=s[0].dashboardLayout;a.cardLayout.containerLayout=i.containerLayout;a.cardLayout.iRowHeightPx=o.ROW_HEIGHT_PX;a.cardLayout.iCardBorderPx=o.CARD_BORDER_PX;a.cardLayout.headerHeight=s[0].dashboardLayout.headerHeight}return a},_getCardPropertyDefaults:function(){var e={};var t=this.getMetadata().getAllProperties();var a;for(var n in t){a=t[n];if(a.defaultValue!==undefined){e[a.name]=a.defaultValue}}return e},getOvplibResourceBundle:function(){if(!this.ovplibResourceBundle){var e=c.getLibraryResourceBundle("sap.ovp");this.ovplibResourceBundle=e?new i({bundleUrl:e.oUrlInfo.url}):null}return this.ovplibResourceBundle},_getCacheKeys:function(){var e=this.getComponentData&&this.getComponentData();if(e.ovpCardsAsApi){return}if(e.appComponent&&!p.isA(e.appComponent,"sap.ui.base.ManagedObject")){return}var t=e&&e.settings&&e.settings.isObjectStream;if(t){return}var a=e&&e.model;if(a){var n=[];if(a.metadataLoaded&&typeof a.metadataLoaded==="function"){var i=a.metadataLoaded().then(function(e){var t;if(e&&e.lastModified){t=new Date(e.lastModified).getTime()+""}else{u.error("No valid cache key segment last modification date provided by the OData Model");t=(new Date).getTime()+""}return t});n.push(i)}if(a.annotationsLoaded&&typeof a.metadataLoaded==="function"){var o=a.annotationsLoaded().then(function(e){var t=0;if(e){for(var a=0;a<e.length;a++){if(e[a].lastModified){var n=new Date(e[a].lastModified).getTime();if(n>t){t=n}}}}if(t===0){u.error("No valid cache key segment last modification date provided by OData annotations");t=(new Date).getTime()}return t+""});n.push(o)}return n}},createContent:function(){var e=this.getComponentData&&this.getComponentData();var t=e.model;var a;var n;var i=e&&e.mainComponent;var r=i&&i.oModelViewMap;var s=e&&e.modelName;var l=function(){if(t&&s){t.bIncludeInCurrentBatch=false;if(r&&s&&r[s]&&r[s][e.cardId]){delete r[s][e.cardId];if(Object.keys(r[s]).length>0){t.bIncludeInCurrentBatch=true}}}};if(e&&e.mainComponent){a=e.mainComponent._getOvplibResourceBundle()}else{a=this.getOvplibResourceBundle()}n=this.getPreprocessors(a);var p={preprocessors:n,type:o.XML,viewName:"sap.ovp.cards.generic.Card"};var c=this._getCacheKeys();if(c&&c.length&&c.length>0){p.async=true;p.cache={keys:c}}var u=this._getCardPropertyDefaults().state;var f=e.cardId+(u?u:"Original");if(!u){f=f+(e.settings.selectedKey?"_Tab"+e.settings.selectedKey:"")}if(t&&t.bUseBatch&&!p.async){l()}if(e.appComponent&&typeof e.appComponent.createId==="function"){f=e.appComponent.createId(f)}var v=new d(e.containerId==="dialogCard"?undefined:f,p);if(p.async){var h=v.onControllerConnected;v.onControllerConnected=function(){if(t&&t.bUseBatch){l()}h.apply(v,arguments)}}v.setModel(t);if(e.i18n){v.setModel(e.i18n,"@i18n")}v.setModel(n.xml.ovpCardProperties,"ovpCardProperties");v.setModel(a,"ovplibResourceBundle");return v}})});
//# sourceMappingURL=Component.js.map