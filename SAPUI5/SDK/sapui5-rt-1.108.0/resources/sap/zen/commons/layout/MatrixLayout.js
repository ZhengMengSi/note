/*
 * SAPUI5
    (c) Copyright 2009-2020 SAP SE. All rights reserved
  
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/layout/MatrixLayoutCell","sap/zen/commons/layout/MatrixLayoutRow","sap/zen/commons/library","sap/ui/core/Control","sap/ui/core/EnabledPropagator"],function(jQuery,e,t,a,o,r){"use strict";var n=o.extend("sap.zen.commons.layout.MatrixLayout",{metadata:{library:"sap.zen.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},layoutFixed:{type:"boolean",group:"Appearance",defaultValue:true},columns:{type:"int",group:"Appearance",defaultValue:null},widths:{type:"sap.ui.core.CSSSize[]",group:"Appearance",defaultValue:null}},defaultAggregation:"rows",aggregations:{rows:{type:"sap.zen.commons.layout.MatrixLayoutRow",multiple:true,singularName:"row"}}}});r.call(n.prototype,true,true);n.prototype.createRow=function(){var a=new t;this.addRow(a);for(var r=0;r<arguments.length;r++){var n=arguments[r];var i;if(n instanceof e){i=n}else if(n instanceof o){i=new e({content:n})}else if(n instanceof Object&&n.height){a.setHeight(n.height)}else{var u=n?n.toString():"";i=new e({content:new sap.zen.commons.TextView({text:u})})}a.addCell(i)}return this};n.prototype.setWidths=function(e){var t;if(!jQuery.isArray(e)){t=jQuery.makeArray(arguments)}else{t=e}for(var a=0;a<t.length;a++){if(t[a]==""||!t[a]){t[a]="auto"}}this.setProperty("widths",t);return this};return n},true);
//# sourceMappingURL=MatrixLayout.js.map