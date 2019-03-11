import React, {Component} from 'react';
import { StyleSheet, View, TouchableNativeFeedback} from 'react-native';

export default class PositionButton extends Component {
    constructor(props: Props) {
        super(props);
        

    }
      /* Lifecycle methods
      --------------------------------------------------------- */

      render() {
        let {onPress, isRipple, rippleColor, children, style, disabled} = this.props;

        return (
            <View>
                <View style={styles.view}>
                    <TouchableNativeFeedback
                        disabled={disabled}
                        onPress={onPress}
                        style={styles.button}
                        background={isRipple ? TouchableNativeFeedback.Ripple(rippleColor || "#000000") : null}>
                        <View style={styles.button}>
                            {children}
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
      }

      /* Methods
      --------------------------------------------------------- */

      
}

/* STYLES
---------------------------------------------------------------------------------------------------- */
const styles = StyleSheet.create({
    view: {
        position: 'absolute', 
        bottom: 20, 
        right: 20, 
        borderRadius: 50, 
        overflow: 'hidden'
    },
    button: { 
        width: 50, 
        height: 50, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .05)',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#000'
    }
});