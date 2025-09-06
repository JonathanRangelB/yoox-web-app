import { statSync, readdirSync } from 'fs';
import { extname } from 'path';
import { PurgeCSS } from "purgecss";
import fs from 'fs';
console.time('time')
const buildDir = process.cwd() + '/dist/yoox-web-app/browser/';

// print current working directory
console.log('Current working directory: ', buildDir);

// find the styles css file
const files = getFilesFromPath(buildDir, '.css');
let data = [];

if (!files && files.length <= 0) {
  console.log('cannot find style files to purge');
  //termintate script
  process.exit(1);
}

for (let file of files) {
  // get original file size
  const originalSize = getFilesizeInKiloBytes(buildDir + file) + 'kb';
  const o = { file, originalSize };
  data.push(o);
}

function getFilesizeInKiloBytes(filename) {
  const stats = statSync(filename);
  const fileSizeInBytes = stats.size / 1000;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  let files = readdirSync(dir);
  return files.filter((e) => extname(e).toLowerCase() === extension);
}

function getReductionPercentage(initial, compressed) {
  initial = +initial;
  compressed = +compressed;
  const compressionRatio = (((initial - compressed) / initial) * 100).toFixed(2)
  return `${compressionRatio}%`
}

console.log('Run PurgeCSS...');
const purgecss = await new PurgeCSS().purge({
  content: ['./dist/**/index.html', './dist/**/*.js'],
  css: ['./dist/**/*.css'],
  output: 'dist/yoox-web-app/browser',
  safelist: {
    standard: [
      // Agrega aquí otros patrones de PrimeFlex que necesites
      /(^|\s)sm:(\s|$)/,
      /(^|\s)md:(\s|$)/,
      /(^|\s)lg:(\s|$)/,
      /(^|\s)xl:(\s|$)/,
      /-success$/,
      /-info$/,
      /-error$/,
      /-danger$/,
      /-warn$/,
      /-warning$/,
      /-secondary$/,
      /-contrast$/,
    ],
  },
  extractors: [
    {
      extractor: (content) => content.match(/[\w-/:.]+(?<!:)/g) || [],
      extensions: ['html', 'js'],
    },
  ],
})

purgecss.forEach(item => {
  console.log(`Compressing: ${item.file}`);
  fs.writeFileSync(item.file, item.css);
}
)
for (let d of data) {
  const newSize = getFilesizeInKiloBytes(buildDir + d.file);
  const compression = getReductionPercentage(d.originalSize.slice(0, -2), newSize);
  d.newSize = newSize + 'kb';
  d.compressionRatio = compression;
}

console.log('PurgeCSS done');
console.timeEnd('time')
console.table(data);
