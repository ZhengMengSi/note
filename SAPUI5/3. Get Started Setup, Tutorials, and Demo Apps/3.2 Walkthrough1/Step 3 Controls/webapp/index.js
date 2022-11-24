sap.ui.define([
    'sap/m/Text'
], function (Text) {
    console.log(Text)

    var t = new Text({
        text: 'tom.zhang'
    })

    console.log(t)

    var p = t.placeAt("content")

    console.log(p)
    console.log(t === p)
})
