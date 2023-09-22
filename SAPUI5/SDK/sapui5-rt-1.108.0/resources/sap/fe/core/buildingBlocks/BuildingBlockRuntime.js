/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/base/util/deepClone","sap/base/util/uid","sap/fe/core/buildingBlocks/AttributeModel","sap/fe/core/helpers/BindingToolkit","sap/fe/macros/ResourceModel","sap/ui/base/BindingParser","sap/ui/core/util/XMLPreprocessor","./TraceInfo"],function(e,t,r,n,i,a,o,s,l){"use strict";function c(e,t,r){if(typeof e[f]==="function"){var n=e[f](),i,a,o;function d(e){try{while(!(i=n.next()).done&&(!r||!r())){e=t(i.value);if(e&&e.then){if(w(e)){e=e.v}else{e.then(d,o||(o=P.bind(null,a=new C,2)));return}}}if(a){P(a,1,e)}else{a=e}}catch(e){P(a||(a=new C),2,e)}}d();if(n.return){var s=function(e){try{if(!i.done){n.return()}}catch(e){}return e};if(a&&a.then){return a.then(s,function(e){throw s(e)})}s()}return a}if(!("length"in e)){throw new TypeError("Object is not iterable")}var l=[];for(var c=0;c<e.length;c++){l.push(e[c])}return u(l,function(e){return t(l[e])},r)}function u(e,t,r){var n=-1,i,a;function o(s){try{while(++n<e.length&&(!r||!r())){s=t(n);if(s&&s.then){if(w(s)){s=s.v}else{s.then(o,a||(a=P.bind(null,i=new C,2)));return}}}if(i){P(i,1,s)}else{i=s}}catch(e){P(i||(i=new C),2,e)}}o();return i}var f=typeof Symbol!=="undefined"?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";var d,v,p,h;var m={};var g=i.compileExpression;function b(e,t){var r=typeof Symbol!=="undefined"&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=T(e))||t&&e&&typeof e.length==="number"){if(r)e=r;var n=0;var i=function(){};return{s:i,n:function(){if(n>=e.length)return{done:true};return{done:false,value:e[n++]}},e:function(e){throw e},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a=true,o=false,s;return{s:function(){r=r.call(e)},n:function(){var e=r.next();a=e.done;return e},e:function(e){o=true;s=e},f:function(){try{if(!a&&r.return!=null)r.return()}finally{if(o)throw s}}}}function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function x(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(Object(r),!0).forEach(function(t){O(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function O(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}function P(e,t,r){if(!e.s){if(r instanceof C){if(r.s){if(t&1){t=r.s}r=r.v}else{r.o=P.bind(null,e,t);return}}if(r&&r.then){r.then(P.bind(null,e,t),P.bind(null,e,2));return}e.s=t;e.v=r;var n=e.o;if(n){n(e)}}}var C=function(){function e(){}e.prototype.then=function(t,r){var n=new e;var i=this.s;if(i){var a=i&1?t:r;if(a){try{P(n,1,a(this.v))}catch(e){P(n,2,e)}return n}else{return this}}this.o=function(e){try{var i=e.v;if(e.s&1){P(n,1,t?t(i):i)}else if(r){P(n,1,r(i))}else{P(n,2,i)}}catch(e){P(n,2,e)}};return n};return e}();function w(e){return e instanceof C&&e.s&1}function j(e,t,r){var n;for(;;){var i=e();if(w(i)){i=i.v}if(!i){return a}if(i.then){n=0;break}var a=r();if(a&&a.then){if(w(a)){a=a.s}else{n=1;break}}if(t){var o=t();if(o&&o.then&&!w(o)){n=2;break}}}var s=new C;var l=P.bind(null,s,2);(n===0?i.then(u):n===1?a.then(c):o.then(f)).then(void 0,l);return s;function c(n){a=n;do{if(t){o=t();if(o&&o.then&&!w(o)){o.then(f).then(void 0,l);return}}i=e();if(!i||w(i)&&!i.v){P(s,1,a);return}if(i.then){i.then(u).then(void 0,l);return}a=r();if(w(a)){a=a.v}}while(!a||!a.then);a.then(c).then(void 0,l)}function u(e){if(e){a=r();if(a&&a.then){a.then(c).then(void 0,l)}else{c(a)}}else{P(s,1,a)}}function f(){if(i=e()){if(i.then){i.then(u).then(void 0,l)}else{u(i)}}else{P(s,1,a)}}}function k(e,t){try{var r=e()}catch(e){return t(e)}if(r&&r.then){return r.then(void 0,t)}return r}function A(e,t){if(!t){t=e.slice(0)}return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function E(e){return N(e)||B(e)||T(e)||S()}function S(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function T(e,t){if(!e)return;if(typeof e==="string")return I(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return I(e,t)}function B(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function N(e){if(Array.isArray(e))return I(e)}function I(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,n=new Array(t);r<t;r++){n[r]=e[r]}return n}var M=function(t,r,i){var o=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;try{var s=t.fragment||"".concat(t.namespace,".").concat(t.name);var c="this";var u={};var f={};var d=i.getSettings();if(d.models["sap.fe.i18n"]){d.models["sap.fe.i18n"].getResourceBundle().then(function(e){a.setApplicationI18nBundle(e)}).catch(function(t){e.error(t)})}var v=H(t.metadata,t.isOpen);if(!d[s]){d[s]={}}return Promise.resolve($(v,r,o,i,t.apiVersion)).then(function(a){return Promise.resolve(D(v,d,r,o,i,u,f)).then(function(f){var p=f.mMissingContext,h=f.propertyValues;a=Object.assign(a,h);var m=Object.keys(a);var g=k(function(){return Promise.resolve(V(r,i,v,o,a,t.apiVersion)).then(function(f){function h(){if(P){d["_macroInfo"]=P}else{delete d["_macroInfo"]}}var m;var g={};if(d.models.viewData){g=d.models.viewData.getProperty("/controlConfiguration")}var b=a;if(F(t)&&t.create){b=t.create.call(t,a,g,d,f,o);Object.keys(v.metadataContexts).forEach(function(e){if(v.metadataContexts[e].computed===true){u[e]=b[e]}});Object.keys(p).forEach(function(e){if(b.hasOwnProperty(e)){u[e]=b[e]}})}else if(t.apiVersion===2){Object.keys(a).forEach(function(e){var t=a[e];if(t&&t.isA&&t.isA(X)&&!t.getModel().isA("sap.ui.model.odata.v4.ODataMetaModel")){a[e]=t.getObject()}});var y=t;a.isPublic=o;m=new y(x(x({},a),f),g,d);b=m.getProperties();Object.keys(v.metadataContexts).forEach(function(e){if(b.hasOwnProperty(e)){var t=b[e];if(typeof t==="object"&&!t.getObject){var r=re(t);var n="".concat(r);d.models.converterContext.setProperty(n,t);t=d.models.converterContext.createBindingContext(n);delete te[r];u[e]=t}else if(!u.hasOwnProperty(e)&&t!==undefined){u[e]=t}}})}var O=new n(r,b,t);u[c]=O.createBindingContext("/");var P;if(l.isTraceInfoActive()){var C=l.traceMacroCalls(s,v,u,r,i);if(C){P=d["_macroInfo"];d["_macroInfo"]=C.macroInfo}}_(s,v,u,r);var w=i.with(u,t.isOpen!==undefined?!t.isOpen:true);var j=r.parentNode;var k;var A;var E=true;var S=function(){if(j){k=Array.from(j.children).indexOf(r);if(F(t)&&t.getTemplate||t.apiVersion===2&&!t.fragment){var n;var i=false;if(t.apiVersion===2){n=m.getTemplate();if(t.isRuntime===true){for(var a in te){var o=te[a];var l="".concat(a);d.models.converterContext.setProperty(l,o);delete te[a]}}i=true}else if(t.getTemplate){n=t.getTemplate(b)}var c="";if(n){if(!n.firstElementChild){n=ne(n,i);var u=document.createNodeIterator(n,NodeFilter.SHOW_TEXT);var p=u.nextNode();while(p){if(p.textContent&&p.textContent.trim().length>0){c=p.textContent}p=u.nextNode()}}if(n.localName==="parsererror"){e.error("Error while processing building block ".concat(t.name));try{var h;R=true;n=(h=m)!==null&&h!==void 0&&h.getTemplate?m.getTemplate():t.getTemplate(b);n=ne(n,true)}finally{R=false}}else if(c.length>0){e.error("Error while processing building block ".concat(t.name));var g=ee(["Error while processing building block ".concat(t.name),"Trailing text was found in the XML: ".concat(c)],n.outerHTML);n=ne(g,true)}r.replaceWith(n);r=j.children[k];Q(f,v.aggregations,r,E);E=false;A=w.visitNode(r)}else{r.remove();A=Promise.resolve()}}else{A=w.insertFragment(s,r)}return Promise.resolve(A).then(function(){var e=j.children[k];Q(f,v.aggregations,e,E);if(e!==undefined){var t=e.querySelectorAll("slot");t.forEach(function(e){e.remove()})}})}}();return S&&S.then?S.then(h):h(S)})},function(n){var i={initialProperties:{},resolvedProperties:{},missingContexts:p};var o=b(m),s;try{for(o.s();!(s=o.n()).done;){var l=s.value;var c=a[l];if(c&&c.isA&&c.isA(X)){i.initialProperties[l]={path:c.getPath(),value:c.getObject()}}else{i.initialProperties[l]=c}}}catch(e){o.e(e)}finally{o.f()}for(var u in a){var f=a[u];if(!m.includes(u)){if(f&&f.isA&&f.isA(X)){i.resolvedProperties[u]={path:f.getPath(),value:f.getObject()}}else{i.resolvedProperties[u]=f}}}var d=n;e.error(d,d);var v=ee(["Error while processing building block ".concat(t.name)],r.outerHTML,i,d.stack);var h=ne(v,true);r.replaceWith(h)});if(g&&g.then)return g.then(function(){})})})}catch(e){return Promise.reject(e)}};var V=function(e,t,r,n,i,a){try{var o={};var s=function(){if(e.firstElementChild!==null){function p(){s=e.firstElementChild;var l=j(function(){return s!==null},void 0,function(){function l(){s=c}var c=s.nextElementSibling;var u=s.localName;var f=u;if(f[0].toUpperCase()===f[0]){f=r.defaultAggregation||""}var d=function(){if(Object.keys(r.aggregations).indexOf(f)!==-1&&(!n||r.aggregations[f].isPublic===true)){var l=function(){if(a===2){var n=r.aggregations[f];var i=function(){if(!n.slot&&s!==null&&s.children.length>0){return Promise.resolve(t.visitNode(s)).then(function(){var t=s.firstElementChild;while(t){var r=document.createElementNS(e.namespaceURI,t.getAttribute("key"));var n=t.nextElementSibling;r.appendChild(t);o[t.getAttribute("key")]=r;t.removeAttribute("key");t=n}})}else if(n.slot){if(f!==u){if(!o[f]){var r=document.createElementNS(e.namespaceURI,f);o[f]=r}o[f].appendChild(s)}else{o[f]=s}}}();if(i&&i.then)return i.then(function(){})}else{return Promise.resolve(t.visitNode(s)).then(function(){o[s.localName]=s})}}();if(l&&l.then)return l.then(function(){})}else{var c=function(){if(Object.keys(r.properties).indexOf(f)!==-1){return Promise.resolve(t.visitNode(s)).then(function(){if(r.properties[f].type==="object"){i[f]={};for(var e=0,t=Object.keys(s.attributes);e<t.length;e++){var n=t[e];i[f][s.attributes[n].localName]=s.attributes[n].value}}else if(r.properties[f].type==="array"){if(s!==null&&s.children.length>0){var a=s.children;var o=[];for(var l=0;l<a.length;l++){var c=a[l];var u={};for(var d=0,v=Object.keys(c.attributes);d<v.length;d++){var p=v[d];u[c.attributes[p].localName]=c.attributes[p].value}o.push(u)}i[f]=o}}})}}();if(c&&c.then)return c.then(function(){})}}();return d&&d.then?d.then(l):l(d)});if(l&&l.then)return l.then(function(){})}var s=e.firstElementChild;if(a===2){while(s!==null){var l=s.localName;var c=l;if(c[0].toUpperCase()===c[0]){c=r.defaultAggregation||""}var u=r.aggregations[c];if(u!==undefined&&!u.slot){var f=K(s);o[c]=f;for(var d in f){r.aggregations[d]=f[d]}}s=s.nextElementSibling}}var v=function(){if(a!==2){return Promise.resolve(t.visitChildNodes(e)).then(function(){})}}();return v&&v.then?v.then(p):p(v)}}();return Promise.resolve(s&&s.then?s.then(function(){return o}):o)}catch(e){return Promise.reject(e)}};var D=function(e,t,r,n,i,a,o){try{t.currentContextPath=t.bindingContexts.contextPath;var s={};var l={};var c=e.metadataContexts;var u=Object.keys(c);var f=u.indexOf("contextPath");if(f!==-1){var d=u.splice(f,1);u.splice(0,0,d[0])}for(var v=0,p=u;v<p.length;v++){var h=p[v];var m=n&&c[h].isPublic===false&&r.hasAttribute(h);var g=J(t,r,h,i,m,e.isOpen);if(g){g.name=h;Y(a,i,g,o);if((h==="entitySet"||h==="contextPath")&&!t.bindingContexts.hasOwnProperty(h)){t.bindingContexts[h]=a[h]}if(h==="contextPath"){t.currentContextPath=a[h]}l[h]=a[h]}else{s[h]=true}}return Promise.resolve({mMissingContext:s,propertyValues:l})}catch(e){return Promise.reject(e)}};var $=function(r,n,i,a,o){try{var s=r.properties;var l=Object.keys(s);var u={};var f=c(l,function(r){if(s[r].type==="object"){u[r]=t(s[r].defaultValue||{})}else{u[r]=s[r].defaultValue}var l=function(){if(n.hasAttribute(r)&&i&&s[r].isPublic===false){e.error("Property ".concat(r," was ignored as it is not intended for public usage"))}else{var t=function(){if(n.hasAttribute(r)){return Promise.resolve(a.visitAttribute(n,n.attributes.getNamedItem(r))).then(function(){var e=n.getAttribute(r);if(e!==undefined){if(o===2&&typeof e==="string"&&!e.startsWith("{")){switch(s[r].type){case"boolean":e=e==="true";break;case"number":e=Number(e);break}}u[r]=e}})}}();if(t&&t.then)return t.then(function(){})}}();if(l&&l.then)return l.then(function(){})});return Promise.resolve(f&&f.then?f.then(function(){return u}):u)}catch(e){return Promise.reject(e)}};var L="sap.fe.core.buildingBlocks.BuildingBlockRuntime";var W=new DOMParser;var R=false;function F(e){return e.apiVersion===undefined||e.apiVersion===1}function q(e,t,r,n){var i=t[n];var a=i===null||i===void 0?void 0:i.getObject();if(r.required===true&&(!i||a===null)){throw new Error("".concat(e,": Required metadataContext '").concat(n,"' is missing"))}else if(a){if(a.hasOwnProperty("$kind")&&r.$kind){if(r.$kind.indexOf(a["$kind"])===-1){throw new Error("".concat(e,": '").concat(n,"' must be '$kind' '").concat(r["$kind"],"' but is '").concat(a.$kind,"': ").concat(i.getPath()))}}else if(a.hasOwnProperty("$Type")&&r.$Type){if(r.$Type.indexOf(a["$Type"])===-1){throw new Error("".concat(e,": '").concat(n,"' must be '$Type' '").concat(r["$Type"],"' but is '").concat(a.$Type,"': ").concat(i.getPath()))}}}}function _(t,r,n,i){var a=r.metadataContexts&&Object.keys(r.metadataContexts)||[],o=r.properties&&Object.keys(r.properties)||[],s={};Object.keys(i.attributes).forEach(function(e){var t=i.attributes[e].name;s[t]=true});a.forEach(function(e){var i=r.metadataContexts[e];q(t,n,i,e);delete s[e]});o.forEach(function(e){var n=r.properties[e];if(!i.hasAttribute(e)){if(n.required&&!n.hasOwnProperty("defaultValue")){throw new Error("".concat(t,": ")+"Required property '".concat(e,"' is missing"))}}else{delete s[e]}});Object.keys(s).forEach(function(r){if(r.indexOf(":")<0&&!r.startsWith("xmlns")){e.warning("Unchecked parameter: ".concat(t,": ").concat(r),undefined,L)}})}m.validateMacroSignature=_;var U="sap.ui.core.Element";var X="sap.ui.model.Context";function H(e){var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(e){var r={};var n={dependents:{type:U},customData:{type:U}};var i={};var a;Object.keys(e.properties).forEach(function(t){if(e.properties[t].type!==X){r[t]=e.properties[t]}else{i[t]=e.properties[t]}});if(e.events!==undefined){Object.keys(e.events).forEach(function(t){r[t]=e.events[t]})}if(e.aggregations!==undefined){Object.keys(e.aggregations).forEach(function(t){n[t]=e.aggregations[t];if(n[t].isDefault){a=t}})}return{properties:r,aggregations:n,defaultAggregation:a,metadataContexts:i,isOpen:t}}else{return{metadataContexts:{},aggregations:{dependents:{type:U},customData:{type:U}},properties:{},isOpen:t}}}function G(e,t){var r;if(t&&t.startsWith("/")){r=t}else{var n=e.currentContextPath.getPath();if(!n.endsWith("/")){n+="/"}r=n+t}return{model:"metaModel",path:r}}function z(e,t,r){var n;if(r.startsWith("/uid--")){var i=te[r];e.models.converterContext.setProperty(r,i);n={model:"converterContext",path:r}}else if(t==="metaPath"&&e.currentContextPath||t==="contextPath"){n=G(e,r)}else if(r&&r.startsWith("/")){n={model:"metaModel",path:r}}else{n={model:"metaModel",path:e.bindingContexts.entitySet?e.bindingContexts.entitySet.getPath(r):r}}return n}function J(e,t,r,n,i,a){var s;if(!i&&t.hasAttribute(r)){var l=t.getAttribute(r);s=o.complexParser(l);if(!s){s=z(e,r,l)}}else if(e.bindingContexts.hasOwnProperty(r)){s={model:r,path:""}}else if(a){try{if(n.getContext("".concat(r,">"))){s={model:r,path:""}}}catch(e){return undefined}}return s}function K(e){var t={};if(e&&e.children.length>0){var r=e.children;for(var n=0;n<r.length;n++){var i=r[n];var a=i.getAttribute("key")||i.getAttribute("id");if(a){a="InlineXML_".concat(a);i.setAttribute("key",a);t[a]={key:a,position:{placement:i.getAttribute("placement"),anchor:i.getAttribute("anchor")},type:"Slot"}}}}return t}function Q(e,t,r){var n=arguments.length>3&&arguments[3]!==undefined?arguments[3]:false;if(Object.keys(e).length>0){Object.keys(e).forEach(function(i){var a=e[i];if(r!==null&&r!==undefined&&a){var o=document.createElementNS(r.namespaceURI,i.replace(/:/gi,"_"));var s=a.firstElementChild;while(s){var l=s.nextElementSibling;o.appendChild(s);s=l}if(i!=="customData"&&i!=="dependents"){var c=t[i]!==undefined&&t[i].slot||i;var u=r.querySelector("slot[name='".concat(c,"']"));if(u!==null){u.replaceWith.apply(u,E(o.children))}}else if(n&&o.children.length>0){r.appendChild(o)}}})}}function Y(e,t,r,n){var i=r.name||r.model||undefined;if(n[i]){return}try{var a=r.path;if(r.model!=null){a="".concat(r.model,">").concat(a)}var o=t.getSettings();if(r.model==="converterContext"&&r.path.length>0){e[i]=o.models[r.model].getContext(r.path,o.bindingContexts[r.model])}else if(!o.bindingContexts[r.model]&&o.models[r.model]){e[i]=o.models[r.model].getContext(r.path)}else{e[i]=t.getContext(a)}n[i]=e[i]}catch(e){}}function Z(e){s.plugIn(function(t,r){return M(e,t,r)},e.namespace,e.xmlTag||e.name);if(e.publicNamespace){s.plugIn(function(t,r){return M(e,t,r,true)},e.publicNamespace,e.xmlTag||e.name)}}m.registerBuildingBlock=Z;function ee(e,t,r,n){var i=e.map(function(e){return oe(d||(d=A(['<m:Label text="','"/>'])),ie(e))});var a="";if(n){var o=btoa("<pre>".concat(n,"</pre>"));a=oe(v||(v=A(['<m:FormattedText htmlText="','" />'])),"{= BBF.base64Decode('".concat(o,"') }"))}var s="";if(r){s=oe(p||(p=A(['<m:VBox>\n\t\t\t\t\t\t<m:Label text="Trace Info"/>\n\t\t\t\t\t\t<code:CodeEditor type="json"  value="','" height="300px" />\n\t\t\t\t\t</m:VBox>'])),"{= BBF.base64Decode('".concat(btoa(JSON.stringify(r,null,4)),"') }"))}return oe(h||(h=A(['<m:VBox xmlns:m="sap.m" xmlns:code="sap.ui.codeeditor" core:require="{BBF:\'sap/fe/core/buildingBlocks/BuildingBlockFormatter\'}">\n\t\t\t\t',"\n\t\t\t\t",'\n\t\t\t\t<grid:CSSGrid gridTemplateRows="fr" gridTemplateColumns="repeat(2,1fr)" gridGap="1rem" xmlns:grid="sap.ui.layout.cssgrid" >\n\t\t\t\t\t<m:VBox>\n\t\t\t\t\t\t<m:Label text="How the building block was called"/>\n\t\t\t\t\t\t<code:CodeEditor type="xml" value="','" height="300px" />\n\t\t\t\t\t</m:VBox>\n\t\t\t\t\t',"\n\t\t\t\t</grid:CSSGrid>\n\t\t\t</m:VBox>"])),i,a,"{= BBF.base64Decode('".concat(btoa(t.replaceAll("&gt;",">")),"') }"),s)}var te={};function re(e){var t="/uid--".concat(r());te[t]=e;return t}function ne(e){var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;if(t){e='<template\n\t\t\t\t\t\txmlns:template="http://schemas.sap.com/sapui5/extension/sap.ui.core.template/1"\n\t\t\t\t\t\txmlns:m="sap.m"\n\t\t\t\t\t\txmlns:macros="sap.fe.macros"\n\t\t\t\t\t\txmlns:core="sap.ui.core"\n\t\t\t\t\t\txmlns:mdc="sap.ui.mdc"\n\t\t\t\t\t\txmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1">'.concat(e,"</template>")}var r=W.parseFromString(e,"text/xml");var n=r.firstElementChild;while(((i=n)===null||i===void 0?void 0:i.localName)==="template"){var i;n=n.firstElementChild}return n}m.parseXMLString=ne;function ie(e){return e===null||e===void 0?void 0:e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}m.escapeXMLAttributeValue=ie;function ae(e){var t=ne(e,true);if(t!==undefined&&(t===null||t===void 0?void 0:t.localName)==="parsererror"){var r=t.innerText||t.innerHTML;return ee([r.split("\n")[0]],e)}else{return e}}var oe=function(e){var t="";var r;for(var n=arguments.length,i=new Array(n>1?n-1:0),a=1;a<n;a++){i[a-1]=arguments[a]}for(r=0;r<i.length;r++){t+=e[r];var o=i[r];if(Array.isArray(o)&&o.length>0&&typeof o[0]==="string"){t+=o.flat(5).join("\n").trim()}else if(Array.isArray(o)&&o.length>0&&typeof o[0]==="function"){t+=o.map(function(e){return e()}).join("\n")}else if(o!==null&&o!==void 0&&o._type){var s=g(o);t+=ie(s)}else if(o!==null&&o!==void 0&&o.getTemplate){t+=o.getTemplate()}else if(typeof o==="undefined"){t+="{this>undefinedValue}"}else if(typeof o==="function"){t+=o()}else if(typeof o==="object"&&o!==null){var l;if((l=o.isA)!==null&&l!==void 0&&l.call(o,"sap.ui.model.Context")){t+=o.getPath()}else{var c=re(o);t+="".concat(c)}}else if(o&&typeof o==="string"&&!o.startsWith("<")&&!o.startsWith("&lt;")){t+=ie(o)}else{t+=o}}t+=e[r];t=t.trim();if(R){return ae(t)}return t};m.xml=oe;return m},false);
//# sourceMappingURL=BuildingBlockRuntime.js.map