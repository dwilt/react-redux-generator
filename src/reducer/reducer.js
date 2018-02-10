const {
    getImportStatement,
    createObjectString,
    createFile,
    getFolderNames,
} = require(`../helpers.js`);

const {
    readdirSync,
} = require(`fs`);

const {
    reducerFolderPath,
    reducerName,
    initialStateObject,
    storePath,
    simpleReducer,
} = require(`./vars`);

const path = require(`path`);

const {
    createActionString,
    getActionName,
} = require(`./helpers`);

const getActionsImportStatement = () => {
    const importStrings = simpleReducer ? [getActionName(reducerName)] : Object.keys(initialStateObject).map(prop => getActionName(prop));

    return getImportStatement(importStrings, `./${reducerName}.actions`);
};

const getHelpersImportStatement = () => {
    return getImportStatement([`createReducer`], `/helpers`);
};

const createReducerFunction = (action, prop) => {
    const reducerBody = simpleReducer ? reducerName : `({\n        ...state,\n        ${prop},\n    })`;

    return `[${getActionName(prop)}().type]: (state, { ${prop} }) => ${reducerBody}`;
};

const getReducerExport = () => {
    let reducerActions = [];
    let initialState = null;

    if (simpleReducer) {
        initialState = simpleReducer;
        reducerActions.push(createReducerFunction(createActionString(), reducerName));
    } else {
        const initialStateObjectArray = Object.keys(initialStateObject).map(key => `${key}: ${initialStateObject[key]}`);
        initialState = createObjectString(initialStateObjectArray);

        Object.keys(initialStateObject).forEach(prop => {
            reducerActions.push(createReducerFunction(createActionString(prop), prop));
        });
    }

    return `export default createReducer(${initialState},${createObjectString(reducerActions)});`;
};

const createReducerFile = () => {
    const filename = `${reducerName}.reducer.js`;
    const content = `${getActionsImportStatement()}${getHelpersImportStatement()}${getReducerExport()}`;

    return createFile(reducerFolderPath, filename, content);
};

const getCombineImport = () => {
    return getImportStatement([`combineReducers`], `redux`);
};

const getReducerFiles = async () => {
    const storeFolders = await getFolderNames(storePath);

    return storeFolders.filter((folder) => {
        const folderPath = path.join(storePath, folder);
        const files = readdirSync(folderPath);

        return files.find((file) => file.indexOf(`.reducer.js`) > -1);
    });
};

const getReducerImports = async () => {
    const reducers = await getReducerFiles(storePath);

    return reducers.reduce((current, reducer) => {
        return current + `import ${reducer} from './${reducer}/${reducer}.reducer';\n`;
    }, ``);
};

const createCombine = async () => {
    const reducers = await getReducerFiles(storePath);

    return `\nexport default combineReducers(${createObjectString(reducers)});`;
};

const createReducersFile = async () => {
    const filename = `reducers.js`;
    const reducerImports = await getReducerImports();
    const combineReducers = await createCombine();
    const content = `${getCombineImport()}${reducerImports}${combineReducers}\n`;

    return createFile(storePath, filename, content);
};

const createReducer = async () => {
    await createReducerFile();
    await createReducersFile();
};

module.exports = createReducer;
