const createApp = require('./app')
const server = require('express')();

const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const renderer = require('vue-server-renderer').createRenderer({
    template,
});

const context = {
    title: 'vue ssr',
    metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

server.get('*', (req, res) => {
    const data = { url: req.url }
    const app = createApp(data)

    renderer
        .renderToString(app, context, (err, html) => {
            console.log(html);
            if (err) {
                res.status(500).end('Internal Server Error')
                return;
            }
            res.end(html);
        });
})

server.listen(8080);
