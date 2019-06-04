import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableNativeFeedback } from 'react-native'
import FilterSVG from '../img/filter.svg';

import colors from './utils/colors'
import Svg,{
    Circle,
    Path,
} from 'react-native-svg';

export default class Filter extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isModalVisible: false,
        }
    }
    

    /* Lifecycle Methods
    --------------------------------------------------------- */
    componentDidMount() {
        this.setState({isModalVisible: false})
    }
    
    componentWillMount() {
        this.setState({isModalVisible: false})
    }

    render() {
        return (
            <View> 
                <View style={styles.container}>
                    <TouchableNativeFeedback
                        onPress={this.props.onPress}
                        background={TouchableNativeFeedback.Ripple(colors.goldenTainoi || "#000000")}>
                            {/* <FilterSVG height={15} width={15} strokWidth={2} fill='none' /> */}
                            {/* <Text> Filter </Text> */}
                            <View style={styles.button}>
                                <Svg width="30" height="30" viewBox="0 0 42 42">
                                    <Path fill="none" d="M0 0h42v42H0z"/>
                                    <Path fill={colors.bronzetone60} d="M20.973 14.87a5.401 5.401 0 0 1 .192-1.362H5.512a1.362 1.362 0 1 0 0 2.724h15.653a5.401 5.401 0 0 1-.192-1.362z"/>
                                    <Path fill={colors.bronzetone60} d="M21.165 13.508H5.512a1.362 1.362 0 1 0 0 2.724h15.653a4.913 4.913 0 0 1 0-2.724zM36.638 13.508h-4.96a4.912 4.912 0 0 1 0 2.724h4.96a1.362 1.362 0 1 0 0-2.724z"/>
                                    <Path fill={colors.bronzetone60} d="M36.638 13.508h-4.96a4.913 4.913 0 0 1 0 2.724h4.96a1.362 1.362 0 1 0 0-2.724z"/>
                                    <Circle class="c" fill='none' stroke={colors.bronzetone60}  cx="26.422" cy="14.87" r="5.449"/>
                                    <Path fill={colors.bronzetone60} d="M10.075 27.13a5.401 5.401 0 0 1 .193-1.362H5.512a1.362 1.362 0 1 0 0 2.724h4.756a5.401 5.401 0 0 1-.193-1.362z"/>
                                    <Path fill={colors.bronzetone60} d="M10.268 25.768H5.512a1.362 1.362 0 1 0 0 2.724h4.756a4.913 4.913 0 0 1 0-2.724zM36.638 25.768H20.78a4.913 4.913 0 0 1 0 2.724h15.858a1.362 1.362 0 1 0 0-2.724z"/>
                                    <Path fill={colors.bronzetone60} d="M36.638 25.768H20.78a4.913 4.913 0 0 1 0 2.724h15.858a1.362 1.362 0 1 0 0-2.724z"/>
                                    <Circle fill='none' stroke={colors.bronzetone60} cx="15.524" cy="27.13" r="5.449"/>
                                </Svg>
                            </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }




    /* Methods
    --------------------------------------------------------- */

}

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        overflow: 'hidden'
    },
    button: { 
        width: 40, 
        height: 40, 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
})
