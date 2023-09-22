/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/fe/core/CommonUtils","sap/fe/core/helpers/ClassSupport","sap/fe/core/helpers/StableIdHelper","sap/fe/macros/chart/ChartUtils","sap/fe/macros/DelegateUtil","sap/fe/macros/table/Utils","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/m/Select","sap/ui/core/Control","sap/ui/core/Core","sap/ui/core/Item","sap/ui/model/json/JSONModel"],function(e,t,r,i,n,o,a,l,s,c,u,f,h,g){"use strict";var p,d,b,v,y,C,m,_,w,S,T,E,I,P,F;var O=i.generate;var z=r.property;var D=r.defineUI5Class;var j=r.aggregation;function V(e,t,r,i){if(!r)return;Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(i):void 0})}function A(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function M(e,t){e.prototype=Object.create(t.prototype);e.prototype.constructor=e;x(e,t)}function x(e,t){x=Object.setPrototypeOf?Object.setPrototypeOf.bind():function e(t,r){t.__proto__=r;return t};return x(e,t)}function K(e,t,r,i,n){var o={};Object.keys(i).forEach(function(e){o[e]=i[e]});o.enumerable=!!o.enumerable;o.configurable=!!o.configurable;if("value"in o||o.initializer){o.writable=true}o=r.slice().reverse().reduce(function(r,i){return i(e,t,r)||r},o);if(n&&o.initializer!==void 0){o.value=o.initializer?o.initializer.call(n):void 0;o.initializer=undefined}if(o.initializer===void 0){Object.defineProperty(e,t,o);o=null}return o}function B(e,t){throw new Error("Decorating class property failed. Please ensure that "+"proposal-class-properties is enabled and runs after the decorators transform.")}var k="quickFilterKey";var R="filters";var U=(p=D("sap.fe.macros.table.QuickFilterContainer",{interfaces:["sap.m.IOverflowToolbarContent"]}),d=z({type:"boolean"}),b=z({type:"boolean"}),v=z({type:"string"}),y=z({type:"string"}),C=z({type:"string",defaultValue:"$auto"}),m=j({type:"sap.ui.core.Control",multiple:false,isDefault:true}),p(_=(w=function(r){M(i,r);function i(){var e;for(var t=arguments.length,i=new Array(t),n=0;n<t;n++){i[n]=arguments[n]}e=r.call.apply(r,[this].concat(i))||this;V(e,"enabled",S,A(e));V(e,"showCounts",T,A(e));V(e,"entitySet",E,A(e));V(e,"parentEntityType",I,A(e));V(e,"batchGroupId",P,A(e));V(e,"selector",F,A(e));e._attachedToView=false;return e}i.render=function e(t,r){t.renderControl(r.selector)};var u=i.prototype;u.init=function e(){var t=this;r.prototype.init.call(this);this._attachedToView=false;this.attachEvent("modelContextChange",this._initControl);var i={onBeforeRendering:function(){t._createControlSideEffects();t._attachedToView=true;t.removeEventDelegate(i)}};this.addEventDelegate(i,this)};u._initControl=function e(t){if(this.getModel()){this.detachEvent(t.getId(),this._initControl);this._manageTable();this._createContent()}};u._manageTable=function e(){var t=this.getParent();var r=this._getFilterModel(),i=r.getObject("/paths"),n=Array.isArray(i)&&i.length>0?i[0].annotationPath:undefined;while(t&&!t.isA("sap.ui.mdc.Table")){t=t.getParent()}this._oTable=t;if(this.showCounts){this._oTable.getParent().attachEvent("internalDataRequested",this._updateCounts.bind(this))}o.setCustomData(t,k,n)};u.setSelectorKey=function e(t){var r=this.selector;if(r&&r.getSelectedKey()!==t){r.setSelectedKey(t);o.setCustomData(this._oTable,k,t);var i=this._oTable.getFilter&&this._oTable.getFilter();var n=i&&f.byId(i);var a=n&&n.getSuspendSelection&&n.getSuspendSelection();if(!a){this._oTable.rebind()}}};u.getSelectorKey=function e(){var t=this.selector;return t?t.getSelectedKey():null};u.getDomRef=function e(t){var r=this.selector;return r?r.getDomRef(t):null};u._getFilterModel=function e(){var t=this.getModel(R);if(!t){var r=o.getCustomData(this,R);t=new g(r);this.setModel(t,R)}return t};u._createContent=function e(){var t=this;var r=this._getFilterModel(),i=r.getObject("/paths"),n=i.length>3,o={id:O([this._oTable.getId(),"QuickFilter"]),enabled:this.getBindingInfo("enabled"),items:{path:"".concat(R,">/paths"),factory:function(e,r){var i={key:r.getObject().annotationPath,text:t._getSelectorItemText(r)};return n?new h(i):new s(i)}}};if(n){o.autoAdjustWidth=true}o[n?"change":"selectionChange"]=this._onSelectionChange.bind(this);this.selector=n?new c(o):new l(o)};u.getOverflowToolbarConfig=function e(){return{canOverflow:true}};u._createControlSideEffects=function e(){var t=this;var r=this.selector,i=r.getItems(),n=o.getCustomData(this._oTable,"navigationPath");if(n){(function(){var e=[];for(var r in i){var o=i[r].getKey(),l=a.getFiltersInfoForSV(t._oTable,o);l.properties.forEach(function(t){var r="".concat(n,"/").concat(t);if(!e.includes(r)){e.push(r)}})}t._getSideEffectController().addControlSideEffects(t.parentEntityType,{SourceProperties:e,TargetEntities:[{$NavigationPropertyPath:n}],sourceControlId:t.getId()})})()}};u._getSelectorItemText=function e(t){var r=t.getObject().annotationPath,i=t.getPath(),n=this.getModel().getMetaModel(),o=n.getObject("".concat(this.entitySet,"/").concat(r));return o.Text+(this.showCounts?" ({".concat(R,">").concat(i,"/count})"):"")};u._getSideEffectController=function e(){var t=this._getViewController();return t?t._sideEffects:undefined};u._getViewController=function e(){var r=t.getTargetView(this);return r&&r.getController()};u._updateCounts=function t(){var r=this._oTable,i=this._getViewController(),l=this.selector,s=l.getItems(),c=this._getFilterModel(),u=[],f=[];var h=[];var g=[];var p=o.getCustomData(r,k);if(i&&i.getChartControl){var d=i.getChartControl();if(d){var b=n.getAllFilterInfo(d);if(b&&b.filters.length){g=b.filters}}}h=h.concat(a.getHiddenFilters(r)).concat(g);for(var v in s){var y=s[v].getKey(),C=a.getFiltersInfoForSV(r,y);f.push(C.text);c.setProperty("/paths/".concat(v,"/count"),"...");u.push(a.getListBindingForCount(r,r.getBindingContext(),{batchGroupId:y===p?this.batchGroupId:"$auto",additionalFilters:h.concat(C.filters)}))}Promise.all(u).then(function(e){for(var t in e){c.setProperty("/paths/".concat(t,"/count"),a.getCountFormatted(e[t]))}}).catch(function(t){e.error("Error while retrieving the binding promises",t)})};u._onSelectionChange=function e(t){var r=t.getSource();o.setCustomData(this._oTable,k,r.getSelectedKey());this._oTable.rebind();var i=this._getViewController();if(i&&i.getExtensionAPI&&i.getExtensionAPI().updateAppState){i.getExtensionAPI().updateAppState()}};u.destroy=function e(t){if(this._attachedToView){var i=this._getSideEffectController();if(i){i.removeControlSideEffects(this)}}delete this._oTable;r.prototype.destroy.call(this,t)};return i}(u),S=K(w.prototype,"enabled",[d],{configurable:true,enumerable:true,writable:true,initializer:null}),T=K(w.prototype,"showCounts",[b],{configurable:true,enumerable:true,writable:true,initializer:null}),E=K(w.prototype,"entitySet",[v],{configurable:true,enumerable:true,writable:true,initializer:null}),I=K(w.prototype,"parentEntityType",[y],{configurable:true,enumerable:true,writable:true,initializer:null}),P=K(w.prototype,"batchGroupId",[C],{configurable:true,enumerable:true,writable:true,initializer:null}),F=K(w.prototype,"selector",[m],{configurable:true,enumerable:true,writable:true,initializer:null}),w))||_);return U},false);
//# sourceMappingURL=QuickFilterContainer.js.map