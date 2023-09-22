/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["./VoAggregation","./library"],function(e,t){"use strict";var r=e.extend("sap.ui.vbm.Routes",{metadata:{library:"sap.ui.vbm",properties:{posChangeable:{type:"boolean",group:"Misc",defaultValue:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.vbm.Route",multiple:true,singularName:"item"},dragSource:{type:"sap.ui.vbm.DragSource",multiple:true,singularName:"dragSource"},dropTarget:{type:"sap.ui.vbm.DropTarget",multiple:true,singularName:"dropTarget"}},events:{click:{},contextMenu:{},drop:{}}}});r.prototype.getBindInfo=function(){var t=e.prototype.getBindInfo.apply(this,arguments);var r=this.getTemplateBindingInfo();t.P=r?r.hasOwnProperty("position"):true;t.C=r?r.hasOwnProperty("color"):true;t.ST=r?r.hasOwnProperty("start"):true;t.ED=r?r.hasOwnProperty("end"):true;t.LW=r?r.hasOwnProperty("linewidth"):true;t.DC=r?r.hasOwnProperty("dotcolor"):true;t.DW=r?r.hasOwnProperty("dotwidth"):true;t.DBC=r?r.hasOwnProperty("dotbordercolor"):true;t.CB=r?r.hasOwnProperty("colorBorder"):true;t.LD=r?r.hasOwnProperty("lineDash"):true;t.DI=r?r.hasOwnProperty("directionIndicator"):true;return t};r.prototype.getTemplateObject=function(){var t=e.prototype.getTemplateObject.apply(this,arguments);var r=this.mBindInfo=this.getBindInfo();var i=r.hasTemplate?this.getBindingInfo("items").template:null;t["type"]="{00100000-2012-0004-B001-C46BD7336A1A}";if(r.P){t["posarray.bind"]=t.id+".P"}else{t.posarray=i.getPosition()}if(r.C){t["color.bind"]=t.id+".C"}else{t.color=i.getColor()}if(r.ST){t["start.bind"]=t.id+".ST"}else{t.start=i.getStart()}if(r.ED){t["end.bind"]=t.id+".ED"}else{t.end=i.getEnd()}if(r.LW){t["linewidth.bind"]=t.id+".LW"}else{t.linewidth=i.getLinewidth()}if(r.DC){t["dotcolor.bind"]=t.id+".DC"}else{t.dotcolor=i.getDotcolor()}if(r.DBC){t["dotbordercolor.bind"]=t.id+".DBC"}else{t.dotbordercolor=i.getDotbordercolor()}if(r.CB){t["colorBorder.bind"]=t.id+".CB"}else{t.colorBorder=i.getColorBorder()}if(r.LD){t["lineDash.bind"]=t.id+".LD"}else{t.lineDash=i.getLineDash()}if(r.DW){t["dotwidth.bind"]=t.id+".DW"}else{t.dotwidth=i.getDotwidth()}if(r.DI){t["directionIndicator.bind"]=t.id+".DI"}else{t.directionIndicator=i.getDirectionIndicator()}t["DragSource"]={DragItem:this.getDragItemTemplate(t.id)};t["DropTarget"]={DropItem:this.getDropItemTemplate(t.id)};return t};r.prototype.getTypeObject=function(){var t=e.prototype.getTypeObject.apply(this,arguments);var r=this.mBindInfo;if(r.P){t.A.push({changeable:this.getPosChangeable().toString(),name:"P",alias:"P",type:"vector"})}if(r.C){t.A.push({name:"C",alias:"C",type:"color"})}if(r.ST){t.A.push({name:"ST",alias:"ST",type:"long"})}if(r.ED){t.A.push({name:"ED",alias:"ED",type:"long"})}if(r.LW){t.A.push({name:"LW",alias:"LW",type:"float"})}if(r.DC){t.A.push({name:"DC",alias:"DC",type:"color"})}if(r.DBC){t.A.push({name:"DBC",alias:"DBC",type:"color"})}if(r.CB){t.A.push({name:"CB",alias:"CB",type:"color"})}if(r.LD){t.A.push({name:"LD",alias:"LD",type:"string"})}if(r.DW){t.A.push({name:"DW",alias:"DW",type:"float"})}if(r.DI){t.A.push({name:"DI",alias:"DI",type:"boolean"})}return t};r.prototype.getActionArray=function(){var t=e.prototype.getActionArray.apply(this,arguments);var r=this.getId();if(this.mEventRegistry["click"]||this.isEventRegistered("click")){t.push({id:r+"1",name:"click",refScene:"MainScene",refVO:r,refEvent:"Click",AddActionProperty:[{name:"pos"}]})}if(this.mEventRegistry["contextMenu"]||this.isEventRegistered("contextMenu")){t.push({id:r+"2",name:"contextMenu",refScene:"MainScene",refVO:r,refEvent:"ContextMenu"})}if(this.mEventRegistry["drop"]||this.isEventRegistered("drop")){t.push({id:r+"3",name:"drop",refScene:"MainScene",refVO:r,refEvent:"Drop"})}return t};return r});
//# sourceMappingURL=Routes.js.map