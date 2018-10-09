'use strict'

process.env.NODE_ENV = 'production'
const path = require("path");
const merge = require('webpack-merge')
const config = require('../config')
const utils = require('./utils')
const webpack = require('webpack')
const baseConfig = require('./webpack.config.base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const env = config.build.env

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  // output: {    
  //   path: path.resolve(__dirname, "../dist/js"),   
  //   filename: "[name].js" 
  // },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
    runtimeChunk: true
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.css?$/,
  //       use: [
  //         MiniCssExtractPlugin.loader, 
  //         'css-loader',
  //       ]
  //     }
  //   ]
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),


    // extract css into its own file. No more working in 4.x. Using mini-css-extract-plugin instead
    // new ExtractTextPlugin({
    //   filename: utils.assetsPath('css/[name].[contenthash].css')
    // }),
    // new MiniCssExtractPlugin({
    //   filename: utils.assetsPath('css/[name].[contenthash].css')
    // }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      },
      {
          from: './favicon.ico',
          to: config.build.assetsRoot
      }
    ])
  ]
})