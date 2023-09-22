// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/Control","sap/ui/Device","sap/ui/performance/Measurement","sap/ui/thirdparty/jquery","sap/ui/util/Storage","sap/ushell/EventHub","sap/ushell/library"],function(e,t,a,jQuery,i,o){"use strict";var n=e.extend("sap.ushell.ui.shell.FloatingContainer",{metadata:{library:"sap.ushell",properties:{},aggregations:{content:{type:"sap.ui.core.Control",multiple:true}}},renderer:{apiVersion:2,render:function(e,t){e.openStart("div",t);e.class("sapUshellFloatingContainer");e.openEnd();if(t.getContent()&&t.getContent().length){e.renderControl(t.getContent()[0])}e.close("div")}}});n.prototype.init=function(){t.resize.attachHandler(n.prototype._handleResize,this)};n.prototype._getWindowHeight=function(){return jQuery(window).height()};n.prototype._setContainerHeight=function(e,t){e.css("max-height",t)};n.prototype._handleResize=function(e){a.start("FLP:FloatingContainer_handleResize","resizing floating container","FLP");if(jQuery(".sapUshellFloatingContainer").parent()[0]&&jQuery(".sapUshellContainerDocked").length===0){this.oWrapper=jQuery(".sapUshellFloatingContainer").parent()[0];this.oWrapper.style.cssText=this.oStorage.get("floatingContainerStyle");var n=window.matchMedia?window.matchMedia("(max-width: 417px)").matches:false;this.adjustPosition(e,n)}else if(jQuery(".sapUshellFloatingContainer").parent()[0]&&jQuery(".sapUshellContainerDocked").length){if(jQuery("#canvas").hasClass("sapUshellContainer-Narrow-Right")){var s;if(sap.ui.getCore().getConfiguration().getRTL()){jQuery("#sapUshellFloatingContainerWrapper").css("left",416/jQuery(window).width()*100+"%");s=416/jQuery(window).width()*100+"%;"}else{jQuery("#sapUshellFloatingContainerWrapper").css("left",100-416/jQuery(window).width()*100+"%");s=100-416/jQuery(window).width()*100+"%;"}this.oWrapper.style.cssText="left:"+s+this.oWrapper.style.cssText.substring(this.oWrapper.style.cssText.indexOf("top"));this.oStorage.put("floatingContainerStyle",this.oWrapper.style.cssText)}}if(jQuery(".sapUshellContainerDocked").length>0){sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerDockedIsResize");o.emit("ShellFloatingContainerDockedIsResized",Date.now())}var r=t.media.getCurrentRange(t.media.RANGESETS.SAP_STANDARD);if(r.name!=="Desktop"&&jQuery(".sapUiMedia-Std-Desktop").width()-416<r.from&&jQuery(".sapUshellContainerDocked").length){jQuery("#canvas, .sapUshellShellHead").removeClass("sapUshellContainerDocked");if(jQuery("#canvas").hasClass("sapUshellContainer-Narrow-Right")){jQuery("#canvas").removeClass("sapUshellContainer-Narrow-Right sapUshellMoveCanvasRight")}else{jQuery("#canvas").removeClass("sapUshellContainer-Narrow-Left sapUshellMoveCanvasLeft")}jQuery(".sapUshellShellFloatingContainerFullHeight").removeClass("sapUshellShellFloatingContainerFullHeight");sap.ui.getCore().byId("mainShell").getController()._handleAnimations(false);var l=new i(i.Type.local,"com.sap.ushell.adapters.local.CopilotLastState");if(l){l.put("lastState","floating")}sap.ui.getCore().getEventBus().publish("launchpad","shellFloatingContainerIsUnDockedOnResize");jQuery("#sapUshellFloatingContainerWrapper").removeClass("sapUshellContainerDocked sapUshellContainerDockedMinimizeCoPilot sapUshellContainerDockedExtendCoPilot");var p=sap.ui.getCore().byId("viewPortContainer");if(p){p._handleSizeChange()}}a.end("FLP:FloatingContainer_handleResize")};n.prototype.adjustPosition=function(e,t){var a=e?e.width:jQuery(window).width(),i=e?e.height:jQuery(window).height(),o=this.oContainer.width(),n=this.oContainer.height(),s,r,l,p,h=sap.ui.getCore().getConfiguration().getRTL();t=t!==undefined?t:false;if(this.oWrapper){l=this.oWrapper.style.left.replace("%","");l=a*l/100;p=this.oWrapper.style.top.replace("%","");p=i*p/100;if(!isNaN(l)&&!isNaN(p)&&!t){if(h){s=l<o||l>a;if(s){l=l<o?o:a}}else{s=l<0||a<l+o;if(s){l=l<0?0:a-o}}r=p<0||i<p+n;if(r){p=p<0?0:i-n}if(!s&&!r){this.oWrapper.style.left=l*100/a+"%";this.oWrapper.style.top=p*100/i+"%";this.oWrapper.style.position="absolute";return}this.oWrapper.style.left=l*100/a+"%";this.oWrapper.style.top=p*100/i+"%";this.oWrapper.style.position="absolute"}}};n.prototype.handleDrop=function(){if(this.oWrapper){this.adjustPosition();this.oStorage.put("floatingContainerStyle",this.oWrapper.style.cssText)}};n.prototype.setContent=function(e){if(this.getDomRef()){var t=sap.ui.getCore().createRenderManager();t.renderControl(e);t.flush(this.getDomRef());t.destroy()}this.setAggregation("content",e,true)};n.prototype.onAfterRendering=function(){this.oStorage=this.oStorage||new i(i.Type.local,"com.sap.ushell.adapters.local.FloatingContainer");this.oContainer=jQuery(".sapUshellFloatingContainer");this.oWrapper=jQuery(".sapUshellFloatingContainer").parent()[0]};n.prototype.exit=function(){t.resize.detachHandler(n.prototype._resizeHandler,this)};return n});
//# sourceMappingURL=FloatingContainer.js.map