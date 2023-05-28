/**
 * zip.test.js
 * 用于检测zip文件是否生产正常
 */

const glob = require('glob-all');

describe('Checking generated zip files', () => {
  it('should generate zip files', (done) => {
    const files = glob.sync([
      './dist/test.zip',
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('no zip files generated');
    }
  });
});
