var gulp = require('gulp'),
	del = require('del'),
	runSequence = require('run-sequence'),
	buildBranch = require('buildbranch'),
	$ = require('gulp-load-plugins')();

var paths = {
	scripts: ['src/js/**/*.js'],
	styles: ['src/styl/**/*.{css,styl}', '!src/styl/*.{css,css.map}'],
	assets: ['src/img/**/*', 'src/favicons/**/*']

};

//Clean build
gulp.task('clean', function (cb) {
	del(['./www'], cb);
});

// Copy assets
gulp.task('copy', ['css', 'images', 'fonts'], function (cb) {
	return gulp.src(['src/**/*', '!src/styl/', '!src/styl/**/*', '!src/css/*.css.map'])
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
				ie: false
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

// Minify html
gulp.task('minify-html', function (cb) {
	return gulp.src('www/*.html')
		.pipe($.plumber())
		.pipe($.htmlmin({
			collapseWhitespace: true,
			removeComments: true
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
	return gulp.src('src/img/**/*')
		.pipe($.plumber())
		//.pipe($.newer('src/img'))
		.pipe($.imagemin({
			progressive: true
		}))
		.pipe(gulp.dest('src/img'));
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
	gulp.watch(paths.assets, ['copy']);
});

gulp.task('default', function (cb) {
	runSequence('clean', 'copy', ['minify-html', 'minify-css'], cb);
});

gulp.task('gh', ['default'], function (done) {
	buildBranch({ignore: ['assets', 'src']}, done);
});
