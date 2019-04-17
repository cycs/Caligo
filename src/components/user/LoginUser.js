import React, { Component } from 'react'
import { Text, View } from 'react-native'
import UserForm from './UserForm'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { signIn } from '../utils/loginUtils'

class LoginUser extends Component {
  
  /* Lfecycle methods
  --------------------------------------------------------- */
    render() { 
    return (
        <View>
        {/* <Text>Login</Text> */}
        <UserForm 
            type="Se connecter" 
            onSubmit={this.loginUser}/>
        </View>
    )
  }

  /* Methods
  --------------------------------------------------------- */
    loginUser = async ({ email, password }) => {
        try {
            const signin = await this.props.signinUser({
                variables: { email, password }
            });

            signIn(signin.data.signinUser.token);
            this.props.client.resetStore();

        } catch (e) {
            console.log(e)
        }
    }
}

const signinUser = gql`
    mutation signinUser($email: String!, $password: String!) {
        signinUser(email: { email: $email, password: $password }) { token }
    }
`;

   
export default graphql(signinUser, { name: "signinUser" })(LoginUser)