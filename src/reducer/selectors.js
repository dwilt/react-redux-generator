const {
    createFile,
    getImportStatement,
    capitalizeFirstChar,
    getFileNames,
    getExportAllString,
} = require(`../helpers.js`);

const getReselectImport = () => {
    return getImportStatement([`createSelector`], `reselect`);
};

const getReducerSelector = ({ reducerName }) => {
    return `const ${reducerName}Selector = state => state.${reducerName};\n\n`;
};

const getPropSelectors = ({ reducerName, initialStateObject }) => {
    return Object.keys(initialStateObject).reduce((currentString, prop) => {
        return (
            currentString +
            `export const ${reducerName}${capitalizeFirstChar(
                prop
            )}Selector = createSelector(\n    ${reducerName}Selector,\n    ${reducerName} => ${reducerName}.${prop}\n);\n\n`
        );
    }, ``);
};

const writeIndexFile = async ({ selectorsFolderPath }) => {
    const files = await getFileNames(selectorsFolderPath);
    const selectors = files.filter((file) => file !== `index.js`);

    const content = selectors.reduce((current, file) => {
        return current + `${getExportAllString(file.split(`.js`)[0])}\n`;
    }, ``);

    return createFile(selectorsFolderPath, `index.js`, content);
};

const createSelectorsFile = ({
    selectorsFolderPath,
    simpleReducer,
    reducerName,
    initialStateObject,
}) => {
    let content = `${getReducerSelector({
        reducerName,
    })}`;

    if (!simpleReducer) {
        content = `${getReselectImport()}${content}${getPropSelectors({
            reducerName,
            initialStateObject,
        })}`;
    }

    return createFile(
        selectorsFolderPath,
        `${reducerName}.selectors.js`,
        content
    );
};

const createSelector = async ({
    reducerName,
    initialStateObject,
    selectorsFolderPath,
    simpleReducer,
}) => {
    await createSelectorsFile({
        selectorsFolderPath,
        simpleReducer,
        reducerName,
        initialStateObject,
    });
    await writeIndexFile({ selectorsFolderPath });
};

module.exports = createSelector;
