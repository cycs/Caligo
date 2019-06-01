import React, { PureComponent  } from 'react'
import { Image, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import colors from './utils/colors'
import Arrow from '../img/arrow-right.svg';
import Cloud from '../img/cloud.svg';

import Svg,{
    Circle,
    Ellipse,
    G,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
} from 'react-native-svg';

export default class SuccessItem extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            viewbox: '0 0 0 0',
            path: ''
        }
    }

    componentDidMount() {
        const viewbox = this.props.svg.viewbox
        const path = this.props.svg.d
        this.setState({ viewbox, path })
    }

    componentWillReceiveProps() {
        const viewbox = this.props.svg.viewbox
        const path = this.props.svg.d
        this.setState({ viewbox, path})
    }

  render() {
    const percent = Math.floor(this.props.item.percentage);
    // let uri = require(`../img/success/success_namur_00.png`)
    let fillPath = 'rgb(230, 230, 230)'
    if(percent >= 100) {
        fillPath = `rgba(255, 203, 81, 1)`
        // uri = require(`../img/success/success_namur_05.png`)
    } else if(percent >=50) {
        fillPath = `rgba(255, 203, 81, .8)`
        // uri = require(`../img/success/success_namur_04.png`)
    } else if(percent >=25) {
        fillPath = `rgba(255, 203, 81, .6)`
        // uri = require(`../img/success/success_namur_03.png`)
    } else if(percent >= 10){
        fillPath = `rgba(255, 203, 81, .4)`
        // uri = require(`../img/success/success_namur_02.png`)
    } else if(percent >= 1){
        fillPath = `rgba(255, 203, 81, .2)`
        // uri = require(`../img/success/success_namur_01.png`)
    }

    return (
        <TouchableOpacity onPress={() => {this.props.openModal()}} style={styles.flatview} id={this.props.item.id}>
            <View style={styles.flatview}>
                {/* <Cloud style={styles.cloud} width={55.5} height={35} fill={colors.sanJuan}/> */}
                {/* <Image
                    style={{width: 64, height: 57, marginBottom: 10}}
                    source={uri}
                /> */}
                <View style={{ width:60, height:60, position: 'relative' }}>
                    <Svg width="100%" height="100%" viewBox='0 0 60 60' style={{position:'absolute'}}>
                        <Circle cx="50%" cy="50%" r="50%" opacity='0.25' fill={percent > 0 ? colors.goldenTainoi : 'rgba(204, 204, 204, .6)'}/>
                    </Svg>
                    <Svg width="90%" height="90%" viewBox={this.state.viewbox}>
                        {/* <Defs>
                            <Mask preserveAspectRatio="none" height='100%' width="100%" id="image-mask">
                                <Path preserveAspectRatio="none" scale="1.2" y='-80%' height='100%' width="100%" fill="white" d="M121,216.47273V0S96,21.47273,76,17.47273s-16-9-34-10c-11.98152-.66564-29,5-33,7A26.48006,26.48006,0,0,0,0,21.6V216.47273Z"/>               
                            </Mask>
                        </Defs> */}
                        <Path d={this.state.path} fill={fillPath} stroke={percent > 0 ? colors.bronzetone : colors.bronzetone20} stroke-width="2"/>
                        {/* <Path preserveAspectRatio="none" height='100%' width="100%" mask="url(#image-mask)" d={this.state.path} fill={colors.goldenTainoi} stroke='none'/> */}
                    </Svg>
                </View>
                <Text>{this.props.item.name}</Text>
                
            </View >
        </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
    titleContainer: {
        width: '80%',
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
    },
    maintitle: {
        fontSize: 60,
        fontFamily: 'Mukta-Bold',     
        color: colors.bronzetone ,

    },
    cloud: {
        position: 'absolute',
        bottom: 24,

    },
    headerContainer: {
        position: 'relative',
        height: 180,
        alignItems: 'center',
        backgroundColor: colors.goldenTainoi
    },
    header: {
        position: 'absolute',
        bottom: 0,
    },
    container: {
      flex: 1,
      position: 'relative'
    },  
    flatview: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      margin: 1,
      borderRadius: 2,
      height: ((Dimensions.get('window').width) * 0.8) / 3,
      display: 'flex',
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
      flexDirection: 'column',
    //   backgroundColor: colors.bronzetone20,
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
    cloud: {

    }
  });