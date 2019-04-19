import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Image, KeyboardAvoidingView } from 'react-native'
import { withApollo } from 'react-apollo';
import colors from '../utils/colors'

import CreateUser from './CreateUser'
import LoginUser from './LoginUser';

import Cloud from '../../img/nuage-login.svg';
import Logo from '../../img/logo.svg';

class Login extends Component {
    state = {
        register: true,
        signinQ: 'Déjà enregistré ? ',
        signupQ: 'Pas encore enregistré ? ',
        signin: 'Connecte-toi ici',
        signup: 'Inscris-toi ici',
    }
    
  render() {
    return (
      <View style={styles.container}>
        <Image 
            source={require('../../img/maplogin.png')}
            style={styles.maplogin}
        />
        <Cloud style={styles.cloudSecond} width='100%' height={400} fill={colors.parchment}/>
        <Cloud style={styles.cloud} width='130%' height={400} fill={colors.oldLace}/>
        <View style={styles.logoContainer}>
            <Logo style={styles.logo} width={100} height={80} fill={colors.oldLace}/>
            {/* <Image
            source={require('../../img/logo.png')}
            style={styles.logo}
            /> */}
        </View>
        <View style={styles.loginContainer}>
        {
            this.state.register ? 
                <CreateUser { ... this.props }/> 
                : 
                <LoginUser { ... this.props }/> 
        }    
        <Text style={styles.changeFormQuestion}>
            {this.state.register ? this.state.signinQ : this.state.signupQ}
            <Text 
                onPress={() => this.setState({
                    register: !this.state.register 
                })}

                style={styles.changeFormText}
            >
                {this.state.register ? this.state.signin : this.state.signup}
            </Text>
        </Text>
      </View>   
      {/* <Button
        title={this.state.register ? 'Login' : 'Register'} 
        onPress={() => this.setState({
            register: !this.state.register 
        })}
        /> */}
      </View>
    )
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 40,
        backgroundColor: colors.oldLace,
        position: 'relative'
    },
    logoContainer: {
        position: 'absolute',
        top: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    logo: {
        // width: 78,
        // height: 80,
    },
    loginContainer: {
        backgroundColor: colors.oldLace,
    },
    changeFormQuestion: {
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 6,
        fontFamily: 'Mukta-Regular',
        
    },
    changeFormText: {
        fontFamily: 'Mukta-Medium',
        color: colors.tide
    },
    cloud: {
        position: 'absolute',
        top: -20,
        left: -30,
        transform: [{ rotate: '-15deg'}]
    },
    cloudSecond: {
        position: 'absolute',
        top: -60,
        left: 80,
        transform: [{ rotate: '-30deg'}]
    },
    maplogin: {
        position: 'absolute',
        bottom: '70%',
        left: '0%',
        width: '100%'
    }
});

export default withApollo(Login);