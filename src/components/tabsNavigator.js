import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

import Map from './Map';
import Completion from './Completion';

const Tab = createBottomTabNavigator({
    Home: {
        screen: Map
    },

    Completion: Completion,
  });

export default createAppContainer(Tab);