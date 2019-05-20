import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, KeyboardAvoidingView } from 'react-native'
import { Button, Input, Label } from 'native-base'

import { withApollo } from 'react-apollo';
import colors from '../utils/colors'

import CreateUser from './CreateUser'
import LoginUser from './LoginUser';

import Cloud from '../../img/nuage-login.svg';
import Logo from '../../img/logo.svg';
// import LogoTitle from '../../img/logo-title.svg';
import LogoTitle from '../../img/logo-caligo-text.svg';
import Belgium from '../../img/belgium.svg';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import SignIn from './SignIn'
import SignUp from './SignUp'
import OfflineNotice from '../utils/OfflineNotice'

class Login extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
        }
    }

    state = {
        register: true,
        signinQ: 'Déjà enregistré ? ',
        signupQ: 'Pas encore enregistré ? ',
        signin: 'Connecte-toi ici',
        signup: 'Inscris-toi ici',
    }
    
  render() {
    //   console.log(this.props)
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
            <Image 
                source={require('../../img/maplogin.png')}
                style={styles.maplogin}
            />
            <Cloud style={styles.cloudSecond} width='100%' height={400} fill={colors.parchment}/>
            <Cloud style={styles.cloud} width='130%' height={400} fill={colors.oldLace}/>
            {/* <View style={styles.logoContainer}> */}
            <View style={styles.titleContainer}>
                <Logo style={styles.logo} width={150} height={110} fill={colors.oldLace}/>
                {/* <Belgium style={styles.belgium} width={120} height={120} stroke={colors.bronzetone5} fill='none'/> */}
                <LogoTitle style={styles.logotitle} width={80} height={85} fill={colors.oldLace80}/>
                {/* <Text style={styles.title}>Caligo</Text> */}
                {/* <Text style={styles.subtitle}>Marche. Explore. Dévoile.</Text> */}
            </View>
            {/* </View> */}
        </View>

        {/* <View style={styles.loginContainer}>
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
      </View>    */}
        <View style={styles.loginContainer}>
            <View style={styles.loginSubcontainer}>
                <Button
                    onPress={() => this.props.navigation.navigate('Signin')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Se connecter</Text>        
                </Button>
                <Button
                    onPress={() => this.props.navigation.navigate('Signup')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>S'enregistrer</Text>
                </Button>
            </View>
        </View>
        <OfflineNotice />
      </View>
    )
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.oldLace,
        position: 'relative'
    },
    subcontainer: {
        position: 'relative',
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 70
    },  
    logoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logotitle: {
    },
    title: {
        fontFamily: 'Mukta-Bold',
        fontSize: 72,
        color: colors.bronzetone

    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Mukta-Light',
        color: colors.bronzetone60
    },
    logo: {
    },
    belgium: {
        position: 'absolute',
        right: 100,
        top: -10,
        zIndex: 2
    },
    loginContainer: {
        backgroundColor: colors.oldLace,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginSubcontainer: {
        width: '100%'
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
        bottom: -140,
        left: -30,
        transform: [{ rotate: '-15deg'}]
    },
    cloudSecond: {
        position: 'absolute',
        bottom: -100,
        left: 80,
        transform: [{ rotate: '-30deg'}]
    },
    maplogin: {
        position: 'absolute',
        bottom: 0,
        left: '0%',
        width: '100%'
    },
    button: {
        backgroundColor: colors.goldenTainoi,
        fontFamily: 'Mukta-Regular',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0.2,
        elevation: 0
    },
    buttonText: {
        color: colors.bronzetone,
        fontFamily: 'Mukta-Bold',
        fontSize: 16,
    }
});

const AppStackNavigator = createStackNavigator({
    Home: {
        screen: withApollo(Login),
    },
    Signin: {
        screen: withApollo(SignIn),
    },
    Signup: {
        screen: withApollo(SignUp),
    }

}); 

const Container = createAppContainer(AppStackNavigator)

export default Container;