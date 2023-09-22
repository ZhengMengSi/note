sap.ui.define(["sap/fe/navigation/SelectionVariant","sap/fe/navigation/PresentationVariant","sap/ovp/cards/AnnotationHelper","sap/ovp/cards/CommonUtils","sap/ui/model/FilterOperator","sap/ovp/cards/Integration/Helpers/Filters","sap/base/util/merge","sap/ui/thirdparty/jquery","sap/fe/navigation/library"],function(t,e,a,r,i,n,o,jQuery,s){"use strict";var p=s.SuppressionBehavior;function l(t){if(t.startsWith("#")){t=t.slice(1)}var e=t.split("-");var a=e[0]||"";var r=e[1]?e[1].split("?")[0]:"";var i={};var n=e[1]?e[1].split("?")[1]:undefined;if(n){var o=n.split("&");for(var s=0;s<o.length;s++){var p=o[s];var l=p.split("=")[0];var v=p.split("=")[1];i[l]=v}}return{semanticObject:a,action:r,parameters:i}}function v(t){if(!t){return false}var e=t.getEntityType();var a=t.getCardPropertiesModel();if(e&&a){var r=a.getProperty("/identificationAnnotationPath");var i=e[r];if(t.isNavigationInAnnotation(i)){return true}}var a=t.getCardPropertiesModel();var n=a&&a.getProperty("/template");var o=["sap.ovp.cards.table","sap.ovp.cards.list","sap.ovp.cards.v4.table","sap.ovp.cards.v4.list"];if(o.indexOf(n)>-1&&t.checkLineItemNavigation()){return true}return false}function c(t,e){var a=t.getEntityNavigationEntries()||[];var r=a.length>0?a[0]:{};if(e.cardComponentName==="List"||e.cardComponentName==="Table"){var i=t.getCardItemsBinding(),n=i&&i.getAllCurrentContexts(),o=n&&n[0],s=t.getCardPropertiesModel().getProperty("/annotationPath"),p=t.getEntityNavigationEntries(o,s),l=p.length>0?p[0]:{};var v={};var c={};if(r&&r.type==="com.sap.vocabularies.UI.v1.DataFieldWithUrl"){c=u(t,r)}else if(r&&r.type==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){c=P(t,r)}if(l&&l.type==="com.sap.vocabularies.UI.v1.DataFieldWithUrl"){v=u(t,l)}else if(l&&l.type==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){v=P(t,l)}if(v&&v.semanticObject&&v.action){c["lineItemSemanticObject"]=v.semanticObject;c["lineItemAction"]=v.action}return c}if(r&&r.type==="com.sap.vocabularies.UI.v1.DataFieldWithUrl"){return u(t,r)}if(r&&r.type==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){return P(t,r)}}function u(t,e){if(!sap.ushell.Container){return}var a=sap.ushell.Container.getService("URLParsing");if(!a.isIntentUrl(e.url)){return{type:"url",url:e.url}}else{var r=P(t,e);if(r.semanticObject){return r}else{var i=a.parseShellHash(e.url);return P(t,i)}}}function f(t){var e=t.getCardPropertiesModel(),a=e.getProperty("/customParams"),i=t.getView().getBindingContext(),o=i?i.getObject():null,s;if(i&&typeof i.getAllData==="function"&&a){s=i.getAllData()}var p=h(o,s,i,t);var l=p&&p["navSelectionVariant"];if(l&&!r.isJSONData(l)){p["navSelectionVariant"]=n.removeExtraInfoVariant(l)}var v=p&&p["sNavPresentationVariant"];if(v&&!r.isJSONData(v)){p["sNavPresentationVariant"]=n.removeExtraInfoVariant(v)}return p}function g(t){var e=[];for(var a=0;a<t.property.length;a++){if(t.property[a]["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"]&&t.property[a]["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"].Bool){e.push(t.property[a].name)}}return e}function d(e,a){var r="{}";var i=new t(r);var n,o,s,p;var l=a._getFilterPreference();var v=e.filters;var c=e.parameters;for(var u=0;u<v.length;u++){n=v[u];if(n.path&&n.operator&&typeof n.value1!=="undefined"){o=n.value1.toString();s=typeof n.value2!=="undefined"?n.value2.toString():undefined;if(a._checkIfCardFiltersAreValid(l,n.path)){i.addSelectOption(n.path,n.sign,n.operator,o,s)}}}var f,g,d;for(var m=0;m<c.length;m++){p=c[m];if(!p.path||!p.value){continue}f=p.path.split("/").pop();f=f.split(".").pop();if(f.indexOf("P_")===0){g=f;d=f.substr(2)}else{g="P_"+f;d=f}if(i.getParameter(g)){continue}if(i.getParameter(d)){continue}i.addParameter(f,p.value)}return i}function m(t,e){var a={selectionVariant:"",staticPropertyMap:{}};var r=o({},t);var i={};if(t&&t.SelectOptions&&t.SelectOptions.length){r.SelectOptions=[];t.SelectOptions.forEach(function(t){var a=t&&t.Ranges;var n=t&&t.PropertyName;var o=a&&a.length===1;var s=a&&a[0];if(o&&s["Option"]==="EQ"&&!s["High"]&&s["Low"]&&!e.includes(n)&&s["Sign"]==="I"){i[n]=s["Low"]}else if(!e.includes(n)){r.SelectOptions.push(t)}})}a.selectionVariant=r||"";a.staticPropertyMap=i;return a}function h(t,n,o,s){var l=s.getCardPropertiesModel(),v=l&&l.getProperty("/staticContent"),c={};var u,f,h;if(!v){var P=a.getCardSelections(s.getCardPropertiesModel()),y=P.filters,S=P.parameters,b=s.getEntityType();y&&y.forEach(function(t){t.path=t.path.replace("/",".");switch(t.operator){case i.NE:t.operator=i.EQ;t.sign="E";break;case i.Contains:t.operator="CP";var e=t.value1;t.value1="*"+e+"*";break;case i.EndsWith:t.operator="CP";var e=t.value1;t.value1="*"+e;break;case i.StartsWith:t.operator="CP";var e=t.value1;t.value1=e+"*"}});P.filters=y;if(o&&t&&t.hasOwnProperty("$isOthers")){var O=o.getOtherNavigationDimensions();for(var C in O){var I=O[C];for(var N=0;N<I.length;N++){P.filters.push({path:C,operator:"EQ",value1:I[N],sign:"E"})}}}S&&S.forEach(function(t){t.path=t.path.replace("/",".")});P.parameters=S;var E=a.getCardSorters(s.getCardPropertiesModel());if(t){var C;for(var N=0;b.property&&N<b.property.length;N++){C=b.property[N].name;var V=t[C];if(t.hasOwnProperty(C)){if(Array.isArray(t[C])&&t[C].length===1){c[C]=t[C][0]}else if(jQuery.type(V)!=="object"){c[C]=V}}}}var D=l&&l.getProperty("/kpiAnnotationPath");var F=l&&l.getProperty("/template");if(D&&F==="sap.ovp.cards.charts.analytical"){var A=b[D];var U=A&&A.Detail;if(U&&U.RecordType==="com.sap.vocabularies.UI.v1.KPIDetailType"){c["kpiID"]=A.ID.String}}h=E&&new e(E);u=d(P,s);f=l&&l.getProperty("/staticParameters")}var j;if(n&&!n.bStaticLinkListIndex){j=s._processCustomParameters(n,u,c)}else if(n&&n.bStaticLinkListIndex){j=s._processCustomParameters(n,u)}else{j=s._processCustomParameters(c,u)}var M=j?p.ignoreEmptyString:null;if(f){for(var C in f){if(!c.hasOwnProperty(C)){c[C]=f[C]}}}var k=r.getNavigationHandler(),w=k&&k.mixAttributesAndSelectionVariant(c,u.toJSONString(),M),x=g(b);w=w&&w.toJSONObject();var L=m(w,x);return{sensitiveProperties:x,navSelectionVariant:L&&L.selectionVariant&&L.selectionVariant.SelectOptions.length?L.selectionVariant:null,staticPropertyMap:L&&L.staticPropertyMap,sNavPresentationVariant:h?h.toJSONObject():null}}function P(t,e){return{type:"intent",semanticObject:e.semanticObject,action:e.action,staticParams:f(t)}}return{getNavigationIntentFromAuthString:l,bCheckNavigationForCard:v,getNavigationParameters:c}},true);
//# sourceMappingURL=NavigationHelper.js.map