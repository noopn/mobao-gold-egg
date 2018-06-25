const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const entry = {
  index: "./src/page/index/js/index.js",
  rule: "./src/page/rule/js/rule.js",
  goldegg: "./src/page/goldegg/js/goldegg.js",
  rank: "./src/page/rank/js/rank.js",
  cash: "./src/page/cash/js/cash.js",
};
const pages = [
  // 用户中心页面
  new HtmlWebpackPlugin({
    title: "GoldEgg",
    template: "./src/page/index/index.html",
    chunks: ["commons", "index", "styles"],
    filename: "index.html",
    favicon: ''
  }),
  // 规则
  new HtmlWebpackPlugin({
    title: "Rule",
    template: "./src/page/rule/rule.html",
    chunks: ["commons", "rule", "styles"],
    filename: "rule.html",
    favicon: ''
  }),
  // 游戏主界面
  new HtmlWebpackPlugin({
    title: "GoldEgg",
    template: "./src/page/goldegg/goldegg.html",
    // inject: "head",
    chunks: ["commons", "goldegg", "styles"],
    filename: "goldegg.html",
    favicon: ''
  }),
  // rank
  new HtmlWebpackPlugin({
    title: "Ranking",
    template: "./src/page/rank/rank.html",
    // inject: "head",
    chunks: ["commons", "rank", "styles"],
    filename: "rank.html",
    favicon: ''
  }),
  // 提现
  new HtmlWebpackPlugin({
    title: "Cash",
    template: "./src/page/cash/cash.html",
    // inject: "head",
    chunks: ["commons", "cash", "styles"],
    filename: "cash.html",
    favicon: ''
  }),

]
pages.forEach(item => {
  item.options.minify = {
    collapseWhitespace: true, // 折叠空白区域 也就是压缩代码
    removeAttributeQuotes: true
  }
})
module.exports = {
  entry: entry,
  output: {
    filename: "js/[name].[hash:6].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: ''
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src/common"),]
  },
  plugins: [
    new CleanWebpackPlugin(["./dist"]),
  ].concat(pages),
}