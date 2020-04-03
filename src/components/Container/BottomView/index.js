import React from 'react'
import { StyleSheet, View } from 'react-native'

const BottomView = (props) => {
    return (
        <View style={styles.container}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
})

export default BottomView