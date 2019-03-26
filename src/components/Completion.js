import React, { Component } from 'react';
import {FlatList, StyleSheet, Text, View, Button, Image} from 'react-native';
import Map from 'Map';
import { connect } from 'react-redux';
import * as turf from '@turf/turf';
import { SearchBar } from 'react-native-elements';
import { filterList } from '../actions';

import store from '../components/Store';



class Completion extends React.Component {
  constructor(props: Props) {
    super(props);

    this.state = {
        searchInput: '',
        listSource: this.getList(),
        listfiltered: this.getList()
    }

    this.listholder = this.props.list

    console.log(store.getState().communes.communes)

    store.subscribe(() => {
        this.setState({listSource: this.getList()})
        this.filterList(this.state.searchInput)
    })

  }

  /* Lifecycle Methods
  --------------------------------------------------------- */
  componentDidMount() {
      console.log('COMPONENT DID MOUNT COMPLETION')
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate COMPLETION")
    console.log('prevProps', prevProps);
    // console.log('props', this.state.list);

    // this.listholder = this.props.list; // Keeps the list updated
  }

  render() {
      console.log(Map)
      console.log('THIS PROPS COMPLETION', this.list)
      
    return (
      <View style={completionStyles.container}>
            {this.searchList()}
          <FlatList
            ItemSeparatorComponent={this.renderSeparator}
            data={this.sortList(this.state.listfiltered)}
            renderItem={({item}) => {
                const percent = `${item.percentage.toFixed(3)}%`;
                // const percent = `${item.percentage}%`;
                const area = `${Math.round(item.area / 1000000)} km²`

              return(
                <View style={completionStyles.flatview} id={item.id}>
                  <View style={completionStyles.infos}>
                    <Text style={completionStyles.name}>{item.name}</Text>
                    <Text style={completionStyles.item}>{area}</Text>
                  </View>
                  <View style={completionStyles.percentContainer}>
                    <Text style={completionStyles.percentage}>{percent}</Text>
                  </View>
                </View>
                )
            }}
            keyExtractor={(item) => item.id}
        />
      </View>
    );
  }

  /* Methods
  --------------------------------------------------------- */
  getList() {
      console.log('TIS PROPS GET LIST',this.props)
    const list = store.getState().communes.communes.features.map((commune, i) => {
      return this.getArea(commune, i);
    });
    // const list = this.state.features.map((commune, i) => {
    //   return this.getArea(commune, i);
    // });

    return list;
  }

  getArea(feature, i) {
    if (
        feature.properties.SHN == "BE421009" ||
        feature.properties.SHN == "BE213002" ||
        feature.properties.SHN == "BE233016"
        )  {
        return {area: 0, explored: 0, percentage: 0, name: feature.properties.NAMN, id: feature.id}
    }
  let polygon = feature.geometry.coordinates[0];
  let explored = 0;
  
  if (feature.geometry.coordinates.length > 1) {
      polygon = feature.geometry.coordinates[1]
      
      const  polygonExplored = turf.polygon([feature.geometry.coordinates[0]]);
      explored = turf.area(polygonExplored);
  }

  polygon = turf.polygon([polygon]);

  const area = turf.area(polygon);
  const percentage = explored / area * 100;
  const name = feature.properties.NAMN;

  console.log(percentage);

  return {
      id: feature.id,
      key: feature.id,
      area,
      explored,
      percentage,
      name
  }
}

  sortList(list) {
      console.log(list)
    const newList = list.sort((a, b) => {
        if (a.name < b.name) return -1;
        if ( a.name > b.name) return 1;
        
        return 0;
    });

    return newList;
  }
 
  searchList = () => {    
    return (      
      <SearchBar        
        placeholder="Rechercher"        
        lightTheme        
        onChangeText={text => this.searchFilterFunction(text)}
        value={this.state.searchInput}
        autoCorrect={false}             
      />    
    );  
  }

  filterList(text) {
      console.log(text)
    // const copy = state.source;
    console.log(this.state)

    const copy = this.state.listSource;
    const newState = copy.filter(item => {
        console.log(text)
        return item.name.indexOf(text) > -1;
    });

    this.setState({
        listfiltered: newState
    })
  }

  searchFilterFunction = text => {
    this.setState({searchInput: text})
    console.log(text)
    this.filterList(text)

    // const newData = this.arrayholder.filter(item => {      
    //     const itemData = `${item.name.title.toUpperCase()}   
    //     ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
    //      const textData = text.toUpperCase();
          
    //      return itemData.indexOf(textData) > -1;    
    //   });    
    //   this.setState({ data: newData });  
  }

}

/* STYLES
---------------------------------------------------------------------------------------------------- */

const completionStyles = StyleSheet.create({
    container: {
      flex: 1,
    },  
    flatview: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 2,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      paddingRight: 20,
      paddingLeft: 20,
      flexDirection: 'row',

    },
    infos: {
      flex: 2,
      justifyContent: 'center'
    },
    item: {
      fontSize: 18,
    },
    name: {
      fontFamily: 'Verdana',
      fontSize: 24,
      color: 'rgba(0, 0, 0, .8)',
    },
    percentContainer: {
        // backgroundColor: 'red',
        
        alignItems: 'center',
        alignContent: 'center',
    },
    percentage: {
        color: 'rgba(0, 0, 0, .5)',
    },
    title: {
        fontSize: 30,
        textAlign: 'center'
    }
  });

const mapStateToProps = state => {
    return state;
}

export default Completion;
// export default connect(mapStateToProps, { filterList })(Completion);