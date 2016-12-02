var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

gulp.task('jshint',function(){
  gulp.src('dev/typeit.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
  gulp.src('dev/typeit.js')
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('typeit.min.js'))
    .pipe(gulp.dest('dev'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['jshint', 'scripts']);

gulp.task('default', ['jshint', 'scripts'], function() {
  gulp.watch('dev/*', ['jshint', 'scripts']);
});
