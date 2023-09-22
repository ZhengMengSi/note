/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/model/SimpleType','sap/ui/model/FormatException','sap/ui/model/ParseException','sap/ui/model/ValidateException','sap/ui/model/type/String','sap/ui/mdc/library','sap/ui/mdc/condition/FilterOperatorUtil','sap/ui/mdc/condition/Condition','sap/ui/mdc/util/BaseType','sap/base/util/merge'],function(S,F,P,V,a,l,b,C,B,m){"use strict";var c=l.FieldDisplay;var d=S.extend("sap.ui.mdc.field.ConditionType",{constructor:function(v,w){S.apply(this,arguments);this.sName="Condition";this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");}});d.prototype.destroy=function(){S.prototype.destroy.apply(this,arguments);if(this._oDefaultType){this._oDefaultType.destroy();delete this._oDefaultType;}this._bDestroyed=true;};d.prototype.formatValue=function(v,I){if(v==undefined||v==null||this._bDestroyed){return null;}if(typeof v!=="object"||!v.operator||!v.values||!Array.isArray(v.values)){throw new F("No valid condition provided");}if(!I){I="string";}var T=j.call(this);var O=k.call(this);var w=n.call(this);var x=this.oFormatOptions.isUnit;q.call(this,v,O);if(x){v=m({},v);if(v.values[0]&&Array.isArray(v.values[0])){v.values[0]=v.values[0][1];}if(v.operator!=="EQ"&&v.operator!=="EEQ"){v.operator="EQ";if(v.values[1]){v.values.splice(1,1);}}}q.call(this,v,T);switch(this.getPrimitiveType(I)){case"string":case"any":if(v.operator==="EQ"&&(b.onlyEEQ(w)||u.call(this,T)==="boolean")){v=m({},v);v.operator="EEQ";}var D=i.call(this);var y=o.call(this);if(v.operator==="EEQ"&&D!==c.Value&&!v.values[1]&&y){var E=function(H){if(H instanceof F&&!y.getValidateInput()){return v;}else{throw H;}};var z=function(G){v=m({},v);if(G&&typeof G==="object"){v=s.call(this,v,G);}else if(v.values.length===1){v.values.push(G);}else{v.values[1]=G;}return v;};var A=this.oFormatOptions.bindingContext;var G;try{G=y.getTextForKey(v.values[0],v.inParameters,v.outParameters,A);}catch(H){return E.call(this,H);}if(G instanceof Promise){return G.then(function(G){v=z.call(this,G);return _.call(this,v);}.bind(this)).catch(function(H){v=E.call(this,H);return _.call(this,v);}.bind(this));}else{v=z.call(this,G);}}return _.call(this,v);default:if(T&&v.values.length>=1){return T.formatValue(v.values[0],I);}throw new F("Don't know how to format Condition to "+I);}};function _(v){var D=i.call(this);var T=j.call(this);if(this.oFormatOptions.hideOperator&&v.values.length>=1){return T.formatValue(v.values[0],"string");}var O=b.getOperator(v.operator);if(!O){throw new F("No valid condition provided, Operator wrong.");}return O.format(v,T,D);}d.prototype.parseValue=function(v,I){if(this._bDestroyed){return null;}if(!I){I="string";}else if(I==="any"&&typeof v==="string"){I="string";}var N=this.oFormatOptions.navigateCondition;if(N){var O=this.formatValue(N,I);if(O===v){return m({},N);}}var D=i.call(this);var w=o.call(this);var T=j.call(this);var x=k.call(this);var y=n.call(this);var z=this.oFormatOptions.isUnit;var A;if(v===null||v===undefined||(v===""&&!w)){if(!p.call(this,T)&&!z){return null;}}r.call(this,T);r.call(this,x);switch(this.getPrimitiveType(I)){case"string":var E;var G=false;var U=false;if(y.length===1){E=b.getOperator(y[0]);U=true;}else{var M=b.getMatchingOperators(y,v);if(M.length===0){E=b.getDefaultOperator(u.call(this,T));if(E&&y.indexOf(E.name)<0){E=undefined;}if(w&&!p.call(this,T)&&y.indexOf("EEQ")>=0){G=!!E&&E.name!=="EEQ";E=b.getEEQOperator();}U=true;}else{E=M[0];}}if(E){var H;var J=p.call(this,T);if(!J&&E.checkInput&&w){H=f.call(this,E,v,T,w,U,G,y,D,true);if(H instanceof Promise){return t.call(this,H);}else if(!H&&v===""){return e.call(this,null,T);}}else if(v===""&&!J){return e.call(this,null,T);}else{try{if(v===""&&J&&U){H=C.createCondition(E.name,[T.parseValue(v,"string",T._aCurrentValue)]);}else{H=E.getCondition(v,T,D,U);}}catch(K){if(K instanceof P&&x){x.parseValue(v,"string",x._aCurrentValue);}throw K;}}if(H){return e.call(this,H,T);}}throw new P("Cannot parse value "+v);default:if(T){if(y.length===1){A=y[0];}else{A=b.getDefaultOperator(u.call(this,T)).name;if(A&&y.indexOf(A)<0){A=undefined;}}if(A){return C.createCondition(A,[T.parseValue(v,I)]);}}throw new P("Don't know how to parse Condition from "+I);}};function e(v,T){var I=this.oFormatOptions.isUnit;var O=k.call(this);var U=null;if(I){var M;if(O._aCurrentValue){M=O._aCurrentValue[0];}if(v){if(v.operator!=="EEQ"&&v.operator!=="EQ"){throw new P("unsupported operator");}U=v.values[0];v.values=[[M,U],undefined];}else{v=C.createCondition("EEQ",[[M,null],undefined]);}q.call(this,v,O);}else if(v){var N=T.getMetadata().getName();var D=this.oFormatOptions.delegate;var w=this.oFormatOptions.payload;if(D&&D.getBaseType(w,N)===B.Unit&&!v.values[0][1]&&T._aCurrentValue){U=T._aCurrentValue[1]?T._aCurrentValue[1]:null;v.values[0][1]=U;if(v.operator==="BT"){v.values[1][1]=U;}}q.call(this,v,T);q.call(this,v,O);}return v;}function f(O,v,T,w,U,x,y,D,z){var K;var A;var E=true;var G=true;var H=false;var I;var J;var L=this.oFormatOptions.bindingContext;if(v===""){K=v;I=v;}else{var M=O.getValues(v,D,U);K=z?M[0]:M[1];A=z?M[1]:M[0];H=D!==c.Value;G=D===c.Value||D===c.ValueDescription;I=G?K||A:A||K;}var N=function(R){if(R&&!(R instanceof P)&&!(R instanceof F)){throw R;}if(!R._bNotUnique){if(z&&M[0]&&M[1]){return f.call(this,O,v,T,w,U,x,y,D,false);}if(x){return g.call(this,T,y,v,D);}}if(!w.getValidateInput()){return h.call(this,T,y,v,D);}throw new P(R.message);};var Q=function(W){if(W){return C.createCondition(O.name,[W.key,W.description],W.inParameters,W.outParameters);}else if(v===""){return null;}else{return N.call(this,new P(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[v])));}};try{J=T.parseValue(I,"string");T.validateValue(J);}catch(R){if(R&&!(R instanceof P)&&!(R instanceof V)){throw R;}E=false;G=false;J=undefined;}var W;try{W=w.getItemForValue(I,J,undefined,undefined,L,G,E,H);}catch(R){return N.call(this,R);}if(W instanceof Promise){return W.then(function(W){var X=Q.call(this,W);return e.call(this,X,T);}.bind(this)).catch(function(R){var X=N.call(this,R);return e.call(this,X,T);}.bind(this));}else{return Q.call(this,W);}}function g(T,O,v,D){var w=b.getDefaultOperator(u.call(this,T));var x;if(w&&O.indexOf(w.name)>=0){x=w.getCondition(v,T,D,true);}return x;}function h(T,O,v,D){var w;if(O.length===1){w=b.getOperator(O[0]);}else if(O.indexOf("EEQ")>=0){w=b.getEEQOperator();if(!w.test(v)&&O.indexOf("EQ")>=0){w=b.getOperator("EQ");}}else if(O.indexOf("EQ")>=0){w=b.getOperator("EQ");}if(!w){throw new P("Cannot parse value "+v);}var x=w.getCondition(v,T,c.Value,true);return x;}d.prototype.validateValue=function(v){var T=j.call(this);var O=k.call(this);var w=n.call(this);var I=this.oFormatOptions.isUnit;if(v===undefined||this._bDestroyed){return null;}else if(v===null){if(b.onlyEEQ(w)){try{if(T._sParsedEmptyString===""){T.validateValue("");}else{T.validateValue(null);}}catch(E){if(E instanceof V){throw E;}else{return null;}}}return null;}if(typeof v!=="object"||!v.operator||!v.values||!Array.isArray(v.values)){throw new V(this._oResourceBundle.getText("field.VALUE_NOT_VALID"));}var x=b.getOperator(v.operator,w);if(I){v=m({},v);if(v.values[0]&&Array.isArray(v.values[0])){v.values[0]=v.values[0][1];}x=b.getEEQOperator();}try{x.validate(v.values,T);}catch(y){if(y instanceof V&&O){x.validate(v.values,O);}throw y;}};function i(){var D=this.oFormatOptions.display;if(!D){D=c.Value;}return D;}function j(){var T=this.oFormatOptions.valueType;if(!T){if(!this._oDefaultType){this._oDefaultType=new a();}T=this._oDefaultType;}return T;}function k(){return this.oFormatOptions.originalDateType;}function n(){var O=this.oFormatOptions.operators;if(!O||O.length===0){O=b.getOperatorsForType(B.String);}return O;}function o(){var I=this.oFormatOptions.fieldHelpID;if(I){var v=sap.ui.getCore().byId(I);if(v&&v.isUsableForValidation()){return v;}}return null;}function p(T){return T&&T.isA("sap.ui.model.CompositeType");}function q(v,T){if(p.call(this,T)&&v&&v.values[0]){T._aCurrentValue=v.values[0];}}function r(T){if(p.call(this,T)&&!T._aCurrentValue){T._aCurrentValue=[];}}function s(v,R){v.values=[R.key,R.description];if(R.inParameters){v.inParameters=R.inParameters;}if(R.outParameters){v.outParameters=R.outParameters;}return v;}function t(v){if(this.oFormatOptions.asyncParsing){this.oFormatOptions.asyncParsing(v);}return v;}function u(T){var v=T.getMetadata().getName();var w=T.oFormatOptions;var x=T.oConstraints;var D=this.oFormatOptions.delegate;var y=this.oFormatOptions.payload;var z=D?D.getBaseType(y,v,w,x):B.String;if(z===B.Unit){z=B.Numeric;}return z;}return d;});