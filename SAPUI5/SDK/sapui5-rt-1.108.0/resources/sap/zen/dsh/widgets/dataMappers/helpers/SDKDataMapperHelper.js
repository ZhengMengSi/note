/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";function e(e){this.getMeasureCounter=function(){return e};this.getAllRowValuesInOneArray=function(e,r,t,a,s,u,n){var l=[];var i=[];var h=e.length/this.getMeasureCounter()*r;var o=a;var g=t*r;var v=n?1:a;if(!s&&e.length!=0)o=e.length/this.getMeasureCounter()*(r+1);var p=0;if(!u){for(var f=h;f<o;++f){p++;var C=e[f]+"";i.push(parseFloat(C.replace(/,/g,"")));if(t==0||p==v){l.push(i);p=0;i=[]}}}else{if(n==true){h=0;g=r;o=a}for(f=h;f<o;++f){p++;C=e[g]+"";i.push(parseFloat(C.replace(/,/g,"")));if(t==0||p==t){l.push(i);p=0;i=[];g=this.getMeasureCounter()*t*l.length+t*r}else{if(n==true){g=g+this.getMeasureCounter()}else{g++}}}}return l};this.getAllColValuesInOneArrayRows=function(e,r,t){var a=[];var s=[];var u=0;var n=r;for(var l=0;l<e.length/this.getMeasureCounter();++l){u++;var i=e[n]+"";s.push(parseFloat(i.replace(/,/g,"")));if(t==0||u==t){a.push(s);u=0;s=[];n=this.getMeasureCounter()*t*a.length+t*r}else{n+=this.getMeasureCounter()}}return a};this.getAllColValuesInOneArray=function(e,r,t,a,s){var u=[];var n=[];var l=0;var i=a*r;if(!s){for(var h=0;h<e.length/this.getMeasureCounter();++h){l++;var o=e[i]+"";n.push(parseFloat(o.replace(/,/g,"")));if(t==0||l==a){u.push(n);l=0;n=[];i++}else{i++}}}else{i=r;for(h=0;h<e.length/this.getMeasureCounter();++h){l++;o=e[i]+"";n.push(parseFloat(o.replace(/,/g,"")));if(t==0||l==a){u.push(n);l=0;n=[];i++}else{i=i+this.getMeasureCounter()}}}return u};this.getAllRowValuesInArray=function(e,r,t,a,s){var u=[];var n=[];var l=e.length/this.getMeasureCounter()*r;var i=t;var h=t*r;if(!a)i=e.length/this.getMeasureCounter()*(r+1);var o=0;if(!s){for(var g=l;g<i;++g){o++;var v=e[g]+"";n.push(parseFloat(v.replace(/,/g,"")));if(t==0||o==t){u.push(n);o=0;n=[]}}}else{for(g=l;g<i;++g){o++;v=e[h]+"";n.push(parseFloat(v.replace(/,/g,"")));if(t==0||o==t){u.push(n);o=0;n=[];h=this.getMeasureCounter()*t*u.length+t*r}else{h++}}}return u};this.getAllColValuesInArray=function(e,r,t,a){var s=[];var u=[];var n=0;if(a){for(var l=0;l<e.length/this.getMeasureCounter();++l){n++;var i=e[r]+"";u.push(parseFloat(i.replace(/,/g,"")));r+=this.getMeasureCounter();if(t==0||n==t){s.push(u);n=0;u=[]}}}else{var h=t*r;for(l=0;l<e.length/this.getMeasureCounter();++l){n++;i=e[h]+"";u.push(parseFloat(i.replace(/,/g,"")));if(t==0||n==t){s.push(u);n=0;u=[];h=this.getMeasureCounter()*t*s.length+t*r}else{h++}}}return s};this.getFirstMeasureColValuesInArray=function(e,r,t){var a=[];var s=[];var u=0;for(var n=0;n<t;++n){u++;var l=e[r]+"";s.push(parseFloat(l.replace(/,/g,"")));r+=e.length/t;if(t==0||u==t){a.push(s);u=0;s=[]}}return a};this.setMeasuresOnAxis=function(e,r,t,a){var s={};s.index=e;s.data=[];var u;if(a==true){u={};u.name="";u.type="Dimension";u.values=[""];s.data.push(u)}else{for(var n=0;n<r.dimensions.length;n++){var l=r.dimensions[n];u={};u.name=l.text;u.type="Dimension";u.values=[];u.isMeasure=true;for(var i=0;i<l.members.length;i++){u.values.push(l.members[i].text)}s.data.push(u)}}t.push(s)}}return e});
//# sourceMappingURL=SDKDataMapperHelper.js.map