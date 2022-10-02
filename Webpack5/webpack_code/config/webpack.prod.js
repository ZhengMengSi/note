const os = require("os");
const path = require("path");
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const threads = os.cpus().length;
// console.log(os.cpus())

function getStyleLoader(pre) {
    return [ // 从右向左或者从下到上执行
        MiniCssExtractPlugin.loader, // 提取css成单独的文件
        "css-loader", // 将css资源编译成commonjs的模块到js中
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            "postcss-preset-env",
                        ],
                    ],
                },
            },
        },
        pre
    ].filter(Boolean);
}

module.exports = {
    entry: "./src/main.js", // 相对路径
    output: {
        // 所有资源的输出目录
        path: path.resolve(__dirname, "../dist"), // 绝对路径
        // 入口js的输出名字
        filename: "static/js/[name].[contenthash:10].js",
        // 给打包输出的其他文件命名
        chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
        // 图片、字体等通过type:asset处理资源命名方式
        assetModuleFilename: "static/media/[contenthash:10][ext][query]",
        // 自动清空上次打包的内容
        clean: true
    },
    module: {
        rules: [
            {
                oneOf: [
                    // loader配置
                    {
                        test: /\.css$/i, // 只检测.css文件
                        use: getStyleLoader(),
                    },
                    {
                        test: /\.less$/i,
                        // loader: "xxx", // 只能使用一个loader
                        use: getStyleLoader("less-loader"),
                    },
                    {
                        test: /\.s[ac]ss$/i,
                        use: getStyleLoader("sass-loader"),
                    },
                    {
                        test: /\.styl$/i,
                        use: getStyleLoader("stylus-loader"),
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
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: "static/css/[name].chunk.[contenthash:10].css"
        }),
        // new CssMinimizerPlugin(),
        // new TerserWebpackPlugin({
        //     parallel: threads
        // }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            as: 'script'
        }),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
    optimization: {
        minimize: true,
        // 压缩操作
        minimizer: [
            // 压缩css
            new CssMinimizerPlugin(),
            // 压缩js
            new TerserWebpackPlugin({
                parallel: threads
            }),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            [
                                "svgo",
                                {
                                    plugins: [
                                        'preset-default',
                                        'prefixIds',
                                        {
                                            name: 'sortAttrs',
                                            params: {
                                                xmlnsOrder: 'alphabetical'
                                            }
                                        }
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
        // 代码分割
        splitChunks: {
            chunks: "all",
            // 其他的都用默认值
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}.js`
        }
    },
    mode: "production",
    devtool: "source-map",
}
