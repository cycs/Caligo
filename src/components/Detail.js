import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { request } from 'graphql-request'

export default class Detail extends Component {
    constructor(props) {
        super(props)

        // console.log(props)
        // console.log(this)

    }

    componentDidMount() {
        // this.id = props.navigation.state.params.id;
        
        console.log(this.props.navigation.state.params.id)
        const query = `
        {
            Municipality(id: "${this.props.navigation.state.params.id}") {
                data
            }
        }`
            
            request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', query).then(data =>
            console.log(data)
            )
    }

    render() {
        // console.log(this.props)
        // console.log(this)
        return (
            <View>
            <Text> Détails </Text>
            </View>
        )
    }
}
