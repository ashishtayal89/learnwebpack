let path = require('path');
module.exports = {
    context: path.resolve('js'),
    entry: ["./utils.js", "./app.js"],
    output: {
        path: path.resolve('build/js/'),
        publicPath: 'public/assets/js/',
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
    mode: "development"
}