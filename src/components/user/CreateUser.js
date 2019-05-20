import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import UserForm from './UserForm'
import { compose, graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { signIn } from '../utils/loginUtils'
import { request } from 'graphql-request'
import colors from '../utils/colors'
import ErrorHandling from '../utils/ErrorHandling'


import communesJSON from '../../../communes-minify.json';

class CreateUser extends Component {
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
            <View>
            {this.state.wrongUserData.hasError && <ErrorHandling text={this.state.wrongUserData.message} />}
            <UserForm 
                type="S'enregistrer" 
                action="signup"
                onSubmit={this.createUser}/>
            </View>
        )
  }

  /* Methods
  --------------------------------------------------------- */
    createUser = async ({ nickname, email, password }) => {

        // Ligne à supprimer - Empeche de s'enregistrer
        // return false;



        try {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if(!re.test(email) && password.length < 9) throw new Error('Email non-valide et mot de passe trop court')
            if(password.length < 9) throw new Error('Mot de passe trop court (8 caractères minimum)')
            if(!re.test(email)) throw new Error('Email non-valide')

            const user = await this.props.createUser({ 
                variables: { nickname, email, password }
            });

            const signin = await this.props.signinUser({
                variables: { email, password }
            });

            // console.log(user, this.props, signin.data.signinUser.token)

            // const mutation = `
            //     mutation createMunicipality($data: String!, $id: ID!) {
            //         createMunicipality(data: $data, userId: $id) { id }
            //     }`

            // communesJSON.features.map((com, i) => {
            //     // if(i != 1) return false;
            //     const commune = JSON.stringify(com);
            //     // console.log(user.data.createUser.id, commune)

            //     const variables = {
            //         id: user.data.createUser.id,
            //         data: commune,
            //     };

            //     request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', mutation, variables);
            // })


            // this.props.onCompleted((data) => console.log(data))
            signIn(signin.data.signinUser.token);
            this.props.client.resetStore();

        } catch (e) {
            let message = e.message || 'Erreur'

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

const createDB = gql`
    mutation createMunicipality($data: String!, $id: ID!) {
        createMunicipality (
  	        data: $data,
            userId: $id
        ) { id }
        
    }
`;

const createUser = gql`
    mutation createUser($nickname: String!, $email: String!, $password: String!) {
        createUser(
            nickname: $nickname,
            authProvider: { email: {
                email: $email
                password: $password
            }}
        ) { id }
    }
`;

const signinUser = gql`
    mutation signinUser($email: String!, $password: String!) {
        signinUser(email: { email: $email, password: $password }) { token }
    }
`;

const styles = StyleSheet.create({
    text: {
      fontFamily: 'Mukta-Regular',
      color: colors.selectiveYellow
    },
  
  })

export default compose(
    graphql(createUser, { name: "createUser" }),
    graphql(signinUser, { name: "signinUser" })
)(CreateUser);  