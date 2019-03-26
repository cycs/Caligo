import React, {Component} from 'react';
import { ActivityIndicator } from 'react-native';
import {name as appName} from './app.json';
import Tab from './src/components/tabsNavigator';
import { connect } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { communesUpdate, communesCompletion, fetchData } from './src/actions';
import { AsyncStorage, Button } from 'react-native';
import { withApollo } from 'react-apollo';

import Login from './src/components/user/Login';
import { signOut } from './src/components/utils/loginUtils'

class App extends React.Component {
    static navigationOptions = ({ navigation }) => {
        console.log(navigation.getParam('client'))
        return {
            headerTitle: 'Fogify',
            headerRight: (
                <Button
                onPress={() => {
                    signOut();  
                    navigation.getParam('client').resetStore();    
                }}
                title="Déconnexion"
                color="#841584"
                />
            )}
      };

      /* Lifecycle methods
      --------------------------------------------------------- */
    componentDidMount() {
        console.log(this.props)
        this.props.navigation.setParams({
            client: this.props.client
        })
    }

    render() {
      return <Tab/>
    }
  }

const AppStackNavigator = createStackNavigator({
    Home: {
        screen: withApollo(App),
    }
}); 

const Container = createAppContainer(AppStackNavigator)

const NavWrapper = ({ user, loading, fetchData }) => {
    if (loading) return <ActivityIndicator size="large" />
    if (!user) return <Login />

    AsyncStorage.setItem('USER', user.id);

    return <Container screenProps={{ user }}/>
} 

const userQuery = gql`
    query userQuery {
        user {
            id,
            email
        }
    }
`

const gqlWrapper = graphql(userQuery, {
    props: ({data}) => ({ ... data })
});

const mapStateToProps = state => {
    console.log('MAPSTATE APP', state)
    return ({
        communes: [],
        list: state.list,
        loading: state.communes.loading,
        error: state.communes.error
    })
}

const reduxWrapper = connect(mapStateToProps, { fetchData, communesUpdate, communesCompletion });

// export default createAppContainer(NavWrapper);
// export default graphql(userQuery, {
//     props: ({data}) => ({ ... data })
// })(NavWrapper);

export default compose(reduxWrapper, gqlWrapper)(NavWrapper);

