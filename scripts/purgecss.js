const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const buildDir = './dist/yoox-web-app/browser/';

// find the styles css file
const files = getFilesFromPath(buildDir, '.css');
let data = [];

if (!files && files.length <= 0) {
  console.log('cannot find style files to purge');
  return;
}

for (let f of files) {
  // get original file size
  const originalSize = getFilesizeInKiloBytes(buildDir + f) + 'kb';
  const o = { file: f, originalSize: originalSize, newSize: '' };
  data.push(o);
}

console.log('Run PurgeCSS...');

exec(
  // 'purgecss -css dist/**/*.css --content dist/**/index.html dist/**/*.js -o ./',
  'npx purgecss -c ./purgecss.config.js',
  function (error, stdout, stderr) {
    for (let d of data) {
      // get new file size
      const newSize = getFilesizeInKiloBytes(buildDir + d.file) + 'kb';
      d.newSize = newSize;
    }
    console.log('PurgeCSS done');
    console.table(data);
  }
);

function getFilesizeInKiloBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  let files = fs.readdirSync(dir);
  return files.filter((e) => path.extname(e).toLowerCase() === extension);
}
