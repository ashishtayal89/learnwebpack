const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  optimization: {
    minimize: false,
    runtimeChunk: "single",
  },
  module: {
    rules: [
      { test: /\.txt$/, use: "raw-loader" },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // [style-loader](/loaders/style-loader)
          { loader: "style-loader" },
          // [css-loader](/loaders/css-loader)
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          // [sass-loader](/loaders/sass-loader)
          { loader: "sass-loader" },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
  mode: "none",
  entry: {
    vendor: "./src/vendor.js",
    index: {
      dependOn: "vendor",
      import: "./src/index.js",
      filename: "main.[chunkhash].js",
    },
  },
  output: {
    filename: "[name].[chunkhash].js",
  },
};
