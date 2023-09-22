/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(function(){"use strict";var e=function(e){var n=0;var t={};var i=[];this.type="hashTable";this.setItem=function(s,u){var f;e.check(s!==undefined&&s!==null,"sap.apf.utils.HashTable.setItem: key undefined");e.check(u!==undefined&&u!==null,"sap.apf.utils.HashTable.setItem: value undefined");if(this.hasItem(s)){f=t[s]}else{n++;i.push(s)}t[s]=u;return f};this.getNumberOfItems=function(){return n};this.getItem=function(n){e.check(n!==undefined&&n!==null,"sap.apf.utils.HashTable.getItem key undefined");return this.hasItem(n)?t[n]:undefined};this.hasItem=function(n){e.check(n!==undefined&&n!==null,"sap.apf.utils.HashTable.hasItem key undefined");return t.hasOwnProperty(n)};this.removeItem=function(s){e.check(s!==undefined&&s!==null,"sap.apf.utils.HashTable.removeItem key undefined");var u;if(this.hasItem(s)){u=t[s];n--;i.splice(i.indexOf(s),1);delete t[s];return u}return undefined};this.getKeys=function(){var e=[];var n;for(n in t){if(this.hasItem(n)){e.push(n)}}return e};this.each=function(e){var n;for(n in t){if(this.hasItem(n)){e(n,t[n])}}};this.forEachOrdered=function(n){var s=this;i.forEach(function(i){if(!s.hasItem(i)){e.check(false,"sap.apf.utils.HashTable.forEachOrdered: key not contained")}else{n(i,t[i])}})};this.getKeysOrdered=function(){var e=[];this.forEachOrdered(function(n){e.push(n)});return e};this.moveUpOrDown=function(n,t){e.check(n!==undefined&&n!==null,"sap.apf.utils.HashTable.moveItemUpOrDown movedKey undefined");var s=i.indexOf(n);var u=s+t;if(s<0){return null}if(t<0){i.splice(s,1);if(u<0){i.splice(0,0,n);return 0}i.splice(s+t,0,n);return s+t}else if(t===0){return s}else if(t>0){i.splice(s,1);if(u>=i.length){i.splice(i.length,0,n);return i.length}i.splice(u,0,n);return u}};this.moveBefore=function(e,n){if(i.indexOf(e)<0||i.indexOf(n)<0){return null}if(e===n){return i.indexOf(n)}i.splice(i.indexOf(n),1);i.splice(i.indexOf(e),0,n);return i.indexOf(n)};this.moveToEnd=function(e){if(i.indexOf(e)<0){return null}i.splice(i.indexOf(e),1);i.push(e);return i.indexOf(e)};this.reset=function(){t={};i=[];n=0}};sap.apf=sap.apf||{};sap.apf.utils=sap.apf.utils||{};sap.apf.utils.Hashtable=e;return e},true);
//# sourceMappingURL=hashtable.js.map