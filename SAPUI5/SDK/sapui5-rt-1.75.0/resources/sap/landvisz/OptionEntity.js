/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/landvisz/OptionSource","sap/ui/commons/RadioButton","sap/ui/commons/TextView","./OptionEntityRenderer"],function(l,O,R,T,a){"use strict";var b=O.extend("sap.landvisz.OptionEntity",{metadata:{library:"sap.landvisz",properties:{label:{type:"string",group:"Data",defaultValue:null},selected:{type:"boolean",group:"Accessibility",defaultValue:false},enable:{type:"boolean",group:"Identification",defaultValue:true},optionTextTooltip:{type:"string",group:"Data",defaultValue:null}},aggregations:{optionSources:{type:"sap.landvisz.OptionSource",multiple:true,singularName:"optionSource"}},events:{selectOption:{}}}});b.prototype.init=function(){this.optionText="1";this.optionSrcEntityId;this.optionRepEntityId;this.optionOn;this.isSelected;this.initializationDone=false;this.left=0;this.top=0;};b.prototype.initControls=function(){var o=this.getId();if(!this.optionTextView)this.optionTextView=new T(o+"-optionText");var t=this;if(!this.optionBtn){this.optionBtn=new R(o+"-optionBtn",{groupName:o+"-optionBtn"});this.optionBtn.attachSelect(function(e){t.fireEvent("optionSelected");t.fireSelectOption();});}};b.prototype.onclick=function(e){if(e.srcControl instanceof R)return;if(this.getEnable()==true){this.fireEvent("optionSelected");this.fireSelectOption();}};b.prototype.onAfterRendering=function(){if(this.getSelected()==true){this.optionBtn.setSelected(true);}};});