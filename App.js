/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import {name as appName} from './app.json';
// import communesJSON from './communes-belges.json';
import communesJSON from './Communes-belgique.json';
import * as turf from '@turf/turf';
import update from 'immutability-helper';

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

type Props = {};
export default class App extends Component<Props> {
    constructor(props: Props) {
        super(props);



        
        /* State
        --------------------------------------------------------- */
        this.state = {
          active: true,
          communes: communesJSON,
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
            ]
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
    }




    /* Lifecycle methods
    --------------------------------------------------------- */

    componentDidMount() {
        console.log("DID MOUNT");  
        // console.log(this);  

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
            { enableHighAccuracy: true, timeout: 30000 }
          )

          this.watchPosition = navigator.geolocation.watchPosition(
            (lastPosition) => {
                console.log(lastPosition);
              this.setState({lastPosition});
            },
            (error) => { console.log(error) },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1}
          );
        
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("componentDidUpdate")
        console.log('prevState', prevState);

        console.log('this',     );

      
    }

    componentWillUnmount() {
        console.log("will unmount")
    }

    
    render() {
        console.log(this.state)
    console.log(communesJSON);
    console.log('this', turf);

    const communesShape = this.state.communes.features.map((commune, i) => {
        return (
        <Mapbox.ShapeSource key={commune.properties.SHN} id={commune.properties.SHN} shape={commune.geometry} tolerance={this.shapeSourceParams.tolerance}>
                <Mapbox.FillLayer id={commune.properties.SHN} style={mbStyles.communes} />
        </Mapbox.ShapeSource>)
    })

    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>Fogify</Text>
        <Text>lat: {this.state.latitude}, lon: {this.state.longitude}</Text>
        <Text>Last Position: [lat : {this.state.lastPosition ? this.state.lastPosition.coords.latitude : ''}, lon: { this.state.lastPosition ? this.state.lastPosition.coords.longitude : '' }]</Text>
        <Button
            onPress={this.onPressMaskMap.bind(this)}
            title="Mask Map"
            color="#441584"
        />
        <Button
            onPress={this.onPressPathMask.bind(this)}
            title="Path to polygon to mask"
            color="#941584"
        />
        {/* <Text style={styles.instructions}>To get started, edit App.js</Text> */}
        {/* <Text style={styles.instructions}>{instructions}</Text> */}
        <Mapbox.MapView 
            ref={(c)=> this._map = c}
            styleURL={Mapbox.StyleURL.Dark} 
            zoomLevel={12} 
            centerCoordinate={[5.3954002323, 50.7111308907]} 
            style={styles.container}
            logoEnabled={false}
            rotateEnabled={false}
            onDidFinishRenderingMapFully={() => this.onDidFinishRenderingMapFully()}
            onRegionIsChanging={this.onRegionIsChanging}
            onRegionDidChange={this.onRegionDidChange}
            onRegionWillChange={this.onRegionWillChange}
        >
            {communesShape}
        </Mapbox.MapView>
        </View>
    );
    }




    /* Methods
    --------------------------------------------------------- */

    async onPressPathMask() {
        console.log('PATH TO MASK');

        const communesShape = await communesJSON.features.map((commune, i) => {
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   }
});

const mbStyles = Mapbox.StyleSheet.create({
    communes: {
        // fillAntialias: false,
        fillColor: 'rgba(40, 65, 90, 1)',
        fillOutlineColor: '#fff',
      }
});
