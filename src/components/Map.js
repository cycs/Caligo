/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Image, PermissionsAndroid, AsyncStorage} from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
// import {name as appName} from './app.json';
// import communesJSON from './communes-belges.json';
import communesJSON from '../../Communes-belgique.json';
// import communesJSON from '../../communes-minify.json';
import markersJSON from '../../markers.json';
import { request } from 'graphql-request'
import { store } from '../components/Store';


// import * as turf from '@turf/turf';
import circle from '@turf/circle';
import mask from '@turf/mask';
import intersect from '@turf/intersect';
import union from '@turf/union';
import pointOnFeature from '@turf/point-on-feature';
import buffer from '@turf/buffer';
import area from '@turf/area';
import bbox from '@turf/bbox';
import lineToPolygon from '@turf/line-to-polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import booleanContains from '@turf/boolean-contains';
import { point, polygon, lineString, multiPolygon } from '@turf/helpers';

import update from 'immutability-helper';
import PositionButton from './PositionButton';
import CreateCommunes from '../graphql/createCommunes';
import Completion from './Completion';
import Point from './interest/points'
import Loading from './utils/Loading'

import markerMyPosition from '../img/marker.png';
import { connect } from 'react-redux';
import colors from '../components/utils/colors'
import pattern from '../img/pattern-marble.png'
import Modal from "react-native-modal";

import { markersUpdate, communesUpdate, communesCompletion, fetchData } from '../actions';
import OfflineNotice from './utils/OfflineNotice'

import Queries from './queries';
import Municipalities from './Municipalities'


Mapbox.setAccessToken('sk.eyJ1IjoiY3ljcyIsImEiOiJjanY1YnJueXcxMTdvM3lvNzlwMnN4NWpwIn0.VWoC5NPRh6Kz2vCHrrvVjA')

class Map extends Component {
    constructor(props) {
        super(props);

        /* State
        --------------------------------------------------------- */
        this.state = {
          userId: null,
          maskWU: {},
          oldArea: {},
          markers: [],
          markerData: null,
          bonusRevealedData: null,
          isModalVisible: false,
          isModalPoIVisible: false,
          disabled: false,
          active: true,
          communes: communesJSON,
          centerCoordinate: {
              position: [5.3954002323, 50.7111308907],
              namur: [4.856387665236815, 50.465550770154636],
              crisnee: [5.3954002323, 50.7111308907],
            },
          region: {
            latitude: 50.465550770154636,
            longitude: 4.856387665236815,
            latitudeDelta: 1,
            longitudeDelta: 1,
            zoom: 13
          },
          shape: {
            geometry: {
              coordinates: [
                [5.382935, 50.718891],
                [5.384021, 50.708001],
                [5.398954, 50.707345],
                [5.401883, 50.719410],
                [5.382935, 50.718891],
              ]
            }
          },
          travel: [
              [5.387673, 50.721482],
              [5.388517, 50.720345],
              [5.388662, 50.719109],
              [5.389088, 50.718415],
              [5.389497, 50.718158],
              [5.393117, 50.716551],
              [5.393343, 50.716556],
              [5.394326, 50.717022],
              [5.394662, 50.717020],
              [5.395222, 50.716653],
              [5.395646, 50.716702],
              [5.396258, 50.716357],
              [5.396775, 50.716238]
            ],
            lastPosition: {
              coords: {
                latitude: 50.4653347531125,
                longitude: 4.856899587862423
              }
            },
            unionRect: {
                one: [
                    [4.861013, 50.467482],
                    [4.863738, 50.467523],
                    [4.863888, 50.465447],
                    [4.861077, 50.466321],
                    [4.861013, 50.467482],
                ],
                two: [
                    [4.871870, 50.466799],
                    [4.876184, 50.467194],
                    [4.876762, 50.464121],
                    [4.871977, 50.463971],
                    [4.871870, 50.466799],
                ]
            }
        };
        




        /* Properties
        --------------------------------------------------------- */
        this.shapeSourceParams = {
            tolerance: 0
        }

        this.mask = {
            geometry: {
                coordinates: [
                    [5.382935, 50.718891],
                    [5.384021, 50.708001],
                    [5.398954, 50.707345],
                    [5.401883, 50.719410],
                    [5.382935, 50.718891],
                ]
            }
        }




        /* Bindings
        --------------------------------------------------------- */

        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.onRegionWillChange = this.onRegionWillChange.bind(this);
        this.onDidFinishRenderingFrameFully = this.onDidFinishRenderingFrameFully.bind(this);
        this.flyToCurrentPosition = this.flyToCurrentPosition.bind(this);
        this.onPressMarker = this.onPressMarker.bind(this);
    }


    async requestLocationPermission(){
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Caligo',
              'message': "Caligo a besoin d'un accès GPS"
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('getcurrent');
                this.setState({ 
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp:  position.timestamp,
                    centerCoordinate: { position: [position.coords.latitude, position.coords.longitude] }
                })
                this.flyToCurrentPosition()
                },
                (error) => {  },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
            )

            this.watchPosition = navigator.geolocation.watchPosition(
                (lastPosition) => {
                    const position = [lastPosition.coords.longitude, lastPosition.coords.latitude]

                    const thisPos = [Math.round(parseFloat(position[0]) * 1000), Math.round(parseFloat(position[1]) * 1000)]
                    const lastPos = [Math.round(parseFloat(this.state.lastPosition.coords.longitude) * 1000), Math.round(parseFloat(this.state.lastPosition.coords.latitude) * 1000)]

                    this.setState({lastPosition, centerCoordinate: { position: lastPosition }})

                    if(thisPos[0] === lastPos[0] && thisPos[1] === lastPos[1]) return false
                    
                    const activeBonus = this.getActiveBonus().then(res => {
                        this.drawCircle(res, position)
                    })
                },
                (error) => { },
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000, distanceFilter: 10}
            );
          } else {
            // console.log("location permission denied")
          }
        } catch (err) {
        //   console.warn(err)
        }
      }

    /* Lifecycle methods
    --------------------------------------------------------- */

    async componentDidMount() { 
        this.props.fetchData()
        AsyncStorage.getItem('USER').then((userId) => this.setState({userId}))
        await this.requestLocationPermission()
    }

    componentWillReceiveProps(newProps) {
        if(this.state.markers.length == 0) {
            this.generateMarkers(newProps);
        }
      }

    componentWillUnmount() {
        // console.log("will unmount")
        const {newMask, i, id} = this.state.maskWU
        this.props.communesUpdate(newMask, i, id, true)
        // this.props.communesCompletion(newMask, i)
    }

    
    render() {
        if (this.props.loading) {
            return (
                <Loading />
            )
        }
        // const communesShape = this.props.communes.features.map((commune, i) => {
        //     return (
        //         <View key={commune.properties.SHN}>
        //             <Mapbox.ShapeSource key={commune.properties.SHN} id={commune.properties.SHN} shape={commune.geometry} tolerance={this.shapeSourceParams.tolerance}>
        //                 <Mapbox.FillLayer id={commune.properties.SHN} style={{ fillColor: colors.oldLace, fillOutlineColor: colors.bronzetone }} />
        //                 {/* <Mapbox.FillLayer  id={commune.properties.SHN} style={{ fillPattern: require('../img/pattern512.png') }} /> */}
        //             </Mapbox.ShapeSource>            
        //         </View>)
        // })

    const listPoints = [];        

        return (
            <View style={styles.container}>
                {/* <Text>lat: {this.state.latitude}, lon: {this.state.longitude}</Text> */}
                {/* <Text>Last Position: [lat : {this.state.lastPosition ? this.state.lastPosition.coords.latitude : ''}, lon: { this.state.lastPosition ? this.state.lastPosition.coords.longitude : '' }]</Text> */}
                {/* <CreateCommunes/> */}
                <Mapbox.MapView 
                    ref={(c)=> this._map = c}
                    styleURL={'mapbox://styles/cycs/cjv5es9ui1tv91ftgut7t84bk'} 
                    attributionEnabled={false}
                    zoomLevel={13} 
                    centerCoordinate={this.state.centerCoordinate.namur} 
                    style={styles.container}
                    logoEnabled={false}
                    rotateEnabled={false}
                    onDidFinishRenderingMapFully={this.onDidFinishRenderingMapFully}
                    onRegionIsChanging={this.onRegionIsChanging}
                    onRegionDidChange={this.onRegionDidChange}
                    onDidFinishRenderingFrameFully={this.onDidFinishRenderingFrameFully}
                    onRegionWillChange={this.onRegionWillChange}
                    onPress={this.onPressMarker}

                >
                    <Municipalities municipalities={this.props.communes.features}/>
                    {/* {communesShape} */}
                    <Mapbox.ShapeSource
                        id={`pointOfInterests`}
                        shape={{
                            type: 'FeatureCollection',
                            features: this.state.markers,
                          }}
                        cluster={true}
                        clusterMaxZoomLevel={14}
                        clusterRadius={50}
                    >
                        <Mapbox.SymbolLayer id="pointCount" style={mbStyles.clusterCount}/>

                        <Mapbox.CircleLayer
                            id='clusteredPoints'
                            belowLayerID="pointCount"
                            style={mbStyles.clusterPoI}
                            filter={['has', 'point_count']}
                        />
                        <Mapbox.CircleLayer
                            id="singlePoI"
                            filter={['all', ['!has', 'point_count']]}
                            style={mbStyles.singlePoI}  
                        />
                    </Mapbox.ShapeSource>

                    {this.showPosition()}
                </Mapbox.MapView>
                <PositionButton disabled={this.state.disabled} isRipple onPress={this.flyToCurrentPosition.bind(this)} rippleColor={colors.goldenTainoi}>
                    <Image
                        source={require('../img/flytocurrentposition.png')}
                        style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 25,
                        height: 25
                    }}/>
                </PositionButton>
                <Modal 
                    isVisible={this.state.isModalVisible} 
                    coverScreen={false}
                    onBackButtonPress={() => this.setState({isModalVisible: false})}
                    onBackdropPress={() => this.setState({isModalVisible: false})}
                    >
                    <View style={{ flex: 1}}>
                        {this.renderModal()}
                    </View>
                </Modal>
                <Modal 
                    isVisible={this.state.isModalPoIVisible} 
                    coverScreen={false}
                    onBackButtonPress={() => this.setState({isModalPoIVisible: false})}
                    onBackdropPress={() => this.setState({isModalPoIVisible: false})}
                    >
                    <View style={{ flex: 1}}>
                        {this.renderBonusRevealedModal()}
                    </View>
                </Modal>
                <OfflineNotice />
            </View>
        );
    }




    /* Methods
    --------------------------------------------------------- */
    generateMarkers = (props = this.props) => {
        if (props.loading) return false;

        let PoI = null;

        if(store.getState().communes.markers.length > 0) {
            PoI = store.getState().communes.markers
        } else {
            PoI = markersJSON;
        }

        
        this.props.markersUpdate(PoI);

        this.setState({ markers: PoI });
    }

    async onPressMarker (e) {
        const { screenPointX, screenPointY, } = e.properties        
        const screenCoords = [screenPointX, screenPointY];

        const PoI = await this._map.queryRenderedFeaturesInRect(
            this.getBoundingBox(screenCoords),
            null,
            ['singlePoI'],
        )

        if (PoI.features.length == 1) {
            const markerData = PoI.features[0].properties

            this.setState({ markerData })
            this.toggleModal()
        }
    } 

    getBoundingBox(screenCoords) {
        const maxX = screenCoords[0] + 50
        const minX = screenCoords[0] - 50
        const maxY = screenCoords[1] + 50
        const minY = screenCoords[1] - 50

        return [maxY, maxX, minY, minX]
    }

    renderModal = () => {
        if (this.state.markerData !== null) {
            const data = this.state.markerData

            return (
                <View style={styles.modal}>
                    <Text style={styles.modalContentTitle}>{data.NAMN}</Text>
                    <Text style={styles.modalContentInfo}>{data.bonus.name}</Text>
                </View>
            );
        }

        return (<View><Text>No data</Text></View>)     
    }

    renderBonusRevealedModal = () => {
        if (this.state.bonusRevealedData !== null) {

            const data = this.state.bonusRevealedData
            return (
                <View style={styles.modal}>
                    <Text style={styles.modalContent}>Bonus débloqué !</Text>
                    <Text style={styles.modalContent}>{data.bonus.name}</Text>
                </View>
            )
        }

        return (<View><Text>No data</Text></View>)     
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    toggleModalPoI = (properties) => {
        this.setState({ 
            bonusRevealedData: properties,
            isModalPoIVisible: !this.state.isModalPoIVisible 
        });
    }

    
    isBonusRevealed(SHN, position, circ) {
        const markersFiltered = this.state.markers.filter(marker => {
            if (marker.properties.SHN === SHN) {
                const isInCircle = booleanPointInPolygon(marker.geometry.coordinates, circ);

                if (isInCircle) {
                    this.toggleModalPoI(marker.properties)
                    this.storeBonus(marker.properties.bonus.id)
                }

                return !isInCircle;
            }

            return true;
        })

        this.props.markersUpdate(markersFiltered);
        this.setState({ markers: markersFiltered })

    }

    async storeBonus(id) {
        let activeBonus = await this.getActiveBonus()
        let expiration = null
        let now = new Date()
        let mutiplier = 1
        let duration = 0

        if(activeBonus) {
            const bonus = JSON.parse(activeBonus)
            now = new Date(bonus.expiration)
        }


        switch(id) {
            case 1:
                expiration = now.setDate(now.getDate() + 30)
                mutiplier = 2
            break;
            case 2: 
                expiration = now.setDate(now.getDate() + 10)
                mutiplier = 2
            break;
        }

        const value = { expiration, mutiplier }
        const data = JSON.stringify(value)

        try {
            await AsyncStorage.setItem('activeBonus', data);
        } catch (error) {
            // console.log(error)
        }
    }
    
    async getActiveBonus() {
        try {
          return AsyncStorage.getItem('activeBonus');
        } catch (error) {
        //   console.log(error)
        }

        return false
    }

    drawCircle(activeBonus, position) {        
        if (this.props.loading) return false; // prevents drawing before list of municipalities has been loaded
        // try {
            // console.log(AsyncStorage.getItem('USER').then(data => console.log(data)))
            // const position = [this.state.lastPosition.coords.longitude, this.state.lastPosition.coords.latitude]

            const center = [ ...position ]
            const radius = activeBonus ? 0.1 : 0.05
            // console.log(activeBonus, radius)
            const options = {steps: 64, units: 'kilometers'}

            let newCircle = circle(center, radius, options)
            const circlePoI = Object.assign({}, newCircle)

            // this.props.communes.features.map((commune, i) => {
                // const
            for(let i = 0; i < this.props.communes.features.length; i++) {
                const commune = this.props.communes.features[i]
                const isInPolygon = this.isPositionInPolygon(newCircle, commune)
                // this.isGeometryCollection(commune);
                if (isInPolygon) {
                    let coords = commune.geometry.coordinates[0]
                    let oldAreaUphold = 0;

                    if (commune.geometry.coordinates.length === 2) { // if 2 arrays, then the first is a mask
                        coords = commune.geometry.coordinates[1];
                        const actualMask = polygon([commune.geometry.coordinates[0]]);

                        oldAreaUphold = area(actualMask)

                        const intersection = intersect(actualMask, newCircle);

                        newCircle = intersection ? this.unionPolygons(actualMask, newCircle) : this.unionMultiPolygons(actualMask, newCircle);
                    }

                    const poly1 = polygon([coords]);
                    const newMask = mask(poly1, newCircle);
        
                    const newArea = area(newCircle);
                    

                    newMask.properties.SHN = commune.properties.SHN
                    newMask.properties.NAMN = commune.properties.NAMN

                    if (commune.id) {
                        newMask.id = commune.id;
                        
                        const id = commune.id;
                        const oldAreaUpdated = this.state.oldArea[id] ? this.state.oldArea[id] : oldAreaUphold 

                        const mustUpdate = newArea - oldAreaUpdated > 50000 // If area diff is < 50m³, then no mutation
                        if(mustUpdate || !this.state.oldArea[id]) {
                            const oldArea = Object.assign({}, this.state.oldArea)
                            oldArea[id] = newArea
                            this.setState({ oldArea })
                        }

                        const maskWU = {newMask, i, id}
                        this.setState({ maskWU }) // Will unmount update 
                        
                        this.props.communesUpdate(newMask, i, id, mustUpdate);
                        // this.props.communesCompletion(newMask, i);
                        this.isBonusRevealed(commune.properties.SHN, position, circlePoI)
                    } else {
                        const mutation = `
                            mutation createMunicipality($data: String!, $id: ID!) {
                                createMunicipality(data: $data, userId: $id) { id }
                            }`

                        const stringCommune = JSON.stringify(commune);

                        const newVariables = {
                            id: this.state.userId,
                            data: stringCommune,
                        };

                        request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', mutation, newVariables).then((newData) => {
                            newMask.id = newData.createMunicipality.id;
                    
                            const id = newData.createMunicipality.id;
    
                            this.props.communesUpdate(newMask, i, id);
                            // this.props.communesCompletion(newMask, i);
                            this.isBonusRevealed(commune.properties.SHN, position, circlePoI)
                        });


                    }

                }
            }
        // } catch (err) {
        //     console.log(err);
        //     return false
        // }

    }

    unionPolygons(poly1, poly2) {
        const newUnion = union(poly1, poly2);

        return newUnion;
    }

    unionMultiPolygons(poly1, poly2) {
        this.bufferDistance =  0.000001 //in kilometers
          
        const pointOnPolygon1 = pointOnFeature(poly1);
        const pointOnPolygon2 = pointOnFeature(poly2);

        const line = [pointOnPolygon1.geometry.coordinates, pointOnPolygon2.geometry.coordinates];
        const newLinestring = lineString(line);
        const buffered = buffer(newLinestring, this.bufferDistance); //transform a line into a rectangle

        var newUnion = union(buffered, poly1, poly2);

        return newUnion;
    }

    isPositionInPolygon(circle, commune) {
        if (commune.properties.SHN == "BE421009" 
            || commune.properties.SHN == "BE213002" 
            || commune.properties.SHN == "BE233016"
            || commune.properties.SHN == "BE325068"
            || commune.properties.SHN == "BE363023"
            ) return false;

        let newPolygon = commune.geometry.coordinates.length == 2 ? polygon([commune.geometry.coordinates[1]]) : commune;
        
        
        try {
            const intersection = intersect(circle, newPolygon);
            const contains = booleanContains(newPolygon, circle);

            return intersection !== null || contains;
        } catch(err) {
            return false
        }
    }

    isGeometryCollection(commune) {
        return this.isGC = commune.geometry.type === "GeometryCollection"; 
    }

    async flyToCurrentPosition() {
        this.setState({ 
            disabled: true
        })

        const position = [this.state.lastPosition.coords.longitude, this.state.lastPosition.coords.latitude];

        let flyTo = new Promise((resolve, reject) => {
            this._map.flyTo(position, 4000); 
            setTimeout(() => resolve(), 4000)
        });

        await flyTo;
        
        this.setState({ 
            disabled: false
        })
    }

    showPosition() {
        let shapePoint = point([this.state.lastPosition.coords.longitude, this.state.lastPosition.coords.latitude]);
        return (
          <Mapbox.ShapeSource
            id='exampleShapeSource'
            shape={shapePoint}
          >
            <Mapbox.CircleLayer
              id="singlePoint"
              style={mbStyles.singlePoint}
            />
          </Mapbox.ShapeSource>
        );
    }

    getList() {

        const list = this.props.communes.features.map((commune) => {
        return this.getArea(commune);
      });
  
      return list;
    }

    getArea(feature) {
        if (
            feature.properties.SHN == "BE421009" ||
            feature.properties.SHN == "BE213002" ||
            feature.properties.SHN == "BE233016"
            )  {
            return {area: 0, explored: 0, percentage: 0, name: feature.properties.NAMN}
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
        
        return {
            area: newArea,
            explored,
            percentage
        }
    }

    async onPressPathMask() {
        // console.log('PATH TO MASK');

        const communesShape = await this.state.communes.features.map((commune, i) => {
            if(commune.properties.NAMN == 'Crisnée'){
                const poly1 = polygon([commune.geometry.coordinates[0]]);

                const line = lineString(this.state.travel);
                const newPolygon = lineToPolygon(line);

                const NewMultiPolygon = multiPolygon(this.state.travel);

                const newMask = mask(poly1, NewMultiPolygon);
    
                mask.properties.SHN = commune.properties.SHN
    
                commune = newMask;
    
                this.setState({
                    communes: update(this.state.communes, {
                        features: {
                            [i]: {$set: newMask}
                        }
                    })
                  });
            }
        })
    }
    
    async onPressMaskMap() {
        const communesShape = await communesJSON.features.map((commune, i) => {
            if(commune.properties.NAMN == 'Crisnée'){
                var poly1 = polygon([commune.geometry.coordinates[0]]);
                var poly2 = polygon([this.state.shape.geometry.coordinates]);
    
                var newMask = mask(poly1, poly2);
    
                newMask.properties.SHN = commune.properties.SHN
    
                commune = newMask;
    
                this.setState({
                    communes: update(this.state.communes, {
                        features: {
                            [i]: {$set: newMask}
                        }
                    })
                  });
            }
        })
    }

    onDidFinishRenderingMapFully() {
    }

    onRegionIsChanging() {
    }

    onDidFinishRenderingFrameFully() {
    }

    onRegionDidChange(data) {
        
        if (!this._map) return false;
        const lon = data.geometry.coordinates[0]
        const lat = data.geometry.coordinates[1]

        this.setState({ region : {
                latitude: lat,
                longitude: lon,
                latitudeDelta: 1,
                longitudeDelta: 1,
                zoom: data.properties.zoomLevel
            }
        })
    }

    async onRegionWillChange() {
    }
}





/* STYLES
---------------------------------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContentTitle: {
    color: colors.bronzetone,
    fontFamily:'Mukta-Bold',
    fontSize: 24,
    marginBottom: 12,
  },
  modalContentInfo: {
    color: colors.bronzetone60,
    fontFamily:'Mukta-Regular',
    fontSize: 16,
  },
});

const mbStyles = Mapbox.StyleSheet.create({
    communes: {
        // fillAntialias: false,
        // fillColor: 'rgba(251, 253, 255, 1)',
        fillOutlineColor: '#000',
      },
      icon: {
        iconImage: '{markerMyPosition}',
        iconSize: 1,
      },
      singlePoint: {
        circleColor: colors.goldenTainoi,
        circleOpacity: 1,
        // circleStrokeWidth: 2,
        // circleStrokeColor: colors.bronzetone,
        circleRadius: 10,
        circlePitchAlignment: 'map',
      },
      singlePoI: {
        visibility: 'visible',
        circleColor: colors.sanJuan,
        circleOpacity: 1,
        // circleStrokeWidth: 1,
        // circleStrokeColor: colors.white,
        circleRadius: 5,
        circlePitchAlignment: 'map',
      },
      clusterPoI: {
        circleColor: Mapbox.StyleSheet.source(
          [[2, colors.sanJuan]],
          'point_count',
          Mapbox.InterpolationMode.Exponential,
        ),      
          circleRadius: Mapbox.StyleSheet.source([
            [0, 10],
            [50, 15],
            [150, 20],
            [200, 25],
            [300, 30],
            [500, 40],
          ], 'point_count', Mapbox.InterpolationMode.Exponential),
        // circleStrokeWidth: 2,
        circleStrokeColor: 'white',
      },
      clusterCount: {
        textField: '{point_count}',
        textSize: 16,
        // textFont: ['Mukta-Regular'],
        textHaloColor: '#fff',
        // textHaloWidth: 0.3,
        textColor: '#fff',
      }
});


const mapStateToProps = state => {
    // console.log('MAPSTTE MAP', state)
    return ({
        communes: state.communes.communes,
        list: state.list,
        loading: state.communes.loading,
        error: state.communes.error,
    })
}

export default connect(mapStateToProps, { fetchData, communesUpdate, communesCompletion, markersUpdate })(Map);