const createReducer = require(`./reducer.js`);
const createActionsFile = require(`./actions.js`);
const createSelector = require(`./selectors.js`);

const init = async () => {
    await createReducer();
    await createActionsFile();
    await createSelector();
};

init();
