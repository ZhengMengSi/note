/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/mdc/util/BaseType'],function(B){"use strict";var F={getDataTypeClass:function(p,t){var e={"Edm.Boolean":"sap.ui.model.odata.type.Boolean","Edm.Byte":"sap.ui.model.odata.type.Byte","Edm.DateTime":"sap.ui.model.odata.type.DateTime","Edm.DateTimeOffset":"sap.ui.model.odata.type.DateTimeOffset","Edm.Decimal":"sap.ui.model.odata.type.Decimal","Edm.Double":"sap.ui.model.odata.type.Double","Edm.Float":"sap.ui.model.odata.type.Single","Edm.Guid":"sap.ui.model.odata.type.Guid","Edm.Int16":"sap.ui.model.odata.type.Int16","Edm.Int32":"sap.ui.model.odata.type.Int32","Edm.Int64":"sap.ui.model.odata.type.Int64","Edm.SByte":"sap.ui.model.odata.type.SByte","Edm.Single":"sap.ui.model.odata.type.Single","Edm.String":"sap.ui.model.odata.type.String","Edm.Time":"sap.ui.model.odata.type.Time"};if(e[t]){t=e[t];}else if(t&&t.startsWith("Edm.")){throw new Error("Invalid data type "+t);}return t;},getBaseType:function(p,t,f,c){switch(t){case"sap.ui.model.type.Date":return B.Date;case"sap.ui.model.odata.type.DateTime":if(c&&(c.displayFormat==="Date"||c.isDateOnly)){return B.Date;}else{return B.DateTime;}break;case"sap.ui.model.type.DateTime":case"sap.ui.model.odata.type.DateTimeOffset":return B.DateTime;case"sap.ui.model.type.Time":case"sap.ui.model.odata.type.Time":return B.Time;case"sap.ui.model.type.Boolean":case"sap.ui.model.odata.type.Boolean":case"sap.ui.mdc.base.type.Boolean":return B.Boolean;case"sap.ui.model.type.Unit":case"sap.ui.model.type.Currency":if(!f||!f.hasOwnProperty("showMeasure")||f.showMeasure){return B.Unit;}else{return B.Numeric;}break;case"sap.ui.model.type.Integer":case"sap.ui.model.type.Float":case"sap.ui.model.odata.type.Byte":case"sap.ui.model.odata.type.SByte":case"sap.ui.model.odata.type.Decimal":case"sap.ui.model.odata.type.Int16":case"sap.ui.model.odata.type.Int32":case"sap.ui.model.odata.type.Int64":case"sap.ui.model.odata.type.Single":case"sap.ui.model.odata.type.Double":return B.Numeric;default:return B.String;}},initializeTypeFromBinding:function(p,t,v){return{};},initializeInternalUnitType:function(p,t,T){}};return F;});