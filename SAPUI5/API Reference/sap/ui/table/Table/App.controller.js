sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
  return Controller.extend('zms.App', {
    onInit: function () {
      this.getView().setModel(new JSONModel({
        rows: [
          {name:'张三', age: 18},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
          {name:'李四', age: 14},
        ]
      }))
    }
  })
})