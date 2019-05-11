import React, { Component } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import { signOut } from '../components/utils/loginUtils'
import { withApollo } from 'react-apollo'
import { Button } from 'react-native-elements'
import colors from '../components/utils/colors'

class Profile extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            nickname: null
        }
    }
    
    /* Lifecycle methods
    --------------------------------------------------------- */
    componentDidMount() {
        this.props.navigation.setParams({
            client: this.props.client
        })

        AsyncStorage.getItem('USER_NAME').then(nickname => {
            if (!nickname) return false;
            this.setState({ nickname })
        })

    }

  render() {
    //   console.log(this.props.navigation)
      console.log(this.props, this.state)
    return (
      <View>
        <Text> Profil </Text>
        {this.state.nickname && <Text>{this.state.nickname}</Text>}
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
                    fontFamily: 'Mukta-Regular',
                    color: colors.white
                }
            }
        />
      </View>
    )
  }
}

export default withApollo(Profile)