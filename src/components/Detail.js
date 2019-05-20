import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { request } from 'graphql-request'
import colors from './utils/colors'
import geojson2svg, { Renderer } from 'geojson-to-svg';
import { store } from '../components/Store';

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

        // console.log(props)
        // console.log(this)
        this.state = {
            municipality : null,
            path: '',
            markers: null
        }

    }

    componentDidMount() {
        // this.id = props.navigation.state.params.id;
        this.setState({ markers: store.getState().communes.markers })
        
        // console.log(this.props.navigation.state.params.id)
        const query = `
        {
            Municipality(id: "${this.props.navigation.state.params.item.id}") {
                data
            }
        }`
            
            request('https://api.graph.cool/simple/v1/cjtfy59zu7gaj0138jz9a1xon', query)
                .then(data => {
                    const json = JSON.parse(data.Municipality.data)

                    const njson = json.geometry.coordinates[0].map((coord) => {
                        return [Math.trunc(coord[0] * 10000), Math.trunc(coord[1] * 100)]
                    })

                    // console.log(njson)
                    json.geometry.coordinates[0] = njson
                    // console.log(json)

                    const svg = geojson2svg()
                    .styles({ fill: 'black'})
                    .data(json)
                    .render();
                    
                    // console.log(svg)

                    this.setState({
                        path: 'M1.47634 22.87983l.59389.25483L3.682 21.3523l2.54824-1.61176 1.78165-1.10282.93294-1.27412 1.10282-.59388.84942.50894.67882-.84942 2.79953-.59388.84941.08494v.93294l.93294-.84941.16988 1.69882h.50894l.33906 1.95153 1.78165.08494.59388-.4247V21.181l.67882.25482.25483 1.95153 1.78164-.50894 1.61176.76376s2.71459.08494 2.88447.08494 2.37553-.33906 2.37553-.33906l2.54824-1.27412 4.49623 4.24212.93294.67882 2.12354.93294h1.27412l-.25482-1.44188 1.78164-.50894V24.40665l1.61177-1.95153 1.78164-.33905V21.3523l-.6045-1.01788.33906-.33906L44.1502 18.8076l.08494-.76377L48.90125 16.941l.42471-1.10282 2.62964-.93294v-.67882l-.4247-2.29059L53.99136 10.409 51.70078 6.59161l1.95153-.59388s1.52682-.59388 1.61176-.42471a3.916 3.916 0 0 0 .84941.59388L56.70736 4.725l1.27413.33906 1.44188-.93294L60.01725 5.149l-.93294.84942 2.29058 1.10282.93295.84941 2.71458-2.96941V8.45749l.67882-.59388 1.77882-.25554.93294.085-.93294-4.2407L70.0283 1.67067 71.04618 3.6222l1.01789-1.95153L74.1876 3.79421l1.35765.25482V5.90925L74.35748 8.11489l1.18777 1.01788L78.42971 8.369l1.95153 1.52682-.84941.50894-3.39341 1.78165-.16988 1.35764 1.61177 1.52682 2.03576.50894 3.22352 1.01788.67883.76377 1.27412-2.03576 1.18776-3.47835V9.90008l1.61176-3.73247.93293-.16988s.33906.67882.42471.93294a4.8892 4.8892 0 0 0 .42472.76376l.93293 1.10282 1.10282-.67882V9.3069l1.44188 1.52683 1.61176-.93295 1.78165 2.37553L95.56663 14.058 93.361 15.33208l3.73246 3.13858 3.30847.42471V20.762l.93293.76376-1.61176 1.52682 1.35765 2.71459-.16989 1.95153-3.39341 5.175-.93293-.4247L94.461 35.94736a11.601 11.601 0 0 0-2.12353.93294c0 .16917 1.52682 3.05435 1.52682 3.30846s2.20564.42471 2.12353.84942-.84941 1.18776-.84941 1.52682a17.60812 17.60812 0 0 1-.50894 2.03576s-2.29059 1.44188-2.20564 1.69883a17.54821 17.54821 0 0 0 1.27412 1.69883l.25483 1.52682 1.01788-.16988s.93294.84941 1.01789.93294-.84942 3.13858-.84942 3.13858l-2.62964.67882 1.61176 2.88447L94.8 57.245l.33906 1.10283h1.35765l1.86658 2.62964-.50893.59388-.33907 1.27412-1.44258.67882 2.29058 4.75106L96.4118 69.54946 94.376 70.4824H93.18827l-1.78164 2.88447-5.26-4.92023-.42471 1.78164.25483 1.61177 1.01788.76376-2.46047 1.78165.08494 1.86659H86.061l-1.10282 2.12353-1.35764.76377-.085 1.18776-.67882.25483v1.01788s-4.07223.08494-4.15718.33906-.93294 4.92023-.93294 4.92023l-.59388-.33906-.84941.33906-.76376-.59388-2.12354.08494a12.206 12.206 0 0 1-2.37553-.59388c0-.16917.08494-1.52682.08494-1.52682l1.18777-1.69883L70.7864 81.5977l-7.8047-.16988L62.13229 85.585l-2.46047-.25483-.59388.59388-2.71458-.25482-2.37553-.76377H51.69866l-.76377-2.20564-2.20564-.42471-1.86659-3.05435-.84941-4.49623-3.81741-2.03576-2.28917-9.09015-1.01788 1.86871L37.4462 66.90921l-1.61176-.08494.16988 1.27412-1.18776 1.10282H32.44173L31.50879 70.728l-1.35764.25483L28.877 70.389l-.59388.59388H24.80621l.50894-2.62964-1.10282-5.17931S25.40009 56.048 25.82409 56.048a6.37564 6.37564 0 0 1 1.27412.25482l.76377-.76376.08494-2.03577-.76377-.50894L28.625 50.19486H26.9262l-7.97458-12.812-3.98729.59388L11.23187 41.0311l-6.61694-.84941.08494-2.62964-.4247-1.78165L1.05235 32.46618V28.985l.84941-.76377.16988-1.69883-.76518-1.52186-.25482-1.44188Z'
                        // path: 'M324 880l-15-26 102-50-14-18-42 21-46-29 6-19H300l21-58-47-31V645l46-28-52-31 29-16-65-3 51-63L125 420l51-18-34-18-12 9L92 358 49 345l47-38L32 285l5-11-12-5-2-44L2 215l4-28 25-15 38-51 105 32 16-24 65 2 50-52 40 24 29-26 26 12 11-14L588 54l22 18 44-4 72 39 58 17 42-12 14-43L913 2l119 28 149 79-35 35-27 3-2 18-27 4-11 82-18 24 64 37-2 21 182-69 62 6 27-34 157-28 10-30v13l48 23 3 21-15 12 19 15 66-20 18 11 6 1-6 44 49-6 46 39-97 70 98 37-33 22 47 37-32-7-62 52 17 7L1601 664l41 38-52 17-40-6-11 14-27-8-18 16-37-23-34 24-35-59-54 45-20-8-94 37-169-38-34-25-30 34 12 2-37 36-52 61 5 35-20 11 13 32-13 6-56-3 6-17-48-1-51 27-39 46-33-21-67 13L501 899l-54-17Z'
                    })
                    // var testRE = svg.match('(?<=d=")(.*)Z');

                    // const dir_path = RNFS.ExternalDirectoryPath
                    // var path = dir_path + `/${this.props.navigation.state.params.name}.svg`;

                    //     RNFS.writeFile(path, 'hello', 'utf8')
                    //     .then((success) => {
                    //         // console.log(RNFS, 'FILE WRITTEN!');

                    //         // RNFS.scanFile(`${dir_path}/${this.props.navigation.state.params.name}.svg`).then((res) => {
                    //         //     console.log(`${this.props.navigation.state.params.name} SUCCESSFULLY SCANED`)
                    //         // })

                    //         RNFS.readDir(dir_path).then((files) => {
                    //             // console.log(files)
                    //         })   
                    //     })
                    //     .catch((err) => {
                    //         console.log(err.message);
                    //     });


                }
            )
    }

    render() {
        const {height, width} = Dimensions.get('window');
        const ratio = width / 3.333;
        const { navigate } = this.props.navigation;
        const { item } = this.props.navigation.state.params;
        // console.log(this.props, this.props.navigation.state.params.name);

        let filteredMarkers = <Text>Aucun point d'intérêt restant</Text>
        
        if (this.state.markers) {
            filteredMarkers = this.state.markers
                .filter(marker => marker.properties.SHN === this.props.navigation.state.params.item.SHN)
                .map((marker, i) => {
                    return (
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }} key={`marker_${i}`}>
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
        // console.log(filteredMarkers)

        return (
            <View>
                <View style={styles.headerContainer}>
                    <CloudHeader style={styles.header} width={width} height={ratio} bottom={0} fill={colors.white}/>
                    <View style={styles.titleContainer}>
                        {/* <Cloud style={styles.cloud} width={55.5} height={35} fill={colors.oldLace}/> */}
                        {/* <NamurSVG width={200} height={200} bottom={0} fill={colors.bronzetone}/> */}
                        {/* <View style={styles.svgContainer}> */}
                        <Svg width="100" height="100" viewBox="0 0 103 88" style={styles.communeSvg}>
                            <Path d={this.state.path} fill="#472c0e" stroke="#472c0e" stroke-width="2"/>
                        </Svg>
                        {/* </View> */}


                        {/* <SvgUri width="200" height="200" fill={colors.bronzetone} source={require('../img/communes/Namur.svg')} /> */}
                        <Text style={styles.maintitle}>{item.name}</Text>
                    </View>
                </View>
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
                <View style={styles.PoIContent}>
                    <Text style={styles.subtitle}>Points d'intérêt</Text>
                    <View style={styles.PoIData}>  
                        {filteredMarkers}
                    </View>
                </View>
            </View>
        )
    }
}

/* STYLES
---------------------------------------------------------------------------------------------------- */

const styles = StyleSheet.create({
    headerContainer: {
        position: 'relative',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.goldenTainoi,
        // paddingTop: 20
    },
    titleContainer: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        position: 'relative',
        // backgroundColor: 'green',
    },
    svgContainer: {
        backgroundColor: 'red',
    },
    maintitle: {
        fontSize: 48,
        fontFamily: 'Mukta-Bold',     
        color: colors.oldLace,
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 10,
        paddingTop: 10,
        paddingLeft: 50,
        lineHeight: 50,
    },
    communeSvg: {
        position: 'absolute',
        top: -30,
        left: 0
    },

    header: {
        position: 'absolute',
        // left: 0,
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
        marginBottom: 18

    },
    mainData: {
        width: '40%',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        // backgroundColor: 'green'
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
