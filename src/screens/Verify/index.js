import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'

import { SAView, DivView, BottomView } from '@components/Container'
import { BRounded } from '@components/Button'
import { TICode } from '@components/TextInput'

import { uploadScannedDevicesDataPast21Days } from '../../utils/storageHelper';

const VerifyScreen = (props) => {

    const [verCode, setVerCode] = useState([])

    const getVerCode = async () => {
        const uid = auth().currentUser.uid;
        const ref = database().ref(`/users/${uid}`)
        const snapshot = await ref.once('value')
        const data = snapshot.val().verCode.toUpperCase()
        console.log('verCode', data)
        setVerCode(data.split('', 6))
    }

    useEffect(() => {
        // getVerCode()
        // TODO: remove this, testing purpose to verify upload is working
        uploadScannedDevicesDataPast21Days('aoishdioashd');
        return () => {
        }
    }, [])

    return (
        <SAView>
            <DivView>
                <View style={styles.mainContainer}>
                    <View>
                        <Text style={styles.text1}>Upload Data</Text>
                        <View style={{ height: 20 }} />
                        <Text style={styles.text2}>Verify only when officer call you with verification code below.</Text>
                        <View style={{ height: 50 }} />
                        {
                            verCode.length == 0 ? null :
                            <TICode
                                initialValue={verCode}
                                editable={false}
                            />
                        }
                    </View>
                    <View>
                        <Text style={styles.text3}>Do not continue when the verification code given does not match with yours.</Text>
                    </View>
                </View>
                <BottomView>
                    <BRounded
                        onPress={() => { props.navigation.navigate('Pin') }}
                        text="Verify"
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
        justifyContent: 'space-between',
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

export default VerifyScreen
