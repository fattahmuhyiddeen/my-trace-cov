import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import auth from '@react-native-firebase/auth'
import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded, BUnderline } from '@components/Button'
import { TICode } from '@components/TextInput'

import { uploadScannedDevicesDataPast21Days } from '../../utils/storageHelper';

const VerifyScreen = (props) => {

    const [confirmResult, setConfirmResult] = useState(null);
    const [otpText, setOtpText] = useState('');

    const handleVerifyCode = () => {
        if (otpText.length === 6) {
            confirmResult
                .confirm(otpText)
                .then((confirmResult) => {
                    console.log(confirmResult);
                    // upload file
                    uploadScannedDevicesDataPast21Days('AIOSHDOIASHDIOASHDOIAHSIOD')
                    .then(res => alert('Success'));``
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    };

    const handleSendCode = () => {
        const user = auth().currentUser;
        console.log({user});
        auth()
            .signInWithPhoneNumber(user.phoneNumber)
            .then(confirmResult => {
                alert('OTP requested');
                console.log(confirmResult);
                setConfirmResult(confirmResult);
            })
            .catch((err) => console.log(err));
    };

    return (
        <SAView>
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
                        onPress={handleSendCode}
                        text="Send OTP"
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
                        onPress={handleVerifyCode}
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

export default VerifyScreen;
