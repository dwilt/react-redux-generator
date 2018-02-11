const inquirer = require(`inquirer`);

function convertStringValue(value) {
    switch (value) {
    case `[]`:
        return [];
    case `true`:
        return true;
    case `false`:
        return false;
    case `''`:
        return ``;
    default:
        return null;
    }
}

function getType() {
    return inquirer
        .prompt([
            {
                type: `list`,
                name: `type`,
                message: `What do you want to generate?`,
                choices: [
                    {
                        name: `Component`,
                        value: `component`,
                    },
                    {
                        name: `Reducer`,
                        value: `reducer`,
                    },
                ],
            },
        ])
        .then(({ type }) => type);
}

function getComponentProps({ componentsDirectory }) {
    return inquirer
        .prompt([
            {
                type: `input`,
                name: `name`,
                message: `What's the name of your component?`,
            },
            {
                type: `input`,
                name: `path`,
                message: `What folder is it in? (root folder is ${componentsDirectory})`,
            },
            {
                type: `confirm`,
                name: `hasContainer`,
                message: `Does it connect to the store?`,
            },
            {
                type: `confirm`,
                name: `hasStyles`,
                message: `Include styles file?`,
            },
        ])
        .then((props) => props);
}

async function getReducerProps() {
    const initialProps = await inquirer
        .prompt([
            {
                type: `input`,
                name: `reducerName`,
                message: `What's the name of your reducer?`,
            },
            {
                type: `confirm`,
                name: `objectReducer`,
                message: `Is this reducer going to be an object?`,
            },
        ])
        .then((props) => ({
            reducerName: props.reducerName,
            simpleReducer: !props.objectReducer,
        }));

    if (initialProps.simpleReducer) {
        const { initialState } = await inquirer
            .prompt([
                {
                    type: `list`,
                    name: `initialState`,
                    message: `What is the initial state going to be?`,
                    choices: [`null`, `true`, `false`, `[]`, `''`],
                },
            ])
            .then(({ initialState }) => ({
                initialState: convertStringValue(initialState),
            }));

        return {
            ...initialProps,
            initialState,
        };
    } else {
        const initialState = {};

        async function addProperty() {
            const { addAProperty } = await inquirer.prompt([
                {
                    type: `confirm`,
                    name: `addAProperty`,
                    message: `Would you like to add a property to the object?`,
                },
            ]);

            if (addAProperty) {
                const { name, value } = await inquirer.prompt([
                    {
                        type: `input`,
                        name: `name`,
                        message: `What's the name of the property (For example: isLoading)?`,
                    },
                    {
                        type: `choices`,
                        name: `value`,
                        message: `And it's initial value?`,
                    },
                ]);

                initialState[name] = convertStringValue(value);

                console.log(`-------------------------------------`);
                console.log(`Reducer Current State:`, initialState);
                console.log(`-------------------------------------`);

                await addProperty();
            }
        }

        await addProperty();

        return {
            ...initialProps,
            initialState,
        };
    }
}

module.exports = {
    getType,
    getComponentProps,
    getReducerProps,
};
