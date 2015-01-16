var gulp = require('gulp');
var buildBranch = require('buildbranch');

gulp.task('cname', function () {
    return gulp.src('CNAME').pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
    del(['./dist'], cb);
});

gulp.task('build', ['cname']);

gulp.task('gh', function(done) {
    buildBranch({ ignore: ['libs', 'src'] }, done);
});
