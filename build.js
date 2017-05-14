// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')

var spinner = ora('building for production...')
spinner.start()

// rm('-rf', 'node_modules');
// exec('npm install');

var rootPath = path.resolve('live');

rm('-rf', rootPath)
mkdir('-p', rootPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    progress: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
