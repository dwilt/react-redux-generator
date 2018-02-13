const path = require(`path`);

const {
    createIndexFiles,
    createFile,
    getFileContents,
    mkDirByPathSync,
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
    isReactNativeProject,
}) => {
    const filename = `${componentName}.component.js`;
    const template = path.join(__dirname, `./baseComponentTemplate.js`);
    let templateContent = await getFileContents(template);

    const importStyleString = `import './COMPONENT_NAME.css';`;
    const classNameString = ` className={\`COMPONENT_NAME\`}`;

    if (hasStyles) {
        if (isReactNativeProject) {
            templateContent = templateContent.replace(
                importStyleString,
                `import styles from './${componentName}.styles.js';`
            );
            templateContent = templateContent.replace(
                classNameString,
                ` style={styles.container}`
            );
        }
    } else {
        templateContent = templateContent.replace(importStyleString, ``);
        templateContent = templateContent.replace(classNameString, ``);
    }

    templateContent = templateContent.replace(/COMPONENT_NAME/g, componentName);

    return createFile(componentPath, filename, templateContent);
};

const createComponentStylesFile = async ({
    componentName,
    componentPath,
    isReactNativeProject,
}) => {
    const filename = isReactNativeProject
        ? `${componentName}.styles.js`
        : `${componentName}.css`;
    const template = path.join(
        __dirname,
        isReactNativeProject
            ? `./baseComponentStylesTemplate.js`
            : `./baseComponentStylesTemplate.css`
    );
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
    mkDirByPathSync(componentPath);
};

const createComponent = async (props) => {
    createComponentFolder(props);

    const files = [createComponentIndexFile(props), createComponentFile(props)];

    if (props.hasStyles) {
        files.push(createComponentStylesFile(props));
    }

    if (props.hasContainer) {
        files.push(createContainerFile(props));
    }

    await Promise.all(files);
    await createIndexFiles(props.componentsDirectory);
};

module.exports = createComponent;
