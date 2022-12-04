sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
    console.log(ComponentContainer)

    var c = new ComponentContainer({
        name: 'zms',
        settings: {
            id: 'zms'
        },
        async: true
    })

    console.log(c)

    var p = c.placeAt('content')

    console.log(p)
})
