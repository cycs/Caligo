import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Image} from 'react-native';
import {name as appName} from './app.json';
import Tab from './src/components/tabsNavigator';
import { connect } from 'react-redux';
import store from './src/components/Store';
import { Provider } from 'react-redux';


class App extends React.Component {
    render() {
        // console.log('THIS DOT PROPS', this.props)
      return (
    <Provider store={store}>
        <Tab/>
    </Provider>
      )
    }
  }


export default App;