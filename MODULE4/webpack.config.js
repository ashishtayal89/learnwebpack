let path = require('path');
    // webpack = require('webpack'),
    // commonPlugin = new webpack.optimize.CommonsChunkPlugin('shared.js');
module.exports = {
    context: path.resolve('js'),
    entry: {
        about: "./about_page.js",
        contact: "./contact_page.js",
        home: "./home_page.js"
    },
    output: {
        path: path.resolve('build/js/'),
        publicPath: 'public/assets/js/',
        filename: "[name].js"
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
    optimization: {
        splitChunks: {
            chunks: "all",
            name: "shared"
        }
    }
    // plugins: [commonPlugin]
}