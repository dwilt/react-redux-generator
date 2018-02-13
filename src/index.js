#!/usr/bin/env node --harmony

const path = require(`path`);

const { getComponentProps, getReducerProps, getType } = require(`./prompts`);

const conf = require(`rc`)(`rrg`, {
    componentsDirectory: `src/components`,
    storePath: `src/store`,
    selectorsPath: `src/selectors`,
    isReactNativeProject: false,
});

async function questions() {
    const type = await getType();

    switch (type) {
    case `component`: {
        const props = await getComponentProps({
            componentsDirectory: conf.componentsDirectory,
        });

        const component = require(`./component`);

        const { componentsDirectory, isReactNativeProject } = conf;
        const { path: componentPath, name: componentName } = props;
        const localComponentPath = path.join(
            componentsDirectory,
            componentPath || ``,
            componentName
        );

        const options = {
            ...props,
            isReactNativeProject,
            componentsDirectory,
            componentName,
            componentPath: localComponentPath,
        };

        await component(options);

        console.log(`Created ${componentName} in ${localComponentPath}!`);

        break;
    }

    case `reducer`: {
        const props = await getReducerProps();

        const reducer = require(`./reducer`);

        await reducer({
            ...props,
            ...conf,
            reducerFolderPath: path.join(conf.storePath, props.reducerName),
            initialStateObject: props.initialState,
        });

        console.log(
            `Created '${props.reducerName}' reducer, actions and selectors!`
        );

        break;
    }
    }
}

questions();
