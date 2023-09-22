/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/XMLTemplateProcessor","sap/ui/model/json/JSONModel","sap/ui/core/util/XMLPreprocessor","sap/ui/core/Fragment","sap/m/MessageToast","sap/ui/mdc/field/InParameter","sap/ui/mdc/field/OutParameter","sap/base/Log","sap/fe/macros/field/FieldHelper"],function(q,X,J,a,F,M,I,O,L,b){"use strict";var w={};function _(v){return v.Parameters.some(function(p){return(p["@com.sap.vocabularies.UI.v1.Importance"]&&p["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember==="com.sap.vocabularies.UI.v1.ImportanceType/High");});}function c(v){var C=v.valueListInfo.$model.getMetaModel().getObject("/"+v.valueListInfo.CollectionPath+"@"),s=C["@Org.OData.Capabilities.V1.SearchRestrictions"]&&C["@Org.OData.Capabilities.V1.SearchRestrictions"].Searchable;return s===undefined?true:s;}var V={getColumnVisibility:function(v,o){if(!_(v)){return undefined;}else if(o&&o["@com.sap.vocabularies.UI.v1.Importance"]&&o["@com.sap.vocabularies.UI.v1.Importance"].$EnumMember==="com.sap.vocabularies.UI.v1.ImportanceType/High"){return undefined;}else{return"{_VHUI>/showAllColumns}";}},hasImportance:function(v){return _(v.getObject())?"Importance/High":"None";},getMinScreenWidth:function(v){return _(v)?"{= ${_VHUI>/minScreenWidth}}":"418px";},getWaitForPromise:function(){return w;},getValueListCollectionEntitySet:function(v){var m=v.getObject();return m.$model.getMetaModel().createBindingContext("/"+m.CollectionPath);},getValueListProperty:function(p){var v=p.getModel();var m=v.getObject("/");return m.$model.getMetaModel().createBindingContext("/"+m.CollectionPath+"/"+p.getObject());},getValueListInfo:function(f,m,p,C){var k,d,s="",P=m.getObject(p+"@sapui.name"),e,i=[],o=[],g="";return m.requestValueListInfo(p,true).then(function(v){var h=f.getInParameters().length+f.getOutParameters().length===0;v=v[v[""]?"":Object.keys(v)[0]];v.Parameters.forEach(function(j){e="/"+v.CollectionPath+"/"+j.ValueListProperty;var l=v.$model.getMetaModel().getObject(e)||{},n=v.$model.getMetaModel().getObject(e+"@")||{};if(!k&&j.$Type.indexOf("Out")>48&&j.LocalDataProperty.$PropertyPath===P){g=e;k=j.ValueListProperty;d=n["@com.sap.vocabularies.Common.v1.Text"]&&n["@com.sap.vocabularies.Common.v1.Text"].$Path;}if(!s&&l.$Type==="Edm.String"&&!n["@com.sap.vocabularies.UI.v1.HiddenFilter"]&&!n["@com.sap.vocabularies.UI.v1.Hidden"]){s=s.length>0?s+","+j.ValueListProperty:j.ValueListProperty;}if(h&&j.$Type!=="com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"&&j.LocalDataProperty.$PropertyPath!==P){var r="";if(C&&C.length>0){r=C+">/conditions/";}r="{"+r+j.LocalDataProperty.$PropertyPath+"}";if(j.$Type.indexOf("Out")>48){o.push(new O({value:r,helpPath:j.ValueListProperty}));}if(j.$Type.indexOf("In")>48){i.push(new I({value:r,helpPath:j.ValueListProperty}));}}});return{keyValue:k,descriptionValue:d,fieldPropertyPath:g,filters:s,inParameters:i,outParameters:o,valueListInfo:v};}).catch(function(h){var j=h.status&&h.status===404?"Metadata not found ("+h.status+") for value help of property "+p:h.message;L.error(j);M.show(j);});},createValueHelpDialog:function(p,f,t,o,v,s){var d=f.getMetadata().getName(),W=f.getContent&&f.getContent(),e=W.getId(),g=v.filters,i=v.inParameters,h=v.outParameters;if(!t){if(d.indexOf("FieldValueHelp")>-1){f.setTitle(v.valueListInfo.Label);f.setKeyPath(v.keyValue);f.setDescriptionPath(v.descriptionValue);f.setFilterFields(c(v)?"$search":"");}}function j(k){var l=X.loadTemplate(k,"fragment"),m=v.valueListInfo,n=new J(m),r=m.$model.getMetaModel(),S=new J({id:f.getId()});return a.process(l,{name:k},{bindingContexts:{valueList:n.createBindingContext("/"),entitySet:r.createBindingContext("/"+m.CollectionPath),source:S.createBindingContext("/")},models:{valueList:n,entitySet:r,source:S}}).then(function(l){var u={path:p,fragmentName:k,fragment:l};if(L.getLevel()===L.Level.DEBUG){V.ALLFRAGMENTS=V.ALLFRAGMENTS||[];V.ALLFRAGMENTS.push(u);}if(V.logFragment){setTimeout(function(){V.logFragment(u);},0);}return F.load({definition:l});});}t=t||j("sap.fe.macros.ValueListTable");if(g.length){o=o||(!s&&j("sap.fe.macros.ValueListFilterBar"));}else{o=Promise.resolve();}return Promise.all([t,o]).then(function(C){var t=C[0],o=C[1];if(t){t.setModel(v.valueListInfo.$model);L.info("Value List XML content created ["+p+"]",t.getMetadata().getName(),"MDC Templating");}if(o){o.setModel(v.valueListInfo.$model);L.info("Value List XML content created ["+p+"]",o.getMetadata().getName(),"MDC Templating");}if(t!==W.getTable()){W.setTable(t);delete w[e];}var k=s?"416px":"Auto";t.setContextualWidth(k);if(o&&o!==f.getFilterBar()){f.setFilterBar(o);}h.forEach(function(l){f.addOutParameter(l);});i.forEach(function(l){f.addInParameter(l);});});},showValueListInfo:function(p,f,s,C){var m=f.getModel(),o=m.getMetaModel(),W=f.getContent&&f.getContent(),d=W.getId(),t=W&&W.getTable&&W.getTable(),e=f&&f.getFilterBar&&f.getFilterBar(),E=t&&e,v;v=f.getModel("_VHUI");if(!v){v=new J({});f.setModel(v,"_VHUI");}v.setProperty("/showAllColumns",!s);v.setProperty("/minScreenWidth",!s?"418px":undefined);if(w[d]||E){return w["promise"+d];}else{if(!t){w[d]=true;}var P=V.getValueListInfo(f,o,p,C).then(function(g){if(f.getParent().getMetadata().getName()==="sap.ui.mdc.Field"){var h,i,j=g.valueListInfo;h=j.$model.getMetaModel().getObject(g.fieldPropertyPath+"@");i=j.$model.getMetaModel().getObject("/"+j.CollectionPath+"/$Type@");var D=b.displayMode(h,i);f.getParent().setProperty("display",D);}return V.createValueHelpDialog(p,f,t,e,g,s);}).catch(function(g){var h=g.status&&g.status===404?"Metadata not found ("+g.status+") for value help of property "+p:g.message;L.error(h);M.show(h);});w["promise"+d]=P;return P;}},setValueListFilterFields:function(p,f,s,C){var m=f.getModel(),o=m.getMetaModel();return V.getValueListInfo(f,o,p,C).then(function(v){f.setFilterFields(c(v)?"$search":"");});}};return V;},true);