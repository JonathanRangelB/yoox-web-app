const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
console.time('time')
const buildDir = './dist/yoox-web-app/browser/';

// find the styles css file
const files = getFilesFromPath(buildDir, '.css');
let data = [];

if (!files && files.length <= 0) {
  console.log('cannot find style files to purge');
  return;
}

for (let file of files) {
  // get original file size
  const originalSize = getFilesizeInKiloBytes(buildDir + file) + 'kb';
  const o = { file, originalSize };
  data.push(o);
}

console.log('Run PurgeCSS...');

exec(
  // 'purgecss -css dist/**/*.css --content dist/**/index.html dist/**/*.js -o ./',
  'npx purgecss -c ./purgecss.config.js',
  function () {
    for (let d of data) {
      // get new file size
      const newSize = getFilesizeInKiloBytes(buildDir + d.file);
      const compression = getReductionPercentage(d.originalSize.slice(0, -2), newSize);
      d.newSize = newSize + 'kb';
      d.compressionRatio = compression;
    }
    console.log('PurgeCSS done');
    console.timeEnd('time')
    console.table(data);
  }
);

function getFilesizeInKiloBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size / 1000;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  let files = fs.readdirSync(dir);
  return files.filter((e) => path.extname(e).toLowerCase() === extension);
}

function getReductionPercentage(initial, compressed) {
  initial = +initial;
  compressed = +compressed;
  const compressionRatio = (((initial - compressed) / initial) * 100).toFixed(2)
  return `${compressionRatio}%`
}
