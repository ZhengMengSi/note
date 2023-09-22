// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell_abap/pbServices/ui2/Utils","sap/ushell_abap/pbServices/ui2/Error","sap/base/Log"],function(e,t,r){"use strict";var n=function(n,a,i,s){var u,l=false,o=false,p=this;function f(){if(l){throw new t("The previous reset operation is not finished yet","Bag")}}function c(){if(o){throw new t("The previous save operation is not finished yet","Bag")}}function h(t,r){var n=t.Properties&&t.Properties.results||t.ChipInstanceProperties&&t.ChipInstanceProperties.results||t.ChipProperties&&t.ChipProperties.results||[];u=u||new e.Map;n.forEach(function(e){var t=e.name,n;if(!r||r.containsKey(t)){n=u.put(t,e);e.$currentValue=n?n.$currentValue:e.value}});delete t.ChipInstanceProperties;delete t.ChipProperties;delete t.Properties}function g(t,r){var n;if(t.length===0){u.keys().forEach(function(e){if(r===(u.get(e).translatable==="X")){t.push(e)}});return t}n=new e.Map;t.forEach(function(e){n.put(e)});u.keys().forEach(function(e){if(r===(u.get(e).translatable==="X")){n.put(e)}});return n.keys()}function d(){if(a.instanceId){return{pageId:a.pageId,instanceId:a.instanceId}}return{id:a.pageId}}function b(e,r,n){var a;if(!e){throw new t("Property name must not be empty","sap.ushell_abap.pbServices.ui2.Bag")}if(typeof e!=="string"){throw new t("Property name must be a string","sap.ushell_abap.pbServices.ui2.Bag")}a=u.get(e);if(a&&a.translatable==="X"!==n){throw new t("'"+e+"' already exists as a "+(n?"non-translatable":"translatable text")+" property","sap.ushell_abap.pbServices.ui2.Bag")}if(typeof r!=="string"){throw new t("Property value must be a string","sap.ushell_abap.pbServices.ui2.Bag")}f();if(!a){a={name:e,translatable:n?"X":" "};u.put(e,a)}a.$currentValue=r;return p}this.getId=function(){return a.id};this.getOwnPropertyNames=function(){return g([],false)};this.getOwnTextNames=function(){return g([],true)};this.getProperty=function(e,r){var n=u.get(e);if(n&&n.translatable==="X"){throw new t("'"+e+"' is a translatable text property","sap.ushell_abap.pbServices.ui2.Bag")}if(n){return n.$currentValue}if(i){return i.getProperty(e,r)}return r};this.getPropertyNames=function(){var e=i?i.getPropertyNames():[];return g(e,false)};this.getText=function(e){var r=u.get(e);if(r&&r.translatable!=="X"){throw new t("'"+e+"' is a non-translatable property","sap.ushell_abap.pbServices.ui2.Bag")}if(r){return r.$currentValue}if(i){return i.getText(e)}return e};this.getTextNames=function(){var e=i?i.getTextNames():[];return g(e,true)};this.reset=function(r,i){var o=d(),g=n.getPageBuildingService();function b(e){l=false;a=e;u=undefined;h(a);if(s){s(p)}r()}if(typeof r!=="function"){throw new t("Missing success handler","sap.ushell_abap.pbServices.ui2.Bag")}c();f();l=true;i=i||g.getDefaultErrorHandler();if(a.$tmp){e.callHandler(b.bind(null,a),i,true);return}g.deleteBag(o,a.id,function(){a.$tmp=true;g.readBag(o,a.id,b,b.bind(null,a))},function(){l=false;i.apply(null,arguments)})};this.resetProperty=function(e){var t;t=u.get(e);if(t){t.$currentValue=undefined;if(!Object.prototype.hasOwnProperty.call(t,"value")){u.remove(e)}}return this};this.save=function(r,i){var l=0,g=new e.Map,b={},v={},y=d(),w=n.getPageBuildingService();if(typeof r!=="function"){throw new t("Missing success handler","sap.ushell_abap.pbServices.ui2.Bag")}if(typeof i!=="function"){throw new t("Missing error handler","sap.ushell_abap.pbServices.ui2.Bag")}c();f();w.openBatchQueue();u.keys().forEach(function(e){var t,r=u.get(e);function n(t,r){b[e]=t;v[e]=r}if(r.$currentValue!==r.value){l+=1;if(Object.prototype.hasOwnProperty.call(r,"value")){if(r.$currentValue===undefined){g.put(e);w.deleteProperty(r,function(){if(r.$currentValue===undefined){u.remove(e)}else{delete r.value}},n)}else{t=JSON.parse(JSON.stringify(r));t.value=r.$currentValue;w.updateProperty(t,function(){r.value=t.value},n)}}else{w.createProperty(y,a.id,e,r.$currentValue,r.translatable,function(t){t.$currentValue=r.$currentValue;u.put(e,t)},n)}}});if(g.keys().length){w.readBag(y,a.id,function(e){h(e,g)})}o=true;w.submitBatchQueue(function(){o=false;if(s&&l>Object.keys(b).length){s(p)}if(Object.keys(b).length>0){i(b,v)}else{a.$tmp=false;r()}})};this.setProperty=function(e,t){return b(e,t,false)};this.setText=function(e,t){return b(e,t,true)};this.toString=function(e){var t=['Bag({id:"',a.id,'",pageId:"',a.pageId];if(a.instanceId){t.push('",instanceId:"',a.instanceId)}t.push('"');if(e){t.push(",oAlterEgo:",JSON.stringify(a));t.push(",oPropertiesByName:",u.toString());t.push(",bResetting:",l);t.push(",bSaving:",o)}t.push("})");return t.join("")};this.update=function(e){if(!e||a.id!==e.id){throw new t("Bag data belongs to another bag","sap.ushell_abap.pbServices.ui2.Bag")}u=undefined;h(e)};this._getChangeHandler=function(){return s};this._getRawBagData=function(){return a};this._getParentBag=function(){return i};h(a);r.debug("Created: "+this,null,"sap.ushell_abap.pbServices.ui2.Bag")};return n});
//# sourceMappingURL=Bag.js.map