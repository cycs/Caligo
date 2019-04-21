/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Image, PermissionsAndroid} from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
// import {name as appName} from './app.json';
// import communesJSON from './communes-belges.json';
import communesJSON from '../../Communes-belgique.json';


// import * as turf from '@turf/turf';
import circle from '@turf/circle';
import mask from '@turf/mask';
import intersect from '@turf/intersect';
import union from '@turf/union';
import pointOnFeature from '@turf/point-on-feature';
import buffer from '@turf/buffer';
import area from '@turf/area';
import lineToPolygon from '@turf/line-to-polygon';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon, lineString, multiPolygon } from '@turf/helpers';


import update from 'immutability-helper';
import PositionButton from './PositionButton';
import CreateCommunes from '../graphql/createCommunes';
import Completion from './Completion';
import TabsNavigator from './tabsNavigator';
import markerMyPosition from '../img/marker.png';
import { connect } from 'react-redux';
import colors from '../components/utils/colors'
import pattern from '../img/pattern-marble.png'

import { communesUpdate, communesCompletion, fetchData } from '../actions';

import Queries from './queries';


console.log('ACTIONS', { communesUpdate, communesCompletion })


Mapbox.setAccessToken('pk.eyJ1IjoiY3ljcyIsImEiOiJjanN1anA2OWYwMGZtNGJrN3Y0ejJqOXpiIn0.q5gDP42dUSpQrUY0FyJiuw')

class Map extends Component {
    constructor(props) {
        super(props);
        console.log(props)



        /* State
        --------------------------------------------------------- */
        this.state = {
          disabled: false,
          active: true,
          communes: communesJSON,
          centerCoordinate: {
              namur: [4.856387665236815, 50.465550770154636],
              crisnee: [5.3954002323, 50.7111308907],
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
        this.flyToCurrentPosition = this.flyToCurrentPosition.bind(this);
    }


    async requestLocationPermission(){
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Caligo',
              'message': 'Caligo access to your location '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location")
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                this.setState({ 
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    timestamp:  position.timestamp
                })
                },
                (error) => { console.log(error) },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
            )

            this.watchPosition = navigator.geolocation.watchPosition(
                (lastPosition) => {
                    // console.log(lastPosition);
                this.setState({lastPosition});
                this.drawCircle(lastPosition);
                },
                (error) => { console.log(error) },
                {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000, distanceFilter: 10}
            );
          } else {
            console.log("location permission denied")
          }
        } catch (err) {
          console.warn(err)
        }
      }

    /* Lifecycle methods
    --------------------------------------------------------- */

    async componentDidMount() {
        console.log("DID MOUNT");  
        console.log(this);  

        this.props.fetchData()
        await this.requestLocationPermission()
        
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("componentDidUpdate")
    }

    componentWillUnmount() {
        console.log("will unmount")
    }

    
    render() {
        if (this.props.loading) {
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loading}>loading...</Text>
                </View>
            )
        }
        console.log('HAS LOADED');

        const communesShape = this.props.communes.features.map((commune, i) => {
            return (
            <Mapbox.ShapeSource key={commune.properties.SHN} id={commune.properties.SHN} shape={commune.geometry} tolerance={this.shapeSourceParams.tolerance}>
                <Mapbox.FillLayer  id={commune.properties.SHN} style={{ fillColor: colors.oldLace }} />
                {/* <Mapbox.FillLayer  id={commune.properties.SHN} style={{ fillPattern: require('../img/pattern512.png') }} /> */}
            </Mapbox.ShapeSource>)
        })

        return (
            <View style={styles.container}>
                {/* <Text>lat: {this.state.latitude}, lon: {this.state.longitude}</Text> */}
                {/* <Text>Last Position: [lat : {this.state.lastPosition ? this.state.lastPosition.coords.latitude : ''}, lon: { this.state.lastPosition ? this.state.lastPosition.coords.longitude : '' }]</Text> */}
                {/* <CreateCommunes/> */}
                {/* <Button
                    onPress={this.onPressMaskMap.bind(this)}
                    title="Mask Map"
                    color="#441583"
                />
                <Button
                    // onPress={this.unionMultiPolygons.bind(this, this.state.unionRect.one, this.state.unionRect.two)}
                    onPress={this.getArea.bind(this, this.state.communes.features[314])}
                    title="Get area Namur"
                    color="#941584"
                /> */}
                <Mapbox.MapView 
                    ref={(c)=> this._map = c}
                    styleURL={Mapbox.StyleURL.Dark} 
                    attributionEnabled={false}
                    zoomLevel={12} 
                    centerCoordinate={this.state.centerCoordinate.namur} 
                    style={styles.container}
                    logoEnabled={false}
                    rotateEnabled={false}
                    onDidFinishRenderingMapFully={this.onDidFinishRenderingMapFully}
                    onRegionIsChanging={this.onRegionIsChanging}
                    onRegionDidChange={this.onRegionDidChange}
                    onDidFinishRenderingFrameFully={this.onDidFinishRenderingFrameFully}
                    onRegionWillChange={this.onRegionWillChange}
                >
                    {communesShape}
                    {this.showPosition()}
                </Mapbox.MapView>
                <PositionButton disabled={this.state.disabled} isRipple onPress={this.flyToCurrentPosition.bind(this)} rippleColor="hsl(217, 100%, 70%)">
                    <Image
                        source={require('../img/flytocurrentposition.png')}
                        style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: 25,
                        height: 25
                    }}/>
                </PositionButton>
            </View>
        );
    }




    /* Methods
    --------------------------------------------------------- */

    async drawCircle(state) {
        console.log('draw circle state', state);

        if (this.props.loading) return false; // prevents drawing before list of municipalities has been loaded

        const position = [this.state.lastPosition.coords.longitude, this.state.lastPosition.coords.latitude];

        const center = position;
        const radius = 0.05;
        const options = {steps: 64, units: 'kilometers'};

        let newCircle = circle(center, radius, options);

        const communesShape = await this.props.communes.features.map((commune, i) => {
            const isInPolygon = this.isPositionInPolygon(position, commune)
            this.isGeometryCollection(commune);

            if (isInPolygon) {
                let coords = commune.geometry.coordinates[0]

                if (commune.geometry.coordinates.length === 2) { // if 2 arrays, then the first is a mask
                    coords = commune.geometry.coordinates[1];

                    const actualMask = polygon([commune.geometry.coordinates[0]]);
                    const intersection = intersect(actualMask, newCircle);

                    newCircle = intersection ? this.unionPolygons(actualMask, newCircle) : this.unionMultiPolygons(actualMask, circle);
                }
                const poly1 = polygon([coords]);
                const newMask = mask(poly1, newCircle);
    
                newMask.properties.SHN = commune.properties.SHN
                newMask.properties.NAMN = commune.properties.NAMN
                newMask.id = commune.id;
                
                console.log(commune, newMask, this.state)
                const id = commune.id;

                this.props.communesUpdate(newMask, i, id);
                this.props.communesCompletion(newMask, i);
            }
        })
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

    isPositionInPolygon(position, commune) {
        if (commune.properties.SHN == "BE421009" || commune.properties.SHN == "BE213002" || commune.properties.SHN == "BE233016") return false;

        let newPolygon = commune.geometry.coordinates.length == 2 ? polygon([commune.geometry.coordinates[1]]) : commune;
        
        const newPoint = point(position);
        const isInMunicipality = booleanPointInPolygon(newPoint, newPolygon);

        return isInMunicipality;
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
        console.log('POSITION', this.state.lastPosition.coords);
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
        console.log("GET LIST", this.props)
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
        console.log('PATH TO MASK');

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
                console.log(this.state)
    
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
        // console.log('onDidFinishRenderingMapFully', this);
    }

    onRegionIsChanging() {
        // console.log('onRegionIsChanging', this);
    }

    onDidFinishRenderingFrameFully() {
        // console.log('onDidFinishRenderingFrameFully', this);
    }

    async onRegionDidChange() {
        const zoom = await this._map.getZoom();
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
  }
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
        circleOpacity: 0.84,
        circleStrokeWidth: 2,
        circleStrokeColor: colors.bronzetone,
        circleRadius: 10,
        circlePitchAlignment: 'map',
      },
});


const mapStateToProps = state => {
    console.log('MAPSTTE MAP', state)
    return ({
        communes: state.communes.communes,
        list: state.list,
        loading: state.communes.loading,
        error: state.communes.error
    })
}

export default connect(mapStateToProps, { fetchData, communesUpdate, communesCompletion })(Map);