/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(['sap/viz/library','sap/viz/libs/sap-viz','./container/libs/common/libs/rgbcolor/rgbcolor_static','./container/libs/sap-viz-controls-vizcontainer','./controls/common/BaseControl','./controls/common/feeds/AnalysisObject','./controls/common/feeds/FeedItem','./container/VizControlsHelper',"sap/ui/thirdparty/jquery","./VizContainerRenderer"],function(l,s,r,a,B,A,F,V,q){"use strict";var b=B.extend("sap.viz.ui5.VizContainer",{metadata:{library:"sap.viz",properties:{vizType:{type:"string",group:"Misc",defaultValue:null},vizCss:{type:"string",group:"Misc",defaultValue:null},vizProperties:{type:"object",group:"Misc",defaultValue:null},enableMorphing:{type:"boolean",group:"Misc",defaultValue:null}},aggregations:{vizData:{type:"sap.viz.ui5.data.Dataset",multiple:false},analysisObjectsForPicker:{type:"sap.viz.ui5.controls.common.feeds.AnalysisObject",multiple:true,singularName:"analysisObjectsForPicker"},feeds:{type:"sap.viz.ui5.controls.common.feeds.FeedItem",multiple:true,singularName:"feed"}},events:{feedsChanged:{parameters:{feeds:{type:"sap.viz.ui5.controls.common.feeds.FeedItem[]"}}},vizTypeChanged:{},vizDefinitionChanged:{},selectData:{},deselectData:{},showTooltip:{},hideTooltip:{},initialized:{}}}});b.prototype.init=function(){B.prototype.init.apply(this,arguments);this._uiConfig={'layout':'horizontal','enableMorphing':true};this._vizFrame=null;this._vizBuilder=null;this._switchBar=null;this._vSplitter$=null;this._clearVariables();};b.prototype.exit=function(){B.prototype.exit.apply(this,arguments);this._clearVariables();this.setVizData(null);};b.prototype._clearVariables=function(){this._vizFrame$=null;this._vizBuilder$=null;this._switchBar$=null;this._clearRequestedProperties();};b.prototype._clearRequestedProperties=function(){this._requestedVizType='viz/column';this._requestedVizCss=null;this._requestedVizProperties=null;this._requestedOptions=null;};b.prototype.setUiConfig=function(u){this._mergeConfig(u);return this;};b.prototype._mergeConfig=function(u){u=u||{};if(u.layout==='vertical'||u.layout==='horizontal'){this._uiConfig.layout=u.layout;}this._uiConfig.enableMorphing=u.enableMorphing!==false;};b.prototype.getFeeds=function(){var f=[];if(this._vizFrame&&this._vizFrame.feeds()){f=F.fromVizControlsFmt(this._vizFrame.feeds());}else{f=this.getAggregation('feeds');}return f;};b.prototype.getVizType=function(){if(this._vizFrame){return this._vizFrame.vizType();}else{return this._requestedVizType;}};b.prototype.setVizType=function(v){if(this._vizFrame){this._vizFrame.vizType(v);}else{this._requestedVizType=v;}return this;};b.prototype.getVizCss=function(){if(this._vizFrame){return this._vizFrame.vizCss();}else{return this._requestedVizCss;}};b.prototype.setVizCss=function(v){if(this._vizFrame){this._vizFrame.vizCss(v);}else{this._requestedVizCss=v;}return this;};b.prototype.getVizProperties=function(){if(this._vizFrame){return this._vizFrame.vizProperties();}else{return this._requestedVizProperties;}};b.prototype.setVizProperties=function(v){if(this._vizFrame){this._vizFrame.vizProperties(v);}else{this._requestedVizProperties=v;}return this;};b.prototype.getEnableMorphing=function(){if(this._vizFrame){return this._vizFrame.enableMorphing();}else{return this._uiConfig.enableMorphing;}};b.prototype.setEnableMorphing=function(e){if(this._vizFrame){this._vizFrame.enableMorphing(e);}else{this._uiConfig.enableMorphing=e;}return this;};b.prototype.vizSelection=function(p,o){if(this._vizFrame){var c=this._vizFrame.vizSelection.apply(this._vizFrame,arguments);if(c===this._vizFrame){c=this;}return c;}else{return null;}};b.prototype.vizUpdate=function(o){if(this._vizFrame){if(o.data||o.feeds){this._requestedOptions=this._requestedOptions||{};}if(this._requestedOptions){var c=this._requestedOptions;c.css=c.css||o.css;c.properties=c.properties||o.properties;if(o.data){this.setVizData(o.data);}if(o.feeds){this._resetFeeds(o.feeds);}}else{this._vizFrame.vizUpdate(o);}}};b.prototype._resetFeeds=function(f){this.destroyFeeds();V.updateFeedsByAAIndex(this.getVizType(),f);if(f&&f.length){for(var i=0;i<f.length;i++){this.addFeed(f[i]);}}return this;};b.prototype._setAnalysisObjectsForPicker=function(c){this.destroyAnalysisObjectsForPicker();if(c&&c.length){for(var i=0;i<c.length;i++){this.addAnalysisObjectsForPicker(c[i]);}}return this;};b.prototype._createVizFrame=function(d){var c=sap.viz.controls.frame.VizFrame;var G=sap.viz.controls.common.config.GlobalConfig;var v=G.defaultUIConfig(G.DEFAULT_UICONFIG_TYPE_FRAME);v.enableFilterMenu=false;v.enableFilterBar=false;v.enableSettingButton=false;v.enableFullScreenButton=false;v.controls.chart.enableMorphing=this._uiConfig.enableMorphing;v.controls.chart.enableTrellis=false;v.controls.contextMenu.menu=[["direction","stacking"],["legend","datalabels"]];var f=new c(d,v);f.addEventListener('feedsChanged',q.proxy(function(e){this._resetFeeds(this.getFeeds());this.fireEvent("feedsChanged",{'feeds':this.getFeeds()});},this));f.addEventListener('vizTypeChanged',q.proxy(function(e){this.fireEvent("vizTypeChanged");},this));f.addEventListener('vizDefinitionChanged',q.proxy(function(e){this.fireEvent("vizDefinitionChanged");},this));f.vizOn('selectData',q.proxy(function(e){this.fireEvent("selectData",e);},this));f.vizOn('deselectData',q.proxy(function(e){this.fireEvent("deselectData",e);},this));f.vizOn('showTooltip',q.proxy(function(e){this.fireEvent("showTooltip",e);},this));f.vizOn('hideTooltip',q.proxy(function(e){this.fireEvent("hideTooltip",e);},this));f.vizOn('initialized',q.proxy(function(e){this.fireEvent("initialized",e);},this));var o=f.getDefaultIncompleteOptions(this.getVizType());var g=this.getAggregation('feeds');if(g){o.feeds=V.getFeedInstances(g);}var h=V.getFakedDataInstance(this.getVizType(),this.getVizData(),g);if(h){o.data=h;}if(this.getVizCss()){o.css=this.getVizCss();}if(this.getVizProperties()){o.properties=this.getVizProperties();}this._clearRequestedProperties();f.createViz(o);return f;};b.prototype._createChildren=function(){var c=this._app$;var d='ui5-viz-controls';var G=sap.viz.controls.common.config.GlobalConfig;this._vizFrame$=q(document.createElement('div')).appendTo(c).addClass(d+'-viz-frame');this._vizFrame=this._createVizFrame(this._vizFrame$[0]);if(this._uiConfig.layout==='horizontal'){var v=G.defaultUIConfig(G.DEFAULT_UICONFIG_TYPE_BUILDER);v.controls.feedingPanel.enableTrellis=false;v.controls.switchBar.groups=V.getSwitchBarGroups();this._vizBuilder$=q(document.createElement('div')).appendTo(c).addClass(d+'-viz-builder');this._vizBuilder=new sap.viz.controls.builder.VizBuilder(this._vizBuilder$[0],v);this._vizBuilder.connect(this._vizFrame.vizUid());this._vSplitter$=q(document.createElement('div')).appendTo(c).addClass(d+'-vertical-splitter');}else if(this._uiConfig.layout==='vertical'){var e=G.defaultUIConfig(G.DEFAULT_UICONFIG_TYPE_SWITCHBAR);e.groups=V.getSwitchBarGroups();this._switchBar$=q(document.createElement('div')).appendTo(c);this._switchBar=new sap.viz.controls.switchbar.SwitchBar(this._switchBar$[0],e);this._switchBar.connect(this._vizFrame.vizUid());}this._validateAOs();this._validateSize();};b.prototype._updateChildren=function(){var o={};if(this._requestedOptions){if(this._requestedOptions.css){o.css=this._requestedOptions.css;}if(this._requestedOptions.properties){o.properties=this._requestedOptions.properties;}this._requestedOptions=null;}o.data=V.getFakedDataInstance(this.getVizType(),this.getVizData(),this.getAggregation('feeds'));o.feeds=V.getFeedInstances(this.getAggregation('feeds'));this._vizFrame.vizUpdate(o);this._validateAOs();};b.prototype._validateAOs=function(){if(this._vizBuilder){var c=A.toVizControlsFmt(this.getAnalysisObjectsForPicker());this._vizBuilder.analysisObjectsForPicker(c);}};b.prototype._validateSize=function(){if(this._uiConfig.layout==='horizontal'){this._app$.css({'min-width':'560px','min-height':'601px'});}else if(this._uiConfig.layout==='vertical'){this._app$.css({'min-width':'300px','min-height':'654px'});}this.$().css({'overflow':'hidden'});var c={'width':this._app$.width(),'height':this._app$.height()};if(this._uiConfig.layout==='horizontal'&&this._vizFrame){var d=this._vizBuilder$.width();this._vizFrame.size({'width':c.width-d,'height':c.height});this._vizBuilder.size({'width':d,'height':c.height-1});this._vizFrame$.css({'left':'0px','top':'0px'});this._vizBuilder$.css({'left':c.width-d+'px','top':'0px'});this._vSplitter$.css({'left':c.width-d+'px','top':'0px','height':c.height+'px'});}else if(this._uiConfig.layout==='vertical'&&this._vizFrame){var e=388;var f=54;this._vizFrame.size({'width':c.width,'height':c.height-f});this._switchBar.size({'width':e,'height':f});this._vizFrame$.css({'left':'0px','top':f+'px'});this._switchBar$.css({'left':(c.width-e)/2+'px','top':(f-36)/2+'px'});}this.$().css({'overflow':'auto'});};return b;});