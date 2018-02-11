const path = require(`path`);

const { existsSync } = require(`fs`);

const {
    createIndexFiles,
    createFile,
    getFileContents,
    mkDirByPathSync
} = require(`../helpers.js`);

const createContainerFile = async ({ componentName, componentPath }) => {
    const filename = `${componentName}.container.js`;
    const template = path.join(__dirname, `./baseContainerTemplate.js`);
    let templateContent = await getFileContents(template);

    templateContent = templateContent.replace(/COMPONENT_NAME/g, componentName);

    return createFile(componentPath, filename, templateContent);
};

const createComponentFile = async ({
    componentName,
    hasStyles,
    componentPath,
}) => {
    const filename = `${componentName}.component.js`;
    const template = path.join(__dirname, `./baseComponentTemplate.js`);
    let templateContent = await getFileContents(template);

    if (!hasStyles) {
        templateContent = templateContent.replace(/import styles .+\n\n/, ``);
        templateContent = templateContent.replace(
            / style={styles\.container}/,
            ``
        );
    }

    templateContent = templateContent.replace(/COMPONENT_NAME/g, componentName);

    return createFile(componentPath, filename, templateContent);
};

const createComponentStylesFile = async ({ componentName, componentPath }) => {
    const filename = `${componentName}.css`;
    const template = path.join(__dirname, `./baseComponentStylesTemplate.css`);
    let templateContent = await getFileContents(template);

    templateContent = templateContent.replace(/COMPONENT_NAME/g, componentName);

    return createFile(componentPath, filename, templateContent);
};

const createComponentIndexFile = ({
    componentName,
    hasContainer,
    componentPath,
}) => {
    const filename = `index.js`;
    const extension = hasContainer ? `container` : `component`;
    const content = `export { default as ${componentName} } from './${componentName}.${extension}';\n`;

    return createFile(componentPath, filename, content);
};

const createComponentFolder = ({ componentName, componentPath }) => {
    if (existsSync(componentPath)) {
        console.error(`${componentName} already exists at: ${componentPath}`);
    } else {
        mkDirByPathSync(componentPath);
    }
};

const createComponent = async ({
    componentName,
    componentPath,
    hasStyles,
    hasContainer,
    componentsDirectory,
}) => {
    createComponentFolder({ componentName, componentPath });

    const files = [
        createComponentIndexFile({
            componentName,
            hasContainer,
            componentPath,
        }),
        createComponentFile({
            componentName,
            hasStyles,
            componentPath,
        }),
    ];

    if (hasStyles) {
        files.push(
            createComponentStylesFile({
                componentName,
                componentPath,
            })
        );
    }

    if (hasContainer) {
        files.push(
            createContainerFile({
                componentName,
                componentPath,
            })
        );
    }

    await Promise.all(files);
    await createIndexFiles(componentsDirectory);
};

module.exports = createComponent;
