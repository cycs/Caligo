import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Image} from 'react-native';
import {name as appName} from './app.json';
import Tab from './src/components/tabsNavigator';
import { connect } from 'react-redux';
import store from './src/components/Store';
import { Provider } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';

// console.log(createStackNavigator);

class App extends React.Component {
    static navigationOptions = {
        title: 'Fogify',
      };

    render() {
      return (
            <Tab/>
      )
    }
  }

const AppStackNavigator = createStackNavigator({
    Home: {
        screen: App,
    }
});

export default createAppContainer(AppStackNavigator);

