/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/Fragment","sap/ui/fl/write/_internal/Storage","sap/ui/fl/Layer","sap/base/util/restricted/_isEqual"],function(e,t,n,o,i){"use strict";function r(e){var t={layer:o.CUSTOMER,type:"role"};return Object.assign({},t,e)}function s(e){var t={layer:o.CUSTOMER,flexObjects:e};return n.loadContextDescriptions(t).then(function(t){if(t.role&&t.role.length===e.role.length){this.oSelectedContextsModel.setProperty("/selected",t.role)}}.bind(this))}function l(){return t.load({id:this.getView().getId(),name:"sap.ui.fl.variants.context.view.fragment.AddContextDialog",controller:this}).then(function(e){this.getView().addDependent(e);e._oList.attachUpdateStarted(this._updateStartedHandler.bind(this));e._oList.attachSelectionChange(this._onSelectionChange.bind(this));return e}.bind(this))}function a(e,t){return n.getContexts(r(e)).then(function(e){if(t){e.values=t.concat(e.values)}this.oContextsModel.setData(e);this.oContextsModel.refresh(true)}.bind(this))}function c(e){return{id:e.getTitle(),description:e.getDescription()}}return e.extend("sap.ui.fl.variants.context.controller.ContextVisibility",{onInit:function(){this.oSelectedContextsModel=this.getView().getModel("selectedContexts");this.oContextsModel=this.getView().getModel("contexts");this.oI18n=this.getView().getModel("i18n").getResourceBundle()},onBeforeRendering:function(){this.oSelectedContextsModel.refresh(true);var e=this.getOwnerComponent().getSelectedContexts();var t=e.role.length>0;if(t){return s.call(this,e)}return Promise.resolve()},_onSelectionChange:function(e){var t=c(e.getParameter("listItem"));if(e.getParameter("selected")===true){this.oCurrentSelection.push(t)}else{this.oCurrentSelection=this.oCurrentSelection.filter(function(e){return!i(e,t)})}},isSelected:function(e,t){return t.some(function(t){return t.id===e.id})},formatTooltip:function(e){if(!this.oI18n){this.oI18n=this.getView().getModel("i18n").getResourceBundle()}return e.length===0?this.oI18n.getText("NO_DESCRIPTION"):e},_appendDataFromBackend:function(){var e=this.oContextsModel.getProperty("/values");if(this.oContextsModel.getProperty("/lastHitReached")===false){var t={$skip:e.length};return a.call(this,t,e)}return Promise.resolve(e)},_updateStartedHandler:function(e){if(e.getParameter&&e.getParameter("reason")==="Growing"){return this._appendDataFromBackend()}return Promise.resolve()},_addContexts:function(e){e.clearSelection();this.oCurrentSelection=this.oSelectedContextsModel.getProperty("/selected")||[];return a.call(this,{}).then(function(){return e.open()})},onAddContextsHandler:function(){if(!this._oDialog){this._oDialog=l.call(this)}return this._oDialog.then(function(e){return this._addContexts(e)}.bind(this))},onSearch:function(e){e.getSource().clearSelection();var t={$filter:e.getParameter("value")};return a.call(this,t)},onSelectContexts:function(){this.oSelectedContextsModel.setProperty("/selected",this.oCurrentSelection);this.oSelectedContextsModel.refresh(true);this.oCurrentSelection=[]},onDeleteContext:function(e){var t=this.oSelectedContextsModel.getProperty("/selected");var n=e.getParameter("listItem");var o=t.filter(function(e){return e.id!==n.getTitle()});this.oSelectedContextsModel.setProperty("/selected",o);var i=e.getSource();i.attachEventOnce("updateFinished",i.focus,i)},removeAll:function(){this.oSelectedContextsModel.setProperty("/selected",[])},isRemoveAllEnabled:function(e){return e.length!==0},isMessageStripVisible:function(e,t){return t&&e.length===0}})});
//# sourceMappingURL=ContextVisibility.controller.js.map