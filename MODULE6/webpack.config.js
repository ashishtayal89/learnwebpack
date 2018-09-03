let path = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    context: path.resolve('js'),
    entry: ["./utils", "./app"],
    output: {
        path: path.resolve('build/'),
        publicPath: 'public/assets/',
        filename: "bundle.js"
    },
    devServer: {
        contentBase: 'public'
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader","css-loader")
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader","css-loader!sass-loader")
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract("style-loader","css-loader!less-loader")
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                enforce: "pre"
            }
        ]
    },
    resolve: {
        extensions: ['.js','.es6']
    },
    mode: "development",
    plugins: [new ExtractTextPlugin("styles.css")]
}