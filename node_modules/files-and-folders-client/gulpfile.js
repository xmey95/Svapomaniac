(function () {
    'use strict';

    var gulp = require('gulp');
    var templateCache = require('gulp-angular-templatecache');
    var watch = require('gulp-watch');
    var concat = require('gulp-concat');
    //var minifyCss = require('gulp-minify-css');
    var usemin = require('gulp-usemin');
    var uglify = require('gulp-uglify');
    var htmlmin = require('gulp-htmlmin');
    var cssnano = require('gulp-cssnano');
    var rev = require('gulp-rev');
    var fs = require('fs-extra');

    var htmMinOptions = {collapseWhitespace: true, removeComments: true};

    var templateCacheGlob = [
        'src/**/*.html',
        '!src/inde*.html'
    ];
    var dirDest = 'release';
    var dirDestJs = dirDest + '/js';
    var dirDestAssets = dirDest + '/assets';

    gulp.task('assets', function () {
        return gulp
            .src('src/assets/**/*.*')
            .pipe(gulp.dest(dirDestAssets));
    });

    gulp.task('templateCache', ['assets'], function () {
        return gulp
            .src(templateCacheGlob)
            .pipe(htmlmin(htmMinOptions))
            .pipe(templateCache({
                root: '/',
                standalone: true
            }))
            .pipe(gulp.dest(dirDestJs));
    });

    gulp.task('usemin', ['templateCache'], function () {
        return gulp
            .src('src/index.html')
            .pipe(usemin({
                assetsDir: '',
                outputRelativePath: '',
                //css: [],
                html: [function () {
                    return htmlmin(htmMinOptions);
                }],
                js: [uglify({compress:true})/*, rev()*/],
                js1: [uglify({compress:true})/*, rev()*/],
                inlinecss: [
                    cssnano(),
                    'concat'
                ]
            }))
            .pipe(gulp.dest(dirDest));
    });

    gulp.task('useminsmall', ['templateCache'], function () {
        return gulp
            .src('src/index.html')
            .pipe(usemin({
                assetsDir: '',
                outputRelativePath: '',
                html: [function () {
                    return htmlmin(htmMinOptions);
                }],
                js1: [uglify({compress:true})/*, rev()*/],
                inlinecss: [cssnano(), 'concat' ]
            }))
            .pipe(gulp.dest(dirDest));
    });


    gulp.task('watch', ['usemin'], function () {
        watch([
            'src/**/*.*'
        ], function () {
            gulp.start(['useminsmall']);
        });
    });

    gulp.task('default', [
        'usemin',
        'watch'
    ]);

}());