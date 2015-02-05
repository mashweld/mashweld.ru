var gulp = require('gulp'),
	del = require('del'),
	runSequence = require('run-sequence'),
	buildBranch = require('buildbranch'),
	$ = require('gulp-load-plugins')();

var paths = {
	templates: ['src/templates/*.jade', '!src/templates/_*.jade'],
	scripts: ['src/js/**/*.js'],
	styles: ['src/styl/**/*.{css,styl}', '!src/styl/*.{css,css.map}'],
	assets: ['src/img/**/*', 'src/favicons/**/*']

};

//Clean build
gulp.task('clean', function (cb) {
	del(['./www'], cb);
});

// Copy assets
gulp.task('copy', ['templates', 'css', 'images', 'fonts'], function (cb) {
	return gulp.src(['src/**/*', '!src/templates/', '!src/styl/', '!src/styl/**/*', '!src/css/*.css.map'])
		.pipe(gulp.dest('www'));
});

// Styles
gulp.task('css', function (cb) {
	return gulp.src('src/styl/styles.styl')
		.pipe($.sourcemaps.init({
			loadMaps: true
		}))
		.pipe($.plumber())
		.pipe($.stylus({
			paths: ['src/styl/utilities', 'node_modules'],
			define: {
				modern: true,
				ie: false,
				ie8: false,
				ie9: false
			},
			import: [
				'variables',
				'mixins'
			],
			sourcemap: {
				inline: true,
				sourceRoot: '.',
				basePath: 'src/css'
			}
		}))
		.pipe($.autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'IE > 8']/*,
			 cascade: false*/
		}))
		.pipe($.sourcemaps.write('.', {
			includeContent: false,
			sourceRoot: '.'
		}))
		.pipe(gulp.dest('src/css'));
});

// HTML
gulp.task('templates', function(cb) {
	var filter = $.filter(function (file) {
		return !/(src\/templates\/index\.html)/.test(file.path);
	});

	return gulp.src(paths.templates)
		.pipe($.plumber())
		.pipe($.jade({
			pretty: true
		}))
		.pipe($.rename(function (path) {
			if (path.basename === 'index') {
				return path;
			}
			path.dirname += "/"+path.basename;
			path.basename = "index";
		}))
		.pipe(filter)
		.pipe($.replace(/((src|href)=)(\"|\')((img|css|js))/g, '$1$3../$4'))
		.pipe(filter.restore())
		.pipe(gulp.dest('src'));
});

// Minify html
gulp.task('minify-html', function (cb) {
	return gulp.src('www/*.html')
		.pipe($.plumber())
		.pipe($.replace('http://192.168.57.1/projects/side/mashweld/src/', '/'))
		.pipe($.htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('www'));
});

// Minify css
gulp.task('minify-css', function (cb) {
	return gulp.src('www/css/*.css')
		.pipe($.plumber())
		.pipe($.borschik({tech: 'cleancss'}))
		.pipe(gulp.dest('www/css'));
});

// Optimize images
gulp.task('images', function () {
	return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe($.plumber())
		.pipe($.newer('src/img'))
		.pipe($.imagemin({optimizationLevel: 7, progressive: true, interlaced: true}))
		.pipe(gulp.dest('src/img'))/*
		.pipe($.size({showFiles: true}))*/;
});

// Prepare webfonts
gulp.task('fonts', function() {
	return gulp.src('src/fonts/webfonts.css')
		.pipe($.plumber())
		.pipe($.cssBase64({
			maxWeightResource: 131072
		}))
		.pipe(gulp.dest('src/css/'));
});

// Watch
gulp.task('watch', function () {
	//gulp.watch(paths.scripts, ['js']);
	gulp.watch(paths.styles, ['css']);
	gulp.watch(paths.templates[0], ['templates']);
	gulp.watch(paths.assets, ['copy']);
});

gulp.task('default', function (cb) {
	runSequence('clean', 'copy', ['minify-html', 'minify-css'], cb);
});

gulp.task('gh', ['default'], function (done) {
	buildBranch({ignore: ['assets', 'src']}, done);
});
