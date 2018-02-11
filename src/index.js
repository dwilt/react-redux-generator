#!/usr/bin/env node --harmony

const path = require(`path`);

const {
   getComponentProps,
   getType
} = require(`./prompts`);

const conf = require(`rc`)(`rrg`, {
    componentsDirectory: `src/components`,
    storePath: `src/store`,
    selectorsPath: `src/selectors`,
});

// switch (argv.type) {
// case `component`: {
//     const component = require(`./component`);
//
//     const { componentsDirectory } = conf;
//     const { path: componentPath, name: componentName } = argv;
//     const fullComponentPath = path.join(
//         process.cwd(),
//         componentsDirectory,
//         componentPath || ``,
//         componentName
//     );
//
//     const options = {
//         ...argv,
//         componentsDirectory,
//         componentName,
//         componentPath: fullComponentPath,
//     };
//
//     component(options);
//     break;
// }
//
// case `reducer`: {
//     const reducer = require(`./reducer`);
//     const { storePath, selectorsPath } = conf;
//     const { name: reducerName, simple: simpleReducer } = argv;
//
//     const reducerFolderPath = path.join(storePath, reducerName);
//
//     const initialStateObject = !simpleReducer
//         ? argv._.reduce((is, field) => {
//             const prop = field.split(`=`)[0];
//
//             is[prop] = field.split(`=`)[1];
//
//             return is;
//         }, {})
//         : null;
//
//     const options = {
//         reducerName,
//         simpleReducer,
//         storePath,
//         reducerFolderPath,
//         selectorsPath,
//         initialStateObject,
//     };
//
//     reducer(options);
//     break;
// }
//
// default:
//     break;
// }


async function questions() {
    const type = await getType();

    switch (type) {
        case `component`: {
            const props = await getComponentProps({ componentsDirectory: conf.componentsDirectory });

            const component = require(`./component`);

            const { componentsDirectory } = conf;
            const { path: componentPath, name: componentName } = props;
            const localComponentPath = path.join(componentsDirectory, componentPath || ``, componentName);

            const options = {
                ...props,
                componentsDirectory,
                componentName,
                componentPath: localComponentPath
            };

            component(options);
        }
    }
}

questions();
