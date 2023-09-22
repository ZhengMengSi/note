/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/util/LoaderExtensions","sap/base/util/UriParameters","sap/base/util/merge","sap/base/strings/formatMessage","sap/base/strings/capitalize"],function(e,a,r,p,t){"use strict";var s={};s.getManifest=function(p){var t=sap.ushell&&sap.ushell.Container;if(!t){var n=s.getNoFLPAppPath();p="local"+n}var i=new a(window.location.href),o=i.get("manifest"),u=e.loadResource(p+"/manifest.json");if(o){o.split(",").forEach(function(a){if(a.indexOf("/")!==0){a=p+"/"+a}try{u=r({},u,e.loadResource(a))}catch(e){}})}var l=new URL(u["sap.app"].dataSources.mainService.uri,document.location);var f=i.get("user");if(f){l.searchParams.set("user",f)}u["sap.app"].dataSources.mainService.uri=l.toString();return u};s.getNoFLPAppPath=function(){var e=new a(window.location.href);var r=e.get("app")||"SalesOrder";return s.getAppInfo(r).appPath};s.getAppInfo=function(e){var a={"SalesOrder-manage":{appName:"SalesOrder",appPath:"/apps/salesorder/webapp"},"SalesOrder-manageInline":{appName:"SalesOrder",appPath:"/apps/salesorder/webapp"},"SalesOrder-manageFCL":{appName:"SalesOrderFCL",appPath:"/apps/salesorder-FCL/webapp"},"SalesOrder-aggregate":{appName:"SalesOrder",appPath:"/apps/salesorder-aggregate/webapp"},"SalesOrder-manageInlineTest":{appName:"SalesOrder",appPath:"/apps/salesorder/webapp"},"Customer-manage":{appName:"Customer",appPath:"/apps/customer/webapp"},"Customer-displayFactSheet":{appName:"Customer",appPath:"/apps/customer-displayFactSheet/webapp"},"SalesOrder-sticky":{appName:"SalesOrder",appPath:"/apps/salesorder/webapp"},"SalesOrder-stickyFCL":{appName:"SalesOrderFCL",appPath:"/apps/salesorder-FCL/webapp"},"Products-manage":{appName:"catalog-admin-ui",appPath:"/apps/office-supplies/admin/webapp"},"Products-custom":{appName:"catalog-admin-ui",appPath:"/apps/office-supplies/custompage/webapp"},"Chevron-Navigation":{appName:"SalesOrder",appPath:"/apps/salesorder/webapp"},"Manage-items":{appName:"ManageItems",appPath:"/apps/manage-items/webapp"},"Drafts-manage":{appName:"ManageDrafts",appPath:"/apps/manage-drafts/webapp"},"Drafts-manageFCL":{appName:"ManageDraftsFCL",appPath:"/apps/manage-drafts-FCL/webapp"},"Manage-itemsSem":{appName:"ManageItemsSem",appPath:"/apps/manage-drafts/webapp"},"CustomNavigation-sample":{appName:"customNavigation.sample",appPath:"/apps/customNav"},"SalesOrder-Create":{appName:"SalesOrderCreate",appPath:"/apps/salesorder-Create/webapp"},"SalesOrder-CreateFCL":{appName:"SalesOrderCreateFCL",appPath:"/apps/salesorder-CreateFCL/webapp"},SalesOrder:{appName:"SalesOrder",appPath:"/apps/salesorder/webapp"}};return a[e]};s.isOfType=function(e,a,r){var p=Array.isArray(a)?a:[a];return p.reduce(function(a,p){if(a){return true}if(p===null||p===undefined){return e===p}if(e===null||e===undefined){return!!r}if(typeof p==="function"){if(p===Boolean){return typeof e==="boolean"}if(p===Array){return Array.isArray(e)}if(p===String){return typeof e==="string"||e instanceof String}if(p===Object){return typeof e==="object"&&e.constructor===Object}if(p===Number){return typeof e==="number"}return e instanceof p}return typeof e===p},false)};s.isArguments=function(e){return Object.prototype.toString.call(e)==="[object Arguments]"};s.parseArguments=function(e){var a=Array.prototype.slice.call(arguments,1);if(a.length===1&&s.isArguments(a[0])){a=Array.prototype.slice.call(a[0],0)}return e.reduce(function(e,r){if(s.isOfType(a[0],r,true)){e.push(a.shift())}else{e.push(undefined)}return e},[])};s.formatObject=function(e){if(s.isOfType(e,[null,undefined])){return""}if(s.isOfType(e,Array)){return"["+e.map(function(e){return s.formatObject(e)}).join(", ")+"]"}if(s.isOfType(e,Object)){return"{"+Object.keys(e).map(function(a){return a+": "+s.formatObject(e[a])}).join(", ")+"}"}return e.toString()};s.formatMessage=function(e){var a=Array.prototype.slice.call(arguments,1).map(function(e){return s.formatObject(e)});return p(e&&e.replace(/'/g,"''"),a)};s.mergeObjects=function(){return r.apply(this,[{}].concat(Array.prototype.slice.call(arguments)))};s.getAggregation=function(e,a){if(!e){return null}var r=e["get"+t(a,0)];if(!r){throw new Error("Object '"+e+"' does not have an aggregation called '"+a+"'")}return r.call(e)};s.pushToArray=function(e,a,r){if(a===undefined){a=[]}else if(!Array.isArray(a)){a=[a]}else{a=a.slice(0)}if(Array.isArray(e)){a=r?e.slice(0).concat(a):a.concat(e)}else if(e!==undefined){if(r){a.unshift(e)}else{a.push(e)}}return a};return s});
//# sourceMappingURL=Utils.js.map