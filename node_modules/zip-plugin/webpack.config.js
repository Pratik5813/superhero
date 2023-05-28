const path = require('path');
const ZipWebpackPlugin = require('./plugins/zip-plugin');

module.exports = {
  entry: {
    index: './simple/index.js',
    main: './simple/main.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'production',
  plugins: [
    new ZipWebpackPlugin({ filename: 'test' })
  ]
}