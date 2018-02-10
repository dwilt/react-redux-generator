const {
    createFile,
    getImportStatement,
    capitalizeFirstChar,
    getFileNames,
    getExportAllString,
} = require(`../helpers.js`);

const {
    reducerName,
    initialStateObject,
    selectorsFolderPath,
    simpleReducer
} = require(`./vars`);

const selectorFilename = `${reducerName}.selectors.js`;

const getReselectImport = () => {
    return getImportStatement([`createSelector`], `reselect`);
};

const getReducerSelector = () => {
    return `const ${reducerName}Selector = state => state.${reducerName};\n\n`;
};

const getPropSelectors = () => {
    return Object.keys(initialStateObject).reduce((currentString, prop) => {
        return currentString + `export const ${reducerName}${capitalizeFirstChar(prop)}Selector = createSelector(\n    ${reducerName}Selector,\n    ${reducerName} => ${reducerName}.${prop}\n);\n\n`;
    }, ``);
};

const writeIndexFile = async () => {
    const files = await getFileNames(selectorsFolderPath);
    const selectors = files.filter(file => file !== `index.js`);

    const content = selectors.reduce((current, file) => {
        return current + `${getExportAllString(file.split(`.js`)[0])}\n`;
    }, ``);

    return createFile(selectorsFolderPath, `index.js`, content);
};

const createSelectorsFile = () => {
    let content = `${getReducerSelector()}`;

    if (!simpleReducer) {
        content = `${getReselectImport()}${content}${getPropSelectors()}`;
    }

    return createFile(selectorsFolderPath, selectorFilename, content);
};

const createSelector = async () => {
    await createSelectorsFile();
    await writeIndexFile();
};

module.exports = createSelector;
