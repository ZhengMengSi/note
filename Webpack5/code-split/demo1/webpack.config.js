const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // entry: './src/main.js', // 单入口
    entry: { // 多入口
        app: './src/app.js',
        main: './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        })
    ],
    mode: 'production'
}
