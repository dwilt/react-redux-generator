const { createFile } = require(`../helpers.js`);

const { createActionString, getActionName } = require(`./helpers`);

const getActionCreatorExport = (actionName, prop) =>
  `export const ${getActionName(
    prop
  )} = (${prop}) => ({\n    type: \`${actionName}\`,\n    payload: {\n        ${prop}\n    },\n});\n\n`;

const createAction = (prop, reducerName) => {
  const actionName = createActionString(prop, reducerName);

  return getActionCreatorExport(actionName, prop || reducerName);
};

const getActionCreators = ({
  simpleReducer,
  initialStateObject,
  reducerName
}) => {
  if (simpleReducer) {
    return createAction(``, reducerName);
  } else {
    return Object.keys(initialStateObject).reduce(
      (currentString, prop) => currentString + createAction(prop, reducerName),
      ``
    );
  }
};

const createActionsFile = ({
  reducerFolderPath,
  reducerName,
  initialStateObject,
  simpleReducer
}) => {
  const filename = `${reducerName}.actions.tsx`;
  const content = `${getActionCreators({
    simpleReducer,
    initialStateObject,
    reducerName
  })}`;

  return createFile(reducerFolderPath, filename, content);
};

module.exports = createActionsFile;
