const express = require('express')
const Vue = require('vue')

const app = express()

const renderer = require('vue-server-renderer').createRenderer()

const page = new Vue({
    template: '<div><h1>{{title}}</h1><div>hello, vue ssr!</div></div>',
    data: {
        title: 'jjj'
    }
})

app.get('/', async (req, res) => {
    try {
        const html = await renderer.renderToString(page)
        console.log(html);
        res.send(html)
    } catch (e) {
        res.status(500).send('internal server err!')
    }
})

app.listen(3000, () => {
    console.log('server start!')
})
