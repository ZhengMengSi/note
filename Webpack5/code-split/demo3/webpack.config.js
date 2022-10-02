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
    optimization: {
        splitChunks: {
            chunks: 'all',
            // minSize: 20000,
            // minRemainingSize: 0,
            // minChunks: 1,
            // maxAsyncRequests: 30,
            // maxInitialRequests: 30,
            // enforceSizeThreshold: 50000,
            cacheGroups: {
                // defaultVendors: {
                //     test: /[\\/]node_modules[\\/]/,
                //     priority: -10,
                //     reuseExistingChunk: true,
                // },
                default: {
                    minSize: 0,
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    mode: 'production'
}
