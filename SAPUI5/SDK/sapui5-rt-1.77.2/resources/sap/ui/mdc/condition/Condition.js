/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/base/Log'],function(L){"use strict";var C=function(){};C.createItemCondition=function(k,d,i,o){var v=[k,d];if(d===null||d===undefined){v.pop();}return this.createCondition("EEQ",v,i,o);};C.createCondition=function(o,v,i,O){var c={operator:o,values:v,isEmpty:null};if(i){c.inParameters=i;}if(O){c.outParameters=O;}return c;};C._removeEmptyConditions=function(c){for(var i=c.length-1;i>-1;i--){if(c[i].isEmpty){c.splice(parseInt(i),1);}}return c;};return C;},true);
