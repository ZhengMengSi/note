/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./FormAPI","sap/fe/test/Utils","sap/ui/test/OpaBuilder","sap/fe/test/builder/FEBuilder","sap/fe/test/builder/MacroFieldBuilder"],function(e,t,r,i,s){"use strict";var n=function(t,r){return e.call(this,t,r)};n.prototype=Object.create(e.prototype);n.prototype.constructor=n;n.prototype.isAction=false;function o(e,r,s){var n=e.getBuilder(),o,a=r?"--seeMore":"--seeLess";n.has(function(e){o=e.getId().substring(e.getId().lastIndexOf("::")+2);return true}).execute();return e.prepareResult(i.create(e).hasId(new RegExp(t.formatMessage("{0}$",a))).has(function(e){return e.getId().substring(e.getId().lastIndexOf("::")+2)===o+a}).hasState(s).description(t.formatMessage("Checking '{0}' action with state='{1}'",a,s)).execute())}n.prototype.iCheckState=function(e){var r=this.getBuilder();return this.prepareResult(r.hasState(e).description(t.formatMessage("Checking Form '{0}'{1}",this.getIdentifier(),e?t.formatMessage(" in state '{0}'",e):"")).execute())};n.prototype.iCheckAction=function(e,r){var s=t.parseArguments([[Object,String],Object],arguments),n=this.getBuilder();return this.prepareResult(n.hasAggregation("actions",[this.createActionMatcher(e),i.Matchers.states(r)]).description(t.formatMessage("Checking custom action '{0}' with state='{1}'",s[0],s[1])).execute())};n.prototype.iCheckShowMore=function(e){return o(this,true,e)};n.prototype.iCheckShowLess=function(e){return o(this,false,e)};n.prototype.iCheckField=function(e,r,i){var s=t.parseArguments([[Object,String],[String,Array,Object],Object],arguments);return this.prepareResult(this.createFieldBuilder(e).hasValue(s[1]).hasState(s[2]).description(t.formatMessage("Checking field '{1}' on form '{0}' with value '{2}' and state='{3}'",this.getIdentifier(),s[0],s[1],s[2])).execute())};n.prototype.iCheckLink=function(e,r,i){var s=t.parseArguments([[Object,String],String,Object],arguments);return this.iCheckField(s[0],s[1],t.mergeObjects({controlType:"sap.m.Link"},s[2]))};n.prototype.iCheckFormContainersElementCount=function(e,r,i){var s=t.parseArguments([String,Number,Object],arguments),n=this.getIdentifier().fullSubSectionId,o=s[2],a=n.split("--")[0],c=n.split("--")[1].split("::")[2],u=a+"--"+"fe::FormContainer::"+s[0];return this.prepareResult(this.getBuilder().hasId(u).has(function(e){var t;if(Object.keys(o).length){t=e.getFormElements().filter(function(e){return Object.keys(o).every(function(t){return o[t]===e.getProperty(t)})})}else{t=e.getFormElements()}return t.length===r}).description(t.formatMessage("Form Container '{0}' on Form '{1}' has '{2}' Form Elements.",s[0],c,s[1])).execute())};return n});
//# sourceMappingURL=FormAssertions.js.map