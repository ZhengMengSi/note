/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./FEBuilder","sap/ui/test/OpaBuilder","sap/fe/test/Utils"],function(t,e,r){"use strict";var a=function(){return t.apply(this,arguments)};a.create=function(t){return new a(t)};a.prototype=Object.create(t.prototype);a.prototype.constructor=a;a.prototype.checkKPITag=function(e,r){var a={text:e};if(r&&r.status){a.status=r.status}var i=this.hasType("sap.m.GenericTag").hasProperties(a);if(r&&(r.number||r.unit)){var s={};if(r.number){s.number=r.number}if(r.unit){s.unit=r.unit}i=i.hasChildren(t.create(this).hasType("sap.m.ObjectNumber").hasProperties(s))}return i};a.prototype.clickKPITag=function(t){var e={text:t};return this.hasType("sap.m.GenericTag").hasProperties(e).doPress()};a.prototype.checkKPICard=function(){return this.hasType("sap.m.Popover").hasChildren(t.create(this).hasType("sap.ui.integration.widgets.Card"))};a.prototype.doClickKPICardHeader=function(){return this.hasType("sap.ui.integration.cards.NumericHeader").doPress()};a.prototype.doOnKPICardHeader=function(e,r){return this.hasType("sap.ui.integration.widgets.Card").hasChildren(t.create(this).hasType("sap.ui.integration.cards.NumericHeader").hasChildren(e,r))};a.prototype.doOnKPICardChart=function(e){var r=e?t.create(this).hasType("sap.ui.integration.cards.AnalyticalContent").hasChildren(e):t.create(this).hasType("sap.ui.integration.cards.AnalyticalContent");return this.hasType("sap.ui.integration.widgets.Card").hasChildren(r)};return a});
//# sourceMappingURL=KPIBuilder.js.map