const workPath = './app'; 

import gulp from "gulp";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import jsFileImport from "./_js-import.js";
import uglify from 'gulp-uglify';
import browserSync from "browser-sync";


const app = {
    src: {
        fonts: workPath + '/fonts',
        img: workPath + '/img',
        js: workPath + '/js',
        pug: workPath + '/pug',
        scss: workPath + '/scss',
        root: workPath + '',
    },
    dest: {
        js: workPath + '/js'
    },
    watch: {
        jsScripts: [workPath + '/js/app.js', workPath + '/js/modules/*.js'],
        jsLibs: [workPath + '/js/libs.js', workPath + '/js/libs/*.js']
    }
}


function serverInit() {
    browserSync.create();

    browserSync.init({
        server: workPath + '/',
        notify: false,
        port: 3000,
    });
}

function reload(cb) {
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



function watch() {
    gulp.watch(app.watch.jsScripts, gulp.series(jsScripts, reload));
    gulp.watch(app.watch.jsLibs, gulp.series(jsLibs, reload));
}



export const start = gulp.series( 
    jsScripts,
    jsLibs,
    gulp.parallel( watch, serverInit)
);


// import { path } from "./gulp/config/path.js";
// import { plugins } from "./gulp/config/plugins.js";
// import { pug2html } from "./gulp/tasks/html.js";
// import { css, cssLibs, minCss } from "./gulp/tasks/styles.js";
// import { js, jsLibs, minJs } from "./gulp/tasks/scripts.js";
// import { imagesMin, img } from "./gulp/tasks/images.js";
// import { createSprite } from "./gulp/tasks/sprite.js";
// import { convertFonts, importFonts } from "./gulp/tasks/fonts.js";



// global.gulp    = gulp;      // Передаю в глобальную переменную основной модуль gulp
// global.path    = path;      // Передаю в глобальную переменнаю объект path с путями
// global.plugins = plugins;   // Передаю в глобальную переменнаю объект всех плагинов сборки

// global.settings = {
//     useWebp: true,
//     ftp: {
//         host: '',
//         port: '',
//         userName: '',
//         password: ''
//     }
// }



// function initServer() {
//     plugins.server.create()
//     plugins.server.init({
//         server: path.build.root,
//         notify: false,
//         port: 3000,
//     })
// }

// function reloadServer(cb) {
// 	plugins.server.reload();
//     cb();
// }


// function watcher() {
//     gulp.watch( path.watch.pug,      gulp.series( pug2html, reloadServer ) );
//     gulp.watch( path.watch.scss,     gulp.series( css, reloadServer ) );
//     gulp.watch( path.watch.scssLibs, gulp.series( cssLibs, reloadServer ) );
//     gulp.watch( path.watch.js,       gulp.series( js, reloadServer ) );
//     gulp.watch( path.watch.jsLibs,   gulp.series( jsLibs, reloadServer ) );
//     gulp.watch( path.watch.img,      gulp.series( gulp.parallel( img ), reloadServer ) );
//     gulp.watch( path.watch.sprite,   gulp.series( createSprite, pug2html, reloadServer ) );
// }



// export const fonts = gulp.series(convertFonts, importFonts);



// export const start = gulp.series( 
//     createSprite,
//     gulp.parallel(pug2html, css, cssLibs, js, jsLibs, img, watcher, initServer),
//     gulp.parallel(watcher, initServer)
    
//     // gulp.parallel(pug2html, css, cssLibs, img),
//     // gulp.parallel(js, jsLibs),
//     // gulp.parallel(watcher), 
    
// );

// export const libs = gulp.series(jsLibs);


// export const min = gulp.parallel( 
//     // minCss,
//     // minJs, 
//     imagesMin 
// );