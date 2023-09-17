const workPath = './app';

// Common
import gulp from "gulp";
import plumber from "gulp-plumber";
import browserSync from "browser-sync";
import rename from "gulp-rename";
// Styles
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import autoprefixer from 'gulp-autoprefixer';
import groupMedia from 'gulp-group-css-media-queries';
import cssCleaner from 'gulp-clean-css';
// JS
import uglify from 'gulp-uglify';
// Fonts
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
// HTML
import pug from "gulp-pug";
import htmlBeautify from "gulp-html-beautify";
// My Functions
import { jsFileImport, fontsImporter, svgUrlEncoder } from './functions.js'



global.app = {
    src: {
        fonts: workPath + '/fonts',
        img: workPath + '/img',
        js: workPath + '/js',
        pug: workPath + '/pug',
        scss: workPath + '/scss',
        root: workPath + '',
    },
    dest: {
        css: workPath + '/css',
        fonts: workPath + '/fonts',
        js: workPath + '/js',
        root: workPath + ''
    },
    watch: {
        jsScripts: [workPath + '/js/app.js', workPath + '/js/modules/*.js'],
        jsLibs: [workPath + '/js/libs.js', workPath + '/js/libs/*.js'],
        pug: workPath + '/pug/**/*.pug',
        scss: [workPath + '/scss/**/*.scss', '!' + workPath + '/scss/libs.scss', '!' + workPath + '/scss/libs/**/*.scss'],
        scssLibs: [workPath + '/scss/libs.scss', workPath + '/scss/libs/**/*.scss']

    },
    ftp: {
        userName: '',
        password: '',
        host: '',
    }
}



function watch() {
    gulp.watch(app.watch.jsScripts, gulp.series(jsScripts, serverReload));
    gulp.watch(app.watch.jsLibs, gulp.series(jsLibs, serverReload));
    gulp.watch(app.watch.pug, gulp.series(html, serverReload));
    gulp.watch(app.watch.scss, gulp.series(styleCss, serverReload));
    gulp.watch(app.watch.scssLibs, gulp.series(libsCss, serverReload));
}



// Main task
export const start = gulp.series(
    gulp.parallel(html, styleCss, libsCss, jsScripts, jsLibs, watch/* , serverInit */)
);

// Fons
export const fonts = gulp.series(fontsConverter, fontsImporter);



//= Tasks: 

function serverInit() {
    browserSync.create();
    browserSync.init({
        server: workPath + '/',
        notify: false,
        port: 3000,
    });
}

function serverReload(cb) {
    browserSync.reload();
    cb();
}



function fontsConverter() {
    return gulp.src(app.src.fonts + '/**/*.ttf')
        .pipe(fonter({ formats: ['woff', 'eot'] }))  // ttf to woff & eot
        .pipe(gulp.dest(app.dest.fonts))
        .pipe(ttf2woff2()) // ttf to woff2
        .pipe(gulp.dest(app.dest.fonts))
}



function jsScripts() {
    return gulp.src(app.src.js + '/app.js')
        .pipe(plumber())
        .pipe(jsFileImport())
        .pipe(rename({ basename: "script" }))
        .pipe(gulp.dest(app.dest.js))
}

function jsLibs() {
    return gulp.src(app.src.js + '/libs.js')
        .pipe(plumber())
        .pipe(jsFileImport())
        .pipe(uglify({
            mangle: false,
            output: {
                comments: false // Оставить комменты
            }
        }))
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(app.dest.js))
}



function html() {
    return gulp.src([app.src.pug + '/*.pug', '!' + app.src.pug + '/**/'])
        // return gulp.src(app.src.pug + '/*.pug')
        .pipe(plumber())
        .pipe(pug())
        .pipe(htmlBeautify({
            "indent_size": 4
        }))
        .pipe(gulp.dest(app.dest.root))
}



function styleCss() {
    return gulp.src(app.src.scss + '/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ["last 3 versions"], // Поддержка трех последних версий
            cascade: true
        }))
        .pipe(groupMedia())
        .pipe(svgUrlEncoder())
        .pipe(gulp.dest(app.dest.css))
}

function libsCss() {
    return gulp.src(app.src.scss + '/libs.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssCleaner())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(app.dest.css))
}