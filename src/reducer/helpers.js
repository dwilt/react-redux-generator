const {
    capitalizeFirstChar,
    convertCamelToConstant,
} = require(`../helpers`);

const createActionString = (prop = ``, reducerName) => {
    const camelCasedString = `set${capitalizeFirstChar(reducerName)}${capitalizeFirstChar(prop)}`;

    return convertCamelToConstant(camelCasedString);
};

const getActionName = (prop = ``) => `set${capitalizeFirstChar(prop)}Action`;

module.exports = {
    createActionString,
    getActionName
};
