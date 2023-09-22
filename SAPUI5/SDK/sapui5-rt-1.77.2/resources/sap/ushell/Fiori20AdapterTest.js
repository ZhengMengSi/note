// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/UriParameters","sap/ui/core/UIComponent","sap/ushell/Fiori20Adapter","sap/ui/core/library","sap/ui/core/service/ServiceFactoryRegistry"],function(U,a,F,c,S){"use strict";var b={I_DEFAULT_SEARCH_DEPTH:5,B_DEFAULT_LATE_ADAPTATION:false,S_FIORI20ADAPTER_URL_PARAM_NAME:"sap-ui-xx-fiori2Adaptation",S_FIORI20ADAPTER_METADATA_PARAM_NAME:"sapFiori2Adaptation",A_WHITELIST:["fin.*","ssuite.fin.*","fscm.*","sap.fin.*","cus.sd.*","cus.o2c.*","sap.apf.*","tl.ibp.*","ux.fnd.apf.o2c.*","fnd.apf.*","fnd.pob.o2c.*","fcg.sll.*","ux.fnd.generic-apf-application.*","hpa.cei.*","query.viewbrowser.s1.*","ssuite.vdm.viewbrowser.s1.*","ssuite.smartbusiness.kpi.s1.*","ssuite.smartbusiness.evaluation.s1.*","ssuite.smartbusiness.association.s1.*","ssuite.smartbusiness.drilldown.s1.*","ssuite.smartbusiness.tile.s1.*","ssuite.smartbusiness.tile.ce.s1.*","ssuite.smartbusiness.workspace.s1.*","ssuite.smartbusiness.runtime.s1.*","gs.fin.customersummarycn.display.*","gs.fin.financialstatement.structure.manage.*","gs.fin.financialstatement.display.*","uipsm.*","publicservices.her.*"],getConfiguration:function(C){var o=this._getURLParamConfiguration();if(!o){o=this._getMetadataConfiguration(C);}if(!o){o=this._getDefaultConfiguration(C);}o.iSearchDepth=o.iSearchDepth||b.I_DEFAULT_SEARCH_DEPTH;if((typeof o.iSearchDepth==="string")&&!isNaN(o.iSearchDepth)){o.iSearchDepth=parseInt(o.iSearchDepth,10);}return o;},_getURLParamConfiguration:function(){if(typeof sap.ui.getCore().getConfiguration().getFiori2Adaptation!=="function"){return;}if(!this._isURLParameterSpecified(b.S_FIORI20ADAPTER_URL_PARAM_NAME)){return;}var u=sap.ui.getCore().getConfiguration().getFiori2Adaptation(),d,s;if(typeof(u)==="boolean"){d=u;}else if(u&&(u.length>=1)){s=u;}if(!s&&(d===undefined)){return;}return{bStylePage:s?s.indexOf("style")>-1:d,bMoveTitle:s?s.indexOf("title")>-1:d,bHideBackButton:s?s.indexOf("back")>-1:d,bCollapseHeader:s?s.indexOf("collapse")>-1:d,bHierarchy:s?s.indexOf("hierarchy")>-1:d};},_getMetadataConfiguration:function(C){var A=C.getMetadata("config").getConfig(b.S_FIORI20ADAPTER_METADATA_PARAM_NAME),d,e;if(typeof(A)==="boolean"){d=A;}else if((typeof A==="object")&&!jQuery.isEmptyObject(A)){e=A;}if(!e&&(d===undefined)){return;}return{bStylePage:e?this._isSgnTrue(e.style):d,bMoveTitle:e?this._isSgnTrue(e.title):d,bHideBackButton:e?this._isSgnTrue(e.back):d,bCollapseHeader:e?this._isSgnTrue(e.collapse):d,bHierarchy:e?this._isSgnTrue(e.hierarchy):d,bLateAdaptation:e?this._isSgnTrue(e.lateAdaptation):b.B_DEFAULT_LATE_ADAPTATION};},_getDefaultConfiguration:function(C){var e=this._hasMinVersionSmallerThan(C,"1.42")&&this._isWhitelisted(C);return{bStylePage:e,bMoveTitle:e,bHideBackButton:e,bCollapseHeader:e,bHierarchy:e};},_isURLParameterSpecified:function(p){var u=new U(window.location.href),A=u.mParams&&u.mParams[p];return A&&(A.length>0);},_isWhitelisted:function(C){var s=C.getMetadata().getName();for(var i=0;i<b.A_WHITELIST.length;i++){var n=b.A_WHITELIST[i].substring(0,b.A_WHITELIST[i].length-2);if(this._isPrefixedString(s,n)){return true;}}return false;},_isAdaptationRequired:function(A){for(var o in A){if(A[o]===true){return true;}}return false;},_isPrefixedString:function(s,p){return s&&p&&(s.substring(0,p.length)===p);},_hasMinVersionSmallerThan:function(C,v){var i=C.getMetadata().getManifestEntry("sap.ui5"),m=true;if(i&&i.dependencies&&i.dependencies.minUI5Version){var M=new jQuery.sap.Version(i.dependencies.minUI5Version);m=M.compareTo(new jQuery.sap.Version(v))<0;}return m;},_isSgnTrue:function(v){return(v===true)||(v==="true");}};a._fnOnInstanceInitialized=function(C){var o=C.getAggregation("rootControl");if(!o||o.getId()==="navContainerFlp"||C.getId().indexOf("application-")!==0){return;}var d=b.getConfiguration(C);if(!b._isAdaptationRequired(d)){return;}if(!c.service||!S||typeof S.get!=="function"){jQuery.sap.log.warning("Fiori20Adapter not loaded because static FactoryRegistry is not available","sap.ui.core.service.ServiceFactoryRegistry should be a function","sap.ushell.Fiori20AdapterTest");return;}var D={onBeforeRendering:function(){o.removeEventDelegate(D);var s=S.get("sap.ushell.ui5service.ShellUIService"),e=s&&s.createInstance();if(!s||!e){jQuery.sap.log.warning("Fiori20Adapter not loaded because ShellUIService is not available","sap.ushell.ui5service.ShellUIService should be declared by configuration","sap.ushell.Fiori20AdapterTest");return;}e.then(function(s){if(s&&(s.getUxdVersion()===2)){F.applyTo(o,C,d,s);}},function(E){jQuery.sap.log.warning("Fiori20Adapter not loaded as ShellUIService is not available",E,"sap.ushell.Fiori20AdapterTest");});}};o.addEventDelegate(D);};});