const path = require('path'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    devMode = process.env.NODE_ENV !== 'production';
module.exports = {
    context: path.resolve('js'),
    entry: {
        bundle: "./app.js"
    },
    output: {
        path: path.resolve('build/'),
        publicPath: 'public/assets/',
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
            // {
            //     test: /\.(sa|sc|c)ss$/,
            //     use: [
            //         devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         'sass-loader'
            //     ]
            // },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
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
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css'
        })
    ]
}