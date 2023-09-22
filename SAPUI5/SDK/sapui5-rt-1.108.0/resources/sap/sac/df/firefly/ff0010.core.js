/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/sac/df/firefly/ff0005.language.ext"],function(t){"use strict";t.XCompararorStringAsNumber=function(){};t.XCompararorStringAsNumber.prototype=new t.XObject;t.XCompararorStringAsNumber.prototype._ff_c="XCompararorStringAsNumber";t.XCompararorStringAsNumber.prototype.m_sortDirection=null;t.XCompararorStringAsNumber.prototype.setupExt=function(t){this.m_sortDirection=t};t.XCompararorStringAsNumber.prototype.compare=function(r,e){var o=t.XInteger.convertFromString(r);var n=t.XInteger.convertFromString(e);if(o===n){return 0}var i=1;if(o<n){i=-1}if(this.m_sortDirection===t.XSortDirection.DESCENDING){return-i}return i};t.XComparatorDouble=function(){};t.XComparatorDouble.prototype=new t.XObject;t.XComparatorDouble.prototype._ff_c="XComparatorDouble";t.XComparatorDouble.create=function(){return new t.XComparatorDouble};t.XComparatorDouble.prototype.compare=function(t,r){var e=t.getDouble();var o=r.getDouble();if(e===o){return 0}else if(e>o){return 1}else{return-1}};t.XComparatorLambda=function(){};t.XComparatorLambda.prototype=new t.XObject;t.XComparatorLambda.prototype._ff_c="XComparatorLambda";t.XComparatorLambda.create=function(r){var e=new t.XComparatorLambda;e.m_lambda=r;return e};t.XComparatorLambda.prototype.m_lambda=null;t.XComparatorLambda.prototype.compare=function(t,r){return this.m_lambda(t,r).getInteger()};t.XComparatorName=function(){};t.XComparatorName.prototype=new t.XObject;t.XComparatorName.prototype._ff_c="XComparatorName";t.XComparatorName.create=function(){return new t.XComparatorName};t.XComparatorName.prototype.compare=function(r,e){var o=r.getName();var n=e.getName();return t.XString.compare(o,n)};t.XComparatorString=function(){};t.XComparatorString.prototype=new t.XObject;t.XComparatorString.prototype._ff_c="XComparatorString";t.XComparatorString.create=function(r){var e=new t.XComparatorString;e.m_descending=r;return e};t.XComparatorString.prototype.m_descending=false;t.XComparatorString.prototype.compare=function(r,e){if(this.m_descending){return t.XString.compare(e.getString(),r.getString())}return t.XString.compare(r.getString(),e.getString())};t.XArrayUtils={copyFromStringArray:function(t,r,e,o,n){var i=e;var a=o;var s;for(var f=0;f<n;f++){s=t.get(i);r.set(a,s);i++;a++}},copyFromObjectArray:function(t,r,e,o,n){var i=e;var a=o;var s;for(var f=0;f<n;f++){s=t.get(i);r.set(a,s);i++;a++}}};t.XListUtils={addAllObjects:function(r,e){if(t.notNull(r)&&r!==e){var o=r.getValuesAsReadOnlyList();var n=o.size();for(var i=0;i<n;i++){e.add(o.get(i))}}},sublist:function(t,r,e,o){for(var n=e;n<=o;n++){r.add(t.get(n))}return r},addAllStrings:function(r,e){if(t.notNull(r)&&r!==e){var o=r.getValuesAsReadOnlyListOfString();var n=o.size();for(var i=0;i<n;i++){e.add(o.get(i))}}},reorderList:function(r,e){if(t.notNull(r)&&t.notNull(e)){if(r.size()===e.size()){var o=r.getKeysAsReadOnlyListOfString();if(o.size()===e.size()){var n=true;var i;for(var a=0;a<e.size();a++){i=e.get(a);if(!t.XString.isEqual(i,o.get(a))){n=false;break}}if(n===false){var s;var f;for(var u=0;u<e.size();u++){i=e.get(u);s=r.getByKey(i);if(t.isNull(s)){return}}for(var p=0;p<e.size();p++){i=e.get(p);s=r.getByKey(i);f=r.getIndex(s);r.moveElement(f,p)}}}}}},isListEquals:function(r,e){if(r===e){return true}if(t.isNull(r)||t.isNull(e)){return false}if(r.size()!==e.size()){return false}for(var o=0;o<r.size();o++){if(r.get(o)===null&&e.get(o)===null){continue}else if(r.get(o)===null||e.get(o)===null){return false}else if(!r.get(o).isEqualTo(e.get(o))){return false}}return true},isListOfStringEquals:function(r,e){if(t.isNull(e)){return false}if(r===e){return true}var o=e;if(r.size()!==o.size()){return false}for(var n=0;n<r.size();n++){if(!t.XString.isEqual(r.get(n),o.get(n))){return false}}return true},assertGetSetIndexValid:function(r,e){if(e<0||e>=r.size()){throw t.XException.createIllegalArgumentException("illegal index")}},assertInsertIndexValid:function(r,e){if(e<0||e>r.size()){throw t.XException.createIllegalArgumentException("illegal index")}}};t.XMapUtils={putAllObjects:function(t,r){var e=t.getKeysAsReadOnlyListOfString();var o=e.size();var n;var i;for(var a=0;a<o;a++){n=e.get(a);i=t.getByKey(n);r.put(n,i)}},putAllStrings:function(t,r){var e=t.getKeysAsReadOnlyListOfString();var o=e.size();var n;var i;for(var a=0;a<o;a++){n=e.get(a);i=t.getByKey(n);r.put(n,i)}}};t.XIteratorWrapper=function(){};t.XIteratorWrapper.prototype=new t.XObject;t.XIteratorWrapper.prototype._ff_c="XIteratorWrapper";t.XIteratorWrapper.create=function(r){var e=new t.XIteratorWrapper;e.m_iterator=r;return e};t.XIteratorWrapper.prototype.m_iterator=null;t.XIteratorWrapper.prototype.releaseObject=function(){this.m_iterator=null;t.XObject.prototype.releaseObject.call(this)};t.XIteratorWrapper.prototype.hasNext=function(){return this.m_iterator.hasNext()};t.XIteratorWrapper.prototype.next=function(){return this.m_iterator.next()};t.XObjectIterator=function(){};t.XObjectIterator.prototype=new t.XObject;t.XObjectIterator.prototype._ff_c="XObjectIterator";t.XObjectIterator.create=function(r){var e=new t.XObjectIterator;e.m_list=r;e.m_index=-1;return e};t.XObjectIterator.prototype.m_list=null;t.XObjectIterator.prototype.m_index=0;t.XObjectIterator.prototype.releaseObject=function(){this.m_list=null;t.XObject.prototype.releaseObject.call(this)};t.XObjectIterator.prototype.getList=function(){return this.m_list};t.XObjectIterator.prototype.hasNext=function(){return this.m_index+1<this.getList().size()};t.XObjectIterator.prototype.next=function(){this.m_index++;return this.getList().get(this.m_index)};t.XUniversalIterator=function(){};t.XUniversalIterator.prototype=new t.XObject;t.XUniversalIterator.prototype._ff_c="XUniversalIterator";t.XUniversalIterator.create=function(r){var e=new t.XUniversalIterator;e.m_list=r;e.m_index=-1;return e};t.XUniversalIterator.prototype.m_list=null;t.XUniversalIterator.prototype.m_index=0;t.XUniversalIterator.prototype.releaseObject=function(){this.m_list=null;t.XObject.prototype.releaseObject.call(this)};t.XUniversalIterator.prototype.getList=function(){return this.m_list};t.XUniversalIterator.prototype.hasNext=function(){return this.m_index+1<this.getList().size()};t.XUniversalIterator.prototype.next=function(){this.m_index++;return this.getList().get(this.m_index)};t.DfAbstractReadOnlyBinary=function(){};t.DfAbstractReadOnlyBinary.prototype=new t.XObjectExt;t.DfAbstractReadOnlyBinary.prototype._ff_c="DfAbstractReadOnlyBinary";t.DfAbstractReadOnlyBinary.prototype.isEmpty=function(){return!this.hasElements()};t.DfAbstractKeyBagOfString=function(){};t.DfAbstractKeyBagOfString.prototype=new t.DfAbstractReadOnlyBinary;t.DfAbstractKeyBagOfString.prototype._ff_c="DfAbstractKeyBagOfString";t.DfAbstractKeyBagOfString.prototype.getKeysAsIteratorOfString=function(){return this.getKeysAsReadOnlyListOfString().getIterator()};t.XSortDirection=function(){};t.XSortDirection.prototype=new t.XConstant;t.XSortDirection.prototype._ff_c="XSortDirection";t.XSortDirection.ASCENDING=null;t.XSortDirection.DESCENDING=null;t.XSortDirection.NONE=null;t.XSortDirection.DISABLED=null;t.XSortDirection.DEFAULT_VALUE=null;t.XSortDirection.staticSetup=function(){t.XSortDirection.ASCENDING=t.XConstant.setupName(new t.XSortDirection,"ASCENDING");t.XSortDirection.DESCENDING=t.XConstant.setupName(new t.XSortDirection,"DESCENDING");t.XSortDirection.DEFAULT_VALUE=t.XConstant.setupName(new t.XSortDirection,"DEFAULT");t.XSortDirection.NONE=t.XConstant.setupName(new t.XSortDirection,"NONE");t.XSortDirection.DISABLED=t.XConstant.setupName(new t.XSortDirection,"DISABLED")};t.DfAbstractMapByString=function(){};t.DfAbstractMapByString.prototype=new t.DfAbstractKeyBagOfString;t.DfAbstractMapByString.prototype._ff_c="DfAbstractMapByString";t.DfAbstractMapByString.prototype.getIterator=function(){return this.getValuesAsReadOnlyList().getIterator()};t.DfAbstractMapByString.prototype.putAll=function(r){t.XMapUtils.putAllObjects(r,this)};t.DfAbstractMapByString.prototype.putIfNotNull=function(r,e){if(t.notNull(e)){this.put(r,e)}};t.DfAbstractMapByString.prototype.isEqualTo=function(r){if(t.isNull(r)){return false}if(this===r){return true}var e=r;if(this.size()!==e.size()){return false}var o=this.getKeysAsIteratorOfString();while(o.hasNext()){var n=o.next();if(!e.containsKey(n)){return false}var i=this.getByKey(n);var a=e.getByKey(n);var s=i;var f=a;if(s!==f){if(t.isNull(i)){return false}if(!i.isEqualTo(a)){return false}}}t.XObjectExt.release(o);return true};t.DfAbstractMapOfStringByString=function(){};t.DfAbstractMapOfStringByString.prototype=new t.DfAbstractKeyBagOfString;t.DfAbstractMapOfStringByString.prototype._ff_c="DfAbstractMapOfStringByString";t.DfAbstractMapOfStringByString.prototype.getIterator=function(){return this.getValuesAsReadOnlyListOfString().getIterator()};t.DfAbstractMapOfStringByString.prototype.isEqualTo=function(r){if(t.isNull(r)){return false}if(this===r){return true}var e=r;if(this.size()!==e.size()){return false}var o=this.getKeysAsIteratorOfString();while(o.hasNext()){var n=o.next();if(!e.containsKey(n)){return false}if(!t.XString.isEqual(this.getByKey(n),e.getByKey(n))){return false}}t.XObjectExt.release(o);return true};t.DfAbstractMapOfStringByString.prototype.putAll=function(r){t.XMapUtils.putAllStrings(r,this)};t.DfAbstractSetOfString=function(){};t.DfAbstractSetOfString.prototype=new t.DfAbstractReadOnlyBinary;t.DfAbstractSetOfString.prototype._ff_c="DfAbstractSetOfString";t.DfAbstractSetOfString.prototype.getIterator=function(){return this.getValuesAsReadOnlyListOfString().getIterator()};t.DfAbstractSetOfString.prototype.addAll=function(r){t.XListUtils.addAllStrings(r,this)};t.DfAbstractSetOfString.prototype.isEqualTo=function(r){if(t.isNull(r)){return false}if(this===r){return true}var e=r;if(this.size()!==e.size()){return false}var o=this.getIterator();while(o.hasNext()){var n=o.next();if(!e.contains(n)){return false}}t.XObjectExt.release(o);return true};t.DfAbstractList=function(){};t.DfAbstractList.prototype=new t.DfAbstractReadOnlyBinary;t.DfAbstractList.prototype._ff_c="DfAbstractList";t.DfAbstractList.prototype.getValuesAsReadOnlyList=function(){return this};t.DfAbstractList.prototype.isEqualTo=function(r){return t.XListUtils.isListEquals(this,r)};t.DfAbstractList.prototype.addAll=function(r){t.XListUtils.addAllObjects(r,this)};t.DfAbstractList.prototype.contains=function(t){return this.getIndex(t)!==-1};t.DfAbstractList.prototype.getIndex=function(r){var e=this.size();var o=r;for(var n=0;n<e;n++){var i=this.get(n);if(i===o){return n}if(t.notNull(i)&&i.isEqualTo(o)){return n}}return-1};t.DfAbstractList.prototype.removeElement=function(t){var r=this.getIndex(t);if(r!==-1){this.removeAt(r)}return t};t.DfAbstractListOfString=function(){};t.DfAbstractListOfString.prototype=new t.DfAbstractReadOnlyBinary;t.DfAbstractListOfString.prototype._ff_c="DfAbstractListOfString";t.DfAbstractListOfString.prototype.getValuesAsReadOnlyListOfString=function(){return this};t.DfAbstractListOfString.prototype.isEqualTo=function(r){return t.XListUtils.isListOfStringEquals(this,r)};t.DfAbstractListOfString.prototype.addAll=function(r){t.XListUtils.addAllStrings(r,this)};t.CoreModule=function(){};t.CoreModule.prototype=new t.DfModule;t.CoreModule.prototype._ff_c="CoreModule";t.CoreModule.s_module=null;t.CoreModule.getInstance=function(){if(t.isNull(t.CoreModule.s_module)){t.DfModule.checkInitialized(t.LanguageExtModule.getInstance());t.CoreModule.s_module=t.DfModule.startExt(new t.CoreModule);t.XSortDirection.staticSetup();t.DfModule.stopExt(t.CoreModule.s_module)}return t.CoreModule.s_module};t.CoreModule.prototype.getName=function(){return"ff0010.core"};t.CoreModule.getInstance();return sap.firefly});
//# sourceMappingURL=ff0010.core.js.map