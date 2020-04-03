import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

const SAView = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            {props.children}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default SAView