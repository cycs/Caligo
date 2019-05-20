import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class ErrorHandling extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>{this.props.text}</Text>
        </View>
        )
    }
}

const styles = {
    container: {
        backgroundColor: 'rgba(255, 0, 0, 0.4)',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 18,
        padding: 18,
        // height: 100,
        borderRadius: 4
    }
}
