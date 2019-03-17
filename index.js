/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/components/Store';
// console.log(store.getState(), store)

const AppContainer = () => <App/>;

AppRegistry.registerComponent(appName, () => AppContainer);
