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



gulp.task('default', ['js'], () => {
    browserSync({
        server: {
            baseDir: './'
        }
    });

    gulp.watch(['*.html', 'dist/**/*'], { cwd: './' }, reload);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
});

gulp.task('build', ['js:build', 'sass:build']);
