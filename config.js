var path = require('path');
var appSourceRoot = './source/js/apps/';
var HtmlWebpackPlugin = require('html-webpack-plugin');

var modules = {
  index: {
    js: 'index',
    html: './jade/index.jade'
  },
};

var orderedChunks = [
  'shim', 'vendor', 'common'
];

module.exports = {
  getEntry: function () {
    var m;

    if (process.env.NODE_ENV === 'production') {
      m = modules;
    }
    else {
      m = require('./dev.config').getModules(modules);
    }

    var entry = {};
    for (var key in m) {
      entry[key]
        = path.resolve(appSourceRoot, m[key].js);
    }

    return entry;
  },

  getHtmlWebpackPlugins: function () {
    var plugins = [];

    if (process.env.NODE_ENV === 'production') {
      m = modules;
    }
    else {
      m = require('./dev.config').getModules(modules);
    }

    for (var key in m) {
      var module = m[key];

      var chunks = ['shim', 'vendor', 'common'];

      chunks.push(key);

      plugins.push(new HtmlWebpackPlugin({
        filename: key + '.html',
        template: module.html,
        chunks: chunks,
        chunksSortMode: function (a, b) {
          a = a.names[0];
          b = b.names[0];

          var indexa = orderedChunks.indexOf(a);
          var indexb = orderedChunks.indexOf(b);

          if (indexa === -1) {
            return 1;
          }

          if (indexb === -1) {
            return -1;
          }

          if (indexa < indexb) {
            return -1;
          }
          else if (indexa > indexb) {
            return 1;
          }

          return 0;
        }
      }));
    }

    return plugins;
  },

  getChunks: function (name) {
    var chunks = [];

    for (var key in modules) {
      if ((new RegExp('^' + name)).test(key)) {
        chunks.push(key);
      }
    }
    return chunks;
  }
};
