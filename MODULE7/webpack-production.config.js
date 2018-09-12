process.env.NODE_ENV = "production";
let StripLoader = require("strip-loader"),
    devConfig = require("./webpack.config.js"),
    stripLoader = {
        test: [/\.js$/,/\.es6/],
        exclude: /node_modules/,
        loader: StripLoader.loader('console.log')
    };
devConfig.module.rules.push(stripLoader);
module.exports = devConfig;