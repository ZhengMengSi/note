/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./DialogActions","sap/fe/test/Utils","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/builder/MdcFilterBarBuilder","sap/fe/test/builder/MdcTableBuilder","sap/fe/test/builder/MdcFieldBuilder","./FilterBarAPI","./TableAPI"],function(e,t,i,a,r,n,s,o,l){"use strict";var p=function(t,i){return e.call(this,t,i,0)};p.prototype=Object.create(e.prototype);p.prototype.constructor=p;p.prototype.isAction=true;p.prototype.iGoToSearchAndSelect=function(){return this.prepareResult(a.create(this.getOpaInstance()).isDialogElement().hasType("sap.m.IconTabFilter").has(a.Matchers.id(/-VHP--fromList$/)).doPress().description(t.formatMessage("Going to 'Search and Select' on value help dialog '{0}'",this.getIdentifier())).execute())};p.prototype.iGoToDefineConditions=function(){return this.prepareResult(a.create(this.getOpaInstance()).isDialogElement().hasType("sap.m.IconTabFilter").has(a.Matchers.id(/-VHP--defineCondition$/)).doPress().description(t.formatMessage("Going to 'Define Conditions' on value help dialog '{0}'",this.getIdentifier())).execute())};p.prototype.iExecuteShowHideFilters=function(){return this.prepareResult(a.create(this.getOpaInstance()).isDialogElement().hasType("sap.m.Button").has(a.Matchers.id(/::FilterBar-btnShowFilters$/)).doPress().description(t.formatMessage("Pressing 'Show/Hide Filters' on value help dialog '{0}'",this.getIdentifier())).execute())};p.prototype.iChangeSearchField=function(e){var t=r.create(this.getOpaInstance()).isDialogElement().hasType("sap.ui.mdc.filterbar.vh.FilterBar");return this.prepareResult(t.doChangeSearch(e).description("Entering search text "+e).execute())};p.prototype.iExecuteSearch=function(){var e=r.create(this.getOpaInstance()).isDialogElement().hasType("sap.ui.mdc.filterbar.vh.FilterBar");return this.prepareResult(e.doSearch().description("Starting value help search field search").execute())};p.prototype.iResetSearchField=function(){var e=r.create(this.getOpaInstance()).isDialogElement().hasType("sap.ui.mdc.filterbar.vh.FilterBar");return this.prepareResult(e.doResetSearch().description("Resetting value help search field").execute())};p.prototype.iChangeFilterField=function(e,i,a){var n=t.parseArguments([[String,Object],String,Boolean],arguments),s=r.create(this.getOpaInstance()).isDialogElement().hasType("sap.ui.mdc.filterbar.vh.FilterBar"),l=o.createFilterFieldBuilder(s,n[0]);return this.prepareResult(l.doChangeValue(n[1],n[2]).description(t.formatMessage("Changing the filter field '{1}' of value help dialog '{0}' by adding '{2}' (was cleared first: {3})",this.getIdentifier(),n[0],n[1],!!n[2])).execute())};p.prototype.iSelectRows=function(e,i){var a=t.parseArguments([[Object,Number],Object],arguments),r=n.createWrapper(this.getOpaInstance(),"sap.ui.table.Table").isDialogElement();return this.prepareResult(r.doClickOnRow(l.createRowMatchers(a[0],a[1])).description(t.formatMessage("Selecting rows of table in value help dialog '{0}' with values='{1}' and state='{2}'",this.getIdentifier(),a[0],a[1])).execute())};p.prototype.iAddCondition=function(e,t){return this.iChangeCondition(e||"EQ",t,-1)};p.prototype.iChangeCondition=function(e,i,r){r=r||0;var n=i===undefined;i=n||Array.isArray(i)?i:[i];var s={operator:e,values:i,isEmpty:n,validated:"NotValidated"};return this.prepareResult(a.create(this.getOpaInstance()).isDialogElement().hasType("sap.ui.mdc.field.DefineConditionPanel").do(function(e){var t=[].concat(e.getConditions());if(r===-1){t.push(s)}else{t[r]=s}e.setConditions(t)}).description(t.formatMessage("Changing {1} on value help dialog '{0}' to '{2}'",this.getIdentifier(),r===-1?"newly added condition":"condition at index "+r,s)).execute())};p.prototype.iRemoveCondition=function(e){e=e||0;return this.prepareResult(a.create(this.getOpaInstance()).isDialogElement().hasType("sap.ui.mdc.field.DefineConditionPanel").do(function(t){var i=[].concat(t.getConditions());i.splice(e,1);t.setConditions(i)}).description(t.formatMessage("Removing condition at index {1} on value help dialog '{0}'",this.getIdentifier(),e)).execute())};return p});
//# sourceMappingURL=DialogValueHelpActions.js.map