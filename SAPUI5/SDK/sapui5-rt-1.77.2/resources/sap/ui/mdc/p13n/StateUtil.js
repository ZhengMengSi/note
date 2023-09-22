/*
* ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define(['./AdaptationController','./FlexUtil','sap/ui/fl/apply/api/FlexRuntimeInfoAPI'],function(A,F,a){"use strict";var o=new A();var S={applyExternalState:function(c,s){return new Promise(function(r,b){var v=this.checkXStateInterface(c);if(!v){b("The control needs to implement IxState");}S.retrieveExternalState(c).then(function(C){var d=C.hasOwnProperty("sort");var f=C.hasOwnProperty("filter");var e,g,h=[];if(d){e=o.createSortChanges(s.sort);}if(f){g=o.createConditionChanges(s.filter);}Promise.all([e,g]).then(function(R){R.forEach(function(i){if(i&&i.length>0){h=h.concat(i);}});r(F.handleChanges(h));});},b);}.bind(this));},retrieveExternalState:function(c){return new Promise(function(r,b){o.setAdaptationControl(c);o.setStateRetriever(c.getCurrentState);var v=this.checkXStateInterface(c);if(!v){b("The control needs to implement then interface IxState.");}c.waitForInitialization().then(function(){a.waitForChanges({element:c}).then(function(){r({filter:c.getCurrentState().filter});});});}.bind(this));},checkXStateInterface:function(c){if(!c){return false;}if(!a.isFlexSupported({element:c})){return false;}if(!c.isA("sap.ui.mdc.IxState")){return false;}return true;}};return S;});
