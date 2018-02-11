const { writeFile, readdir, lstatSync, readFile, mkdir, mkdirSync } = require(`fs`);

const path = require(`path`);

const { camelToSnakeCase } = require(`json-style-converter`);

const createObjectString = (lines) => {
    const linesString = lines.reduce((currentString, line, i) => {
        let lineString = `${line}`;

        lineString = `    ${lineString},`;

        if (i !== lines.length - 1) {
            lineString += `\n`;
        }

        return currentString + `${lineString}`;
    }, ``);

    return `{\n${linesString}\n}`;
};

const capitalizeFirstChar = (string) =>
    string.charAt(0).toUpperCase() + string.substring(1);

const getImportStatement = (imports = [], file) => {
    return `import ${createObjectString(imports)} from '${file}';\n\n`;
};

const createFile = async (folder, filename, content) => {
    const filePath = `${folder}/${filename}`;

    return new Promise((resolve, reject) => {
        writeFile(filePath, content, (err) => {
            if (err) {
                reject(err);
            }

            console.info(`${filename} created at ${filePath}`);

            resolve();
        });
    });
};

const getFileContents = (filePath) => {
    return new Promise((resolve, reject) => {
        readFile(filePath, `utf8`, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
};

const getFolderContent = (folderPath) => {
    return new Promise((resolve, reject) => {
        readdir(folderPath, (err, files) => {
            if (err) {
                reject(err);
            }

            resolve(files);
        });
    });
};

const getFolderNames = async (parentFolder) => {
    const files = await getFolderContent(parentFolder);

    return files.filter((source) =>
        lstatSync(`${parentFolder}/${source}`).isDirectory()
    );
};

const getFileNames = async (parentFolder) => {
    const files = await getFolderContent(parentFolder);

    return files.filter(
        (source) => !lstatSync(`${parentFolder}/${source}`).isDirectory()
    );
};

const getExportAllString = (folder) => `export * from './${folder}';`;

const convertCamelToConstant = (string) => {
    let copy = string;
    copy[0] = copy[0].toLowerCase();

    return camelToSnakeCase(copy).toUpperCase();
};

const createFolderIndexFiles = async (parentFolder) => {
    const folders = await getFolderNames(parentFolder);

    if (folders.length) {
        const filename = `index.js`;
        const content = folders.reduce((current, folderName) => {
            return current + `export * from './${folderName}';\n`;
        }, ``);

        await createFile(parentFolder, filename, content);

        folders.forEach((folder) => {
            const folderPath = path.join(parentFolder, folder);

            createFolderIndexFiles(folderPath);
        });
    }
};

function mkDirByPathSync(targetDir) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = process.cwd();

    targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);

        console.log(`curDir: ${curDir}`);

        try {
            mkdirSync(curDir);
            console.log(`Directory ${curDir} created!`);
        } catch (err) {
            console.log(err);

            if (err.code !== 'EEXIST') {
                throw err;
            }

            console.log(`Directory ${curDir} already exists!`);
        }

        return curDir;
    }, initDir);
}

module.exports = {
    capitalizeFirstChar,
    getImportStatement,
    createObjectString,
    createFile,
    getFolderNames,
    getFileNames,
    getExportAllString,
    getFileContents,
    convertCamelToConstant,
    createIndexFiles: createFolderIndexFiles,
    mkDirByPathSync,
};
