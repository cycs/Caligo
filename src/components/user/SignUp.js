import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import CreateUser from './CreateUser';
import colors from '../utils/colors'
import { HeaderBackButton } from 'react-navigation';

export default class SignIn extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
    })

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }
    
    render() {
        return (
            <View style={{
                height: '100%', 
                justifyContent: 'center',
            }}>
                <CreateUser { ... this.props }/> 
                <Text style={styles.changeFormQuestion}>
                    {'Déjà inscrit ? '} 
                    <Text 
                        onPress={() => this.props.navigation.navigate('Signin')}

                        style={styles.changeFormText}
                    >
                        Connecte-toi ici.
                    </Text>
                </Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    changeFormQuestion: {
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 6,
        fontFamily: 'Mukta-Regular',        
    },
    changeFormText: {
        fontFamily: 'Mukta-Medium',
        color: colors.tide,
    },
   
});