import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import communesJSON from '../../Communes-belgique.json';

import Map from './Map';
import Completion from './Completion';

state = {
    communessssss: {communesJSON}
}

const Tab = createBottomTabNavigator({
    Home: {
        screen: Map
    },

    Completion: Completion,
  });

export default createAppContainer(Tab);