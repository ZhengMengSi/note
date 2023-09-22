// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/ObjectPath","sap/ui/model/odata/v2/ODataModel","sap/ushell/resources","sap/ushell/utils/clone"],function(O,a,r,c){"use strict";function g(){var s=(window["sap-ushell-config"].services&&window["sap-ushell-config"].services.PagePersistence)||{};return(O.get("config.serviceUrl",s.adapter)||"").replace(/\/?$/,"/");}var o=new a({serviceUrl:g(),headers:{"sap-language":sap.ushell.Container.getUser().getLanguage(),"sap-client":sap.ushell.Container.getLogonSystem().getClient()},defaultCountMode:"None",skipMetadataAnnotationParsing:true,useBatch:false});var m=new Promise(function(b,d){o.attachMetadataLoaded(b);o.attachMetadataFailed(d);});var P=function(){this.S_COMPONENT_NAME="sap.ushell_abap.adapters.abap.PagePersistenceAdapter";};P.prototype.getODataModel=function(){return o;};P.prototype.getMetadataPromise=function(){return m;};P.prototype.getPage=function(p){return this._readPage(p).then(this._convertODataToReferencePage).catch(this._rejectWithError.bind(this));};P.prototype.getPages=function(p){return this._readPages(p).then(function(b){return b.results.map(this._convertODataToReferencePage);}.bind(this)).catch(this._rejectWithError.bind(this));};P.prototype._readPage=function(p){return this.getMetadataPromise().then(function(){return new Promise(function(b,d){this.getODataModel().read("/pageSet('"+encodeURIComponent(p)+"')",{urlParameters:{"$expand":"sections/tiles"},success:b,error:d});}.bind(this));}.bind(this));};P.prototype._readPages=function(p){return this.getMetadataPromise().then(function(){return new Promise(function(b,d){sap.ui.define(["sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(F,e){var f=[],h;for(var i=0;i<p.length;i++){h=new F({path:"id",operator:e.EQ,value1:p[i],and:false});f.push(h);}return this.getODataModel().read("/pageSet",{urlParameters:{"$expand":"sections/tiles"},filters:f,success:b,error:d});}.bind(this));}.bind(this));}.bind(this));};P.prototype._convertODataToReferencePage=function(p){var b=c(p);delete b.__metadata;if(b.sections&&b.sections.results){b.sections=b.sections.results;b.sections.forEach(function(s){delete s.__metadata;s.visualizations=s.tiles.results;delete s.tiles;s.visualizations.forEach(function(v){delete v.__metadata;v.vizId=v.catalogTile;v.inboundPermanentKey=v.targetMapping;});});}if(!b.createdByFullname&&b.createdBy){b.createdByFullname=b.createdBy;}if(!b.modifiedByFullname&&b.modifiedBy){b.modifiedByFullname=b.modifiedBy;}return b;};P.prototype._rejectWithError=function(e){var E={component:this.S_COMPONENT_NAME,description:r.i18n.getText("PagePersistenceAdapter.CannotLoadPage"),detail:e};return Promise.reject(E);};return P;},true);