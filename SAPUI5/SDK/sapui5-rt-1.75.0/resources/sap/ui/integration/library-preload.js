//@ui5-bundle sap/ui/integration/library-preload.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/integration/Extension',['sap/ui/core/Element'],function(E){"use strict";
var a=E.extend("sap.ui.integration.Extension",{metadata:{library:"sap.ui.integration",properties:{actions:{type:"array"}},events:{onAction:{allowPreventDefault:true,parameters:{card:{type:"sap.ui.core.Control"},actionConfig:{type:'object'},actionSource:{type:"sap.ui.core.Control"},manifestParameters:{type:"object"},type:{type:"sap.ui.integration.CardActionType"}}}}}});
return a;});
sap.ui.predefine('sap/ui/integration/Host',['./Extension'],function(E){"use strict";
var H=E.extend("sap.ui.integration.Host",{metadata:{library:"sap.ui.integration",properties:{},events:{}}});
return H;});
sap.ui.predefine('sap/ui/integration/Widget',["sap/ui/thirdparty/jquery","sap/ui/core/Control","sap/ui/integration/util/Manifest","sap/base/Log","sap/ui/integration/WidgetRenderer","sap/base/util/LoaderExtensions","sap/ui/core/ComponentContainer"],function(q,C,W,L,a,b,c){"use strict";var M={APP_TYPE:"/sap.app/type",PARAMS:"/sap.widget/configuration/parameters"};
var d=C.extend("sap.ui.integration.Widget",{
metadata:{library:"sap.ui.integration",properties:{manifest:{type:"any",defaultValue:""},parameters:{type:"object",defaultValue:null},baseUrl:{type:"string",defaultValue:""}},aggregations:{_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{action:{parameters:{actionSource:{type:"sap.ui.core.Control"},manifestParameters:{type:"object"}}},manifestReady:{parameters:{}}}},
renderer:a
});
d.prototype.init=function(){this.setBusyIndicatorDelay(0);};
d.prototype.onBeforeRendering=function(){if(this._bApplyManifest){this._bApplyManifest=false;var m=this.getManifest();if(!m){this.destroyManifest();}else{this.createManifest(m,this.getBaseUrl());}}};
d.prototype.exit=function(){this.destroyManifest();};
d.prototype.destroyManifest=function(){if(this._oWidgetManifest){this._oWidgetManifest.destroy();this._oWidgetManifest=null;}this.destroyAggregation("_content");};
d.prototype.setManifest=function(v){this.setProperty("manifest",v);this._bApplyManifest=true;return this;};
d.prototype.setParameters=function(v){this.setProperty("parameters",v);this._bApplyManifest=true;return this;};
d.prototype.getManifest=function(){var v=this.getProperty("manifest");if(v&&typeof v==="object"){return q.extend(true,{},v);}return v;};
d.prototype.createManifest=function(m,B){var o={};if(typeof m==="string"){o.manifestUrl=m;m=null;}o.processI18n=false;this.setBusy(true);this._oWidgetManifest=new W("sap.widget",m,B);return this._oWidgetManifest.load(o).then(function(){this.fireManifestReady();this._applyManifest();}.bind(this)).catch(this._applyManifest.bind(this));};
d.prototype.getParameters=function(){var v=this.getProperty("parameters");if(v&&typeof v==="object"){return q.extend(true,{},v);}return v;};
d.prototype._applyManifest=function(){var p=this.getParameters(),A=this._oWidgetManifest.get(M.APP_TYPE);if(A&&A!=="widget"){L.error("sap.app/type entry in manifest is not 'widget'");}this._registerManifestModulePath();this._oWidgetManifest.processParameters(p);return this._createComponent(this._oWidgetManifest.getJson(),this.getBaseUrl());};
d.prototype._registerManifestModulePath=function(){if(!this._oWidgetManifest){return;}var A=this._oWidgetManifest.get("/sap.app/id");if(A){b.registerResourcePath(A.replace(/\./g,"/"),this._oWidgetManifest.getUrl());}else{L.error("Widget sap.app/id entry in the manifest is mandatory");}};
d.prototype._createComponent=function(m,B){var o={manifest:m};if(B){o.url=B;o.altManifestUrl=B;}return sap.ui.core.Component.load(o).then(function(e){var f=new c({component:e().getId()});f.attachEvent("action",function(E){this.fireEvent("action",{actionSource:E.getParameter("actionSource"),manifestParameters:E.getParameter("manifestParameters")});}.bind(this));this.setAggregation("_content",f);this.setBusy(false);this.fireEvent("_ready");}.bind(this));};
d.prototype.loadDesigntime=function(){if(!this._oWidgetManifest){return Promise.reject("Manifest not yet available");}var A=this._oWidgetManifest.get("/sap.app/id");if(!A){return Promise.reject("App id not maintained");}var m=A.replace(/\./g,"/");return new Promise(function(r,e){var s=m+"/"+(this._oWidgetManifest.get("/sap.widget/designtime")||"designtime/Widget.designtime");if(s){sap.ui.require([s,"sap/base/util/deepClone"],function(D,f){r({designtime:D,manifest:f(this._oWidgetManifest.oJson,30)});}.bind(this),function(){e({error:s+" not found"});});}else{e();}}.bind(this));};
return d;});
sap.ui.predefine('sap/ui/integration/WidgetComponent',["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel"],function(U,J){"use strict";
var W=U.extend("sap.ui.integration.WidgetComponent");
W.prototype.init=function(){var r=U.prototype.init.apply(this,arguments);this._applyWidgetModel();return r;};
W.prototype._applyWidgetModel=function(){var m=new J();m.setData(this.getManifestEntry("sap.widget")||{});this.setModel(m,"sap.widget");};
W.prototype.fireAction=function(p){this.oContainer.getParent().fireAction(p);};
W.prototype.getWidgetConfiguration=function(p){return this.getModel("sap.widget").getProperty(p||"/");};
W.prototype.update=function(){};
return W;});
sap.ui.predefine('sap/ui/integration/WidgetRenderer',[],function(){"use strict";var W={},r=sap.ui.getCore().getLibraryResourceBundle("sap.f");
W.render=function(R,w){var c=w.getAggregation("_content");R.write("<div");R.writeElementData(w);R.writeClasses();R.writeAccessibilityState(w,{role:"region",roledescription:{value:r.getText("ARIA_ROLEDESCRIPTION_CARD"),append:true}});R.write(">");if(c){R.renderControl(c);}R.write("</div>");};
return W;});
sap.ui.predefine('sap/ui/integration/controls/ActionsToolbar',["sap/ui/thirdparty/jquery","sap/m/library","sap/ui/core/Core",'sap/ui/core/Control',"sap/m/Button","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/f/cards/CardActions","./ActionsToolbarRenderer"],function(q,l,C,a,B,O,b,c){"use strict";var d=l.OverflowToolbarPriority,T=l.ToolbarStyle;
var A=a.extend("sap.ui.integration.controls.ActionsToolbar",{metadata:{library:"sap.ui.integration",properties:{},aggregations:{_toolbar:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}}}});
A.prototype._createActionButton=function(h,o,m){var v=true,e=true;if(m.visible){if(q.isFunction(m.visible)){v=m.visible(o);}else{v=m.visible;}}if(m.enabled){if(q.isFunction(m.enabled)){e=m.enabled(o);}else{e=m.enabled;}}return new B({icon:m.icon,text:m.text,tooltip:m.tooltip,type:m.buttonType,enabled:e,visible:v,press:function(E){c.fireAction({card:o,host:h,action:m,manifestParameters:m.parameters,source:E.getSource(),url:m.url});},layoutData:new b({priority:d.AlwaysOverflow})});};
A.prototype.createToolbar=function(h,o){var t=this,H=false,e,f,g;this.destroyAggregation('_toolbar');f=h.getActions();if(!f||!f.length){return;}g=new O({style:T.Clear});f.forEach(function(i){e=t._createActionButton(h,o,i);g.addContent(e);if(e.getVisible()){H=true;}});if(H){this.setAggregation('_toolbar',g);}return H;};
return A;});
sap.ui.predefine('sap/ui/integration/controls/ActionsToolbarRenderer',['sap/ui/core/Renderer'],function(R){"use strict";var A={apiVersion:2};
A.render=function(r,c){r.openStart("div",c);r.class("sapUIActionsToolbar");r.openEnd();r.renderControl(c.getAggregation("_toolbar"));r.close("div");};
return A;},true);
sap.ui.predefine('sap/ui/integration/customElements/CustomElementBase',["sap/base/Log","sap/ui/integration/util/Utils","sap/base/strings/hyphenate","sap/base/strings/camelize","sap/ui/integration/thirdparty/customElements","sap/ui/integration/thirdparty/customEvent"],function(L,U,h,c,a,b){"use strict";
function C(){if(this.constructor===C){throw new TypeError('Abstract class "CustomElementBase" cannot be instantiated directly.');}return Reflect.construct(HTMLElement,[],this.constructor);}
C.prototype=Object.create(HTMLElement.prototype);C.prototype.constructor=C;
C.prototype.connectedCallback=function(){this._init();this._upgradeAllProperties();this._oControlInstance.placeAt(this.firstElementChild);this._attachEventListeners();};
C.prototype.disconnectedCallback=function(){if(this._oControlInstance){this._oControlInstance.destroy();delete this._oControlInstance;}if(this.firstElementChild){this.removeChild(this.firstElementChild);}};
C.prototype.attributeChangedCallback=function(A,o,n){this._init();var s=c(A);if(U.isJson(n)){n=JSON.parse(n);}if(this._mAllProperties[s]){this._mAllProperties[s].set(this._oControlInstance,n);}else if(this._mAllAssociations[s]){var v=document.getElementById(n)._getControl();this._mAllAssociations[s].set(this._oControlInstance,v);}};
C.prototype._init=function(){if(!this._oControlInstance){this._oControlInstance=new this._ControlClass();}if(!this.firstElementChild){var u=document.createElement("div");this.appendChild(u);}};
C.prototype._getControl=function(){this._init();return this._oControlInstance;};
C.prototype._attachEventListeners=function(){Object.keys(this._oMetadata.getEvents()).map(function(e){this._oControlInstance.attachEvent(e,function(E){this.dispatchEvent(new CustomEvent(e,{detail:E,bubbles:true}));},this);}.bind(this));};
C.prototype._upgradeAllProperties=function(){this._aAllProperties.forEach(this._upgradeProperty.bind(this));};
C.prototype._upgradeProperty=function(p){if(this[p]){var v=this[p];delete this[p];this[p]=v;}};
C.generateAccessors=function(p,P){P.forEach(function(s){Object.defineProperty(p,s,{get:function(){return this.getAttribute(h(s));},set:function(v){if(typeof v==="object"){v=JSON.stringify(v);}return this.setAttribute(h(s),v);}});});};
C.define=function(s,d,D){C.awaitDependencies(D).then(function(){window.customElements.define(s,d);});};
C.awaitDependencies=function(d){var p=d.map(function(s){return window.customElements.whenDefined(s);});return Promise.all(p);};
C.extend=function(d,s){function e(){return C.apply(this,arguments);}e.prototype=Object.create(C.prototype);e.prototype.constructor=e;var p=e.prototype,k="";p._ControlClass=d;p._oMetadata=d.getMetadata();p._mAllAssociations=p._oMetadata.getAllAssociations();p._mAllProperties=p._oMetadata.getAllProperties();p._aAllProperties=[];for(k in p._mAllProperties){if(s&&s.privateProperties&&s.privateProperties.indexOf(k)!==-1){continue;}p._aAllProperties.push(k);}for(k in p._mAllAssociations){p._aAllProperties.push(k);}Object.defineProperty(e,"observedAttributes",{get:function(){var A=p._aAllProperties.map(h);return A;}});C.generateAccessors(p,p._aAllProperties);return e;};
return C;});
sap.ui.predefine('sap/ui/integration/host/HostConfiguration',['sap/ui/core/Control',"sap/ui/integration/host/HostConfigurationCompiler"],function(C,H){"use strict";
var a=C.extend("sap.ui.integration.host.HostConfiguration",{
metadata:{library:"sap.ui.integration",properties:{config:{type:"any"},css:{type:"string"}},events:{cssChanged:{}}},
renderer:function(r,c){r.write("<style ");r.writeElementData(c);r.write(">");r.write(c._getCssText()||"");r.write("</style>");}
});
a.prototype.setConfig=function(v,s){this._sCssText=null;return this.setProperty("config",v,s);};
a.prototype.setCss=function(v,s){this._sCssText=null;return this.setProperty("css",v,s);};
a.prototype.onBeforeRendering=function(){if(!this._sCssText){if(this.getCss()){this._applyCss();}else{this._applyConfig();}}};
a.prototype._applyCss=function(){var c=this.getCss();H.loadResource(c,"text").then(function(s){this._sCssText=s;this.invalidate();}.bind(this)).catch(function(){});};
a.prototype._applyConfig=function(){var v=this.getConfig();if(typeof v==="string"){H.loadResource(v,"json").then(function(v){this._oConfig=v;this.invalidate();}.bind(this)).catch(function(){});}else if(typeof v==="object"&&!Array.isArray(v)){this._oConfig=v;this.invalidate();}};
a.prototype._getCssText=function(){var c=this._oConfig;if(!c&&!this.getCss()){return"";}if(this._sCssText){return this._sCssText;}var s=this.getId().replace(/-/g,"_").replace(/\./g,"_").replace(/\,/g,"_");this._sCssText=H.generateCssText(this._oConfig,s);this.fireCssChanged({cssText:this._sCssText});return this._sCssText;};
a.prototype.generateJSONSettings=function(t){return H.generateJSONSettings(this._oConfig,t);};
return a;});
sap.ui.predefine('sap/ui/integration/host/HostConfigurationCompiler',["sap/ui/thirdparty/less","sap/base/Log"],function(L,a){"use strict";var p=jQuery.sap.loadResource("sap/ui/integration/host/HostConfigurationMap.json",{dataType:"json"}),l=jQuery.sap.loadResource("sap/ui/integration/host/HostConfiguration.less",{dataType:"text"});
function b(u,t){return new Promise(function(r,e){jQuery.ajax({url:u,async:true,dataType:t,success:function(j){r(j);},error:function(){e();}});});}
function _(n,P){if(!P){return n;}var e=P.split("/"),i=0;if(!e[0]){n=n;i++;}while(n&&e[i]){n=n[e[i]];i++;}return n;}
function g(C,s){var m=p.less,P=[];for(var n in m){var M=m[n],v=_(C,M.path),u=M.unit;if(v){P.push(n+":"+v+(u?u:""));}else{P.push(n+": /*null*/");}}var r=l.replace(/\#hostConfigName/g,"."+s);r=r.replace(/\/\* HOSTCONFIG PARAMETERS \*\//,P.join(";\n")+";");var o=new L.Parser(),S="";o.parse(r,function(e,R){try{S=R.toCSS();}catch(f){S=" ";}});return S;}
function c(C,N){function e(C,v){var r=null;if(v.path){r=_(C,v.path);if(v.unit){v.unit=r+v.unit;}}else if(v.value){r=v.value;}else if(Array.isArray(v)){r=[];for(var i=0;i<v.length;i++){r.push(e(C,v[i]));}}return r;}var m=p[N],s={};for(var n in m){var M=m[n],o=n.split("/"),f=s;if(M){for(var i=0;i<o.length-1;i++){if(f[o[i]]===undefined){f[o[i]]={};}f=f[o[i]];}f[o[o.length-1]]=e(C,M);}}return s;}
function d(C,o){return b(C,"json").then(function(o){return g(o,o);});}
return{loadResource:b,generateCssText:g,generateCssTextAsync:d,generateJSONSettings:c};});
sap.ui.predefine('sap/ui/integration/library',["sap/ui/base/DataType","sap/ui/Global","sap/ui/core/library","sap/m/library","sap/f/library"],function(D){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.integration",version:"1.75.0",dependencies:["sap.ui.core","sap.f","sap.m"],types:["sap.ui.integration.CardActionType","sap.ui.integration.CardDataMode"],controls:["sap.ui.integration.widgets.Card","sap.ui.integration.Widget","sap.ui.integration.host.HostConfiguration"],elements:["sap.ui.integration.Host","sap.ui.integration.Extension"],customElements:{"card":"sap/ui/integration/customElements/CustomElementCard","widget":"sap/ui/integration/customElements/CustomElementWidget","host-configuration":"sap/ui/integration/customElements/CustomElementHostConfiguration"}});var t=sap.ui.integration;t.CardActionType={Navigation:"Navigation",Submit:"Submit"};t.CardDataMode={Active:"Active",Inactive:"Inactive"};return t;});
sap.ui.predefine('sap/ui/integration/services/Data',['./Service'],function(S){"use strict";var D=S.extend();
D.prototype.attachDataChanged=function(d,p){};
D.prototype.detachDataChanged=function(d){};
D.prototype.getData=function(i){return Promise.resolve(false);};
return D;});
sap.ui.predefine('sap/ui/integration/services/Navigation',['./Service'],function(S){"use strict";var N=S.extend();
N.prototype.navigate=function(c){};
S.prototype.enabled=function(c){return Promise.resolve(false);};
return N;});
sap.ui.predefine('sap/ui/integration/services/Service',[],function(){"use strict";var S=function(){};
S.extend=function(C){if(!C){var t=this;C=function(){t.apply(this,arguments);};}C.prototype=Object.create(this.prototype);C.prototype.constructor=C;C.extend=this.extend.bind(C);return C;};
S.prototype.getInterface=function(){return this;};
return S;});
sap.ui.predefine('sap/ui/integration/util/Manifest',["sap/ui/base/Object","sap/ui/core/Manifest","sap/base/util/deepClone","sap/base/util/isPlainObject","sap/base/Log","./ParameterMap"],function(B,C,d,a,L,P){"use strict";var M="/{SECTION}/configuration/parameters",b="/{SECTION}",A="/sap.app/dataSources";
var c=B.extend("sap.ui.integration.util.Manifest",{constructor:function(s,m,i){B.call(this);this.PARAMETERS=M.replace("{SECTION}",s);this.CONFIGURATION=b.replace("{SECTION}",s);if(m){var o={};o.process=false;if(i){o.baseUrl=i;this._sBaseUrl=i;}else{L.warning("If no base URL is provided when the manifest is an object static resources cannot be loaded.");}this._oManifest=new C(m,o);this.oJson=this._oManifest.getRawJson();}}});
c.prototype.getJson=function(){return this._unfreeze(this.oJson);};
c.prototype.get=function(s){return this._unfreeze(h(this.oJson,s));};
c.prototype.getUrl=function(){return this._oManifest.resolveUri("./","manifest");};
c.prototype.getResourceBundle=function(){return this.oResourceBundle;};
c.prototype._unfreeze=function(v){if(typeof v==="object"){return JSON.parse(JSON.stringify(v));}return v;};
c.prototype.destroy=function(){this.oJson=null;this.oResourceBundle=null;if(this._oManifest){this._oManifest.destroy();}};
c.prototype.load=function(s){if(!s||!s.manifestUrl){if(s&&s.processI18n===false){this.processManifest();return new Promise(function(i){i();});}if(this._sBaseUrl&&this._oManifest){return this.loadI18n().then(function(){this.processManifest();}.bind(this));}else{if(this._oManifest){this.processManifest();}return new Promise(function(i){i();});}}return C.load({manifestUrl:s.manifestUrl,async:true}).then(function(m){this._oManifest=m;this.oJson=this._oManifest.getRawJson();if(s&&s.processI18n===false){this.processManifest();return new Promise(function(i){i();});}return this.loadI18n().then(function(){this.processManifest();}.bind(this));}.bind(this));};
c.prototype.loadI18n=function(){return this._oManifest._loadI18n(true).then(function(o){this.oResourceBundle=o;}.bind(this));};
c.prototype.processManifest=function(o){var i=0,m=15,u=jQuery.extend(true,{},this._oManifest.getRawJson()),D=this.get(A);p(u,this.oResourceBundle,i,m,o,D);e(u);this.oJson=u;};
function e(o){if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.freeze(o);for(var k in o){if(o.hasOwnProperty(k)){e(o[k]);}}}}
function f(v){return(typeof v==="string")&&v.indexOf("{{")===0&&v.indexOf("}}")===v.length-2;}
function g(v){return(typeof v==="string")&&(v.indexOf("{{parameters.")>-1||v.indexOf("{{dataSources")>-1);}
c._processPlaceholder=function(s,o,D){var i=P.processPredefinedParameter(s),v,j;if(o){for(var k in o){v=o[k].value;j="{{parameters."+k;i=r(i,v,j);}}if(D){i=r(i,D,"{{dataSources");}return i;};
function r(s,v,i){if(a(v)){for(var j in v){s=r(s,v[j],i+"."+j);}}else if(s.includes(i+"}}")){s=s.replace(new RegExp(i+"}}",'g'),v);}return s;}
function p(o,R,i,m,j,D){if(i===m){return;}if(Array.isArray(o)){o.forEach(function(I,k,l){if(typeof I==="object"){p(I,R,i+1,m,j,D);}else if(g(I,o,j)){l[k]=c._processPlaceholder(I,j,D);}else if(f(I)&&R){l[k]=R.getText(I.substring(2,I.length-2));}},this);}else{for(var s in o){if(typeof o[s]==="object"){p(o[s],R,i+1,m,j,D);}else if(g(o[s],o,j)){o[s]=c._processPlaceholder(o[s],j,D);}else if(f(o[s])&&R){o[s]=R.getText(o[s].substring(2,o[s].length-2));}}}}
function h(o,s){if(o&&s&&typeof s==="string"&&s[0]==="/"){var j=s.substring(1).split("/"),k;for(var i=0,l=j.length;i<l;i++){k=j[i];o=o.hasOwnProperty(k)?o[k]:undefined;if(o===null||typeof o!=="object"){if(i+1<l&&o!==undefined){o=undefined;}break;}}return o;}return o&&o[s];}
c.prototype.processParameters=function(o){if(!this._oManifest){return;}var m=this.get(this.PARAMETERS);if(o&&!m){L.error("If parameters property is set, parameters should be described in the manifest");return;}var i=this._syncParameters(o,m);this.processManifest(i);};
c.prototype._syncParameters=function(o,m){if(!o){return m;}var k=d(m,20,20),l=Object.getOwnPropertyNames(o),n=Object.getOwnPropertyNames(k);for(var i=0;i<n.length;i++){for(var j=0;j<l.length;j++){if(n[i]===l[j]){k[n[i]].value=o[l[j]];}}}return k;};
return c;},true);
sap.ui.predefine('sap/ui/integration/util/ParameterMap',['sap/ui/core/Core'],function(C){"use strict";var P={};var p={"{{parameters.NOW_ISO}}":g,"{{parameters.TODAY_ISO}}":a,"{{parameters.LOCALE}}":b};
function g(){return new Date().toISOString();}
function a(){return new Date().toISOString().slice(0,10);}
function b(){return C.getConfiguration().getLocale().toString();}
P.processPredefinedParameter=function(s){var r;Object.keys(p).forEach(function(e){r=new RegExp(e,'g');if(s.indexOf(e)>-1){s=s.replace(r,p[e]());}});return s;};
return P;});
sap.ui.predefine('sap/ui/integration/util/ServiceManager',["sap/ui/base/EventProvider","sap/base/Log"],function(E,L){"use strict";
var S=E.extend("sap.ui.integration.util.ServiceManager",{
metadata:{library:"sap.ui.integration"},
constructor:function(s,o){if(!s){throw new Error("Missing manifest services reference!");}if(!o){throw new Error("Missing context object");}this._mServiceFactoryReferences=s;this._mServices={};this._oServiceContext=o;this._initAllServices();}
});
S.prototype._initAllServices=function(){for(var s in this._mServiceFactoryReferences){this._initService(s);}};
S.prototype._initService=function(n){var s=this._mServices[n]||{};s.promise=S._getService(this._oServiceContext,n,this._mServiceFactoryReferences).then(function(o){s.instance=o;}).catch(function(e){L.error(e.message);});this._mServices[n]=s;};
S.prototype.getService=function(s){var e="Invalid service";return new Promise(function(r,R){if(!s||!this._mServices[s]||!Object.keys(this._mServices[s])){R(e);return;}this._mServices[s].promise.then(function(){if(this._mServices[s].instance){r(this._mServices[s].instance);}else{R(e);}}.bind(this)).catch(R);}.bind(this));};
S.prototype.destroy=function(){this._mServices=null;};
S._getService=function(i,n,s){return new Promise(function(r,R){var o,f;if(i.bIsDestroyed){R(new Error("Service "+n+" could not be loaded as the requestor "+i.getMetadata().getName()+" was destroyed."));return;}if(!s){R(new Error("No Services declared"));return;}else{o=s[n];}if(!o||!o.factoryName){R(new Error("No Service '"+n+"' declared or factoryName missing"));return;}else{f=o.factoryName;}sap.ui.require(["sap/ui/core/service/ServiceFactoryRegistry"],function(a){var b=a.get(f);if(b){b.createInstance({scopeObject:i,scopeType:"component",settings:o.settings||{}}).then(function(c){if(c.getInterface){r(c.getInterface());}else{r(c);}}).catch(R);}else{var e=new Error("ServiceFactory '"+f+"' for Service '"+n+"' not found in ServiceFactoryRegistry");e._optional=o.optional;R(e);}});});};
return S;});
sap.ui.predefine('sap/ui/integration/util/Utils',[],function(){"use strict";var U={};
U.isJson=function(t){if(typeof t!=="string"){return false;}try{JSON.parse(t);return true;}catch(e){return false;}};
return U;});
sap.ui.predefine('sap/ui/integration/widgets/Card',["sap/ui/thirdparty/jquery","sap/ui/core/Core","sap/ui/core/Control","sap/ui/integration/util/Manifest","sap/ui/integration/util/ServiceManager","sap/base/Log","sap/f/cards/DataProviderFactory","sap/f/cards/NumericHeader","sap/f/cards/Header","sap/f/cards/BaseContent","sap/f/cards/IconFormatter","sap/f/cards/BindingHelper","sap/f/cards/CardActions","sap/f/cards/NumericSideIndicator","sap/m/HBox","sap/m/VBox","sap/ui/core/Icon","sap/m/Text","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","sap/base/util/LoaderExtensions","sap/f/CardRenderer","sap/f/library","sap/ui/integration/library","sap/ui/core/InvisibleText","sap/base/strings/formatMessage","sap/ui/integration/controls/ActionsToolbar"],function(q,C,a,b,S,L,D,N,H,B,I,c,d,e,f,V,g,T,J,R,h,i,l,j,k,m,A){"use strict";var M={TYPE:"/sap.card/type",DATA:"/sap.card/data",HEADER:"/sap.card/header",HEADER_POSITION:"/sap.card/headerPosition",CONTENT:"/sap.card/content",SERVICES:"/sap.ui5/services",APP_TYPE:"/sap.app/type",PARAMS:"/sap.card/configuration/parameters"};var n=l.cards.HeaderPosition;var o=l.cards.AreaType;var p=j.CardDataMode;
function r(F,t){if(F.parts&&F.translationKey&&F.parts.length===2){var u={parts:[F.translationKey,F.parts[0].toString(),F.parts[1].toString()],formatter:function(v,P,w){var x=P||F.parts[0];var y=w||F.parts[1];if(Array.isArray(P)){x=P.length;}if(Array.isArray(w)){y=w.length;}var z=parseFloat(x)||0;var E=parseFloat(y)||0;return m(v,[z,E]);}};t.bindProperty("statusText",u);}}
var s=a.extend("sap.ui.integration.widgets.Card",{
metadata:{library:"sap.ui.integration",interfaces:["sap.f.ICard"],properties:{manifest:{type:"any",defaultValue:""},parameters:{type:"object",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"auto"},dataMode:{type:"sap.ui.integration.CardDataMode",group:"Behavior",defaultValue:p.Active},baseUrl:{type:"sap.ui.core.URI",defaultValue:null}},aggregations:{_header:{type:"sap.f.cards.IHeader",multiple:false,visibility:"hidden"},_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},events:{action:{allowPreventDefault:true,parameters:{actionSource:{type:"sap.ui.core.Control"},manifestParameters:{type:"object"},type:{type:"sap.ui.integration.CardActionType"}}},manifestReady:{parameters:{}}},associations:{hostConfigurationId:{},host:{}}},
renderer:i
});
s.prototype.init=function(){this._ariaText=new k({id:this.getId()+"-ariaText"});this._oRb=C.getLibraryResourceBundle("sap.f");this.setModel(new J(),"parameters");this.setBusyIndicatorDelay(0);this._busyStates=new Map();};
s.prototype._initReadyState=function(){this._aReadyPromises=[];this._awaitEvent("_headerReady");this._awaitEvent("_contentReady");this._awaitEvent("_cardReady");this._oReadyPromise=Promise.all(this._aReadyPromises).then(function(){this._bReady=true;this.fireEvent("_ready");}.bind(this));};
s.prototype._clearReadyState=function(){this._bReady=false;this._aReadyPromises=[];this._oReadyPromise=null;};
s.prototype.onBeforeRendering=function(){var t=this.getHostConfigurationId();if(this.getDataMode()!==p.Active){return;}if(t){this.addStyleClass(t.replace(/-/g,"_"));}if(this._bApplyManifest){this._bApplyManifest=false;var v=this.getManifest();this._clearReadyState();this._initReadyState();if(!v){this.destroyManifest();}else{this.createManifest(v,this.getBaseUrl());}}};
s.prototype.setManifest=function(v){this.setProperty("manifest",v);this._bApplyManifest=true;return this;};
s.prototype.setParameters=function(v){this.setProperty("parameters",v);this._bApplyManifest=true;return this;};
s.prototype.createManifest=function(v,t){var O={};if(typeof v==="string"){O.manifestUrl=v;v=null;}this._startBusyState("applyManifest");this._oCardManifest=new b("sap.card",v,t);return this._oCardManifest.load(O).then(function(){this.fireManifestReady();this._applyManifest();}.bind(this)).catch(this._applyManifest.bind(this));};
s.prototype._applyManifest=function(){var P=this.getParameters();this._registerManifestModulePath();if(this._oCardManifest&&this._oCardManifest.getResourceBundle()){var t=new R({bundle:this._oCardManifest.getResourceBundle()});t.enhance(C.getLibraryResourceBundle("sap.ui.integration"));this.setModel(t,"i18n");}this._oCardManifest.processParameters(P);this._applyManifestSettings();};
s.prototype._awaitEvent=function(E){this._aReadyPromises.push(new Promise(function(t){this.attachEventOnce(E,function(){t();});}.bind(this)));};
s.prototype.isReady=function(){return this._bReady;};
s.prototype.refresh=function(){if(this.getDataMode()===p.Active){this._clearReadyState();this._initReadyState();this.destroyManifest();this._bApplyManifest=true;this.invalidate();}};
s.prototype.exit=function(){this.destroyManifest();this._busyStates=null;this._oRb=null;if(this._ariaText){this._ariaText.destroy();this._ariaText=null;}};
s.prototype.destroyManifest=function(){if(this._oCardManifest){this._oCardManifest.destroy();this._oCardManifest=null;}if(this._oServiceManager){this._oServiceManager.destroy();this._oServiceManager=null;}if(this._oDataProviderFactory){this._oDataProviderFactory.destroy();this._oDataProviderFactory=null;this._oDataProvider=null;}if(this._oTemporaryContent){this._oTemporaryContent.destroy();this._oTemporaryContent=null;}this.destroyAggregation("_header");this.destroyAggregation("_content");this._aReadyPromises=null;this._busyStates.clear();};
s.prototype._registerManifestModulePath=function(){if(!this._oCardManifest){return;}this._sAppId=this._oCardManifest.get("/sap.app/id");if(this._sAppId){h.registerResourcePath(this._sAppId.replace(/\./g,"/"),this._oCardManifest.getUrl());}else{L.error("Card sap.app/id entry in the manifest is mandatory");}};
s.prototype.getManifest=function(){var v=this.getProperty("manifest");if(v&&typeof v==="object"){return q.extend(true,{},v);}return v;};
s.prototype.getParameters=function(){var v=this.getProperty("parameters");if(v&&typeof v==="object"){return q.extend(true,{},v);}return v;};
s.prototype._applyManifestSettings=function(){var t=this._oCardManifest.get(M.APP_TYPE);if(t&&t!=="card"){L.error("sap.app/type entry in manifest is not 'card'");}if(this._oDataProviderFactory){this._oDataProviderFactory.destroy();}this._oDataProviderFactory=new D();this._applyServiceManifestSettings();this._applyDataManifestSettings();this._applyHeaderManifestSettings();this._applyContentManifestSettings();};
s.prototype._applyDataManifestSettings=function(){var t=this._oCardManifest.get(M.DATA);if(!t){this.fireEvent("_cardReady");return;}if(this._oDataProvider){this._oDataProvider.destroy();}this._oDataProvider=this._oDataProviderFactory.create(t,this._oServiceManager);if(this._oDataProvider){this._startBusyState("data");this.setModel(new J());this._oDataProvider.attachDataChanged(function(E){this.getModel().setData(E.getParameter("data"));}.bind(this));this._oDataProvider.attachError(function(E){this._handleError("Data service unavailable. "+E.getParameter("message"));}.bind(this));this._oDataProvider.triggerDataUpdate().then(function(){this.fireEvent("_cardReady");this._endBusyState("data");}.bind(this));}};
s.prototype._applyServiceManifestSettings=function(){var t=this._oCardManifest.get(M.SERVICES);if(!t){return;}if(!this._oServiceManager){this._oServiceManager=new S(t,this);}};
s.prototype.getCardHeader=function(){return this.getAggregation("_header");};
s.prototype.getCardHeaderPosition=function(){if(!this._oCardManifest){return"Top";}return this._oCardManifest.get(M.HEADER_POSITION)||n.Top;};
s.prototype.getCardContent=function(){return this.getAggregation("_content");};
s.prototype._applyHeaderManifestSettings=function(){var t=this._oCardManifest.get(M.HEADER),u,P,v;if(!t){this.fireEvent("_headerReady");return;}u=this._createHeader(t);v=this._createActionsToolbar();if(v){u.setToolbar(v);}P=this.getAggregation("_header");if(P){P.destroy();}this.setAggregation("_header",u);if(u.isReady()){this.fireEvent("_headerReady");}else{u.attachEvent("_ready",function(){this.fireEvent("_headerReady");}.bind(this));}};
s.prototype._createHeader=function(t){var u,v=this._oServiceManager,w=this._oDataProviderFactory,x=this._sAppId,y=new d({card:this,areaType:o.Header}),z={title:t.title,subtitle:t.subTitle};if(t.status&&typeof t.status.text==="string"){z.statusText=t.status.text;}switch(t.type){case"Numeric":q.extend(z,{unitOfMeasurement:t.unitOfMeasurement,details:t.details,sideIndicators:t.sideIndicators});if(t.mainIndicator){z.number=t.mainIndicator.number;z.scale=t.mainIndicator.unit;z.trend=t.mainIndicator.trend;z.state=t.mainIndicator.state;}z=c.createBindingInfos(z);if(t.sideIndicators){z.sideIndicators=z.sideIndicators.map(function(E){return new e(E);});}u=new N(z);break;default:if(t.icon){z.iconSrc=t.icon.src;z.iconDisplayShape=t.icon.shape;z.iconInitials=t.icon.text;}z=c.createBindingInfos(z);if(z.iconSrc){z.iconSrc=c.formattedProperty(z.iconSrc,function(E){return I.formatSrc(E,x);});}u=new H(z);break;}if(t.status&&t.status.text&&t.status.text.format){r(t.status.text.format,u);}u._sAppId=x;u.setServiceManager(v);u.setDataProviderFactory(w);u._setData(t.data);u._setAccessibilityAttributes(t);y.attach(t,u);u._oActions=y;return u;};
s.prototype.getHostInstance=function(){var t=this.getHost();if(!t){return null;}return C.byId(t);};
s.prototype._createActionsToolbar=function(){var t=this.getHostInstance(),u,v;if(!t){return null;}u=new A();v=u.createToolbar(t,this);if(v){return u;}return null;};
s.prototype._applyContentManifestSettings=function(){var t=this._oCardManifest.get(M.TYPE),u=t&&t.toLowerCase()==="component",v=this._oCardManifest.get(M.CONTENT),w=!!v,x=t+" "+this._oRb.getText("ARIA_ROLEDESCRIPTION_CARD");this._ariaText.setText(x);if(w&&!t){L.error("Card type property is mandatory!");this.fireEvent("_contentReady");return;}if(!w&&!u){this._endBusyState("applyManifest");this.fireEvent("_contentReady");return;}if(!v&&u){v=this._oCardManifest.getJson();}this._setTemporaryContent();B.create(t,v,this._oServiceManager,this._oDataProviderFactory,this._sAppId).then(function(y){this._setCardContent(y);}.bind(this)).catch(function(E){this._handleError(E);}.bind(this)).finally(function(){this._endBusyState("applyManifest");}.bind(this));};
s.prototype.onAfterRendering=function(){var t;if(this._oCardManifest&&this._oCardManifest.get(M.TYPE)){t=this._oCardManifest.get(M.TYPE).toLowerCase();}if(t==="analytical"){this.$().addClass("sapFCardAnalytical");}};
s.prototype._setCardContent=function(t){var u=t.getActions();if(u){u.setCard(this);}t.attachEvent("_error",function(E){this._handleError(E.getParameter("logMessage"),E.getParameter("displayMessage"));}.bind(this));t.setBusyIndicatorDelay(0);var P=this.getAggregation("_content");if(P&&P!==this._oTemporaryContent){P.destroy();}this.setAggregation("_content",t);if(t.isReady()){this.fireEvent("_contentReady");}else{t.attachEvent("_ready",function(){this.fireEvent("_contentReady");}.bind(this));}};
s.prototype._setTemporaryContent=function(){var t=this._getTemporaryContent(),P=this.getAggregation("_content");if(P&&P!==t){P.destroy();}this.setAggregation("_content",t);};
s.prototype._handleError=function(t,u){L.error(t);this._endBusyStateAll();this.fireEvent("_error",{message:t});var v="Unable to load the data.",E=u||v,w=this._getTemporaryContent(),P=this.getAggregation("_content");var x=new V({justifyContent:"Center",alignItems:"Center",items:[new g({src:"sap-icon://message-error",size:"1rem"}).addStyleClass("sapUiTinyMargin"),new T({text:E})]});if(P&&P!==w){P.destroy();this.fireEvent("_contentReady");}w.setBusy(false);w.addItem(x);this.setAggregation("_content",w);};
s.prototype._getTemporaryContent=function(){if(!this._oTemporaryContent){this._oTemporaryContent=new f({justifyContent:"Center",busyIndicatorDelay:0,busy:true});this._oTemporaryContent.addStyleClass("sapFCardTemporaryContent");this._oTemporaryContent.addEventDelegate({onAfterRendering:function(){if(!this._oCardManifest){return;}var t=this._oCardManifest.get(M.TYPE)+"Content",u=this._oCardManifest.get(M.CONTENT),v=B.getMinHeight(t,u,this._oTemporaryContent);if(this.getHeight()==="auto"){this._oTemporaryContent.$().css({"min-height":v});}}},this);}this._oTemporaryContent.destroyItems();return this._oTemporaryContent;};
s.prototype._startBusyState=function(t){this._busyStates.set(t,true);this.setBusy(true);};
s.prototype._endBusyState=function(t){this._busyStates.delete(t);if(!this._busyStates.size){this.setBusy(false);}};
s.prototype._endBusyStateAll=function(){this._busyStates.clear();this.setBusy(false);};
s.prototype.setDataMode=function(t){if(this._oDataProviderFactory&&t===p.Inactive){this._oDataProviderFactory.destroy();this._oDataProviderFactory=null;}this.setProperty("dataMode",t,true);if(this.getProperty("dataMode")===p.Active){this.refresh();}return this;};
s.prototype.loadDesigntime=function(){if(!this._oCardManifest){return Promise.reject("Manifest not yet available");}var t=this._oCardManifest.get("/sap.app/id");if(!t){return Promise.reject("App id not maintained");}var u=t.replace(/\./g,"/");return new Promise(function(v,w){var x=u+"/"+(this._oCardManifest.get("/sap.card/designtime")||"designtime/Card.designtime");if(x){sap.ui.require([x,"sap/base/util/deepClone"],function(y,z){v({designtime:y,manifest:z(this._oCardManifest._oManifest.getRawJson(),30)});}.bind(this),function(){w({error:x+" not found"});});}else{w();}}.bind(this));};
return s;});
sap.ui.require.preload({
	"sap/ui/integration/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ui.integration","type":"library","embeds":[],"applicationVersion":{"version":"1.75.0"},"title":"SAPUI5 library with integration-related controls.","description":"SAPUI5 library with integration-related controls.","ach":"CA-UI5-CTR","resources":"resources.json","offline":true,"openSourceComponents":[{"name":"webcomponentsjs","packagedWithMySelf":true,"version":"0.0.0"},{"name":"custom-event-polyfill","packagedWithMySelf":true,"version":"0.0.0"},{"name":"adaptive-cards","packagedWithMySelf":true,"version":"0.0.0"},{"name":"ui5-web-components","packagedWithMySelf":true,"version":"0.0.0"},{"name":"ajv","packagedWithMySelf":true,"version":"0.0.0"}]},"sap.ui":{"technology":"UI5","supportedThemes":["base"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.75","libs":{"sap.ui.core":{"minVersion":"1.75.0"},"sap.f":{"minVersion":"1.75.0"}}},"library":{"i18n":"messagebundle.properties","content":{"controls":["sap.ui.integration.widgets.Card","sap.ui.integration.Widget","sap.ui.integration.host.HostConfiguration"],"elements":["sap.ui.integration.Host","sap.ui.integration.Extension"],"types":["sap.ui.integration.CardActionType","sap.ui.integration.CardDataMode"]}}}}',
	"sap/ui/integration/customElements/CustomElementCard.js":function(){sap.ui.require(["sap/ui/integration/widgets/Card","sap/ui/integration/customElements/CustomElementBase","sap/ui/integration/customElements/CustomElementHostConfiguration"],function(C,a){"use strict";var b=a.extend(C,{privateProperties:["width","height"]});b.prototype.refresh=function(){this._getControl().refresh();};b.prototype.loadDesigntime=function(){return this._getControl().loadDesigntime();};var d=["ui-integration-host-configuration"];a.define("ui-integration-card",b,d);});
},
	"sap/ui/integration/customElements/CustomElementHostConfiguration.js":function(){sap.ui.require(["sap/ui/integration/customElements/CustomElementBase","sap/ui/integration/host/HostConfiguration"],function(C,H){"use strict";var a=C.extend(H);C.define("ui-integration-host-configuration",a,[]);});
},
	"sap/ui/integration/customElements/CustomElementWidget.js":function(){sap.ui.require(["sap/ui/integration/customElements/CustomElementBase","sap/ui/integration/Widget"],function(C,W){"use strict";var a=C.extend(W);a.prototype.loadDesigntime=function(){return this._getControl().loadDesigntime();};C.define("ui-integration-widget",a,[]);});
},
	"sap/ui/integration/library-bootstrap.js":function(){(function(w){"use strict";var c;var s=document.currentScript||document.querySelector("script[src*='/sap-ui-integration.js']");
function b(){if(w.sap&&w.sap.ui&&w.sap.ui.getCore){c=w.sap.ui.getCore();return a();}w.sap.ui.require(['sap/ui/core/Core'],function(C){C.boot();c=C;C.attachInit(function(){a();});});}
function r(l){var L=c.getLoadedLibraries()[l];var t=Object.keys(L.customElements),T=s.getAttribute("tags");if(T){t=T.split(",");}w.sap.ui.require(t.map(function(o,i){return L.customElements[t[i]];}));}
function a(){c.loadLibraries(["sap/ui/integration"],{async:true}).then(function(){r("sap.ui.integration");});}
b();})(window);
},
	"sap/ui/integration/sap-ui-integration-config.js":function(){window["sap-ui-config"]=window["sap-ui-config"]||{};window["sap-ui-config"].bindingSyntax="complex";window["sap-ui-config"].compatVersion="edge";window["sap-ui-config"].async=true;window["sap-ui-config"]["xx-waitForTheme"]=true;
},
	"sap/ui/integration/sap-ui-integration-define-nojQuery.js":function(){(function(){"use strict";sap["ui"].define("sap/ui/thirdparty/jquery",function(){return jQuery;});sap["ui"].define("sap/ui/thirdparty/jqueryui/jquery-ui-position",function(){return jQuery;});})();
}
},"sap/ui/integration/library-preload"
);
//# sourceMappingURL=library-preload.js.map