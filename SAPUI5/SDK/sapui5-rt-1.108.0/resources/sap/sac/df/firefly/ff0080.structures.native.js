function _typeof(e){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)
/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */}sap.ui.define(["sap/sac/df/firefly/ff0070.structures"],function(e){"use strict";e.NativeJsonParser=function(){e.DfDocumentParser.call(this);this._ff_c="NativeJsonParser";this.setup()};e.NativeJsonParser.prototype=new e.DfDocumentParser;e.NativeJsonParser.prototype.parseUnsafe=function(t){this.clearMessages();if(t===null||t===undefined){return null}return new e.NativeJsonProxyElement(JSON.parse(t))};e.NativeJsonParser.prototype.parse=function(t){var o;this.clearMessages();if(t===null){return null}var n=/^\uFEFF?|\u200B?/;if(n.test(t)){t=t.replace(n,"")}try{o=JSON.parse(t)}catch(t){this.addError(e.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR,t.message);return null}if(o===undefined){return null}return new e.NativeJsonProxyElement(o)};e.NativeJsonParser.prototype.convertFromNative=function(t){var o;this.clearMessages();if(t===null||t===undefined){return null}try{o=new e.NativeJsonProxyElement(t)}catch(t){this.addError(e.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR,t.message);return null}return o};e.NativeJsonParser.prototype.convertToNative=function(t){this.clearMessages();if(t===null||t===undefined){return null}else{try{var o=e.PrUtils.serialize(t,false,false,0);var n=JSON.parse(o);return n}catch(t){this.addError(e.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR,t.message);return null}}};e.NativeJsonParserFactory=function(){e.JsonParserFactory.call(this);this._ff_c="NativeJsonParserFactory"};e.NativeJsonParserFactory.prototype=new e.JsonParserFactory;e.NativeJsonParserFactory.staticSetup=function(){e.JsonParserFactory.setJsonParserFactory(new e.NativeJsonParserFactory)};e.NativeJsonParserFactory.prototype.newParserInstance=function(){return new e.NativeJsonParser};e.NativeJsonProxyElement=function(t){e.DfPrProxyElement.call(this);this.m_jsonRootElement=t;this._ff_c="NativeJsonProxyElement"};e.NativeJsonProxyElement.prototype=new e.DfPrProxyElement;e.NativeJsonProxyElement.prototype.releaseObject=function(){this.m_jsonRootElement=null;e.DfPrProxyElement.prototype.releaseObject.call(this)};e.NativeJsonProxyElement.prototype.put=function(e,t){if(t===null){delete this.m_jsonRootElement[e]}else{this.m_jsonRootElement[e]=t}};e.NativeJsonProxyElement.prototype.insert=e.NativeJsonProxyElement.prototype.put;e.NativeJsonProxyElement.prototype.getIndex=function(e){for(var t=0;t<this.m_jsonRootElement.length;t++){var o=this.getByKey(t);if(o===e||o!==null&&o.isEqualTo(e)){return t}}return-1};e.NativeJsonProxyElement.prototype.getKeyInternal=function(e){if(Array.isArray(this.m_jsonRootElement)){var t=this.getIndex(e);if(t>-1){return t}return null}for(var o in this.m_jsonRootElement){if(this.m_jsonRootElement.hasOwnProperty(o)){var n=this.getByKey(o);if(n===e||n!==null&&n.isEqualTo(e)){return o}}}return null};e.NativeJsonProxyElement.prototype.putNotNullAndNotEmpty=function(t,o){if(e.isNull(o)||o.isList()&&o.asList().isEmpty()||o.isStructure()&&o.asStructure().isEmpty()||o.isString()&&e.XStringUtils.isNullOrEmpty(o.asString().getString())){return}this.put(t,o)};e.NativeJsonProxyElement.prototype.remove=function(e){var t=this.m_jsonRootElement[e];if(t!==undefined){var o=this.getByKey(e);if(typeof e==="number"&&Array.isArray(this.m_jsonRootElement)){this.m_jsonRootElement.splice(e,1)}else{delete this.m_jsonRootElement[e]}return o}return null};e.NativeJsonProxyElement.prototype.removeAt=e.NativeJsonProxyElement.prototype.remove;e.NativeJsonProxyElement.prototype.removeElement=function(e){var t=this.getKeyInternal(e);if(t!==null){this.remove(t)}return e};e.NativeJsonProxyElement.prototype.getPermaCopy=function(){return new e.NativeJsonProxyElement(this.m_jsonRootElement)};e.NativeJsonProxyElement.prototype.asString=function(){return this};e.NativeJsonProxyElement.prototype.asNumber=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.asBoolean=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.asNull=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.asInteger=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.asLong=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.asDouble=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.asList=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.asStructure=e.NativeJsonProxyElement.prototype.asString;e.NativeJsonProxyElement.prototype.putString=function(e,t){this.m_jsonRootElement[e]=t};e.NativeJsonProxyElement.prototype.setStringAt=e.NativeJsonProxyElement.prototype.putString;e.NativeJsonProxyElement.prototype.putDouble=function(e,t){if(typeof t==="number"){this.m_jsonRootElement[e]=t}else{this.m_jsonRootElement[e]=parseFloat(t)}};e.NativeJsonProxyElement.prototype.setDoubleAt=e.NativeJsonProxyElement.prototype.putDouble;e.NativeJsonProxyElement.prototype.putBoolean=function(e,t){this.m_jsonRootElement[e]=t===true||t==="true"};e.NativeJsonProxyElement.prototype.setBooleanAt=e.NativeJsonProxyElement.prototype.putBoolean;e.NativeJsonProxyElement.prototype.putInteger=e.NativeJsonProxyElement.prototype.putDouble;e.NativeJsonProxyElement.prototype.putLong=e.NativeJsonProxyElement.prototype.putDouble;e.NativeJsonProxyElement.prototype.setIntegerAt=e.NativeJsonProxyElement.prototype.putDouble;e.NativeJsonProxyElement.prototype.setLongAt=e.NativeJsonProxyElement.prototype.putDouble;e.NativeJsonProxyElement.prototype.putNull=function(e){this.m_jsonRootElement[e]=null};e.NativeJsonProxyElement.prototype.setNullAt=e.NativeJsonProxyElement.prototype.putNull;e.NativeJsonProxyElement.prototype.setNullByName=e.NativeJsonProxyElement.prototype.putNull;e.NativeJsonProxyElement.prototype.set=function(e,t){this.m_jsonRootElement[e]=t};e.NativeJsonProxyElement.prototype.getType=function(){return this.getTypeOf(this.m_jsonRootElement)};e.NativeJsonProxyElement.prototype.hasElements=function(){return!this.isEmpty()};e.NativeJsonProxyElement.prototype.getElementTypeByKey=function(e){var t=this.m_jsonRootElement[e];return t===undefined?null:this.getTypeOf(t)};e.NativeJsonProxyElement.prototype.getElementTypeAt=e.NativeJsonProxyElement.prototype.getElementTypeByKey;e.NativeJsonProxyElement.prototype.getTypeOf=function(t){if(t===null){return e.PrElementType.THE_NULL}switch(_typeof(t)){case"string":return e.PrElementType.STRING;case"boolean":return e.PrElementType.BOOLEAN;case"number":return e.PrElementType.DOUBLE;case"object":if(Array.isArray(t)){return e.PrElementType.LIST}if(t instanceof e.PrElement){return t.getType()}return e.PrElementType.STRUCTURE;default:return null}};e.NativeJsonProxyElement.prototype.getString=function(){return this.m_jsonRootElement};e.NativeJsonProxyElement.prototype.getDouble=function(){if(typeof this.m_jsonRootElement==="number"){return this.m_jsonRootElement}return parseFloat(this.m_jsonRootElement)};e.NativeJsonProxyElement.prototype.getStringValue=e.NativeJsonProxyElement.prototype.getString;e.NativeJsonProxyElement.prototype.getInteger=e.NativeJsonProxyElement.prototype.getDouble;e.NativeJsonProxyElement.prototype.getIntegerValue=e.NativeJsonProxyElement.prototype.getDouble;e.NativeJsonProxyElement.prototype.getLong=e.NativeJsonProxyElement.prototype.getDouble;e.NativeJsonProxyElement.prototype.getLongValue=e.NativeJsonProxyElement.prototype.getDouble;e.NativeJsonProxyElement.prototype.getDoubleValue=e.NativeJsonProxyElement.prototype.getDouble;e.NativeJsonProxyElement.prototype.getBoolean=function(){return this.m_jsonRootElement===true||this.m_jsonRootElement==="true"};e.NativeJsonProxyElement.prototype.getBooleanValue=e.NativeJsonProxyElement.prototype.getBoolean;e.NativeJsonProxyElement.prototype.setString=function(e){this.m_jsonRootElement=e};e.NativeJsonProxyElement.prototype.setDouble=function(e){if(typeof this.m_jsonRootElement==="number"){this.m_jsonRootElement=e}else{this.m_jsonRootElement=parseFloat(e)}};e.NativeJsonProxyElement.prototype.setInteger=e.NativeJsonProxyElement.prototype.setDouble;e.NativeJsonProxyElement.prototype.setIntegerValue=e.NativeJsonProxyElement.prototype.setDouble;e.NativeJsonProxyElement.prototype.setLong=e.NativeJsonProxyElement.prototype.setDouble;e.NativeJsonProxyElement.prototype.setLongValue=e.NativeJsonProxyElement.prototype.setDouble;e.NativeJsonProxyElement.prototype.setDoubleValue=e.NativeJsonProxyElement.prototype.setDouble;e.NativeJsonProxyElement.prototype.setBoolean=function(e){this.m_jsonRootElement=e===true||e==="true"};e.NativeJsonProxyElement.prototype.setBooleanValue=e.NativeJsonProxyElement.prototype.setBoolean;e.NativeJsonProxyElement.prototype.containsKey=function(e){return this.m_jsonRootElement.hasOwnProperty(e)};e.NativeJsonProxyElement.prototype.contains=function(e){return this.getKeyInternal(e)!==null};e.NativeJsonProxyElement.prototype.getTypeOfElement=function(e){var t=this.m_jsonRootElement[e];if(t===undefined){throw new Error("Illegal State: Json Element not available: "+e)}return this.getTypeOf(t)};e.NativeJsonProxyElement.prototype.getStringByKey=function(t){var o=this.m_jsonRootElement[t];if(o instanceof e.PrElement){return o.asString().getString()}return o===undefined?null:o};e.NativeJsonProxyElement.prototype.getDoubleByKey=function(t){var o=this.m_jsonRootElement[t];if(o===undefined||o===null){return null}if(typeof o==="number"){return o}if(o instanceof e.PrElement){return o.asDouble().getDouble()}return parseFloat(o)};e.NativeJsonProxyElement.prototype.getIntegerByKey=e.NativeJsonProxyElement.prototype.getDoubleByKey;e.NativeJsonProxyElement.prototype.getLongByKey=e.NativeJsonProxyElement.prototype.getDoubleByKey;e.NativeJsonProxyElement.prototype.getBooleanByKey=function(t){var o=this.m_jsonRootElement[t];if(o===undefined||o===null){return null}if(o instanceof e.PrElement){return o.asBoolean().getBoolean()}return o===true||o==="true"};e.NativeJsonProxyElement.prototype.getKeysAsReadOnlyListOfString=function(){var t=new e.XListOfString;for(var o in this.m_jsonRootElement){if(this.m_jsonRootElement.hasOwnProperty(o)){t.add(o)}}return t};e.NativeJsonProxyElement.prototype.getByKey=function(t){var o=this.m_jsonRootElement[t];if(o===null||o===undefined){return null}if(o instanceof e.PrElement){return o}return new e.NativeJsonProxyElement(o)};e.NativeJsonProxyElement.prototype.getElementByName=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getStructureByKey=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getStructureByName=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getListByKey=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getListByName=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getElementAt=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getListAt=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getStructureAt=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.get=e.NativeJsonProxyElement.prototype.getByKey;e.NativeJsonProxyElement.prototype.getStringAt=function(t){var o=this.m_jsonRootElement[t];if(o instanceof e.PrElement){return o.asString().getString()}return o};e.NativeJsonProxyElement.prototype.getDoubleAt=function(t){var o=this.m_jsonRootElement[t];if(typeof o==="number"){return o}if(o instanceof e.PrElement){return o.asDouble().getDouble()}return parseFloat(o)};e.NativeJsonProxyElement.prototype.getIntegerAt=e.NativeJsonProxyElement.prototype.getDoubleAt;e.NativeJsonProxyElement.prototype.getBooleanAt=function(t){var o=this.m_jsonRootElement[t];if(o instanceof e.PrElement){return o.asBoolean().getBoolean()}return o===true||o==="true"};e.NativeJsonProxyElement.prototype.getLongAt=e.NativeJsonProxyElement.prototype.getDoubleAt;e.NativeJsonProxyElement.prototype.getStringAtExt=function(t,o){if(this.m_jsonRootElement.hasOwnProperty(t)){var n=this.m_jsonRootElement[t];if(n instanceof e.PrElement){return n.asString().getString()}else if(n!==undefined&&n!==null){return n}}return o};e.NativeJsonProxyElement.prototype.getDoubleAtExt=function(t,o){if(this.m_jsonRootElement.hasOwnProperty(t)){var n=this.m_jsonRootElement[t];if(typeof n==="number"){return n}if(typeof n==="string"){return parseFloat(n)}if(n instanceof e.PrElement){return n.asDouble().getDouble()}}return o};e.NativeJsonProxyElement.prototype.getIntegerAtExt=e.NativeJsonProxyElement.prototype.getDoubleAtExt;e.NativeJsonProxyElement.prototype.getLongAtExt=e.NativeJsonProxyElement.prototype.getDoubleAtExt;e.NativeJsonProxyElement.prototype.getBooleanAtExt=function(t,o){if(this.m_jsonRootElement.hasOwnProperty(t)){var n=this.m_jsonRootElement[t];if(n instanceof e.PrElement){return n.asBoolean().getBoolean()}else if(n!==undefined&&n!==null){return n===true||n==="true"}}return o};e.NativeJsonProxyElement.prototype.size=function(){if(_typeof(this.m_jsonRootElement)==="object"){if(Array.isArray(this.m_jsonRootElement)){return this.m_jsonRootElement.length}var e=0;for(var t in this.m_jsonRootElement){if(this.m_jsonRootElement.hasOwnProperty(t)){e++}}return e}return 0};e.NativeJsonProxyElement.prototype.isEmpty=function(){if(_typeof(this.m_jsonRootElement)==="object"){if(Array.isArray(this.m_jsonRootElement)){return this.m_jsonRootElement.length<1}for(var e in this.m_jsonRootElement){if(this.m_jsonRootElement.hasOwnProperty(e)){return false}}}return true};e.NativeJsonProxyElement.prototype.getStringByKeyExt=e.NativeJsonProxyElement.prototype.getStringAtExt;e.NativeJsonProxyElement.prototype.getBooleanByKeyExt=e.NativeJsonProxyElement.prototype.getBooleanAtExt;e.NativeJsonProxyElement.prototype.getIntegerByKeyExt=e.NativeJsonProxyElement.prototype.getDoubleAtExt;e.NativeJsonProxyElement.prototype.getLongByKeyExt=e.NativeJsonProxyElement.prototype.getDoubleAtExt;e.NativeJsonProxyElement.prototype.getDoubleByKeyExt=e.NativeJsonProxyElement.prototype.getDoubleAtExt;e.NativeJsonProxyElement.prototype.getObjectByKeyExt=e.NativeJsonProxyElement.prototype.getStringAtExt;e.NativeJsonProxyElement.prototype.putStringNotNull=function(e,t){if(t!==null){this.m_jsonRootElement[e]=t}};e.NativeJsonProxyElement.prototype.putStringNotNullAndNotEmpty=function(t,o){if(e.XStringUtils.isNotNullAndNotEmpty(o)){this.m_jsonRootElement[t]=o}};e.NativeJsonProxyElement.prototype.putNewList=function(t){this.m_jsonRootElement[t]=[];return new e.NativeJsonProxyElement(this.m_jsonRootElement[t])};e.NativeJsonProxyElement.prototype.setNewListByKey=e.NativeJsonProxyElement.prototype.putNewList;e.NativeJsonProxyElement.prototype.addAllStrings=function(t){if(t!==undefined&&t!==null){if(t instanceof e.XListOfString){for(var o=0;o<t.size();o=o+1e4){Array.prototype.push.apply(this.m_jsonRootElement,t.m_list.slice(o,o+1e4))}}else{for(var n=0;n<t.size();n++){this.m_jsonRootElement.push(t.get(n))}}}return this};e.NativeJsonProxyElement.prototype.addAll=function(e){if(e!==undefined&&e!==null){var t=e.getValuesAsReadOnlyList();if(t!==undefined&&t!==null){for(var o=0;o<t.size();o++){this.m_jsonRootElement.push(t.get(o))}}}return this};e.NativeJsonProxyElement.prototype.putNewStructure=function(t){this.m_jsonRootElement[t]={};return new e.NativeJsonProxyElement(this.m_jsonRootElement[t])};e.NativeJsonProxyElement.prototype.setNewStructureByKey=e.NativeJsonProxyElement.prototype.putNewStructure;e.NativeJsonProxyElement.prototype.getKeysAsReadOnlyListOfStringSorted=function(){var t=this.getKeysAsReadOnlyListOfString();if(t===null||t.isEmpty()){return t}t.sortByDirection(e.XSortDirection.ASCENDING);return t};e.NativeJsonProxyElement.prototype.hasStringByKey=function(t){if(this.containsKey(t)){return this.getElementTypeByKey(t)===e.PrElementType.STRING}return false};e.NativeJsonProxyElement.prototype.hasStringByName=e.NativeJsonProxyElement.prototype.hasStringByKey;e.NativeJsonProxyElement.prototype.getValuesAsReadOnlyList=function(){switch(_typeof(this.m_jsonRootElement)){case"object":if(Array.isArray(this.m_jsonRootElement)){return this}else{var t=new e.XList;for(var o in this.m_jsonRootElement){if(this.m_jsonRootElement.hasOwnProperty(o)){var n=this.getTypeOf(this.m_jsonRootElement[o]);if(n.isNumber()||n===e.PrElementType.BOOLEAN||n===e.PrElementType.STRING){t.add(this.getByKey(o))}}}return t}}return this};e.NativeJsonProxyElement.prototype.getIterator=function(){if(_typeof(this.m_jsonRootElement)==="object"&&Array.isArray(this.m_jsonRootElement)){return e.XIterator.createFromList(this)}return this.getValuesAsReadOnlyList().getIterator()};e.NativeJsonProxyElement.prototype.addPrimitive=function(e){this.m_jsonRootElement.push(e)};e.NativeJsonProxyElement.prototype.addNumeric=function(e){this.m_jsonRootElement.push(typeof e==="number"?e:parseFloat(e))};e.NativeJsonProxyElement.prototype.addString=e.NativeJsonProxyElement.prototype.addPrimitive;e.NativeJsonProxyElement.prototype.addBoolean=function(e){this.m_jsonRootElement.push(e===true||e==="true")};e.NativeJsonProxyElement.prototype.addInteger=e.NativeJsonProxyElement.prototype.addNumeric;e.NativeJsonProxyElement.prototype.addLong=e.NativeJsonProxyElement.prototype.addNumeric;e.NativeJsonProxyElement.prototype.addDouble=e.NativeJsonProxyElement.prototype.addNumeric;e.NativeJsonProxyElement.prototype.addNull=function(e){this.m_jsonRootElement.push(null)};e.NativeJsonProxyElement.prototype.addNewList=function(){var t=[];this.m_jsonRootElement.push(t);return new e.NativeJsonProxyElement(t)};e.NativeJsonProxyElement.prototype.addNewStructure=function(){var t={};this.m_jsonRootElement.push(t);return new e.NativeJsonProxyElement(t)};e.NativeJsonProxyElement.prototype.add=function(e){this.m_jsonRootElement.push(e)};e.NativeJsonProxyElement.prototype.clear=function(){if(this.m_jsonRootElement===null){return}switch(_typeof(this.m_jsonRootElement)){case"object":if(Array.isArray(this.m_jsonRootElement)){this.m_jsonRootElement.splice(0,this.m_jsonRootElement.length)}else if(this.m_jsonRootElement instanceof e.PrElement){if(this.getTypeOf(this.m_jsonRootElement)===e.PrElementType.STRUCTURE||this.getTypeOf(this.m_jsonRootElement)===e.PrElementType.LIST){this.m_jsonRootElement.clear()}}else{for(var t in this.m_jsonRootElement){if(this.m_jsonRootElement.hasOwnProperty(t)){delete this.m_jsonRootElement[t]}}}return;default:return}};e.NativeJsonProxyElement.prototype.createArrayCopy=function(){if(_typeof(this.m_jsonRootElement)==="object"&&Array.isArray(this.m_jsonRootElement)){var t=new e.XArray(0);for(var o=0;o<this.m_jsonRootElement.length;o++){t.m_list.push(this.getByKey(o))}return t}return null};e.NativeJsonProxyElement.prototype.createMapByStringCopy=function(){if(_typeof(this.m_jsonRootElement)==="object"&&!Array.isArray(this.m_jsonRootElement)){var t=new e.XHashMapByString;for(var o in this.m_jsonRootElement){if(this.m_jsonRootElement.hasOwnProperty(o)){t.getMapFromImplementation()[o]=this.getByKey(o)}}return t}return null};e.NativePrSerializer=function(e,t,o){this.m_sort=e;this.m_pretty=t;this.m_indentation=o};e.NativePrSerializer.escapeSlash=function(e){if(e.indexOf("/")!==-1){var t=new RegExp("/","g");return e.replace(t,"\\/")}return e};e.NativePrSerializer.prototype=new e.XObject;e.NativePrSerializer.prototype.serialize=function(t){var o=null;if(t!==null){var n=new e.NativeJsonSerializer(t,this.m_sort);if(this.m_pretty){o=e.NativePrSerializer.escapeSlash(JSON.stringify(n,null,this.m_indentation))}else{o=e.NativePrSerializer.escapeSlash(JSON.stringify(n))}}return o};e.NativePrSerializerFactory=function(){e.PrSerializerFactory.call(this);this._ff_c="NativePrSerializerFactory"};e.NativePrSerializerFactory.prototype=new e.PrSerializerFactory;e.NativePrSerializerFactory.staticSetup=function(){e.PrSerializerFactory.setActiveFactory(new e.NativePrSerializerFactory)};e.NativePrSerializerFactory.prototype.newInstance=function(t,o,n){return new e.NativePrSerializer(t,o,n)};e.NativeJsonExtractor=function(){e.DfDocumentParser.call(this);this._ff_c="NativeJsonExtractor"};e.NativeJsonExtractor.prototype=new e.DfDocumentParser;e.NativeJsonExtractor.staticSetup=function(){e.XJson.setJsonExtractor(new e.NativeJsonExtractor)};e.NativeJsonExtractor.prototype.extractJsonContent=function(t){if(t instanceof e.XJson){return t.getElement()}return e.PrUtils.deepCopyElement(new e.NativeJsonProxyElement(t))};e.NativeJsonSerializer=function(e,t){this._ff_c="NativeJsonSerializer";this.m_jsonObject=e;this.m_sort=t};e.NativeJsonSerializer.prototype=new e.XObject;e.NativeJsonSerializer.prototype.toJSON=function(){if(this.m_jsonObject===null||this.m_jsonObject===undefined){return null}switch(_typeof(this.m_jsonObject)){case"object":if(this.m_jsonObject instanceof e.NativeJsonProxyElement){return new e.NativeJsonSerializer(this.m_jsonObject.m_jsonRootElement,this.m_sort).toJSON()}var t;var o;var n,r;if(this.m_jsonObject instanceof e.PrElement){switch(this.m_jsonObject.getType()){case e.PrElementType.LIST:t=[];for(n=0;n<this.m_jsonObject.size();n++){t.push(new e.NativeJsonSerializer(this.m_jsonObject.get(n),this.m_sort))}return t;case e.PrElementType.STRUCTURE:t={};o=this.m_sort?this.m_jsonObject.getKeysAsReadOnlyListOfStringSorted():this.m_jsonObject.getKeysAsReadOnlyListOfString();for(n=0;n<o.size();n++){t[o.get(n)]=new e.NativeJsonSerializer(this.m_jsonObject.getByKey(o.get(n)),this.m_sort)}return t;case e.PrElementType.STRING:return this.m_jsonObject.asString().getString();case e.PrElementType.BOOLEAN:return this.m_jsonObject.asBoolean().getBoolean();case e.PrElementType.THE_NULL:return null;case e.PrElementType.INTEGER:r=this.m_jsonObject.asInteger().getInteger();if(typeof r!=="number"){return parseInt(r)}return r;case e.PrElementType.LONG:r=this.m_jsonObject.asLong().getLong();if(typeof r!=="number"){return parseInt(r)}return r;case e.PrElementType.DOUBLE:r=this.m_jsonObject.asDouble().getDouble();if(typeof r!=="number"){return parseFloat(r)}return r}}if(Array.isArray(this.m_jsonObject)){t=[];for(n=0;n<this.m_jsonObject.length;n++){t.push(new e.NativeJsonSerializer(this.m_jsonObject[n],this.m_sort))}return t}t={};o=Object.keys(this.m_jsonObject);if(this.m_sort){o=o.sort()}for(n=0;n<o.length;n++){t[o[n]]=new e.NativeJsonSerializer(this.m_jsonObject[o[n]],this.m_sort)}return t}return this.m_jsonObject};e.NativePrSerializer=function(e,t,o){this.m_sort=e;this.m_pretty=t;this.m_indentation=o};e.NativePrSerializer.escapeSlash=function(e){if(e.indexOf("/")!==-1){var t=new RegExp("/","g");return e.replace(t,"\\/")}return e};e.NativePrSerializer.prototype=new e.XObject;e.NativePrSerializer.prototype.serialize=function(t){var o=null;if(t!==null){var n=new e.NativeJsonSerializer(t,this.m_sort);if(this.m_pretty){o=e.NativePrSerializer.escapeSlash(JSON.stringify(n,null,this.m_indentation))}else{o=e.NativePrSerializer.escapeSlash(JSON.stringify(n))}}return o};e.NativePrSerializerFactory=function(){e.PrSerializerFactory.call(this);this._ff_c="NativePrSerializerFactory"};e.NativePrSerializerFactory.prototype=new e.PrSerializerFactory;e.NativePrSerializerFactory.staticSetup=function(){e.PrSerializerFactory.setActiveFactory(new e.NativePrSerializerFactory)};e.NativePrSerializerFactory.prototype.newInstance=function(t,o,n){return new e.NativePrSerializer(t,o,n)};e.NativeJsonFilteringSerializer=function(){this._ff_c="NativeJsonFilteringSerializer"};e.NativeJsonFilteringSerializer.prototype=new e.XObject;e.NativeJsonFilteringSerializer.prototype.serializeWithFilter=function(t,o){return JSON.stringify(new e.NativeJsonPrFilterWrapper(t,o))};e.NativeJsonPrFilterWrapper=function(e,t){this._ff_c="NativeJsonPrFilterWrapper";this.m_jsonObject=e;this.m_prFilter=t};e.NativeJsonPrFilterWrapper.prototype=new e.XObject;e.NativeJsonPrFilterWrapper.prototype.toJSON=function(){var t;if(this.m_jsonObject===null||this.m_jsonObject===undefined){return null}switch(_typeof(this.m_jsonObject)){case"object":if(this.m_jsonObject instanceof e.NativeJsonProxyElement){return new e.NativeJsonPrFilterWrapper(this.m_jsonObject.m_jsonRootElement,this.m_prFilter).toJSON()}var o;var n;var r;if(this.m_jsonObject instanceof e.PrElement){switch(this.m_jsonObject.getType()){case e.PrElementType.LIST:t=this.m_prFilter===null?null:this.m_prFilter.getListSubFilter();n=[];if(t){for(r=0;r<this.m_jsonObject.size();r++){t.submitIndex(r,this.m_jsonObject.get(r));n.push(new e.NativeJsonPrFilterWrapper(this.m_jsonObject.get(r)),this.m_prFilter)}}else{for(r=0;r<this.m_jsonObject.size();r++){n.push(new e.NativeJsonSerializer(this.m_jsonObject.get(r),true))}}return n;case e.PrElementType.STRUCTURE:n={};o=this.m_jsonObject.getKeysAsReadOnlyListOfStringSorted();for(r=0;r<o.size();r++){t=this.m_prFilter===null?null:this.m_prFilter.getSubFilter(o.get(r));if(t===null){n[o.get(r)]=new e.NativeJsonSerializer(this.m_jsonObject.getByKey(o.get(r)),true)}else if(!t.isIgnore(o.get(r),this.m_jsonObject.getByKey(o.get(r)))){n[o.get(r)]=new e.NativeJsonPrFilterWrapper(this.m_jsonObject.getByKey(o.get(r)),this.m_prFilter)}}return n;case e.PrElementType.STRING:return this.m_jsonObject.asString().getString();case e.PrElementType.INTEGER:return this.m_jsonObject.asInteger().getInteger();case e.PrElementType.LONG:return this.m_jsonObject.asLong().getLong();case e.PrElementType.DOUBLE:return this.m_jsonObject.asDouble().getDouble();case e.PrElementType.BOOLEAN:return this.m_jsonObject.asBoolean().getBoolean();case e.PrElementType.THE_NULL:return null}return new e.NativeJsonPrFilterWrapper(JSON.parse(this.m_jsonObject.toString()),this.m_prFilter).toJSON()}if(Array.isArray(this.m_jsonObject)){t=this.m_prFilter===null?null:this.m_prFilter.getListSubFilter();n=[];if(t){for(r=0;r<this.m_jsonObject.length;r++){t.submitIndex(r,new e.NativeJsonProxyElement(this.m_jsonObject[r]));n.push(new e.NativeJsonPrFilterWrapper(this.m_jsonObject[r],t))}}else{for(r=0;r<this.m_jsonObject.length;r++){n.push(new e.NativeJsonSerializer(this.m_jsonObject[r],true))}}return n}n={};o=Object.keys(this.m_jsonObject).sort();for(r=0;r<o.length;r++){t=this.m_prFilter===null?null:this.m_prFilter.getSubFilter(o[r]);if(t===null){n[o[r]]=new e.NativeJsonSerializer(this.m_jsonObject[o[r]],true)}else if(!t.isIgnore(o[r],new e.NativeJsonProxyElement(this.m_jsonObject[o[r]]))){n[o[r]]=new e.NativeJsonPrFilterWrapper(this.m_jsonObject[o[r]],t)}}return n}return this.m_jsonObject};e.NativeJsonFilteringSerializerFactory=function(){e.JsonFilteringSerializerFactory.call(this);this._ff_c="NativeJsonFilteringSerializerFactory"};e.NativeJsonFilteringSerializerFactory.prototype=new e.JsonFilteringSerializerFactory;e.NativeJsonFilteringSerializerFactory.staticSetup=function(){e.JsonFilteringSerializerFactory.setActiveFactory(new e.NativeJsonFilteringSerializerFactory)};e.NativeJsonFilteringSerializerFactory.prototype.newInstance=function(){return new e.NativeJsonFilteringSerializer};e.StructuresNativeModule=function(){e.DfModule.call(this);this._ff_c="StructuresNativeModule"};e.StructuresNativeModule.prototype=new e.DfModule;e.StructuresNativeModule.s_module=null;e.StructuresNativeModule.getInstance=function(){var t=e.StructuresNativeModule;if(t.s_module===null){if(e.StructuresModule.getInstance()===null){throw new Error("Initialization Exception")}t.s_module=e.DfModule.startExt(new e.StructuresNativeModule);e.NativeJsonParserFactory.staticSetup();e.NativeJsonExtractor.staticSetup();e.NativePrSerializerFactory.staticSetup();e.NativeJsonFilteringSerializerFactory.staticSetup();e.DfModule.stopExt(t.s_module)}return t.s_module};e.StructuresNativeModule.prototype.getName=function(){return"ff0080.structures.native"};e.StructuresNativeModule.getInstance();return sap.firefly});
//# sourceMappingURL=ff0080.structures.native.js.map