var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require("gulp-rename");

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
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['jshint', 'scripts'], function() {
  gulp.watch('dev/*', ['jshint', 'scripts']);
});