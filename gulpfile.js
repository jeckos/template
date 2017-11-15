'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const debug = require('gulp-debug');
const del = require('del');
const browserSync = require('browser-sync').create();
const notify = require("gulp-notify");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const urlAdjuster = require('gulp-css-url-adjuster');

gulp.task('sass', function () {
    return gulp.src('frontend/sass/**/style.scss')
            .pipe(debug({title: 'src'}))
            .pipe(sourcemaps.init())
            .pipe(sass().on('error',notify.onError()))
            .pipe(autoprefixer({
                browsers: ['last 10 versions'],
                cascade: false
            }))
            .pipe(urlAdjuster({
                replace:  ['../../assets/img/','../img/'],
             }))
            .pipe(debug({title: 'sass'}))
                .pipe(sourcemaps.write())
            .pipe(gulp.dest('public/css'))
            .pipe(debug({title: 'css'}))
            .pipe(browserSync.reload({
                stream:true
            }));
});

gulp.task('clean', function () {
    return del(['public']);
});

gulp.task('assets', function () {
    return gulp.src('frontend/assets/**', {
        since: gulp.lastRun('assets')
    }).pipe(debug({
        title: 'assets'
    })).pipe(gulp.dest('public'))
        .on('end', browserSync.reload);
});

gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'assets')));

gulp.task('watch', function () {
    gulp.watch('frontend/sass/**/*.*', gulp.series('sass'));
    gulp.watch('frontend/assets/**', gulp.series('assets'));
});



gulp.task('serve', function () {
    browserSync.init({
        server: 'public',
        files: "public/**/*.html"
    });
    // browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'serve')));
