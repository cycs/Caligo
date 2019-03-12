import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Image} from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import {name as appName} from './app.json';
import communesJSON from './Communes-belgique.json';
import * as turf from '@turf/turf';
import update from 'immutability-helper';
import { point } from '@turf/helpers';
import PositionButton from './src/components/PositionButton';
import TabsNavigator from './src/components/tabsNavigator';
import markerMyPosition from './src/img/marker.png';
import Map from './src/components/Map';
import Completion from './src/components/Completion';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';


class App extends React.Component {
    render() {
      return <Map/>
    }
  }

  const TabNavigator = createBottomTabNavigator({
    Home: Map,
    Settings: Completion,
  });
  
  export default createAppContainer(TabNavigator);