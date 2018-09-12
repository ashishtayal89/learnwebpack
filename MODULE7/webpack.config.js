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
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    devMode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    devMode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|ttf)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=1000'
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