import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Mapbox from '@mapbox/react-native-mapbox-gl';
import colors from './utils/colors'

const Style = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignSelf: "flex-start"
    },
    bubble: {
        flex: 0,
        flexDirection: "row",
        alignSelf: "flex-start",
        backgroundColor: "#ffbbbb",
        padding: 4,
        borderRadius: 4,
        borderColor: "#ffbbbb",
        borderWidth: 1
    },
    count: {
        color: "#fff",
        fontSize: 13
    }
});

const MBStyle = Mapbox.StyleSheet.create({
    singlePoI: {
        visibility: 'visible',
        circleColor: colors.selectiveYellow,
        circleOpacity: 1,
        circleStrokeWidth: 1,
        circleStrokeColor: colors.white,
        circleRadius: 5,
        circlePitchAlignment: 'map',
      },
})

const ClusterMarker = ({ count, key }) => (
    // <View style={Style.container}>
    //     <View style={Style.bubble}>
    //         <Text style={Style.count}>{count}</Text>
    //     </View>
    // </View>
    <Mapbox.CircleLayer
    id={`${key}`}
    style={MBStyle.singlePoI}
    />
);

export default ClusterMarker;