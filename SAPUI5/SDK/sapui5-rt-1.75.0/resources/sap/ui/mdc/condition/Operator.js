/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
*/
sap.ui.define(["sap/ui/base/Object","sap/ui/model/Filter","sap/ui/model/ParseException","sap/ui/Device","sap/base/Log","sap/base/util/ObjectPath","./Condition"],function(B,F,P,D,L,O,C){"use strict";var m=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");sap.ui.getCore().attachLocalizationChanged(function(){m=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");});var a=B.extend("sap.ui.mdc.condition.Operator",{constructor:function(c){B.apply(this,arguments);if(!c){throw new Error("Operator configuration missing");}if(!c.name){L.warning("Operator configuration expects a name property");}if(!c.filterOperator&&!c.getModelFilter){throw new Error("Operator configuration for "+c.name+" needs a default filter operator from sap.ui.model.FilterOperator or the function getModelFilter");}this.name=c.name;this.filterOperator=c.filterOperator;this.valueTypes=c.valueTypes;this.paramTypes=c.paramTypes;this.displayFormats=c.displayFormats;var t="operators."+this.name;this.longText=c.longText||g(t+".longText")||"";this.tokenText=c.tokenText||g(t+".tokenText")||"";var T=this.tokenText;if(D.browser.msie){T=T.replace(/\$/g,"$$$");}if(T){if(c.tokenParse){this.tokenParse=c.tokenParse.replace(/#tokenText#/g,T);for(var i=0;i<this.valueTypes.length;i++){var r=this.paramTypes?this.paramTypes[i]:this.valueTypes[i];this.tokenParse=this.tokenParse.replace(new RegExp("\\$"+i,"g"),r);}this.tokenParseRegExp=new RegExp(this.tokenParse,"i");}else{this.tokenParseRegExp=new RegExp(this.tokenText,"i");}}if(T){if(c.tokenFormat){this.tokenFormat=c.tokenFormat.replace(/\#tokenText\#/g,T);}else{this.tokenFormat=this.tokenText;}}if(c.format){this.format=c.format;}if(c.parse){this.parse=c.parse;}if(c.validate){this.validate=c.validate;}if(c.getModelFilter){this.getModelFilter=c.getModelFilter;}if(c.isEmpty){this.isEmpty=c.isEmpty;}if(c.createControl){this.createControl=c.createControl;}if(c.splitText){this.splitText=c.splitText;}if(c.hasOwnProperty("showInSuggest")){this.showInSuggest=c.showInSuggest;}this.exclude=!!c.exclude;}});a.ValueType={Self:"self",Static:"static"};function g(k,t){var b=k+(t?"."+t:""),T;if(m.hasText(b)){T=m.getText(b);}else if(t){T=m.getText(k);}else{T=b;}return T;}a.prototype.getTypeText=function(k,t){return g(k,t);};a.prototype.getModelFilter=function(c,f,t){var v=c.values[0];var o;var b;var d=f.split(",");if(Array.isArray(v)&&d.length>1){v=v[0];f=d[0];b=new F({path:d[1],operator:"EQ",value1:c.values[0][1]});}if(b&&v===undefined){o=b;b=undefined;}else if(this.valueTypes.length==1){o=new F({path:f,operator:this.filterOperator,value1:v});}else{var V=c.values[1];if(Array.isArray(V)&&d.length>1){V=V[0];}o=new F({path:f,operator:this.filterOperator,value1:v,value2:V});}if(b){o=new F({filters:[o,b],and:true});}if(c.inParameters){var e=[o];for(var i in c.inParameters){e.push(new F({path:i,operator:"EQ",value1:c.inParameters[i]}));}o=new F({filters:e,and:true});}return o;};a.prototype.isEmpty=function(c,t){var b=false;if(c){for(var i=0;i<this.valueTypes.length;i++){if(this.valueTypes[i]!==a.ValueType.Static){var v=c.values[i];if(v===null||v===undefined||v===""){b=true;break;}}}}return b;};a.prototype.format=function(V,c,t,d){var T=this.tokenFormat;var b=this.valueTypes.length;for(var i=0;i<b;i++){if(this.valueTypes[i]!==a.ValueType.Static){var v=V[i]!==undefined&&V[i]!==null?V[i]:"";if(this.valueTypes[i]!==a.ValueType.Self){t=this._createLocalType(this.valueTypes[i]);}var r=t?t.formatValue(v,"string"):v;T=T.replace(new RegExp("\\$"+i,"g"),r);}}return T;};a.prototype.parse=function(t,T){var M=t.match(this.tokenParseRegExp);var r;if(M){r=[];for(var i=0;i<this.valueTypes.length;i++){if([a.ValueType.Self,a.ValueType.Static].indexOf(this.valueTypes[i])===-1){T=this._createLocalType(this.valueTypes[i]);}try{var v=M[i+1];var V=this._parseValue(v,T);if(this.valueTypes[i]!==a.ValueType.Static){r.push(V);}}catch(e){L.warning(e.message);throw e;}}}return r;};a.prototype._parseValue=function(v,t){if(v===undefined){return v;}var c;if(t instanceof sap.ui.model.CompositeType&&t._aCurrentValue&&t.getParseWithValues()){c=t._aCurrentValue;}var V=t?t.parseValue(v,"string",c):v;if(c&&Array.isArray(V)){for(var j=0;j<V.length;j++){if(V[j]===undefined){V[j]=c[j];}}}return V;};a.prototype.validate=function(v,t){var c=this.valueTypes.length;for(var i=0;i<c;i++){var V=v[i]!==undefined&&v[i]!==null?v[i]:"";if(this.valueTypes[i]&&this.valueTypes[i]!==a.ValueType.Static){if([a.ValueType.Self,a.ValueType.Static].indexOf(this.valueTypes[i])===-1){t=this._createLocalType(this.valueTypes[i]);}if(t){t.validateValue(V);}}}};a.prototype._createLocalType=function(t){if(!this._oType){var T;var f;var c;if(typeof t==="string"){T=t;}else if(t&&typeof t==="object"){T=t.name;f=t.formatOptions;c=t.constraints;}sap.ui.requireSync(T.replace(/\./g,"/"));var o=O.get(T||"");this._oType=new o(f,c);}return this._oType;};a.prototype.test=function(t){return this.tokenParseRegExp.test(t);};a.prototype.getCondition=function(t,T,d){if(this.test(t)){var v=this.parse(t,T,d);if(v.length==this.valueTypes.length||this.valueTypes[0]===a.ValueType.Static){return C.createCondition(this.name,v);}else{throw new P("Parsed value don't meet operator");}}return null;};a.prototype.isSingleValue=function(){if(this.valueTypes.length>1&&this.valueTypes[1]){return false;}return true;};return a;});