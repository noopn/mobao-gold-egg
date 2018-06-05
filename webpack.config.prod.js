const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const PurifycssWebpack = require("purifycss-webpack"); //去除无用的css
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require("glob"); //分析路径工具
const path = require("path");
const config = require("./webpack.config.common");
const merge = require("webpack-merge");
module.exports = merge(config, {
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader",
      }],
      exclude: [path.resolve(__dirname, "node_modules")]
    }, {
      test: /\.s?[ac]ss$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        },
        "css-loader",
        "postcss-loader",
        "sass-loader"
      ]
    }, {
      test: /\.(jpg|jpeg|gif|png)$/,
      use: [{
        loader: "file-loader",
        options: {
          limit: 10000,
          name: "img/[name]_[hash:base64:8].[ext]",
        }
      }, {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 80
          },
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: false,
          },
          pngquant: {
            quality: '65-90',
            speed: 3
          },
          gifsicle: {
            interlaced: false,
          },
          // the webp option will enable WEBP
          webp: {
            quality: 80
          }
        },
      }]
    }, {
      test: /\.html$/,
      use: ["html-loader"]
    }, {
      test: /\.(eot|ttf|woff|svg)$/,
      use: [{
        loader: "file-loader",
        options: {
          name: "font/[name]_[hash:base64:8].[ext]",
        }
      }]
    }]
  },
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:6].css",
      // chunkFilename: "css/[name].[hash:6].css",

    }),
    // 拷贝
    // new CopyWebpackPlugin([{
    //   from: path.resolve(__dirname, 'src/common/js/flexible.js'),
    //   to: path.resolve(__dirname, 'dist/js'),
    // }])
    // 删除无用css
    // new PurifycssWebpack({
    //   paths: glob.sync(path.join(__dirname, "src/page/*/*.html")),
    //   minimize: true,
    // })
  ],
  // 排除打包 外链引入
  // externals: {
  // jquery: "jQuery",
  // "./src/common/js/flexible": "./src/common/js/flexible",
  // },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({
        // cssProcessor: require('cssnano'),
        cssProcessor: {
          process: function (css) {
            return require('cssnano').process(css, { /* options */ })
              .then(function (cssnanoResult) {
                return require("autoprefixer").process(cssnanoResult); // Assuming mqpacker is similar to cssnano interface
              });
          },
          canPrint: false
        }
      })
    ],
    splitChunks: {
      chunks: "all",
      minSize: 1,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
          filename: "js/[name].[hash:6].js"
        },
        styles: {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true
        }
      },
    }
  }
});