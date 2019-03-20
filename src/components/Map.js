/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Image} from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
// import {name as appName} from './app.json';
// import communesJSON from './communes-belges.json';
import communesJSON from '../../Communes-belgique.json';
import * as turf from '@turf/turf';
import update from 'immutability-helper';
import { point } from '@turf/helpers';
import PositionButton from './PositionButton';
import CreateCommunes from '../graphql/createCommunes';
import Completion from './Completion';
import TabsNavigator from './tabsNavigator';
import markerMyPosition from '../img/marker.png';
import { connect } from 'react-redux';

import { communesUpdate, communesCompletion, fetchData } from '../actions';

import Queries from './queries';

console.log('ACTIONS', { communesUpdate, communesCompletion })


Mapbox.setAccessToken('pk.eyJ1IjoiY3ljcyIsImEiOiJjanN1anA2OWYwMGZtNGJrN3Y0ejJqOXpiIn0.q5gDP42dUSpQrUY0FyJiuw')

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// console.log("mb", Mapbox);
// console.log(Mapbox.getAccessToken().then((res) => {console.log('res', res)}));
// console.log(Mapbox.StyleURL.Street)
// console.log(communes)

// communesJSON.features.map((com) => {
//     const str = JSON.stringify(com);
//     // console.log(str)
// })

type Props = {};
class Map extends Component<Props> {
    constructor(props: Props) {
        super(props);

        // console.log('PROPS MAP !!!', this.props.communesUpdate());

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

        // this.list = this.getList()




        /* Bindings
        --------------------------------------------------------- */

        this.onRegionDidChange = this.onRegionDidChange.bind(this);
        this.onRegionWillChange = this.onRegionWillChange.bind(this);
        this.flyToCurrentPosition = this.flyToCurrentPosition.bind(this);
    }




    /* Lifecycle methods
    --------------------------------------------------------- */

    componentDidMount() {
        console.log("DID MOUNT");  
        // console.log(this);  

        this.props.fetchData()

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('coords', position.coords)
              this.setState({ 
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp:  position.timestamp
              })
            },
            (error) => { console.log(error) },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 3000 }
          )

          this.watchPosition = navigator.geolocation.watchPosition(
            (lastPosition) => {
                console.log(lastPosition);
              this.setState({lastPosition});
              this.drawCircle(lastPosition);
            },
            (error) => { console.log(error) },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000, distanceFilter: 10}
          );
        
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("componentDidUpdate")
        console.log('prevState', prevState);
    }

    componentWillUnmount() {
        console.log("will unmount")
    }

    
    render() {
        // console.log(this.state)
        // console.log(communesJSON);
        console.log('this.PROOOPS', this.props.loading);
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
            <Mapbox.FillLayer id={commune.properties.SHN} style={mbStyles.communes} />
        </Mapbox.ShapeSource>)
    })

    return (
        <View style={styles.container}>
            {/* <Text style={styles.welcome}>Fogify</Text> */}
            <Text>lat: {this.state.latitude}, lon: {this.state.longitude}</Text>
            <Text>Last Position: [lat : {this.state.lastPosition ? this.state.lastPosition.coords.latitude : ''}, lon: { this.state.lastPosition ? this.state.lastPosition.coords.longitude : '' }]</Text>
            <Queries/>
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
            {/* <Text style={styles.instructions}>To get started, edit App.js</Text> */}
            {/* <Text style={styles.instructions}>{instructions}</Text> */}
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
        console.log(this.state.communes)

        if(this.props.loading) return false; // prevents drawing before list of municipalities has been loaded

        const position = [this.state.lastPosition.coords.longitude, this.state.lastPosition.coords.latitude];

        const center = position;
        const radius = 0.05;
        const options = {steps: 64, units: 'kilometers'};
        let circle = turf.circle(center, radius, options);

        console.log(position)
        const communesShape = await this.props.communes.features.map((commune, i) => {
            const isInPolygon = this.isPositionInPolygon(position, commune)
            this.isGeometryCollection(commune);

            console.log(isInPolygon);
            if(i == 314) {
                console.log('namur', commune)
            }
            // console.log(this.isGC);

            if (isInPolygon) {
                console.log(i)

                console.log(commune.geometry.coordinates)
                // this.unionPolygons(commune.geometry.coordinates[1], circle)

                let coords = commune.geometry.coordinates[0]

                if (commune.geometry.coordinates.length === 2) { // if 2 arrays, then the first is a mask
                    coords = commune.geometry.coordinates[1];
                    const actualMask = turf.polygon([commune.geometry.coordinates[0]]);

                    const intersection = turf.intersect(actualMask, circle);

                    circle = intersection ? this.unionPolygons(actualMask, circle) : this.unionMultiPolygons(actualMask, circle);
                }
                var poly1 = turf.polygon([coords]);
                // var poly2 = turf.polygon([this.state.shape.geometry.coordinates]);
    
                var mask = turf.mask(poly1, circle);
                // console.log('mask', mask)
    
                mask.properties.SHN = commune.properties.SHN
                mask.properties.NAMN = commune.properties.NAMN
    
                commune = mask;
                console.log(this.state)
    
                // this.setState({
                //     communes: update(this.state.communes, {
                //         features: {
                //             [i]: {$set: mask}
                //         }
                //     })
                //   });

                this.props.communesUpdate(mask, i);
                this.props.communesCompletion(mask, i);
            }
        })
    }

    unionPolygons(poly1, poly2) {
        // const union1 = turf.polygon([poly1]);
        // const union2 = turf.polygon([poly2.geometry.coordinates[0]]);
        
        // const circle = poly2.geometry.coordinates;
        const union = turf.union(poly1, poly2);

        return union;
    }

    unionMultiPolygons(poly1, poly2) {
        console.log(poly1, poly2)
        this.bufferDistance =  0.000001 //in kilometers
          
        const pointOnPolygon1 = turf.pointOnFeature(poly1);
        const pointOnPolygon2 = turf.pointOnFeature(poly2);

        const line = [pointOnPolygon1.geometry.coordinates, pointOnPolygon2.geometry.coordinates];
        const linestring = turf.lineString(line);
        const buffered = turf.buffer(linestring, this.bufferDistance); //transform a line into a rectangle

        var union = turf.union(buffered, poly1, poly2);

        return union;
    }

    isPositionInPolygon(position, commune) {
        if (commune.properties.SHN == "BE421009" || commune.properties.SHN == "BE213002" || commune.properties.SHN == "BE233016") return false;

        let polygon = commune.geometry.coordinates.length == 2 ? turf.polygon([commune.geometry.coordinates[1]]) : commune;
        
        const point = turf.point(position);
        const isInMunicipality = turf.booleanPointInPolygon(point, polygon);

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
        // const coordinate = this.state.coordinates[counter];
        // const title = `Longitude: ${this.state.coordinates[counter][0]} Latitude: ${this.state.coordinates[counter][1]}`;
        console.log('POSITION', this.state.lastPosition.coords);
        let shapePoint = turf.point([this.state.lastPosition.coords.longitude, this.state.lastPosition.coords.latitude]);
        return (
        //   <Mapbox.PointAnnotation
        //     key='myposition'
        //     id='myposition'
        //     title='My position'
        //     coordinate={[this.state.lastPosition.coords.longitude, this.state.lastPosition.coords.latitude]}>
    
        //     <Image
        //       source={require('./src/img/marker.png')}
        //       style={{
        //         flex: 1,
        //         resizeMode: 'contain',
        //         width: 25,
        //         height: 25
        //       }}/>
        //   </Mapbox.PointAnnotation>
          <Mapbox.ShapeSource
            id='exampleShapeSource'
            shape={shapePoint}
          >
            {/* <Mapbox.SymbolLayer style={mbStyles.icon}/> */}
            <Mapbox.CircleLayer
              id="singlePoint"
              style={mbStyles.singlePoint}
            />
          </Mapbox.ShapeSource>
        );
    }

    getList() {
        console.log("GET LOST", this.props)
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
        
        // console.log(area, explored, percentage);

        return {
            area,
            explored,
            percentage
        }
    }

    async onPressPathMask() {
        console.log('PATH TO MASK');

        const communesShape = await this.state.communes.features.map((commune, i) => {
            if(commune.properties.NAMN == 'Crisnée'){
                var poly1 = turf.polygon([commune.geometry.coordinates[0]]);
                // var poly2 = turf.polygon([this.state.shape.geometry.coordinates]);

                const line = turf.lineString(this.state.travel);
                const polygon = turf.lineToPolygon(line);

                const multiPolygon = turf.multiPolygon(this.state.travel);
                console.log('multiPolygon', multiPolygon);

                var mask = turf.mask(poly1, multiPolygon);
                // console.log('mask', mask)
    
                mask.properties.SHN = commune.properties.SHN
    
                commune = mask;
                console.log(this.state)
                console.log('mask', mask)
    
                this.setState({
                    communes: update(this.state.communes, {
                        features: {
                            [i]: {$set: mask}
                        }
                    })
                  });
            }
        })
    }
    
    async onPressMaskMap() {
        console.log('MASK THE FREAKING MAP')
        console.log(this.state)
        const communesShape = await communesJSON.features.map((commune, i) => {
            if(commune.properties.NAMN == 'Crisnée'){
                var poly1 = turf.polygon([commune.geometry.coordinates[0]]);
                var poly2 = turf.polygon([this.state.shape.geometry.coordinates]);
    
                var mask = turf.mask(poly1, poly2);
                // console.log('mask', mask)
    
                mask.properties.SHN = commune.properties.SHN
    
                commune = mask;
                console.log(this.state)
    
                this.setState({
                    communes: update(this.state.communes, {
                        features: {
                            [i]: {$set: mask}
                        }
                    })
                  });
            }
        })
    }

    onDidFinishRenderingMapFully() {
        console.log('onDidFinishRenderingMapFully', this);
    }

    onRegionIsChanging() {
        console.log('onRegionIsChanging', this);
    }

    onDidFinishRenderingFrameFully() {
        console.log('onDidFinishRenderingFrameFully', this);
    }

    async onRegionDidChange() {
        await console.log('onRegionDidChange this', this._map);
        const zoom = await this._map.getZoom();
        await console.log('zoom', zoom);

    }

    async onRegionWillChange() {
        await console.log('onRegionWillChange', this._map);
    }
}





/* STYLES
---------------------------------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
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
        fillColor: 'rgba(251, 253, 255, 1)',
        fillOutlineColor: '#000',
      },
      icon: {
        iconImage: '{markerMyPosition}',
        iconSize: 1,
      },
      singlePoint: {
        circleColor: 'hsl(200, 90%, 50%)',
        circleOpacity: 0.84,
        circleStrokeWidth: 2,
        circleStrokeColor: 'white',
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

// console.log({mapStateToProps, communesUpdate, communesCompletion})

// export default connect(mapStateToProps, { communesUpdate, communesCompletion })(Map);
export default connect(mapStateToProps, { fetchData, communesUpdate, communesCompletion })(Map);