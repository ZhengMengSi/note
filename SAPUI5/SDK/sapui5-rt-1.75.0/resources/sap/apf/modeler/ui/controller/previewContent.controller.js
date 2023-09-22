/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(['sap/apf/utils/utils','sap/apf/ui/utils/constants','sap/apf/ui/utils/wrappedChartWithCornerTexts'],function(u,a,W){'use strict';var r,R,p,c,t,o,s,b;var T=sap.apf.ui.utils.CONSTANTS.representationTypes.TABLE_REPRESENTATION;function _(S){var i=S&&c.getTextPool().get(S),l;if(i!==undefined){l=i.TextElementDescription;}return l;}function d(m){var P=_(R[m]());if(P===undefined){P=_(p[m]());}return P;}function e(D,S){return D.sort(function(l,m){var n,i;for(i=0;i<S.length;i++){if(l[S[i].property]<m[S[i].property]){n=-1;}else if(l[S[i].property]>m[S[i].property]){n=1;}n=n*[1,-1][+!S[i].ascending];if(n!==0){return n;}}});}function f(l,A){var i=jQuery.Deferred();s.getEntityTypeMetadataAsPromise().done(function(m){var P,L,n=[];A.forEach(function(D){if(D.sProperty!==t("none")&&D.sProperty!==""){L=l(D.sProperty);if(L!==undefined){P=c.getTextPool().get(L).TextElementDescription;}else{P=s.getDefaultLabel(m,D.sProperty);}n.push({fieldName:D.sProperty,fieldDesc:P,kind:D.sContext});}});i.resolve(n);});return i.promise();}function g(P){var i=jQuery.Deferred();var l=[];if(P==="properties"&&R.getRepresentationType()===T){f(R.getPropertyTextLabelKey,o.getActualProperties()).done(function(A){l=A;});}else if(P==="dimensions"&&R.getRepresentationType()!==T){s.getEntityTypeMetadataAsPromise().done(function(E){f(R.getDimensionTextLabelKey,o.getActualDimensions().concat(o.getActualLegends())).done(function(A){l=A;});});}else if(P==="measures"&&R.getRepresentationType()!==T){s.getEntityTypeMetadataAsPromise().done(function(E){f(R.getMeasureTextLabelKey,o.getActualMeasures()).done(function(A){l=A;l.forEach(function(m){var n=R.getMeasureDisplayOption(m.fieldName);if(n){m.measureDisplayOption=n;}});});});}i.resolve(l);return i.promise();}function h(){var l=jQuery.Deferred();var S=[],m=[],i=0,n=3;var P=s.getProperties();s.getEntityTypeMetadataAsPromise().done(function(E){var D=s.getDimensionsProperties(E);var M=s.getMeasures(E);var C=R.getRepresentationType();var q=C!==T?Math.pow(n,D.length):7;for(i=0;i<q;i++){var v={};if(C===T){P.forEach(function(w){var x=w+" - "+sap.apf.utils.createRandomNumberString(4);v[w]=x;});}else{D.forEach(function(w,x){var y=w+" - "+(Math.floor(i/Math.pow(n,x))%n+1);v[w]=y;});M.forEach(function(w){var x=sap.apf.utils.createRandomNumberString(4);v[w]=x;});}S.push(v);}m=R.getOrderbySpecifications();if(m&&m.length){S=e(S,m);}l.resolve(S);});return l.promise();}function j(){var i=b.getConstructorOfRepresentationType(R.getRepresentationType());jQuery.sap.require(i);var l=sap.apf.utils.extractFunctionFromModulePathString(i);var P={};P.requiredFilters=[];function m(n){return n;}function E(){}var A={getTextNotHtmlEncoded:m,getTextHtmlEncoded:m,getEventCallback:E,getExits:function(){var n={};return n;},getUiApi:function(){var U={};U.getStepContainer=function(){return undefined;};return U;},createFilter:function(){return{getOperators:function(){return{EQ:true};},getTopAnd:function(){return{addOr:E};},getInternalFilter:function(){return{getProperties:function(){return[];}};}};},createMessageObject:E,putMessage:E,updatePath:E,selectionChanged:E,getActiveStep:function(){return{getSelectedRepresentation:function(){return{bIsAlternateView:true};}};}};g("dimensions").done(function(D){P.dimensions=D;});g("measures").done(function(n){P.measures=n;});g("properties").done(function(n){P.properties=n;});r=new l(A,P);if(r.chartType===T){r.oTableRepresentation.removeEventDelegate();r.oTableRepresentation.onAfterRendering(function(){return;});}var M={getPropertyMetadata:function(n){return{label:n};}};h().done(function(n){r.setData(n,M);});}function k(C){var P=C.byId("idPreviewContentDialog");P.setTitle(t("preview"));P.getEndButton().setText(t("close"));}sap.ui.controller("sap.apf.modeler.ui.controller.previewContent",{onInit:function(){var C=this;var P=C.byId("idPreviewContentDialog");R=C.getView().getViewData().oRepresentation;p=C.getView().getViewData().oParentStep;c=C.getView().getViewData().oConfigurationHandler;t=C.getView().getViewData().oCoreApi.getText;o=C.getView().getViewData().oRepresentationHandler;s=C.getView().getViewData().oStepPropertyMetadataHandler;b=C.getView().getViewData().oRepresentationTypeHandler;k(C);j();C._drawContent();P.open();},_drawContent:function(){this._drawMainChart();this._drawLikeStepInCarousel();},_drawLikeStepInCarousel:function(){var S=p.getTitleId();var i=_(S);var l={getSelectedRepresentation:function(){return r;}};var C=W.getClonedChart(l);var m={rightLower:d("getRightLowerCornerTextKey"),rightUpper:d("getRightUpperCornerTextKey"),leftLower:d("getLeftLowerCornerTextKey"),leftUpper:d("getLeftUpperCornerTextKey")};var n={mode:"preview",titleText:i,oCornerTexts:m};var w=new W.constructor(null,p,C,n);this._addChart(w.getContent());},_drawMainChart:function(){var S=p.getLongTitleId();var i=c.getTextPool().isInitialTextKey(S);var l=S&&!i?S:p.getTitleId();var m=r.getMainContent(_(l),480,330);var v={interaction:{selectability:{axisLabelSelection:true,legendSelection:true,plotLassoSelection:true,plotStdSelection:true,}}};if(m.setVizProperties!==undefined)m.setVizProperties(v);this.byId("idMainChart").addItem(m);},handleCloseButtonOfDialog:function(){var C=this;C.byId("idPreviewContentDialog").close();},handleClose:function(){var C=this;C.byId("idPreviewContentDialog").destroy();C.getView().destroy();},_addChart:function(i){this.byId("idThumbnail").addItem(i);}});});