var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var appSourceRoot = './source/js/apps/';
var config = require('./config');
var merge = require('webpack-merge');

module.exports = merge({
  context: path.resolve('./source'),
  entry: Object.assign({
    shim: [
      'babel-polyfill',
      'es5-shim',
      'es5-shim/es5-sham',
      'es6-shim',
      'promise-polyfill'
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-scroll',
    ]
  }, config.getEntry()),

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.jade$/,
        loader: 'jade?pretty=true'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      moment: "moment"
    }),
    new webpack.DefinePlugin({
      'webapckEnv': '"' + process.env.NODE_ENV + '"',
      'global': 'window'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ].concat(config.getHtmlWebpackPlugins())
}, require('./path'));
