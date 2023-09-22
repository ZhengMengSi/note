/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/base/Object","../../utils/Utils"],function(i,e){"use strict";return i.extend("sap.feedback.ui.flpplugin.push.config.FeaturePushConfig",{_sAreaId:null,_sTriggerName:null,_iValidFrom:null,_iValidTo:null,_bIsEnabled:null,_sTriggerType:null,_oTriggerConfig:null,_bIsGeneric:false,init:function(i,e,r,t,n,s){this._sAreaId=i;this._sTriggerName=e;if(!Number.isInteger(r)){throw Error("Valid-from not a number for "+i+"/"+e)}if(!Number.isInteger(t)){throw Error("Valid-to not a number for "+i+"/"+e)}if(r>=t){throw Error("Valid-from date cannot be bigger than Valid-to date.")}this._iValidFrom=r;this._iValidTo=t;this._bIsEnabled=n;if(s){this._bIsGeneric=s}},initFromJSON:function(i){var e=i.areaId;var r=i.triggerName;var t=new Date(i.validFrom).getTime();var n=new Date(i.validTo).getTime();var s=i.isEnabled;var a=i.isGeneric;this.init(e,r,t,n,s,a)},setTriggerConfig:function(i,e){this._sTriggerType=i;this._oTriggerConfig=e},getCombinedKey:function(){return e.getCombinedKey(this._sAreaId,this._sTriggerName)},getAreaId:function(){return this._sAreaId},getTriggerName:function(){return this._sTriggerName},getValidFrom:function(){return this._iValidFrom},getValidTo:function(){return this._iValidTo},getIsEnabled:function(){return this._bIsEnabled},getTriggerType:function(){return this._sTriggerType},getTriggerConfig:function(){return this._oTriggerConfig},getIsGeneric:function(){return this._bIsGeneric},isQualifiedForPush:function(i,e){return this._oTriggerConfig.isQualifiedForPush(i,e)},isActive:function(){if(this._bIsEnabled&&!this.isExpired()){return true}return false},isExpired:function(){var i=Date.now();if(this._isValidNow(i)||this._isValidInFuture(i)){return false}return true},_isValidNow:function(i){if(!Number.isInteger(i)){return false}if(this._iValidFrom<i&&this._iValidTo>i){return true}return false},_isValidInFuture:function(i){if(!Number.isInteger(i)){return false}if(this._iValidFrom>i&&this._iValidTo>i&&this._iValidTo>this._iValidFrom){return true}return false}})});
//# sourceMappingURL=FeaturePushConfig.js.map