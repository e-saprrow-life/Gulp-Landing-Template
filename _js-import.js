import fs from "fs";
import path from "path";
import through2 from "through2";



// export default function jsFileImport(file) {
function jsFileImport(file) {
    return through2.obj(function(file, encoding, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        // Путь к исходному файлу относительно корня проекта
        let sourceFilePaht = path.relative(process.cwd(), file.dirname);

        // Регулярные выражения
        const includeRegex = /import\(\s*['"](.+?)['"]\s*\);?/g;
        const excludeRegex1 = /\/\/\s*import\(\s*['"](.+?)['"]\s*\);?\s*/g;
        const excludeRegex2 = /\/\*\s*import\s*\(\s*['"](.+?)['"]\s*\);?\s*\*\/\s*/g;

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

export default jsFileImport;