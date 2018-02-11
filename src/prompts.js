const inquirer = require('inquirer');

function getType() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'What do you want to generate?',
            choices: [
                {
                    name: `Component`,
                    value: `component`
                },
                {
                    name: `Reducer`,
                    value: `reducer`
                }
            ]
        }
    ])
        .then(({ type }) => type);
}

function getComponentProps({ componentsDirectory }) {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: `What's the name of your component?`
        },
        {
            type: 'input',
            name: 'path',
            message: `What folder is it in? (root folder is ${componentsDirectory})`
        },
        {
            type: 'confirm',
            name: 'hasContainer',
            message: `Does it connect to the store?`
        },
        {
            type: 'confirm',
            name: 'hasStyles',
            message: `Include styles file?`
        }
    ])
        .then(props => props);
}

module.exports = {
    getType,
    getComponentProps,
};
