import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'
import Mapbox from '@mapbox/react-native-mapbox-gl';
import colors from './utils/colors'

export default class Municipalities extends PureComponent {
    constructor(props) {
        super(props)
    }
    
    render() {
        return this.props.municipalities.map((commune, i) => {

            return (
                <View key={commune.properties.SHN}>
                    <Mapbox.ShapeSource key={commune.properties.SHN} id={commune.properties.SHN} shape={commune.geometry} tolerance={0}>
                        <Mapbox.FillLayer id={commune.properties.SHN} style={{ fillColor: colors.oldLace, fillOutlineColor: colors.bronzetone }} />
                    </Mapbox.ShapeSource>            
                </View>)
        })

    }
}
