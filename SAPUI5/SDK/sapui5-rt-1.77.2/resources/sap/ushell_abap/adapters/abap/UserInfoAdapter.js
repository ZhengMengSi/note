// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui2/srvc/ODataWrapper","sap/ui2/srvc/ODataService","sap/ui/thirdparty/datajs","sap/ui/thirdparty/jquery","sap/base/Log"],function(O,a,b,q,L){"use strict";var d;return function(){this._updateODataObjectBasedOnDatatype=function(v,D){if(q.type(v)==="string"){D.value=v.toString();D.dataType="Edm.String";}if(q.type(v)==="boolean"){D.value=v.toString();D.dataType="Edm.Boolean";}return D;};this.getThemeList=function(){var D=new q.Deferred(),u="/sap/opu/odata/UI2/INTEROP/Themes";b.read({requestUri:u},function(o,r){var i,t=[];for(i=0;i<o.results.length;i=i+1){t.push(o.results[i]);}D.resolve({options:t});},function(e){L.error(e.message,null,"sap.ushell_abap.adapters.abap.UserInfoAdapter");D.reject(e.message);});return D.promise();};this._createWrapper=function(B){return sap.ui2.srvc.createODataWrapper(B,false,function(e){});};this.updateUserPreferences=function(u){var t=this,D,r,U,o,c,s=function(){o-=1;if(o===0){D.resolve();}},f=function(e){D.reject(e);};d=this._createWrapper("/sap/opu/odata/UI2/INTEROP/");D=new q.Deferred();d.openBatchQueue();U=u.getChangedProperties()||[];o=U.length;U.forEach(function(e){r="UserProfileProperties("+["id='"+e.name+"'","shellType='FLP')"].join(",");c={id:e.name,shellType:"FLP",value:e.newValue};t._updateODataObjectBasedOnDatatype(e.newValue,c);d.put(r,c,s,f);});d.submitBatchQueue(function(){if(o===0){D.resolve();}},f);return D.promise();};};},true);