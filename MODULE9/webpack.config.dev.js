const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // optimization: {
  //   minimize: false,
  // },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
  mode: "none",
};
