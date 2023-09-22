/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/test/OpaBuilder","./FEBuilder","sap/fe/test/Utils","sap/ui/test/matchers/Interactable"],function(e,t,n,r){"use strict";var o=function(){return t.apply(this,arguments)};o.create=function(e){return new o(e)};o.prototype=Object.create(t.prototype);o.prototype.constructor=o;o._toggleOverflow=function(n,o,s){var a="overflowButton";if(s){a=s+"-"+a}return n.doConditional(e.Matchers.childrenMatcher(e.create().has(t.Matchers.id(new RegExp(a+"$"))).hasProperties({pressed:!o}).has(new r).mustBeEnabled().mustBeVisible()),e.Actions.press(a))};o.openOverflow=function(e,t){return o._toggleOverflow(e,true,t)};o.closeOverflow=function(e,t){return o._toggleOverflow(e,false,t)};o.prototype.doOpenOverflow=function(){return o.openOverflow(this)};o.prototype.doCloseOverflow=function(){return o.closeOverflow(this)};o.prototype.doOnContent=function(n,o){var s=new t(this.getOpaInstance(),this.build()).hasType("sap.m.OverflowToolbar"),a=function(e){if(e.isA("sap.fe.macros.ShareAPI")){return!!e.getContent().getText}else{return!!e.getText}},i=t.Matchers.deepAggregation("content",[new r,a,n]),c=function(e){return e.getAggregation("_button")?e.getAggregation("_button").getAggregation("_textButton"):null},u=function(){s.has(function(e){return i(e).length===1}).do(function(t){var n=i(t)[0];if(n.isA("sap.fe.macros.ShareAPI")){n=n.getContent()}var r=n.getMetadata().getName()==="sap.m.MenuButton"?c(n)||n:n;e.Actions.executor(o||e.Actions.press())(r)}).execute()};return this.doOpenOverflow().success(u)};o.prototype.hasContent=function(n,r){var s=new o(this.getOpaInstance(),this.build()),a=[n,t.Matchers.states(r)];if(r&&r.visible===false){r=Object.assign(r);delete r.visible;s.hasSome(e.Matchers.aggregationMatcher("content",a),e.Matchers.not(e.Matchers.aggregationMatcher("content",[n,t.Matchers.states(r)])),e.Matchers.children(e.Matchers.match([n,t.Matchers.states(r)])))}else{s.hasAggregation("content",a)}return this.doOpenOverflow().success(s)};return o});
//# sourceMappingURL=OverflowToolbarBuilder.js.map