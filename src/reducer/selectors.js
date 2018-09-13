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

const getReducerSelector = ({ reducerName, simpleReducer }) => {
    const exportPrefix = simpleReducer ? `export ` : ``;

    return `${exportPrefix}const ${reducerName}Selector = ({ ${reducerName} }) => ${reducerName};\n\n`;
};

const getPropSelectors = ({ reducerName, initialStateObject }) => {
    return Object.keys(initialStateObject).reduce((currentString, prop) => {
        return (
            currentString +
      `export const ${reducerName}${capitalizeFirstChar(
          prop
      )}Selector = createSelector(\n    ${reducerName}Selector,\n    ({ ${prop} }) => ${prop}\n);\n\n`
        );
    }, ``);
};

const writeIndexFile = async ({ selectorsPath }) => {
    const files = await getFileNames(selectorsPath);
    const selectors = files.filter(file => file !== `index.tsx`);

    const content = selectors.reduce((current, file) => {
        return current + `${getExportAllString(file.split(`.tsx`)[0])}\n`;
    }, ``);

    return createFile(selectorsPath, `index.tsx`, content);
};

const createSelectorsFile = ({
    selectorsPath,
    simpleReducer,
    reducerName,
    initialStateObject,
}) => {
    let content = `${getReducerSelector({
        reducerName,
        simpleReducer,
    })}`;

    if (!simpleReducer) {
        content = `${getReselectImport()}${content}${getPropSelectors({
            reducerName,
            initialStateObject,
        })}`;
    }

    return createFile(selectorsPath, `${reducerName}.selectors.tsx`, content);
};

const createSelector = async ({
    reducerName,
    initialStateObject,
    selectorsPath,
    simpleReducer,
}) => {
    await createSelectorsFile({
        selectorsPath,
        simpleReducer,
        reducerName,
        initialStateObject,
    });
    await writeIndexFile({ selectorsPath });
};

module.exports = createSelector;
