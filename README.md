# react-redux-generator
This is a [CLI](https://en.wikipedia.org/wiki/Command-line_interface) to generate [React](https://reactjs.org/) and [Redux](https://redux.js.org/) templates for your React or [React Native](https://facebook.github.io/react-native/) project. 

## Installation

1. At the root of your React/React Native project, run:
```
yarn add --dev dwilt-react-redux-generator
```

2. Add this `script` to `package.json`:
```json
{
  "name": "My Project",
  "scripts": {      
      "generate-react-redux-template": "rrg" 
  }
}
```

## Run
Run from the root of your project like so:
```
npm run generate-react-redux-template
```

## Configuration
You can include a `.rrgrc` file at the root of your project with the following overrides:

| Property | Type | Default | Description |
|-------------|----------|--------------|----------------------------------------------------------------|
| isReactNativeProject | boolean | false | This boolean tells the plugin whether it's a React Native project. If set to `true`, it will generate a `styles.js` file instead of a CSS file.
