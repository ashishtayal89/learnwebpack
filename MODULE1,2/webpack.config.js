module.exports = {
    entry: ["./utils.js", "./app.js"],
    output: {
        filename: "bundle.js"
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
                enforce: "pre",
                options: {
                  // eslint options (if necessary)
                }
            },
        ]
    },
    resolve: {
        extensions: ['.js','.es6']
    },
    mode: "development"
}