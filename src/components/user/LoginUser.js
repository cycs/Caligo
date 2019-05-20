import React, { Component } from 'react'
import { Text, View } from 'react-native'
import UserForm from './UserForm'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { signIn } from '../utils/loginUtils'
import ErrorHandling from '../utils/ErrorHandling'

class LoginUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            wrongUserData: {
                message: null,
                hasError: false
            }
        }
    }

  /* Lfecycle methods
  --------------------------------------------------------- */
    render() { 
        return (
            <View style={{position:'relative'}}>
            {/* <Text>Login</Text> */}
            {this.state.wrongUserData.hasError && <ErrorHandling text={this.state.wrongUserData.message} />}
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
            if(email == '' && password == '') throw new Error('Champs vides')
            if(email == '') throw new Error('Email non-valide')
            if(password == '') throw new Error('Mot de passe non-valide')
            
            const signin = await this.props.signinUser({
                variables: { email, password }
            });

            signIn(signin.data.signinUser.token);
            this.props.client.resetStore();

        } catch(e) {
            let message = e.message || 'Erreur'

            if(e.graphQLErrors && e.graphQLErrors.length > 0 && e.graphQLErrors[0].message) {
                message = e.graphQLErrors[0].message
            }

            if(e.graphQLErrors && e.graphQLErrors.length > 0 && e.graphQLErrors[0].code === 3022) {
                message = "Nom d'utilisateur ou mot de passe erroné(s)."
            }

            this.setState({ 
                wrongUserData: {
                    hasError:true,
                    message
                } 
            })

            setTimeout(() => this.setState({wrongUserData: {hasError: false}}), 6000)
        }
    }
}

const styles = {
    text: {}
}

const signinUser = gql`
    mutation signinUser($email: String!, $password: String!) {
        signinUser(email: { email: $email, password: $password }) { token }
    }
`;

   
export default graphql(signinUser, { name: "signinUser" })(LoginUser)