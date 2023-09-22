sap.ui.define(["sap/rules/ui/ast/provider/OperatorProvider","sap/rules/ui/ast/constants/Constants"],function(r,t){"use strict";var e;var a=function(){this._oOperatorProviderInstance=r.getInstance()};a.prototype.construct=function(r){var e;var a;this._oOperatorProviderInstance.reset();for(var o=0;o<r.length;o++){e=r[o];a=this._oOperatorProviderInstance.createOperator(e[t.NAME],e[t.NUMBEROFARGUMENTS],e[t.RETURNVALUE_BUSINESSDATA_TYPE_COLLECTION],e[t.RETURNVALUE_DATAOBJECT_TYPE_COLLECTION],e[t.LABEL],e[t.CATEGORY],e[t.SUPPORTED_FUNCTIONS]);this._oOperatorProviderInstance.addOperatorToNameMap(a);this._oOperatorProviderInstance.addOperatorToLabelMap(a);this._oOperatorProviderInstance.addOperatorToBusinessDataTypeMap(a);this._oOperatorProviderInstance.addOperatorToDataObjectTypeMap(a);this._oOperatorProviderInstance.addOperatorToCategoryMap(a)}};return{getInstance:function(){if(!e){e=new a;e.constructor=null}return e}}},true);
//# sourceMappingURL=OperatorBuilder.js.map