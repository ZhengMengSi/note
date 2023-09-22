/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.PictureViewer");jQuery.sap.require("sap.ca.ui.library");jQuery.sap.require("sap.m.TileContainer");sap.m.TileContainer.extend("sap.ca.ui.PictureViewer",{metadata:{deprecated:true,library:"sap.ca.ui",properties:{tileScaling:{type:"float",group:"Misc",defaultValue:.95},removable:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"items",aggregations:{items:{type:"sap.ca.ui.PictureViewerItem",multiple:true,singularName:"item"}},events:{pictureDeleted:{}}}});jQuery.sap.require("sap.ui.core.ResizeHandler");jQuery.sap.require("sap.m.TileContainer");sap.ca.ui.PictureViewer.prototype.init=function(){sap.m.TileContainer.prototype.init.apply(this);this.setEditable(false);if(sap.ui.getCore().isMobile()){jQuery(window).bind("tap",jQuery.proxy(this._reset,this));var e=sap.ui.getCore().getStaticAreaRef();this.$blocker=jQuery("<div class='sapCaPVBly sapUiBLy'></div>").css("visibility","hidden");jQuery(e).append(this.$blocker)}if(sap.ui.getCore().isMobile()){}else{jQuery(window).bind("resize",jQuery.proxy(this._resize,this))}this.addStyleClass("sapCaPW");this.addStyleClass("sapCaPWRendering");this.onsapright=this._bRtl?jQuery.proxy(this.scrollRightRTL,this):jQuery.proxy(this.scrollRight,this);this.onsapleft=this._bRtl?jQuery.proxy(this.scrollLeftRTL,this):jQuery.proxy(this.scrollLeft,this)};sap.ca.ui.PictureViewer.prototype._resize=function(){if(this._oDragSession){return}setTimeout(jQuery.proxy(function(){this._applyDimension();this._update(false);delete this._iInitialResizeTimeout},this),this._iInitialResizeTimeout);this._iInitialResizeTimeout=0};sap.ca.ui.PictureViewer.prototype.exit=function(){if(sap.ui.getCore().isMobile()){this.$blocker.remove()}else{jQuery(window).unbind("resize",jQuery.proxy(this._resize,this))}sap.m.TileContainer.prototype.exit.apply(this);if(!jQuery.device.is.desktop){jQuery(window).unbind("tap",jQuery.proxy(this._reset,this))}};sap.ca.ui.PictureViewer.prototype.setTileScaling=function(e){if(e<0||e>1){e=.75;jQuery.sap.log.error("Tile Scaling should be a float value between 0 and 1 and not "+e+". Setting it to 0.75 by default.")}this.setProperty("tileScaling",e)};sap.ca.ui.PictureViewer.prototype.addItem=function(e){this.insertItem(e,this.getItems().length)};sap.ca.ui.PictureViewer.prototype.insertItem=function(e,i){var t=new sap.ca.ui.PictureTile({tileContent:e});t.attachPictureDelete(jQuery.proxy(this._deletePictureRequestHandler,this));this.insertTile(t,i);this.insertAggregation("items",e,i);return this};sap.ca.ui.PictureViewer.prototype.insertTile=function(e,i){e.attachPictureDelete(jQuery.proxy(this._deletePictureRequestHandler,this));sap.m.TileContainer.prototype.insertTile.apply(this,arguments)};sap.ca.ui.PictureViewer.prototype.deleteTile=function(e){sap.m.TileContainer.prototype.deleteTile.apply(this,arguments);e.destroy()};sap.ca.ui.PictureViewer.prototype.deletePicture=function(e){var i,t,s;s=this.getTiles().length;if(typeof e!="number"||e<0||e>=s){i=this.getPageFirstTileIndex()}else{i=e}if(i>-1){t=this.getTiles()[i];t.detachPictureDelete(jQuery.proxy(this._deletePictureRequestHandler,this));this.deleteTile(t);this.removeAggregation("items",i,true)}else{jQuery.sap.log.warning("Cannot find and delete a picture at index : "+e)}return this};sap.ca.ui.PictureViewer.prototype.selectPicture=function(e){var i=this.getTiles().length;if(typeof e!="number"){e=0}else if(e<0){e=0}else if(e>=i){e=i-1}if(this._bRendered){this.addStyleClass("sapCaPWRendering")}this._selectedIndex=e;return this};sap.ca.ui.PictureViewer.prototype.setSelectedIndex=function(e){this.selectPicture(e)};sap.ca.ui.PictureViewer.prototype.getCurrentPictureIndex=function(){return this.getPageFirstTileIndex()};sap.ca.ui.PictureViewer.prototype._deletePictureRequestHandler=function(e){var i=this.indexOfTile(e.getSource());this.deleteTile(e.getSource());this.firePictureDeleted({index:i})};sap.ca.ui.PictureViewer.prototype._reset=function(e){var i=this.getCurrentPictureIndex();var t=this.getTiles();if(i>-1&&t&&t.length>i){var s=t[i];if(s){var r=jQuery(e.target);var a=this.$();if(a.length>0&&r.length>0){var o=r.closest(this.$());if(o.length===0){s.switchVisibility(false)}}}}};sap.ca.ui.PictureViewer.prototype.setRemovable=function(e){this.setProperty("removable",e,true);this.toggleStyleClass("sapCaPWEditable",e)};sap.ca.ui.PictureViewer.prototype.setEditable=function(e){sap.m.TileContainer.prototype.setEditable.call(this,false)};sap.ca.ui.PictureViewer.prototype._getTileDimension=function(){if(!this._bRendered){return}var e=jQuery.sap.byId(this.getId()+"-scrl");var i={width:e.width(),height:e.height()};return i};sap.ca.ui.PictureViewer.prototype.onBeforeRendering=function(){this.addStyleClass("sapCaPWRendering")};sap.ca.ui.PictureViewer.prototype.onAfterRendering=function(){this._bRendered=true;this._applyDimension();this.$().toggleClass("sapCaPWEditable",this.getRemovable()===true);var e=this;this._sInitialResizeTimeoutId=setTimeout(function(){e.addStyleClass("sapCaPWRendering");e._update(false)},this._iInitialResizeTimeout);if(jQuery.device.is.desktop){var i=this.getTiles()[0],t=this._iInitialResizeTimeout;if(!!i){setTimeout(jQuery.proxy(function(){this._findTile(i.$()).focus()},this),t)}}};sap.ca.ui.PictureViewer.prototype._update=function(e){sap.m.TileContainer.prototype._update.apply(this,arguments);this.removeStyleClass("sapCaPWRendering");if(sap.ui.getCore().isMobile()){var i=this.$blocker;setTimeout(jQuery.proxy(function(){i.fadeOut(200,function(){jQuery(this).css("visibility","hidden").css("z-index",0)})},this),250)}};sap.ca.ui.PictureViewer.prototype._applyDimension=function(){var e=this._getDimension();if(e!==undefined){var i=this.getId(),t=this.$(),s,r=10,a=60,o=jQuery.sap.byId(i+"-cnt"),u,n,p=jQuery.sap.byId(i+"-pager").outerHeight();jQuery.sap.byId(i+"-scrl").css({width:e.outerwidth+"px",height:e.outerheight-p+"px"});o.css({height:e.outerheight-p+"px",visibility:"visible"});t.css("visibility","visible");s=t.position();u=o.position();n=o.outerHeight();if(jQuery.device.is.phone){r=2}else if(jQuery.device.is.desktop){r=0}jQuery.sap.byId(i+"-blind").css({top:u.top+r+"px",left:u.left+r+"px",width:o.outerWidth()-r+"px",height:n-r+"px"});jQuery.sap.byId(i+"-rightedge").css({top:s.top+r+a+"px",right:r+"px",height:n-r-a+"px"});jQuery.sap.byId(i+"-leftedge").css({top:s.top+r+a+"px",left:s.left+r+"px",height:n-r-a+"px"})}};sap.ca.ui.PictureViewer.prototype.showBlockerLayer=function(e){if(sap.ui.getCore().isMobile()){var i=20;jQuery(sap.ui.getCore().getStaticAreaRef()).children().each(function(e,t){var s=parseInt(jQuery(t).css("z-index"),10);if(!isNaN(s)){i=Math.max(i,s)}});jQuery.sap.log.debug("blocker layer z-index calculated : "+i+1);this.$blocker.css("z-index",i+1).css("visibility","visible").fadeIn(200,function(){if(e){e.call()}})}else{if(e){e.call()}}};
//# sourceMappingURL=PictureViewer.js.map