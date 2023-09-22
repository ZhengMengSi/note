/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";return{getTransformedExcludeOperation:function(t){var e={EQ:"NE",GE:"LT",LT:"GE",LE:"GT",GT:"LE",BT:"NB",Contains:"NotContains",StartsWith:"NotStartsWith",EndsWith:"NotEndsWith"}[t];return e?e:t},getSuggestionsFilter:function(){return function(t,e){var n,r,i=e.getCells(),s=new RegExp("\\("+t+".*?\\)$","gi");for(r=0;r<i.length;r++){if(i[r].getText){n=i[r].getText();if(n.toLowerCase().startsWith(t.toLowerCase())||s.test(n)){return true}}}return false}}}});
//# sourceMappingURL=FilterUtil.js.map