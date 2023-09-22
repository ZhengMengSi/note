/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/test/RecordReplay"],function(B,R){"use strict";var s=[];var S=100;var C=B.extend("sap.ui.testrecorder.controlSelectors.ControlSelectorGenerator",{});C.prototype.getSelector=function(d){var D=_(d);var c={domElementId:D.id};var m=this._findCached(c);if(m){return Promise.resolve(m);}return R.findControlSelectorByDOMElement({domElement:D,settings:d.settings}).then(function(a){this._cache(c,a);return a;}.bind(this));};C.prototype._findCached=function(d){var m;s.forEach(function(p){if(p.key===d.domElementId){m=p.value;}});return m;};C.prototype._cache=function(d,m){if(s.length===S){s.shift();}s.push({key:d.domElementId,value:m});};C.prototype.emptyCache=function(){s=[];};function _(d){if(d.domElement&&typeof d.domElement==="string"){return document.getElementById(d.domElement);}else if(d.controlId){return sap.ui.getCore().byId(d.controlId).getFocusDomRef();}}return new C();});
