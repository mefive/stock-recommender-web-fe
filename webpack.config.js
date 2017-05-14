var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var webpack = require('webpack');
var webpack = require('webpack');
var merge = require('webpack-merge');
var base = require('./webpack.base.config');
var config = require('./config');

var buildRoot = 'live';

module.exports = merge(base, {
  output: {
    filename: 'js/[name].[chunkhash:7].js',
    path: buildRoot,
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?localIdentName=[local]_[hash:base64:5]!sass'
        )
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css?localIdentName=[name]_[hash:base64:5]'
        )
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 100,
          name: 'images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'font/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(rar|jar|zip)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 1,
          name: 'files/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([buildRoot], {
      root: path.resolve('.'),
      verbose: true,
      dry: false
    }),
    new ExtractTextPlugin('styles/[name].[contenthash:7].css'),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['common', 'vendor', 'shim']
    }),

    new CopyWebpackPlugin([
      { context: 'files', from: '**/*', to: 'files/'},
      { context: 'docs', from: '**/*', to: 'docs/'}
    ]),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ],
});
