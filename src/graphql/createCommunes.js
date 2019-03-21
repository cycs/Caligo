import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {Platform, StyleSheet, Text, View, Button, Image} from 'react-native';
import communesJSON from '../../communes-minify.json';

console.log(communesJSON)


class CreateCommunes extends Component {
    newDB = () => {
        console.log('MUTAAAAAAAAAAAAAAAAATIONOOOOOOOOOOOOOONN', this.props);

        communesJSON.features.map((com, i) => {
            const commune = JSON.stringify(com);

            this.props.newDatabase({
                variables: {
                    data: commune
                }
            })
            .then((res) => console.log(res))
            .catch(err => console.log(err))
        
        })
        }

    
    render() {
    return (
      <View>
        <Button onPress={this.newDB} title="Create database"/>
      </View>
    )
  }
}
const createDB = gql`
    mutation createDB($data: String!) {
        createCommunes(data: $data) {
            id
        }
    }
`

export default graphql(createDB, {
    name: 'newDatabase'
})(CreateCommunes);