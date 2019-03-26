import React, { Component } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { withApollo } from 'react-apollo';

import CreateUser from './CreateUser'
import LoginUser from './LoginUser';

class Login extends Component {
    state = {
        register: true,
    }
    
  render() {
    return (
      <View style={styles.container}>
      {
          this.state.register ? 
            <CreateUser { ... this.props }/> 
            : 
            <LoginUser { ... this.props }/> 
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

export default withApollo(Login);