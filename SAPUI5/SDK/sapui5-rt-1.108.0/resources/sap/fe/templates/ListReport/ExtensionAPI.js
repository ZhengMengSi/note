/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/ExtensionAPI","sap/fe/core/helpers/ClassSupport","sap/fe/core/helpers/LRMessageStrip","sap/fe/macros/chart/ChartUtils","sap/fe/macros/filter/FilterUtils"],function(t,e,r,o,i){"use strict";var n,s;var l=r.LRMessageStrip;var a=e.defineUI5Class;function c(t,e){t.prototype=Object.create(e.prototype);t.prototype.constructor=t;u(t,e)}function u(t,e){u=Object.setPrototypeOf?Object.setPrototypeOf.bind():function t(e,r){e.__proto__=r;return e};return u(t,e)}var p=(n=a("sap.fe.templates.ListReport.ExtensionAPI"),n(s=function(t){c(e,t);function e(){return t.apply(this,arguments)||this}var r=e.prototype;r.refresh=function t(){var e=this._controller._getFilterBarControl();if(e){return e.waitForInitialization().then(function(){e.triggerSearch()})}else{return Promise.resolve()}};r.getSelectedContexts=function t(){var e,r;var i=this._controller._isMultiMode()&&((e=this._controller._getMultiModeControl())===null||e===void 0?void 0:(r=e.getSelectedInnerControl())===null||r===void 0?void 0:r.content)||this._controller._getTable();if(i.isA("sap.ui.mdc.Chart")){var n=[];if(i&&i.get_chart()){var s=o.getChartSelectedData(i.get_chart());for(var l=0;l<s.length;l++){n.push(s[l].context)}}return n}else{return i&&i.getSelectedContexts()||[]}};r.setFilterValues=function t(e,r,o){var n=this._controller._getAdaptationFilterBarControl()||this._controller._getFilterBarControl();if(arguments.length===2){o=r;return i.setFilterValues(n,e,o)}return i.setFilterValues(n,e,r,o)};r.createFiltersFromFilterConditions=function t(e){var r=this._controller._getFilterBarControl();return i.getFilterInfo(r,undefined,e)};r.getFilters=function t(){var e=this._controller._getFilterBarControl();return i.getFilters(e)};r.setCustomMessage=function t(e,r,o){if(!this.ListReportMessageStrip){this.ListReportMessageStrip=new l}this.ListReportMessageStrip.showCustomMessage(e,this._controller,r,o)};return e}(t))||s);return p},false);
//# sourceMappingURL=ExtensionAPI.js.map