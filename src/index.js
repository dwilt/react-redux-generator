#!/usr/bin/env node --harmony

const argv = require(`minimist`)(process.argv.slice(2));
const path = require(`path`);

const component = require(`./component`);
// const reducer = require(`./reducer`);

const conf = require('rc')(`rrg`, {
    componentsDirectory: `src/components`,
});

const type = argv.type;

switch(type) {
    case `component`: {
        const { componentsDirectory } = conf;
        const { path: componentPath, name: componentName } = argv;

        const options = {
            ...argv,
            componentsDirectory,
            componentName,
            componentPath: path.join(process.cwd(), componentsDirectory, componentPath || ``),
        };

        component(options);
        break;
    }


    case `reducer`:
        reducer(conf);
        break;

    default:
        break;
}
