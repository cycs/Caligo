import React, { Component } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import { signOut } from '../components/utils/loginUtils'
import { withApollo } from 'react-apollo'
import { Button } from 'react-native-elements'
import colors from '../components/utils/colors'
import Header from './Header'
import { store } from '../components/Store';
import { polygon } from '@turf/helpers';
import area from '@turf/area';

class Profile extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            nickname: null,
            email: null,
            totalExplored: 0
        }
    }
    
    /* Lifecycle methods
    --------------------------------------------------------- */
    componentDidMount() {
        this.totalArea = store.getState().communes.communes.features.reduce((acc, val) => {
            const values = this.getArea(val)
            return acc + values
        }, 0)

        const totalExplored = store.getState().communes.communes.features
            .filter((commune) => commune.id)
            .reduce((acc, val) => {
                const values = this.getAreaExplored(val)

                return acc + values
            }, 0)

        this.setState({ totalExplored })

        this.props.navigation.setParams({
            client: this.props.client
        })

        AsyncStorage.getItem('USER_EMAIL').then(email => {
            this.setState({ email })
        })

        AsyncStorage.getItem('USER_NAME').then(nickname => {
            if (!nickname) return false;
            this.setState({ nickname })
        })

    }

  render() {
    return (
      <View style={styles.container}>
        <Header text='Profil'/>
        <View style={styles.content}>
            <View style={styles.infos}>
                {this.state.nickname && <Text style={styles.name}>{this.state.nickname}</Text>}
                {this.state.email && <Text style={styles.email}>{this.state.email}</Text>}
            </View>
            <View style={styles.infos}>
                {<Text style={styles.name}>Total exploré</Text>}
                {/* {<Text style={styles.email}>{this.state.totalExplored}</Text>} */}
                {<Text style={styles.email}>{`${(this.state.totalExplored / 1000000).toFixed(4)} / ${Math.round(this.totalArea / 1000000)} km²`}</Text>}
            </View>
            <View style={styles.infos}>
                {<Text style={styles.name}>Pourcentage total</Text>}
                {<Text style={styles.email}>{`${(this.state.totalExplored / this.totalArea * 100).toFixed(5)}%`}</Text>}
            </View>
            <Button
                onPress={() => {
                    signOut();  
                    this.props.navigation.getParam('client').resetStore();    
                }}
                title="Déconnexion"
                buttonStyle={
                    {
                        width: 160,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        borderRadius: 6,
                        backgroundColor: colors.selectiveYellow,
                    }
                }
                titleStyle={
                    {
                        fontFamily: 'Mukta-Bold',
                        fontSize: 16,
                        color: colors.bronzetone
                    }
                }
                />
            </View>
      </View>
    )
  }

  /* Methods
  --------------------------------------------------------- */
   getArea(feature) {
        if (
            feature.properties.SHN == "BE421009" ||
            feature.properties.SHN == "BE213002" ||
            feature.properties.SHN == "BE233016"
            )  { 
                return parseFloat(feature.properties.Shape_Area) * 10000000000
            }

        let newPolygon = feature.geometry.coordinates[0];
        let _area = 0;
        
        if (feature.geometry.coordinates.length > 1) {
            const polygonArea = polygon([feature.geometry.coordinates[1]]);
            _area = area(polygonArea);
        } else {
            const polygonArea = polygon([feature.geometry.coordinates[0]]);
            _area = area(polygonArea);
        }

        return _area

    }

    getAreaExplored(feature) {
        if (
            feature.properties.SHN == "BE421009" ||
            feature.properties.SHN == "BE213002" ||
            feature.properties.SHN == "BE233016"
            )  { return 0 }

        let newPolygon = feature.geometry.coordinates[0];
        let explored = 0;
        
        if (feature.geometry.coordinates.length > 1) {
            newPolygon = feature.geometry.coordinates[1]
            
            const  polygonExplored = polygon([feature.geometry.coordinates[0]]);
            explored = area(polygonExplored);
        }

        return explored

    }
}

const styles = {
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: colors.oldLace
    },
    content: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'column',
        flex: 1,
        paddingBottom: 30,
        justifyContent: 'space-between'
    },
    infos: {
        flexDirection: 'column'
    },
    name: {
        fontFamily: 'Mukta-Bold',
        color: colors.bronzetone,
        fontSize: 26,
    },
    email: {
        fontFamily: 'Mukta-Regular',
        color: colors.bronzetone60,
        fontSize: 18
    }
}

export default withApollo(Profile)