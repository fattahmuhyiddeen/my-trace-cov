import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native'
import { Icon } from 'react-native-elements'
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'

import { SAView } from '@components/Container'
import { BUnderline } from '@components/Button'
import Colors from '@utils/colors'

const onePlusX = 'c0:ee:fb:6c:5e:8e'
const asusX = '18:31:bf:89:f0:05'

const HomeScreen = () => {

    const [bluetoothOn, setBluetoothOn] = useState(false)
    const [locationOn, setLocationOn] = useState(false)
    const [devicesScanned, setDevicesScanned] = useState([])

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("location ALLOWED");
                return true
            } else {
                console.log("location DENIED");
                return false
            }
        } catch (err) {
            console.log(err);
            return false
        }
    }

    const removeSubscription = () => {
        console.log('subscription REMOVE')

    }

    // useEffect(() => {

    //     return () => {
    //         removeSubscription()
    //     }
    // }, [removeSubscription])

    return (
        <SAView>
            <View style={styles.mainContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.text1}>Device Status</Text>
                    <Icon
                        name='ios-refresh'
                        type='ionicon'
                        color='black'
                        size={30}
                        onPress={() => {
                            
                        }}
                    />
                </View>
                <View style={{ height: 50 }} />
                <View style={styles.rowContainer}>
                    <View style={styles.statusContainer}>
                        <View style={styles.imageContainer}>
                            <Icon
                                name='ios-bluetooth'
                                type='ionicon'
                                color='white'
                                size={40}
                            />
                        </View>
                        <View style={{ height: 12 }} />
                        <Text style={styles.text2}>{bluetoothOn ? 'ON' : 'OFF'}</Text>
                    </View>
                    {
                        Platform.OS == 'android' ?
                            <View style={styles.statusContainer}>
                                <View style={styles.imageContainer}>
                                    <Icon
                                        name='ios-pin'
                                        type='ionicon'
                                        color='white'
                                        size={40}
                                    />
                                </View>
                                <View style={{ height: 12 }} />
                                <Text style={styles.text2}>{locationOn ? 'ON' : 'OFF'}</Text>
                            </View>
                            : null
                    }

                </View>
                <View style={{ height: 50 }} />
                <Text style={styles.text3}>Make sure all features are turned on to run this app properly.</Text>
            </View>
        </SAView >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 22,
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusContainer: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    imageContainer: {
        height: 70,
        width: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary
    },
})

export default HomeScreen
