/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/enum/ProcessingStrategy","sap/ui/mdc/condition/FilterOperatorUtil","./BaseController","sap/ui/mdc/p13n/P13nBuilder","sap/ui/mdc/p13n/FlexUtil","sap/base/Log","sap/base/util/merge","sap/base/util/UriParameters"],function(t,e,n,i,r,o,a,p){"use strict";var s=n.extend("sap.ui.mdc.p13n.subcontroller.FilterController",{constructor:function(){n.apply(this,arguments);this._bResetEnabled=true}});s.prototype.getStateKey=function(){return"filter"};s.prototype.getUISettings=function(){return{title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("filter.PERSONALIZATION_DIALOG_TITLE"),tabText:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("p13nDialog.TAB_Filter"),afterClose:function(t){var e=t.getSource();if(e){var n=e.getContent()[0];if(n.isA("sap.m.p13n.Container")){n.removeView("Filter")}else{e.removeAllContent()}}e.destroy()}}};s.prototype.getChangeOperations=function(){return{add:"addCondition",remove:"removeCondition"}};s.prototype.getBeforeApply=function(){var t=this.getAdaptationControl().getInbuiltFilter();var e=t?t.createConditionChanges():Promise.resolve([]);return e};s.prototype.getFilterControl=function(){return this.getAdaptationControl().isA("sap.ui.mdc.IFilter")?this.getAdaptationControl():this.getAdaptationControl()._oP13nFilter};s.prototype.sanityCheck=function(t){s.checkConditionOperatorSanity(t);return t};s.checkConditionOperatorSanity=function(t){for(var n in t){var i=t[n];for(var r=0;r<i.length;r++){var a=i[r];var p=a.operator;if(!e.getOperator(p)){i.splice(r,1);if(t[n].length==0){delete t[n]}o.warning("The provided conditions for field '"+n+"' contain unsupported operators - these conditions will be neglected.")}}}};s.prototype._getPresenceAttribute=function(t){return"active"};s.prototype.getAdaptationUI=function(t,e){var n=this._getP13nModel(t);return this.getAdaptationControl().retrieveInbuiltFilter().then(function(t){t.setP13nData(n.oData);t.setLiveMode(false);this._oAdaptationFB=t;return t.createFilterFields().then(function(){return t})}.bind(this))};s.prototype.update=function(t){n.prototype.update.apply(this,arguments);var e=this.getAdaptationControl();var i=e&&e.getInbuiltFilter();if(i){i.createFilterFields()}};s.prototype.getDelta=function(e){if(e.applyAbsolute===t.FullReplace){Object.keys(e.existingState).forEach(function(t){if(!e.changedState.hasOwnProperty(t)){e.changedState[t]=[]}})}return r.getConditionDeltaChanges(e)};s.prototype.model2State=function(){var t={},e=this.getCurrentState();this._oAdaptationModel.getProperty("/items").forEach(function(n){if(n.active&&Object.keys(e).includes(n.name)){t[n.name]=e[n.name]}});return t};s.prototype.mixInfoAndState=function(t){var e=this.getCurrentState()||{};var n=i.prepareAdaptationData(t,function(t,n){var i=e[t.name];t.active=i&&i.length>0?true:false;return!(n.filterable===false)});i.sortP13nData({visible:new p(window.location.search).getAll("sap-ui-xx-filterQueryPanel")[0]==="true"?"active":null,position:undefined},n.items);return n};s.prototype.changesToState=function(t,e,n){var i={};t.forEach(function(t){var e=a({},t.changeSpecificData.content);var n=e.name;if(!i[n]){i[n]=[]}if(t.changeSpecificData.changeType===this.getChangeOperations()["remove"]){e.condition.filtered=false}i[n].push(e.condition)}.bind(this));return i};return s});
//# sourceMappingURL=FilterController.js.map