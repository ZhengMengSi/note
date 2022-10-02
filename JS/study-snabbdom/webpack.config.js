const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index-学习h函数.js',
    output: {
        publicPath: '/xuni',
        filename: 'bundle.js',
    },
    devServer: {
        port: 8080,
        static: 'www'
    }
};
