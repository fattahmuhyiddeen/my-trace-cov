import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native'
import { Icon } from 'react-native-elements'
import { BleManager } from 'react-native-ble-plx'
import RNSettings from 'react-native-settings';
import { DeviceEventEmitter } from 'react-native';

import { SAView } from '@components/Container'
import Colors from '@utils/colors'
import BackgroundApp from '../../utils/BackgroundTask';
import AsyncStorage from '@react-native-community/async-storage';

const HomeScreen = () => {
    const [bluetoothOn, setBluetoothOn] = useState(false)
    const [locationOn, setLocationOn] = useState(false)
    const [uniqueContactsNum, setUniqueContactsNum] = useState(0);

    let bleManager
    let subscription

    BackgroundApp.scheduleBackgroundProcessingTask();

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

    const initializeBluetooth = () => {
        console.log('subscription CREATE')
        bleManager = new BleManager()
        subscription = bleManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                console.log('bluetooth ON');
                setBluetoothOn(true)
                if (Platform.OS === 'android') {
                    const permission = requestLocationPermission();
                    if (permission) {
                        console.log("location ALLOWED")
                    }
                    else {
                        console.log("location UNALLOWED")
                        setLocationOn(false)
                    }
                }
                else if (Platform.OS === 'ios') {
                }
            }
            else if (state === 'PoweredOff') {
                console.log('bluetooth OFF')
                setBluetoothOn(false)
            }
            else if (state === 'Unauthorized') {
                console.log('bluetooth UNAUTHORIZED')
                setBluetoothOn(false)
            }
        }, true)
    }

    const updateUniqueContacts = async () => {
        console.log('Update unique contacts');
        const date = (new Date()).toISOString().split('T')[0];
        try {
            const todayContacts = await AsyncStorage.getItem(date);
            if (todayContacts === null) return;
            setUniqueContactsNum(JSON.parse(todayContacts).length); // this is guaranteed to be unique
        } catch (err) {
            console.log(err);
            // setUniqueContactsNum(0); // maybe not overriding if there's existing number
        }
    };

    const removeSubscription = () => {
        console.log('subscription REMOVE');
        bleManager.destroy();
        subscription.remove();
    }

    const resetAll = () => {
        removeSubscription();
        initializeBluetooth();
        updateUniqueContacts();
    }

    const _handleGPSProviderEvent = e => {
        if (e[RNSettings.LOCATION_SETTING] === RNSettings.ENABLED) {
            resetAll()
            setLocationOn(true)
            console.log("location ON")
        }
        else {
            setLocationOn(false)
            console.log("location OFF")
        }
    }

    useEffect(() => {
        if (Platform.OS === 'android') {
            RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => {
                if (result == RNSettings.ENABLED) {
                    setLocationOn(true)
                    console.log("location ON")
                } else {
                    setLocationOn(false)
                    console.log("location OFF")
                }
            })
            DeviceEventEmitter.addListener(
                RNSettings.GPS_PROVIDER_EVENT,
                _handleGPSProviderEvent,
            )
        }
    }, [])

    useEffect(() => {
        initializeBluetooth();
        updateUniqueContacts();
        return () => {
            removeSubscription()
        }
    }, [initializeBluetooth, updateUniqueContacts, removeSubscription])

    return (
        <SAView>
            <View style={styles.mainContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.text1}>Device Status</Text>
                    {/* <Icon
                        name='ios-refresh'
                        type='ionicon'
                        color='black'
                        size={30}
                        onPress={() => {
                            removeSubscription();
                            initializeBluetooth();
                            updateUniqueContacts();
                        }}
                    /> */}
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
                {/* <Text style={styles.text3}>
                    Today unique contacts: {uniqueContactsNum}
                </Text> */}
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
        padding: 4,
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
