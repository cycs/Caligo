import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Image, View } from 'react-native';
import colors from './utils/colors'

import Map from './Map';
import Completion from './Completion';

const styles = {
    tab: {
        paddingTop: 0,
        paddingBottom: 0,
        borderTopWidth: 0,
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

const mapActiveState = <View style={{
    borderColor: colors.goldenTainoi, 
    justifyContent:'center', 
    alignItems:'center', 
    width:'100%', 
    height:'100%', 
    borderTopWidth: 3,
}}><Image
source={require('../img/icon-map-active.png')}
style={styles.icon}
/></View>;

const mapIdleState = <Image
source={require('../img/icon-map.png')}
style={styles.icon}
/> 

const successActiveState = <View style={{
    borderColor: colors.goldenTainoi, 
    justifyContent:'center', 
    alignItems:'center', 
    width:'100%', 
    height:'100%', 
    borderTopWidth: 3,
}}><Image
source={require('../img/icon-success-active.png')}
style={styles.icon}
/></View>;

const successIdleState = <Image
source={require('../img/icon-success.png')}
style={styles.icon}
/> 

const statsActiveState = <View style={{
    borderColor: colors.goldenTainoi, 
    justifyContent:'center', 
    alignItems:'center', 
    width:'100%', 
    height:'100%', 
    borderTopWidth: 3,
}}><Image
source={require('../img/icon-stats-active.png')}
style={styles.icon}
/></View>;

const statsIdleState = <Image
source={require('../img/icon-stats.png')}
style={styles.icon}
/> 

const profileActiveState = <View style={{
    borderColor: colors.goldenTainoi, 
    justifyContent:'center', 
    alignItems:'center', 
    width:'100%', 
    height:'100%', 
    borderTopWidth: 3,
}}><Image
source={require('../img/icon-profile-active.png')}
style={styles.icon}
/></View>;

const profileIdleState = <Image
source={require('../img/icon-profile.png')}
style={styles.icon}
/> 

const Tab = createBottomTabNavigator({
    Home: {
        screen: Map,
        navigationOptions: () => ({
            tabBarIcon: ({focused}) => (
                focused ? mapActiveState : mapIdleState
            )
        })
    },
    Completion: {
        screen: Completion,
        navigationOptions: () => ({
            tabBarIcon: ({focused}) => (
                focused ? statsActiveState : statsIdleState
            )
        })
    },
    Success: {
        screen: Completion,
        navigationOptions: () => ({
            tabBarIcon: ({focused}) => (
                focused ? successActiveState : successIdleState
            )
        })
    },
    Profile: {
        screen: Completion,
        navigationOptions: () => (
            {
            tabBarIcon: ({focused}) => (
                focused ? profileActiveState : profileIdleState
            )
        }
        )
    },
  }, options);



export default createAppContainer(Tab);