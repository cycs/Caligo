/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import AppStackNavigator from './App';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/components/Store';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from "apollo-boost";
import { HttpLink, createHttpLink  } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import communesJSON from './communes-minify.json';

const client = new ApolloClient({
    uri: "https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon",
    cache: new InMemoryCache()
}); 
console.log(client);

const AppContainer = () => (
    <ApolloProvider client={client}>
        <Provider store={store}>
            <AppStackNavigator/>
        </Provider>
    </ApolloProvider>

);


AppRegistry.registerComponent(appName, () => AppContainer);