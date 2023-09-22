/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/mdc/library','sap/ui/mdc/field/FieldHelpBase','sap/ui/mdc/condition/Condition','sap/ui/mdc/condition/FilterOperatorUtil','sap/ui/base/ManagedObjectObserver','sap/base/util/ObjectPath','sap/base/util/deepEqual','sap/base/util/merge','sap/ui/model/resource/ResourceModel'],function(l,F,C,a,M,O,d,m,R){"use strict";var b=l.OutParameterMode;var D;var B;var V;var c;var e;var f;var g=F.extend("sap.ui.mdc.field.FieldValueHelp",{metadata:{library:"sap.ui.mdc",properties:{filterFields:{type:"string",defaultValue:""},keyPath:{type:"string",defaultValue:""},descriptionPath:{type:"string",defaultValue:""},showConditionPanel:{type:"boolean",defaultValue:false},title:{type:"string",group:"Appearance",defaultValue:""},noDialog:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{content:{type:"sap.ui.mdc.field.FieldValueHelpContentWrapperBase",multiple:false},filterBar:{type:"sap.ui.mdc.FilterBar",multiple:false},inParameters:{type:"sap.ui.mdc.field.InParameter",group:"Data",multiple:true},outParameters:{type:"sap.ui.mdc.field.OutParameter",group:"Data",multiple:true},_dialog:{type:"sap.m.Dialog",multiple:false,visibility:"hidden"}},defaultAggregation:"content",events:{dataRequested:{}}},_sDefaultDelegate:"sap/ui/mdc/odata/v4/FieldValueHelpDelegate"});g._init=function(){F._init.apply(this,arguments);D=undefined;B=undefined;V=undefined;c=undefined;e=undefined;f=undefined;};g.prototype.init=function(){F.prototype.init.apply(this,arguments);this._oObserver=new M(h.bind(this));this._oObserver.observe(this,{properties:["filterValue","conditions","showConditionPanel","title","filterFields"],aggregations:["content","filterBar","inParameters"]});};g.prototype.exit=function(){F.prototype.exit.apply(this,arguments);if(this._oManagedObjectModel){this._oManagedObjectModel.destroy();delete this._oManagedObjectModel;}if(this._oFilterConditionModel){this._oFilterConditionModel.destroy();delete this._oFilterConditionModel;}this._oObserver.disconnect();this._oObserver=undefined;};g.prototype.invalidate=function(i){if(i){var j=this.getContent();var i1=this.getAggregation("_dialog");if(j&&i===j){var j1=this.getAggregation("_popover");if(i1&&i1.isOpen()){i1.invalidate(i);}else if(j1&&j1.isOpen()){j1.invalidate(i);}return;}var k1=this.getFilterBar();if((i1&&i===i1)||(k1&&i===k1)){if(i.bOutput&&!this._bIsBeingDestroyed){var l1=this.getParent();if(l1){l1.invalidate(this);}}return;}}F.prototype.invalidate.apply(this,arguments);};g.prototype.connect=function(i){F.prototype.connect.apply(this,arguments);g1.call(this);b1.call(this,this.getShowConditionPanel());return this;};g.prototype.getIcon=function(){if(this.getNoDialog()){return"sap-icon://slim-arrow-down";}else{return"sap-icon://value-help";}};g.prototype._createPopover=function(){var i=F.prototype._createPopover.apply(this,arguments);if(i){var j=this.getContent();if(j){j.initialize(true);}i._getAllContent=function(){var i1=this.getParent();var j1=[];if(i1){var k1=f1.call(i1);if(k1){j1.push(k1);}}return j1;};if(this._bNavigate){this.navigate(this._iStep);}}return i;};g.prototype._handleAfterOpen=function(i){F.prototype._handleAfterOpen.apply(this,arguments);var j=this.getContent();if(j){j.fieldHelpOpen(true);}};g.prototype.open=function(i){if(this.getNoDialog()&&!i){i=true;}this._bUseFilterBar=!i;g1.call(this);var j=this.getContent();var i1=function(){if(this._bOpenAfterPromise){delete this._bOpenAfterPromise;this.open(i);}}.bind(this);var j1=this._bOpen?this._callContentRequest(!!i,i1):this._fireOpen(!!i,i1);delete this._bOpen;if(!j1){if(i){this._getPopover();}else{X.call(this);}if(j&&j.getFilterEnabled()&&!this._oFilterConditionModel){N.call(this);}this._bOpenAfterPromise=true;return;}this._bOpenHandled=true;j=this.getContent();if(j&&j.getFilterEnabled()&&!this._bNavigateRunning){if(!j.isSuspended()||i){this._bApplyFilter=true;}if(!this._oFilterConditionModel){N.call(this);}else{e1.call(this);}}if(this._bUpdateFilterAfterClose){this._bUpdateFilterAfterClose=false;t.call(this,this.getFilterValue());}if(i){if(!j){this._bOpenIfContent=true;}else{j.fieldHelpOpen(i);if(this._oFilterConditionModel&&!this.getFilterValue()&&!this._bNavigateRunning){this._oFilterConditionModel.checkUpdate(true,true);}F.prototype.open.apply(this,[i]);}}else{d1.call(this);var k1=this.getAggregation("_popover");if(k1){if(k1.isOpen()){this.close();}k1.$().remove();}var l1=X.call(this);if(l1){var m1=l1.getContent()[0];m1.setShowTokenizer(this.getMaxConditions()!==1&&!!j);m1.setFormatOptions(this._getFormatOptions());m1.bindProperty("conditions",{path:"$help>/conditions"});var n1=this.getFilterFields();if(n1){m1.bindProperty("filterConditions",{path:"filter>/conditions/"+n1});}if(j){j.fieldHelpOpen(false);s.call(this);}this._aOldConditions=this.getConditions();l1.open();this._bDialogOpen=true;}else{this._bOpen=true;}}this._bOpenHandled=false;return;};g.prototype.toggleOpen=function(i){if(this.getNoDialog()&&!i){i=true;}if(i){F.prototype.toggleOpen.apply(this,[i]);}else if(this._bOpen||this._bOpenIfContent||this._bOpenAfterPromise){delete this._bOpen;delete this._bSuggestion;delete this._bOpenIfContent;delete this._bOpenAfterPromise;}else{var j=X.call(this);if(j){if(j.isOpen()){var i1=j.oPopup.getOpenState();if(i1!=="CLOSED"&&i1!=="CLOSING"){this.close();}else{this._bReopen=true;}}else{this.open(i);}}else{this.open(i);}}};g.prototype.close=function(){if(!this._bDialogOpen){F.prototype.close.apply(this,arguments);}else{this._bUseFilterBar=false;var i=this.getAggregation("_dialog");if(i){this._bClosing=true;i.close();var j=i.getContent()[0];j.unbindProperty("conditions",true);j.unbindProperty("filterConditions",true);}this._bReopen=false;delete this._bOpen;delete this._bOpenAfterPromise;}};g.prototype.isOpen=function(i){var j=F.prototype.isOpen.apply(this,arguments);if(!j&&(!i||!this._bClosing)){var i1=this.getAggregation("_dialog");if(i1){j=i1.isOpen();}}return j;};function _(){if(!this._oFilterConditionModel){return;}var i=this._oFilterConditionModel.getAllConditions();var j=false;for(var i1 in i){if(i[i1].length>0){j=true;break;}}if(j){this._oFilterConditionModel.removeAllConditions();}}g.prototype._handleAfterClose=function(i){var j=this.getContent();if(j){if(!j.getAsyncKeyText()){_.call(this);}j.fieldHelpClose();}this._bApplyFilter=false;F.prototype._handleAfterClose.apply(this,arguments);};function h(i){if(i.object==this){var j;if(i.name==="content"){W.call(this,i.mutation,i.child);}if(i.name==="filterBar"){c1.call(this,i.mutation,i.child);}if(i.name==="conditions"){r.call(this,i.current);}if(i.name==="filterValue"){if(this._bClosing){this._bUpdateFilterAfterClose=true;}else{t.call(this,i.current);}}if(i.name==="showConditionPanel"){b1.call(this,i.current);}if(i.name==="title"){j=this.getAggregation("_dialog");if(j){j.setTitle(i.current);}}if(i.name==="filterFields"){j=this.getAggregation("_dialog");if(j){var i1=j.getContent()[0];i1.setSearchEnabled(!!i.current);if(j.isOpen()){if(i.current){i1.bindProperty("filterConditions",{path:"filter>/conditions/"+i.current});}else{i1.unbindProperty("filterConditions",true);}}}}if(i.name==="inParameters"){u.call(this,i.child,i.mutation);}}else if(i.object.isA("sap.ui.mdc.field.InParameter")){if(i.name==="value"){x.call(this,i.object.getHelpPath(),i.current,i.old,i.object.getUseConditions());}if(i.name==="helpPath"){y.call(this,i.current,i.old,i.object.getValue(),i.object.getUseConditions());}}}g.prototype.openByTyping=function(){if(!this._bDetermineSearchSupportedCalled&&!this.isOpen()&&!this._bOpen&&!this._bOpenIfContent&&!this._bOpenAfterPromise){this._loadDelegate();if(this.DELEGATE){return k.call(this);}else if(this.oDelegatePromise){this._bDetermineSearchSupportedCalled=true;return this.oDelegatePromise.then(function(){return k.call(this);}.bind(this));}}return!!this.getFilterFields();};function k(){this.fireOpen({suggestion:true});this._bDetermineSearchSupportedCalled=true;var i=this.DELEGATE.determineSearchSupported(this.getDelegate().payload,this);if(i instanceof Promise){return i.then(function(){return!!this.getFilterFields();}.bind(this));}else{return!!this.getFilterFields();}}g.prototype.isFocusInHelp=function(){if(!this.getNoDialog()){var i=this.getAggregation("_dialog");if((i&&i.isOpen())||(this._bDialogRequested&&this._bOpen)){return true;}}if(this._bFocusPopover){return true;}return false;};g.prototype.navigate=function(i){var j=this.getContent();var i1=this.getAggregation("_popover");g1.call(this);if(!i1||!i1.isOpen()){var j1=function(){this.navigate(i);}.bind(this);var k1=this._bNavigate?this._callContentRequest(true,j1):this._fireOpen(true,j1);if(!k1){j=this.getContent();this._bNavigate=false;this._iStep=null;if(j){this._getPopover();if(!this._oFilterConditionModel){N.call(this);}}return;}}this._bNavigate=false;this._iStep=null;j=this.getContent();if(j){i1=this._getPopover();this._bApplyFilter=true;this._bNavigateRunning=true;if(!this._oFilterConditionModel){N.call(this);}else{z.call(this);}this._oFilterConditionModel.checkUpdate(true,true);}if(!i1){this._bNavigate=true;this._iStep=i;return;}if(j){j.navigate(i);}};function n(i){var j=this._getPopover();var i1=i.getParameter("key");var j1=i.getParameter("description");var k1=i.getParameter("inParameters");var l1=i.getParameter("outParameters");var m1;if(i1===undefined){this._bFocusPopover=true;}if(!j.isOpen()){this._bOpenHandled=true;this.open(true);this._bOpenHandled=false;}this._bNavigateRunning=false;if(i1===undefined){this._bFocusPopover=false;return;}m1=C.createItemCondition(i1,j1);if(k1){m1.inParameters=A.call(this,k1);}if(l1){m1.outParameters=E.call(this,l1);}this.setProperty("conditions",[m1],true);this.fireNavigate({value:j1,key:i1,condition:m1});}g.prototype._getTextOrKey=function(i,j,i1,j1,k1){var l1="";var m1=this.getContent();if(m1){var n1=m1.getListBinding();if(!n1){this.fireDataRequested();}var o1=this.getBindingContext();var p1=false;if(!this.isOpen()&&i1&&o1!==i1&&((!j1&&this.getInParameters().length>0)||(j&&!k1&&this.getOutParameters().length>0))){p1=true;this._bNoInOutFilterUpdate=true;this.setBindingContext(i1);}if(j){l1=m1.getTextForKey(i,H.call(this,j1),I.call(this,k1,true));}else{l1=m1.getKeyForText(i,H.call(this));}if(l1 instanceof Promise){l1=l1.then(function(l1){return o.call(this,l1);}.bind(this));}else{l1=o.call(this,l1);}if(p1){var q1=this._getField();if(q1){this.setBindingContext(q1.getBindingContext());}this._bNoInOutFilterUpdate=false;}}return l1;};function o(i){if(i&&typeof i==="object"){i=m({},i);if(i.inParameters){i.inParameters=A.call(this,i.inParameters);}if(i.outParameters){i.outParameters=E.call(this,i.outParameters);}}return i;}g.prototype.isUsableForValidation=function(){var i=this.getContent();return!!i;};function p(i1){var j1=i1.getParameter("selectedItems");var k1=i1.getParameter("itemPress");var l1;var m1=this.getConditions();var n1;var i=0;var j=0;var o1=false;var p1=this.getMaxConditions();for(i=m1.length-1;i>=0;i--){n1=m1[i];n1.inParameters=H.call(this,n1.inParameters);n1.outParameters=I.call(this,n1.outParameters);if(n1.operator==="EEQ"){o1=false;for(j=0;j<j1.length;j++){l1=j1[j];if(n1.values[0]===l1.key&&(!n1.inParameters||!l1.inParameters||d(n1.inParameters,l1.inParameters))&&(!n1.outParameters||!l1.outParameters||d(n1.outParameters,l1.outParameters))){o1=true;if(n1.values[1]!==l1.description&&l1.description){if(n1.values.length===1){n1.values.push(l1.description);}else{n1.values[1]=l1.description;}}break;}}if(!o1){m1.splice(i,1);}}}for(i=0;i<j1.length;i++){l1=j1[i];o1=false;for(j=0;j<m1.length;j++){n1=m1[j];if(n1.operator==="EEQ"&&n1.values[0]===l1.key&&(!n1.inParameters||d(n1.inParameters,l1.inParameters))&&(!n1.outParameters||d(n1.outParameters,l1.outParameters))){o1=true;n1.inParameters=l1.inParameters;n1.outParameters=l1.outParameters;break;}}if(!o1){n1=C.createItemCondition(l1.key,l1.description,l1.inParameters,l1.outParameters);m1.push(n1);}}if(p1>0&&m1.length>p1){m1.splice(0,m1.length-p1);}for(i=0;i<m1.length;i++){n1=m1[i];if(n1.inParameters){n1.inParameters=A.call(this,n1.inParameters);}else{delete n1.inParameters;}if(n1.outParameters){n1.outParameters=E.call(this,n1.outParameters);}else{delete n1.outParameters;}}if(this._bDialogOpen){this.setProperty("conditions",m1,true);}else{var q1=false;var r1=false;if(this.getMaxConditions()===1||k1){this.close();r1=true;}if(this.getMaxConditions()===1){q1=true;}this.setProperty("conditions",m1,true);this.fireSelect({conditions:m1,add:q1,close:r1});}}function q(i){var j=i.getParameter("contentChange");var i1=this.getContent();var j1=i1.getAsyncKeyText();if(j){var k1=this.getAggregation("_popover");var l1=this.getAggregation("_dialog");if(i1){if(i1.getFilterEnabled()&&!this._oFilterConditionModel&&((k1&&this._bOpenIfContent)||l1)){N.call(this);}if(k1&&this._bOpenIfContent){var m1=this._getField();if(m1){i1.fieldHelpOpen(true);k1.openBy(this._getControlForSuggestion());K.call(this);}this._bOpenIfContent=false;}else if(l1){var n1=l1.getContent()[0];U.call(this,n1,i1.getDialogContent());}}}if(!j1){this.fireDataUpdate();}}function r(i){s.call(this);}function s(){if(!this._oField){return;}var j=this.getContent();if(j){var i1=this.getConditions();var j1=[];for(var i=0;i<i1.length;i++){var k1=i1[i];if(k1.operator==="EEQ"){j1.push({key:k1.values[0],description:k1.values[1],inParameters:H.call(this,k1.inParameters),outParameters:I.call(this,k1.outParameters)});}}if(!d(j1,j.getSelectedItems())){j.setSelectedItems(j1);}}}function t(i){if(!this._oFilterConditionModel){return;}var j=this.getFilterFields();if(!j){return;}if(i){this._bOwnFilterChange=true;}this._oFilterConditionModel.removeAllConditions(j);i=i.trim();if(i){this._bOwnFilterChange=false;var i1=C.createCondition("StartsWith",[i]);this._oFilterConditionModel.addCondition(j,i1);}}function u(i,j){var i1=i.getHelpPath();var j1=false;if(j==="remove"){this._oObserver.unobserve(i);if(this._getField()&&this.isOpen()){j1=w.call(this,i1);}}else{this._oObserver.observe(i,{properties:true});if(this._getField()&&this.isOpen()){var k1=i.getValue();var l1=i.getUseConditions();j1=w.call(this,i1);j1=v.call(this,i1,k1,l1)||j1;s.call(this);}}}function v(j,i1,j1){var k1;var l1;var m1;var n1=false;if(this._oFilterConditionModel&&j&&i1){k1=this.getFilterBar();if(this._bUseFilterBar&&k1){l1=k1.getConditions();if(!l1[j]){l1[j]=[];}}if(j1){if(Array.isArray(i1)){for(var i=0;i<i1.length;i++){m1=m({},i1[i]);if(m1.inParameters){m1.inParameters=H.call(this,m1.inParameters);}if(m1.outParameters){m1.outParameters=I.call(this,m1.outParameters);}this._oFilterConditionModel.addCondition(j,m1);if(this._bUseFilterBar&&k1){l1[j].push(i1[i]);}n1=true;}}}else{m1=C.createItemCondition(i1);this._oFilterConditionModel.addCondition(j,m1);if(this._bUseFilterBar&&k1){l1[j].push(m1);}n1=true;}}if(n1&&this._bUseFilterBar&&k1){k1.setConditions(l1);}return n1;}function w(i){var j=false;if(this._oFilterConditionModel&&i&&this._oFilterConditionModel.getConditions(i).length>0){this._oFilterConditionModel.removeAllConditions(i);j=true;}var i1=this.getFilterBar();if(this._bUseFilterBar&&i1){var j1=i1.getConditions();if(j1[i]&&j1[i].length>0){j1[i]=[];i1.setConditions(j1);j=true;}}return j;}function x(i,j,i1,j1){if(this._bNoInOutFilterUpdate){return;}if(!this.sUpdateTimer){this.sUpdateTimer=setTimeout(function(){this.sUpdateTimer=undefined;this.fireDataUpdate();}.bind(this),0);}if(!this._getField()||!this.isOpen()){return;}var k1=false;k1=w.call(this,i);k1=v.call(this,i,j,j1)||k1;}function y(i,j,i1,j1){if(!this._getField()||!this.isOpen()){return;}var k1=false;k1=w.call(this,j);k1=v.call(this,i,i1,j1)||k1;}function z(){var j=this.getInParameters();var i1=false;for(var i=0;i<j.length;i++){var j1=j[i];var k1=j1.getHelpPath();var l1=j1.getValue();var m1=j1.getUseConditions();i1=w.call(this,k1)||i1;i1=v.call(this,k1,l1,m1)||i1;}if(this._oFilterConditionModel&&!i1&&this._bApplyFilter&&this._bPendingFilterUpdate){this._bPendingFilterUpdate=false;this._oFilterConditionModel.checkUpdate(true,true);}}g.prototype.onFieldChange=function(){var i1=this.getOutParameters();var j1=this.getConditions();g1.call(this);for(var i=0;i<j1.length;i++){var k1=j1[i];if(k1.outParameters){for(var l1 in k1.outParameters){for(var j=0;j<i1.length;j++){var m1=i1[j];var n1=m1.getValue();var o1=m1.getUseConditions();var p1=true;if(m1.getMode()===b.WhenEmpty){if(o1){p1=!n1||(Array.isArray(n1)&&n1.length===0);}else{p1=!n1;}}if(p1){if(o1){var q1;if(!m1.getHelpPath()){q1=C.createCondition("EEQ",[m1.getFixedValue()]);}else if(m1.getFieldPath()===l1){q1=C.createCondition("EEQ",[k1.outParameters[l1]]);}else{continue;}if(!n1){n1=[];}if(!Array.isArray(n1)){throw new Error("Value on OutParameter must be an array "+m1);}if(a.indexOfCondition(q1,n1)<0){n1.push(q1);m1.setValue(n1);}}else{if(!m1.getHelpPath()){m1.setValue(m1.getFixedValue());}else if(m1.getFieldPath()===l1){m1.setValue(k1.outParameters[l1]);}}}}}}}};function A(i){return G.call(this,i,this.getInParameters());}function E(i){return G.call(this,i,this.getOutParameters());}function G(j,i1){if(!j||i1.length===0){return null;}var j1={};for(var i=0;i<i1.length;i++){var k1=i1[i];var l1=k1.getHelpPath();var m1=k1.getFieldPath();if(l1&&m1){for(var n1 in j){if(l1===n1){j1[m1]=j[n1];break;}}}else if(!l1&&m1&&k1.getFixedValue){j1[m1]=k1.getFixedValue();}}return j1;}function H(i){return J.call(this,i,this.getInParameters());}function I(i,j){return J.call(this,i,this.getOutParameters(),j);}function J(j,i1,j1){var k1;var l1;var m1;var n1;var i=0;if(i1.length>0){if(!j){if(!j1){for(i=0;i<i1.length;i++){l1=i1[i];m1=l1.getHelpPath();var o1=l1.getValue();if(m1&&o1){if(!k1){k1={};}if(l1.getUseConditions()){if(o1.length>0){k1[m1]=o1[0]&&o1[0].values[0];}}else{k1[m1]=o1;}}}}}else{for(var p1 in j){for(i=0;i<i1.length;i++){l1=i1[i];m1=l1.getHelpPath();n1=l1.getFieldPath();if(n1&&n1===p1&&m1){if(!k1){k1={};}k1[m1]=j[p1];}}}}}return k1;}function K(){if(!this._oFilterConditionModel||(!this.isOpen()&&!this._bNavigateRunning&&!this._bOpen)||!this._bApplyFilter){this._bPendingFilterUpdate=true;return;}var i=this.getContent();if(i){var j=this._oFilterConditionModel.getFilters();var i1=[];var j1=this._oFilterConditionModel.getConditions("$search");var k1;if(j){i1.push(j);}if(j1.length>0){k1=j1[0].values[0];}i.applyFilters(i1,k1);}}function L(i){if(this._bOwnFilterChange){return;}K.call(this);}function N(){if(!e&&!this._bFilterConditionModelRequested){e=sap.ui.require("sap/ui/mdc/condition/ConditionModel");if(!e){sap.ui.require(["sap/ui/mdc/condition/ConditionModel"],P.bind(this));this._bFilterConditionModelRequested=true;}}if(e){var i=this.getFilterValue();this._oFilterConditionModel=new e();if(i){t.call(this,i);}z.call(this);var j=this._oFilterConditionModel.bindProperty("/conditions",this._oFilterConditionModel.getContext("/conditions"));j.attachChange(L.bind(this));this.setModel(this._oFilterConditionModel,"filter");}}function P(i){e=i;this._bFilterConditionModelRequested=false;if(!this._bIsBeingDestroyed){N.call(this);}}g.prototype.getMaxConditions=function(){if(this._oField&&this._oField.getMaxConditionsForHelp){return this._oField.getMaxConditionsForHelp();}else if(this._oField&&this._oField.getMaxConditions){return this._oField.getMaxConditions();}else{return 1;}};g.prototype.getDisplay=function(){if(this._oField&&this._oField.getDisplay){return this._oField.getDisplay();}};g.prototype.getRequired=function(){if(this._oField&&this._oField.getRequired){return this._oField.getRequired();}else{return false;}};g.prototype.getDataType=function(){if(this._oField.getDataType){return this._oField.getDataType();}else{return"sap.ui.model.type.String";}};g.prototype._getFormatOptions=function(){if(this._oField&&this._oField._getFormatOptions){return this._oField._getFormatOptions();}else{return{};}};g.prototype._getKeyPath=function(){var i=this.getKeyPath();if(!i&&this._oField&&this._oField.getFieldPath&&this._oField.getFieldPath()){i=this._oField.getFieldPath();}return i;};g.prototype.clone=function(i,j){var i1=this.getContent();var j1=this.getFilterBar();if(i1){i1.detachEvent("navigate",n,this);i1.detachEvent("selectionChange",p,this);i1.detachEvent("dataUpdate",q,this);}if(j1){j1.detachEvent("search",d1,this);}var k1=F.prototype.clone.apply(this,arguments);if(i1){i1.attachEvent("navigate",n,this);i1.attachEvent("selectionChange",p,this);i1.attachEvent("dataUpdate",q,this);}if(j1){j1.attachEvent("search",d1,this);}return k1;};function Q(){var i;if((!D||!B||!V||!c)&&!this._bDialogRequested){D=sap.ui.require("sap/m/Dialog");B=sap.ui.require("sap/m/Button");V=sap.ui.require("sap/ui/mdc/field/ValueHelpPanel");c=sap.ui.require("sap/ui/mdc/field/DefineConditionPanel");f=sap.ui.require("sap/ui/model/base/ManagedObjectModel");if(!D||!B||!V||!c||!f){sap.ui.require(["sap/m/Dialog","sap/m/Button","sap/ui/mdc/field/ValueHelpPanel","sap/ui/mdc/field/DefineConditionPanel","sap/ui/model/base/ManagedObjectModel"],S.bind(this));this._bDialogRequested=true;}}if(D&&B&&V&&c&&f&&!this._bDialogRequested){if(!this._oResourceBundle){this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");}var j=new B(this.getId()+"-ok",{text:this._oResourceBundle.getText("valuehelp.OK"),press:Y.bind(this)});var i1=new B(this.getId()+"-cancel",{text:this._oResourceBundle.getText("valuehelp.CANCEL"),press:Z.bind(this)});this._oManagedObjectModel=new f(this);var j1=T.call(this);i=new D(this.getId()+"-dialog",{contentHeight:"600px",contentWidth:"1000px",horizontalScrolling:false,verticalScrolling:false,title:this.getTitle(),resizable:true,draggable:true,content:[j1],afterOpen:$.bind(this),afterClose:a1.bind(this),buttons:[j,i1]});this.setAggregation("_dialog",i,true);i.setModel(new R({bundleName:"sap/ui/mdc/messagebundle",async:false}),"$i18n");b1.call(this,this.getShowConditionPanel());}return i;}function S(i,j,i1,j1,k1){D=i;B=j;V=i1;c=j1;f=k1;this._bDialogRequested=false;if(!this._bIsBeingDestroyed){Q.call(this);if(this._bOpen){this.open();}}}function T(){var i=this.getContent();var j=this.getFilterBar();var i1=new V(this.getId()+"-VHP",{height:"100%",showFilterbar:!!j,searchEnabled:!!this.getFilterFields(),formatOptions:this._getFormatOptions(),search:h1.bind(this)});i1.setModel(this._oManagedObjectModel,"$help");if(i){i.initialize(false);U.call(this,i1,i.getDialogContent());}if(j){i1.setFilterbar(j);}return i1;}function U(i,j){i.setTable(j);}function W(i,j){var i1=this.getAggregation("_popover");var j1=this.getAggregation("_dialog");if(i==="remove"){j.detachEvent("navigate",n,this);j.detachEvent("selectionChange",p,this);j.detachEvent("dataUpdate",q,this);j=undefined;}else{j.attachEvent("navigate",n,this);j.attachEvent("selectionChange",p,this);j.attachEvent("dataUpdate",q,this);s.call(this);}this.fireDataUpdate();if(this._bNavigate){this.navigate(this._iStep);}else if(i1){i1.invalidate();var k1=this.getFilterValue();if(k1){t.call(this,k1);}z.call(this);if(j&&j.getFilterEnabled()&&!this._oFilterConditionModel){N.call(this);}if(j&&this._bOpenIfContent){j.initialize(true);var l1=this._getField();if(l1){j.fieldHelpOpen(true);i1.openBy(this._getControlForSuggestion());}this._bOpenIfContent=false;}}else if(j&&this._bOpenIfContent){this._bOpenIfContent=false;this.open(true);}if(j1){if(j){j.initialize(false);if(j.getFilterEnabled()&&!this._oFilterConditionModel){N.call(this);}var m1=j1.getContent()[0];m1.setShowTokenizer(this.getMaxConditions()!==1);U.call(this,m1,j.getDialogContent());if(j1.isOpen()||this._bOpen){j.fieldHelpOpen(false);}}}}function X(){var i=this.getAggregation("_dialog");if(!i){i=Q.call(this);}return i;}function Y(i){this.close();var j=this.getConditions();j=C._removeEmptyConditions(j);a.updateConditionsValues(j,this._getFormatOptions().operators);this._bNoConditionModelUpdate=true;this.setProperty("conditions",j,true);this._bOK=true;}function Z(i){this.close();this.setProperty("conditions",this._aOldConditions,true);}function $(i){}function a1(i){this._bDialogOpen=false;this._aOldConditions=undefined;this._bUseFilterBar=false;this._bApplyFilter=false;this._handleAfterClose(i);if(this._bOK){var j=this.getConditions();this.fireSelect({conditions:j,add:false,close:true});}this._bOK=undefined;}function b1(i){var j=this.getAggregation("_dialog");if(j&&this._oField){var i1=j.getContent()[0];var j1=this._getFormatOptions().operators;if(i&&!a.onlyEEQ(j1)){if(!i1._oDefineConditionPanel){var k1=new c(this.getId()+"-DCP");i1.setDefineConditions(k1);}}else{i1.setDefineConditions();}}}function c1(i,j){if(i==="remove"){j.detachEvent("search",d1,this);j=undefined;}else{j.attachEvent("search",d1,this);}var i1=this.getAggregation("_dialog");if(i1){var j1=i1.getContent()[0];j1.setFilterbar(j);j1.setShowFilterbar(!!j);z.call(this);d1.call(this);}}function d1(j){if(!this._oFilterConditionModel||!this._bUseFilterBar){return;}var i1=this.getFilterBar();if(i1){var j1=this._oFilterConditionModel.getAllConditions();var k1=i1.getConditions();var l1=this.getFilterFields();var i=0;var m1;var n1;for(m1 in j1){if(m1!==l1){for(i=0;i<j1[m1].length;i++){n1=m({},j1[m1][i]);if(!k1[m1]||a.indexOfCondition(n1,k1[m1])<0){this._oFilterConditionModel.removeCondition(m1,n1);}}}}for(m1 in k1){for(i=0;i<k1[m1].length;i++){n1=m({},k1[m1][i]);if(!j1[m1]||a.indexOfCondition(n1,j1[m1])<0){this._oFilterConditionModel.addCondition(m1,n1);}}}if(!this._bApplyFilter&&(j||i1.getLiveMode())){this._bApplyFilter=true;this._oFilterConditionModel.checkUpdate(true,true);}}}function e1(){if(!this._oFilterConditionModel){return;}var i=this.getFilterBar();if(i){var j=this._oFilterConditionModel.getAllConditions();var i1=i.getConditions();var j1=this.getFilterFields();var k1=false;var l1;for(l1 in i1){if(l1!==j1){if(j[l1]&&j[l1].length>0){this._oFilterConditionModel.removeAllConditions(l1);}if(i1[l1].length>0){i1[l1]=[];k1=true;}}}j=this._oFilterConditionModel.getAllConditions();for(l1 in j){if(l1!==j1){if(j[l1].length>0){this._oFilterConditionModel.removeAllConditions(l1);}}}if(k1){i.setConditions(i1);}}z.call(this);}function f1(){var i=this.getContent();if(i){return i.getSuggestionContent();}}function g1(){var i=this._getField();var j=i&&i.getBindingContext();if(this.getBindingContext()!==j){this.setBindingContext(j);}}function h1(i){this._bApplyFilter=true;this._oFilterConditionModel.checkUpdate(true,true);}g.prototype.getScrollDelegate=function(){var i=this.getAggregation("_dialog");if(i&&(i.isOpen()||i.oPopup.getOpenState()==="Opening")){var j=this.getContent();var i1=j&&j.getDialogContent();if(i1&&i1.getScrollDelegate){return i1.getScrollDelegate();}else{return undefined;}}else{return F.prototype.getScrollDelegate.apply(this,arguments);}};g.prototype._fireOpen=function(i){if(!this._bOpenHandled){return F.prototype._fireOpen.apply(this,arguments);}return true;};return g;});