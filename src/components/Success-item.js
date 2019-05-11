import React, { PureComponent  } from 'react'
import { Image, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import colors from './utils/colors'
import Arrow from '../img/arrow-right.svg';
import Cloud from '../img/cloud.svg';


export default class SuccessItem extends PureComponent {
  render() {
    //   console.log(this.props)
    const percent = Math.floor(this.props.item.percentage);
    let uri = require(`../img/success/success-namur-step_0.png`)

    if(percent >= 100) {
        uri = require(`../img/success/success-namur-step_5.png`)
    } else if(percent >=50) {
        uri = require(`../img/success/success-namur-step_4.png`)
    } else if(percent >=25) {
        uri = require(`../img/success/success-namur-step_3.png`)
    } else if(percent >= 10){
        uri = require(`../img/success/success-namur-step_2.png`)
    } else if(percent >= 1){
        uri = require(`../img/success/success-namur-step_1.png`)
    }

    return (
        <TouchableOpacity onPress={() => {this.props.openModal()}} style={styles.flatview} id={this.props.item.id}>
            <View style={styles.flatview}>
                {/* <Cloud style={styles.cloud} width={55.5} height={35} fill={colors.sanJuan}/> */}
                <Image
                    style={{width: 64, height: 50, marginBottom: 10}}
                    source={uri}
                />
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