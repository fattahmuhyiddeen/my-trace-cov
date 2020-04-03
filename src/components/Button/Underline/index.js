import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

import Colors from '@utils/colors'

const BUnderline = (props) => {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        textDecorationLine: 'underline'
    }
})

export default BUnderline