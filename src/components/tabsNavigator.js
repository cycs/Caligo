import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Image } from 'react-native';

import Map from './Map';
import Completion from './Completion';

const styles = {
    tab: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    icon: {
        width: 32,
        height: 32,
    },
}

const options = {
    tabBarOptions: {
        showIcon: true,
        showLabel: false,
        style: styles.tab
    }
}

const Tab = createBottomTabNavigator({
    Home: {
        screen: Map,
        navigationOptions: () => ({
            tabBarIcon: ({focused}) => (
                focused ? <Image
                source={require('../img/icon-map-active.png')}
                style={styles.icon}
                /> : 
                <Image
                source={require('../img/icon-map.png')}
                style={styles.icon}
                /> 
            )
        })
    },
    Completion: {
        screen: Completion,
        navigationOptions: () => ({
            tabBarIcon: ({focused}) => (
                focused ? <Image
                source={require('../img/icon-map-active.png')}
                style={styles.icon}
                /> : 
                <Image
                source={require('../img/icon-map.png')}
                style={styles.icon}
                /> 
            )
        })
    },
    Success: {
        screen: Completion,
        navigationOptions: () => ({
            tabBarIcon: ({focused}) => (
                focused ? <Image
                source={require('../img/icon-map-active.png')}
                style={styles.icon}
                /> : 
                <Image
                source={require('../img/icon-map.png')}
                style={styles.icon}
                /> 
            )
        })
    },
    Profile: {
        screen: Completion,
        navigationOptions: () => (
            {
            tabBarIcon: ({focused}) => (
                focused ? <Image
                source={require('../img/icon-map-active.png')}
                style={styles.icon}
                /> : 
                <Image
                source={require('../img/icon-map.png')}
                style={styles.icon}
                /> 
            )
        }
        )
    },
  }, options);



export default createAppContainer(Tab);