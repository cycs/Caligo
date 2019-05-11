import React, { Component } from 'react';
import {FlatList, StyleSheet, Text, View, Button, Image, Dimensions, TouchableOpacity } from 'react-native';
import Map from 'Map';
import { connect } from 'react-redux';
// import * as turf from '@turf/turf';
import { polygon } from '@turf/helpers';
import area from '@turf/area';
import { SearchBar } from 'react-native-elements';
import { filterList } from '../actions';
import colors from './utils/colors'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Detail from './Detail'
import CompletionItem from './completion-item'

import { store } from '../components/Store';

import Arrow from '../img/arrow-right.svg';
import SearchIcon from '../img/search-icon.svg';
import Cloud from '../img/cloud.svg';
import HeaderBG from '../img/header-list.svg';
import CloudHeader from '../img/cloud-header.svg';
import CloudHeader2 from '../img/header-completion.svg';
// import HeaderBG from '../img/header-list-cloudy.svg';

class Completion extends React.Component {
    
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
      };
    }
  constructor(props: Props) {
    super(props);

    
    this.state = {
        searchInput: '',
        listSource: [],
        listfiltered: []
    }

    this.listholder = this.props.list

    // console.log(store.getState().communes.communes)
    // console.log(this.props.navigation)

 

  }

  /* Lifecycle Methods
  --------------------------------------------------------- */
  componentDidMount() {
    store.subscribe(() => {
        this.setState({listSource: this.getList()})
        this.filterList(this.state.searchInput)
    })

      this.setState({
          listSource: this.getList(),
          listfiltered: this.getList(),
        })
    //   console.log('COMPONENT DID MOUNT COMPLETION')
  }

//   shouldComponentUpdate(nextProps, nextState) {
//     console.log(nextProps, nextState)
//     console.log(this.props, this.state)
//   }

  componentDidUpdate(prevProps, prevState) {
    // console.log("componentDidUpdate COMPLETION")
    // console.log('prevProps', prevProps);
    // console.log('props', this.state.list);

    // this.listholder = this.props.list; // Keeps the list updated
  }

  render() {
    //   console.log(Map)
    //   console.log('THIS PROPS COMPLETION', this.list)
      const {height, width} = Dimensions.get('window');
      const ratio = width / 3.333;
      const { navigate } = this.props.navigation;

    return (
      <View style={completionStyles.container}>
            <View style={completionStyles.headerContainer}>
                {/* <Image 
                    source={require('../img/header-completion.png')}
                    style={{position:'absolute', width:'100%', left:-1, bottom:0}}
                /> */}
                {/* <HeaderBG style={completionStyles.header} bottom={0} width={width} fill={colors.goldenTainoi}/> */}
                {/* <CloudHeader style={completionStyles.header} width='100%' height={500} fill={colors.goldenTainoi}/> */}
                <CloudHeader2 style={completionStyles.header} width={width} height={ratio} bottom={0} fill={colors.white}/>
                {this.searchList()}
                <View style={completionStyles.titleContainer}>
                    {/* <Cloud style={completionStyles.cloud} width={55.5} height={35} fill={colors.oldLace}/> */}
                    <Text style={completionStyles.maintitle}>Progression</Text>
                </View>
            </View>
          <FlatList
            // ItemSeparatorComponent={this.renderSeparator}
            // extraData={this.state}
            data={this.sortList(this.state.listfiltered)}
            renderItem={({item}) => {
                // const percent = `${item.percentage.toFixed(2)}%`;
                // const percent = `${item.percentage}%`;
                // const newArea = `${Math.round(item.area / 1000000)} km²`
              return(
                <CompletionItem item={item} goto={() => navigate('Detail', { item })}/>
                // <TouchableOpacity onPress={() => navigate('Detail', { id: item.id, name: item.name })} style={completionStyles.flatview} id={item.id}>
                //   <View style={completionStyles.infos}>
                //     <Text style={completionStyles.name}>{item.name}</Text>
                //     <Text style={completionStyles.area}>{newArea}</Text>
                //   </View>
                //   <View style={completionStyles.percentContainer}>
                //     <Text style={completionStyles.percentage}>{percent}</Text>
                //   </View>
                //   <View style={completionStyles.arrowContainer}>
                //     <Arrow height={15} width={15} fill={colors.bronzetone}/>
                //   </View>
                // </TouchableOpacity >
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
      console.log('TIS PROPS GET LIST', store.getState())
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
  let newPolygon = feature.geometry.coordinates[0];
  let explored = 0;
  
  if (feature.geometry.coordinates.length > 1) {
    newPolygon = feature.geometry.coordinates[1]
      
      const  polygonExplored = polygon([feature.geometry.coordinates[0]]);
      explored = area(polygonExplored);
  }

  newPolygon = polygon([newPolygon]);

  const newArea = area(newPolygon);
  const percentage = explored / newArea * 100;
  const name = feature.properties.NAMN;

//   console.log(percentage);

  return {
      id: feature.id,
      key: feature.id,
      area: newArea,
      explored,
      percentage,
      name,
      SHN: feature.properties.SHN
  }
}

  sortList(list) {
    //   console.log(list)
    if(list.length == 0) return false;

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
        searchIcon={<SearchIcon height={24} width={16} fill='none' strokeWidth={4} stroke={colors.tide} />}      
        placeholder="Rechercher"  
        placeholderTextColor={colors.tide}      
        containerStyle={
            { 
                backgroundColor: colors.white,
                borderRadius: 50,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 2,
                paddingBottom: 0,
                paddingTop: 0,
                paddingLeft: 0,
                paddingRight: 0,
                position: 'absolute',
                bottom: 24,
                width: '80%',
                
            }
        }        
        inputContainerStyle={
            { 
                backgroundColor: colors.white,
                borderRadius: 50,
                height: 42,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 18
            }
        }    
        inputStyle={{
            fontFamily: 'Mukta-Regular',
            paddingTop: 0,
            paddingBottom: 0
        }}    
        onChangeText={text => this.searchFilterFunction(text)}
        value={this.state.searchInput}
        autoCorrect={false} 
      />    
    );  
  }

  filterList(text) {
    //   console.log(text)
    // const copy = state.source;
    // console.log(this.state)

    const copy = this.state.listSource;
    const newState = copy.filter(item => {
        // console.log(text)
        return item.name.indexOf(text) > -1;
    });

    this.setState({
        listfiltered: newState
    })
  }

  searchFilterFunction = text => {
    this.setState({searchInput: text})
    // console.log(text)
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
    titleContainer: {
        width: '80%',
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'relative',
    },
    maintitle: {
        fontSize: 48,
        fontFamily: 'Mukta-Bold',     
        color: colors.bronzetone ,
        marginTop: 18
    },
    cloud: {
        position: 'absolute',
        bottom: 24,

    },
    headerContainer: {
        position: 'relative',
        height: 180,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.goldenTainoi
    },
    header: {
        position: 'absolute',
        // left: 0,
        bottom: 0,
    },
    container: {
      flex: 1,
      position: 'relative'
    },  
    flatview: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 2,
    //   borderBottomWidth: 1,
    //   borderBottomColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
    //   paddingRight: 20,
    //   paddingLeft: 20,
      flexDirection: 'row',
    //   fontFamily: 'Mukta-Regular'
    },
    infos: {
      flex: 2,
      justifyContent: 'center'
    },
    area: {
      fontSize: 18,
      fontFamily: 'Mukta-Regular',     
      color: colors.goldenTainoi 
    },
    name: {
      fontFamily: 'Mukta-Bold',      
      fontSize: 24,
      color: colors.bronzetone,
    },
    arrowContainer: {
        paddingLeft: 25
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



const CompletionStackNavigator = createStackNavigator({
    Completion: {
        screen: Completion,
    },
    Detail: {
        screen: Detail
    }

}); 

const Container = createAppContainer(CompletionStackNavigator)

// export default Completion;
export default Container;
// export default connect(mapStateToProps, { filterList })(Completion);