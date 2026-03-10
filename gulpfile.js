var gulp = require('gulp');
var del = require('del');
var path = require('path');
var dir = path.relative('/var/www/', __dirname)+'/src/';
var ghPages = require('gh-pages');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

function clean() {
	return del(['./www']);
}

function css() {
	return gulp.src('src/styl/styles.styl')
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.stylus({
			paths: ['src/styl/utilities', 'node_modules'],
			define: { modern: true, ie: false, ie8: false, ie9: false },
			import: ['variables', 'mixins'],
			sourcemap: { inline: true, sourceRoot: '.', basePath: 'src/css' }
		}))
		.pipe($.autoprefixer({
			overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'IE > 8']
		}))
		.pipe($.sourcemaps.write('.', { includeContent: false, sourceRoot: '.' }))
		.pipe(gulp.dest('www/css'));
}

function templates() {
	var filter = $.filter(function (file) {
		return !/(src\/templates\/index\.html)/.test(file.path);
	}, { restore: true });

	return gulp.src(['src/templates/*.pug', '!src/templates/_*.pug'])
		.pipe($.pug({
			locals: { dirname: dir },
			pretty: true
		}))
		.pipe($.rename(function (p) {
			if (p.basename !== 'index') {
				p.dirname += '/'+p.basename;
				p.basename = 'index';
			}
		}))
		.pipe(filter)
		.pipe($.replace(/((src|href)=)(\"|\')((img|css|js))/g, '$1$3../$4'))
		.pipe(filter.restore)
		.pipe(gulp.dest('www'));
}

function images() {
	return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe($.newer('src/img'))
		.pipe($.imagemin([
			$.imagemin.gifsicle({ interlaced: true }),
			$.imagemin.mozjpeg({ quality: 85, progressive: true }),
			$.imagemin.optipng({ optimizationLevel: 7 })
		]))
		.pipe(gulp.dest('www/img'));
}

function fonts() {
	return gulp.src('src/fonts/webfonts.css')
		.pipe($.cssBase64({ maxWeightResource: 131072 }))
		.pipe(gulp.dest('www/css/'));
}

function copy() {
	return gulp.src([
		'src/**/*',
		'!src/templates/', '!src/templates/*',
		'!src/styl/', '!src/styl/**/*',
		'!src/css/*.css.map'
	]).pipe(gulp.dest('www'));
}

function minifyHtml() {
	return gulp.src('www/**/*.html')
		.pipe($.replace(dir, ''))
		.pipe($.htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('www'));
}

function minifyCss() {
	return gulp.src('www/css/*.css')
		.pipe($.cleanCss())
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
	gulp.parallel(templates, css, images, fonts, copy),
	gulp.parallel(minifyHtml, minifyCss)
);

var watchTask = gulp.series(serve, watch);

function gh(done) {
	ghPages.publish('www', done);
}

gulp.task('default', defaultTask);
gulp.task('watch', watchTask);
gulp.task('gh', gulp.series(defaultTask, gh));
