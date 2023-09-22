/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";var s={};s.replaceEmptyNavigationPaths=function(p){return((p&&p.map(function(P){if(P["$NavigationPropertyPath"]===""){return{"$PropertyPath":"*"};}return P;}))||[]);};s.logRequest=function(r){var p=Array.isArray(r.pathExpressions)&&r.pathExpressions.reduce(function(P,o){return P+"\n\t\t"+(o["$PropertyPath"]||o["$NavigationPropertyPath"]||"");},"");L.info("SideEffects request:\n\tContext path : "+r.context.getPath()+"\n\tProperty paths :"+p);};return s;});
