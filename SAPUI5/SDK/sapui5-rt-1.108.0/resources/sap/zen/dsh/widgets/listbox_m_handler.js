/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/sac/df/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler","sap/m/List","sap/m/StandardListItem"],function(jQuery,_,BaseHandler,List,StandardListItem){"use strict";StandardListItem.extend("sap.zen.StandardListItemWithKey",{metadata:{properties:{key:"string"}},renderer:{}});List.extend("sap.zen.MListWithHeight",{metadata:{properties:{height:"sap.ui.core.CSSSize"}},renderer:{},onAfterRendering:function(e){if(List.prototype.onAfterRendering){List.prototype.onAfterRendering.apply(this,[e])}var t=this.getHeight();var r=this.$();if(t!=="auto"){r.height(t)}this.$().addClass("zenScrollableMListbox")}});var ListBoxHandler=function(){BaseHandler.apply(this,arguments);var dispatcher=BaseHandler.dispatcher;var that=this;this.create=function(oChainedControl,oControlProperties){var id=oControlProperties["id"];var oControl=new sap.m.ScrollContainer(id);var oListBox=new sap.m.List(id+"_LB");oListBox.addStyleClass("zenListBox-FontSize");oListBox.setIncludeItemInSelection(true);oControl.setVertical(true);oControl.setHorizontal(false);oControl.addContent(oListBox);init(oControl,oControlProperties);oListBox.attachSelect(function(oControlEvent){var keys="";var indices=oControlEvent.oSource.getSelectedItems();for(var j=0;j<indices.length;j++){var item=indices[j];keys+=item.getKey();keys+="|SeP|"}var command=that.prepareCommand(oControlProperties.command,"__KEYS__",keys);eval(command)});return oControl};this.update=function(e,t){if(t){init(e,t)}return e};function itemsAreChanged(e,t){var r=t.selectedItems;var n=[],i;if(r){for(i=0;i<r.length;i++){n.push(dispatcher.getValue(r[i],"key"))}}var a=e.getSelectedItems();if(a){if(a.length!==n.length){return true}var o=0;for(i=0;i<a.length;i++){if(jQuery.inArray(a[i].getKey(),n)!==-1){o++}}if(o!=n.length){return true}}var s=getUI5ModeForDSMode(t.selectionMode);if(e.getMode()!==s){return true}var l=t.items;var d=e.getItems();if(d.length!==l.length){return true}for(i=0;i<l.length;i++){var u=l[i];var c=u.item.key;var h=u.item.val_0;if(h.length===0){h=c}var g=d[i].getKey();var m=d[i].getTitle();if(c!==g||h!==m){return true}}return false}function getUI5ModeForDSMode(e){if(e==="SINGLE_LEFT"){return sap.m.ListMode.SingleSelectLeft}else if(e==="SINGLE_MASTER"){return sap.m.ListMode.SingleSelectMaster}else if(e==="MULTI"){return sap.m.ListMode.MultiSelect}return sap.m.ListMode.SingleSelect}function init(e,t){var r=e.getContent()[0];if(!itemsAreChanged(r,t)){return}r.removeAllItems();if(!r.previousItems){r.previousItems=[]}var n=getUI5ModeForDSMode(t.selectionMode);r.setMode(n);var i=t.selectedItems;var a,o;if(i){var s={};for(a=0;a<i.length;a++){o=dispatcher.getValue(i[a],"key");s[o]=true}}var l=t.items;for(a=0;a<l.length;a++){var d=l[a];o=d.item.key;var u=d.item.val_0;var c=new sap.zen.StandardListItemWithKey(a);c.setKey(o);if(u.length===0){u=o}c.setTitle(u);r.addItem(c);if(s&&s[o]){r.setSelectedItem(c)}}}this.getType=function(){return"listbox"};this.getDecorator=function(){return"DataSourceControlDecorator"}};var instance=new ListBoxHandler;BaseHandler.dispatcher.addHandlers(instance.getType(),instance);return instance});
//# sourceMappingURL=listbox_m_handler.js.map