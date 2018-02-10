const {
    createFile,
} = require(`../helpers.js`);

const {
    createActionString,
    getActionName,
} = require(`./helpers`);

const {
    reducerFolderPath,
    reducerName,
    initialStateObject,
    simpleReducer,
} = require(`./vars`);

const getActionCreatorExport  = (actionName, prop = reducerName) => `export const ${getActionName(prop)} = (${prop}) => ({\n    type: \`${actionName}\`,\n    payload: {\n        ${prop}\n    },\n});\n\n`;

const createAction = (prop) => {
    const actionName = createActionString(prop);

    return getActionCreatorExport(actionName, prop);
};

const getActionCreators = () => {
    if (simpleReducer) {
        return createAction();
    } else {
        return Object.keys(initialStateObject).reduce((currentString, prop) => currentString + createAction(prop), ``);
    }

};

const createActionsFile = () => {
    const filename = `${reducerName}.actions.js`;
    const content = `${getActionCreators()}`;

    return createFile(reducerFolderPath, filename, content);
};

module.exports = createActionsFile;
