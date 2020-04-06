import React from 'react'
import { SafeAreaView, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'

const SAView = (props) => {
    if (props.avoidingKeyboard) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    {props.children}
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    } else {
        return (
            <SafeAreaView style={styles.container}>
                {props.children}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default SAView