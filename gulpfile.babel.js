'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserSync from 'browser-sync';
import uglify from 'gulp-uglify';
import minifyHtml from 'gulp-minify-html';
import imagemin from 'gulp-imagemin';
import fs from 'fs';
import s3 from 'gulp-s3';
import del from 'del';

let reload = browserSync.reload;

/**
 * Clean
 */
gulp.task('clean', () => {
    return del([
        './dist/**/*'
    ]);
});


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
    transform: [babelify]
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



/**
 * Copy favicon
 */
gulp.task('favicon', () => {
    return gulp.src('./src/img/favicon.ico')
        .pipe(gulp.dest('./dist/img'));
});



/**
 * Deploy
 */
const creds = JSON.parse(fs.readFileSync('./aws.json'));
gulp.task('deploy', ['build'], () => {
    return gulp.src('./dist/**')
        .pipe(s3(creds));
});


/**
 * Default
 *
 * Runs all tasks first then watches for changes.
 */
gulp.task('default', ['clean', 'sass', 'html', 'images', 'js'], () => {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(['dist/**/*'], { cwd: './' }, reload);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/index.html', ['html']);
});

gulp.task('build', ['clean', 'js:build', 'sass:build', 'html', 'images']);
