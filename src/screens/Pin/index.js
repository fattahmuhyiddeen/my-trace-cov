import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import { uploadScannedDevicesDataPast21Days } from '@utils/storageHelper'

import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded } from '@components/Button'
import { TICode } from '@components/TextInput'

const PinScreen = (props) => {

    const [codeText, setCodeText] = useState('')
    const [pinCode, setPinCode] = useState('')

    const handlePinCode = () => {
        if (codeText === pinCode) {
            uploadScannedDevicesDataPast21Days()
                .then(res => {
                    alert("Log submitted successfully. Thank you for your cooperation.")
                    props.navigation.goBack()
                })
        }
        else {
            alert("Wrong pin. Try again.")
        }
    }

    const getPinCode = async () => {
        const uid = auth().currentUser.uid;
        const ref = database().ref(`/users/${uid}`)
        const snapshot = await ref.once('value')
        const data = snapshot.val().pinCode
        console.log('pinCode', data)
        setPinCode(data.toString())
    }

    useEffect(() => {
        getPinCode()
        return () => {
        }
    }, [])

    return (
        <SAView>
            <DivView>
                <View style={styles.mainContainer}>
                    <Text style={styles.text1}>Enter PIN</Text>
                    <View style={{ height: 20 }} />
                    <Text style={styles.text2}>Officer will provide PIN number to allow log submission.</Text>
                    <View style={{ height: 50 }} />
                    <TICode
                        onChangeText={(text) => setCodeText(text)}
                        editable
                        keyboardType="numeric"
                    />
                </View>
                <BottomView>
                    <BRounded
                        onPress={() => handlePinCode()}
                        text="Submit"
                    />
                </BottomView>
            </DivView>
        </SAView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 22,
    },
    rowContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryNoContainer: {
        width: 50,
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: 5,
    },
    text1: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    text2: {
        fontSize: 20,
    },
    text3: {
        fontSize: 16,
    },
})

export default PinScreen
