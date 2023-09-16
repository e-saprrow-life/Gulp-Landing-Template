const workPath = './app'; 

import gulp from "gulp";
import plumber from "gulp-plumber";
import browserSync from "browser-sync";
import rename from "gulp-rename";

import uglify from 'gulp-uglify';

import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import groupMedia from 'gulp-group-css-media-queries';
import cssCleaner from 'gulp-clean-css';

import {jsFileImport, importFonts} from './gulp/functions.js'



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
        js: workPath + '/js'
    },
    watch: {
        jsScripts: [workPath + '/js/app.js', workPath + '/js/modules/*.js'],
        jsLibs: [workPath + '/js/libs.js', workPath + '/js/libs/*.js'],
        scss: [workPath + '/scss/**/*.scss', '!' + workPath + '/scss/libs.scss', '!' + workPath + '/scss/libs/**/*.scss'],
        scssLibs: [workPath + '/scss/libs.scss', workPath + '/scss/libs/**/*.scss']
    }
}



function watch() {
    gulp.watch(app.watch.jsScripts, gulp.series(jsScripts, serverReload));
    gulp.watch(app.watch.jsLibs, gulp.series(jsLibs, serverReload));
    gulp.watch(app.watch.scss, gulp.series(styleCss, serverReload));
    gulp.watch(app.watch.scssLibs, gulp.series(libsCss, serverReload));
}



// Main task
export const start = gulp.series( 
    gulp.parallel(jsScripts, jsLibs, styleCss, libsCss, watch, serverInit)
);

// Font converter
export const fonts = gulp.series(fontsConverter, importFonts);



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



function fontsConverter() {
    return gulp.src(app.src.fonts + '/**/*.ttf')
    // ttf to woff & eot
    .pipe(fonter({ formats: ['woff', 'eot'] }))
    .pipe(gulp.dest(app.dest.fonts))
    // ttf to woff2
    .pipe(ttf2woff2())
    .pipe(gulp.dest(app.dest.fonts))
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
    .pipe(gulp.dest(app.dest.css))
}


function libsCss() {
    return gulp.src(app.src.scss + '/libs.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(cssCleaner())
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest(app.dest.css))
}