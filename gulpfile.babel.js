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

let reload = browserSync.reload;


/**
 * SASS
 */
const sassOptions = {
    outputStyle: 'expanded'
};

gulp.task('sass', () => {
    return gulp
        .src('./src/scss/**/*.scss')
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'));
});


/**
 * JS
 */
const customOpts = {
    entries: ['src/js/app.js'],
    transform: [babelify]
};
const opts = Object.assign({}, watchify.args, customOpts);
let b = watchify(browserify(opts));

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));
}



gulp.task('default', ['js'], () => {
    browserSync({
        server: {
            baseDir: './'
        }
    });

    gulp.watch(['*.html', 'dist/**/*'], { cwd: './' }, reload);
    gulp.watch('./src/scss/**/*.scss', ['sass']);
});
