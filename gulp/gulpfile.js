// load our plugins
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require("gulp-rename");

// check JavaScript
gulp.task('jshint',function(){
  gulp.src('../js/typeIt.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// concat and minify JavaScript
gulp.task('scripts', function() {
  gulp.src('../js/typeIt.js')
    //.pipe(uglify())
    .pipe(rename('typeit.min.js'))
    .pipe(gulp.dest('../js'));
});

// compile and autoprefix SASS
gulp.task('sass', function () {
  gulp.src(['../scss/typeit.scss','../scss/style.scss'])
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('../css'));
});

// run our default gulp tasks and watch for changes
gulp.task('default', ['jshint','scripts','sass'], function() {

  // watch for JavaScript changes
  gulp.watch('../js/typeIt.js', ['jshint', 'scripts']);

  // watch for SASS changes
  gulp.watch('../scss/*.scss', ['sass']);

});
