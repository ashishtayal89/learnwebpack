const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  optimization: {
    minimize: false,
    runtimeChunk: 'single'
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
  mode: "none",
  entry:{
    vendor:'./src/vendor.js',
    index: {
      dependOn: 'vendor',
      import:'./src/index.js',
      filename:'main.[chunkhash].js'
    }
  },
  output:{
    filename:'[name].[chunkhash].js'
  }
};
