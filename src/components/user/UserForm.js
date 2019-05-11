import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { Form, Item, Button, Input, Label } from 'native-base'
import colors from '../utils/colors'

export default class UserForm extends Component {
    state = {
        email: "",
        password: "",
    }
    submitForm = () => {
        const { nickname, email, password } = this.state;
        this.props.onSubmit({
            nickname,
            email, 
            password
        })
    };

    /* Lifecycle Methods
    --------------------------------------------------------- */
    render() {
        let itemSign;

        if(this.props.action === "signup") {
            itemSign = 
            <View>
                <Item floatingLabel style={styles.item}> 
                    <Label style={styles.label}>Pseudo</Label>
                    <Input
                    value={this.state.nickname}
                    onChangeText={nickname => this.setState({ nickname })}
                    />
                </Item>
                <Item floatingLabel style={styles.item}>
                    <Label style={styles.label}>Email</Label>
                    <Input
                    keyboardType="email-address"
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                    />
                </Item>
            </View>;
        } else {
            itemSign = 
            <Item floatingLabel style={styles.item}>
                <Label style={styles.label}>Email</Label>
                <Input
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                />
            </Item>;
        }
    return (
        <Form style={styles.form}>
            {itemSign}
            
            <Item floatingLabel style={styles.item}>
                <Label style={styles.label}>Mot de passe</Label>
                <Input
                secureTextEntry
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                />
            </Item>
            <Button
                // title={this.props.type}
                onPress={this.submitForm}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{this.props.type}</Text>
            </Button>
        </Form>
    )
    }
}


/* STYLES
---------------------------------------------------------------------------------------------------- */
const styles = StyleSheet.create({
    form: {
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '70%'
    },
    label: {
        fontFamily: 'Mukta-regular',
        color: colors.tide,
        fontSize: 16,
    },
    item: {
        borderBottomWidth: 2,
        borderColor: colors.goldenTainoi,
        paddingTop: 3,
        paddingBottom: 3,
        marginLeft: 0,
        marginTop: 0,
        fontFamily: 'Mukta-regular',

    },
    button: {
        backgroundColor: colors.goldenTainoi,
        fontFamily: 'Mukta-regular',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    buttonText: {
        color: colors.white,
        fontFamily: 'Mukta-regular',
       
    }
});