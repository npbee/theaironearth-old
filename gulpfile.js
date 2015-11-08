'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const babelify = require('babelify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const minifyHtml = require('gulp-minify-html');
const imagemin = require('gulp-imagemin');

let reload = browserSync.reload;


/**
 * SASS
 */
const sassOptions = {
    outputStyle: 'expanded'
};
const sassProdOpts = {
    outputStyle: 'compressed'
};

gulp.task('sass', () => {
    return gulp
        .src('./src/scss/**/*.scss')
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('sass:build', () => {
    return gulp
        .src('./src/scss/**/*.scss')
        .pipe(sass(sassProdOpts).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'));
});


/**
 * JS
 */

const browserifyOpts = {
    entries: ['src/js/app.js'],
    transform: [babelify.configure({
        presets: ['es2015']
    })]
};
const watchifyOpts = Object.assign({}, watchify.args, browserifyOpts);

let devBuild = watchify(browserify(browserifyOpts));
let prodBuild = browserify(browserifyOpts);

devBuild.on('update', bundleDev);
devBuild.on('log', gutil.log);

function bundleProd() {
    return prodBuild.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
}

function bundleDev() {
    return devBuild.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));
}

gulp.task('js', bundleDev);
gulp.task('js:build', bundleProd);



/**
 * HTML
 */
gulp.task('html', () => {
    const opts = {};

    return gulp.src('./src/index.html')
        .pipe(minifyHtml(opts))
        .pipe(gulp.dest('./dist/'));
});



/**
 * Images
 */
gulp.task('images', () => {
    const opts = {};

    return gulp.src('./src/img/*')
        .pipe(imagemin(opts))
        .pipe(gulp.dest('./dist/img'))
});




gulp.task('default', ['js'], () => {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(['dist/**/*'], { cwd: './' }, reload);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/html', ['html']);
});

gulp.task('build', ['js:build', 'sass:build']);
