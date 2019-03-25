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
import ApolloClient from "apollo-client";
import { HttpLink, createHttpLink  } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import communesJSON from './communes-minify.json';
import { setContext } from 'apollo-link-context';

import { getToken } from './src/components/utils/loginUtils';

const authLink = setContext(async (req, { headers }) => {
    const token = await getToken();
    console.log(token);
    return {
        ... headers,
        headers: {
            authorization: token ? `Bearer ${token}` : null
        }
    }
});

const httpLink = new HttpLink({ 
    uri : "https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon"
});

const link = authLink.concat(httpLink);

const client = new ApolloClient({
    link,
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