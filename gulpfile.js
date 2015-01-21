"use strict";

var gulp = require('gulp'),
	  autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    opn = require('opn'),
    connect = require('gulp-connect'),
 	  jade = require('gulp-jade'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    wiredep = require('wiredep').stream,
    clean = require('clean'),
    less = require('gulp-less');

// Запускаем локальный сервер
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
  opn('http://localhost:8080/');
});

// HTMl
gulp.task('html', function () {
  gulp.src('app/*.html')
    .pipe(connect.reload());
});

// CSS
gulp.task('css', function () {
  gulp.src('app/css/*.css')
    .pipe(connect.reload());
});

// JS
gulp.task('js', function () {
  gulp.src('app/js/*.js')
    .pipe(connect.reload());
});

// JADE
gulp.task('jade', function() {
    gulp.src('app/jade/*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('app/'))
        .pipe(connect.reload());
});

// LESS
gulp.task('less', function () {
  gulp.src('app/less/*.less')
    .pipe(less())
    .pipe(autoprefixer(['last 2 versions', '> 1%', 'ie 9'], {cascade: false}))
    .pipe(gulp.dest('app/css/'))
    .pipe(connect.reload());
});

// Подключаем ссылки на bower_components
gulp.task('wiredep', function () {
  gulp.src('app/*.html')
    .pipe(wiredep({
      directory : 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

// Сборка в папку dist
gulp.task('build', function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js'))
        .pipe(gulpif('*.css'))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Очистка
gulp.task('clean', function () {
    return gulp.src('dist', {read: false}).pipe(clean());
});

// Слежка!
gulp.task('watch', function () {
  gulp.watch(['app/less/*.less'], ['less']);
  gulp.watch(['app/jade/*.jade'], ['jade']);
  gulp.watch(['app/js/*.js'], ['js']);
  gulp.watch(['bower.json'], ['wiredep']);
});

// Default
gulp.task('default', ['connect', 'watch']);