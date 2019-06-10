import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { request } from 'graphql-request'
import colors from './utils/colors'
import geojson2svg, { Renderer } from 'geojson-to-svg';
import { store } from '../components/Store';

import communesSVG from '../communes-svg.json'

import CloudHeader from '../img/header-completion.svg';
import Cloud from '../img/cloud.svg';

import SvgUri from 'react-native-svg-uri';
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
    Image,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
} from 'react-native-svg';
import RNFS from 'react-native-fs'
import NamurSVG from '../img/communes/Namur.svg';


export default class Detail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null
      };
    }
    
    constructor(props) {
        super(props)

        this.state = {
            municipality : null,
            viewbox: '0 0 0 0',
            path: '',
            points: '',
            markers: null
        }

    }

    componentDidMount() {

        if(communesSVG[this.props.navigation.state.params.item.SHN]) {
            const commune = communesSVG[this.props.navigation.state.params.item.SHN]
            const viewbox = commune.viewbox

            const path = commune.d
            this.setState({ viewbox, path })
        } else {
            const commune = communesSVG['BE392094']
            const viewbox = commune.viewbox

            const path = commune.d
            this.setState({ viewbox, path })
        }

        this.setState({ markers: store.getState().communes.markers })        
    }

    render() {
        const {height, width} = Dimensions.get('window');
        const ratio = width / 3.333;
        const { navigate } = this.props.navigation;
        const { item } = this.props.navigation.state.params;

        let filteredMarkers = <Text>Aucun point d'intérêt restant</Text>
        
        if (this.state.markers) {
            filteredMarkers = this.state.markers
                .filter(marker => marker.properties.SHN === this.props.navigation.state.params.item.SHN)
                .map((marker, i) => {
                    return (
                        <View style={{ marginBottom:18, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }} key={`marker_${i}`}>
                            <View style={{alignItems:'center', justifyContent:'center'}}>  
                                <Text style={{fontSize: 20, color:colors.bronzetone, fontFamily:'Mukta-Bold'}}>#{i+1}</Text>
                            </View>  
                            <View>  
                                <Text style={styles.dataText}>{marker.properties.bonus.name}</Text>
                                <Text style={styles.extensionText}>effet</Text>
                            </View>
                            <View>
                                <Text style={styles.dataText}>{marker.properties.bonus.duration}</Text>
                                <Text style={styles.extensionText}>jours</Text>
                            </View>
                        </View>
                    )
                })
        }

        return (
            <View style={styles.detailContainer}>
                <View style={styles.headerContainer}>
                    <Svg width="160" height="160" viewBox={this.state.viewbox} style={styles.communeSvg}>
                            <Path d={this.state.path} fill="none" stroke={colors.bronzetone} stroke-width="2"/>
                    </Svg>
                    <View style={styles.titleContainer}>

                        <Text style={styles.maintitle}>{item.name}</Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={styles.mainContent}>
                        <View style={styles.mainData}>
                            <Text style={styles.subtitle}>Infos</Text>
                            <View>
                                <Text style={styles.dataText}>110k</Text>
                                <Text style={styles.extensionText}>habs</Text>
                            </View>
                            <View>
                                <Text style={styles.dataText}>Namur</Text>
                                <Text style={styles.extensionText}>province</Text>
                            </View>
                            
                        </View>
                        <View style={styles.mainData}>
                            <Text style={styles.subtitle}>Exploré</Text>
                            <View>
                                <Text style={styles.dataText}>{((item.area*item.percentage/100) / 1000000).toFixed(3)}</Text>
                                <Text style={styles.extensionText}>km²</Text>
                            </View>
                            <View>
                                <Text style={styles.dataText}>{item.percentage.toFixed(2)}</Text>
                                <Text style={styles.extensionText}>%</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{marginVertical: 18, justifyContent:'center', alignItems:'center'}}>  
                        <Svg width="80" height="80" viewBox={this.state.viewbox}>
                            <Path d={this.state.path} fill={colors.bronzetone} stroke='none' stroke-width="0"/>
                        </Svg>
                    </View>
                    <View style={styles.PoIContent}>
                        <Text style={styles.subtitle}>Points d'intérêt</Text>
                        <View style={styles.PoIData}>  
                            {filteredMarkers}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

/* STYLES
---------------------------------------------------------------------------------------------------- */

const styles = StyleSheet.create({
    detailContainer: {
        backgroundColor: colors.oldLace,
        flexDirection: 'column',
        flex: 1

    },
    headerContainer: {
        position: 'relative',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
    },
    maintitle: {
        fontSize: 48,
        fontFamily: 'Mukta-Bold',     
        color: colors.bronzetone,
        paddingTop: 10,
        lineHeight: 50,
    },
    communeSvg: {
        position: 'absolute',
        top: -40,
        right: -40,
    },

    header: {
        position: 'absolute',
        bottom: 0,
    },
    container: {
      flex: 1,
      position: 'relative'
    },
    mainContent: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
        flex: 1

    },
    mainData: {
        width: '40%',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    PoIData: {
        width: '100%',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    PoIContent: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    subtitle: {
        fontFamily: 'Mukta-Bold',
        fontSize: 30,
        color: colors.bronzetone,
        width: '100%',
        flex: 0
    },
    dataText: {
        fontFamily: 'Mukta-Medium',
        fontSize: 18,
        lineHeight: 26,
        color: colors.bronzetone,
        marginRight: 10

    },
    dataTextSmall: {
        fontFamily: 'Mukta-Medium',
        fontSize: 10,
        lineHeight: 26,
        color: colors.bronzetone,
    },
    extensionText: {
        fontFamily: 'Mukta-Light',
        fontSize: 14,
        lineHeight: 20,
        color: colors.bronzetone60
    }, 
  });
