const ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var LiveReloadPlugin = require('webpack-livereload-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    context: __dirname + "/app",
    entry: {
        "scripts": "./layout.js",
        "scripts.min": "./layout.js",
    },
    output: {
        path: __dirname + "/www",
        filename: "[name].js"
    },
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ["es2015"]
                    }
                }],
                exclude: [/node_modules/, /export/]
            }, {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary 
                    use: ['css-loader?sourceMap', 'resolve-url-loader?sourceMap', 'sass-loader?sourceMap']
                })
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/,
                loader: 'file-loader?emitFile=false&name=./images/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./style.css'),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        }),
        new LiveReloadPlugin()
    ]
};