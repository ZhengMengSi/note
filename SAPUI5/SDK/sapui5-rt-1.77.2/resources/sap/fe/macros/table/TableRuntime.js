/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/model/json/JSONModel","sap/fe/macros/CommonHelper","sap/fe/library"],function(J,C,F){"use strict";var a=F.core.CreationMode;var T={displayTableSettings:function(e){var p=e.getSource().getParent(),s=sap.ui.getCore().byId(p.getId()+"-settings");C.fireButtonPress(s);},executeConditionalActionShortcut:function(b,s){var p=s.getParent();if(b!==a.CreationRow){var B=p.getActions().find(function(e){return e.getId().endsWith(b);});C.fireButtonPress(B);}else{var c=p.getAggregation("creationRow");if(c&&c.getApplyEnabled()&&c.getVisible()){c.fireApply();}}},setContexts:function(t,m,p,d,D,c,A){var b=A?A.split(","):[];var o=JSON.parse(c);var s=t.getSelectedContexts();var e=false;var f=[];var u=[];var l=[];var L={};var M;var g="/$contexts/"+p;var h=t.getModel(m);if(!h){h=new J();t.setModel(h,"$contexts");}L.aUnsavedContexts=[];L.aLockedContexts=[];h.setProperty("/$contexts",{});h.setProperty(g,{selectedContexts:s,numberOfSelectedContexts:s.length,deleteEnabled:true,deletableContexts:[],unSavedContexts:[],lockedContexts:[]});for(var i=0;i<s.length;i++){var S=s[i];var j=S.getObject();for(var k in j){if(k.indexOf("#")===0){var n=k;n=n.substring(1,n.length);M=h.getProperty(g);M[n]=true;h.setProperty(g,M);}}M=h.getProperty(g);if(d!="undefined"){if(S.getProperty(d)){if(D!=="undefined"&&j.IsActiveEntity===true&&j.HasDraftEntity===true){L=q(j,S);}else{f.push(S);L.isDeletable=true;}}M["deleteEnabled"]=L.isDeletable;}else if(D!=="undefined"&&j.IsActiveEntity===true&&j.HasDraftEntity===true){L=q(j,S);}else{f.push(S);}}function q(j,S){if(j.DraftAdministrativeData.InProcessByUser){l.push(S);}else{u.push(S);e=true;}return{aLockedContexts:l,aUnsavedContexts:u,isDeletable:e};}this.setActionEnablement(h,o,g,s);if(s.length>1){this.disableAction(h,b,g);}M["deletableContexts"]=f;M["unSavedContexts"]=L.aUnsavedContexts;M["lockedContexts"]=L.aLockedContexts;M["controlId"]=t.getId();h.setProperty(g,M);},setActionEnablement:function(c,A,s,S){for(var b in A){c.setProperty(s+"/"+b,false);var p=A[b];for(var i=0;i<S.length;i++){var o=S[i];var d=o.getObject();if(p===null&&!!d["#"+b]){c.setProperty(s+"/"+b,true);break;}else if(!!o.getObject(p)){c.setProperty(s+"/"+b,true);break;}}}},disableAction:function(c,A,s){A.forEach(function(b){c.setProperty(s+"/"+b,false);});}};return T;},true);