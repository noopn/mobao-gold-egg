const path = require("path");
const config = require("./webpack.config.common");
const merge = require("webpack-merge");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = merge(config, {
  module: {
    rules: [{
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: [path.resolve(__dirname, "node_modules")]
      }, {
        test: /\.css$/,
        use: [
          "style-loader", "css-loader", "postcss-loader"
        ]
      }, {
        test: /\.(scss|sass)$/,
        use: [
          "style-loader", {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          "postcss-loader",
          "sass-loader",
        ]
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        use: ["file-loader"]
      },
      {
        test: /\.html$/,
        use: ["html-loader"]
      }, {
        test: /\.(eot|ttf|woff|svg)$/,
        use: ["file-loader"]
      }
    ]
  },
  devtool: "source-map",
  mode: "development",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    port: 9000,
    open: true,
    hot: true,
    contentBase: '.'
  }
})