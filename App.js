import React, {Component} from 'react';
import { ActivityIndicator } from 'react-native';
import {name as appName} from './app.json';
import Tab from './src/components/tabsNavigator';
import { connect } from 'react-redux';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { communesUpdate, communesCompletion, fetchData } from './src/actions';
import { AsyncStorage } from 'react-native';

import Login from './src/components/user/Login';

class App extends React.Component {
    static navigationOptions = {
        title: 'Fogify',
      };

    render() {
      return <Tab/>
    }
  }

const AppStackNavigator = createStackNavigator({
    Home: {
        screen: App,
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

