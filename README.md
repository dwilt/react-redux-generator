# react-redux-generator

This is a [CLI](https://en.wikipedia.org/wiki/Command-line_interface) to generate [React](https://reactjs.org/) and [Redux](https://redux.js.org/) templates for your React or [React Native](https://facebook.github.io/react-native/) project.

## Installation

1. At the root of your React/React Native project, run:

```
yarn add dwilt-react-redux-generator -D
```

## Run

Run from the root of your project like so:

```
yarn rrg
```

## Configuration

You can include a `.rrgrc` file at the root of your project with the following overrides:

| Property               | Type    | Default          | Description                                                                                                                                        |
| ---------------------- | ------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isReactNativeProject` | boolean | `false`          | This boolean tells the generator whether it's a React Native project. If set to `true`, it will generate a `styles.js` file instead of a CSS file. |
| `componentsDirectory`  | string  | `src/components` | This is the root path of all your components. The generator will use this as the root for all of your components.                                  |
| `storePath`            | string  | `src/store`      | This is location of your Redux store folder where the generator will place the reducer folder.                                                     |
| `selectorsPath`        | string  | `src/selectors`  | This is folder where your [Reselect](https://github.com/reactjs/reselect) selectors are stored.                                                    |
