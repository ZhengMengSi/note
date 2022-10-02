const os = require("os");
const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const threads = os.cpus().length;

module.exports = {
    entry: "./src/main.js", // 相对路径
    output: {
        // 所有资源的输出目录
        // 开发模式没有输出，所以path可以省略
        // path: path.resolve(__dirname, "../dist"), // 绝对路径
        path: undefined,
        // 入口js的输出名字
        filename: "static/js/[name].js",
        // 给打包输出的其他文件命名
        chunkFilename: "static/js/[name].chunk.js",
        // 图片、字体等通过type:asset处理资源命名方式
        assetModuleFilename: "static/media/[hash:10][ext][query]",
        clean: true
    },
    module: {
        rules: [
            // loader配置
            {
                oneOf: [
                    {
                        test: /\.css$/i, // 只检测.css文件
                        use: [ // 从右向左或者从下到上执行
                            "style-loader", // 将js中css通过创建style标签添加到html文件中生效
                            "css-loader", // 将css资源编译成commonjs的模块到js中
                        ],
                    },
                    {
                        test: /\.less$/i,
                        // loader: "xxx", // 只能使用一个loader
                        use: [
                            // 使用多个loader
                            "style-loader",
                            "css-loader",
                            "less-loader", // 将less编译css
                        ],
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                            // Creates `style` nodes from JS strings
                            "style-loader",
                            // Translates CSS into CommonJS
                            "css-loader",
                            // Compiles Sass to CSS
                            "sass-loader",
                        ],
                    },
                    {
                        test: /\.styl$/i,
                        use: [
                            // Creates `style` nodes from JS strings
                            "style-loader",
                            // Translates CSS into CommonJS
                            "css-loader",
                            // Compiles stylus to CSS
                            "stylus-loader",
                        ],
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp)/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                // 小于10KiB的图片转base64
                                // 优点：减少请求数量；缺点：体积变大
                                maxSize: 10 * 1024
                            }
                        },
                        // generator: {
                        //     // 输出图片名称
                        //     filename: 'static/images/[hash:10][ext][query]'
                        // }
                    },
                    {
                        test: /\.(ttf|woff2?|mp3|mp4|avi)/,
                        type: "asset/resource",
                        // generator: {
                        //     filename: 'static/media/[hash:10][ext][query]'
                        // }
                    },
                    {
                        test: /\.js$/,
                        // exclude: /(node_modules|bower_components)/, // 排除node_modules下的文件
                        include: path.resolve(__dirname, "../src"),
                        use: [
                            {
                                loader: 'thread-loader',
                                options: {
                                    works: threads
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // presets: ['@babel/preset-env']
                                    cacheDirectory: true, // 开启babel缓存
                                    cacheCompression: false, // 关闭缓存文件压缩
                                    "plugins": ["@babel/plugin-transform-runtime"]
                                }
                            },
                        ]
                    },
                ]
            }
        ]
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'),
            cache: true,
            cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"),
            threads
        }),
        new HtmlWebpackPlugin({
            // 如果不传，只生成带一个script标签的html5文档
            template: path.resolve(__dirname, '../public/index.html'),
        }),
    ],
    mode: "development",
    // 开发服务器：不会输出资源，在内存中编译打包
    devServer: {
        // static: {
        //     directory: path.join(__dirname, 'public'),
        // },
        // compress: true,
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true
    },
    devtool: "cheap-module-source-map",
}
