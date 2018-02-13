const {
    getImportStatement,
    createObjectString,
    createFile,
    getFolderNames,
} = require(`../helpers.js`);

const { readdirSync } = require(`fs`);

const path = require(`path`);

const { createActionString, getActionName } = require(`./helpers`);

const getActionsImportStatement = ({
    simpleReducer,
    reducerName,
    initialStateObject,
}) => {
    const importStrings = simpleReducer
        ? [getActionName(reducerName)]
        : Object.keys(initialStateObject).map((prop) => getActionName(prop));

    return getImportStatement(importStrings, `./${reducerName}.actions`);
};

const getHelpersImportStatement = () => {
    return getImportStatement([`createReducer`], `/helpers`);
};

const createReducerFunction = (
    action,
    prop,
    { simpleReducer, reducerName }
) => {
    const reducerBody = simpleReducer
        ? reducerName
        : `({\n        ...state,\n        ${prop},\n    })`;

    return `[${getActionName(
        prop
    )}().type]: (state, { ${prop} }) => ${reducerBody}`;
};

const getReducerExport = ({
    reducerName,
    simpleReducer,
    initialStateObject,
}) => {
    let reducerActions = [];
    let initialState = null;

    if (simpleReducer) {
        initialState = JSON.stringify(initialStateObject);

        const reducerFunction = createReducerFunction(
            createActionString(``, reducerName),
            reducerName,
            { simpleReducer, reducerName }
        );

        reducerActions.push(reducerFunction);
    } else {
        const initialStateObjectArray = Object.keys(initialStateObject).map(
            (key) => `${key}: ${initialStateObject[key]}`
        );
        initialState = createObjectString(initialStateObjectArray);

        Object.keys(initialStateObject).forEach((prop) => {
            const reducerFunction = createReducerFunction(
                createActionString(prop, reducerName),
                prop,
                { simpleReducer, reducerName }
            );

            reducerActions.push(reducerFunction);
        });
    }

    return `export default createReducer(${initialState}, ${createObjectString(
        reducerActions
    )});`;
};

const createReducerFile = ({
    reducerName,
    reducerFolderPath,
    simpleReducer,
    initialStateObject,
}) => {
    const filename = `${reducerName}.reducer.js`;

    const actionsImport = getActionsImportStatement({
        simpleReducer,
        reducerName,
        initialStateObject,
    });
    const helpersImport = getHelpersImportStatement();
    const reducersExport = getReducerExport({
        reducerName,
        simpleReducer,
        initialStateObject,
    });

    const content = `${actionsImport}${helpersImport}${reducersExport}`;

    return createFile(reducerFolderPath, filename, content);
};

const getCombineImport = () => {
    return getImportStatement([`combineReducers`], `redux`);
};

const getReducerFiles = async ({ storePath }) => {
    const storeFolders = await getFolderNames(storePath);

    return storeFolders.filter((folder) => {
        const folderPath = path.join(storePath, folder);
        const files = readdirSync(folderPath);

        return files.find((file) => file.indexOf(`.reducer.js`) > -1);
    });
};

const getReducerImports = async ({ storePath }) => {
    const reducers = await getReducerFiles({ storePath });

    return reducers.reduce((current, reducer) => {
        return (
            current +
            `import ${reducer} from './${reducer}/${reducer}.reducer';\n`
        );
    }, ``);
};

const createCombine = async ({ storePath }) => {
    const reducers = await getReducerFiles({ storePath });

    return `\nexport default combineReducers(${createObjectString(reducers)});`;
};

const createReducersFile = async ({ storePath }) => {
    const filename = `reducers.js`;
    const reducerImports = await getReducerImports({ storePath });
    const combineReducers = await createCombine({ storePath });
    const content = `${getCombineImport()}${reducerImports}${combineReducers}\n`;

    return createFile(storePath, filename, content);
};

const createReducer = async ({
    reducerFolderPath,
    reducerName,
    simpleReducer,
    initialStateObject,
    storePath,
}) => {
    await createReducerFile({
        reducerName,
        reducerFolderPath,
        simpleReducer,
        initialStateObject,
    });
    await createReducersFile({ storePath });
};

module.exports = createReducer;
