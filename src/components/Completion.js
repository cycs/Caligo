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
import Filter from './Filter'
import CompletionItem from './completion-item'
import Modal from "react-native-modal";

import { store } from '../components/Store';

import Arrow from '../img/arrow-right.svg';
import SearchIcon from '../img/search-icon.svg';
import Cloud from '../img/cloud.svg';
import HeaderBG from '../img/header-list.svg';
import CloudHeader from '../img/cloud-header.svg';
import CloudHeader2 from '../img/header-completion.svg';
// import HeaderBG from '../img/header-list-cloudy.svg';
import Header from './Header'

class Completion extends React.Component {
    
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
      };
    }
  constructor(props) {
    super(props);

    
    this.state = {
        filter: 'alpha',
        searchInput: '',
        listSource: [],
        listfiltered: [],
        isModalVisible: false,
        isFetching: false
    }

    this.listholder = this.props.list

    this.listSource = []
    this.listfiltered = []
  }

  /* Lifecycle Methods
  --------------------------------------------------------- */
  componentDidMount() {
    store.subscribe(() => {
        // this.setState({listSource: this.getList()})
        this.filterList(this.state.searchInput)
    })

      this.setState({
        //   listSource: this.getList(),
        //   listfiltered: this.getList(),
        })

        this.listSource = this.getList()
        this.listfiltered = this.getList()

  }

  render() {
      const {height, width} = Dimensions.get('window');
      const ratio = width / 3.333;
      const { navigate } = this.props.navigation;

    return (
      <View style={completionStyles.container}>
            <Header text='Progression'/>
            <View style={{
                // backgroundColor: 'green',
                width: '80%',
                marginRight: 'auto', 
                marginLeft: 'auto', 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 24
                }}
            >
                {this.searchList()}
                <Filter onPress={() => this.setState({ isModalVisible: true })}/>
            </View>
            <FlatList
                // ItemSeparatorComponent={this.renderSeparator}
                // extraData={this.state}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isFetching}
                data={this.sortList(this.listfiltered, this.state.filter)}
                renderItem={({item}) => {
                    // const percent = `${item.percentage.toFixed(2)}%`;
                    // const percent = `${item.percentage}%`;
                    // const newArea = `${Math.round(item.area / 1000000)} km²`
                return(
                    <CompletionItem item={item} goto={() => navigate('Detail', { item })}/>
                    )
                }}
                extraData={this.state.filter}
                keyExtractor={(item, i) => item.id || i.toString()}
            />
            <Modal 
                style={{elevation: 3}}
                isVisible={this.state.isModalVisible} 
                // coverScreen={false}
                onBackButtonPress={() => this.setState({isModalVisible: false})}
                onBackdropPress={() => this.setState({isModalVisible: false})}
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
    onRefresh() {
        this.setState({ isFetching: true }, function() { this.fetchData() });
    }

    fetchData() {
        this.listfiltered = store.getState().communes.communes.features.map((commune, i) => {
            return this.getArea(commune, i);
        });

        this.setState({ isFetching: false });
    }

    renderModal = () => {
        return (
            <View style={completionStyles.modal}>
                <Text style={completionStyles.modalTitle}>Trier par</Text>
                <View style={completionStyles.modalContentContainer}>
                <TouchableOpacity onPress={() => {
                    this.setState({ isModalVisible: false, filter: 'alpha' })
                    // this.sortList(this.state.listfiltered, this.state.filter)
                    }}>
                    <Text style={completionStyles.modalContent}>A-Z</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({ isModalVisible: false, filter: 'exploration' })
                    }}>
                    <Text style={completionStyles.modalContent}>Exploration (m²)</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.setState({ isModalVisible: false, filter: 'percentage' })
                    }}>
                    <Text style={completionStyles.modalContent}>Exploration (%)</Text>
                </TouchableOpacity>
                </View>
            </View>
        );
    }

  getList() {
    //   console.log('TIS PROPS GET LIST', store.getState())
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

  sortList(list, method = 'alpha') {
    if(list.length == 0) return false;

    let newList = []

    if(method == 'alpha') {
        newList = list.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            
            return 0;
        });
    } else if (method == 'exploration') {
        newList = list.sort((a, b) => {
            console.log(a)
            if (a.explored < b.explored) return 1;
            if (a.explored > b.explored) return -1;

            if (a.explored == b.explored) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
            }
            
            return 0;
        });
    } else if (method == 'percentage') {
        newList = list.sort((a, b) => {
            if (a.percentage < b.percentage) return 1;
            if (a.percentage > b.percentage) return -1;

            if (a.percentage == b.percentage) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
            }
            
            return 0;
        });
    }

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
                // elevation: 2,
                paddingBottom: 0,
                paddingTop: 0,
                paddingLeft: 0,
                paddingRight: 0,
                // bottom: 24,
                width: '80%',
                // flex: 1
                
            }
        }        
        inputContainerStyle={
            { 
                backgroundColor: colors.oldLaceDark,
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

    const copy = this.listSource;
    const newState = copy.filter(item => {
        return item.name.indexOf(text) > -1;
    });

    this.listfiltered = newState
  }

  searchFilterFunction = text => {
    this.setState({searchInput: text})
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
      position: 'relative',
      backgroundColor: colors.oldLace,
    },  
    flatview: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 2,
      display: 'flex',
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      flexDirection: 'row',
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
    },
    modal: {
        backgroundColor: colors.oldLace,
        elevation: 3,
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      modalTitle: {
        fontFamily: 'Mukta-Bold',
        color: colors.bronzetone,
        fontSize: 24
      },
      modalContentContainer: {
        marginTop: 24,
        alignItems : 'center'
      },
      modalContent: {
        color: colors.bronzetone,
        paddingTop: 12,
        paddingBottom: 12,
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

}, {cardStyle: { backgroundColor: colors.oldLace }}); 

const Container = createAppContainer(CompletionStackNavigator)

// export default Completion;
export default Container;
// export default connect(mapStateToProps, { filterList })(Completion);