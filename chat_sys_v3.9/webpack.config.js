const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
// const autoprefixer = require('autoprefixer');
// const pxtorem = require('postcss-pxtorem');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const NPM_TARGET = process.env.npm_lifecycle_event; //eslint-disable-line no-process-env

var DEV = false;
var FULLMAP = false;
var TEST = false;
if (NPM_TARGET === 'run' || NPM_TARGET === 'run-fullmap') {
    DEV = true;
    if (NPM_TARGET === 'run-fullmap') {
        FULLMAP = true;
    }
}

if (NPM_TARGET === 'test') {
    DEV = false;
    TEST = true;
}

var config = {
    entry: ['babel-polyfill', 'whatwg-fetch', './root.jsx', 'root.html'],
    output: {
        path: path.join(__dirname, './dist/static'),
        publicPath: '/static/',
        filename: '[name].16.js',
        chunkFilename: '[name].21.js'
    },
    // output: {
    //     path: 'dist',
    //     publicPath: '/static/',
    //     filename: '[name].[hash].js',
    //     chunkFilename: '[name].[chunkhash].js'
    // },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|non_npm_dependencies)/,
                query: {
                    presets: [
                        'react',
                        ['es2015', {modules: false}],
                        'stage-0'
                    ],
                    plugins: [
                      ['transform-runtime'],
                      ["import", [
                        { "style": "css", "libraryName": "antd-mobile"},
                        { "style": true, "libraryName": "antd"}
                      ]]
                    ],
                    cacheDirectory: DEV
                }
            },
            {
                test: /\.json$/,
                exclude: /manifest\.json$/,
                loader: 'json-loader'
            },
            {
                test: /manifest\.json$/,
                loader: 'file-loader?name=files/[hash].[ext]'
            },
            {
                test: /(node_modules|non_npm_dependencies)(\\|\/).+\.(js|jsx)$/,
                loader: 'imports-loader',
                query: {
                    $: 'jquery',
                    jQuery: 'jquery'
                }
            },
            {
              test: /\.less$/,
              use: [
                  {loader:'style-loader'},
                  {loader:'css-loader'},
                  {
                    loader:'postcss-loader',
                    options: {
                      plugins: (loader) => [
                        require('autoprefixer')({
                          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
                        }),
                        require('postcss-pxtorem')({
                          rootValue: 100, propWhiteList: [],selectorBlackList :['body','ant-','modules_','has-success','has-error','has-warning']
                        })
                      ]
                    }
                  },
                  {loader:'less-loader',
                    options:{
                      sourceMap: true,
                      "modifyVars":{"@font-size-base":"14px","@font-family":"'Droid Serif', 'serif'"}
                    }
                  }
                ]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: ['node_modules/compass-mixins/lib']
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                  {loader:'style-loader'},
                  {loader:'css-loader'},
                  {
                    loader:'postcss-loader',
                    options: {
                      plugins: (loader) => [
                        require('autoprefixer')({
                          browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
                        }),
                        require('postcss-pxtorem')({
                          rootValue: 100,
                          propWhiteList: [],
                          selectorBlackList :['html','body','ant-','modules_']
                        })
                      ]
                    }
                  }
                ]
            },
            {
                test: /\.(png|eot|tiff|svg|woff2|woff|ttf|gif|mp3|jpg)$/,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=files/[hash].[ext]',
                    'image-webpack-loader'
                ]
            },
            { test: /\.svg$/,
              loader: 'svg-sprite-loader',
              include: [
                require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
                // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 自己私人的 svg 存放目录
              ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader?attrs=link:href'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: !DEV,
            debug: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
            minChunks: 2,
            children: true
        })
    ],
    resolve: {
        alias: {
            jquery: 'jquery/dist/jquery',
            superagent: 'node_modules/superagent/lib/client'
        },
        modules: [
            'node_modules',
            'non_npm_dependencies',
            path.join(__dirname, '../node_modules'),
            path.resolve(__dirname)
        ],
        extensions: ['.web.js', '.jsx', '.js', '.json'],
    }
};

// Development mode configuration
if (DEV) {
    if (FULLMAP) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval-cheap-module-source-map';
    }
}

// Production mode configuration
if (!DEV) {
    config.devtool = 'source-map';
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            'screw-ie8': true,
            mangle: {
                toplevel: false
            },
            compress: {
                warnings: false
            },
            comments: false,
            sourceMap: true
        })
    );
    config.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(true)
    );
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    );
}

// Test mode configuration
if (TEST) {
    config.entry = ['babel-polyfill', './root.jsx'];
    config.target = 'node';
    config.externals = [nodeExternals()];
} else {
    // For some reason these break mocha. So they go here.
    config.plugins.push(
        new HtmlWebpackPlugin({
            // filename: 'root.html',
            filename: '../index.html',
            inject: 'head',
            template: 'root.html'
        })
    );
    config.plugins.push(
        new CopyWebpackPlugin([
            {from: 'images/emoji', to: 'emoji'},
            {from: 'images/logo-email.png', to: 'images'},
            {from: 'images/circles.png', to: 'images'},
            {from: 'images/favicon', to: 'images/favicon'},
            {from: 'images/appIcons.png', to: 'images'},
            {from: path.resolve(__dirname, './config'), to: path.resolve(__dirname, './dist/config')},
            {from: path.resolve(__dirname, './pages/template'), to: path.resolve(__dirname, './dist/modle')}
        ])
    );
}

module.exports = config;
