sap.ui.define(["exports","sap/ui/webc/common/thirdparty/base/UI5Element","./GroupHeaderListItem"],function(e,t,r){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.default=void 0;t=s(t);r=s(r);function s(e){return e&&e.__esModule?e:{default:e}}const u={tag:"ui5-mcb-group-item",properties:{text:{type:String}},slots:{},events:{}};class i extends t.default{static get metadata(){return u}static get dependencies(){return[r.default]}get isGroupItem(){return true}get stableDomRef(){return this.getAttribute("stable-dom-ref")||`${this._id}-stable-dom-ref`}}i.define();var a=i;e.default=a});
//# sourceMappingURL=MultiComboBoxGroupItem.js.map