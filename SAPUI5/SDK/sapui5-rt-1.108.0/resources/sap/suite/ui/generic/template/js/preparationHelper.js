sap.ui.define(["sap/base/util/deepExtend","sap/suite/ui/generic/template/genericUtilities/FeError","sap/suite/ui/generic/template/genericUtilities/FeLogger","sap/suite/ui/generic/template/js/StableIdHelper"],function(e,t,i,a){"use strict";var n="js.preparationHelper";var r=new i(n).getLogger();function l(i,a,r,l,s,o,c){var p=e({},a);p.tableType=p.tableType||(p.gridTable?"GridTable":undefined);p.tableType=p.tableType||(p.treeTable?"TreeTable":undefined);p.tableSettings=p.tableSettings||{};p.tableSettings.type=p.tableSettings.type||p.tableType;p.tableSettings.multiSelect=p.tableSettings.multiSelect===undefined?p.multiSelect:p.tableSettings.multiSelect;p.tableSettings.inlineDelete=!!p.tableSettings.inlineDelete;p.tableSettings.multiSelect=!!p.tableSettings.multiSelect;p.tableSettings.selectionLimit=p.tableSettings.selectionLimit||200;var g=i.getODataEntitySet(l);var b=i.getODataEntityType(g.entityType);if(p.tableSettings.type!=="StandardList"&&p.tableSettings.type!=="ObjectList"){if(r.system.phone){p.tableSettings.type="ResponsiveTable"}else if(l){p.tableSettings.type=p.tableSettings.type||(b["sap:semantics"]==="aggregate"?"AnalyticalTable":"ResponsiveTable");if(p.tableSettings.type==="AnalyticalTable"&&!(b["sap:semantics"]==="aggregate")){p.tableSettings.type="GridTable"}}}if(c){var u=g["Org.OData.Capabilities.V1.SearchRestrictions"];if(!u||!u.Searchable||u.Searchable.Bool!=="false"){var f=c();p.tableSettings.searchSettings={};p.tableSettings.searchSettings.enabled=true;p.tableSettings.searchSettings.id=f}}if(b["com.sap.vocabularies.UI.v1.HeaderInfo"]){p.tableSettings.headerInfo=b["com.sap.vocabularies.UI.v1.HeaderInfo"]}if(p.tableSettings.multiSelect&&p.tableSettings.inlineDelete){throw new t(n,"Both inlineDelete and multiSelect options for table are not possible")}if(p.tableSettings.type!=="ResponsiveTable"&&p.tableSettings.inlineDelete){throw new t(n,"InlineDelete property is not supported for "+p.tableSettings.type+" type table")}if(p.tableSettings.inlineDelete){p.tableSettings.mode="Delete";p.tableSettings.onlyForDelete=true}else{var m=Array.isArray(o)&&o.some(function(e){return!(e.Inline&&e.Inline.Bool)&&(e.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"||e.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"&&e.RequiresContext&&e.RequiresContext.Bool==="true")});if(!m){for(var y in s){if(s[y].requiresSelection!==false){m=true;break}}}if(!m&&g["Org.OData.Capabilities.V1.DeleteRestrictions"]&&g["Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable&&g["Org.OData.Capabilities.V1.DeleteRestrictions"].Deletable.Bool==="false"){p.tableSettings.mode="None";p.tableSettings.onlyForDelete=false}else{if(p.tableSettings.type==="ResponsiveTable"){p.tableSettings.mode=p.tableSettings.multiSelect?"MultiSelect":"SingleSelectLeft"}else{p.tableSettings.mode=p.tableSettings.multiSelect?"MultiToggle":"Single"}p.tableSettings.onlyForDelete=!m}}delete p.gridTable;delete p.treeTable;delete p.tableType;delete p.multiSelect;return p.tableSettings}function s(e,t,i,a){var n=[i];if(a){n.push(a)}var r=n.join("#");return e.getODataEntityType(t)[r]}function o(e,t,i){function a(i){if(i[0]!=="/"){i=e.getODataEntityType(t,true)+"/"+i}return e.getObject(i.replace(/@/g,""))}function n(e){return e.PresentationVariant&&e.PresentationVariant.Path?a(e.PresentationVariant.Path):e.PresentationVariant}function r(e){var t=e.Visualizations&&e.Visualizations.find(function(e){return e.AnnotationPath.includes("com.sap.vocabularies.UI.v1.LineItem")});return t&&a(t.AnnotationPath)}var l=s(e,t,"com.sap.vocabularies.UI.v1.SelectionPresentationVariant",i);var o=l?n(l):s(e,t,"com.sap.vocabularies.UI.v1.PresentationVariant",i);return o&&r(o)||s(e,t,"com.sap.vocabularies.UI.v1.LineItem")}function c(e,t){var i={mTargetEntities:{},mProperty:{}};function a(){return{mTargetEntities:i.mTargetEntities,sForceLinkRendering:JSON.stringify(i.mProperty)}}var n=e.getODataEntityType(t.entityType);var l=[];var s={};if(!n||!n.navigationProperty){return a()}var o=n.property||[];o.forEach(function(e){if(e["com.sap.vocabularies.Common.v1.SemanticObject"]){l.push(e.name);s[e.name]={name:e.name,targetEntitiesWithSemanticObject:[],targetEntitiesWithDependent:[]}}});if(l.length==0){return a()}var c=function(e,t){return t.namespace===e};var p=function(e,t){return t.name===e};n.navigationProperty.forEach(function(t){if(t.name==="SiblingEntity"){return}var i=t.relationship;var a=i.lastIndexOf(".");var r=i.slice(0,a);var l=i.slice(a+1);var o=e.getObject("/dataServices/schema").find(c.bind(null,r));var g=o.association.find(p.bind(null,l));var b=g&&g.referentialConstraint;if(b&&b.dependent&&b.dependent.propertyRef){var u=e.getODataAssociationEnd(n,t.name);var f=e.getODataEntityType(u.type);if(f&&f["com.sap.vocabularies.UI.v1.QuickViewFacets"]){for(var m in b.dependent.propertyRef){var y=b.dependent.propertyRef[m];if(s.hasOwnProperty(y.name)){if(b.dependent.propertyRef.length==1){s[y.name].targetEntitiesWithDependent.unshift({entityType:f.namespace+"."+f.name,navName:t.name})}else{s[y.name].targetEntitiesWithDependent.push({entityType:f.namespace+"."+f.name,navName:t.name})}}}}}});var g=e.getODataEntityContainer();g.entitySet.forEach(function(t){if(n.name!==t.entityType){var i=e.getODataEntityType(t.entityType);if(i["com.sap.vocabularies.UI.v1.QuickViewFacets"]){var a=i.property||[];for(var r=0;r<a.length;r++){if(a[r]["com.sap.vocabularies.Common.v1.SemanticObject"]){for(var o=0;o<l.length;o++){if(a[r].name==l[o]){s[l[o]].targetEntitiesWithSemanticObject.push({entityType:i.namespace+"."+i.name});break}}}}}}});function b(e){return s[e].targetEntitiesWithDependent[0]}l.forEach(function(e){var t;if(s[e].targetEntitiesWithSemanticObject.length>0){if(s[e].targetEntitiesWithSemanticObject.length>1){r.warning("Quick View property "+e+"found in multiple Target Entities.")}for(var a=0;a<s[e].targetEntitiesWithSemanticObject.length;a++){for(var n=0;n<s[e].targetEntitiesWithDependent.length;n++){if(s[e].targetEntitiesWithSemanticObject[a].entityType==s[e].targetEntitiesWithDependent[n].entityType){t=s[e].targetEntitiesWithDependent[n];break}}if(t){break}}if(!t){t=b(e)}}else{t=b(e)}if(t){i.mTargetEntities[e]=t;i.mProperty[e]=true}});return a()}return{getNormalizedTableSettings:l,getAnnotation:s,getLineItemFromVariant:o,getTargetEntityForQuickView:c}});
//# sourceMappingURL=preparationHelper.js.map