/** 
 * test/index.js
 * plugin测试入口文件
 */

const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000ms'
});

const config = require('../webpack.config.js');

rimraf('./dist', () => {
  webpack(config, (err, stats) => {
    if (err) {
      process.exit(2);
    }
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false,
    }));

    console.log('Webpack build success, begin to run test');

    mocha.addFile(path.join(__dirname, 'zip.test.js'));

    mocha.run();
  });
});
