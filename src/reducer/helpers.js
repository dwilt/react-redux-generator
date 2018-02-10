const {
    capitalizeFirstChar,
    convertCamelToConstant,
} = require(`../helpers`);

const {
    reducerName,
} = require(`./vars`);

const createActionString = (prop = ``) => {
    const camelCasedString = `set${capitalizeFirstChar(reducerName)}${capitalizeFirstChar(prop)}`;

    return convertCamelToConstant(camelCasedString);
};

const getActionName = (prop = ``) => `set${capitalizeFirstChar(prop)}Action`;

module.exports = {
    createActionString,
    getActionName
};
