sap.ui.define(["exports","sap/ui/webc/common/thirdparty/base/renderer/LitRenderer"],function(e,i){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.default=void 0;const n=(e,n,o)=>(0,i.html)`<div tabindex="${(0,i.ifDefined)(e._tabIndex)}" @click="${e._handleSelect}" @focusin="${e._focusin}" @focusout="${e._focusout}" @keydown="${e._keydown}" class="ui5-token--wrapper" role="option" aria-selected="${(0,i.ifDefined)(e.selected)}"><span class="ui5-token--text">${(0,i.ifDefined)(e.text)}</span>${!e.readonly?t(e,n,o):undefined}</div>`;const t=(e,n,t)=>(0,i.html)`<div class="ui5-token--icon" @click="${e._delete}">${e.closeIcon.length?o(e,n,t):c(e,n,t)}</div>`;const o=(e,n,t)=>(0,i.html)`<slot name="closeIcon"></slot>`;const c=(e,n,t)=>t?(0,i.html)`<${(0,i.scopeTag)("ui5-icon",n,t)} name="${(0,i.ifDefined)(e.iconURI)}" accessible-name="${(0,i.ifDefined)(e.tokenDeletableText)}" show-tooltip></${(0,i.scopeTag)("ui5-icon",n,t)}>`:(0,i.html)`<ui5-icon name="${(0,i.ifDefined)(e.iconURI)}" accessible-name="${(0,i.ifDefined)(e.tokenDeletableText)}" show-tooltip></ui5-icon>`;var s=n;e.default=s});
//# sourceMappingURL=TokenTemplate.lit.js.map