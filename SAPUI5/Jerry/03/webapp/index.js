sap.ui.define([
    'sap/m/Text'
], function(Text) {
    'use strict';
    
    const t = new Text({
        text: "Hello World",
        tooltip: "我是张梦思"
    });

    t.placeAt("content")
});