/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.HierarchyItemRenderer");jQuery.sap.require("sap.ui.layout.HorizontalLayout");jQuery.sap.require("sap.m.Label");jQuery.sap.require("sap.m.Link");sap.ca.ui.HierarchyItemRenderer={};sap.ca.ui.HierarchyItemRenderer.render=function(e,r){var t=r.getProperty("icon");var i=r.getProperty("levelType");var a=r.getProperty("identifier");var s=r.getProperty("title");var o=r.getProperty("link");var n=r.getProperty("emphasized");var l=this.isNotEmpty(t);var d=this.isNotEmpty(i);var p=this.isNotEmpty(a);var y=this.isNotEmpty(s);var C=this.isNotEmpty(o);e.write("<div");e.writeControlData(r);e.addClass("sapCaUiHierarchyItem");if(n){e.addClass("sapCaUiHierarchyItemEmphasized")}e.writeClasses();e.write(">");e.write("<div");e.writeControlData(r);e.addClass("sapCaUiHierarchyItemBlockContainer");e.writeClasses();e.write(">");if(l||d||p){e.write("<div");e.writeControlData(r);e.addClass("sapCaUiHierarchyItemBlock");e.writeClasses();e.write(">");if(l){e.renderControl(r._getIconControl())}if(d){e.renderControl(r._getLevelTypeLabel())}if(p){e.renderControl(r._getIdentifierLabel())}e.write("</div>")}if(y||C){e.write("<div");e.writeControlData(r);e.addClass("sapCaUiHierarchyItemBlock");e.writeClasses();e.write(">");if(y){e.renderControl(r._getTitleLabel())}if(C){e.renderControl(r._getLinkControl())}e.write("</div>")}e.write("</div>");e.write("</div>")};sap.ca.ui.HierarchyItemRenderer.isNotEmpty=function(e){return e!=undefined&&e!=""};
//# sourceMappingURL=HierarchyItemRenderer.js.map