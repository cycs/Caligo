import React, { Component } from 'react'
import {StyleSheet, Text, View } from 'react-native';
import colors from './utils/colors'

import Belgium from '../img/belgique.svg'

export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={completionStyles.headerContainer}>
                <Belgium style={completionStyles.header} width={200} height={160} top={-47} right={-55}/>
                <View style={completionStyles.titleContainer}>
                        <Text style={completionStyles.maintitle}>{this.props.text}</Text>
                </View>
            </View>
        )
    }
}


/* STYLES
---------------------------------------------------------------------------------------------------- */

const completionStyles = StyleSheet.create({
    titleContainer: {
        width: '80%',
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        // alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    maintitle: {
        fontSize: 42,
        fontFamily: 'Mukta-Bold',     
        color: colors.bronzetone,
        marginTop: 20
    },
    headerContainer: {
        position: 'relative',
        height: 130,
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
    },
  });
