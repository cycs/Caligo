import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import UserForm from './UserForm'
import { compose, graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { signIn } from '../utils/loginUtils'
import { request } from 'graphql-request'
import colors from '../utils/colors'


import communesJSON from '../../../communes-minify.json';

class CreateUser extends Component {
    constructor(props) {
        super(props)
    }
  
  /* Lfecycle methods
  --------------------------------------------------------- */
    render() { 
    return (
        <View>
        {/* <Text style={styles.text}>Register</Text> */}
        <UserForm 
            type="S'enregistrer" 
            action="signup"
            onSubmit={this.createUser}/>
        </View>
    )
  }

  /* Methods
  --------------------------------------------------------- */
    createUser = async ({ email, password }) => {

        // Ligne à supprimer - Empeche de s'enregistrer
        return false;


        
        try {
            const user = await this.props.createUser({ 
                variables: { email, password }
            });

            const signin = await this.props.signinUser({
                variables: { email, password }
            });

            console.log(user, this.props, signin.data.signinUser.token)

            const mutation = `
                mutation createMunicipality($data: String!, $id: ID!) {
                    createMunicipality(data: $data, userId: $id) { id }
                }`

            communesJSON.features.map((com, i) => {
                // if(i != 1) return false;
                const commune = JSON.stringify(com);
                // console.log(user.data.createUser.id, commune)

                const variables = {
                    id: user.data.createUser.id,
                    data: commune,
                };

                request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', mutation, variables);
            })


            // this.props.onCompleted((data) => console.log(data))
            signIn(signin.data.signinUser.token);
            this.props.client.resetStore();

        } catch (e) {
            console.log(e)
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
    mutation createUser($email: String!, $password: String!) {
        createUser(
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