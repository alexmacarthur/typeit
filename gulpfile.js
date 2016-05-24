var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var browserSync = require('browser-sync');
var cp = require('child_process');

gulp.task('build', function (done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('rebuild', ['build'], function () {
  browserSync.reload();
});

gulp.task('browserSync', ['sass','scripts','build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

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
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('_includes'));

  gulp.src('assets/js/scripts.js')
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('_includes'));
});

gulp.task('sass',function(){
  gulp.src('assets/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefix('last 3 versions'))
    .pipe(gulp.dest('_includes'));
});

gulp.task('watchSite', function() {
  gulp.watch('assets/js/*.js', ['jshint', 'scripts', 'rebuild']);
  gulp.watch(['index.html', '_layouts/*', '_includes/*', 'docs/*'], ['rebuild']);
  gulp.watch('assets/scss/**/*.scss', ['sass', 'rebuild']);
});

gulp.task('default', ['browserSync', 'watchSite']);

gulp.task('develop', ['scripts'], function() {
  gulp.watch('dev/*', ['jshint', 'scripts']);
});