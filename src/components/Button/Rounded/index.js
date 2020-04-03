import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

import Colors from '@utils/colors'

const BRounded = (props) => {
    return (
        <TouchableOpacity
            style={[styles.container, styles.shadow]}
            onPress={props.onPress}
            activeOpacity={0.8}
        >
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 13,
        paddingHorizontal: 22,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        alignItems: 'center',
    },
    shadow: {
        elevation: 4,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    text: {
        color: 'white',
        fontSize: 20,
    }
})

export default BRounded