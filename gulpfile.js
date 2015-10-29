// load our plugins
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require("gulp-rename");

// check JavaScript
gulp.task('jshint',function(){
  gulp.src('src/typeit.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

// minify JavaScript and put it into /dist
gulp.task('scripts', function() {
  gulp.src('src/typeit.js')
    .pipe(uglify())
    .pipe(rename('typeit.min.js'))
    .pipe(gulp.dest('dist'));

  // minify demo scripts
  gulp.src('src/scripts.js')
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('src'));

  // put the unminified JavaScript into /dist
  gulp.src('src/typeit.js')
    .pipe(gulp.dest('dist'));
});

// compile and autoprefix SASS
gulp.task('typeItSass', function () {

  // compile & autoprefix the SCSS in the /src folder
  gulp.src('src/typeit.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('src'));

  // put minified CSS into /dist
  gulp.src('src/typeit.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(rename('typeit.min.css'))
    .pipe(gulp.dest('dist'));

  // put unminified CSS into /dist
  gulp.src('src/typeit.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('dist'));

  // put original SCSS into /dist
  gulp.src('src/typeit.scss')
    .pipe(gulp.dest('dist'));

});

gulp.task('demoSass',function(){
  // compile our local demo SCSS
  gulp.src('src/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefix('last 2 versions'))
    .pipe(gulp.dest('src'));
});

// run our default gulp tasks and watch for changes
gulp.task('default', ['jshint','scripts','typeItSass','demoSass'], function() {

  // watch for JavaScript changes
  gulp.watch('src/*.js', ['jshint', 'scripts']);

  // watch for SASS changes
  gulp.watch('src/typeit.scss', ['typeItSass']);

  // watch for SASS changes
  gulp.watch('src/**/*.scss', ['demoSass']);

});
