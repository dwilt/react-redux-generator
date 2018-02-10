const argv = require(`minimist`)(process.argv.slice(2));
const path = require(`path`);

const {
    srcPath,
} = require(`../vars`);

const reducerName = argv.name;
const simpleReducer = argv.simple;
const storePath = path.join(srcPath, `store`);
const reducerFolderPath = path.join(storePath, reducerName);
const selectorsFolderPath = path.join(srcPath, `selectors`);

const initialStateObject = !simpleReducer ? argv._.reduce((is, field) => {
    const prop = field.split(`=`)[0];

    is[prop] = field.split(`=`)[1];

    return is;
}, {}) : null;

module.exports = {
    reducerName,
    storePath,
    reducerFolderPath,
    initialStateObject,
    selectorsFolderPath,
    simpleReducer,
};
