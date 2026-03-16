var gulp = require('gulp');
var del = require('del');
var path = require('path');
var dir = path.relative('/var/www/', __dirname)+'/src/';
var ghPages = require('gh-pages');
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var fs = require('fs');
var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var pug = require('gulp-pug');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var gulpFilter = require('gulp-filter');
var htmlMinifier = require('gulp-html-minifier-terser');
var sharp = require('sharp');
var Transform = require('stream').Transform;

function clean() {
  return del(['./www']);
}

function css() {
  return gulp.src('src/scss/styles.scss', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({ overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'] })
    ]))
    .pipe(gulp.dest('www/css', { sourcemaps: '.' }));
}

function templates() {
  var htmlFilter = gulpFilter(function (file) {
    return !/(src\/templates\/(index|404)\.html)/.test(file.path);
  }, { restore: true });

  return gulp.src(['src/templates/*.pug', '!src/templates/_*.pug'])
    .pipe(pug({
      locals: { dirname: dir },
      pretty: true
    }))
    .pipe(rename(function (p) {
      if (p.basename !== 'index' && p.basename !== '404') {
        p.dirname += '/'+p.basename;
        p.basename = 'index';
      }
    }))
    .pipe(htmlFilter)
    .pipe(replace(/((src|href)=)(["'])(img|css|js|vendor)/g, '$1$3../$4'))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest('www'));
}

function optimizeImages() {
  var transform = new Transform({
    objectMode: true,
    transform: function (file, enc, cb) {
      if (file.isNull() || file.isDirectory()) return cb(null, file);
      var ext = path.extname(file.path).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        sharp(file.contents).jpeg({ quality: 80 }).toBuffer()
          .then(function (buf) { file.contents = buf; cb(null, file); })
          .catch(function () { cb(null, file); });
      } else if (ext === '.png') {
        sharp(file.contents).png({ compressionLevel: 9 }).toBuffer()
          .then(function (buf) { file.contents = buf; cb(null, file); })
          .catch(function () { cb(null, file); });
      } else {
        cb(null, file);
      }
    }
  });
  return gulp.src('src/img/**/*.{jpg,png,gif}', { encoding: false })
    .pipe(transform)
    .pipe(gulp.dest('www/img', { encoding: false }));
}

var fontMimeTypes = {
  woff: 'font/woff', woff2: 'font/woff2',
  ttf: 'font/ttf', eot: 'application/vnd.ms-fontobject',
  otf: 'font/otf', svg: 'image/svg+xml'
};

function fonts() {
  return gulp.src('src/fonts/webfonts.css')
    .pipe(replace(/url\(['"]?([^'")]+)['"]?\)/g, function (match, fontPath) {
      var fullPath = path.resolve('src/fonts', fontPath);
      if (!fs.existsSync(fullPath)) return match;
      var ext = path.extname(fullPath).slice(1).toLowerCase();
      var mime = fontMimeTypes[ext] || 'application/octet-stream';
      var data = fs.readFileSync(fullPath).toString('base64');
      return 'url(data:' + mime + ';base64,' + data + ')';
    }))
    .pipe(gulp.dest('www/css/'));
}

function copy() {
  return gulp.src([
    'src/**/*',
    '!src/templates/**',
    '!src/scss/**',
    '!src/vendor/**',
    '!src/img/**',
    '!src/fonts/webfonts.css',
    '!src/css/*.css.map'
  ], { encoding: false }).pipe(gulp.dest('www', { encoding: false }));
}

function vendorCopy() {
  return gulp.src([
    'node_modules/glightbox/dist/css/glightbox.min.css',
    'node_modules/glightbox/dist/js/glightbox.min.js'
  ]).pipe(gulp.dest('www/vendor/glightbox'));
}

function minifyHtml() {
  return gulp.src('www/**/*.html')
    .pipe(replace(dir, ''))
    .pipe(htmlMinifier({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true
    }))
    .pipe(gulp.dest('www'));
}

function minifyCss() {
  return gulp.src('www/css/*.css')
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest('www/css'));
}

function serve(done) {
  browserSync.init({ server: { baseDir: './www' } });
  done();
}

function watch() {
  gulp.watch(['src/**/*'], gulp.series(defaultTask)).on('change', browserSync.reload);
}

var defaultTask = gulp.series(
  clean,
  gulp.parallel(templates, css, optimizeImages, fonts, copy, vendorCopy),
  gulp.parallel(minifyHtml, minifyCss)
);

var watchTask = gulp.series(serve, watch);

function gh(done) {
  ghPages.publish('www', done);
}

gulp.task('default', defaultTask);
gulp.task('watch', watchTask);
gulp.task('gh', gulp.series(defaultTask, gh));
