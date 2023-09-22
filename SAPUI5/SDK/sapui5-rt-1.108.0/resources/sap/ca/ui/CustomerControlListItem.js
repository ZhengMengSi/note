/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.CustomerControlListItem");jQuery.sap.require("sap.ca.ui.library");jQuery.sap.require("sap.m.CustomListItem");sap.m.CustomListItem.extend("sap.ca.ui.CustomerControlListItem",{metadata:{deprecated:true,library:"sap.ca.ui",properties:{showSalesArea:{type:"boolean",group:"Misc",defaultValue:false},customerID:{type:"string",group:"Misc",defaultValue:"CustomerID"},customerName:{type:"string",group:"Misc",defaultValue:"CustomerName"},salesOrganizationName:{type:"string",group:"Misc",defaultValue:"SalesOrganizationName"},distributionChannelName:{type:"string",group:"Misc",defaultValue:"DistributionChannelName"},divisionName:{type:"string",group:"Misc",defaultValue:"DivisionName"}}}});jQuery.sap.require("sap.m.Label");jQuery.sap.require("sap.m.Text");jQuery.sap.require("sap.m.ObjectIdentifier");jQuery.sap.require("sap.ca.ui.utils.resourcebundle");jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");sap.ca.ui.CustomerControlListItem.prototype._getFormattedObjectIdentifier=function(){var t=this.getCustomerName();var e=this.getCustomerID();var r;if(parseInt(e,10)!==0){r=sap.ca.ui.model.format.FormattingLibrary.commonIDFormatter(t,e)}else{r=t}return r};sap.ca.ui.CustomerControlListItem.prototype._getObjectIdentifierControl=function(){var t,e=this._oContent;if(e){var r=e.getItems();if(r&&r.length>0){t=r[0]}}return t};sap.ca.ui.CustomerControlListItem.prototype._updateObjectIdentifierControlText=function(){var t=this._getObjectIdentifierControl();if(t){t.setTitle(this._getFormattedObjectIdentifier(),false)}};sap.ca.ui.CustomerControlListItem.prototype._getSalesArea=function(){var t,e=this._oContent;if(e){var r=e.getItems();if(r&&r.length>2){t=r[2]}}return t};sap.ca.ui.CustomerControlListItem.prototype._getFormattedSalesAreaText=function(){return this.getSalesOrganizationName()+", "+this.getDistributionChannelName()+", "+this.getDivisionName()};sap.ca.ui.CustomerControlListItem.prototype._updateSalesAreaText=function(){var t=this._getSalesArea();if(t){t.setText(this._getFormattedSalesAreaText(),false)}};sap.ca.ui.CustomerControlListItem.prototype._addSalesArea=function(){if(this._oContent){var t=new sap.m.Label({text:sap.ca.ui.utils.resourcebundle.getText("CustomerContext.SalesArea")});var e=new sap.m.Text({text:this._getFormattedSalesAreaText()});this._oContent.addItem(t);this._oContent.addItem(e)}};sap.ca.ui.CustomerControlListItem.prototype.getContent=function(){if(typeof this._oContent==="undefined"){this._oContent=new sap.m.VBox;this._oContent.addStyleClass("sapCaUiCustomerContextListItem");this._oContent.addStyleClass("sapMListTblCell");var t=new sap.m.ObjectIdentifier({title:this._getFormattedObjectIdentifier()});this._oContent.addItem(t);if(this.getShowSalesArea()){this._addSalesArea()}}return[this._oContent]};sap.ca.ui.CustomerControlListItem.prototype.setShowSalesArea=function(t){var e,r=this._oContent;if(r){e=r.getItems()}this.setProperty("showSalesArea",t,true);if(e){var s=this.getShowSalesArea();if(s&&e.length===1){this._addSalesArea()}else if(!s&&e.length===3){var a=e[1];var i=e[2];r.removeItem(i);r.removeItem(a);a.destroy();i.destroy()}}return this};sap.ca.ui.CustomerControlListItem.prototype.setCustomerID=function(t){this.setProperty("customerID",t,true);this._updateObjectIdentifierControlText();return this};sap.ca.ui.CustomerControlListItem.prototype.setCustomerName=function(t){this.setProperty("customerName",t,true);this._updateObjectIdentifierControlText();return this};sap.ca.ui.CustomerControlListItem.prototype.setSalesOrganizationName=function(t){this.setProperty("salesOrganizationName",t,true);this._updateSalesAreaText();return this};sap.ca.ui.CustomerControlListItem.prototype.setDistributionChannelName=function(t){this.setProperty("distributionChannelName",t,true);this._updateSalesAreaText();return this};sap.ca.ui.CustomerControlListItem.prototype.setDivisionName=function(t){this.setProperty("divisionName",t,true);this._updateSalesAreaText();return this};
//# sourceMappingURL=CustomerControlListItem.js.map