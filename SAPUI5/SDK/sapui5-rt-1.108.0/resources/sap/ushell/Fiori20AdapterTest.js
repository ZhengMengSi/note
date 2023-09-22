// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/UriParameters","sap/ui/core/UIComponent","sap/ushell/Fiori20Adapter","sap/ui/core/library","sap/ui/core/service/ServiceFactoryRegistry","sap/base/Log","sap/base/util/Version","sap/base/util/isEmptyObject"],function(e,i,t,a,n,r,s,o){"use strict";var u={I_DEFAULT_SEARCH_DEPTH:5,B_DEFAULT_LATE_ADAPTATION:false,S_FIORI20ADAPTER_URL_PARAM_NAME:"sap-ui-xx-fiori2Adaptation",S_FIORI20ADAPTER_METADATA_PARAM_NAME:"sapFiori2Adaptation",A_ALLOWLIST:["fin.*","ssuite.fin.*","fscm.*","sap.fin.*","cus.sd.*","cus.o2c.*","sap.apf.*","tl.ibp.*","ux.fnd.apf.o2c.*","fnd.apf.*","fnd.pob.o2c.*","fcg.sll.*","ux.fnd.generic-apf-application.*","hpa.cei.*","query.viewbrowser.s1.*","ssuite.vdm.viewbrowser.s1.*","ssuite.smartbusiness.kpi.s1.*","ssuite.smartbusiness.evaluation.s1.*","ssuite.smartbusiness.association.s1.*","ssuite.smartbusiness.drilldown.s1.*","ssuite.smartbusiness.tile.s1.*","ssuite.smartbusiness.tile.ce.s1.*","ssuite.smartbusiness.workspace.s1.*","ssuite.smartbusiness.runtime.s1.*","gs.fin.customersummarycn.display.*","gs.fin.financialstatement.structure.manage.*","gs.fin.financialstatement.display.*","uipsm.*","publicservices.her.*"],getConfiguration:function(e){var i=this._getURLParamConfiguration();if(!i){i=this._getMetadataConfiguration(e)}if(!i){i=this._getDefaultConfiguration(e)}i.iSearchDepth=i.iSearchDepth||u.I_DEFAULT_SEARCH_DEPTH;if(typeof i.iSearchDepth==="string"&&!isNaN(i.iSearchDepth)){i.iSearchDepth=parseInt(i.iSearchDepth,10)}return i},_getURLParamConfiguration:function(){if(typeof sap.ui.getCore().getConfiguration().getFiori2Adaptation!=="function"){return}if(!this._isURLParameterSpecified(u.S_FIORI20ADAPTER_URL_PARAM_NAME)){return}var e=sap.ui.getCore().getConfiguration().getFiori2Adaptation(),i,t;if(typeof e==="boolean"){i=e}else if(e&&e.length>=1){t=e}if(!t&&i===undefined){return}return{bStylePage:t?t.indexOf("style")>-1:i,bMoveTitle:t?t.indexOf("title")>-1:i,bHideBackButton:t?t.indexOf("back")>-1:i,bCollapseHeader:t?t.indexOf("collapse")>-1:i,bHierarchy:t?t.indexOf("hierarchy")>-1:i}},_getMetadataConfiguration:function(e){var i=e.getMetadata("config").getConfig(u.S_FIORI20ADAPTER_METADATA_PARAM_NAME),t,a;if(typeof i==="boolean"){t=i}else if(typeof i==="object"&&!o(i)){a=i}if(!a&&t===undefined){return}return{bStylePage:a?this._isSgnTrue(a.style):t,bMoveTitle:a?this._isSgnTrue(a.title):t,bHideBackButton:a?this._isSgnTrue(a.back):t,bCollapseHeader:a?this._isSgnTrue(a.collapse):t,bHierarchy:a?this._isSgnTrue(a.hierarchy):t,bLateAdaptation:a?this._isSgnTrue(a.lateAdaptation):u.B_DEFAULT_LATE_ADAPTATION}},_getDefaultConfiguration:function(e){var i=this._hasMinVersionSmallerThan(e,"1.42")&&this._isAllowed(e);return{bStylePage:i,bMoveTitle:i,bHideBackButton:i,bCollapseHeader:i,bHierarchy:i}},_isURLParameterSpecified:function(i){var t=new e(window.location.href),a=t.mParams&&t.mParams[i];return a&&a.length>0},_isAllowed:function(e){var i=e.getMetadata().getName();for(var t=0;t<u.A_ALLOWLIST.length;t++){var a=u.A_ALLOWLIST[t].substring(0,u.A_ALLOWLIST[t].length-2);if(this._isPrefixedString(i,a)){return true}}return false},_isAdaptationRequired:function(e){for(var i in e){if(e[i]===true){return true}}return false},_isPrefixedString:function(e,i){return e&&i&&e.substring(0,i.length)===i},_hasMinVersionSmallerThan:function(e,i){var t=e.getMetadata().getManifestEntry("sap.ui5"),a=true;if(t&&t.dependencies&&t.dependencies.minUI5Version){var n=new s(t.dependencies.minUI5Version);a=n.compareTo(new s(i))<0}return a},_isSgnTrue:function(e){return e===true||e==="true"}};i._fnOnInstanceInitialized=function(e){var i=e.getAggregation("rootControl");if(!i||i.getId()==="navContainerFlp"||e.getId().indexOf("application-")!==0){return}var s=u.getConfiguration(e);if(!u._isAdaptationRequired(s)){return}if(!a.service||!n||typeof n.get!=="function"){r.warning("Fiori20Adapter not loaded because static FactoryRegistry is not available","sap.ui.core.service.ServiceFactoryRegistry should be a function","sap.ushell.Fiori20AdapterTest");return}var o={onBeforeRendering:function(){i.removeEventDelegate(o);var a=n.get("sap.ushell.ui5service.ShellUIService"),u=a&&a.createInstance();if(!a||!u){r.warning("Fiori20Adapter not loaded because ShellUIService is not available","sap.ushell.ui5service.ShellUIService should be declared by configuration","sap.ushell.Fiori20AdapterTest");return}u.then(function(a){if(a&&a.getUxdVersion()===2){t.applyTo(i,e,s,a)}},function(e){r.warning("Fiori20Adapter not loaded as ShellUIService is not available",e,"sap.ushell.Fiori20AdapterTest")})}};i.addEventDelegate(o)}});
//# sourceMappingURL=Fiori20AdapterTest.js.map