import React, { Component } from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'

export default class Loading extends Component {
  render() {
    return (
        <View style={styles.loadingContainer}>
            <Image style={styles.loading} width={100} height={84} source={require('../../img/logo-loading.gif')} />
        </View>
    )
  }
}

const styles = StyleSheet.create({

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loading: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });