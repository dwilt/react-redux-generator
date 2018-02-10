const createReducer = require(`./reducer.js`);
const createActionsFile = require(`./actions.js`);
const createSelector = require(`./selectors.js`);

const init = async ({
    reducerName,
    simpleReducer,
    storePath,
    reducerFolderPath,
    selectorsPath,
    initialStateObject,
}) => {
    await createReducer({
        reducerFolderPath,
        reducerName,
        simpleReducer,
        initialStateObject,
        storePath,
    });
    await createActionsFile({
        reducerFolderPath,
        reducerName,
        initialStateObject,
        simpleReducer,
    });
    await createSelector();
};

init();
