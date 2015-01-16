var gulp = require('gulp');
var del = require('del');
var buildBranch = require('buildbranch');

gulp.task('clean', function (cb) {
    del(['./www'], cb);
});

gulp.task('copy', function (cb) {
    return gulp.src('src/**/*').pipe(gulp.dest('www'));
});

gulp.task('build', ['copy']);

gulp.task('gh', function(done) {
    buildBranch({ ignore: ['libs', 'src'] }, done);
});
