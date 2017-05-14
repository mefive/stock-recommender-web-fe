var path = require('path');

module.exports = {
  resolve: {
    root: [
      path.resolve('./source/js')
    ],
    alias: {
      'styles': path.resolve('./source/sass'),
      'font': path.resolve('./source/font'),
      'compass': path.resolve('./node_modules/compass-mixins/lib'),
      'ractive': path.resolve('./node_modules/ractive/ractive-legacy'),
      'images': path.resolve('./source/images'),
      'docs': path.resolve('./source/docs'),
      'files': path.resolve('./source/files'),
      'highlights': path.resolve('./node_modules/highlight.js/lib')
    },
    extensions: ['', '.js', '.jsx', '.scss', '.jade'],
  },
};
