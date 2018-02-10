const createReducer = require(`./reducer.js`);
const createActionsFile = require(`./actions.js`);
const createSelector = require(`./selectors.js`);

module.exports = async ({
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
    await createSelector({
        reducerName,
        initialStateObject,
        selectorsPath,
        simpleReducer,
    });
};
