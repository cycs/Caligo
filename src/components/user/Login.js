import React, { Component } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'

import CreateUser from './CreateUser'
import LoginUser from './LoginUser';

export default class Login extends Component {
    state = {
        register: true,
    }
    
  render() {
    return (
      <View style={styles.container}>
      {
          this.state.register ? <CreateUser/> : <LoginUser/> 
      }
      <Button
        title={this.state.register ? 'Login' : 'Register'} 
        onPress={() => this.setState({
            register: !this.state.register 
        })}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});