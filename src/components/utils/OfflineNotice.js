import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

const { width } = Dimensions.get('window');


class OfflineNotice extends PureComponent {
    constructor(props){
        super(props)

        _isMounted = false;

        this.state = {
            isConnected: true
        }
    }

    /* Lifecycle Methods
    --------------------------------------------------------- */
    componentDidMount() {
        this._isMounted = true;

        NetInfo.fetch().then(state => {
            const { isConnected } = state

            if(this._isMounted) {
                this.setState({ isConnected })
            }
          })

        NetInfo.addEventListener(state => {
            const { isConnected } = state

            if(this._isMounted) {
                this.setState({ isConnected })
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;

        // NetInfo.removeEventListener(state => {
        //     const { isConnected } = state

        //     this.setState({ isConnected })
        // })


    }

    render() {
        return (
            !this.state.isConnected && <View style={styles.offlineContainer}>
                <Text style={styles.offlineText}>Aucune connexion internet</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 0
  },
  offlineText: { 
    color: '#fff'
  }
})

export default OfflineNotice;