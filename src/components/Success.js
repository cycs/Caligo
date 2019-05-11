import React, { Component } from 'react';
import {FlatList, StyleSheet, Text, View, Button, Image, Dimensions, TouchableOpacity } from 'react-native';
import Map from 'Map';
import { connect } from 'react-redux';
import { polygon } from '@turf/helpers';
import area from '@turf/area';
import { SearchBar } from 'react-native-elements';
import { filterList } from '../actions';
import colors from './utils/colors'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import SuccessItem from './Success-item'
import Modal from "react-native-modal";

import { store } from '../components/Store';


import SearchIcon from '../img/search-icon.svg';
import CloudHeader2 from '../img/header-completion.svg';

export default class Success extends Component {
    
static navigationOptions = ({ navigation }) => {
    return {
        header: null
    };
}

  constructor(props: Props) {
    super(props);

    
    this.state = {
        isVisible: false,
        successData: null,
        searchInput: '',
        listSource: [],
        listfiltered: [],
        allSuccess: [],
    }

    this.listholder = this.props.list


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
  }


  componentDidUpdate(prevProps, prevState) {
  }

  render() {
      const {height, width} = Dimensions.get('window');
      const ratio = width / 3.333;
      const { navigate } = this.props.navigation;
      const numColumns = 3
      const unlockedSuccesses = this.state.listSource.filter(el => el.isUnlocked)

    return (
      <View style={completionStyles.container}>
            <View style={completionStyles.headerContainer}>
                <CloudHeader2 style={completionStyles.header} width={width} height={ratio} bottom={0} fill={colors.white}/>
                {this.searchList()}
                <View style={completionStyles.titleContainer}>
                    {/* <Text> */}
                        <Text style={completionStyles.maintitle}>Succès</Text>
                    {/* </Text> */}
                </View>
            </View>
            <View style={completionStyles.infos}>
                <Text style={completionStyles.score}>Succès débloqués</Text>
                <Text style={completionStyles.score}>{unlockedSuccesses.length} / {this.state.listSource.length}</Text>
            </View>
            <FlatList
                data={this.sortList(this.state.listfiltered)}
                numColumns={numColumns}
                renderItem={({item}) => {
                return (
                    <SuccessItem item={item} openModal={() => {this.toggleModal(item)}}/>
                    )
                }}
                keyExtractor={(item, i) => item.id || i.toString()}
            />
            <Modal 
                isVisible={this.state.isVisible} 
                coverScreen={false}
                onBackButtonPress={() => this.setState({isVisible: false})}
                onBackdropPress={() => this.setState({isVisible: false})}
                >
                <View style={{ flex: 1}}>
                    {this.renderModal()}
                </View>
            </Modal>
      </View>
    );
  }

  /* Methods
  --------------------------------------------------------- */
  toggleModal = (item) => {
      console.log(item);
    this.setState({ 
        isVisible: !this.state.isVisible,
        successData: item
    });
    
}

  renderModal = () => {
        if (this.state.successData !== null) {
            const data = this.state.successData
            console.log(data)
            return (
                <View style={completionStyles.modal}>
                    <Text style={completionStyles.modalContent}>{data.name}</Text>
                    <Text style={completionStyles.modalContent}>{`${data.percentage.toFixed(1)}% exploré`}</Text>
                </View>
            );
        }

        return (<View><Text>No data</Text></View>)     
    }

  getList() {
      console.log('TIS PROPS GET LIST', store.getState())
    const list = store.getState().communes.communes.features.map((commune, i) => {
      return this.getArea(commune, i);
    });

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


  return {
      id: feature.id,
      key: feature.id,
      area: newArea,
      explored,
      percentage,
      name,
      SHN: feature.properties.SHN,
      isUnlocked: percentage >= 1
  }
}

  sortList(list) {
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
            paddingBottom: 0,
            flex: 1
        }}    
        onChangeText={text => this.searchFilterFunction(text)}
        value={this.state.searchInput}
        autoCorrect={false} 
      />    
    );  
  }

  filterList(text) {
    const lowerText = text.toLowerCase()
    const copy = this.state.listSource
    const unlockedItems = ['déverouillé', 'débloqué', 'debloque', 'disponible', 'dispo']
    const lockedItems = ['verrouillé', 'bloqué', 'bloque', 'indisponible', 'indispo']

    const newState = copy.filter(item => {
        const isUnlocked = unlockedItems.includes(lowerText)
        const isLocked = lockedItems.includes(lowerText)
        const name = item.name.toLowerCase()
        return name.indexOf(lowerText) > -1 || item.isUnlocked === isUnlocked || item.isLocked === !isLocked;
    });

    this.setState({
        listfiltered: newState
    })
  }

  searchFilterFunction = text => {
    this.setState({searchInput: text})
    this.filterList(text)

  }

}

/* STYLES
---------------------------------------------------------------------------------------------------- */

const completionStyles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      modalContent: {
        fontSize: 20,
        marginBottom: 12,
      },
    titleContainer: {
        width: '80%',
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        // alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    maintitle: {
        fontSize: 48,
        fontFamily: 'Mukta-Bold',     
        color: colors.bronzetone,
        marginTop: 20
    },
    score: {
        fontFamily: 'Mukta-Light',
        fontSize: 18,
    },
    cloud: {
        position: 'absolute',
        bottom: 24,

    },
    headerContainer: {
        position: 'relative',
        height: 180,
        alignItems: 'center',
        backgroundColor: colors.goldenTainoi
    },
    header: {
        position: 'absolute',
        bottom: 0,
    },
    container: {
      flex: 1,
      position: 'relative'
    },  
    infos: {
        width: '80%', 
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    flatview: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      display: 'flex',
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      flexDirection: 'row',
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
