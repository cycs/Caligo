import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, Button, Image} from 'react-native';


export default class Completion extends React.Component {
  render() {
    return (
      <View style={completionStyles.container}>
        <View>
          <Text style={completionStyles.welcome}>High Scores</Text>
        </View>
      </View>
    );
  }
}


/* STYLES
---------------------------------------------------------------------------------------------------- */

const completionStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
  });