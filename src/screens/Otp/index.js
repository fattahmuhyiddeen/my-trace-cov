import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded, BUnderline } from '@components/Button'
import { TICode } from '@components/TextInput'

const OtpScreen = (props) => {

    const [otpText, setOtpText] = useState('')

    const handleWrongNumber = () => {
        setOtpText('')
        props.onResetNumber()
    }

    const handleResendCode = () => {
        props.onResendCode()
    }

    const handleSendOtp = () => {
        props.onSendOtp(otpText)
    }

    return (
        <SAView avoidingKeyboard={true}>
            <DivView>
                <View style={styles.mainContainer}>
                    <Text style={styles.text1}>Enter OTP</Text>
                    <View style={{ height: 50 }} />
                    <TICode
                        onChangeText={(text) => setOtpText(text)}
                        keyboardType="numeric"
                        editable
                    />
                    <View style={{ height: 30 }} />
                    <BUnderline
                        onPress={handleWrongNumber}
                        text="Wrong phone number?"
                    />
                    {/* <View style={{ height: 50 }} />
                    <Text style={styles.text3}>Your code will expire in 1:57.</Text>
                    <View style={{ height: 20 }} />
                    <BUnderline
                        onPress={handleResendCode}
                        text="Resend Code"
                    /> */}
                </View>
                <BottomView>
                    <BRounded
                        onPress={handleSendOtp}
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

export default OtpScreen
