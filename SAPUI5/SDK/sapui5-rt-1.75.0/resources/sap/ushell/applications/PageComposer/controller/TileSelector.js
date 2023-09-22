// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Button","sap/m/library","sap/m/List","sap/m/ResponsivePopover","sap/m/StandardListItem","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/ui/model/Sorter","sap/ushell/utils/clone","sap/ushell/services/Container"],function(B,m,L,R,S,F,c,J,d,C){"use strict";var e=m.ButtonType;var P=m.PlacementType;var f=m.ListMode;var g=m.ListSeparators;return function(){var p,t,T,A,o,s,h,i,j,r={};this.init=function(a){p=a.getView();t=p.byId("tileSelectorList");T=p.byId("tileSelectorToolbar");A=p.byId("tileSelectorAddButton");r.i18n=a.getResourceBundle();t.setBusy(true);s=new L({mode:f.MultiSelect,showSeparators:g.None,includeItemInSelection:true,selectionChange:function(){h.getBeginButton().setEnabled(!!s.getSelectedItem());},items:{path:"/page/sections",template:new S({title:"{title}"})},noDataText:r.i18n.getText("Message.NoSections")}).setModel(p.getModel());A.setEnabled(false);t.attachSelectionChange(this._onSelectionChange);};this.initTiles=function(y){if(typeof y==="undefined"){throw new Error("sap.ushell.applications.PageComposer.controller.TileSelector#initTiles: undefined argument");}var z=C(y);z.forEach(function(D){D.visualizations=D.visualizations.results.sort(function(a,b){if(a.title>b.title){return 1;}if(a.title<b.title){return-1;}return 0;});D.visualizations.forEach(function(a){delete a.__metadata;});delete D.roles;delete D.__metadata;});this._setCatalogTree(z);}.bind(this);this.setRoleContext=function(a,b){var M=p.getModel("roles");var y=b?r.i18n.getText("Message.AllRolesSelected"):a.length.toString();M.setProperty("/activeRoleContext",a);M.setProperty("/activeRoleContextInfo",y);M.setProperty("/showRoleContextInfo",!b);};this.onSearchTiles=function(){k();};this.onAddTiles=function(E){var a=s.getItems(),b=E.getSource().getBindingContext();if(b){var y=b.getPath();o=t.getItems().filter(function(z){return(z.getBindingContextPath()===y);})[0];}else{o=undefined;}if(a.length===1){a[0].setSelected(true);x();}else{u(E);}};this.onSortCatalogsToggle=function(){l();};this.onCollapseAllCatalogs=function(){n(true);};this.onExpandAllCatalogs=function(){n(false);};this.onCatalogItemPress=function(E){_(E.getParameters().listItem);};this._onSelectionChange=function(E){if(h&&h.isOpen()){h.getBeginButton().setEnabled(false);h.close();}if(E){E.getParameters().listItems.forEach(function(a){if(!a.getBindingContext().getProperty("vizId")){a.setSelected(false);_(a);}});}A.setEnabled(!!q().length);};this.setAddTileHandler=function(a){i=a;};this.onDragStart=function(E){var I=E.getParameter("target").getBindingContext().getProperty();if(!I.vizId){E.preventDefault();return;}E.getParameter("dragSession").setComplexData("callback",function callback(a,b){i(I,[b],a);});};this._setCatalogTree=function(a){A.setEnabled(false);var M=new J({catalogs:a});M.setSizeLimit(Infinity);t.setModel(M);j=true;l();t.expandToLevel(1);t.setBusy(false);};function k(){var a=p.getModel().getProperty("/searchText")||"";t.getBinding("items").filter([new F([new F("title",c.Contains,a),new F("subTitle",c.Contains,a)],false)]);}function l(){j=!j;var I=t.getBinding("items"),a=new d("title",j);I.sort(a);}function n(b){if(b){t.collapseAll();}else{t.expandToLevel(1);}}function _(a){var b=t.indexOfItem(a);if(a.getExpanded()){t.collapse(b);}else{t.expand(b);}}function q(){return t.getSelectedContextPaths().map(function(a){return t.getModel().getContext(a).getProperty();});}function u(E){if(!h||h.bIsDestroyed){w();}s.removeSelections(true);h.getBeginButton().setEnabled(false);h.getEndButton().setEnabled(true);if(!o&&v(A)){h.openBy(T.getAggregation("_overflowButton"));}else{h.openBy(E.getSource());}}function v(a){return(a.hasStyleClass("sapMOTAPButtonNoIcon")||a.hasStyleClass("sapMOTAPButtonWithIcon"));}function w(){h=new R({placement:P.Auto,title:r.i18n.getText("Tooltip.AddToSections"),beginButton:new B({type:e.Emphasized,text:r.i18n.getText("Button.Add"),press:function(){this.setEnabled(false);h.close();x();}}),endButton:new B({text:r.i18n.getText("Button.Cancel"),press:function(){this.setEnabled(false);h.close();}}),content:s,initialFocus:s}).addStyleClass("sapContrastPlus");p.addDependent(h);}var x=function(){if(typeof i!=="function"){return;}var a=s.getSelectedItems().map(function(y){return s.indexOfItem(y);});var b;if(o){b=[o.getBindingContext().getProperty()];}else{b=q();}b.forEach(function(y){i(y,a);});if(!o){t.removeSelections(true);this._onSelectionChange();}else if(o.getSelected()){o.setSelected(false);this._onSelectionChange();}}.bind(this);};});