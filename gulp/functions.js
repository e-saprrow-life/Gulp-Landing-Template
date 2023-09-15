import fs from "fs";
import path from "path";
import through2 from "through2";

function cb() {}

//=== JS: 

/** Ищет внутри файла директиву импорта другого js файла в текущий
 * и заменяет ее на содержимое импортируемого файла
 */
export function jsFileImport(file) {
    return through2.obj(function(file, encoding, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        // Путь к исходному файлу относительно корня проекта
        let sourceFilePaht = path.relative(process.cwd(), file.dirname);

        // Регулярные выражения import('file.js')
        const includeRegex = /import\(\s*['"](.+?)['"]\s*\);?/g;
        const excludeRegex1 = /\/\/\s*import\(\s*['"](.+?)['"]\s*\);?\s*/g;
        const excludeRegex2 = /\/\*\s*import\s*\(\s*['"](.+?)['"]\s*\);?\s*\*\/\s*/g;

        // Регулярные выражения @import 'file.js'
        // const includeRegex = /@import\s*['"](.+?)['"]\s*/g;
        // const excludeRegex1 = /\/\/\s*@import\s*['"](.+?)['"]\s*/g;
        // const excludeRegex2 = /\/\*\s*@import\s*['"](.+?)['"]\s*\*\/\s*/g;

        // Сохраняю содержимое файла как строку
        const contents = file.contents.toString();

        /** Поиск по регулярным выражениям.
         * если находим @import('path') вставляем содеримое из файла path
         * если находим закомменченый @import('path') - игнорим 
         */
        const replacedContents = contents
        .replace(excludeRegex1, '')
        .replace(excludeRegex2, '')
        .replace(includeRegex, (match, includePath) => {
            let sourcePath = path.resolve(sourceFilePaht, includePath); // получаю путь относительно файла libs.js
            let map = sourcePath.split('\\app\\')
            if ( !fs.existsSync(sourcePath) ) {
                return `//== Error: File ${map[1]} not found \n\n\n`
            }
            return `//== Source: ${map[1]} \n` + fs.readFileSync(sourcePath, 'utf8') + `\n\n\n`;
        });

        // Записываем в конечный файл
        file.contents = Buffer.from(replacedContents);
        this.push(file);
        cb(null, file);
    })
}

//=== END JS: 



//=== Fonts:

/** Добавляет в _fonts.scss запись подключения каждого шифта используя миксин
 * Формат имени файла - Gilroy-RegularItalic.ttf
 */
export async function importFonts() {
    let fontsFilePath = app.src.scss + "/_fonts.scss";

    // Проверяю наличие файла. Если пустой то записываю в него подключение шрифтовЮ если не пустой - то нет
    await fs.readFile(fontsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла:', err);
        } else {
          if (data.length > 0) {
            console.log(`Файл "${fontsFilePath}" не пустой.`);
          } else {
            console.log(`Файл "${fontsFilePath}" пустой.`);
            let files = getFiles(app.src.fonts);

            console.log("Подключаю шрифты: ", files)

            fs.writeFileSync(fontsFilePath, '');
    
            for (let i in files) {
                let fontPath = files[i].split('.')[0];
                fs.appendFile(fontsFilePath, `@include font-face("${getFontFamily(files[i])}", "../fonts/${fontPath}", ${getFontWeight(files[i])}, ${getFontStyle(files[i])});\n`, cb);
            }
          }
        }
    });

    return;
}



// Возвращает масив с именами фалов в паке app/fonts а так же в подпапках
function getFiles(dir, files = [], subdir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullpath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
           getFiles(fullpath, files, entry.name);
        } else if (subdir) {
            if (entry.name.indexOf('.ttf') !== -1)  files.push(subdir + '/' + entry.name);
        } else {
            if (entry.name.indexOf('.ttf') !== -1)  files.push(entry.name);
        }
    }
    return files;
}



// Возвращает font-family шрифта
function getFontFamily(entry) {
    let fileName = entry.split('/')[1] ? entry.split('/')[1] : entry;
    if (fileName.split('-')[1]) {
        return fileName.split('-')[0]
    } else if (fileName.split('.')[0]) {
        return fileName.split('.')[0]
    }
}



// Возвращает font-weight шрифта
function getFontWeight(entry) {
    let fontWeight = entry.split('-')[1] ? entry.split('-')[1] : entry;
    if (fontWeight.toLowerCase().indexOf('thin') !== -1) {
        return 100;
    } else if (fontWeight.toLowerCase().indexOf('extralight') !== -1) {
        return 200;
    } else if (fontWeight.toLowerCase().indexOf('light') !== -1 && fontWeight.toLowerCase().indexOf('extralight') === -1) {
        return 300;
    } else if (fontWeight.toLowerCase().indexOf('medium') !== -1) {
        return 500;
    } else if (fontWeight.toLowerCase().indexOf('semibold') !== -1) {
        return 600;
    } else if (fontWeight.toLowerCase().indexOf('bold') !== -1 && fontWeight.toLowerCase().indexOf('semibold') === -1 && fontWeight.toLowerCase().indexOf('extrabold') === -1) {
        return 700;
    } else if (fontWeight.toLowerCase().indexOf('extrabold') !== -1 || fontWeight.toLowerCase().indexOf('heavy') !== -1) {
        return 800;
    } else if (fontWeight.toLowerCase().indexOf('black') !== -1) {
        return 900;
    } else {
        return 400;
    }
}



// Возвращает font-style шрифта
function getFontStyle(entry) {
    if (entry.toLowerCase().indexOf('italic') !== -1) {
        return 'italic';
    } else {
        return 'normal'
    }
}


//=== END Fonts: