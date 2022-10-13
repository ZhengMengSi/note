const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

const {createBundleRenderer} = require('vue-server-renderer')
const serverBundle = require('../dist/server/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/client/vue-ssr-client-manifest.json')
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    // template: fs.readFileSync(__dirname + '../public/index.temp.html', 'utf-8'),
    template: fs.readFileSync(path.resolve(__dirname, '../public/index.temp.html'), 'utf-8'),
    clientManifest
})

// app.use(express.static('../dist/client', {index: false}))
app.use(express.static('../dist/client'))

app.get('*', async (req, res) => {
    try {
        const context = {
            url: req.url,
        }
        const html = await renderer.renderToString(context)
        console.log(html);
        res.send(html)
    } catch (e) {
        res.status(500).send('internal server err!')
    }
})

app.listen(3000, () => {
    console.log('server start!')
})
