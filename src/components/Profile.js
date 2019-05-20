import React, { Component } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import { signOut } from '../components/utils/loginUtils'
import { withApollo } from 'react-apollo'
import { Button } from 'react-native-elements'
import colors from '../components/utils/colors'
import Header from './Header'

class Profile extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            nickname: null,
            email: null
        }
    }
    
    /* Lifecycle methods
    --------------------------------------------------------- */
    componentDidMount() {
        this.props.navigation.setParams({
            client: this.props.client
        })

        AsyncStorage.getItem('USER_EMAIL').then(email => {
            this.setState({ email })
        })

        AsyncStorage.getItem('USER_NAME').then(nickname => {
            if (!nickname) return false;
            this.setState({ nickname })
        })

    }

  render() {
    //   console.log(this.props.navigation)
    //   console.log(this.props, this.state)
    return (
      <View style={styles.container}>
        <Header text='Profil'/>
        <View style={styles.content}>
            <View style={styles.infos}>
                {this.state.nickname && <Text style={styles.name}>{this.state.nickname}</Text>}
                {this.state.email && <Text style={styles.email}>{this.state.email}</Text>}
            </View>
            <Button
                onPress={() => {
                    signOut();  
                    this.props.navigation.getParam('client').resetStore();    
                }}
                title="Déconnexion"
                buttonStyle={
                    {
                        width: 160,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        borderRadius: 6,
                        backgroundColor: colors.selectiveYellow,
                    }
                }
                titleStyle={
                    {
                        fontFamily: 'Mukta-Bold',
                        fontSize: 16,
                        color: colors.bronzetone
                    }
                }
                />
            </View>
      </View>
    )
  }
}

const styles = {
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: colors.oldLace
    },
    content: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'column',
        flex: 1,
        paddingBottom: 30,
        justifyContent: 'space-between'
    },
    infos: {
        flexDirection: 'column'
    },
    name: {
        fontFamily: 'Mukta-Bold',
        color: colors.bronzetone,
        fontSize: 26,
    },
    email: {
        fontFamily: 'Mukta-Regular',
        color: colors.bronzetone60,
        fontSize: 18
    }
}

export default withApollo(Profile)