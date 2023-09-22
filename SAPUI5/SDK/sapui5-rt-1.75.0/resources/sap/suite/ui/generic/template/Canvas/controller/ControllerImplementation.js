sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/suite/ui/generic/template/detailTemplates/detailUtils","sap/suite/ui/generic/template/Canvas/extensionAPI/ExtensionAPI","sap/base/util/extend"],function(C,d,E,e){"use strict";return{getMethods:function(v,t,c){var b=d.getControllerBase(v,t,c);var o={onInit:function(){var a=c.getOwnerComponent();var r=a.getRequiredControls();b.onInit(r);},handlers:{},extensionAPI:new E(t,c,b)};o.handlers=e(b.handlers,o.handlers);v.onComponentActivate=b.onComponentActivate;v.getCurrentState=function(){var r=Object.create(null);var i=true;var s=function(a,f){if(!(a instanceof C)){throw new Error("State must always be set with respect to a ControllerExtension");}if(!i){throw new Error("State must always be provided synchronously");}var g=a.getMetadata().getNamespace();if(f){for(var h in f){r["$extension$"+g+"$"+h]=f[h];}}};c.templateBaseExtension.provideExtensionStateData(s);i=false;return r;};v.applyState=function(s,i){var m=Object.create(null);var I=true;var g=function(a){if(!(a instanceof C)){throw new Error("State must always be retrieved with respect to a ControllerExtension");}if(!I){throw new Error("State must always be restored synchronously");}var f=a.getMetadata().getNamespace();return m[f];};c.templateBaseExtension.restoreExtensionStateData(g,i);I=false;};return o;}};});