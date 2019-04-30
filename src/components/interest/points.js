import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import colors from '../utils/colors'
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { point, polygon } from '@turf/helpers';
import pointOnFeature from '@turf/point-on-feature';


export default class Point extends Component {
    constructor(props) {
        super(props)
        // const list = store.getState().communes.communes.features.map((commune, i) => {
        //     console.log(commune);
        //   });
    }

    componentDidMount() {
        // console.log(this.props.municipality);
    }

  render() {
    let shapePoint = point([4.8667, 50.4667]);
    console.log(this.props)

    const listPoints = [];

    // const PoI = this.props.municipalities
    //     .filter(mun => {
    //         if (mun.properties.SHN == "BE421009" || mun.properties.SHN == "BE213002" || mun.properties.SHN == "BE233016") return false;
    //         return true;
    //     })
    //     .map((mun) => {    
    //         // console.log(mun);

    //         const newPolygon = polygon([mun.geometry.coordinates[0]])
    //         const pointsOnPolygon = [];
    //         // console.log(newPolygon);
            
    //         for(let i = 0; i < 3; i++) {
    //             pointsOnPolygon.push(pointOnFeature(newPolygon));
    //         }
            
    //         const newPoints = pointsOnPolygon.map((PoP, index) => {
    //             // console.log(PoP);
    //             const newPoint = point(PoP.geometry.coordinates);
    //             // console.log(newPolygon);

    //             return (
    //                 <Mapbox.ShapeSource
    //                     id='pointOfInterest'
    //                     shape={newPoint}
    //                     key={`${mun.properties.SHN}_${index}`}
    //                 >
    //                     <Mapbox.CircleLayer
    //                         id="pointOfInterest"
    //                         style={styles.singlePoint}
    //                     />
    //                 </Mapbox.ShapeSource>
    //             )
    //         })
    //         console.log(newPoints)
    //         listPoints.push(... newPoints);

    //         // return (
    //         //     <View key={mun.properties.SHN}>{newPoints}</View>
    //         // )
    //     })
    // console.log(listPoints)

    const newPoint1 = point([4.4578500000000005, 50.758892]);
    const newPoint2 = point([3.807111, 50.8641955]);
    const newPoint3 = point([4.4151775, 51.095394]);
    const newPoint4 = point([3.2041190000000004, 50.985628]);
    const newPoint5 = point([4.3073815, 50.796278]);

    return (
        // <View> {listPoints} </View>  
        <View> 
            <Mapbox.ShapeSource
                id='pointOfInterest1'
                shape={newPoint1}
                key={`comm_1`}
            >
                <Mapbox.CircleLayer
                    id="pointOfInterest1"
                    style={styles.singlePoint}
                />
            </Mapbox.ShapeSource>
            <Mapbox.ShapeSource
                id='pointOfInterest2'
                shape={newPoint2}
                key={`comm_2`}
            >
                <Mapbox.CircleLayer
                    id="pointOfInterest2"
                    style={styles.singlePoint}
                />
            </Mapbox.ShapeSource>
            <Mapbox.ShapeSource
                id='pointOfInterest3'
                shape={newPoint3}
                key={`comm_3`}
            >
                <Mapbox.CircleLayer
                    id="pointOfInterest3"
                    style={styles.singlePoint}
                />
            </Mapbox.ShapeSource>
            <Mapbox.ShapeSource
                id='pointOfInterest4'
                shape={newPoint4}
                key={`comm_4`}
            >
                <Mapbox.CircleLayer
                    id="pointOfInterest4"
                    style={styles.singlePoint}
                />
            </Mapbox.ShapeSource>
            <Mapbox.ShapeSource
                id='pointOfInterest5'
                shape={newPoint5}
                key={`comm_5`}
            >
                <Mapbox.CircleLayer
                    id="pointOfInterest5"
                    style={styles.singlePoint}
                />
            </Mapbox.ShapeSource>
        </View>  
    )
  }
}


const styles = Mapbox.StyleSheet.create({
    singlePoint: {
        // circleColor: colors.sanJuan,
        circleColor: 'red',
        // circleOpacity: 0.84,
        circleStrokeWidth: 2,
        circleRadius: 10,
        circlePitchAlignment: 'map',
        // circleBlur: 1
      },
});
