console.log('sap', sap)
console.log('sap.ui', sap.ui)
// https://sapui5.hana.ondemand.com/#/api/sap.ui%23methods/sap.ui.define
// sap.ui.define: 定义JS模块
console.log('sap.ui.define', sap.ui.define)

var m = sap.ui.define([

], function () {
    alert('UI5 is ready!')
})

console.log('m', m)
