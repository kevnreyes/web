import emojiOne from 'emojione/emoji.json';
import gulp from 'gulp';
import * as path from 'path';
import { writeFile } from 'fs';
import through from 'through2';
import values from 'object-values';

const baseDir = path.join(
  path.dirname(require.resolve('emojione/emoji.json')),
  './assets/png'
);

export default function emojiTask() {
  const emojiRenames = {};
  const emojiImages = {};
  values(emojiOne).forEach(emoji => {
    const { unicode, shortname, aliases } = emoji;
    // Strip colons
    const name = shortname.slice(1, -1);
    emojiRenames[unicode] = name;
    emojiImages[name] = `${name}.png`;
    aliases.forEach(alias => {
      emojiImages[alias.slice(1, -1)] = `${name}.png`;
    });
  });

  return gulp.src(path.join(baseDir, '*.png'))
    .pipe(through.obj(function onfile(file, _, cb) {
      const unicode = path.basename(file.path).replace(/\.png$/, '');
      const newPath = path.join(path.dirname(file.path), `${emojiRenames[unicode]}.png`);
      file.path = newPath; // eslint-disable-line no-param-reassign
      this.push(file);
      cb();
    }, cb => {
      writeFile('./lib/emoji.json', JSON.stringify(emojiImages), cb);
    }))
    .pipe(gulp.dest('./lib/assets/emoji'));
}