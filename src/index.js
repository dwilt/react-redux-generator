#!/usr/bin/env node --harmony

const argv = require(`minimist`)(process.argv.slice(2));
const path = require(`path`);


const conf = require('rc')(`rrg`, {
    componentsDirectory: `src/components`,
});

switch(argv.type) {
    case `component`: {
        const component = require(`./component`);

        const { componentsDirectory } = conf;
        const { path: componentPath, name: componentName } = argv;
        const fullComponentPath = path.join(process.cwd(), componentsDirectory, componentPath || ``, componentName);

        const options = {
            ...argv,
            componentsDirectory,
            componentName,
            componentPath: fullComponentPath,
        };

        component(options);
        break;
    }


    case `reducer`: {
        const reducer = require(`./reducer`);

        reducer(conf);
        break;
    }

    default:
        break;
}
