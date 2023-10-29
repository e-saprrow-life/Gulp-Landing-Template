import fs from "fs-extra";
import path from "path";
import through2 from "through2";

function cb() { }

// Чистит папку dist, за исключением папок и файлов указаных в переменной exclude
export async function clearDistFolder() {
    try {
        let exclude = ['fonts']; 

        let entries = fs.readdirSync(app.dist.root, { withFileTypes: true });
        for (const entry of entries) {
            if (exclude.includes(entry.name)) continue;
            if (entry.isDirectory()) {
                fs.rm(path.join(app.dist.root, entry.name), { recursive: true });
                console.log(path.join(app.dist.root, entry.name) + ' удалено')
            } else {
                fs.unlink(path.join(app.dist.root, entry.name))
                console.log(path.join(app.dist.root, entry.name) + ' удалено')
            }
        }

        console.log('Папка dist очищена')
    } catch {
        console.log('Ошибка очистки папки dist')
    }
    return 
}



/** Импорт js файлов */
export function jsFileImport(file) {
    return through2.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        // Путь к папке в которой лежит целевой файл относительно корня проекта
        let dirname = path.relative(process.cwd(), file.dirname);

        // Регулярные выражения import('file.js')
        const includeRegex = /import\(\s*['"](.+?)['"]\s*\);?/g;
        const excludeRegex1 = /\/\/\s*import\(\s*['"](.+?)['"]\s*\);?\s*/g;
        const excludeRegex2 = /\/\*\s*import\s*\(\s*['"](.+?)['"]\s*\);?\s*\*\/\s*/g;

        // Сохраняю содержимое файла как строку
        const contents = file.contents.toString();

        // Ищем совпадения по регулярным выражениям
        let replacedContents = contents.replace(excludeRegex1, '').replace(excludeRegex2, '')
            .replace(includeRegex, (match, includePath) => {
                let sourcePath = path.resolve(dirname, includePath); // получаю путь относительно файла
                let map = sourcePath.split('\\src\\')
                if (!fs.existsSync(sourcePath)) return `//== Error: File ${map[1]} not found \n`;
                return `//== Source: ${map[1]} \n` + fs.readFileSync(sourcePath, 'utf8') + `\n`;
            });

        // Записываем в конечный файл
        file.contents = Buffer.from(replacedContents);
        this.push(file);
        cb(null, file);
    })
}



/** Ищет в css все url() в которых указан svg файл и заменяет на содержимое этого svg файла*/
export function svgUrlEncoder(file) {
    return through2.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        /// Путь к папке в которой лежит целевой файл относительно корня проекта
        let dirname = path.relative(process.cwd(), file.dirname);

        // Регулярные выражения для поиска url который содержит ссылку на svg файл
        const includeRegex = /url\(['"]?([^'"]*\.svg)['"]?\)/;

        // Сохраняю содержимое файла как строку
        const contents = file.contents.toString();

        // Поиск по регулярным выражениям
        const replacedContents = contents.replace(includeRegex, (match, includePath) => {
            let sourcePath = path.resolve(dirname, includePath); // получаю путь относительно файла
            if (!fs.existsSync(sourcePath)) { return match; }    // Если svg файла нет возвращаю url как есть
            // return `url('data:image/svg+xml;utf8,` + encodeURIComponent(fs.readFileSync(sourcePath, 'utf8')) + `')`;
            return `url('data:image/svg+xml;utf8,${encodeURIComponent(fs.readFileSync(sourcePath, 'utf8'))}')`;
        });

        // Записываем в конечный файл
        file.contents = Buffer.from(replacedContents);
        this.push(file);
        cb(null, file);
    })
}


/** Синхрнизирует файлы изображений в папке src и в конечной папке 
 * При удалении файла из папки src так же удаляет его копии (в разных форматах) в конечной папке.
*/
export async function imgSync(srcImgPath, buildImgPath) {
    try {
        // Если buildImgPath папки не сужествует выходим
        if (!fs.existsSync(buildImgPath)) return; 

        // Если не существует srcImgPath удаляем buildImgPath
        if (!fs.existsSync(srcImgPath) && fs.existsSync(buildImgPath)) {
            fs.rm(buildImgPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Не удалось удалить папку: ${err.message}`);
                }
            });
            return;
        };

        // Получаю масив из имен фалов из папки srcImgPath. Без учета папок внутри. 
        let srcEntries = fs.readdirSync(srcImgPath, { withFileTypes: true });
        let srcFiles = []; // Только файлы, без папок. Имена файлов без расширения.
        for (const file of srcEntries) {
            if (file.isDirectory()) continue;
            srcFiles.push(getFileBasename(file.name))
        }

        // Читаем buildImgPath получаем вхождения - файл или папка внутри buildImgPath
        const buildEntries = fs.readdirSync(buildImgPath, { withFileTypes: true });

        // Проходимся циклом по каждому элементу в папке buildImgPath
        for (const entry of buildEntries) {
            if (entry.isDirectory()) {
                // Для папки:
                let buildChildPath = path.join(buildImgPath + '/' + entry.name);
                let srcChildPath = path.join(srcImgPath + '/' + entry.name);
                imgSync(srcChildPath, buildChildPath); 
            } else {
                // Для файла:
                let baseName = getFileBasename(entry.name);
                const filePath = path.join(buildImgPath, entry.name);
                if (!srcFiles.includes(baseName)) {
                    fs.unlink(filePath, (err) => {
                        if (err) { console.error(`Ошибка при удалении файла: ${err}`); } 
                    });
                }
            }
        }
    } catch (err) {
        console.error(`Произошла ошибка: ${err.message}`);
    }

    /** Возвращает имя файла без раширения. 
     * Функция работает с определенными форматами.
     * @formats расширеня файлов
     * */
    function getFileBasename(filename) {
        const formats = ['.svg', '.webp', '.png', '.jpeg', '.jpg'];
        for (const format of formats) {
            if (filename.endsWith(format)) {
                return filename.split(format)[0];
            }
        }
    }
}



//=== Fonts:
/** Добавляет в _fonts.scss запись подключения каждого шифта используя миксин
 * Формат имени файла - Gilroy-RegularItalic.ttf
 */
export async function fontsImporter() {
    let fontsFilePath = app.src.scss + "/main/_fonts.scss";

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
            if (entry.name.indexOf('.ttf') !== -1) files.push(subdir + '/' + entry.name);
        } else {
            if (entry.name.indexOf('.ttf') !== -1) files.push(entry.name);
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