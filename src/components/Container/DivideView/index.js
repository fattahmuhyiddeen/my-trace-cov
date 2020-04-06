import React from 'react'
import { StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'

const DivView = (props) => {
    return (
        <KeyboardAvoidingView behavior={Platform.Os == "ios" ? "padding" : "height"} style={styles.container}>
            {props.children}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
})

export default DivView