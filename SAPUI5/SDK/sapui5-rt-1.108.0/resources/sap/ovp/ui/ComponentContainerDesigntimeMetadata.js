/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ovp/cards/CommonUtils","sap/ovp/cards/SettingsUtils","sap/ui/dt/plugin/ElementMover","sap/ui/dt/OverlayRegistry","sap/ui/dt/OverlayUtil","sap/ui/rta/plugin/Plugin","sap/ui/rta/util/BindingsExtractor","sap/ui/dt/MetadataPropagationUtil","sap/ui/rta/Utils","sap/ovp/app/resources","sap/ovp/app/OVPUtils","sap/ovp/cards/ovpLogger","sap/ui/model/json/JSONModel"],function(jQuery,e,t,a,n,r,o,i,d,s,l,u,g,c){"use strict";var p=e.getApp();var v=false;var f=new g("OVP.ui.ComponentContainerDesigntimeMetadata");var y=function(){var e="https://"+window.location.host+"/sap/opu/odata/SSB/SMART_BUSINESS_DESIGNTIME_SRV/KPIs";jQuery.ajax({type:"GET",url:e,dataType:"json",async:false,headers:"",success:function(e,t,a){var n={d:{results:[]}};n.d.results=e.d.results.filter(function(e){return!!e.ModelURI});v=n.d.results.length>0;if(v){var r=new c;r.setData(n);p.getView().setModel(r,"JSONModelForSSB")}},error:function(e){f.error(e)}})};y();var C=new a,h=function(e){e.setTargetZone(false)},m=function(e){e.setTargetZone(true)},E=function(e){var t=e.getAggregationOverlays();var a=t.filter(function(e){return e.isTargetZone()});if(a.length>0){return a[0]}else{return null}},_=function(e){var t=C.getMovedOverlay();if(!t){return false}var a=false;if(!(e.getElement()===t.getElement())){var n=E(e);if(n){a=true}else if(r.isInTargetZoneAggregation(e)){a=true}}if(a){t.setSelected(true);setTimeout(function(){t.focus()},0)}return a},O=function(e,t){var a=e.getAggregationOverlays();a.forEach(function(e){t(e)})},S=function(e,t){var a=n.getOverlay(e),o=a&&a.getParentElementOverlay(),i=o&&r.findAllSiblingOverlaysInContainer(a,o);i&&i.forEach(function(e){O(e,t)})};var I=a.prototype.checkTargetZone;a.prototype.checkTargetZone=function(e,t,a){var n=t?t:this.getMovedOverlay();var r=I.apply(this,arguments);if(!r){return Promise.resolve(false)}var l=n.getElement();var u=e.getParent();var g=n.getRelevantContainer();var c=u.getElement();var p=e.getDesignTimeMetadata();var v=d.getRelevantContainerForPropagation(p.getData(),l);v=v?v:c;if(!g||!v||!o.prototype.hasStableId(u)||g!==v){return Promise.resolve(false)}if(n.getParent().getElement()!==c){var f=i.getBindings(l,l.getModel());if(Object.keys(f).length>0&&l.getBindingContext()&&c.getBindingContext()){var y=s.getEntityTypeByPath(l.getModel(),l.getBindingContext().getPath());var C=s.getEntityTypeByPath(c.getModel(),c.getBindingContext().getPath());if(!(y===C)){return Promise.resolve(false)}}}return Promise.resolve(true)};a.prototype.deactivateAllTargetZones=function(e){S(e,h)};a.prototype.activateAllValidTargetZones=function(e){S(e,m)};var T={name:{singular:l.getText("Card"),plural:l.getText("Cards")},actions:{remove:{name:l.getText("OVP_KEYUSER_MENU_HIDE_CARD"),changeType:"hideCardContainer",changeOnRelevantContainer:true},reveal:{changeType:"unhideCardContainer",changeOnRelevantContainer:true,getLabel:function(e){var t=this._getCardId(e.getId()),a=this._getCardFromManifest(t);if(a){var n=a.settings;if(n.title){return n.title}else if(n.category){return n.category}else if(n.subTitle){return n.subTitle}return a.cardId}else{f.error("Card id "+t+" is not present in the manifest");return""}}.bind(p)}}};var L=e._getLayer();T.actions["settings"]=function(a){if(!a.getComponentInstance()){return{}}var o=a.getComponentInstance().getComponentData(),i=o.mainComponent,d=i._getCardFromManifest(o.cardId);if(!d||!e.checkIfCardTypeSupported(d.template)){return{}}var s={EditCard:{icon:"sap-icon://edit",name:l.getText("OVP_KEYUSER_MENU_EDIT_CARD"),isEnabled:function(e){return true},changeOnRelevantContainer:true,handler:t.fnEditCardHandler},CloneCard:{icon:"sap-icon://value-help",name:l.getText("OVP_KEYUSER_MENU_CLONE_CARD"),isEnabled:function(e){return true},handler:t.fnCloneCardHandler}};if(!L||L===u.Layers.customer){s["Cut"]={icon:"sap-icon://scissors",name:l.getText("OVP_KEYUSER_MENU_CUT_CARD"),isEnabled:function(e){return true},changeOnRelevantContainer:true,handler:function(e,t){var a=n.getOverlay(e),r=C.getMovedOverlay();if(r){r.removeStyleClass("sapUiDtOverlayCutted");C.setMovedOverlay(null);C.deactivateAllTargetZones(e)}C.setMovedOverlay(a);a.addStyleClass("sapUiDtOverlayCutted");C.activateAllValidTargetZones(e);return Promise.resolve([]).then(function(){return[]})}};s["Paste"]={icon:"sap-icon://paste",name:l.getText("OVP_KEYUSER_MENU_PASTE_CARD"),isEnabled:function(e){var t=n.getOverlay(e),a=E(t);return!!(a||r.isInTargetZoneAggregation(t))},changeOnRelevantContainer:true,handler:function(t,a){var o=n.getOverlay(t),i=C.getMovedOverlay();if(i){var d=i.getElement(),s=o.getElement(),l=r.getParentInformation(i),u=r.getParentInformation(o),g=t.getComponentInstance().getComponentData().mainComponent,c=g.getLayout(),p=g.getUIModel(),v={},f={},y=[];if(p.getProperty("/containerLayout")==="resizable"){var h=c.getDashboardLayoutModel(),m=g._getCardId(d.getId()),E=g._getCardId(t.getId()),O=h.getCardById(m),S=h.getCardById(E),I=h.getColCount(),T="C"+I,L=[];v.cardId=m;v.dashboardLayout={};v.dashboardLayout[T]={row:S.dashboardLayout.row,oldRow:O.dashboardLayout.row,column:S.dashboardLayout.column,oldColumn:O.dashboardLayout.column};if(S.dashboardLayout.column+O.dashboardLayout.colSpan>I+1){v.dashboardLayout[T].colSpan=S.dashboardLayout.colSpan;v.dashboardLayout[T].oldColSpan=O.dashboardLayout.colSpan;v.dashboardLayout[T].rowSpan=O.dashboardLayout.rowSpan;v.dashboardLayout[T].oldRowSpan=O.dashboardLayout.rowSpan}y.push({selectorControl:e.getApp().getLayout(),changeSpecificData:{changeType:"dragOrResize",content:v}});y.push({selectorControl:e.getApp().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"dragAndDropUI",content:v}});h._arrangeCards(O,{row:S.dashboardLayout.row,column:S.dashboardLayout.column},"drag",L);h._removeSpaceBeforeCard(L);L.forEach(function(t){var a={};a.dashboardLayout={};a.cardId=t.content.cardId;a.dashboardLayout[T]=t.content.dashboardLayout;y.push({selectorControl:e.getApp().getLayout(),changeSpecificData:{changeType:"dragOrResize",content:a}})})}else{var b=u.parent.getContent().filter(function(e){return e.getVisible()});v={cardId:g._getCardId(d.getId()),position:b.indexOf(s),oldPosition:b.indexOf(d)};y.push({selectorControl:e.getApp().getLayout(),changeSpecificData:{changeType:"position",content:v}});f={cardId:g._getCardId(d.getId()),position:u.index,oldPosition:l.index};y.push({selectorControl:e.getApp().getLayout(),changeSpecificData:{runtimeOnly:true,changeType:"dragAndDropUI",content:f}})}}_(o);if(i){i.removeStyleClass("sapUiDtOverlayCutted");C.setMovedOverlay(null);C.deactivateAllTargetZones(t);return Promise.resolve(y).then(function(e){return e})}}};s["AddStaticLinkListCard"]={icon:"sap-icon://form",name:l.getText("OVP_KEYUSER_MENU_CREATE_LINK_LIST_CARD"),isEnabled:function(e){return true},handler:t.fnAddStaticLinkListCardHandler};if(v){s["AddKPICard"]={icon:"sap-icon://kpi-corporate-performance",name:l.getText("OVP_KEYUSER_MENU_ADD_KPI_CARD"),isEnabled:function(e){return true},handler:t.fnAddKPICardHandler}}}else if(L&&(L===u.Layers.vendor||L===u.Layers.customer_base)){s["AddCard"]={icon:"sap-icon://add-activity",name:l.getText("OVP_KEYUSER_MENU_AddCard"),isEnabled:function(e){return true},handler:t.fnAddNewCardHandler}}s["RemoveCard"]={icon:"sap-icon://delete",name:l.getText("OVP_KEYUSER_MENU_REMOVE_CARD"),isEnabled:function(t){var a=t.getComponentInstance().getComponentData().settings;return t.getId().indexOf(e._getLayerNamespace()+".")!==-1&&!a.cloneCard&&!a.newCard},handler:t.fnRemoveCardHandler};return s};return T},true);
//# sourceMappingURL=ComponentContainerDesigntimeMetadata.js.map