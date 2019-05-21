import React, { PureComponent  } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import colors from './utils/colors'
import Arrow from '../img/arrow-right.svg';


export default class CompletionItem extends PureComponent {
  render() {
    //   console.log(this.props.item.name)
    const percent = `${this.props.item.percentage.toFixed(2)}%`;
    const newArea = `${Math.round(this.props.item.area / 1000000)} km²`

    return (
        <TouchableOpacity onPress={() => {this.props.goto()}} style={styles.flatview} id={this.props.item.id}>
        <View style={styles.infos}>
          <Text style={styles.name}>{this.props.item.name}</Text>
          <Text style={styles.area}>{newArea}</Text>
        </View>
        <View style={styles.percentContainer}>
          <Text style={styles.percentage}>{percent}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Arrow height={15} width={15} fill={colors.bronzetone}/>
        </View>
      </TouchableOpacity >
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
        paddingBottom: 6
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
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.goldenTainoi
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
    flatview: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 2,
    //   borderBottomWidth: 1,
    //   borderBottomColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
    //   paddingRight: 20,
    //   paddingLeft: 20,
      flexDirection: 'row',
    //   fontFamily: 'Mukta-Regular'
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
      height: 'auto',
      padding:0,
      color: colors.bronzetone,
    },
    arrowContainer: {
        paddingLeft: 25
    },
    percentContainer: {
        // backgroundColor: 'red',
        
        alignItems: 'center',
        alignContent: 'center',
    },
    percentage: {
        color: 'rgba(0, 0, 0, .5)',
    },
    title: {
        fontSize: 30,
        textAlign: 'center'
    }
  });