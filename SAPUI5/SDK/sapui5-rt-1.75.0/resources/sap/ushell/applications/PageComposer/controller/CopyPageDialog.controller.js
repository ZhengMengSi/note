// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/model/json/JSONModel","./BaseDialog.controller","sap/base/util/merge"],function(J,B,m){"use strict";return B.extend("sap.ushell.applications.PageComposer.controller.CopyPageDialog",{constructor:function(v,r){this._oView=v;this._oModel=new J({validation:{id:false}});this.sViewId="copyPageDialog";this.sId="sap.ushell.applications.PageComposer.view.CopyPageDialog";this._oResourceBundle=r;},onConfirm:function(){var M=this.getModel(),r={targetId:M.getProperty("/targetId"),sourceId:M.getProperty("/sourceId"),title:M.getProperty("/title"),description:M.getProperty("/description")};if(this._fnConfirm){this._fnConfirm(r);}},_resetModel:function(M){M.setProperty("/targetId","");M.setProperty("/sourceId","");M.setProperty("/title","");M.setProperty("/description","");var v=m({},M.getProperty("/validation"),{id:false});M.setProperty("/validation",v);},onBeforeOpen:function(){var f=this._oView.byId("copyPageDialog");sap.ui.getCore().getMessageManager().registerObject(f,true);this._resetModel(f.getModel());}});});