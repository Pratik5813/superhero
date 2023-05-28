# zip-plugin [![Build Status](https://travis-ci.org/yuguomin/zip-plugin.svg?branch=master)](https://travis-ci.org/yuguomin/zip-plugin)
Used for webpack, this plugin packages all the bundle files into a single zip file.

# how to use
install this package
```
npm install zip-plugin -D
```

and use in webpack.config
```JavaScript
// demo webpack.config.js
const zipPlugin = require('zip-plugin');

module.exports = {
  entry: ...,
  output: ...,
  plugins: [
    new zipPlugin({
      filename: 'bundle' // this property used to set zip file name
    })
  ]
}
```

then, webpack build.