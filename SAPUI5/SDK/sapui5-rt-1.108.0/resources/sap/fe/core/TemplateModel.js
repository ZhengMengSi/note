/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/ClassSupport","sap/ui/base/Object","sap/ui/model/json/JSONModel"],function(e,t,o){"use strict";var n,i;var r=e.defineUI5Class;function a(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function d(e,t){e.prototype=Object.create(t.prototype);e.prototype.constructor=e;f(e,t)}function f(e,t){f=Object.setPrototypeOf?Object.setPrototypeOf.bind():function e(t,o){t.__proto__=o;return t};return f(e,t)}var s=(n=r("sap.fe.core.TemplateModel"),n(i=function(e){d(t,e);function t(t,n){var i;i=e.call(this)||this;i.oMetaModel=n;i.oConfigModel=new o;i.oConfigModel.setSizeLimit(Number.MAX_VALUE);i.bConfigLoaded=false;var r=a(i);if(typeof t==="function"){var d=i.oConfigModel._getObject.bind(i.oConfigModel);i.oConfigModel._getObject=function(e,o){if(!r.bConfigLoaded){this.setData(t());r.bConfigLoaded=true}return d(e,o)}}else{i.oConfigModel.setData(t)}i.fnCreateMetaBindingContext=i.oMetaModel.createBindingContext.bind(i.oMetaModel);i.fnCreateConfigBindingContext=i.oConfigModel.createBindingContext.bind(i.oConfigModel);i.oConfigModel.createBindingContext=i.createBindingContext.bind(a(i));return i.oConfigModel||a(i)}var n=t.prototype;n.createBindingContext=function e(t,o,n,i){var r;var a;var d=n&&n.noResolve;a=this.fnCreateConfigBindingContext(t,o,n,i);var f=!d&&((r=a)===null||r===void 0?void 0:r.getObject());if(f&&typeof f==="string"){a=this.fnCreateMetaBindingContext(f,o,n,i)}return a};n.destroy=function e(){this.oConfigModel.destroy();o.prototype.destroy.apply(this)};return t}(t))||i);return s},false);
//# sourceMappingURL=TemplateModel.js.map