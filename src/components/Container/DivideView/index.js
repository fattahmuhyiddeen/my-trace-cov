import React from 'react'
import { StyleSheet, View } from 'react-native'

const DivView = (props) => {
    return (
        <View style={styles.container}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
})

export default DivView