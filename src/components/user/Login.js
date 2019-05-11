import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Image, KeyboardAvoidingView } from 'react-native'
import { withApollo } from 'react-apollo';
import colors from '../utils/colors'

import CreateUser from './CreateUser'
import LoginUser from './LoginUser';

import Cloud from '../../img/nuage-login.svg';
import Logo from '../../img/logo.svg';
import LogoTitle from '../../img/logo-title.svg';
import Belgium from '../../img/belgium.svg';

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
        <View style={styles.titleContainer}>
            {/* <Belgium style={styles.belgium} width={120} height={120} stroke={colors.bronzetone5} fill='none'/> */}
            <LogoTitle style={styles.logotitle} width={180} height={50} fill={colors.bronzetone}/>
            <Text style={styles.subtitle}>Marche. Explore. Dévoile.</Text>
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
    titleContainer: {
        position: 'absolute',
        width: '70%',
        // height: 150,
        marginLeft: '15%',
        marginRight: 'auto',
        justifyContent: 'center',
        alignItems: 'flex-end',
        top: 210,
        left: 0,
        // backgroundColor: 'green'
    },
    logotitle: {
        // position: 'absolute'
        // backgroundColor: 'pink'

    },
    subtitle: {
        // backgroundColor: 'red'
        fontSize: 12,
        fontFamily: 'Mukta-Light',
        color: colors.bronzetone60
    },
    logo: {
        // width: 78,
        // height: 80,
    },
    belgium: {
        position: 'absolute',
        right: 100,
        top: -10,
        zIndex: 2
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
        top: -40,
        left: -30,
        transform: [{ rotate: '-15deg'}]
    },
    cloudSecond: {
        position: 'absolute',
        top: -80,
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