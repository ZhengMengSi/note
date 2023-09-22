// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/tiles/generic","sap/ushell/components/tiles/indicatorTileUtils/cache","sap/m/library","sap/ui/thirdparty/jquery","sap/base/Log"],function(g,a,m,q,L){"use strict";var D=m.DeviationIndicator;var V=m.ValueColor;var S=m.Size;var b=m.LoadState;var F=m.FrameType;var C=g.extend("sap.ushell.components.tiles.indicatorcontribution.ContributionTile",{onInit:function(){this.KPI_VALUE_REQUIRED=false;},_processDataForComparisonChart:function(d,f,h,u){var s=this.oConfig.TILE_PROPERTIES.semanticColorContribution;var j=[];var t;var k;for(var i=0;i<d.results.length;i++){var l=d.results[i];var n={};try{n.title=l[h].toString();}catch(e){n.title="";}n.value=Number(l[f]);var o=Number(l[f]);if(this.oConfig.EVALUATION.SCALING===-2){o*=100;}var c=this.isCurrencyMeasure(f);k=l[u];t=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(o,this.oConfig.EVALUATION.SCALING,this.oConfig.EVALUATION.DECIMAL_PRECISION,c,k);n.displayValue=t.toString();if(typeof s==="undefined"){n.color="Neutral";}else{n.color=s;}if(n&&u){n[u]=k;}j.push(n);}return j;},fetchChartData:function(r,i,s,E){var t=this;try{var c=this.oConfig.EVALUATION.ODATA_ENTITYSET,d;t.setThresholdValues();if(this.oConfig.TILE_PROPERTIES.semanticMeasure){d=this.oConfig.EVALUATION.COLUMN_NAME+","+this.oConfig.TILE_PROPERTIES.semanticMeasure;}else{d=this.oConfig.EVALUATION.COLUMN_NAME;}var u=null;var f=this.oConfig.TILE_PROPERTIES.dimension;var h=sap.ushell.components.tiles.indicatorTileUtils.util.getBoolValue(r);var j=a.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){if(j){var k=j.Data&&JSON.parse(j.Data);}}var l=t.oTileApi.configuration.getParameterValueAsString("timeStamp");var n=sap.ushell.components.tiles.indicatorTileUtils.util.isCacheValid(t.oConfig.TILE_PROPERTIES.id,l,t.chipCacheTime,t.chipCacheTimeUnit,t.tilePressed);if((k&&!k.rightData)||!j||(!n&&t.oTileApi.visible.isVisible())||h||(i&&t.oTileApi.visible.isVisible())||t.getView().getViewData().refresh){if(t.kpiValueFetchDeferred){t.kpiValueFetchDeferred=false;var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);var o={};o["0"]=d+",asc";o["1"]=d+",desc";o["2"]=f+",asc";o["3"]=f+",desc";var p=o[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");var w=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oRunTimeODataModel,c,d,f,v,3);if(this.oConfig.TILE_PROPERTIES.semanticMeasure){w.uri+="&$top=3&$orderby="+p[0]+" "+p[2];}else{w.uri+="&$top=3&$orderby="+p[0]+" "+p[1];}this.comparisionChartODataRef=w.model.read(w.uri,null,null,true,function(z){t.kpiValueFetchDeferred=true;var A={};if(z&&z.results&&z.results.length){if(w.unit[0]){t._updateTileModel({unit:z.results[0][w.unit[0].name]});u=w.unit[0].name;A.unit=w.unit[0];A.unit.name=w.unit[0].name;}f=sap.ushell.components.tiles.indicatorTileUtils.util.findTextPropertyForDimension(t.oRunTimeODataModel,c,f);A.dimension=f;t.oConfig.TILE_PROPERTIES.FINALVALUE=z;t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,d.split(",")[0],f,u);A.data=t.oConfig.TILE_PROPERTIES.FINALVALUE;A.isCurM=t.isACurrencyMeasure(t.oConfig.EVALUATION.COLUMN_NAME);var B={};t.cacheTime=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();B.ChipId=t.oConfig.TILE_PROPERTIES.id;B.Data=JSON.stringify(A);B.CacheMaxAge=Number(t.chipCacheTime);B.CacheMaxAgeUnit=t.chipCacheTimeUnit;B.CacheType=1;var G=t.getLocalCache(B);t.updateDatajobScheduled=false;var H=t.oConfig.TILE_PROPERTIES.id+"data";var I=sap.ushell.components.tiles.indicatorTileUtils.util.getScheduledJob(H);if(I){clearTimeout(I);I=undefined;}if(!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){a.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,G);var U=false;if(j){U=true;}if(t.chipCacheTime){sap.ushell.components.tiles.indicatorTileUtils.util.writeFrontendCacheByChipAndUserId(t.oTileApi,t.oConfig.TILE_PROPERTIES.id,B,U,function(z){if(z){t.cacheTime=z&&z.CachedTime;a.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,z);}if(t.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){q.proxy(t.setTimeStamp(t.cacheTime),t);}});}}else{var J=a.getKpivalueById(t.oConfig.TILE_PROPERTIES.id),K;if(J){if(!J.CachedTime){J.CachedTime=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();}K=J.Data;if(K){K=JSON.parse(K);if(t.oKpiTileView.getViewName()==="tiles.indicatornumeric.NumericTile"){K.leftData=A;}else{K.rightData=A;}}J.Data=JSON.stringify(K);a.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,J);}else{K={};K.rightData=A;G.Data=JSON.stringify(K);a.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,G);}t.cacheWriteData=A;}s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(z.results.length===0){t.oConfig.TILE_PROPERTIES.FINALVALUE=z;if(a.getKpivalueById(t.oConfig.TILE_PROPERTIES.id)){A=a.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);A.data=z;}else{A.data=z;}a.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,A);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);t.setNoData();}else{a.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,{empty:"empty"});t.setNoData();}},function(z){t.kpiValueFetchDeferred=true;if(z&&z.response){L.error(z.message+" : "+z.request.requestUri);E.call(t,z);}});}}else if(j&&j.Data){var x;var y=t.oConfig&&t.oConfig.TILE_PROPERTIES&&t.oConfig.TILE_PROPERTIES.tileType;if(y.indexOf("DT-")===-1){x=j.Data&&JSON.parse(j.Data);}else{x=j.Data&&JSON.parse(j.Data);x=x.rightData;}t.cacheTime=j.CachedTime;if(t.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(t.oConfig)){q.proxy(t.setTimeStamp(t.cacheTime),t);}if(x.data&&x.data.length){if(x.unit){t._updateTileModel({unit:x.data[0][x.unit.name]});}f=x.dimension;t.oConfig.TILE_PROPERTIES.FINALVALUE=x.data;s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(x&&x.data&&x.data instanceof Array&&x.data.length===0){t.oConfig.TILE_PROPERTIES.FINALVALUE=x.data;s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);t.setNoData();}else{t.setNoData();}}else{t.setNoData();}}catch(e){t.kpiValueFetchDeferred=true;E.call(t,e);}},doProcess:function(r,i){var t=this;this.DEFINITION_DATA=this.oConfig;this._updateTileModel(this.DEFINITION_DATA);this.setTextInTile();this.fetchChartData(r,i,function(k){this.CALCULATED_KPI_VALUE=k;this._updateTileModel({data:this.CALCULATED_KPI_VALUE});if(t.oConfig.TILE_PROPERTIES.frameType===F.TwoByOne){t.oKpiTileView.oGenericTile.setFrameType(F.TwoByOne);t.oKpiTileView.oGenericTile.removeAllTileContent();t.getView().getViewData().parentController._updateTileModel(this.getTile().getModel().getData());t.getView().getViewData().deferredObj.resolve();}else{t.oKpiTileView.oGenericTile.setFrameType(F.OneByOne);t.oKpiTileView.oGenericTile.removeAllTileContent();t.oKpiTileView.oGenericTile.addTileContent(t.oKpiTileView.oNVConfS);this.oKpiTileView.oGenericTile.setState(b.Loaded);}this.setToolTip(null,this.CALCULATED_KPI_VALUE,"CONT");if(this.chipCacheTime&&!sap.ushell.components.tiles.indicatorTileUtils.util.isDualTile(this.oConfig)){sap.ushell.components.tiles.indicatorTileUtils.util.scheduleFetchDataJob.call(this,this.oTileApi.visible.isVisible());}},this.logError);},doDummyProcess:function(){var t=this;t.setTextInTile();t._updateTileModel({value:8888,size:S.Auto,frameType:F.OneByOne,state:b.Loading,valueColor:V.Error,indicator:D.None,title:"US Profit Margin",footer:"Current Quarter",description:"Maximum deviation",data:[{title:"Americas",value:10,color:"Neutral"},{title:"EMEA",value:50,color:"Neutral"},{title:"APAC",value:-20,color:"Neutral"}]});this.oKpiTileView.oGenericTile.setState(b.Loaded);}});return C;});