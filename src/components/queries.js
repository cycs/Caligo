import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';


class Queries extends Component {
  render() {
    console.log('GRAPHQL QUERY', this.props);
    const { loading, allCommuneses } = this.props;
    if(loading) return null

    // const communes = allCommuneses.map(com => JSON.parse(com.data))
    // console.log(communes);

    return (
      <View>
          <Text> hello </Text>
      </View>
    )
  }
}

const query = gql`{allCommuneses{data}}`;

export default graphql(query, { 
    props: ({ data }) => ({ ...data })
})(Queries)