'use strict';

var gulp = require('gulp');

// utils
var rename = require('gulp-rename');
var run = require('run-sequence');
var del = require('del');
var server = require('browser-sync').create();
var plumber = require('gulp-plumber');

// html
var pug = require('gulp-pug');

// css
var csscomb = require('gulp-csscomb');
var minify = require('gulp-csso');
var mqpacker = require('css-mqpacker');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');

// js
var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// image
var imagemin = require('gulp-imagemin');

// svg
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');

// deploy
var ghPages = require('gulp-gh-pages');

var path = {
    build: {
      js: 'build/js/',
      img: 'build/img/**/*.{png,jpg,gif}'
    },
    src: {
      js: 'src/js/app.js'
    },
    copy: {
      font: 'src/fonts/*.{woff,woff2,ttf,eot,otf,pfm,pfb}',
      img: 'src/img/{**/*.{png,jpg,gif}, !icons/}'
    }
};


gulp.task('copy', function() {
  return gulp.src([
      path.copy.font,
      path.copy.img
    ], {
      base: 'src'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
  return browserify(path.src.js)
    .bundle()
    .pipe(source('script.js'))
    .pipe(buffer())
    // .pipe(uglify())
    .pipe(gulp.dest(path.build.js));
});

gulp.task('style', function() {
  gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        'last 1 version',
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Opera versions',
        'last 2 Edge versions'
      ]
    }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(csscomb())
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('serve', function() {
  server.init({
    server: 'build',
    notify: false,
    open: true,
    ui: false
  });
  gulp.watch('src/sass/**/*.{scss,sass}', ['style']);
  gulp.watch(['src/*.pug', 'src/pug/**/*.pug'], ['views']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('build/*.html').on('change', server.reload);
  // gulp.watch('src/*.html').on('change', server.reload);
});

gulp.task('images', function() {
  return gulp.src(path.build.img)
  .pipe(imagemin([
     imagemin.optipng({optimizationLevel: 3}),
     imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest('build/img'));
});

gulp.task('symbols', function() {
  return gulp.src('src/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({
     inlineSvg: true
     }))
  .pipe(rename('symbols.pug'))
  .pipe(gulp.dest('src/pug/components/'));
});

gulp.task('views', function() {
  return gulp.src('src/*.pug')
  .pipe(plumber())
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('build/'));
});

gulp.task('build', function(fn) {
  run(
    'clean',
    'copy',
    'views',
    'style',
    'images',
    'symbols',
    'scripts',
    fn
  );
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

gulp.task('clean', function() {
 return del('build');
});
