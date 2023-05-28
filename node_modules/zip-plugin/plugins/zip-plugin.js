const RawSource = require('webpack-sources').RawSource; 
const JSZip = require('jszip');
const zip = new JSZip();

module.exports = class ZipPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
      const folder = zip.folder(this.options.filename);

      for (let filename in compilation.assets) {
        const source = compilation.assets[filename].source();
        folder.file(filename, source);
      }

      zip.generateAsync({
        type: 'nodebuffer'
      }).then((content) => {
        const filename = `${this.options.filename}.zip`;

        compilation.assets[filename] = new RawSource(content);
        
        callback();
      });
    });
  }
}