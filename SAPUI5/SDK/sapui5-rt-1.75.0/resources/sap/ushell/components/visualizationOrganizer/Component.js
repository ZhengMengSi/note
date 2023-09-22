// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/library","sap/ui/core/UIComponent","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/ushell/resources"],function(m,U,F,c,J,r){"use strict";var B=m.ButtonType;return U.extend("sap.ushell.components.visualizationOrganizer.Component",{metadata:{version:"1.75.0",library:"sap.ushell.components.visualizationOrganizer",dependencies:{libs:["sap.m"]}},init:function(){U.prototype.init.apply(this,arguments);this.mVizIdInSpaces=new Map();this.mVizIdInPages=new Map();this.mPageInSpaces=new Map();this.mSpacePages=new Map();this.stPageIds=new Set();this.requestData().then(function(){if(this.oModel){this.oModel.updateBindings(true);}}.bind(this));},requestData:function(){var M;var C;return Promise.all([sap.ushell.Container.getServiceAsync("Menu"),sap.ushell.Container.getServiceAsync("CommonDataModel")]).then(function(R){M=R[0];C=R[1];return M.getSpacesPagesHierarchy();}).then(function(s){return C.getPages(this._collectPageIds(s.spaces));}.bind(this)).then(function(a){this._fillVizIdMaps(a);}.bind(this));},setModel:function(a){this.oModel=a;},_collectPageIds:function(s){s.forEach(function(S){S.pages.forEach(function(p){if(this.mPageInSpaces.has(p.id)){this.mPageInSpaces.get(p.id).add(S.id);}else{this.mPageInSpaces.set(p.id,new Set([S.id]));}if(this.mSpacePages.has(S.id)){this.mSpacePages.get(S.id).add(p.id);}else{this.mSpacePages.set(S.id,new Set([p.id]));}this.stPageIds.add(p.id);}.bind(this));}.bind(this));return Array.from(this.stPageIds);},_fillVizIdMaps:function(p){p.forEach(function(P){Object.keys(P.payload.sections).forEach(function(i){Object.keys(P.payload.sections[i].payload.viz).forEach(function(I){var v=P.payload.sections[i].payload.viz[I].vizId;if(this.mVizIdInPages.has(v)){this.mVizIdInPages.get(v).add(P.identification.id);}else{this.mVizIdInPages.set(v,new Set([P.identification.id]));}var s=this.mPageInSpaces.get(P.identification.id);if(!s){throw new Error("\"_collectPageIds\" must be called before calling \"_fillVizIdMaps\"");}if(this.mVizIdInSpaces.has(v)){s.forEach(function(S){this.mVizIdInSpaces.get(v).add(S);}.bind(this));}else{this.mVizIdInSpaces.set(v,new Set(s));}}.bind(this));}.bind(this));}.bind(this));},isVizIdPresent:function(v){var s=this.mVizIdInPages.get(v);return!!(s&&s.size);},formatPinButtonIcon:function(v){return(this.isVizIdPresent(decodeURIComponent(v))?"sap-icon://accept":"sap-icon://add");},formatPinButtonType:function(v){return(this.isVizIdPresent(decodeURIComponent(v))?B.Emphasized:B.Default);},onTilePinButtonClick:function(e){var s=e.getSource();var t=s.getBindingContext().getProperty();var v=decodeURIComponent(t.id);return this.toggle(s,t,{spaceIds:this.mVizIdInSpaces.get(v),pageIds:this.mVizIdInPages.get(v)});},open:function(o,v,a){var p=sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");if(!p){p=sap.ui.xmlfragment("sap.ushell.components.visualizationOrganizer.VisualizationOrganizerPopover",this);p.setModel(new J({spaces:[],searchTerm:""}));p.setModel(r.i18nModel,"i18n");}this.oOpenBy=o;this.sVisualizationId=decodeURIComponent(v.id);this.sVisualizationTitle=v.title;this.fnAddVisualizations=this._organizeVisualizations.bind(this);this.fnResetPopup=this._resetPopup.bind(this);p.attachBeforeClose(this.fnAddVisualizations);p.attachAfterClose(this.fnResetPopup);return sap.ushell.Container.getServiceAsync("Menu").then(function(M){return M.getSpacesPagesHierarchy();}).then(function(h){var P=p.getModel();P.setData(h);P.setProperty("/pinnedSpaces",a.spaceIds);P.setProperty("/pinnedPages",a.pageIds);p.openBy(o);});},close:function(){var p=sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");if(p){p.close();}},toggle:function(o,v,a){var p=sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");if(p&&p.isOpen()&&p._oOpenBy&&p._oOpenBy.getId()===o.getId()){this.close();return Promise.resolve();}return this.open(o,v,a);},_organizeVisualizations:function(e){var p=e.getSource(),s=p.getContent()[2],P=p.getModel(),a=P.getProperty("/pinnedSpaces")||new Set(),A=[],d=[];s.getBinding("items").filter(null);s.getItems().forEach(function(i){var I=i.getBindingContext().getProperty("id");if(i.getSelected()&&!a.has(I)){A.push(i);}else if(!i.getSelected()&&a.has(I)){d.push(i);}});return this._applyOrganizationChange({addToItems:A,deleteFromItems:d});},_applyOrganizationChange:function(v){var C=(v.addToItems.length+v.deleteFromItems.length);if(!C){return Promise.resolve();}var V=this.sVisualizationId;var s=new Set();var p;var o=sap.ushell.Container.getServiceAsync("Pages").then(function(P){p=P;});function d(e){var f;var S=e.sort(function(a,b){return b.sectionIndex-a.sectionIndex;});S.forEach(function(g){var h=g.vizIndexes.sort(function(a,b){return b-a;});h.forEach(function(a){if(!f){f=p.deleteVisualization(p.getPageIndex(g.pageId),g.sectionIndex,a);}else{f=f.then(function(){return p.deleteVisualization(p.getPageIndex(g.pageId),g.sectionIndex,a);});}});});return f||Promise.resolve();}v.deleteFromItems.forEach(function(R){var S=R.getBindingContext().getProperty();var P=S.pages[0].id;if(!s.has(P)){s.add(P);o=o.then(function(){return p.findVisualization(V,P).then(d);});}this.mVizIdInPages.get(V).delete(P);this.mPageInSpaces.get(P).forEach(function(a){var b=Array.from(this.mSpacePages.get(a)).filter(function(e){return this.mVizIdInPages.get(V).has(e);}.bind(this));if(!b.length){this.mVizIdInSpaces.get(V).delete(a);}}.bind(this));}.bind(this));v.addToItems.forEach(function(a){var S=a.getBindingContext().getProperty();var P=S.pages[0].id;o=o.then(function(){return p.addVisualization(V,P);});if(this.mVizIdInPages.has(V)){this.mVizIdInPages.get(V).add(P);}else{this.mVizIdInPages.set(V,new Set([P]));}this.mPageInSpaces.get(P).forEach(function(b){if(this.mVizIdInSpaces.has(V)){this.mVizIdInSpaces.get(V).add(b);}else{this.mVizIdInSpaces.set(V,new Set([b]));}}.bind(this));}.bind(this));o.then(function(){if(this.oOpenBy){this.oOpenBy.getBinding("icon").refresh(true);this.oOpenBy.getBinding("type").refresh(true);}sap.ui.require(["sap/m/MessageToast"],function(M){M.show(r.i18n.getText("VisualizationOrganizer.MessageToast",[C]));});}.bind(this));return o;},_resetPopup:function(e){var p=e.getSource(),s=p.getContent()[1],S=p.getContent()[2];p.detachBeforeClose(this.fnAddVisualizations);p.detachAfterClose(this.fnResetPopup);s.setValue("");S.removeSelections();delete this.fnAddVisualizations;delete this.fnResetPopup;delete this.sVisualizationId;delete this.sVisualizationTitle;},_spacePressed:function(e){var s=e.getSource(),S=s.getParent(),i=S.getSelectedItems().find(function(o){return o.getId()===s.getId();});S.setSelectedItemById(s.getId(),!i);},_onSearch:function(e){var p=sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover"),s=p.getContent()[2],b=s.getBinding("items"),S=e.getSource().getValue();b.filter(new F({path:"title",operator:c.Contains,value1:S}));if(b.getLength()===0){s.setNoDataText(r.i18n.getText(S?"VisualizationOrganizer.SpacesList.NoResultsText":"VisualizationOrganizer.SpacesList.NoDataText"));}},exit:function(){var p=sap.ui.getCore().byId("sapUshellVisualizationOrganizerPopover");if(p){p.destroy();}}});});