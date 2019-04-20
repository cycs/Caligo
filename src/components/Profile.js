import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import { signOut } from '../components/utils/loginUtils'
import { withApollo } from 'react-apollo';


class Profile extends Component {
    /* Lifecycle methods
    --------------------------------------------------------- */
    componentDidMount() {
    this.props.navigation.setParams({
        client: this.props.client
    })
}

  render() {
      console.log(this.props.navigation)
      console.log(this.props)
    return (
      <View>
        <Text> Profil </Text>
        <Button
                onPress={() => {
                    signOut();  
                    this.props.navigation.getParam('client').resetStore();    
                }}
                title="Déconnexion"
                color="#841584"
                />
      </View>
    )
  }
}

export default withApollo(Profile)