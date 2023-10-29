// Common
import gulp from "gulp";
import plumber from "gulp-plumber";
import browserSync from "browser-sync";
import rename from "gulp-rename";
import newer from 'gulp-newer';
// Styles
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import autoprefixer from 'gulp-autoprefixer';
import groupMedia from 'gulp-group-css-media-queries';
import cssCleaner from 'gulp-clean-css';
// JS
import uglify from 'gulp-uglify';
import commentsStripper from 'gulp-strip-comments';
// Fonts
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
// images
import imagemin from 'gulp-imagemin';
import webpConverter from 'gulp-webp';
// HTML
import pug from "gulp-pug";
import htmlBeautify from "gulp-html-beautify";
// My Functions
import { clearDistFolder, jsFileImport, fontsImporter, svgUrlEncoder, imgSync } from './functions.js'


const src = './src';
const dist = './dist';


global.app = {
    src: {
        fonts: src+'/fonts',
        scss:  src+'/scss',
        img:   src+'/img',
        js:    src+'/js',
        pug:   src+'/pug',
        root:  src
    },
    dist: {
        fonts: dist+'/fonts',
        css:   dist+'/css',
        img:   dist+'/img',
        js:    dist+'/js',
        root:  dist+'/'
    }
}


function watch() {
    gulp.watch(app.src.root+'/**/*.pug',   gulp.series(pug2html, serverReload));
    gulp.watch(app.src.img +'/**/*.*',     gulp.series(images, serverReload));
    gulp.watch([app.src.js  +'/**/*.js', '!'+app.src.js+'/libs.js', '!'+app.src.js+'/libs/**/*.js'],  gulp.series(jsScripts, serverReload));
    gulp.watch(app.src.js  +'/libs.js',    gulp.series(jsLibs, serverReload));
    gulp.watch([app.src.scss+'/**/*.scss', '!'+app.src.scss+'/libs/*.scss', '!'+app.src.scss+'/libs.scss'], gulp.series(styleCss, serverReload));
    gulp.watch(app.src.scss+'/libs.scss',  gulp.series(libsCss, serverReload));
}


// export const start = gulp.series(
//     clearDistFolder,
//     gulp.parallel(pug2html, styleCss, libsCss, jsScripts, jsLibs, images, watch, serverInit)
// );
export const start = gulp.series(
    clearDistFolder,
    pug2html,
    gulp.parallel(styleCss, libsCss),
    gulp.parallel(jsScripts),
    gulp.parallel(jsLibs, images, watch, serverInit)
    // gulp.parallel(jsLibs, images, watch)
);


export const fonts = gulp.series(fontConverter, fontsImporter);


function serverInit() {
    browserSync.create();
    browserSync.init({
        server: dist + '/',
        notify: false,
        port: 3000,
        // https: true
    });
}



function serverReload(cb) {
    browserSync.reload();
    cb();
}


function fontConverter() {
    return gulp.src(app.src.fonts+'/**/*.ttf')
    .pipe(gulp.dest(app.dist.fonts))
    .pipe(gulp.src(app.src.fonts+'/**/*.ttf'))
    .pipe(ttf2woff()) // ttf to woff
    .pipe(gulp.dest(app.dist.fonts))
    .pipe(gulp.src(app.src.fonts+'/**/*.ttf'))
    .pipe(ttf2woff2()) // ttf to woff2
    .pipe(gulp.dest(app.dist.fonts))
}


function images() {
    imgSync(app.src.img, app.dist.img)
    return gulp.src(app.src.img+'/**/*.*')
        .pipe(plumber())
        .pipe(newer(app.dist.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            interLaced: true,
            optimizationLevel: 4 // 0 - 7 
        }))
        .pipe(gulp.dest(app.dist.img))
        .pipe(webpConverter())
        .pipe(gulp.dest(app.dist.img))
}


function jsScripts() {
    return gulp.src(app.src.js+'/script.js')
        .pipe(plumber())
        .pipe(jsFileImport())
        .pipe(commentsStripper({
            ignore: [/\/\/== Source: (.+)/g, /\/\/== Error: (.+)/g],
            trim: true
        }))
        .pipe(rename({ basename: "script" }))
        .pipe(gulp.dest(app.dist.js))
}


function jsLibs() {
    return gulp.src(app.src.js+'/libs.js')
        .pipe(plumber())
        .pipe(jsFileImport())
        .pipe(uglify({
            mangle: false,
            output: {
                comments: false // Оставить комменты
            }
        }))
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(app.dist.js))
}


function pug2html() {
    return gulp.src([ app.src.root+'/**/*.pug',  '!'+app.src.pug+'/**/*.pug'])
        .pipe(plumber())
        .pipe(pug())
        .pipe(htmlBeautify({
            "indent_size": 4
        }))
        .pipe(gulp.dest(app.dist.root))
}


function styleCss() {
    return gulp.src(app.src.scss+'/style.scss')
        .pipe(plumber(function () {
            console.log(123)
            return; 
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ["last 3 versions"], // Поддержка трех последних версий
            cascade: true
        }))
        .pipe(groupMedia())
        .pipe(svgUrlEncoder())
        .pipe(gulp.dest(app.dist.css))
}


function libsCss() {
    return gulp.src(app.src.scss+'/libs.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssCleaner())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(app.dist.css))
}