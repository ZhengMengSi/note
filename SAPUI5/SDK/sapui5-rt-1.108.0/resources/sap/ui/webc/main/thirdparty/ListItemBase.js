sap.ui.define(["exports","sap/ui/webc/common/thirdparty/base/renderer/LitRenderer","sap/ui/webc/common/thirdparty/base/UI5Element","sap/ui/webc/common/thirdparty/base/util/TabbableElements","sap/ui/webc/common/thirdparty/base/Keys","./generated/themes/ListItemBase.css"],function(e,t,r,s,a,o){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.default=void 0;t=i(t);r=i(r);o=i(o);function i(e){return e&&e.__esModule?e:{default:e}}const n={properties:{selected:{type:Boolean},hasBorder:{type:Boolean},_tabIndex:{type:String,defaultValue:"-1",noAttribute:true},disabled:{type:Boolean},focused:{type:Boolean}},events:{_focused:{},"_forward-after":{},"_forward-before":{}}};class u extends r.default{static get metadata(){return n}static get render(){return t.default}static get styles(){return o.default}_onfocusin(e){if(e.target!==this.getFocusDomRef()){return}this.focused=true;this.fireEvent("_focused",e)}_onfocusout(e){this.focused=false}_onkeydown(e){if((0,a.isTabNext)(e)){return this._handleTabNext(e)}if((0,a.isTabPrevious)(e)){return this._handleTabPrevious(e)}}_onkeyup(){}_handleTabNext(e){const t=e.target;if(this.shouldForwardTabAfter(t)){if(!this.fireEvent("_forward-after",{item:t},true)){e.preventDefault()}}}_handleTabPrevious(e){const t=e.target;if(this.shouldForwardTabBefore(t)){const r=e;r.item=t;this.fireEvent("_forward-before",r)}}shouldForwardTabAfter(e){const t=(0,s.getTabbableElements)(this.getDomRef());if(e.getFocusDomRef){e=e.getFocusDomRef()}return!t.length||t[t.length-1]===e}shouldForwardTabBefore(e){return this.getDomRef()===e}get classes(){return{main:{"ui5-li-root":true,"ui5-li--focusable":!this.disabled}}}get ariaDisabled(){return this.disabled?"true":undefined}get tabIndex(){if(this.disabled){return-1}if(this.selected){return 0}return this._tabIndex}}var d=u;e.default=d});
//# sourceMappingURL=ListItemBase.js.map