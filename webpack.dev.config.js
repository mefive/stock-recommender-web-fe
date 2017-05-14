var webpack = require('webpack');
var merge = require('webpack-merge');
var base = require('./webpack.base.config');
var buildRoot = 'dev';

module.exports = merge(base, {
  // devtool: 'source-map',
  devtool: '#eval-source-map',
  devServer: {
    port: 9806,
    inline: true,
    colors: true,
    progress: true,
    contentBase: 'dev/',
    proxy: {
      '^/api/**': {
        target: 'http://localhost:7777',
        hostRewrite: 'http://apiproxydomain',
        secure: false,
        changeOrigin: true,
      }
    }
  },
  output: {
    filename: '[name].js',
    path: buildRoot,
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['style', 'css?localIdentName=[local]_[hash:base64:5]', 'sass']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]'
        }
      }
    ]
  }
});
