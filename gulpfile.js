var gulp = require('gulp'),
    connect = require('gulp-connect'),
    //usemin = require('gulp-usemin'),
    //cssmin = require('gulp-minify-css'),
    //htmlmin = require('gulp-minify-html'),
    ngmin = require('gulp-ngmin'),
    //rev = require('gulp-rev'),
    //uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    karma = require('gulp-karma'),
    es = require('event-stream'),
    runSequence = require('run-sequence'),
    sass = require('gulp-ruby-sass');

var src_base = 'src/';
var test_base = 'src/test/';

var target_dir = 'build/';

var files = [
    src_base + 'vendor/jquery/jquery.js',
    src_base + 'vendor/angular/angular.js',
    src_base + 'vendor/angular-*/angular-*.js',
    src_base + 'vendor/moment/moment.js',

    src_base + 'app.js',
    src_base + 'app/**/*.js',
    src_base + 'app/**/*.html',

    test_base + 'test-utils.js',    // Phantom js feature fixes + Jasmine additional matchers
    test_base + 'mocks/*.js',
    test_base + 'fixtures/**/*.js',
    test_base + 'specs/**/*_spec.js'
];

gulp.task('server', function() {
  return connect.server({
    root: 'src/main/',
    port: 8000
  });
});

gulp.task('clean', function() {
  return gulp.src(target_dir).pipe(clean({force: true}));
});

gulp.task('really-clean', function() {
  return gulp.src([target_dir, 'node_modules/', 'src/vendor/']).pipe(clean());
});

gulp.task('usemin', function() {
  return gulp.src([src_base + 'index.html'])
      .pipe(usemin({
        css: [cssmin(), rev()],
        html: [htmlmin({empty: true})],
        js: [ngmin(), uglify(), rev()]
      }))
      .pipe(gulp.dest(target_dir));
});

gulp.task('copy-files', function( cb ) {
  es.concat(
      gulp.src(src_base + 'manifest.webapp').pipe(gulp.dest(target_dir)),
      gulp.src(src_base + 'components/**/*.html').pipe(gulp.dest(target_dir + 'components')),
      gulp.src(src_base + 'vendor/font-awesome/fonts/**').pipe(gulp.dest(target_dir + 'fonts'))
  ).on('done', cb);
});

gulp.task('test', function() {
  return gulp.src(files)
      .pipe(karma({
        configFile: test_base + 'config/karma.conf.js',
        action: 'run'
      }))
      .on('error', function( err ) {
        throw err;
      });
});

gulp.task('build', function() {
  runSequence('clean', 'test', ['copy-files', 'usemin']);
});

gulp.task('copy-app', function() {
    return gulp.src([src_base + 'index.html'])
        .pipe(usemin())
        .pipe(gulp.dest(target_dir));
});

gulp.task('default', function () {
    return runSequence('clean', 'make-css', 'test', ['copy-files', 'copy-app']);
});

gulp.task('watch', function() {
    gulp.src(files)
        .pipe(karma({
            configFile: test_base + 'config/karma.conf.js',
            action: 'watch'
        }));
});

gulp.task('make-css', function () {
    return gulp.src(src_base + 'app.sass')
        .pipe(sass())
        .pipe(gulp.dest(src_base));
});

gulp.task('sass', function () {
   return runSequence('make-css', 'copy-app');
});
