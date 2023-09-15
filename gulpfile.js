const workPath = './app'; 

import gulp from "gulp";
import plumber from "gulp-plumber";
import browserSync from "browser-sync";
import rename from "gulp-rename";
import uglify from 'gulp-uglify';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
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
        js: workPath + '/js',
        fonts: workPath + '/fonts'
    },
    watch: {
        jsScripts: [workPath + '/js/app.js', workPath + '/js/modules/*.js'],
        jsLibs: [workPath + '/js/libs.js', workPath + '/js/libs/*.js']
    }
}



function watch() {
    gulp.watch(app.watch.jsScripts, gulp.series(jsScripts, serverReload));
    gulp.watch(app.watch.jsLibs, gulp.series(jsLibs, serverReload));
}



// Main task
export const start = gulp.series( 
    jsScripts,
    jsLibs,
    gulp.parallel( watch, serverInit)
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