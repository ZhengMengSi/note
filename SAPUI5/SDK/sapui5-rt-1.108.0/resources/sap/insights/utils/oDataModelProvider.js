/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/model/odata/v2/ODataModel"],function(e){var t={};function a(t){var a=t.filterService;var r=a&&a.uri;var i=a&&a.settings;var n=[];if(i){i.annotations.forEach(function(e){var a=t[e];var r=a.uri;n.push(r)});if(i.odataVersion==="2.0"){return new e(r,{annotationURI:n,loadAnnotationsJoined:true})}}}function r(e){var r=e.filterService.uri;var i=a(e);t[r]={oData:i,loaded:undefined};return new Promise(function(e){if(i){i.attachMetadataLoaded(function(a){return a.getSource().getMetaModel().loaded().then(function(){t[r].loaded=true;e(t[r])})});i.attachMetadataFailed(function(){t[r].loaded=false;e(t[r])})}else{e(t[r])}})}function i(e){if(e.filterService&&e.filterService.uri){var a=e.filterService.uri;if(t[a]){return Promise.resolve(t[a])}else{return r(e)}}else{Promise.resolve(undefined)}}return{getOdataModel:i}});
//# sourceMappingURL=oDataModelProvider.js.map